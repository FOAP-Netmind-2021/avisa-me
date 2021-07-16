/* Requerimos de mongoose solo Shema y el model */
const {Schema, model} = require('mongoose');
const bcrypt = require("bcryptjs");

// Cada Nota tiene su propia ID única. 
const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "User"
        },
    }, 
    {
        timestamps: true,
        versionKey: false
    }
);


userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Salt: número de veces que aplica el algoritmo. Mayor número, más recursos gasta. 10 es por defecto.
    return await bcrypt.hash(password, salt); // Cifra la contraseña y aplica el salt. 
}

userSchema.methods.comparePassword = async function(password) {
    console.log(password);
    return await bcrypt.compare(password, this.password); // Compara la contraseña que nos envía el user y compara. Boleano.
}

/* Asociamos la Colección con el Schema */
module.exports = model("User", userSchema);