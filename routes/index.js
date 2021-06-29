var express = require('express');

var router = express.Router();

var workspaceControllers = require('../controllers/workspaceControllers');

/* GET home page. */
router.get('/', workspaceControllers.renderHome);

router.get('/:idWorkspace', workspaceControllers.renderWorkspace);

router.post('/', workspaceControllers.createWorkspace )

module.exports = router;
