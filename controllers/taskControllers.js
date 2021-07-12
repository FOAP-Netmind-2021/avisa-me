const workspaceModel = require("../models/workspaceModel");

exports.completedTask = async (req, res) => {
    // res.send('Task completed:' + req.params.idTask);
const {idTask} = req.params;
const workSpaceRetrieved = await workspaceModel.find({"tasks._id": idTask  });
const tasks =  workSpaceRetrieved[0].tasks;
const task = tasks.find(task=>task._id==idTask)
task.finishedDate = new Date();
await workSpaceRetrieved[0].save();
console.log(task);
res.redirect(`/${workSpaceRetrieved[0]._id}`);

}

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
