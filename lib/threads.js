// lib/threads.js
// Threads API 호출 헬퍼 함수들

const THREADS_API = 'https://graph.threads.net/v1.0';

/**
 * 단문 텍스트 포스트 발행
 * Step 1: 미디어 컨테이너 생성 → Step 2: 발행
 */
export async function publishPost(userId, accessToken, text) {
  // Step 1: Create media container
  const createRes = await fetch(`${THREADS_API}/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'TEXT',
      text: text,
      access_token: accessToken,
    }),
  });

  const createData = await createRes.json();
  if (createData.error) {
    throw new Error(`Container creation failed: ${createData.error.message}`);
  }

  const containerId = createData.id;

  // Step 2: Wait a moment then publish
  await new Promise(r => setTimeout(r, 2000));

  const publishRes = await fetch(`${THREADS_API}/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: accessToken,
    }),
  });

  const publishData = await publishRes.json();
  if (publishData.error) {
    throw new Error(`Publish failed: ${publishData.error.message}`);
  }

  return publishData; // { id: "thread_id" }
}

/**
 * 특정 포스트에 댓글(reply) 달기
 */
export async function replyToPost(userId, accessToken, replyToId, text) {
  // Step 1: Create reply container
  const createRes = await fetch(`${THREADS_API}/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'TEXT',
      text: text,
      reply_to_id: replyToId,
      access_token: accessToken,
    }),
  });

  const createData = await createRes.json();
  if (createData.error) {
    throw new Error(`Reply container failed: ${createData.error.message}`);
  }

  const containerId = createData.id;

  // Step 2: Publish the reply
  await new Promise(r => setTimeout(r, 1500));

  const publishRes = await fetch(`${THREADS_API}/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: accessToken,
    }),
  });

  const publishData = await publishRes.json();
  if (publishData.error) {
    throw new Error(`Reply publish failed: ${publishData.error.message}`);
  }

  return publishData;
}

/**
 * 포스트 + 댓글 4개 한번에 발행
 */
export async function publishPostWithComments(userId, accessToken, content, comments) {
  // 1. 메인 포스트 발행
  const post = await publishPost(userId, accessToken, content);
  const threadId = post.id;

  // 2. 댓글 4개 순차적으로 발행 (rate limit 방지를 위해 간격 두기)
  const commentResults = [];
  for (let i = 0; i < comments.length; i++) {
    await new Promise(r => setTimeout(r, 3000)); // 3초 간격
    try {
      const reply = await replyToPost(userId, accessToken, threadId, comments[i]);
      commentResults.push({ index: i, success: true, id: reply.id });
    } catch (err) {
      commentResults.push({ index: i, success: false, error: err.message });
    }
  }

  return {
    postId: threadId,
    comments: commentResults,
  };
}

/**
 * 사용자 프로필 조회
 */
export async function getUserProfile(accessToken) {
  const res = await fetch(
    `${THREADS_API}/me?fields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${accessToken}`
  );
  return res.json();
}

/**
 * 토큰 유효성 확인
 */
export async function validateToken(accessToken) {
  try {
    const profile = await getUserProfile(accessToken);
    return !profile.error;
  } catch {
    return false;
  }
}

/**
 * 장기 토큰 갱신 (만료 전에 호출)
 */
export async function refreshLongLivedToken(accessToken) {
  const res = await fetch(
    `${THREADS_API}/refresh_access_token?grant_type=th_refresh_token&access_token=${accessToken}`
  );
  return res.json();
}
