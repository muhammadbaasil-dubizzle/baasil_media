const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/create_post', postController.createPost);
router.post('/delete_post', postController.deletePost);
router.get('/get_posts', postController.getPosts);

module.exports = router;
