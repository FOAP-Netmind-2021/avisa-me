
/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema({
    title : {type: String, maxlength: 140},
    text : {type: String, maxlength: 5000},
    finishedDate: {type: Date},
});

// Cada Espacio de Trabajo tiene una ID única y tiene incrustadas sus Notas asociadas.
const workspaceSchema = new Schema({
    tasks : [taskSchema], 
});

/* Asociamos la Colección con el Schema */
module.exports = model("Workspace", workspaceSchema);



