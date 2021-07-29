/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

<<<<<<< HEAD

//Iniciamos la constante 'custom'; contiene la función de validación y un mensaje personalizado:
const custom = [validator, 'Oh oh, sólo has introducido espacios en un campo!!!!!'];

=======
>>>>>>> e5afb90ea35cfe13dc5cfc8399fce55f77804406
// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema(
    {
        title : {
            type: String,
            maxlength: 140,
            validate: {
                validator: function (val){
                    //let texto = /\S/.test(this.text);
                    if (/\S/.test(this.text)){
                        return;
                    }else{
                        return /\S/.test(this.title);
                    }
                }
            },
            required:function(){
            return this.text.length == 0;
        }},
        text : {
            type: String,
            maxlength: 5000,
            validate: {
                validator: function (val){
                   // let texto = /\S/.test(this.title);
                    if (/\S/.test(this.title)){
                        return;
                    }else{
                        return /\S/.test(this.text);
                    }
                }
            },
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


//Si se ha escrito en el input, valida que no nos hayan insertado sólo espacios en blanco:
function validator (val){
    if(val.length > 0) return /\S/.test(val); //Devuelve 'true' si encuentra cualquier caracter que NO es un espacio en blanco.
}

/* Asociamos la Colección con el Schema */
module.exports = model("Task", taskSchema);