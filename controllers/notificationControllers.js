const workspaceModel = require("../models/workspaceModel");
var nodemailer = require("../utils/nodemailer");

exports.reminderNotification = async (req,res) =>{
    console.log("hola");
  await nodemailer.sendEmail("prueba", "Aviso notificación", "arnau.mava@gmail.com")
}