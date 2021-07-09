/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema({
    title : {type: String, maxlength: 140},
    text : {type: String, maxlength: 5000},
    createdAt : { type: Date, default: Date.now()},
    finished: {type: Boolean, default: false},
    finishedDate: {type: Date},
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' }
});

/* Asociamos la Colección con el Schema */
module.exports = model("Task", taskSchema);