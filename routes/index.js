const express = require('express');
const router = express.Router();
const workspaceControllers = require('../controllers/workspaceControllers');
const notificationControllers = require("../controllers/notificationControllers");
const taskValidator = require("../utils/taskValidator");

/* GET home page. */
router.get('/', workspaceControllers.renderHome);

router.post('/', taskValidator.createTask , taskValidator.emptyTask, workspaceControllers.createWorkspace);

router.get('/:idWorkspace', workspaceControllers.renderWorkspace);

router.post('/addTask',taskValidator.createTask, taskValidator.emptyTask, workspaceControllers.addTask);

router.get("/enviar-notificaciones", notificationControllers.reminderNotification)

module.exports = router;
