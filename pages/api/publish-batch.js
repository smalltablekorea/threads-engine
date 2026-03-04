// pages/api/publish-batch.js
// 다중 포스트 일괄 발행 (순차 처리, rate limit 준수)

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

  const { posts } = req.body;
  // posts = [{ content, comments: [...], scheduledTime }]

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return res.status(400).json({ error: 'posts array is required' });
  }

  // Threads API rate limit: 250 posts / 24h, 50 publish calls / hour
  // 안전하게 포스트당 30초 간격
  const MAX_BATCH = 10; // 한 번에 최대 10개
  const batch = posts.slice(0, MAX_BATCH);

  const results = [];

  try {
    for (let i = 0; i < batch.length; i++) {
      const post = batch[i];

      console.log(`[Batch] Publishing ${i + 1}/${batch.length}: ${post.content.substring(0, 50)}...`);

      try {
        const result = await publishPostWithComments(
          session.userId,
          session.accessToken,
          post.content,
          post.comments || []
        );

        results.push({
          index: i,
          success: true,
          postId: result.postId,
          comments: result.comments,
        });
      } catch (err) {
        results.push({
          index: i,
          success: false,
          error: err.message,
        });
      }

      // Rate limit 방지: 포스트 간 30초 대기 (댓글 포함하면 각 포스트당 ~15초 소요)
      if (i < batch.length - 1) {
        await new Promise(r => setTimeout(r, 15000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`[Batch] Complete: ${successCount}/${batch.length} published`);

    return res.json({
      success: true,
      total: batch.length,
      published: successCount,
      results,
      remaining: posts.length - batch.length,
    });
  } catch (error) {
    console.error('[Batch] Error:', error);
    return res.status(500).json({ success: false, error: error.message, results });
  }
}
