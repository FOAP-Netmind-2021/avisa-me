const taskModel = require("../models/taskModel");
const subscriptionModel = require("../models/subscriptionModel");
var nodemailer = require("../utils/nodemailer");
let {notificationTemplate} = require("../utils/notificationTemplate");

//Todo esto habrá que pasarlo a un script que se inicialice cada 5 minutos. Por el momento, se hace en un endpoint para poder centrarnos en su funcionalidad.

exports.reminderNotification = async (req,res) =>{
  let initDate = new Date();
  initDate.setHours(initDate.getHours()+8)
  initDate.setMinutes(initDate.getMinutes()-5)
  let limitDate = new Date();
  limitDate.setHours(limitDate.getHours()+8)
  limitDate.setMinutes(limitDate.getMinutes()+5)
  const allTasks = await taskModel.find({reminderDate:{$gt:initDate, $lt:limitDate}, reminderNotification:null}).populate("workspace"); //
  
  //Habría que buscar solo las tareas cuyo workspace tiene un user.
  /* const filteredTasks = allTasks.filter() */
  console.log("****allTasks****", allTasks);
  
  allTasks.forEach(async task=>{
    let id = task.workspace._id;
    let subscriber = await subscriptionModel.find({workspaces:id}).populate("user")
    let userEmail = subscriber.user.email;
   /*  task.reminderNotification = new Date(); 
    await nodemailer.sendEmail(notificationTemplate("prueba","prueba2","prueba3"), "Recordatorio: Faltan 8horas para tu tarea", userEmail)  */
    // Hacer el update/save de task para pasar el campo reminderNotification a new Date
  })   
 
  res.send("done");
}