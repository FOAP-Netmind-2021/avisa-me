const passport = require("passport");
const nodemailer = require("nodemailer");


// Renderiza la página de autenticación. Login
exports.renderLogin = async (req, res) => {
    // Si el usuario está autenticado, no puede volver a loguearse. A su perfil de usuario.
    if(req.isAuthenticated()) return res.redirect("/user/profile");

    return res.render("user/auth", {
        endpoint: "login",
        title: "Iniciar sesión"
    });
}

// Renderiza la página de autenticación. Registro
exports.renderSignup = async (req, res) => {
    // Si el usuario está autenticado, no puede volver a registrarse. A su perfil de usuario.
    if(req.isAuthenticated()) return res.redirect("/user/profile");

    return res.render("user/auth", {
        endpoint: "signup",
        title: "Registro"
    });
}

// Renderiza la página de recuperación de contraseña. Recuperar.
exports.renderRecovery = async (req, res) => {
    // Si el usuario está autenticado, no puede volver a registrarse. A su perfil de usuario.
    if(req.isAuthenticated()) return res.redirect("/user/profile");

    return res.render("user/auth", {
        endpoint: "recovery",
        title: "Recuperar"
    });
}

// Renderiza el perfil del usuario
exports.renderUserProfile = (req, res) => {
    res.render("user/profile",{
        message: "hola"
    })
}

// Registro de usuario
exports.signUp = passport.authenticate("local-signup",
    {
        failureRedirect: "/user/signup", // Si falla el registro, redirgir...
        successRedirect: "/user/profile", // Si NO falla el registro, redirgir...
        failureFlash: true // Permite mostrar el mensaje de error definidos en la estrategia
    }
);


// Inicio sesión usuario
exports.login = passport.authenticate("local-login", 
    {
        failureRedirect: "/user/login", // Si falla la autenticación, redirgir...
        successRedirect: "/user/profile", // Si NO falla la autenticación, redirgir...
        failureFlash: true // Permite mostrar el mensaje de error definidos en la estrategia
    }
);


// Destruye la sesión del usuario
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/user/login")
}




// Destruye la sesión del usuario
exports.recovery = async (req, res) => {

    const {NODEMAILER_PASSWORD, NODEMAILER_USER, NODEMAILER_HOST} = process.env 
    const {email} = req.body;

    contentHTML = `
      <h1>Recupera tu contraseña!</h1>
      <p>Accede a este enlace para resetear la contraseña!</p>
      <img src="https://img.icons8.com/color/452/keys-holder.png" alt="lost keys" width="300" height="300">
    `;

    let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: NODEMAILER_HOST,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD
      },
    });

    let info = await transporter.sendMail({
      from: '"Avisame" <avisame@avisame.es>', // sender address,
      to: `${email}`,
      subject: 'Recuperación de contraseña',
      html: contentHTML
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>


    req.flash("success_msg", `Se ha enviado la contraseña a la siguiente dirección de correo: '${email}'.`);
    res.redirect("/user/recovery");
}