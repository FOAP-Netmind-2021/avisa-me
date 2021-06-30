var express = require('express');

var router = express.Router();

var workspaceControllers = require('../controllers/workspaceControllers');

/* GET home page. */
router.get('/', workspaceControllers.renderWorkspace);

router.get('/:idWorkspace', workspaceControllers.renderWorkspace);

router.post('/', workspaceControllers.createWorkspace);

router.post("/addTask", workspaceControllers.addTask)

module.exports = router;
