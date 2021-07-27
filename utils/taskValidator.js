const {oneOf, body} = require('express-validator');


const createTask = [body('text').isLength({ max: 5000 }), body('title').isLength({ max: 140 })];
//const emptyTask = oneOf([body('title').notEmpty(), body('text').notEmpty()])

//La tarea no se creará si esta vacia(o lo parece, por espacios en blanco):
const emptyTask = oneOf([
    body('title').notEmpty().custom((val) => /\S/.test(val)), 
    body('text').notEmpty().custom((val) => /\S/.test(val))
]);

module.exports = {createTask, emptyTask};
