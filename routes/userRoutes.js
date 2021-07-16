const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();

const {isAuthenticated} = require("../utils/auth");

// Renderiza página de logueo
router.get('/login', userControllers.renderLogin);
// Renderiza página de registro
router.get('/signup', userControllers.renderSignup);
// Renderiza página recuperar contraseña
router.get('/recovery', userControllers.renderRecovery);
// Renderiza perfil usuario
router.get('/profile', isAuthenticated, userControllers.renderUserProfile);

// Registra
router.post('/signup', userControllers.signUp);
// Loguea
router.post('/login', userControllers.login);
// Recupera contraseña
router.post('/recovery', userControllers.recovery);

// Cierra la sesión
router.get("/logout", userControllers.logout);


module.exports = router;