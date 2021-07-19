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
  task.title = titleModified;
  task.text = textModified;
  if (reminderDate && reminderHour) {
    let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
    task.reminderDate = setDate;
  }
  
  // console.log('***********************************', prueba);
  // console.log('******************************', reminderDate);
  // console.log('*********************************', reminderHour);
  
  let valor = await task.save();
  console.log(valor);

  res.send({
    success : true,
  })

};
