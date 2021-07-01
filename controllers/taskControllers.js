const workspaceModel = require("../models/workspaceModel");

exports.completedTask = async (req, res) => {
  res.send("Task completed:" + req.params.idTask);
};

exports.updateTask = async (req, res) => {
  const { idNote, titleModified, parafModified } = req.body;

  if (idNote) {
    const workspace = await workspaceModel.find({ "tasks._id": idNote });

    const tasks = workspace[0].tasks; 

    const task = tasks.find(task => {
        return task._id == idNote;
    })

    task.title = titleModified;
    task.text = parafModified;

    await workspace[0].save();

    res.send({
        success : true ,
        taskId : task._id
    })

    console.log(workspace);
    
  }
};
