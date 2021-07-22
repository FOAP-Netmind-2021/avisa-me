const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();

const {isAuthenticated} = require("../utils/auth");

// Renderiza página de login
router.get('/login', userControllers.renderLogin);
// Renderiza página de registro
router.get('/signup', userControllers.renderSignup);
// Renderiza página recuperar contraseña
router.get('/recovery', userControllers.renderRecovery);
// Renderiza perfil usuario
router.get('/profile', isAuthenticated, userControllers.renderUserProfile);

// Registra al usuario
router.post('/signup', userControllers.signUp);
// Loguea al usuario
router.post('/login', userControllers.login);
// Crea token para cambiar contraseña y lo envía  por email
router.post('/recovery', userControllers.recovery);
// Recupera el token y renderiza la página que resetea la contraseña
router.get('/recovery/reset/:token', userControllers.renderResetPassword);
// Usa el token. Cambia la contraseña en la base de datos. Envía mail de confirmación
router.post('/recovery/reset/:token', userControllers.resetPassword);

// Renderiza la página de modificación datos del usuario
router.get('/edit/:idUser', userControllers.renderEditUser);
// Modifica los datos del usuario
router.post('/edit/:idUser', userControllers.editUser);

// Si se registran desde el workspace en la cookie, con el quédatelo!
router.get('/signup/:idWorkspace', userControllers.renderSignup);
// Si se loguean desde el workspace en la cookie, con el quédatelo!
router.get('/login/:idWorkspace', userControllers.renderLogin);


// Cierra la sesión del usuario logueado
router.get("/logout", userControllers.logout);


module.exports = router;