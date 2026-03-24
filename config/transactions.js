const { Transaction } = require('sequelize');

module.exports = {
  SERIALIZABLE: { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
  READ_COMMITTED: { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }
};
