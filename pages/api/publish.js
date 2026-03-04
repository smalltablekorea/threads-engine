// pages/api/publish.js
const THREADS_API = 'https://graph.threads.net/v1.0';

async function publishPost(userId, accessToken, text) {
  const createRes = await fetch(`${THREADS_API}/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ media_type: 'TEXT', text, access_token: accessToken }),
  });
  const createData = await createRes.json();
  if (createData.error) throw new Error(createData.error.message);
  await new Promise(r => setTimeout(r, 2000));
  const publishRes = await fetch(`${THREADS_API}/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: createData.id, access_token: accessToken }),
  });
  const publishData = await publishRes.json();
  if (publishData.error) throw new Error(publishData.error.message);
  return publishData;
}

async function replyToPost(userId, accessToken, replyToId, text) {
  const createRes = await fetch(`${THREADS_API}/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ media_type: 'TEXT', text, reply_to_id: replyToId, access_token: accessToken }),
  });
  const createData = await createRes.json();
  if (createData.error) throw new Error(createData.error.message);
  await new Promise(r => setTimeout(r, 1500));
  const publishRes = await fetch(`${THREADS_API}/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: createData.id, access_token: accessToken }),
  });
  const publishData = await publishRes.json();
  if (publishData.error) throw new Error(publishData.error.message);
  return publishData;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const accessToken = req.body.accessToken || process.env.THREADS_ACCESS_TOKEN;
  const { content, comments } = req.body;

  if (!accessToken) return res.status(401).json({ error: 'Access token required' });
  if (!content) return res.status(400).json({ error: 'Content required' });

  try {
    const profileRes = await fetch(`${THREADS_API}/me?fields=id,username&access_token=${accessToken}`);
    const profile = await profileRes.json();
    if (profile.error) return res.status(401).json({ error: profile.error.message });

    const userId = profile.id;
    const post = await publishPost(userId, accessToken, content);

    const commentResults = [];
    if (comments && comments.length > 0) {
      for (let i = 0; i < Math.min(comments.length, 4); i++) {
        await new Promise(r => setTimeout(r, 3000));
        try {
          const reply = await replyToPost(userId, accessToken, post.id, comments[i]);
          commentResults.push({ index: i, success: true, id: reply.id });
        } catch (err) {
          commentResults.push({ index: i, success: false, error: err.message });
        }
      }
    }

    return res.json({ success: true, postId: post.id, username: profile.username, comments: commentResults });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
