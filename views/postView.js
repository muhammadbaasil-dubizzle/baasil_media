function one(post) {
  if (!post || typeof post.get !== 'function') return null;
  return post.get({ plain: true });
}

function many(posts) {
  if (!Array.isArray(posts)) return [];
  return posts.map(one).filter(Boolean);
}

module.exports = { one, many };
