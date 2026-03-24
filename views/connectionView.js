function one(connection) {
  if (!connection || typeof connection.get !== 'function') return null;
  return connection.get({ plain: true });
}

function many(connections) {
  if (!Array.isArray(connections)) return [];
  return connections.map(one).filter(Boolean);
}

module.exports = { one, many };
