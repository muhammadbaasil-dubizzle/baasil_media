function one(user) {
  if (!user || typeof user.get !== 'function') return null;
  return user.get({ plain: true });
}

function many(users) {
  if (!Array.isArray(users)) return [];
  return users.map(one).filter(Boolean);
}

module.exports = { one, many };
