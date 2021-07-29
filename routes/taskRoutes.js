const express = require('express');
const taskControllers = require('../controllers/taskControllers');
const router = express.Router();

// Marcar nota como completada
router.get('/:idTask/completed', taskControllers.completedTask);
// Desmarcar nota completada
router.get('/:idTask/uncompleted', taskControllers.uncompletedTask);
// Actualizar nota
router.post('/updateTask', taskControllers.updateTask);
// Actualizar color nota
router.post('/updateTaskColores', taskControllers.updateTaskColores);
// Enviar la nota a la papelera
router.post('/trashedTask', taskControllers.trashedTask);
// Restaurar la nota de la papelera
router.post('/restoreTask', taskControllers.restoreTask);
// Eliminar definitivamente una nota
router.post('/deleteTask', taskControllers.deleteTask);
// Eliminar definitivamente todas las notas de la papelera
router.post('/deleteTrashedTasks', taskControllers.deleteTrashedTasks);
// Actualizar la fecha de recordatorio
router.post('/updateReminderDate', taskControllers.updateReminderDate);
// Eliminar la fecha de recordatorio
router.post('/deleteReminderDate', taskControllers.deleteReminderDate);

module.exports = router;