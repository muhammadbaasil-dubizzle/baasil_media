const db = require('../models');
const { SERIALIZABLE, READ_COMMITTED } = require('../config/transactions');
const connectionView = require('../views/connectionView');

exports.createConnection = async (req, res) => {
  try {
    const { requesterId, requesteeId } = req.body;
    const connection = await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const existingConnection = await db.Connections.findOne({ where: { requester_id: requesterId, requestee_id: requesteeId }, transaction: t });
      if (existingConnection) throw Object.assign(new Error('Connection already exists'), { status: 400 });
      return await db.Connections.create(
        { requester_id: requesterId, requestee_id: requesteeId },
        { transaction: t }
      );
    });
    res.json(connectionView.one(connection));
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.deleteConnection = async (req, res) => {
  try {
    const { connectionId } = req.body;
    await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const connection = await db.Connections.findOne({ where: { id: connectionId }, transaction: t });
      if (!connection) throw Object.assign(new Error('Connection not found'), { status: 404 });
      await db.Connections.destroy({ where: { id: connectionId }, transaction: t });
      if (connection.accepted) {
        await db.User.decrement('numConnections', { by: 1, where: { id: connection.requester_id }, transaction: t });
        await db.User.decrement('numConnections', { by: 1, where: { id: connection.requestee_id }, transaction: t });
      }
    });
    res.json({ message: 'Connection deleted' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.acceptConnection = async (req, res) => {
  try {
    const { requesterId, requesteeId } = req.body;
    await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const connection = await db.Connections.findOne({
        where: { requester_id: requesterId, requestee_id: requesteeId },
        transaction: t
      });
      if (!connection) throw Object.assign(new Error('Connection not found'), { status: 404 });
      if (connection.accepted) throw Object.assign(new Error('Connection already accepted'), { status: 400 });
      await db.Connections.update(
        { accepted: true },
        { where: { requester_id: requesterId, requestee_id: requesteeId }, transaction: t }
      );
      await db.User.increment('numConnections', { by: 1, where: { id: requesterId }, transaction: t });
      await db.User.increment('numConnections', { by: 1, where: { id: requesteeId }, transaction: t });
    });
    res.json({ message: 'Connection accepted' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getConnections = async (req, res) => {
  try {
    const { userId } = req.query;
    if (userId === undefined || userId === null || userId === '') {
      throw Object.assign(new Error('userId is required'), { status: 400 });
    }
    const connections = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      return await db.Connections.findAll({
        where: { requestee_id: userId, accepted: true },
        transaction: t
      });
    });
    res.json(connectionView.many(connections));
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getPendingConnections = async (req, res) => {
  try {
    const { userId } = req.query;
    if (userId === undefined || userId === null || userId === '') {
      throw Object.assign(new Error('userId is required'), { status: 400 });
    }
    const connections = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      return await db.Connections.findAll({
        where: { requestee_id: userId, accepted: false },
        transaction: t
      });
    });
    res.json(connectionView.many(connections));
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};
