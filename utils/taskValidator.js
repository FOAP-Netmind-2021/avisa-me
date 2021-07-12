const {body} = require('express-validator');


const createTask = [body('text').isLength({ max: 5000 }), body('title').isLength({ max: 140 })];






module.exports = {createTask};