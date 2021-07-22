const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");
const subscriptionModel = require("../models/subscriptionModel");
const workspaceModel = require("../models/workspaceModel");


// Estrategia de REGISTRO
passport.use('local-signup', new LocalStrategy({
    usernameField: "email", // Por defecto LocalStrategy espera siempre usernameField y passwordField como parámetros.
    passwordField: "password", // Hay metódos para modificarlos
    passReqToCallback: true // Podremos acceder al request en la siguiente función de callback y usar el connect-flash.
}, async (req, email, password, done) => {

    const {confirm_password} = req.body 
    // Si el password no es idéntico al campo confirmar password, informamos.
    if(password !== confirm_password) return done(null, false, req.flash("error_msg", "Las contraseñas no son iguales."));
    // Buscar el email en la base de datos.
    const emailFounded = await userModel.findOne({email: email});
    // Informar si existe el email en la db.
    if(emailFounded) return done(null, false, req.flash("error_msg", "Este correo ya existe en la base de datos. Pruebe con otro."));
    // Si todo es correcto, se crea el usuario
    const newUser = new userModel({email, password});
    // Encriptamos su contraseña con el método del modelo
    newUser.password = await newUser.encryptPassword(password)
    // Creamos una suscripción nueva
    const newSubscription = new subscriptionModel({user: newUser._id});
    // Asociamos la suscripción al usuario
    newUser.subscription = newSubscription._id;

    // Si se accede al REGISTRO mediante el quédatelo (workspace)
    const {idWorkspace} = req.body;

    // Si nos envian el id del worksapce y lo demás es correcto
    if(idWorkspace) {
        const workspace = await workspaceModel.findById(idWorkspace); // Buscamos el workspace
        newSubscription.addWorkspace(idWorkspace); // Añadimos el workspace a la suscripción del usuario
        workspace.updateVisibility(false); // Privatizamos
        workspace.subscription = newSubscription._id; // Le añadimos a la suscripción que pertenece
        // Guardamos e informamos
        await workspace.save();
        await newSubscription.save();
        await newUser.save();

        return done(null, newUser, req.flash("success_msg", `La cuenta '${newUser.email}' se ha registrado correctamente y se le ha añadido el workspace a su colección.`));
    }

    // Si no nos envían un workspace para asociar al registro, continuará guardando al usuario y la suscripción
    await newSubscription.save();
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

    // Si se accede al LOGIN mediante el quédatelo (workspace) y la contraseña es correcta
    const {idWorkspace} = req.body
    // Si nos envian el id del worksapce y la contraseña del login es correcta
    if(idWorkspace && match){
        // Buscamos la suscripción del usuario
        const userSubscription = await subscriptionModel.findOne({user : user._id});
        // Miramos si en la suscripción es posible añadirlo
        const isPossibleToAdd = userSubscription.addWorkspace(idWorkspace);
        // Si no es posible, devolvemos el usuario a su perfil e informamos.
        if(!isPossibleToAdd){
            return done(null, user, req.flash("error_msg", "Ya tiene 3 workspaces asociados a esta cuenta! Hágase premium para disfrutar sin límites!"))
        }
        // Si es posible, buscamos el workspace
        const workspace = await workspaceModel.findById(idWorkspace);
        workspace.updateVisibility(false); // Privatizamos
        workspace.subscription = userSubscription._id; // Le añadimos a la suscripción que pertenece
        // Guardamos cambios
        await workspace.save();
        await userSubscription.save();

        return done(null, user,  req.flash("success_msg", "Se ha añadido el workspace a su cuenta!"))
    }


    // Si no nos envían un workspace para asociar allogin y la contraseña es correcta enviamos el usuario.
    if(match) return done(null, user) 
    // Si no lo es, mensaje de error.
    return done(null, false, req.flash("error_msg", "Contraseña incorrecta."));

}));


// Determina qué datos del objeto de usuario deben almacenarse en la sesión.
passport.serializeUser((user, done) => {
    done(null, user._id);
})

// Se utiliza para recuperar datos de usuario de la sesión.
passport.deserializeUser(async (id, done) =>{
    const user = await userModel.findById(id);
    done(null, user);
})