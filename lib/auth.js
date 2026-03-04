// lib/auth.js
// 토큰 암호화 및 쿠키 관리

import crypto from 'crypto';

const COOKIE_NAME = 'threads_session';
const SECRET = process.env.COOKIE_SECRET || 'default-secret-change-me-in-production-32chars';

// 간단한 AES 암호화 (프로덕션에서는 iron-session 등 사용 권장)
export function encrypt(text) {
  const key = crypto.scryptSync(SECRET, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text) {
  try {
    const key = crypto.scryptSync(SECRET, 'salt', 32);
    const [ivHex, encrypted] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return null;
  }
}

export function setSessionCookie(res, sessionData) {
  const encrypted = encrypt(JSON.stringify(sessionData));
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${encrypted}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 55}`,
  ]);
}

export function getSession(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionCookie = cookies[COOKIE_NAME];
  if (!sessionCookie) return null;

  const decrypted = decrypt(sessionCookie);
  if (!decrypted) return null;

  try {
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  ]);
}

function parseCookies(cookieStr) {
  const cookies = {};
  cookieStr.split(';').forEach(pair => {
    const [key, ...vals] = pair.trim().split('=');
    if (key) cookies[key] = vals.join('=');
  });
  return cookies;
}
