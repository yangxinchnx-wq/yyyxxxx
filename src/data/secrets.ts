// ─────────────────────────────────────────────────────────────────
// 敏感信息加密工具（AES-GCM + PBKDF2）
// - 设备派生密钥：基于 navigator.userAgent + 域名 + 固定 salt 派生 AES 密钥
// - 同设备可解密；换设备/浏览器即失效（提供 export/import 用于多设备同步）
// - 失败时返回明文兼容旧的 localStorage 数据
// ─────────────────────────────────────────────────────────────────

const DEVICE_SALT = 'soloforge.cherry.v1';
const PBKDF2_ITERATIONS = 100_000;

const enc = new TextEncoder();
const dec = new TextDecoder();

let cachedKey: CryptoKey | null = null;

function getDeviceFingerprint(): string {
  if (typeof navigator === 'undefined') return 'node';
  const ua = navigator.userAgent || 'unknown';
  const lang = navigator.language || 'unknown';
  const platform = (navigator as any).platform || 'unknown';
  return `${ua}|${lang}|${platform}`;
}

async function getDeviceKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  const subtle = crypto.subtle;
  const baseKey = await subtle.importKey(
    'raw',
    enc.encode(getDeviceFingerprint()),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  cachedKey = await subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(DEVICE_SALT),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return cachedKey;
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function fromBase64(s: string): ArrayBuffer {
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export async function encryptSecret(plain: string): Promise<string> {
  if (!plain) return '';
  if (typeof crypto === 'undefined' || !crypto.subtle) return plain;
  try {
    const key = await getDeviceKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plain)
    );
    return 'enc:v1:' + toBase64(iv.buffer) + ':' + toBase64(cipherBuf);
  } catch (e) {
    console.warn('[secrets] encrypt failed, fallback to plain:', e);
    return plain;
  }
}

export async function decryptSecret(stored: string): Promise<string> {
  if (!stored) return '';
  if (!stored.startsWith('enc:v1:')) return stored;
  if (typeof crypto === 'undefined' || !crypto.subtle) return stored;
  try {
    const key = await getDeviceKey();
    const parts = stored.split(':');
    const iv = new Uint8Array(fromBase64(parts[2]));
    const cipherBuf = fromBase64(parts[3]);
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherBuf
    );
    return dec.decode(plainBuf);
  } catch (e) {
    console.warn('[secrets] decrypt failed, returning empty:', e);
    return '';
  }
}

export async function decryptProviders<T = any>(arr: any[]): Promise<T[]> {
  return Promise.all(
    (arr || []).map(async (p: any) => {
      if (p && typeof p.apiKey === 'string' && p.apiKey) {
        const plain = await decryptSecret(p.apiKey);
        return { ...p, apiKey: plain };
      }
      return p;
    })
  );
}

export async function encryptApiKeyField(plain: string): Promise<string> {
  return encryptSecret(plain);
}
