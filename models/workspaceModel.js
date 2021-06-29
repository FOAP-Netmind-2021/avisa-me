
/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema({
    title : String,
    text : String, 
});

// Cada Espacio de Trabajo tiene una ID única y tiene incrustadas sus Notas asociadas.
const workspaceSchema = new Schema({
    url : String,
    tasks : [taskSchema], 
});

/* Asociamos la Colección con el Schema */
module.exports = model("Workspace", workspaceSchema);



