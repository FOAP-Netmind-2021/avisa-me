/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

//Si se ha escrito en el input, valida que no nos hayan insertado sólo espacios en blanco:
function validator (val){
    if(val.length > 0){
        return /\S/.test(val); //Devuelve 'true' si encuentra cualquier caracter que NO es un espacio en blanco.
    }else{
        return true;
    }
    
}

//Iniciamos la constante 'custon'; contiene la función de validación y un mensaje personalizado:
const custom = [validator, 'Oh oh, sólo has introducido espacios!!!!!'];

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema(
    {
        title : {
            type: String,
            maxlength: 140,
            validate: custom, 
            required:function(){
           return this.text.length == 0;
        }},
        text : {
            type: String,
            maxlength: 5000,
            validate: custom,
            required:function(){
            return this.title.length == 0;
        }},
        trashed: {
            type: Boolean,
            default: false
        },
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