function one(reply) {
  if (!reply || typeof reply.get !== 'function') return null;
  return reply.get({ plain: true });
}

function many(replies) {
  if (!Array.isArray(replies)) return [];
  return replies.map(one).filter(Boolean);
}

module.exports = { one, many };
