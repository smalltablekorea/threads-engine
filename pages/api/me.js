// pages/api/me.js
// 현재 로그인된 사용자 정보 반환

import { getSession } from '../../lib/auth';
import { validateToken } from '../../lib/threads';

export default async function handler(req, res) {
  const session = getSession(req);

  if (!session) {
    return res.status(401).json({ error: 'not_authenticated' });
  }

  // 토큰 만료 확인
  if (session.tokenExpires && Date.now() > session.tokenExpires) {
    return res.status(401).json({ error: 'token_expired' });
  }

  return res.json({
    userId: session.userId,
    username: session.username,
    displayName: session.displayName,
    profilePic: session.profilePic,
    tokenExpires: session.tokenExpires,
  });
}
