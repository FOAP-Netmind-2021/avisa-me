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

  const task = await taskModel.findById(idTask)
  task.title = titleModified;
  task.text = textModified;
  await task.save();

  res.send({
    success : true,
  })

};
