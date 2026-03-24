const db = require('../models');
const { SERIALIZABLE } = require('../config/transactions');
const commentView = require('../views/commentView');

exports.createComment = async (req, res) => {
  try {
    const { text, userId, postId } = req.body;
    const comment = await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const created = await db.Comments.create({ text, userId, postId }, { transaction: t });
      await db.Post.increment('numComments', { by: 1, where: { id: postId }, transaction: t });
      return created;
    });
    res.json(commentView.one(comment));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    await db.sequelize.transaction(SERIALIZABLE, async (t) => {
      const comment = await db.Comments.findOne({ where: { id: commentId }, transaction: t });
      if (!comment) throw Object.assign(new Error('Comment not found'), { status: 404 });
      await db.Comments.destroy({ where: { id: commentId }, transaction: t });
      await db.Post.decrement('numComments', { by: 1, where: { id: comment.postId }, transaction: t });
    });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
};
