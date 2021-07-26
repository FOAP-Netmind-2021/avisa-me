const workspaceModel = require("../models/workspaceModel");
const {validationResult} = require('express-validator');
const taskModel = require('../models/taskModel');
const exportFromJSON = require('export-from-json'); // Para exportar las tareas

exports.renderSettings = async (req,res) =>{

    const { idWorkspace } = req.params;
    const workSpace = await workspaceModel.findById(idWorkspace);
    const settings = workSpace.settings;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    res.render("settings", {
      idWorkspace,
      settings,
      title: "Settings"
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

  exports.updateVisibility = async (req, res) => {

    let {idWorkspace} = req.body;

    const workspace = await workspaceModel.findById(idWorkspace);

    // Función propia del modelo. Toggle
    workspace.updateVisibility();
    await workspace.save();

    workspace.settings.visibility ? req.flash("success_msg", `El workspace es público ahora!`) : req.flash("success_msg", `El workspace es privado ahora!`);

    return res.redirect(`/${idWorkspace}`);
  }


  exports.exportTasks = async (req, res) => {

    const idWorkspace = req.query.idWorkspace;
    const exportType = req.query.exportTasks;
    const fileName = req.query.fileName;
  
    // Buscar todas las tareas pero solo visualizar los campos: id, title, text, createdAt.
    const allTasks = await taskModel.find({ workspace: `${idWorkspace}` }, { title: 1, text: 1, createdAt: 1 });
    console.log("todas las tareas;(workSpace):---------->", allTasks);
  
    /**
     *  Especificaciones del [módulo exportTasks](https://www.npmjs.com/package/export-from-json)
     * // Si exportType es 'json', los datos pueden ser cualquier objeto JSON parseable. 
     * // Si exportType es 'csv' o 'xls', los datos solo pueden ser una Array de JSON parseable. 
     * // Si exportType es 'txt', 'css', 'html', los datos deben ser un tipo de String.
    */
  
    let data;
  
    if (exportType == 'csv' || 'xls') {
      let dataString = JSON.stringify(allTasks);
  
      data = JSON.parse(dataString);
      
    } else if (exportType == 'json') {  
      data = JSON.stringify(allTasks);
  
    } else { // txt 
      data = JSON.stringify(allTasks);
    }
  
    const result = await exportFromJSON({
      data,
      fileName,
      exportType,
      processor(content, type, fileName) {
        switch (type) {
          case 'txt':
            res.setHeader('Content-Type', 'text/plain')
            break
          case 'html':
            res.setHeader('Content-Type', 'text/html')
            break
          case 'json':
            res.setHeader('Content-Type', 'text/plain')
            break
          case 'csv':
            res.setHeader('Content-Type', 'text/csv')
            break
          case 'xls':
            res.setHeader('Content-Type', 'application/vnd.ms-excel')
            break
        }
        res.setHeader('Content-disposition', 'attachment;filename=' + fileName)
        return content
      }
    })
    res.write(result)
    res.end()
  }


