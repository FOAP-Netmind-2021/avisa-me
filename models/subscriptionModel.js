/* Requerimos de mongoose solo Schema y el model */
const {Schema, model} = require('mongoose');


const subscriptionSchema = new Schema(
    {
        user: {
             type: Schema.Types.ObjectId,
             ref: 'User'
        },
        account: {
            type: String,
            default: "Free"
        },
        limitWorkspace: {
            type: Number,
            default: 3
        },
        workspaces: [{
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
        }],
    }, 
    {
        timestamps: true,
        versionKey: false
    }
);


// Validación workspaces con el límite de la cuenta. En caso de atentar contra la base de datos
subscriptionSchema.path('workspaces').validate(function (value) {
    console.log(value.length)
    if (value.length > this.limitWorkspace) {  
      throw new Error("Has excedido el número de workspaces gratuitos!");
    }
  });

// Añade el workspace a la colección de la suscripción
subscriptionSchema.methods.addWorkspace = function(idWorkspace) {
    //validación workspaces con el límite de la cuenta.
    if (this.workspaces.length >= this.limitWorkspace) return false;
    this.workspaces.push(idWorkspace);
    return true;
}

subscriptionSchema.methods.deleteWorkspace = function(idWorkspace) {
    
    for(let i in this.workspaces){
        if(this.workspaces[i] == idWorkspace){
            this.workspaces.splice(i,1);
            break;
        } 
    }
}

// Cambia el tipo de cuenta del usuario
subscriptionSchema.methods.updateAccount = function(type) {
    this.account === type;
    return;
}




/* Asociamos la Colección con el Schema */
module.exports = model("Subscription", subscriptionSchema);