const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");


// Estrategia de REGISTRO
passport.use('local-signup', new LocalStrategy({
    usernameField: "email", // Por defecto LocalStrategy espera siempre usernameField y passwordField como parámetros.
    passwordField: "password", // Hay metódos para modificarlos
    passReqToCallback: true // Podremos acceder al request en la siguiente función de callback y usar el connect-flash.
}, async (req, email, password, done) => {

    const {confirm_password} = req.body 
    // Si el password no es idéntico al campo confirmar password, informamos.
    if(password !== confirm_password) return done(null, false, req.flash("error_msg", "Contraseñas no iguales."));
    // Buscar el email en la base de datos.
    const emailFounded = await userModel.findOne({email: email});
    // Informar si existe el email en la db.
    if(emailFounded) return done(null, false, req.flash("error_msg", "Este correo ya existe en la base de datos."));
    // Si todo es correcto, se crea el usuario y se loguea inmediatamente.
    const newUser = new userModel({email, password});
    newUser.password = await newUser.encryptPassword(password)
    await newUser.save();
    return done(null, newUser, req.flash("success_msg", `La cuenta '${newUser.email}' se ha registrado correctamente.`));
}));



// Estrategia de LOGIN
passport.use('local-login', new LocalStrategy({
    usernameField: "email", // Por defecto LocalStrategy espera siempre usernameField y passwordField como parámetros.
    passwordField: "password", // Hay metódos para modificarlos
    passReqToCallback: true // Podremos acceder al request en la siguiente función de callback y usar el connect-flash.
}, async (req, email, password, done) => {

    //Comprobar si existe el email del usuario
    const user = await userModel.findOne({email: email})
    // Si el correo no existe es que no existe el usuario. Informarmos del error.
    if(!user) return done(null, false, req.flash("error_msg", "No se ha encontrado el usuario."));
    //Comprobar si la contraseña es correcta
    const match = await user.comparePassword(password);
    // Si es correcta enviamos el usuario.
    if(match) return done(null, user) 
    // Si no lo es, mensaje de error.
    return done(null, false, req.flash("error_msg", "Contraseña incorrecta."));

}));


//Si el usuario se ha logueado correctamente, lo guardaremos en la session del servidor.
passport.serializeUser((user, done) => {
    done(null, user.id);
})


passport.deserializeUser(async (id, done) =>{
    const user = await userModel.findById(id);
    done(null, user);
})