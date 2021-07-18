/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');
const taskModel = require('./taskModel');

// Cada Workspace tiene un objeto Settings
const settingSchema = new Schema({
    hideCompletedTask : {
        type: Boolean,
        default: false 
    },
    private: {
        type: Boolean,
        default: false
    }
})

// Cada Espacio de Trabajo tiene una ID única y tiene incrustadas sus Notas asociadas.
const workspaceSchema = new Schema({
    name: {type: String, default: "Free workspace"},
    settings: {
        type: settingSchema,
        default: {}
    }
});


workspaceSchema.statics.getAllTasks = async function (id){
    return await taskModel.find({workspace: id });
}

workspaceSchema.methods.changeName = function (name){
    this.name = name;
}


/* Asociamos la Colección con el Schema */
module.exports = model("Workspace", workspaceSchema);