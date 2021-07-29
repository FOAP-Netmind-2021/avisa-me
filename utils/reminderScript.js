const taskModel = require("../models/taskModel");
var nodemailer = require("../utils/nodemailer");
var {notificationTemplate} = require("../utils/notificationTemplate")

exports.reminderNotificate = async () =>{
    let initDate = new Date(); 
    initDate.setHours(initDate.getHours()+10)
    initDate.setMinutes(initDate.getMinutes()-5)
    let limitDate = new Date();
    limitDate.setHours(limitDate.getHours()+10)
    limitDate.setMinutes(limitDate.getMinutes()+5)

    const allTasks = await taskModel.find({reminderDate:{$gt:initDate, $lt:limitDate}, reminderNotification:null}).populate({
        path:"workspace",
        populate:{
          path:"subscription",
          populate:{
            path:"user"
          }
        }
    })

    allTasks.forEach(async task =>{

        if(task.workspace.subscription){
            const user = task.workspace.subscription.user;
            let reminderDate = task.reminderDate;
            await nodemailer.sendEmail(notificationTemplate(`¡Nota programada para hoy a las ${reminderDate.toLocaleTimeString("es-Es", {hour: 'numeric', minute: '2-digit'})}!`,`${task.title}`,`${task.text}`), "Recordatorio: Faltan 8 horas para tu tarea", `${user.email}`)
            task.reminderNotification = new Date();
            await task.save()
        }else{
          console.log("nonono");
        }
      })
}

