"use client";

import {
  encryptBytes,
  decryptBytes,
  bytesToHex,
  hexToBytes,
  randomBytes,
} from "./crypto";
import {
  loadVault,
  saveVault,
  clearVault,
  hasVault,
  type VaultRecord,
} from "./storage";

// Embedded wallet API: create / unlock / lock / export / wipe.
// The unlocked private key lives only in this module's closure for the
// duration of the tab (session memory). Closing the tab clears it.

let sessionAccount: { address: `0x${string}`; privateKey: `0x${string}` } | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

export function subscribeWallet(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getSessionAccount() {
  return sessionAccount;
}

export function getSessionAddress(): `0x${string}` | null {
  return sessionAccount?.address ?? null;
}

export function isUnlocked(): boolean {
  return sessionAccount !== null;
}

/** Derive the EVM address for a private key without touching the DOM. */
async function addressFor(privateKeyHex: string): Promise<`0x${string}`> {
  const { privateKeyToAccount } = await import("viem/accounts");
  return privateKeyToAccount(
    privateKeyHex.startsWith("0x") ? (privateKeyHex as `0x${string}`) : (`0x${privateKeyHex}` as `0x${string}`)
  ).address;
}

export interface EmbeddedSummary {
  exists: boolean;
  unlocked: boolean;
  address: `0x${string}` | null;
  createdAt: number | null;
}

export async function summary(): Promise<EmbeddedSummary> {
  const v = await loadVault();
  return {
    exists: v !== null,
    unlocked: sessionAccount !== null,
    address: sessionAccount?.address ?? v?.address ?? null,
    createdAt: v?.createdAt ?? null,
  };
}

/**
 * Create a new embedded wallet. If `importPrivateKey` is provided, that key is
 * used; otherwise a 256-bit key is generated via crypto.getRandomValues.
 * Stored encrypted with the password; session is unlocked on success.
 */
export async function createWallet(
  password: string,
  importPrivateKey?: string
): Promise<{ address: `0x${string}` }> {
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  if (await hasVault()) {
    throw new Error("A wallet already exists. Unlock it or wipe it first.");
  }

  const pkBytes = importPrivateKey ? hexToBytes(importPrivateKey) : randomBytes(32);
  if (pkBytes.length !== 32) throw new Error("Private key must be 32 bytes");

  const pkHex = `0x${bytesToHex(pkBytes)}`;
  const address = await addressFor(pkHex);

  const blob = await encryptBytes(pkBytes, password);
  const record: VaultRecord = {
    version: 1,
    address,
    blob,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await saveVault(record);

  sessionAccount = { address, privateKey: pkHex as `0x${string}` };
  notify();
  return { address };
}

/** Unlock the existing vault using the password. */
export async function unlock(password: string): Promise<{ address: `0x${string}` }> {
  const v = await loadVault();
  if (!v) throw new Error("No embedded wallet exists yet");
  const pkBytes = await decryptBytes(v.blob, password); // throws "Invalid password" on mismatch
  if (pkBytes.length !== 32) throw new Error("Vault is corrupted");
  const pkHex = `0x${bytesToHex(pkBytes)}` as `0x${string}`;
  const address = await addressFor(pkHex);
  if (address.toLowerCase() !== v.address.toLowerCase()) {
    throw new Error("Vault integrity check failed");
  }
  sessionAccount = { address, privateKey: pkHex };
  notify();
  return { address };
}

/** Clear the in-memory session (the encrypted vault stays on disk). */
export function lock(): void {
  sessionAccount = null;
  notify();
}

/** Reveal the raw private key while unlocked, for backup/export. */
export function exportPrivateKey(): `0x${string}` {
  if (!sessionAccount) throw new Error("Wallet is locked");
  return sessionAccount.privateKey;
}

/** Delete the encrypted vault and clear session. */
export async function wipe(): Promise<void> {
  await clearVault();
  sessionAccount = null;
  notify();
}

/** Change the password by re-encrypting the same key. Requires unlocked. */
export async function changePassword(newPassword: string): Promise<void> {
  if (!sessionAccount) throw new Error("Wallet is locked");
  if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
  const pkBytes = hexToBytes(sessionAccount.privateKey);
  const blob = await encryptBytes(pkBytes, newPassword);
  const existing = await loadVault();
  await saveVault({
    version: 1,
    address: sessionAccount.address,
    blob,
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  });
}

export { hasVault };
