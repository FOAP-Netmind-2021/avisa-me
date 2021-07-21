const express = require('express');
const router = express.Router();
const notificationControllers = require("../controllers/notificationControllers");

router.get("/", notificationControllers.reminderNotification);

module.exports = router;