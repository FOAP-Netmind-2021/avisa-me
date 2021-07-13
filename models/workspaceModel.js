
/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema({
    title : {type: String, maxlength: 140},
    text : {type: String, maxlength: 5000},
    finishedDate: {type: Date},
});

// Cada Workspace tiene un objeto Settings
const settingSchema = new Schema({
    hideCompletedTask : {
        type: Boolean,
        default: false 
      },
})

// Cada Espacio de Trabajo tiene una ID única y tiene incrustadas sus Notas asociadas.
const workspaceSchema = new Schema({
    tasks : [taskSchema],
    settings: {
        type: settingSchema,
        default: {}
    }
});

/* Asociamos la Colección con el Schema */
module.exports = model("Workspace", workspaceSchema);



