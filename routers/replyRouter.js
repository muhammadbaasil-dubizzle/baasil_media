const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');

router.post('/create_reply', replyController.createReply);
router.post('/delete_reply', replyController.deleteReply);
router.get('/get_replies', replyController.getReplies);

module.exports = router;
