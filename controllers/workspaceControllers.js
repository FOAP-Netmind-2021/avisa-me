const workspaceModel = require("../models/workspaceModel");
const taskModel = require("../models/taskModel");
const {validationResult} = require('express-validator');

exports.renderHome = (req, res) => {
  res.render("index");
}


exports.renderWorkspace = async (req, res) => {

  const { idWorkspace } = req.params;

  try{

    const isWorkSpace = await workspaceModel.findById(idWorkspace)

    if(isWorkSpace) {
    
      const allTasks = await workspaceModel.getAllTasks(idWorkspace);
      const sortedTasks = allTasks.sort((a,b) => { return new Date(a.createdAt) - new Date(b.createdAt)})

      return res.render('workspace',{
        allTasks : sortedTasks,
        idWorkspace
      })

  }
  }
  catch(err){
    return res.status(404).send(`El worskpace ${idWorkspace} no existe o ha sido eliminado. <a href="/">Crea uno nuevo</a>`)
  }
};

exports.createWorkspace = async (req, res) => {

  //Validación de errores de express-validator
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const workspace = new workspaceModel();

  await workspace.save();

  const { title, text } = req.body;

  // Tasks

  const newTask = new taskModel({
    title,
    text,
    workspace: workspace._id
  })

  await newTask.save();

  res.redirect(`/${workspace._id}`);
};

exports.addTask = async (req,res) =>{

  //Validación de errores de express-validator
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


  const { title, text, idWorkspace } = req.body;

  //console.log("El id del workspace:",id);

  const newTask = new taskModel({
    title,
    text,
    workspace: idWorkspace
  })

  await newTask.save();

  res.redirect(`/${idWorkspace}`)
}