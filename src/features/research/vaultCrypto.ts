import type { EncryptedVaultPayload, VaultData } from "./types";

export const VAULT_ENCRYPTION_VERSION = 1;
export const VAULT_PBKDF2_ITERATIONS = 310_000;
export const VAULT_SALT_BYTES = 16;
export const VAULT_IV_BYTES = 12;

export const decodeBase64 = (value: string) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

export const encodeBase64 = (value: Uint8Array) => {
  const chunkSize = 0x8000;
  let binary = "";

  for (let offset = 0; offset < value.length; offset += chunkSize) {
    binary += String.fromCharCode(...value.subarray(offset, offset + chunkSize));
  }

  return btoa(binary);
};

const getCrypto = () => {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.subtle) {
    throw new Error("Web Crypto is unavailable.");
  }

  return cryptoApi;
};

const deriveVaultKey = async ({
  password,
  salt,
  iterations,
  usage,
}: {
  password: string;
  salt: Uint8Array;
  iterations: number;
  usage: "encrypt" | "decrypt";
}) => {
  const cryptoApi = getCrypto();
  const keyMaterial = await cryptoApi.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return cryptoApi.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
};

export const decryptVaultData = async (
  payload: EncryptedVaultPayload,
  password: string
) => {
  const cryptoApi = getCrypto();
  const salt = decodeBase64(payload.salt);
  const iv = decodeBase64(payload.iv);
  const ciphertext = decodeBase64(payload.data);
  const key = await deriveVaultKey({
    password,
    salt,
    iterations: payload.iterations,
    usage: "decrypt",
  });
  const plaintext = await cryptoApi.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return JSON.parse(new TextDecoder().decode(plaintext)) as VaultData;
};

export const encryptVaultData = async (
  data: VaultData,
  password: string
): Promise<EncryptedVaultPayload> => {
  const cryptoApi = getCrypto();
  const salt = cryptoApi.getRandomValues(new Uint8Array(VAULT_SALT_BYTES));
  const iv = cryptoApi.getRandomValues(new Uint8Array(VAULT_IV_BYTES));
  const key = await deriveVaultKey({
    password,
    salt,
    iterations: VAULT_PBKDF2_ITERATIONS,
    usage: "encrypt",
  });
  const ciphertext = await cryptoApi.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(data))
  );

  return {
    version: VAULT_ENCRYPTION_VERSION,
    cipher: "AES-GCM-256",
    kdf: "PBKDF2-SHA-256",
    iterations: VAULT_PBKDF2_ITERATIONS,
    salt: encodeBase64(salt),
    iv: encodeBase64(iv),
    data: encodeBase64(new Uint8Array(ciphertext)),
  };
};
