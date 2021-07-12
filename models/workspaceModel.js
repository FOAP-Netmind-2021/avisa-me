
/* Requerimos de mongoose solo Shema y el model */
const { Schema, model } = require('mongoose');

// Cada Nota tiene su propia ID única. 
const taskSchema = new Schema({
    title : {type: String, maxlength: 140},
    text : {type: String, maxlength: 5000},
    finishedDate: {type: Date},
});

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



// Cada Espacio de Trabajo tiene una ID única y tiene incrustadas sus Notas asociadas.
const workspaceSchema = new Schema({
    tasks: [taskSchema],
});

/* Asociamos la Colección con el Schema */
module.exports = model("Workspace", workspaceSchema);



