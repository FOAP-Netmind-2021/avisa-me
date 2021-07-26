const express = require('express');
const router = express.Router();
const workspaceControllers = require('../controllers/workspaceControllers');

const taskValidator = require("../utils/taskValidator");

// Renderiza el index
router.get('/', workspaceControllers.renderHome);
// Crea el workspace con o sin primera nota
router.post('/', taskValidator.createTask , taskValidator.emptyTask, workspaceControllers.createWorkspace);
// Renderiza el workspace
router.get('/:idWorkspace', workspaceControllers.renderWorkspace);
// Renderiza la página del equipo
router.get('/team/hello', workspaceControllers.renderTeamPage);
// Crea una nota
router.post('/addTask',taskValidator.createTask, taskValidator.emptyTask, workspaceControllers.addTask);
// Renderiza la papelera
router.get('/trashspace/:idWorkspace', workspaceControllers.renderTrashspace);
// Elimina un workspace
router.post('/delete/:idWorkspace', workspaceControllers.deleteWorkspace);
// Edita un workspace
router.post('/edit/:idWorkspace', workspaceControllers.editWorkspace);



module.exports = router;
