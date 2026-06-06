let cachedMasterKey: CryptoKey | null = null;

export async function getMasterKey(): Promise<CryptoKey> {
  if (cachedMasterKey) return cachedMasterKey;
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode("user-session-entropy-v2"),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  cachedMasterKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("secure-salt-v2"),
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  return cachedMasterKey;
}

export async function encryptSecret(text: string): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
  const key = await getMasterKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as unknown as BufferSource },
    key,
    new TextEncoder().encode(text)
  );
  return { encrypted, iv };
}

export async function decryptSecret(encrypted: ArrayBuffer, iv: Uint8Array): Promise<string> {
  const key = await getMasterKey();
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as unknown as BufferSource },
    key,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
}
