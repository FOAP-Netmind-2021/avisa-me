/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');
const taskModel = require('./taskModel');

// Cada Workspace tiene un objeto Settings
const settingSchema = new Schema({
    hideCompletedTask : {
        type: Boolean,
        default: false 
    },
    visibility: {
        type: Boolean,
        default: true
    }
})


const workspaceSchema = new Schema(
    {
        name: {type: String, default: "Free workspace"},
        subscription: {
            type: Schema.Types.ObjectId,
            ref: 'Subscription'
        },
        settings: {
            type: settingSchema,
            default: {}
        },
        tasks: [{
            type: Schema.Types.ObjectId,
            ref: 'Task',
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Añade el workspace a la colección de la suscripción
workspaceSchema.methods.addTask = function(idTask) {
    this.tasks.push(idTask);
    return;
}

workspaceSchema.methods.deleteTask = function(idTask) {
    for(let i in this.tasks){
        if(this.tasks[i] == idTask){
            this.tasks.splice(i,1);
            break;
        } 
    }
}

workspaceSchema.statics.getAllTasks = async function (id){
    return await taskModel.find({workspace: id });
}

workspaceSchema.statics.getCompletedTasks = async function (id){
    return await taskModel.find({workspace: id, finishedDate : { $exists: true } });
}

workspaceSchema.statics.getActiveTasks = async function (id){
    return await taskModel.find({workspace: id, finishedDate : { $exists: false } });
}

workspaceSchema.statics.getTrashedTasks = async function (id){
    return await taskModel.find({workspace: id, trashed : true });
}

workspaceSchema.statics.getUntrashedTasks = async function (id){
    return await taskModel.find({workspace: id, trashed : false });
}

workspaceSchema.statics.getDetails = async function (id){

    const tasks = {}
    tasks.all = await this.getAllTasks(id);
    tasks.completed = await this.getCompletedTasks(id);
    tasks.active = await this.getActiveTasks(id);
    return tasks;
}

workspaceSchema.methods.changeName = function(name){
    return this.name = name;
}

workspaceSchema.methods.updateVisibility = function (type){
    this.settings.visibility = type;
}


/* Asociamos la Colección con el Schema */
module.exports = model("Workspace", workspaceSchema);