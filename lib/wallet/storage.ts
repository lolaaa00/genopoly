"use client";

import type { EncryptedBlob } from "./crypto";

// One-record IndexedDB store for the encrypted private key + metadata.

const DB_NAME = "genopoly_wallet";
const DB_VERSION = 1;
const STORE = "vault";
const RECORD_KEY = "default";

export interface VaultRecord {
  version: 1;
  address: `0x${string}`;
  blob: EncryptedBlob;
  createdAt: number;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Failed to open vault DB"));
  });
}

export async function loadVault(): Promise<VaultRecord | null> {
  try {
    const db = await openDB();
    return new Promise<VaultRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const store = tx.objectStore(STORE);
      const req = store.get(RECORD_KEY);
      req.onsuccess = () => resolve((req.result as VaultRecord | undefined) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function saveVault(record: VaultRecord): Promise<void> {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.put(record, RECORD_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearVault(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).delete(RECORD_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // best-effort
  }
}

export async function hasVault(): Promise<boolean> {
  return (await loadVault()) !== null;
}
