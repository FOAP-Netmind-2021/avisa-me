const express = require('express');
const router = express.Router();
const workspaceControllers = require('../controllers/workspaceControllers');

const taskValidator = require("../utils/taskValidator");

/* GET home page.*/
router.get('/', workspaceControllers.renderHome);

router.post('/', taskValidator.createTask , taskValidator.emptyTask, workspaceControllers.createWorkspace);

router.get('/:idWorkspace', workspaceControllers.renderWorkspace);

router.get('/team/hello', workspaceControllers.renderTeamPage);

router.post('/addTask',taskValidator.createTask, taskValidator.emptyTask, workspaceControllers.addTask);

router.get('/trashspace/:idWorkspace', workspaceControllers.renderTrashspace);

router.post('/delete/:idWorkspace', workspaceControllers.deleteWorkspace);

router.post('/edit/:idWorkspace', workspaceControllers.editWorkspace);






module.exports = router;
