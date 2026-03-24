function one(comment) {
  if (!comment || typeof comment.get !== 'function') return null;
  return comment.get({ plain: true });
}

function many(comments) {
  if (!Array.isArray(comments)) return [];
  return comments.map(one).filter(Boolean);
}

module.exports = { one, many };
