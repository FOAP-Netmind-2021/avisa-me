var express = require('express');

var router = express.Router();

var workspaceControllers = require('../controllers/workspaceControllers');

const { body} = require('express-validator');

/* GET home page. */
router.get('/', workspaceControllers.renderWorkspace);

router.get('/:idWorkspace', workspaceControllers.renderWorkspace);

router.post('/', body('text').isLength({ max: 5000 }), body('title').isLength({ max: 140 }), workspaceControllers.createWorkspace);

router.post("/addTask", body('text').isLength({ max: 5000 }), body('title').isLength({ max: 140 }), workspaceControllers.addTask);

router.get("/settings/:idWorkspace", workspaceControllers.renderSettings);

router.post("/settings/:idWorkspace", workspaceControllers.updateSettings);

module.exports = router;

