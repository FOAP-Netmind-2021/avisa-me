var express = require('express');
var settingsControllers = require('../controllers/settingsControllers');
var router = express.Router();

/* router.get("/")  */

router.get("/:idWorkspace", settingsControllers.renderSettings);

router.post("/updateSettings", settingsControllers.updateSettings);

module.exports = router;