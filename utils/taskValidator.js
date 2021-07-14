const {oneOf, body} = require('express-validator');


const createTask = [body('text').isLength({ max: 5000 }), body('title').isLength({ max: 140 })];
const emptyTask = oneOf([body('title').notEmpty(), body('text').notEmpty()])


module.exports = {createTask, emptyTask};
