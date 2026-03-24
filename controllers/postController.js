const db = require('../models');
const { SERIALIZABLE, READ_COMMITTED } = require('../config/transactions');
const postView = require('../views/postView');

exports.createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const post = await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const created = await db.Post.create({ title, content, userId }, { transaction: t });
      await db.User.increment('numPosts', { by: 1, where: { id: userId }, transaction: t });
      return created;
    });
    res.json(postView.one(post));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const post = await db.Post.findOne({ where: { id: postId }, transaction: t });
      if (!post) throw Object.assign(new Error('Post not found'), { status: 404 });
      await db.Post.destroy({ where: { id: postId }, transaction: t });
      await db.User.decrement('numPosts', { by: 1, where: { id: post.userId }, transaction: t });
    });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      return await db.Post.findAll({ transaction: t });
    });
    res.json(postView.many(posts));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
