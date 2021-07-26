const express = require('express');
const settingsControllers = require('../controllers/settingsControllers');
const router = express.Router();


router.get("/export", settingsControllers.exportTasks); //Ha de estar por encima de los otros endpoints

router.get("/:idWorkspace", settingsControllers.renderSettings);

router.post("/updateSettings", settingsControllers.updateSettings);
// Actualiza la visibilidad de un workspace
router.post("/updateVisibility", settingsControllers.updateVisibility);


module.exports = router;