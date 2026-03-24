const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

router.post('/create_connection', connectionController.createConnection);
router.post('/delete_connection', connectionController.deleteConnection);
router.post('/accept_connection', connectionController.acceptConnection);
router.get('/get_connections', connectionController.getConnections);
router.get('/get_pending_connections', connectionController.getPendingConnections);

module.exports = router;
