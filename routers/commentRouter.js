const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/create_comment', commentController.createComment);
router.post('/delete_comment', commentController.deleteComment);

module.exports = router;
