const taskModel = require("../models/taskModel");
var nodemailer = require("../utils/nodemailer");

exports.reminderNotification = async (req,res) =>{
  console.log("ha llegado")
    const allTasks = await taskModel.find();
    let dateTasks = allTasks.map(function(task){
      return [task.reminderDate, task.reminderNotification, task._id]})
    
    let filteredDateTasks = dateTasks.filter(task=> task[0]>new Date());

    /* console.log(tasks); */
    //hacer el update de tasks para poner una fecha en el campo notification

  /* await nodemailer.sendEmail("prueba", "Aviso notificación", "arnau.mava@gmail.com") */
  res.send("done");
}