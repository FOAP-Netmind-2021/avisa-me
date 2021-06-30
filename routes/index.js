var express = require('express');

var router = express.Router();

var workspaceControllers = require('../controllers/workspaceControllers');

const { body} = require('express-validator');

/* GET home page. */
router.get('/', workspaceControllers.renderWorkspace);

router.get('/:idWorkspace', workspaceControllers.renderWorkspace);

router.post('/', body('text').isLength({ max: 5000 }), workspaceControllers.createWorkspace);

router.post("/addTask", body('text').isLength({ max: 5000 }), workspaceControllers.addTask);


module.exports = router;
