const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create_user', userController.createUser);
router.post('/delete_user', userController.deleteUser);
router.get('/get_users', userController.getUsers);
router.get('/get_highest_post_count_user', userController.getHighestPostCountUser);
router.get('/get_second_highest_post_count_user', userController.getSecondHighestPostCountUser);

module.exports = router;
