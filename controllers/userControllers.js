const passport = require("passport");
const userModel = require("../models/userModel");
const workspaceModel = require("../models/workspaceModel");
const subscriptionModel = require("../models/subscriptionModel");
var crypto = require('crypto');
const {sendEmail} = require("../utils/nodemailer");
const {mailTemplate} = require("../utils/mailTemplate");


// Renderiza la página de autenticación. Login. GET
exports.renderLogin = async (req, res) => {
    // Si el usuario está autenticado, no puede volver a loguearse. A su perfil de usuario.
    if(req.isAuthenticated()) return res.redirect("/user/profile");

    // Recuperamos el id del workspace, en caso de haber accedido a través del enlace del quédatelo!
    const {idWorkspace} = req.params;

    try{ // Si alguien introduce un string, no puede castearlo como ID

        // Buscamos el workspace
        const workspace = await workspaceModel.findById(idWorkspace);
        // Si existe el workspace y no tiene suscripción
        let workspaceToAdd;

        if(workspace && !workspace.subscription){
            workspaceToAdd = idWorkspace;
        }

        return res.render("user/auth", {
            endpoint: "login",
            title: "Iniciar sesión",
            workspaceToAdd
        });
    }
    catch(err){
        req.flash("error_msg", `No existe el workspace '${idWorkspace}'`) 
        return res.redirect("/");
    }
}

// Renderiza la página de autenticación. Registro. GET
exports.renderSignup = async (req, res) => {
    // Si el usuario está autenticado, no puede volver a registrarse. A su perfil de usuario.
    if(req.isAuthenticated()) return res.redirect("/user/profile");

    // Recuperamos el id del workspace, en caso de haber accedido a través del enlace del quédatelo!
    const {idWorkspace} = req.params;

    try{ // Si alguien introduce un string, no puede castearlo como ID

        // Buscamos el workspace
        const workspace = await workspaceModel.findById(idWorkspace);

        let workspaceToAdd;

        // Si existe el workspace y no tiene suscripción
        if(workspace && !workspace.subscription){
            workspaceToAdd = idWorkspace;
        }

        return res.render("user/auth", {
            endpoint: "signup",
            title: "Registro",
            workspaceToAdd
        });
    }
    catch(err){
        req.flash("error_msg", `No existe el workspace '${idWorkspace}'`) 
        return res.redirect("/");
    }
}

// Renderiza la página de recuperación de contraseña. Recuperar. GET
exports.renderRecovery = async (req, res) => {
    // Si el usuario está autenticado, no puede volver a recuperar contraseña. A su perfil de usuario.
    if(req.isAuthenticated()) return res.redirect("/user/profile");

    let workspaceToAdd;

    return res.render("user/auth", {
        endpoint: "recovery",
        title: "Recuperar",
        workspaceToAdd
    });
}

// Renderiza el perfil del usuario. GET
exports.renderUserProfile = async  (req, res) => {

    const userSubscription = await subscriptionModel.findOne({user: req.user._id}).populate("user").populate("workspaces").populate("tasks")

    const workspaces = await workspaceModel
        .find({subscription : req.user.subscription})
        .populate({ path: "tasks"});


    res.render("user/profile",{
        subscription: userSubscription,
        workspaces
    })
}

// Renderiza la página de recuperación de contraseña. GET
exports.renderResetPassword = async (req, res) => {

    const token = req.params.token;
    // Buscamos el usuario con el token recibido dentro del tiempo permitido
    const user = await userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });

    // Si el tiempo o el token no es válido, no habrá usuario, informámos.
    if (!user) {
        req.flash('error_msg', 'La url es inválida o ha caducado. Inténtelo de nuevo.');
        return res.redirect('/user/recovery');
    }

    // Si todo ha salido correcto, permitimos el formulario para el reset con el token que hará un POST
    res.render('user/reset', {
        token
    });
}


// Registro de usuario. POST
exports.signUp = passport.authenticate("local-signup",
    {
        failureRedirect: "/user/signup", // Si falla el registro, redirgir...
        successRedirect: "/user/profile", // Si NO falla el registro, redirgir...
        failureFlash: true // Permite mostrar el mensaje de error definidos en la estrategia
    }
);


// Inicio sesión usuario. POST
exports.login = passport.authenticate("local-login", 
    {
        failureRedirect: "/user/login", // Si falla la autenticación, redirgir...
        successRedirect: "/user/profile", // Si NO falla la autenticación, redirgir...
        failureFlash: true // Permite mostrar el mensaje de error definidos en la estrategia
    }
);


// Destruye la sesión del usuario. GET
exports.logout = (req, res) => {
    req.logout();
    req.flash("success_msg", `Se ha cerrado la sesión correctamente`);
    res.redirect("/user/login")
}


// Creación y envío de un token al correo para recuperar contraseña. POST
exports.recovery = async (req, res) => {

    const {email} = req.body;

    // Buscamos al usuario con el email recibido
    const user = await userModel.findOne({ email: req.body.email });

    // Si no encunentra un usuario con ese email, no habrá usuario, informámos.
    if (!user) {
        req.flash('error_msg', 'No existe una cuenta con esta dirección de correo.');
        return res.redirect('/user/recovery');
    }

    // Creamos la URL temporal que almacenará el usuario
    const buf = crypto.randomBytes(20); // Crea un buffer aleatorio de longitud 20
    const token = buf.toString('hex'); // Convierte el buffer en string, lo llámamos "token"

    user.resetPasswordToken = token; // Almacenamos el token en el campo del usuario
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora. Expiramos el token a la hora 

    await user.save();

    // Enviamos mail
    const mailContent = `
        <p> Si estás recibiendo este correo es porque ústed (o cualquier otra persona) ha solicitado cambiar la contraseña de su cuenta. </p>
        <p> Por favor, haga click en el siguiente enlace o cópielo en su navegador para completar el proceso: </p>
        <p><a href='http://${req.headers.host}/user/recovery/reset/${token}'>http://${req.headers.host}/user/recovery/reset/${token}</a></p>
        <p> Si ústed no ha solicitado esta operación, por favor ignore este correo y su contraseña permanecerá igual. </p>
        <img src="https://img.icons8.com/color/452/keys-holder.png" alt="lost keys" width="300" height="300">
    `;

    await sendEmail(mailTemplate("Recupera tu contraseña!", mailContent), "Recuperación contraseña", user.email); // Función propia. "Utils/nodemailer"
    // Fin del mail

    req.flash("success_msg", `Se ha enviado la contraseña a la siguiente dirección de correo: '${email}'.`);
    res.redirect("/user/recovery");
}



// Resetea la contraseña en la base de datos. POST
exports.resetPassword = async (req, res) => {
    
    const {password, confirm_password } = req.body;

    // Si el password no es idéntico al campo confirmar password, informamos.
    if(password !== confirm_password) {
        req.flash("error_msg", "Contraseñas no iguales.")
        return res.redirect(`/user/recovery/reset/${req.params.token}`)
    };

    // Buscamos el usuario con el token recibido dentro del tiempo permitido
    const user = await userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });

    // Si el tiempo o el token no es válido, no habrá usuario, informámos.
    if (!user) {
        req.flash('error_msg', 'La url es inválida o ha caducado. Inténtelo de nuevo.');
        return res.redirect('/user/recovery');
    }

    // Si todo ha salido correcto, guardaremos el nuevo password ENCRIPTADO en la base de datos. Enviaremos email e informaremos.

    user.password = await user.encryptPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Enviamos mail
    const mailContent = `
        <h1>Su contraseña ha sido actualizada!</h1>
        <p>Se ha cambiado la contraseña con éxito</p>
        <p><a href='http://${req.headers.host}/user/login'>Inicie sesión</a></p>
        <img src="https://img.icons8.com/color/452/keys-holder.png" alt="lost keys" width="300" height="300">
    `;

    await sendEmail(mailTemplate("Se ha cambiado tu contraseña!", mailContent), "Confirmación cambio de contraseña", user.email); // Función propia. "Utils/nodemailer"
    // Fin del mail

    req.flash("success_msg", `Se ha cambiado la contraseña!`);
    res.redirect('/user/login');
}