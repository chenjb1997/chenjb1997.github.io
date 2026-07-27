import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";

import type { EncryptedVaultPayload } from "./types";

const RESEARCH_VAULT_TABLE = "research_vault";
const PRIMARY_VAULT_ID = "primary";
const STATIC_VAULT_URL = "/research/progress.enc.json";

export type ResearchAuthCallbackReason = "invite" | "recovery" | "callback";

export type ResearchAuthCallbackDetails = {
  reason: ResearchAuthCallbackReason | null;
  error: string;
};

const readInitialAuthCallback = (): ResearchAuthCallbackDetails => {
  if (typeof window === "undefined") {
    return { reason: null, error: "" };
  }

  // Capture the callback before createClient() runs. Supabase Auth consumes
  // invite/recovery tokens during client initialization and may clear them
  // from the URL before the React page mounts.
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
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
  const mode = searchParams.get("mode");
  if (type === "invite") {
    return { reason: "invite", error: "" };
  }
  if (type === "recovery" || mode === "reset") {
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

export const initialResearchAuthCallback = readInitialAuthCallback();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isResearchSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export const isSupabaseConfigured = isResearchSupabaseConfigured;

const supabaseClient: SupabaseClient | null =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
        },
      })
    : null;

export type VaultSource = "supabase" | "static";

export type VaultSnapshot = {
  payload: EncryptedVaultPayload;
  revision: number | null;
  updatedAt: string | null;
  source: VaultSource;
};

export type RemoteVaultSnapshot = VaultSnapshot & {
  revision: number;
  source: "supabase";
};

export class ResearchSupabaseConfigurationError extends Error {
  constructor() {
    super(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
    this.name = "ResearchSupabaseConfigurationError";
  }
}

export class ResearchVaultAuthenticationError extends Error {
  constructor() {
    super("Please sign in before managing the research vault.");
    this.name = "ResearchVaultAuthenticationError";
  }
}

export class ResearchVaultConflictError extends Error {
  constructor() {
    super(
      "This research vault changed after it was opened. Reload it before saving again.",
    );
    this.name = "ResearchVaultConflictError";
  }
}

function getConfiguredClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new ResearchSupabaseConfigurationError();
  }

  return supabaseClient;
}

function isEncryptedVaultPayload(
  value: unknown,
): value is EncryptedVaultPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.version === "number" &&
    payload.cipher === "AES-GCM-256" &&
    payload.kdf === "PBKDF2-SHA-256" &&
    typeof payload.iterations === "number" &&
    typeof payload.salt === "string" &&
    typeof payload.iv === "string" &&
    typeof payload.data === "string"
  );
}

function parseRevision(value: unknown): number {
  const revision = Number(value);

  if (!Number.isSafeInteger(revision) || revision < 1) {
    throw new Error("The research vault has an invalid revision.");
  }

  return revision;
}

function toRemoteSnapshot(row: Record<string, unknown>): RemoteVaultSnapshot {
  if (!isEncryptedVaultPayload(row.payload)) {
    throw new Error("The research vault contains an invalid encrypted payload.");
  }

  return {
    payload: row.payload,
    revision: parseRevision(row.revision),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : null,
    source: "supabase",
  };
}

async function requireAdminSession(): Promise<Session> {
  const client = getConfiguredClient();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new ResearchVaultAuthenticationError();
  }

  return data.session;
}

async function loadRemoteVault(): Promise<RemoteVaultSnapshot> {
  const client = getConfiguredClient();
  const { data, error } = await client
    .from(RESEARCH_VAULT_TABLE)
    .select("id, payload, revision, updated_at")
    .eq("id", PRIMARY_VAULT_ID)
    .single();

  if (error) {
    throw error;
  }

  return toRemoteSnapshot(data as Record<string, unknown>);
}

async function loadStaticVault(): Promise<VaultSnapshot> {
  const response = await fetch(STATIC_VAULT_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load the research vault (${response.status}).`);
  }

  const payload: unknown = await response.json();

  if (!isEncryptedVaultPayload(payload)) {
    throw new Error("The static research vault contains an invalid payload.");
  }

  return {
    payload,
    revision: null,
    updatedAt: null,
    source: "static",
  };
}

/**
 * Loads the public ciphertext from Supabase when configured. The checked-in
 * encrypted file remains a transparent fallback for migrations and outages.
 */
export async function loadPublicResearchVault(): Promise<VaultSnapshot> {
  if (isResearchSupabaseConfigured) {
    try {
      return await loadRemoteVault();
    } catch {
      // The public experience should remain available during Supabase outages.
    }
  }

  return loadStaticVault();
}

export async function getResearchAdminSession(): Promise<Session | null> {
  const client = getConfiguredClient();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function onResearchAdminSessionChange(
  listener: (session: Session | null, event: AuthChangeEvent) => void,
): () => void {
  const client = getConfiguredClient();
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) =>
    listener(session, event),
  );

  return () => subscription.unsubscribe();
}

export async function signInResearchAdmin(
  email: string,
  password: string,
): Promise<Session> {
  const client = getConfiguredClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new ResearchVaultAuthenticationError();
  }

  return data.session;
}

export async function sendResearchAdminPasswordReset(
  email: string,
): Promise<void> {
  const client = getConfiguredClient();
  const redirectUrl = new URL("/research/admin", window.location.origin);
  const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: redirectUrl.toString(),
  });

  if (error) {
    throw error;
  }
}

export async function signOutResearchAdmin(): Promise<void> {
  const client = getConfiguredClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function updateResearchAdminPassword(
  password: string,
): Promise<void> {
  const client = getConfiguredClient();
  await requireAdminSession();
  const { error } = await client.auth.updateUser({ password });

  if (error) {
    throw error;
  }
}

export async function loadResearchVaultForAdmin(): Promise<RemoteVaultSnapshot> {
  await requireAdminSession();
  return loadRemoteVault();
}

export async function saveResearchVault(
  payload: EncryptedVaultPayload,
  expectedRevision: number,
): Promise<RemoteVaultSnapshot> {
  await requireAdminSession();

  if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1) {
    throw new Error("A valid current revision is required before saving.");
  }

  const client = getConfiguredClient();
  const nextRevision = expectedRevision + 1;
  const updatedAt = new Date().toISOString();
  const { data, error } = await client
    .from(RESEARCH_VAULT_TABLE)
    .update({
      payload,
      revision: nextRevision,
      updated_at: updatedAt,
    })
    .eq("id", PRIMARY_VAULT_ID)
    .eq("revision", expectedRevision)
    .select("id, payload, revision, updated_at")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new ResearchVaultConflictError();
  }

  return toRemoteSnapshot(data as Record<string, unknown>);
}

// Short aliases keep page components readable while the research-prefixed
// names remain available to avoid collisions in broader application modules.
export {
  getResearchAdminSession as getAdminSession,
  loadPublicResearchVault as loadPublicVaultPayload,
  loadResearchVaultForAdmin as loadAdminVault,
  onResearchAdminSessionChange as onAuthStateChange,
  saveResearchVault as saveAdminVault,
  sendResearchAdminPasswordReset as sendAdminPasswordReset,
  signInResearchAdmin as signInAdmin,
  signOutResearchAdmin as signOutAdmin,
  updateResearchAdminPassword as updateAdminPassword,
};
