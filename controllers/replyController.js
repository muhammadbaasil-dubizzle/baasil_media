const db = require('../models');
const { SERIALIZABLE, READ_COMMITTED } = require('../config/transactions');
const replyView = require('../views/replyView');

exports.createReply = async (req, res) => {
  try {
    const { text, userId, postId } = req.body;
    const reply = await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const comment = await db.Comments.create({ text, userId, postId }, { transaction: t });
      await db.Post.increment('numComments', { by: 1, where: { id: postId }, transaction: t });
      return await db.Replies.create({ text, commentId: comment.id }, { transaction: t });
    });
    res.json(replyView.one(reply));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const { replyId, commentId } = req.body;
    await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const comment = await db.Comments.findOne({ where: { id: commentId }, transaction: t });
      if (!comment) throw Object.assign(new Error('Comment not found'), { status: 404 });
      const reply = await db.Replies.findOne({ where: { id: replyId }, transaction: t });
      if (!reply) throw Object.assign(new Error('Reply not found'), { status: 404 });
      await db.Replies.destroy({ where: { id: replyId }, transaction: t });
      await db.Comments.destroy({ where: { id: commentId }, transaction: t });
      await db.Post.decrement('numComments', { by: 1, where: { id: comment.postId }, transaction: t });
    });
    res.json({ message: 'Reply deleted' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getReplies = async (req, res) => {
  try {
    const { commentId } = req.query;
    const replies = await db.sequelize.transaction(READ_COMMITTED, async (t) => {
      return await db.Replies.findAll({ where: { commentId }, transaction: t });
    });
    res.json(replyView.many(replies));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
