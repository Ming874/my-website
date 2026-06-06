export function base32ToBuf(s: string): Uint8Array {
  const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let b = "";
  const r: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const v = a.indexOf(s[i].toUpperCase());
    if (v === -1) continue;
    b += v.toString(2).padStart(5, "0");
  }
  for (let i = 0; i + 8 <= b.length; i += 8) {
    r.push(parseInt(b.substring(i, i + 8), 2));
  }
  return new Uint8Array(r);
}

export async function generateTOTP(secret: string): Promise<string> {
  const key = await window.crypto.subtle.importKey(
    "raw",
    base32ToBuf(secret) as unknown as BufferSource,
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"]
  );
  const t = Math.floor(Math.floor(Date.now() / 1000) / 30);
  const b = new ArrayBuffer(8);
  new DataView(b).setUint32(4, t);
  const h = new Uint8Array(await window.crypto.subtle.sign("HMAC", key, b));
  const o = h[h.length - 1] & 0xf;
  const c =
    ((h[o] & 0x7f) << 24) |
    ((h[o + 1] & 0xff) << 16) |
    ((h[o + 2] & 0xff) << 8) |
    (h[o + 3] & 0xff);
  return (c % 1000000).toString().padStart(6, "0");
}
