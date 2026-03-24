const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/create_like', likeController.createLike);
router.post('/remove_like', likeController.removeLike);
router.get('/get_likes', likeController.getLikes);

module.exports = router;
