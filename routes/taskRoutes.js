var express = require('express');
var taskControllers = require('../controllers/taskControllers');
var router = express.Router();

// Marcar tarea tarea como completada
router.get('/:idTask/completed', taskControllers.completedTask);

// Modificar una tarea

router.post('/updateTask', taskControllers.updateTask);


module.exports = router;