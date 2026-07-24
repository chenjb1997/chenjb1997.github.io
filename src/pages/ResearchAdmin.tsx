import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Download,
  FolderKanban,
  Loader2,
  LockKeyhole,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  getAdminSession,
  isSupabaseConfigured,
  loadAdminVault,
  loadPublicVaultPayload,
  onAuthStateChange,
  ResearchVaultConflictError,
  saveAdminVault,
  signInAdmin,
  signOutAdmin,
  type VaultSnapshot,
  updateAdminPassword,
} from "../features/research/repository";
import type {
  AuthorRole,
  VaultData,
  VaultGroup,
  VaultProject,
} from "../features/research/types";
import {
  decryptVaultData,
  encryptVaultData,
} from "../features/research/vaultCrypto";

type AuthState =
  | "checking"
  | "signed-out"
  | "password-setup"
  | "signed-in";
type PasswordSetupReason = "invite" | "recovery" | "callback";
type VaultState = "idle" | "loading" | "locked" | "ready" | "error";
type AdminView = "projects" | "people";

type AuthCallbackDetails = {
  reason: PasswordSetupReason | null;
  error: string;
};

const authorRoles: Array<{ value: AuthorRole; label: string }> = [
  { value: "first", label: "一作" },
  { value: "corresponding", label: "通讯" },
  { value: "other", label: "其他" },
];

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const readAuthCallbackDetails = (): AuthCallbackDetails => {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, ""),
  );
  const getParam = (name: string) =>
    hashParams.get(name) ?? searchParams.get(name);
  const callbackError = getParam("error_description") ?? getParam("error");

  if (callbackError) {
    return {
      reason: null,
      error: `邀请或重设密码链接无法使用：${callbackError}`,
    };
  }

  const type = getParam("type");
  if (type === "invite") {
    return { reason: "invite", error: "" };
  }
  if (type === "recovery") {
    return { reason: "recovery", error: "" };
  }

  const hasAuthCode =
    searchParams.has("code") ||
    searchParams.has("token_hash") ||
    hashParams.has("access_token");

  return {
    reason: hasAuthCode ? "callback" : null,
    error: "",
  };
};

const clearAuthCallbackFromUrl = () => {
  const url = new URL(window.location.href);
  const callbackParamNames = [
    "code",
    "token_hash",
    "type",
    "error",
    "error_code",
    "error_description",
  ];
  callbackParamNames.forEach((name) => url.searchParams.delete(name));

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  const hasAuthHash = [
    "access_token",
    "refresh_token",
    "expires_at",
    "expires_in",
    "token_type",
    "type",
    "error",
    "error_code",
    "error_description",
  ].some((name) => hashParams.has(name));
  if (hasAuthHash) {
    url.hash = "";
  }

  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
};

const downloadJson = (filename: string, value: unknown) => {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const validateVaultData = (data: VaultData) => {
  const personIds = new Set<string>();
  const projectIds = new Set<string>();
  const groupIds = new Set<string>();

  if (!data.updatedAt.trim()) {
    throw new Error("请填写更新日期。");
  }

  data.people.forEach((person) => {
    if (!person.id.trim() || !person.name.trim()) {
      throw new Error("每位参与人都需要姓名和 ID。");
    }
    if (personIds.has(person.id)) {
      throw new Error(`参与人 ID 重复：${person.id}`);
    }
    personIds.add(person.id);
  });

  data.groups.forEach((group) => {
    if (!group.id.trim() || !group.title.trim()) {
      throw new Error("每个分组都需要名称和 ID。");
    }
    if (groupIds.has(group.id)) {
      throw new Error(`分组 ID 重复：${group.id}`);
    }
    groupIds.add(group.id);

    group.projects.forEach((project) => {
      if (
        !project.id.trim() ||
        !project.title.trim() ||
        !project.status.trim() ||
        !project.route.trim()
      ) {
        throw new Error(`分组“${group.title}”中有项目缺少标题、状态或备注。`);
      }
      if (projectIds.has(project.id)) {
        throw new Error(`项目 ID 重复：${project.id}`);
      }
      projectIds.add(project.id);
      const missingMember = project.members.find((id) => !personIds.has(id));
      if (missingMember) {
        throw new Error(`项目“${project.title}”引用了不存在的参与人：${missingMember}`);
      }
    });
  });
};

const ResearchAdmin = () => {
  const isLocalPreview =
    !isSupabaseConfigured &&
    new URLSearchParams(window.location.search).get("preview") === "1";
  const [authCallbackDetails] = useState(readAuthCallbackDetails);
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [adminEmail, setAdminEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState(authCallbackDetails.error);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [passwordSetupReason, setPasswordSetupReason] =
    useState<PasswordSetupReason | null>(authCallbackDetails.reason);
  const passwordSetupRequiredRef = useRef(
    authCallbackDetails.reason !== null,
  );
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSetupComplete, setPasswordSetupComplete] = useState(false);

  const [vaultState, setVaultState] = useState<VaultState>("idle");
  const [snapshot, setSnapshot] = useState<VaultSnapshot | null>(null);
  const [vaultPasswordInput, setVaultPasswordInput] = useState("");
  const [vaultPassword, setVaultPassword] = useState("");
  const [vaultError, setVaultError] = useState("");
  const [draft, setDraft] = useState<VaultData | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [view, setView] = useState<AdminView>("projects");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (isLocalPreview) {
      setAdminEmail("本地预览");
      setAuthState("signed-in");
      return;
    }

    if (!isSupabaseConfigured) {
      setAuthState("signed-out");
      return;
    }

    let active = true;
    const applySession = (
      session: Awaited<ReturnType<typeof getAdminSession>>,
      event?: string,
    ) => {
      if (!active) return;
      setAdminEmail(session?.user.email ?? "");
      if (event === "PASSWORD_RECOVERY") {
        passwordSetupRequiredRef.current = true;
        setPasswordSetupReason("recovery");
      }
      if (session && passwordSetupRequiredRef.current) {
        clearAuthCallbackFromUrl();
      }
      setAuthState(
        session
          ? passwordSetupRequiredRef.current
            ? "password-setup"
            : "signed-in"
          : "signed-out",
      );
      if (!session) {
        setVaultState("idle");
        setSnapshot(null);
        setDraft(null);
        setVaultPassword("");
        setIsDirty(false);
      }
    };

    const unsubscribe = onAuthStateChange((session, event) => {
      applySession(session, event);
    });

    getAdminSession()
      .then((session) => {
        applySession(session);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuthError(error instanceof Error ? error.message : "无法检查登录状态。");
        setAuthState("signed-out");
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [isLocalPreview]);

  useEffect(() => {
    if (authState !== "signed-in") {
      return;
    }

    let active = true;
    setVaultState("loading");
    setVaultError("");
    const loadVault = isLocalPreview ? loadPublicVaultPayload : loadAdminVault;
    loadVault()
      .then((loaded) => {
        if (!active) return;
        setSnapshot(loaded);
        setVaultState("locked");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setVaultError(
          error instanceof Error ? error.message : "无法读取在线 Research 数据。",
        );
        setVaultState("error");
      });

    return () => {
      active = false;
    };
  }, [authState, isLocalPreview]);

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const message = "仍有未保存的修改，确定离开这个页面吗？";
    const warnBeforeInternalNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.download) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const warnBeforeHistoryNavigation = () => {
      if (!window.confirm(message)) {
        window.history.forward();
      }
    };

    document.addEventListener("click", warnBeforeInternalNavigation, true);
    window.addEventListener("popstate", warnBeforeHistoryNavigation);
    return () => {
      document.removeEventListener("click", warnBeforeInternalNavigation, true);
      window.removeEventListener("popstate", warnBeforeHistoryNavigation);
    };
  }, [isDirty]);

  const selectedProject = useMemo(() => {
    if (!draft || !selectedProjectId) return null;
    for (const group of draft.groups) {
      const project = group.projects.find((item) => item.id === selectedProjectId);
      if (project) return { group, project };
    }
    return null;
  }, [draft, selectedProjectId]);

  const mutateDraft = (mutator: (next: VaultData) => void) => {
    if (isSaving) return;
    setDraft((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      mutator(next);
      return next;
    });
    setIsDirty(true);
    setSaveNotice("");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningIn(true);
    setAuthError("");
    try {
      const session = await signInAdmin(loginEmail, loginPassword);
      setAdminEmail(session.user.email ?? loginEmail.trim());
      setLoginPassword("");
      setAuthState("signed-in");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "登录失败，请重试。");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    if (newPassword.length < 8) {
      setAuthError("新密码至少需要 8 个字符。");
      return;
    }
    if (newPassword !== newPasswordConfirmation) {
      setAuthError("两次输入的密码不一致。");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateAdminPassword(newPassword);
      setNewPassword("");
      setNewPasswordConfirmation("");
      setPasswordSetupComplete(true);
      clearAuthCallbackFromUrl();
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "密码设置失败，请重新打开邀请链接后重试。",
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCancelPasswordSetup = async () => {
    setAuthError("");
    try {
      passwordSetupRequiredRef.current = false;
      setPasswordSetupReason(null);
      setPasswordSetupComplete(false);
      clearAuthCallbackFromUrl();
      await signOutAdmin();
      setAuthState("signed-out");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "退出登录失败，请重试。");
    }
  };

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!snapshot || !vaultPasswordInput.trim()) return;
    setIsUnlocking(true);
    setVaultError("");
    try {
      const decrypted = await decryptVaultData(snapshot.payload, vaultPasswordInput);
      validateVaultData(decrypted);
      setDraft(decrypted);
      setVaultPassword(vaultPasswordInput);
      setVaultPasswordInput("");
      setSelectedProjectId(decrypted.groups[0]?.projects[0]?.id ?? null);
      setVaultState("ready");
      setIsDirty(false);
    } catch {
      setVaultError("Research 密码不正确，或在线密文已损坏。");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleReload = async () => {
    if (isSaving) return;
    if (isDirty && !window.confirm("重新载入会丢失尚未保存的修改，继续吗？")) return;
    setVaultError("");
    setSaveNotice("");
    setVaultState("loading");
    try {
      const loaded = await (isLocalPreview
        ? loadPublicVaultPayload()
        : loadAdminVault());
      setSnapshot(loaded);
      if (vaultPassword) {
        const decrypted = await decryptVaultData(loaded.payload, vaultPassword);
        validateVaultData(decrypted);
        setDraft(decrypted);
        setSelectedProjectId(decrypted.groups[0]?.projects[0]?.id ?? null);
        setVaultState("ready");
      } else {
        setDraft(null);
        setVaultState("locked");
      }
      setIsDirty(false);
    } catch (error) {
      setVaultError(error instanceof Error ? error.message : "重新载入失败。");
      setVaultState("error");
    }
  };

  const handleSave = async () => {
    if (!draft || !snapshot || !vaultPassword || isLocalPreview) return;
    if (snapshot.revision === null) return;
    setIsSaving(true);
    setVaultError("");
    setSaveNotice("");
    try {
      const next = structuredClone(draft);
      next.updatedAt = today();
      validateVaultData(next);
      const encrypted = await encryptVaultData(next, vaultPassword);
      const saved = await saveAdminVault(encrypted, snapshot.revision);
      setDraft(next);
      setSnapshot(saved);
      setIsDirty(false);
      setSaveNotice(`已在线保存 · 版本 ${saved.revision}`);
    } catch (error) {
      if (error instanceof ResearchVaultConflictError) {
        setVaultError("检测到其他窗口刚刚保存了新版本。请先导出草稿，再重新载入合并。");
      } else {
        setVaultError(error instanceof Error ? error.message : "保存失败，请重试。");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportEncryptedDraft = async () => {
    if (!draft || !vaultPassword || isSaving) return;
    setVaultError("");
    try {
      const currentDraft = structuredClone(draft);
      validateVaultData(currentDraft);
      const encrypted = await encryptVaultData(currentDraft, vaultPassword);
      downloadJson(`research-draft-encrypted-${today()}.json`, encrypted);
    } catch (error) {
      setVaultError(error instanceof Error ? error.message : "加密草稿导出失败。请检查内容后重试。");
    }
  };

  const handleSignOut = async () => {
    if (isSaving) return;
    if (isDirty && !window.confirm("仍有未保存修改，确定退出吗？")) return;
    setVaultError("");
    try {
      await signOutAdmin();
    } catch (error) {
      setVaultError(error instanceof Error ? error.message : "退出登录失败，请重试。");
    }
  };

  const updateGroup = (groupId: string, patch: Partial<VaultGroup>) => {
    mutateDraft((next) => {
      const group = next.groups.find((item) => item.id === groupId);
      if (group) Object.assign(group, patch);
    });
  };

  const updateProject = (groupId: string, projectId: string, patch: Partial<VaultProject>) => {
    mutateDraft((next) => {
      const project = next.groups
        .find((group) => group.id === groupId)
        ?.projects.find((item) => item.id === projectId);
      if (project) Object.assign(project, patch);
    });
  };

  const moveGroup = (index: number, direction: -1 | 1) => {
    mutateDraft((next) => {
      const target = index + direction;
      if (target < 0 || target >= next.groups.length) return;
      [next.groups[index], next.groups[target]] = [next.groups[target], next.groups[index]];
    });
  };

  const moveProject = (groupId: string, index: number, direction: -1 | 1) => {
    mutateDraft((next) => {
      const projects = next.groups.find((group) => group.id === groupId)?.projects;
      if (!projects) return;
      const target = index + direction;
      if (target < 0 || target >= projects.length) return;
      [projects[index], projects[target]] = [projects[target], projects[index]];
    });
  };

  const moveProjectToGroup = (projectId: string, fromGroupId: string, toGroupId: string) => {
    if (fromGroupId === toGroupId) return;
    mutateDraft((next) => {
      const from = next.groups.find((group) => group.id === fromGroupId);
      const to = next.groups.find((group) => group.id === toGroupId);
      const index = from?.projects.findIndex((project) => project.id === projectId) ?? -1;
      if (!from || !to || index < 0) return;
      const [project] = from.projects.splice(index, 1);
      to.projects.push(project);
    });
  };

  if (!isSupabaseConfigured && !isLocalPreview) {
    return (
      <div className="mx-auto max-w-2xl">
        <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <AlertCircle className="h-6 w-6" />
          <h1 className="mt-4 text-2xl font-bold">在线管理尚未连接</h1>
          <p className="mt-3 text-sm leading-6">
            页面代码已经就绪。请配置 Supabase Project URL 和 Publishable key 后重新构建；公开 Research 页面在此期间仍会读取原来的加密文件。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="inline-flex h-10 items-center gap-2 rounded bg-amber-950 px-4 text-sm font-bold text-white" to="/research/admin?preview=1">
              先预览编辑器
            </Link>
            <Link className="inline-flex h-10 items-center gap-2 px-1 text-sm font-bold underline" to="/research">
              <ArrowLeft className="h-4 w-4" /> 返回 Research
            </Link>
          </div>
          <p className="mt-4 text-xs leading-5 text-amber-800">预览会读取现有加密文件，输入原 Research 密码后即可试用；不会写入线上数据。</p>
        </section>
      </div>
    );
  }

  if (authState === "checking") {
    return (
      <div className="mx-auto flex min-h-[55vh] items-center justify-center text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 正在检查管理员登录状态...
      </div>
    );
  }

  if (authState === "password-setup") {
    if (passwordSetupComplete) {
      return (
        <div className="mx-auto flex min-h-[58vh] max-w-lg items-center justify-center">
          <section className="w-full rounded border border-emerald-200 bg-white p-6 shadow-sm">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Research Admin</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">管理员密码已设置</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {adminEmail ? `${adminEmail} 的` : "你的"}管理员账户已经可以使用。接下来还需要输入原有的 Research 访问密码，才能解密和编辑内容。
            </p>
            <button
              type="button"
              onClick={() => {
                passwordSetupRequiredRef.current = false;
                setPasswordSetupReason(null);
                setPasswordSetupComplete(false);
                setAuthState("signed-in");
              }}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded bg-slate-900 px-4 text-sm font-bold text-white"
            >
              继续进入 Research 管理
            </button>
          </section>
        </div>
      );
    }

    return (
      <div className="mx-auto flex min-h-[58vh] max-w-lg items-center justify-center">
        <section className="w-full rounded border border-slate-200 bg-white p-6 shadow-sm">
          <LockKeyhole className="h-8 w-8 text-slate-700" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Research Admin</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">
            {passwordSetupReason === "recovery" ? "重设管理员密码" : "设置管理员密码"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {passwordSetupReason === "recovery"
              ? "重设链接已经验证。请为管理员账户设置一个新密码。"
              : "邀请链接已经验证。请先为管理员账户设置密码；以后将使用邮箱和这个密码登录。"}
          </p>
          {adminEmail ? (
            <p className="mt-3 rounded bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {adminEmail}
            </p>
          ) : null}
          <form onSubmit={handleSetPassword} className="mt-6 space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              新密码
              <input
                autoFocus
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="mt-2 h-11 w-full rounded border border-slate-200 bg-slate-50 px-3 font-normal outline-none focus:border-slate-400 focus:bg-white"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              再输入一次
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={newPasswordConfirmation}
                onChange={(event) => setNewPasswordConfirmation(event.target.value)}
                className="mt-2 h-11 w-full rounded border border-slate-200 bg-slate-50 px-3 font-normal outline-none focus:border-slate-400 focus:bg-white"
              />
            </label>
            <p className="text-xs leading-5 text-slate-500">至少 8 个字符。这个管理员密码与 Research 内容访问密码是两套不同的密码。</p>
            {authError ? <p className="text-sm font-semibold text-red-700">{authError}</p> : null}
            <button
              disabled={isUpdatingPassword}
              className="inline-flex h-11 w-full items-center justify-center rounded bg-slate-900 px-4 text-sm font-bold text-white disabled:bg-slate-300"
            >
              {isUpdatingPassword ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 保存密码中...</>
              ) : (
                "保存管理员密码"
              )}
            </button>
          </form>
          <button
            type="button"
            onClick={() => void handleCancelPasswordSetup()}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" /> 退出，改用其他账户
          </button>
        </section>
      </div>
    );
  }

  if (authState === "signed-out") {
    return (
      <div className="mx-auto flex min-h-[58vh] max-w-lg items-center justify-center">
        <section className="w-full rounded border border-slate-200 bg-white p-6 shadow-sm">
          <LockKeyhole className="h-8 w-8 text-slate-700" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Research Admin</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">在线管理</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">先使用 Supabase 管理员账号登录。Research 密码会在下一步单独输入。</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              邮箱
              <input type="email" autoComplete="username" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} className="mt-2 h-11 w-full rounded border border-slate-200 bg-slate-50 px-3 font-normal outline-none focus:border-slate-400 focus:bg-white" />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              管理员密码
              <input type="password" autoComplete="current-password" required value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} className="mt-2 h-11 w-full rounded border border-slate-200 bg-slate-50 px-3 font-normal outline-none focus:border-slate-400 focus:bg-white" />
            </label>
            {authError ? <p className="text-sm font-semibold text-red-700">{authError}</p> : null}
            <button disabled={isSigningIn} className="inline-flex h-11 w-full items-center justify-center rounded bg-slate-900 px-4 text-sm font-bold text-white disabled:bg-slate-300">
              {isSigningIn ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 登录中...</> : "登录"}
            </button>
          </form>
          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900" to="/research"><ArrowLeft className="h-4 w-4" /> 返回只读页面</Link>
        </section>
      </div>
    );
  }

  if (vaultState === "loading" || vaultState === "idle") {
    return (
      <div className="mx-auto flex min-h-[55vh] items-center justify-center text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 正在读取在线密文...
      </div>
    );
  }

  if (vaultState === "locked" && snapshot) {
    return (
      <div className="mx-auto flex min-h-[58vh] max-w-lg items-center justify-center">
        <section className="w-full rounded border border-slate-200 bg-white p-6 shadow-sm">
          <LockKeyhole className="h-8 w-8 text-slate-700" />
          <h1 className="mt-4 text-2xl font-bold text-slate-950">解锁 Research 数据</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{isLocalPreview ? "现有加密文件已载入。请输入 Research 访问密码进入本地预览；所有修改只留在当前标签页。" : "密文已从 Supabase 载入。请输入现有 Research 访问密码；密码只在这个浏览器标签页中使用。"}</p>
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <input autoFocus type="password" value={vaultPasswordInput} onChange={(event) => setVaultPasswordInput(event.target.value)} placeholder="Research 访问密码" className="h-11 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
            {vaultError ? <p className="text-sm font-semibold text-red-700">{vaultError}</p> : null}
            <button disabled={!vaultPasswordInput.trim() || isUnlocking} className="inline-flex h-11 w-full items-center justify-center rounded bg-slate-900 px-4 text-sm font-bold text-white disabled:bg-slate-300">
              {isUnlocking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 解锁中...</> : "解锁并编辑"}
            </button>
          </form>
        </section>
      </div>
    );
  }

  if (vaultState === "error" || !draft || !snapshot) {
    return (
      <div className="mx-auto max-w-2xl rounded border border-red-200 bg-red-50 p-6 text-red-900">
        <AlertCircle className="h-6 w-6" />
        <h1 className="mt-3 text-xl font-bold">管理数据加载失败</h1>
        <p className="mt-2 text-sm leading-6">{vaultError || "没有可编辑的数据。"}</p>
        <button type="button" onClick={() => void handleReload()} className="mt-5 inline-flex h-10 items-center gap-2 rounded border border-red-300 bg-white px-4 text-sm font-bold"><RefreshCw className="h-4 w-4" /> 重试</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <fieldset disabled={isSaving} className="min-w-0 space-y-5 border-0 p-0">
      <header className="rounded border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400"><LockKeyhole className="h-4 w-4" /> Research Admin</div>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">在线编辑 Research</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">{adminEmail} · {isLocalPreview ? "本地预览（不会写入线上）" : `在线版本 ${snapshot.revision}`}{isDirty ? " · 有未保存修改" : ""}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void handleExportEncryptedDraft()} className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:border-slate-300"><Download className="h-4 w-4" /> 加密草稿</button>
            <button type="button" onClick={() => { if (window.confirm("明文备份包含所有 Research 内容，请确认只保存到安全位置。")) downloadJson(`research-plain-${draft.updatedAt}.json`, draft); }} className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:border-slate-300"><Download className="h-4 w-4" /> 明文备份</button>
            <button type="button" onClick={() => void handleReload()} className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:border-slate-300"><RefreshCw className="h-4 w-4" /> 重新载入</button>
            {isLocalPreview ? (
              <button type="button" disabled={!isDirty || isSaving} onClick={() => void handleExportEncryptedDraft()} className="inline-flex h-10 items-center gap-2 rounded bg-slate-900 px-4 text-sm font-bold text-white disabled:bg-slate-300"><Download className="h-4 w-4" /> 下载修改后的加密草稿</button>
            ) : (
              <>
                <button type="button" disabled={!isDirty || isSaving} onClick={() => void handleSave()} className="inline-flex h-10 items-center gap-2 rounded bg-slate-900 px-4 text-sm font-bold text-white disabled:bg-slate-300"><Save className="h-4 w-4" /> {isSaving ? "加密保存中..." : "保存上线"}</button>
                <button type="button" onClick={() => void handleSignOut()} className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:text-red-700"><LogOut className="h-4 w-4" /> 退出</button>
              </>
            )}
          </div>
        </div>
        {vaultError ? <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{vaultError}</p> : null}
        {saveNotice ? <p className="mt-4 inline-flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {saveNotice}</p> : null}
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded border border-slate-200 bg-white p-1 shadow-sm">
          <button type="button" onClick={() => setView("projects")} className={`inline-flex h-9 items-center gap-2 rounded px-3 text-sm font-bold ${view === "projects" ? "bg-slate-900 text-white" : "text-slate-600"}`}><FolderKanban className="h-4 w-4" /> 项目与分组</button>
          <button type="button" onClick={() => setView("people")} className={`inline-flex h-9 items-center gap-2 rounded px-3 text-sm font-bold ${view === "people" ? "bg-slate-900 text-white" : "text-slate-600"}`}><UsersRound className="h-4 w-4" /> 参与人</button>
        </div>
        <span className="text-sm font-semibold text-slate-500">内容更新日期 {draft.updatedAt}（保存时自动更新）</span>
      </div>

      {view === "projects" ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.5fr)]">
          <aside className="space-y-3">
            {draft.groups.map((group, groupIndex) => (
              <section key={group.id} className="rounded border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1 space-y-2">
                    <input value={group.title} onChange={(event) => updateGroup(group.id, { title: event.target.value })} className="h-9 w-full rounded border border-slate-200 px-2 text-sm font-bold outline-none focus:border-slate-400" aria-label="分组名称" />
                    <textarea value={group.description} onChange={(event) => updateGroup(group.id, { description: event.target.value })} rows={2} className="w-full resize-y rounded border border-slate-200 px-2 py-1.5 text-xs leading-5 outline-none focus:border-slate-400" aria-label="分组说明" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" disabled={groupIndex === 0} onClick={() => moveGroup(groupIndex, -1)} className="rounded border border-slate-200 p-1.5 disabled:opacity-30" title="分组上移"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" disabled={groupIndex === draft.groups.length - 1} onClick={() => moveGroup(groupIndex, 1)} className="rounded border border-slate-200 p-1.5 disabled:opacity-30" title="分组下移"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => { if (!group.projects.length || window.confirm("这个分组还有项目，删除时会一并删除。继续吗？")) mutateDraft((next) => { next.groups = next.groups.filter((item) => item.id !== group.id); }); }} className="rounded border border-red-100 p-1.5 text-red-600" title="删除分组"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <p className="mt-1 font-mono text-[10px] text-slate-400">{group.id}</p>
                <div className="mt-3 space-y-1.5">
                  {group.projects.map((project, projectIndex) => (
                    <div key={project.id} className={`flex items-center gap-1 rounded border p-1 ${selectedProjectId === project.id ? "border-slate-500 bg-slate-50" : "border-slate-100"}`}>
                      <button type="button" onClick={() => setSelectedProjectId(project.id)} className="min-w-0 flex-1 truncate px-2 py-1.5 text-left text-sm font-semibold text-slate-700">{project.title || "未命名项目"}</button>
                      <button type="button" disabled={projectIndex === 0} onClick={() => moveProject(group.id, projectIndex, -1)} className="p-1 text-slate-400 disabled:opacity-20" title="项目上移"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button type="button" disabled={projectIndex === group.projects.length - 1} onClick={() => moveProject(group.id, projectIndex, 1)} className="p-1 text-slate-400 disabled:opacity-20" title="项目下移"><ArrowDown className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => { const id = makeId("project"); mutateDraft((next) => { next.groups.find((item) => item.id === group.id)?.projects.push({ id, title: "新项目", members: [], authorRole: "other", venue: null, status: "计划中", route: "待补充" }); }); setSelectedProjectId(id); }} className="mt-3 inline-flex h-8 w-full items-center justify-center gap-2 rounded border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:border-slate-400"><Plus className="h-3.5 w-3.5" /> 添加项目</button>
              </section>
            ))}
            <button type="button" onClick={() => { const id = makeId("group"); mutateDraft((next) => { next.groups.push({ id, title: "新分组", description: "", projects: [] }); }); }} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-dashed border-slate-400 bg-white text-sm font-bold text-slate-600"><Plus className="h-4 w-4" /> 添加分组</button>
          </aside>

          <main className="min-w-0">
            {selectedProject ? (
              <section className="sticky top-20 rounded border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Project</p><h2 className="mt-1 text-xl font-bold text-slate-950">项目详情</h2></div>
                  <button type="button" onClick={() => { if (window.confirm(`确定删除“${selectedProject.project.title}”吗？`)) { mutateDraft((next) => { const group = next.groups.find((item) => item.id === selectedProject.group.id); if (group) group.projects = group.projects.filter((item) => item.id !== selectedProject.project.id); }); setSelectedProjectId(null); } }} className="inline-flex h-9 items-center gap-2 rounded border border-red-200 px-3 text-sm font-bold text-red-700"><Trash2 className="h-4 w-4" /> 删除</button>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2 text-sm font-bold text-slate-700">标题<input value={selectedProject.project.title} onChange={(event) => updateProject(selectedProject.group.id, selectedProject.project.id, { title: event.target.value })} className="mt-2 h-10 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-slate-400" /></label>
                  <label className="text-sm font-bold text-slate-700">所在分组<select value={selectedProject.group.id} onChange={(event) => moveProjectToGroup(selectedProject.project.id, selectedProject.group.id, event.target.value)} className="mt-2 h-10 w-full rounded border border-slate-200 bg-white px-3 font-normal">{draft.groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}</select></label>
                  <label className="text-sm font-bold text-slate-700">署名角色<select value={selectedProject.project.authorRole ?? "other"} onChange={(event) => updateProject(selectedProject.group.id, selectedProject.project.id, { authorRole: event.target.value as AuthorRole })} className="mt-2 h-10 w-full rounded border border-slate-200 bg-white px-3 font-normal">{authorRoles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></label>
                  <label className="text-sm font-bold text-slate-700">Venue<input value={selectedProject.project.venue ?? ""} onChange={(event) => updateProject(selectedProject.group.id, selectedProject.project.id, { venue: event.target.value.trim() ? event.target.value : null })} placeholder="留空表示待定" className="mt-2 h-10 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-slate-400" /></label>
                  <label className="text-sm font-bold text-slate-700">状态<input value={selectedProject.project.status} onChange={(event) => updateProject(selectedProject.group.id, selectedProject.project.id, { status: event.target.value })} className="mt-2 h-10 w-full rounded border border-slate-200 px-3 font-normal outline-none focus:border-slate-400" /></label>
                  <label className="sm:col-span-2 text-sm font-bold text-slate-700">备注 / 投稿路线<textarea value={selectedProject.project.route} onChange={(event) => updateProject(selectedProject.group.id, selectedProject.project.id, { route: event.target.value })} rows={4} className="mt-2 w-full resize-y rounded border border-slate-200 px-3 py-2 font-normal leading-6 outline-none focus:border-slate-400" /></label>
                </div>
                <div className="mt-5">
                  <p className="text-sm font-bold text-slate-700">参与人</p>
                  <div className="mt-2 grid max-h-60 gap-2 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                    {draft.people.map((person) => {
                      const checked = selectedProject.project.members.includes(person.id);
                      return <label key={person.id} className="flex items-center gap-2 rounded bg-white px-2 py-1.5 text-sm text-slate-700"><input type="checkbox" checked={checked} onChange={() => updateProject(selectedProject.group.id, selectedProject.project.id, { members: checked ? selectedProject.project.members.filter((id) => id !== person.id) : [...selectedProject.project.members, person.id] })} /> <span className="truncate">{person.name}</span></label>;
                    })}
                    {draft.people.length === 0 ? <p className="text-sm text-slate-500">请先在“参与人”页添加人员。</p> : null}
                  </div>
                </div>
                <p className="mt-4 font-mono text-[11px] text-slate-400">ID: {selectedProject.project.id}</p>
              </section>
            ) : (
              <div className="rounded border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-semibold text-slate-500">从左侧选择一个项目，或添加新项目。</div>
            )}
          </main>
        </div>
      ) : (
        <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-950">参与人</h2><p className="mt-1 text-sm text-slate-500">修改姓名会自动反映到所有项目；删除人员会同时移除项目里的关联。</p></div><button type="button" onClick={() => mutateDraft((next) => { next.people.push({ id: makeId("person"), name: "新参与人" }); })} className="inline-flex h-9 items-center gap-2 rounded bg-slate-900 px-3 text-sm font-bold text-white"><Plus className="h-4 w-4" /> 添加</button></div>
          <div className="mt-5 divide-y divide-slate-100 rounded border border-slate-200">
            {draft.people.map((person, index) => (
              <div key={person.id} className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">姓名<input value={person.name} onChange={(event) => mutateDraft((next) => { next.people[index].name = event.target.value; })} className="mt-1.5 h-9 w-full rounded border border-slate-200 px-2 text-sm font-normal normal-case tracking-normal text-slate-800" /></label>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">角色备注<input value={person.role ?? ""} onChange={(event) => mutateDraft((next) => { next.people[index].role = event.target.value || undefined; })} placeholder="可选" className="mt-1.5 h-9 w-full rounded border border-slate-200 px-2 text-sm font-normal normal-case tracking-normal text-slate-800" /></label>
                <div className="flex items-center gap-2 sm:pt-5"><span className="hidden max-w-36 truncate font-mono text-[10px] text-slate-400 lg:block">{person.id}</span><button type="button" onClick={() => { if (window.confirm(`删除“${person.name}”并移除所有项目关联吗？`)) mutateDraft((next) => { next.people = next.people.filter((item) => item.id !== person.id); next.groups.forEach((group) => group.projects.forEach((project) => { project.members = project.members.filter((id) => id !== person.id); })); }); }} className="rounded border border-red-100 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div>
              </div>
            ))}
            {draft.people.length === 0 ? <div className="p-8 text-center text-sm text-slate-500"><UserRound className="mx-auto mb-2 h-5 w-5" />暂无参与人</div> : null}
          </div>
        </section>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 pb-6 text-xs font-semibold text-slate-500">
        <Link to="/research" className="inline-flex items-center gap-2 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> 查看公开页面</Link>
        <span>{isLocalPreview ? "这是本地预览，修改不会直接上线；可下载加密草稿备份。" : "Research 密码不会发送到 Supabase；保存前在浏览器本地重新加密。"}</span>
      </footer>
      </fieldset>
    </div>
  );
};

export default ResearchAdmin;
