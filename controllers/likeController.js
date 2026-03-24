const db = require('../models');
const { SERIALIZABLE, READ_COMMITTED } = require('../config/transactions');
const likeView = require('../views/likeView');

exports.createLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const like = await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const like = await db.Likes.findOne({ where: { userId, postId }, transaction: t });
      if (like) throw Object.assign(new Error('Like already exists'), { status: 400 });
      const created = await db.Likes.create({ userId, postId }, { transaction: t });
      await db.Post.increment('numLikes', { by: 1, where: { id: postId }, transaction: t });
      return created;
    });
    res.json(likeView.one(like));
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const like = await db.Likes.findOne({ where: { userId, postId }, transaction: t });
      if (!like) throw Object.assign(new Error('Like not found'), { status: 404 });
      await db.Likes.destroy({ where: { id: like.id }, transaction: t });
      await db.Post.decrement('numLikes', { by: 1, where: { id: postId }, transaction: t });
    });
    res.json({ message: 'Like removed' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { postId } = req.query;
    const likes = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      return await db.Likes.findAll({ where: { postId: postId }, transaction: t });
    });
    res.json(likeView.many(likes));
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};
