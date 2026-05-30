"use client";

// AES-256-GCM + PBKDF2(SHA-256) helpers backed by WebCrypto.
// We never re-export the raw CryptoKey — encrypt/decrypt take the password and
// derive a fresh key each call, so the encryption key never lives in JS heap.

const PBKDF2_ITERATIONS = 600_000;
const PBKDF2_HASH = "SHA-256";
const AES_LENGTH = 256;
const IV_BYTES = 12; // 96-bit IV recommended for GCM
const SALT_BYTES = 16;

function getSubtle(): SubtleCrypto {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("WebCrypto not available in this environment");
  }
  return window.crypto.subtle;
}

export function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  window.crypto.getRandomValues(out);
  return out;
}

async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const subtle = getSubtle();
  const enc = new TextEncoder();
  const material = await subtle.importKey(
    "raw",
    enc.encode(password) as BufferSource,
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: PBKDF2_HASH },
    material,
    { name: "AES-GCM", length: AES_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export interface EncryptedBlob {
  cipher: "AES-GCM";
  kdf: { algo: "PBKDF2"; iterations: number; hash: "SHA-256" };
  salt: Uint8Array;
  iv: Uint8Array;
  ciphertext: Uint8Array;
}

export async function encryptBytes(plaintext: Uint8Array, password: string): Promise<EncryptedBlob> {
  const subtle = getSubtle();
  const salt = randomBytes(SALT_BYTES);
  const iv = randomBytes(IV_BYTES);
  const key = await deriveAesKey(password, salt);
  const ciphertext = new Uint8Array(
    await subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, plaintext as BufferSource)
  );
  return {
    cipher: "AES-GCM",
    kdf: { algo: "PBKDF2", iterations: PBKDF2_ITERATIONS, hash: PBKDF2_HASH },
    salt,
    iv,
    ciphertext,
  };
}

export async function decryptBytes(blob: EncryptedBlob, password: string): Promise<Uint8Array> {
  const subtle = getSubtle();
  const key = await deriveAesKey(password, blob.salt);
  try {
    const plaintext = await subtle.decrypt({ name: "AES-GCM", iv: blob.iv as BufferSource }, key, blob.ciphertext as BufferSource);
    return new Uint8Array(plaintext);
  } catch {
    throw new Error("Invalid password");
  }
}

// --- hex helpers (used for the secret-key payload) ---

export function bytesToHex(bytes: Uint8Array): string {
  let h = "";
  for (const b of bytes) h += b.toString(16).padStart(2, "0");
  return h;
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) throw new Error("Invalid hex");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export async function sha256Hex(input: string | Uint8Array): Promise<string> {
  const subtle = getSubtle();
  const data = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const digest = await subtle.digest("SHA-256", data as BufferSource);
  return bytesToHex(new Uint8Array(digest));
}
