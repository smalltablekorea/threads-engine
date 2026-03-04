// pages/api/publish-batch.js
const THREADS_API = 'https://graph.threads.net/v1.0';

async function publishPost(userId, token, text) {
  const cr = await fetch(`${THREADS_API}/${userId}/threads`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({media_type:'TEXT',text,access_token:token}) });
  const cd = await cr.json(); if(cd.error) throw new Error(cd.error.message);
  await new Promise(r=>setTimeout(r,2000));
  const pr = await fetch(`${THREADS_API}/${userId}/threads_publish`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({creation_id:cd.id,access_token:token}) });
  const pd = await pr.json(); if(pd.error) throw new Error(pd.error.message);
  return pd;
}

async function replyToPost(userId, token, replyToId, text) {
  const cr = await fetch(`${THREADS_API}/${userId}/threads`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({media_type:'TEXT',text,reply_to_id:replyToId,access_token:token}) });
  const cd = await cr.json(); if(cd.error) throw new Error(cd.error.message);
  await new Promise(r=>setTimeout(r,1500));
  const pr = await fetch(`${THREADS_API}/${userId}/threads_publish`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({creation_id:cd.id,access_token:token}) });
  const pd = await pr.json(); if(pd.error) throw new Error(pd.error.message);
  return pd;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const accessToken = req.body.accessToken || process.env.THREADS_ACCESS_TOKEN;
  const { posts } = req.body;

  if (!accessToken) return res.status(401).json({ error: 'Token required' });
  if (!posts || !Array.isArray(posts) || posts.length === 0) return res.status(400).json({ error: 'posts required' });

  const profileRes = await fetch(`${THREADS_API}/me?fields=id,username&access_token=${accessToken}`);
  const profile = await profileRes.json();
  if (profile.error) return res.status(401).json({ error: profile.error.message });
  const userId = profile.id;

  const MAX_BATCH = 10;
  const batch = posts.slice(0, MAX_BATCH);
  const results = [];

  for (let i = 0; i < batch.length; i++) {
    const p = batch[i];
    try {
      const post = await publishPost(userId, accessToken, p.content);
      const commentResults = [];
      if (p.comments) {
        for (let j = 0; j < Math.min(p.comments.length, 4); j++) {
          await new Promise(r => setTimeout(r, 3000));
          try {
            const reply = await replyToPost(userId, accessToken, post.id, p.comments[j]);
            commentResults.push({ index: j, success: true, id: reply.id });
          } catch (e) { commentResults.push({ index: j, success: false, error: e.message }); }
        }
      }
      results.push({ index: i, success: true, postId: post.id, comments: commentResults });
    } catch (e) { results.push({ index: i, success: false, error: e.message }); }
    if (i < batch.length - 1) await new Promise(r => setTimeout(r, 15000));
  }

  return res.json({ success: true, total: batch.length, published: results.filter(r=>r.success).length, results });
}
