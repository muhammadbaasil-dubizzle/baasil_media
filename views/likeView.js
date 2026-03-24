function one(like) {
  if (!like || typeof like.get !== 'function') return null;
  return like.get({ plain: true });
}

function many(likes) {
  if (!Array.isArray(likes)) return [];
  return likes.map(one).filter(Boolean);
}

module.exports = { one, many };
