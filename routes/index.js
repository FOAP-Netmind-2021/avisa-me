var express = require('express');

var router = express.Router();

var workspaceControllers = require('../controllers/workspaceControllers');

/* GET home page. */
router.get('/', workspaceControllers.renderHome);

module.exports = router;
