const db = require('../models');
const { SERIALIZABLE, READ_COMMITTED } = require('../config/transactions');
const userView = require('../views/userView');

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      return await db.User.create({ name, email }, { transaction: t });
    });
    res.json(userView.one(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const user = await db.User.findOne({ where: { id: userId }, transaction: t });
      if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
      await db.User.destroy({ where: { id: userId }, transaction: t });
    });
    res.json({ message: 'User deleted' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      return await db.User.findAll({ transaction: t });
    });
    res.json(userView.many(users));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHighestPostCountUser = async (req, res) => {
  try {
    const topUser = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      return await db.User.findOne({
        attributes: [
          'id', 'name', 'email',
          [db.sequelize.fn('COUNT', db.sequelize.col('Posts.id')), 'postCount']
        ],
        include: [{ model: db.Post, attributes: [] }],
        group: ['User.id'],
        order: [[db.sequelize.literal('postCount'), 'DESC']],
        subQuery: false,
        transaction: t
      });
    });
    res.json(topUser ? topUser.get({ plain: true }) : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSecondHighestPostCountUser = async (req, res) => {
  try {
    const secondHighestUser = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      const users = await db.User.findAll({
        attributes: [
          'id', 'name', 'email',
          [db.sequelize.fn('COUNT', db.sequelize.col('Posts.id')), 'postCount']
        ],
        include: [{ model: db.Post, attributes: [] }],
        group: ['User.id'],
        order: [[db.sequelize.literal('postCount'), 'DESC']],
        subQuery: false,
        limit: 3,
        transaction: t
      });
      return users[1] || null;
    });
    res.json(secondHighestUser ? secondHighestUser.get({ plain: true }) : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
