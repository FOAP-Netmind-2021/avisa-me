/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema(
    {
        title : {
            type: String,
            maxlength: 140,
            required:function(){
            return this.text.length == 0;
        }},
        text : {
            type: String,
            maxlength: 5000,
            required:function(){
                return this.title.length == 0;
            }},
        color: {
            type: String    
        },
        finishedDate: {type: Date},
        workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
        reminderDate: { type: Date},
        reminderNotification: {type: Date, default:null}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/* Asociamos la Colección con el Schema */
module.exports = model("Task", taskSchema);