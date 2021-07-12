const workspaceModel = require("../models/workspaceModel");
const {validationResult} = require('express-validator');

exports.renderSettings = async (req,res) =>{

    const { idWorkspace } = req.params;
    console.log("console de id render", idWorkspace);
    const workSpace = await workspaceModel.findById(idWorkspace);
    const settings = workSpace.settings;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    res.render("settings", {
      idWorkspace,
      settings
    });
  }
  
exports.updateSettings = async (req,res) =>{

  //Validación de errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let {idWorkspace, hideCompletedTask} = req.body;
    let body = req.body;
    console.log("ese es el console de la url dinamica", idWorkspace);
    console.log("*****BODY****", body);
    console.log("console de hidecompleted tasks", hideCompletedTask);

    const workspace = await workspaceModel.findById(idWorkspace);
    console.log(workspace);
    workspace.settings.hideCompletedTask = hideCompletedTask;
    await workspace.save();
    console.log("actualizado", workspace); 
  }


