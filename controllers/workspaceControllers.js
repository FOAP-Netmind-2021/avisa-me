const workspaceModel = require("../models/workspaceModel");

exports.renderWorkspace = async (req, res) => {

  const { idWorkspace } = req.params;


  const workSpace = await workspaceModel.findById(idWorkspace);
  console.log("workspace------------->",workSpace);
  
  res.render('index',{
    workSpace,
  })
  

};

exports.createWorkspace = async (req, res) => {
  const { title, text } = req.body;

  const workspace = new workspaceModel({
    tasks: { title : title , text : text },
  });

  const newWorkspace = await workspace.save();

  res.redirect(`/${newWorkspace._id}`);
};

exports.addTask = async (req,res) =>{
  const { title, text, id } = req.body;
  console.log("El id del workspace:",id);
  const workSpace = await workspaceModel.findById(id);
  // Aquí habría que hacer el push de la tarea nueva a workSpace.tasks
}