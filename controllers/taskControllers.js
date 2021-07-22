const taskModel = require("../models/taskModel");

exports.completedTask = async (req, res) => {

  const {idTask} = req.params;
  const task = await taskModel.findById(idTask);
  task.finishedDate = new Date();
  await task.save();

  res.redirect(`/${task.workspace}`);
}

exports.updateTask = async (req, res) => {
  const { idTask, titleModified, textModified, reminderDate, reminderHour } = req.body;

  const task = await taskModel.findById(idTask);
  task.title = titleModified.replace(/\n*/g, '').trim();
  task.text = textModified.replace(/\n*/g, '').trim();
  if (reminderDate && reminderHour) {
    let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
    task.reminderDate = setDate;
    task.reminderNotification = null;
  }
  
  
  await task.save();
 

  res.send({
    success : true,
  })

};


exports.updateTaskColores = async (req, res) => {
  const { idTask, SelectedbackgroundColor } = req.body;

  const task = await taskModel.findById(idTask)
  task.color = SelectedbackgroundColor;
  await task.save();

  res.send({
    success : true,
  })

};