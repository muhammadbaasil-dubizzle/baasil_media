const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const replyRouter = require('./replyRouter');
const connectionRouter = require('./connectionRouter');
const likeRouter = require('./likeRouter');

router.use('/', userRouter);
router.use('/', postRouter);
router.use('/', commentRouter);
router.use('/', replyRouter);
router.use('/', connectionRouter);
router.use('/', likeRouter);

module.exports = router;
