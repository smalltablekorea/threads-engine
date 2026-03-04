// pages/api/publish.js
// 포스트 발행 + 댓글 4개 자동 작성

import { getSession } from '../../lib/auth';
import { publishPostWithComments } from '../../lib/threads';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'not_authenticated' });
  }

  const { content, comments } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }

  if (!comments || comments.length < 1) {
    return res.status(400).json({ error: 'comments array is required' });
  }

  try {
    console.log(`[Publish] Publishing post for @${session.username}...`);

    const result = await publishPostWithComments(
      session.userId,
      session.accessToken,
      content,
      comments.slice(0, 4) // 최대 4개 댓글
    );

    console.log(`[Publish] Success! Post ID: ${result.postId}, Comments: ${result.comments.length}`);

    return res.json({
      success: true,
      postId: result.postId,
      comments: result.comments,
    });
  } catch (error) {
    console.error('[Publish] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
