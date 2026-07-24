import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  LockKeyhole,
  Search,
  Settings2,
  Target,
  UsersRound,
} from "lucide-react";
import { loadPublicVaultPayload } from "../features/research/repository";
import type {
  AuthorRole,
  EncryptedVaultPayload,
  VaultGroup,
  VaultPerson,
  VaultProject,
  VaultData,
} from "../features/research/types";
import { decryptVaultData } from "../features/research/vaultCrypto";

type LoadState = "loading" | "locked" | "ready" | "error";

type BoardProject = VaultProject & {
  groupId: string;
  groupTitle: string;
  statusTagId: string;
  statusTagLabel: string;
  venueTagId?: string;
  venueTagLabel?: string;
  authorRoleTagId: AuthorRole;
  authorRoleTagLabel: string;
};

const statusTagStyles: Record<string, string> = {
  submitted: "border-blue-200 bg-blue-100/80 text-blue-800",
  pending: "border-red-200 bg-red-100/90 text-red-800",
  planned: "border-amber-300 bg-amber-200/95 text-amber-950",
};

const venueNoteStyles: Record<string, string> = {
  "venue-icde": "border-cyan-100 bg-cyan-50/95",
  "venue-isaac": "border-violet-100 bg-violet-50/95",
  "venue-tkde": "border-fuchsia-100 bg-fuchsia-50/95",
  "venue-soda": "border-emerald-100 bg-emerald-50/95",
  "venue-iclr": "border-rose-100 bg-rose-50/95",
};

const venueTagStyles: Record<string, string> = {
  "venue-icde": "border-cyan-200 bg-cyan-100/80 text-cyan-800",
  "venue-isaac": "border-violet-200 bg-violet-100/80 text-violet-800",
  "venue-tkde": "border-fuchsia-200 bg-fuchsia-100/80 text-fuchsia-800",
  "venue-soda": "border-emerald-200 bg-emerald-100/80 text-emerald-800",
  "venue-iclr": "border-rose-200 bg-rose-100/80 text-rose-800",
};

const venueScheduleNotes: Record<
  string,
  {
    submitted: string;
    upcoming: string;
  }
> = {
  "venue-icde": {
    submitted: "Rebuttal 8/8-15 · 结果 9/10",
    upcoming: "DDL 11/11 · Rebuttal 1/8-15 · 结果 2/10",
  },
  "venue-isaac": {
    submitted: "结果 9/7",
    upcoming: "DDL 6/29 · 结果 9/7",
  },
  "venue-soda": {
    submitted: "Review 9/1 · 结果 10月",
    upcoming: "DDL 7/9 · Review 9/1 · 结果 10月",
  },
  "venue-iclr": {
    submitted: "DDL 9月中旬",
    upcoming: "DDL 9月中旬",
  },
};

const authorRoleStyles: Record<AuthorRole, string> = {
  first: "border-orange-200 bg-orange-100/80 text-orange-800",
  corresponding: "border-purple-200 bg-purple-100/80 text-purple-800",
  other: "border-slate-200 bg-white/75 text-slate-700",
};

const authorRoleLabels: Record<AuthorRole, string> = {
  first: "一作",
  corresponding: "通讯",
  other: "其他",
};

const venuePattern =
  /\b(SODA|ICLR|NeurIPS|ICML|ICALP|ESA|ITCS|PODS|ICDT|MFCS|STACS|TKDE|ICDE|WWW|ISAAC)\b/;

const makeTagId = (label: string) =>
  `venue-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

const getProjectStatusTag = (project: VaultProject, group: VaultGroup) => {
  if (group.id === "submitted" || /已提交|已投稿/.test(project.status)) {
    return { id: "submitted", label: "已提交" };
  }

  if (/计划中|标题未知|标题待定/.test(project.status)) {
    return { id: "planned", label: "计划中" };
  }

  return { id: "pending", label: "待提交" };
};

const getProjectVenueTag = (project: VaultProject, group: VaultGroup) => {
  if (project.venue === null) {
    return null;
  }

  if (project.venue) {
    return { id: makeTagId(project.venue), label: project.venue };
  }

  const venue =
    `${project.route} ${project.status}`.match(venuePattern)?.[1] ??
    group.title.replace(/\s*准备线/g, "");
  return { id: makeTagId(venue), label: venue };
};

const getProjectAuthorRoleTag = (project: VaultProject) => {
  const role = project.authorRole ?? "other";
  return { id: role, label: authorRoleLabels[role] };
};

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getPersonName = ({
  people,
  memberId,
}: {
  people: Map<string, VaultPerson>;
  memberId: string;
}) => people.get(memberId)?.name ?? "参与人待补充";

const ResearchVault = () => {
  const [data, setData] = useState<VaultData | null>(null);
  const [encryptedPayload, setEncryptedPayload] =
    useState<EncryptedVaultPayload | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeVenue, setActiveVenue] = useState("all");
  const [activeAuthorRole, setActiveAuthorRole] = useState("all");

  useEffect(() => {
    let isMounted = true;

    loadPublicVaultPayload()
      .then((snapshot) => {
        if (!isMounted) {
          return;
        }
        setEncryptedPayload(snapshot.payload);
        setLoadState("locked");
      })
      .catch(() => {
        if (isMounted) {
          setLoadState("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!encryptedPayload || !password.trim()) {
      return;
    }

    setIsUnlocking(true);
    setUnlockError("");

    try {
      const payload = await decryptVaultData(encryptedPayload, password);
      setData(payload);
      setPassword("");
      setLoadState("ready");
    } catch {
      setUnlockError("密码不对，或者密文文件已经变更。");
    } finally {
      setIsUnlocking(false);
    }
  };

  const people = useMemo(() => {
    return new Map(data?.people.map((person) => [person.id, person]) ?? []);
  }, [data]);

  const boardProjects = useMemo<BoardProject[]>(() => {
    return (
      data?.groups.flatMap((group) =>
        group.projects.map((project) => {
          const statusTag = getProjectStatusTag(project, group);
          const venueTag = getProjectVenueTag(project, group);
          const authorRoleTag = getProjectAuthorRoleTag(project);
          return {
            ...project,
            groupId: group.id,
            groupTitle: group.title,
            statusTagId: statusTag.id,
            statusTagLabel: statusTag.label,
            venueTagId: venueTag?.id,
            venueTagLabel: venueTag?.label,
            authorRoleTagId: authorRoleTag.id,
            authorRoleTagLabel: authorRoleTag.label,
          };
        })
      ) ?? []
    );
  }, [data]);

  const venueFilters = useMemo(() => {
    const venues = new Map<string, string>();
    boardProjects.forEach((project) => {
      if (project.venueTagId && project.venueTagLabel) {
        venues.set(project.venueTagId, project.venueTagLabel);
      }
    });
    return Array.from(venues, ([id, label]) => ({ id, label }));
  }, [boardProjects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return boardProjects.filter((project) => {
      if (activeStatus !== "all" && project.statusTagId !== activeStatus) {
        return false;
      }

      if (activeVenue !== "all" && project.venueTagId !== activeVenue) {
        return false;
      }

      if (
        activeAuthorRole !== "all" &&
        project.authorRoleTagId !== activeAuthorRole
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const members = project.members
        .map((memberId) => people.get(memberId)?.name ?? "")
        .join(" ");
      const text = [
        project.statusTagLabel,
        project.venueTagLabel ?? "",
        project.authorRoleTagLabel,
        project.groupTitle,
        project.title,
        project.status,
        project.route,
        members,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [activeAuthorRole, activeStatus, activeVenue, boardProjects, people, query]);

  if (loadState === "loading") {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          正在铺开课题备忘...
        </div>
      </div>
    );
  }

  if (loadState === "locked") {
    return (
      <div className="mx-auto flex min-h-[58vh] max-w-xl items-center justify-center">
        <section className="w-full rounded border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Research Memos
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                课题进度备忘板
              </h1>
              <form className="mt-6 space-y-3" onSubmit={handleUnlock}>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    访问密码
                  </span>
                  <input
                    autoFocus
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="mt-2 h-11 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                    placeholder="输入密码"
                  />
                </label>
                {unlockError ? (
                  <p className="text-sm font-semibold text-red-700">
                    {unlockError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={!password.trim() || isUnlocking}
                  className="inline-flex h-10 w-full items-center justify-center rounded border border-slate-900 bg-slate-900 px-4 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
                >
                  {isUnlocking ? "解锁中..." : "解锁"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loadState !== "ready" || !data) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h1 className="text-lg font-bold">加密进度数据未加载</h1>
              <p className="mt-2 text-sm leading-6">
                当前页面需要读取公开密文文件
                <span className="mx-1 font-mono text-xs">
                Supabase 或本地加密备份
                </span>
                。请先从本地明文生成密文后再刷新页面。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Research Memos
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            课题进度备忘板
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <CalendarDays className="h-4 w-4" />
            更新于 {formatDate(data.updatedAt)} · {boardProjects.length} 个项目
          </p>
          <Link
            to="/research/admin"
            className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <Settings2 className="h-4 w-4" />
            在线编辑
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-4 rounded border border-slate-200 bg-white/85 p-3 shadow-sm xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 text-xs font-bold uppercase tracking-wide text-slate-400">
              状态
            </span>
            {[
              { id: "all", label: "全部" },
              { id: "submitted", label: "已提交" },
              { id: "pending", label: "待提交" },
              { id: "planned", label: "计划中" },
            ].map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => setActiveStatus(tag.id)}
                className={`inline-flex h-9 items-center rounded border px-3 text-sm font-semibold transition-colors ${
                  activeStatus === tag.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 text-xs font-bold uppercase tracking-wide text-slate-400">
              Venue
            </span>
            <button
              type="button"
              onClick={() => setActiveVenue("all")}
              className={`inline-flex h-9 items-center rounded border px-3 text-sm font-semibold transition-colors ${
                activeVenue === "all"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              全部
            </button>
            {venueFilters.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => setActiveVenue(tag.id)}
                className={`inline-flex h-9 items-center rounded border px-3 text-sm font-semibold transition-colors ${
                  activeVenue === tag.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 text-xs font-bold uppercase tracking-wide text-slate-400">
              署名
            </span>
            {[
              { id: "all", label: "全部" },
              { id: "first", label: "一作" },
              { id: "corresponding", label: "通讯" },
              { id: "other", label: "其他" },
            ].map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => setActiveAuthorRole(tag.id)}
                className={`inline-flex h-9 items-center rounded border px-3 text-sm font-semibold transition-colors ${
                  activeAuthorRole === tag.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
        <label className="relative block lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索项目、状态、人员"
            className="h-10 w-full rounded border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>
      </section>

      <main
        className="rounded border border-slate-200 bg-slate-100 p-4 shadow-inner sm:p-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(100,116,139,0.16) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      >
        {filteredProjects.length === 0 ? (
          <div className="rounded border border-dashed border-slate-300 bg-white/75 p-8 text-center text-sm font-semibold text-slate-500">
            没有匹配的备忘。
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredProjects.map((project) => {
              const noteClass =
                (project.venueTagId ? venueNoteStyles[project.venueTagId] : undefined) ??
                "border-indigo-100 bg-indigo-50/95";
              const statusClass =
                statusTagStyles[project.statusTagId] ?? statusTagStyles.pending;
              const venueClass =
                (project.venueTagId ? venueTagStyles[project.venueTagId] : undefined) ??
                "border-indigo-200 bg-indigo-100/80 text-indigo-800";
              const authorRoleClass = authorRoleStyles[project.authorRoleTagId];
              const schedule =
                project.venueTagId ? venueScheduleNotes[project.venueTagId] : undefined;
              const scheduleNote =
                project.statusTagId === "submitted"
                  ? schedule?.submitted
                  : schedule?.upcoming;

              return (
                <article
                  key={project.id}
                  className={`relative flex min-h-[285px] flex-col rounded border p-4 pt-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md ${noteClass}`}
                >
                  <span className="absolute left-1/2 top-2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-white/70 shadow-sm" />

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClass}`}
                    >
                      {project.statusTagLabel}
                    </span>
                    {project.venueTagLabel ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${venueClass}`}
                      >
                        <Target className="h-3 w-3" />
                        {project.venueTagLabel}
                      </span>
                    ) : null}
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${authorRoleClass}`}
                    >
                      {project.authorRoleTagLabel}
                    </span>
                  </div>

                  <h2 className="mt-4 min-h-12 text-base font-bold leading-6 text-slate-950">
                    {project.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        <UsersRound className="h-3.5 w-3.5" />
                        参与人
                      </span>
                      <p className="text-sm font-semibold leading-6 text-slate-700">
                        {project.members.length === 0
                          ? "无"
                          : project.members
                              .map((memberId) => getPersonName({ people, memberId }))
                              .join("、")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 text-sm leading-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        备注
                      </p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {project.route}
                      </p>
                    </div>
                  </div>

                  {scheduleNote ? (
                    <div className="mt-auto flex justify-center pt-4">
                      <p className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/65 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {scheduleNote}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResearchVault;
