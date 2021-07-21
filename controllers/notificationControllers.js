const taskModel = require("../models/taskModel");
var nodemailer = require("../utils/nodemailer");
let {notificationTemplate} = require("../utils/notificationTemplate");

exports.reminderNotification = async (req,res) =>{
  let initDate = new Date();
  initDate.setHours(initDate.getHours()+8)
  initDate.setMinutes(initDate.getMinutes()-5)
  let limitDate = new Date();
  limitDate.setHours(limitDate.getHours()+8)
  limitDate.setMinutes(limitDate.getMinutes()+5)
  const allTasks = await taskModel.find({reminderDate:{$gt:initDate, $lt:limitDate}, reminderNotification:null}).populate("workspace"); //
  //Habría que buscar solo las tareas cuyo workspace tiene solo un user
  //Habría que conseguir los datos del user
  
  allTasks.forEach(async task=> {
    task.reminderNotification = new Date();
    /* await nodemailer.sendEmail(notificationTemplate("prueba","prueba2","prueba3"), "Juan", "arnau.mava@gmail.com") */
  });
  // Hacer el update de task para pasar el campo reminderNotification a new Date
  console.log(allTasks)
  res.send("done");
}