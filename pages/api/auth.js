// pages/api/auth.js
// Threads OAuth 콜백 핸들러
// 1. authorization code → short-lived token
// 2. short-lived token → long-lived token (60일)
// 3. 사용자 프로필 조회
// 4. 암호화된 세션 쿠키 저장
// 5. 프론트엔드로 리디렉트

import { setSessionCookie } from '../../lib/auth';

export default async function handler(req, res) {
  const { code, error } = req.query;

  // OAuth 에러 처리
  if (error) {
    console.error('OAuth error from Threads:', error);
    return res.redirect(`/?error=oauth_denied&detail=${error}`);
  }

  if (!code) {
    return res.redirect('/?error=no_code');
  }

  const APP_ID = process.env.THREADS_APP_ID;
  const APP_SECRET = process.env.THREADS_APP_SECRET;
  const REDIRECT_URI = process.env.THREADS_REDIRECT_URI;

  if (!APP_SECRET) {
    console.error('THREADS_APP_SECRET not configured');
    return res.redirect('/?error=server_config');
  }

  try {
    // ──────────────────────────────────────
    // Step 1: Code → Short-lived Token
    // ──────────────────────────────────────
    console.log('[Auth] Exchanging code for short-lived token...');

    const tokenRes = await fetch('https://graph.threads.net/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: APP_ID,
        client_secret: APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('[Auth] Token response:', JSON.stringify(tokenData).substring(0, 200));

    if (tokenData.error_type || tokenData.error) {
      console.error('[Auth] Token exchange failed:', tokenData);
      return res.redirect(`/?error=token_failed&detail=${encodeURIComponent(tokenData.error_message || tokenData.error || 'unknown')}`);
    }

    const shortToken = tokenData.access_token;
    const userId = tokenData.user_id;

    // ──────────────────────────────────────
    // Step 2: Short-lived → Long-lived Token
    // ──────────────────────────────────────
    console.log('[Auth] Exchanging for long-lived token...');

    const longRes = await fetch(
      `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${APP_SECRET}&access_token=${shortToken}`
    );

    const longData = await longRes.json();
    const longToken = longData.access_token || shortToken;
    const expiresIn = longData.expires_in || 5184000; // 기본 60일

    console.log('[Auth] Long-lived token obtained, expires in:', expiresIn);

    // ──────────────────────────────────────
    // Step 3: 프로필 조회
    // ──────────────────────────────────────
    console.log('[Auth] Fetching user profile...');

    const profileRes = await fetch(
      `https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url&access_token=${longToken}`
    );

    const profile = await profileRes.json();
    console.log('[Auth] Profile:', profile.username);

    // ──────────────────────────────────────
    // Step 4: 세션 쿠키 저장 (암호화)
    // ──────────────────────────────────────
    const session = {
      userId: userId || profile.id,
      username: profile.username || 'user',
      displayName: profile.name || profile.username || 'User',
      profilePic: profile.threads_profile_picture_url || null,
      accessToken: longToken,
      tokenExpires: Date.now() + (expiresIn * 1000),
      createdAt: Date.now(),
    };

    setSessionCookie(res, session);

    // ──────────────────────────────────────
    // Step 5: 프론트엔드로 리디렉트
    // ──────────────────────────────────────
    console.log('[Auth] Success! Redirecting to dashboard...');
    return res.redirect('/?auth=success');

  } catch (error) {
    console.error('[Auth] Unexpected error:', error);
    return res.redirect(`/?error=server_error&detail=${encodeURIComponent(error.message)}`);
  }
}
