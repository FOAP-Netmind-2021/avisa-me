const taskModel = require("../models/taskModel");
var nodemailer = require("../utils/nodemailer");

exports.reminderNotification = async (req,res) =>{
  console.log("ha llegado")
  let date = new Date();
  let limitDate = new Date();
  //falta setear bien el abanico de fechas porque ahora mismo no tengo claro si es las que faltan 8 horas o que x)
  limitDate.setHours(limitDate.getHours()+8)
  const allTasks = await taskModel.find({reminderDate:{$gte:date, $lt:limitDate}, reminderNotification:null}); //configurar el $lt por dia y hora
  console.log(allTasks);
  console.log(date);
  console.log(limitDate);

  /* await nodemailer.sendEmail("prueba", "Aviso notificación", "arnau.mava@gmail.com") */

  // Hacer el update de task para pasar el campo reminderNotification a new Date
  res.send("done");
}