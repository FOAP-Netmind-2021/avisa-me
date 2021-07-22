const express = require('express');
const router = express.Router();
const notificationControllers = require("../controllers/notificationControllers");

//Ruta creada provisionalmente para implementar la funcionalidad de reminderNotification en un endpoint. En un futuro se pondrá función en un script que se inicialice cada 5 minutos

router.get("/", notificationControllers.reminderNotification);

module.exports = router;