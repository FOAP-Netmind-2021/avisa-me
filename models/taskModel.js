/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema({
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
    createdAt : { type: Date, default: Date.now()},
    finishedDate: {type: Date},
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    reminderDate: { type: Date}
});

/* Asociamos la Colección con el Schema */
module.exports = model("Task", taskSchema);


//---------------INICIO pruebas Validar---------------------------------------------
// Cada Nota tiene su propia ID única. 
/* const taskSchema = new Schema({
    title: {
        type: String,
        maxlength: 140,
        validate: {
            validator: function (title) {
                if (title.length == 0) {
                    console.log("Has dejado el campo titulo vacio---------------------------->")
                    //return false;
                }
            }
        }
    },
    text: {
        type: String,
        maxlength: 5000,
        validate: {
            validator: function (text) {
                if (text.length == 0) {
                    console.log("Has dejado el campo texto vacio")
                    //return false;
                }
            }
        }
    },
    finishedDate: { type: Date },
}); */


//---------------FIN pruebas Validar-----------------------------------------------
