export type AuthorRole = "first" | "corresponding" | "other";

export type VaultProjectStage = "submitted" | "pending" | "planned";

export type VaultPerson = {
  id: string;
  name: string;
  role?: string;
};

export type VaultProject = {
  id: string;
  title: string;
  members: string[];
  authorRole?: AuthorRole;
  venue?: string | null;
  stage?: VaultProjectStage;
  status: string;
  route: string;
};

export type VaultGroup = {
  id: string;
  title: string;
  description: string;
  projects: VaultProject[];
};

export type VaultData = {
  updatedAt: string;
  groups: VaultGroup[];
  people: VaultPerson[];
};

export type EncryptedVaultPayload = {
  version: number;
  cipher: "AES-GCM-256";
  kdf: "PBKDF2-SHA-256";
  iterations: number;
  salt: string;
  iv: string;
  data: string;
};
