// pages/api/refresh-token.js
// 장기 토큰 갱신 (만료 7일 전에 자동 호출)

import { getSession, setSessionCookie } from '../../lib/auth';
import { refreshLongLivedToken } from '../../lib/threads';

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'not_authenticated' });
  }

  try {
    const result = await refreshLongLivedToken(session.accessToken);

    if (result.error) {
      return res.status(400).json({ error: result.error.message });
    }

    // 새 토큰으로 세션 업데이트
    const updatedSession = {
      ...session,
      accessToken: result.access_token,
      tokenExpires: Date.now() + (result.expires_in * 1000),
    };

    setSessionCookie(res, updatedSession);

    return res.json({
      success: true,
      expiresIn: result.expires_in,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
