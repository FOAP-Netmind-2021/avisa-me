const workspaceModel = require("../models/workspaceModel");
const taskModel = require('../models/taskModel');
const {validationResult} = require('express-validator');
const exportFromJSON = require('export-from-json');


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

  
  exports.exportTasks = async (req, res) =>{
    const idWorkspace = req.query.idWorkspace; // id del workSapace
    const exportType = req.query.exportTasks;  //Recuperamos del req mediante query, tipo de FORMATO SOLICITADO.
    const fileName = req.query.fileName; //Recuperamos el nombre del archivo seleccionado por el usuario

    //Recuperamos  las TAREAS de este workSpace en formA de ARRAY DE OBJETOS (BSONS, son los objetos que utiliza MongoDb)
    //Utilizamos una proyección para visualizar los campos: id, title, text, finishedDate
    const allTasks = await taskModel.find({workspace:`${idWorkspace}`},{title:1, text:1, createdAt:1});
    console.log("todas las tareas;(workSpace):---------->", allTasks);
    
    //Si exportType es 'json', los datos pueden ser cualquier JSON parseable. Si exportType es 'csv' o 'xls', los datos solo pueden ser una matriz de JSON parseable. Si exportType es 'txt', 'css', 'html', los datos deben ser un tipo de cadena.
    let data; //Declaramos 'data' para condicionarla SEGUN FORMATO DESEADO...
    if (exportType == 'csv' || 'xls' ){
    let  dataXLS =
     `<html>
      <head>
        <meta charset="UTF-8">
      </head >
      <body>
        
        <table>
          <thead>
            <tr><th><b>Titulo</b></th><th><b>Texto</b></th><th><b>Fecha</b></th></tr>
          </thead>`;
      allTasks.forEach(task => {
        dataXLS += `
            <tbody>
              <tr><td>${task.title}</td></tr>
              <tr><td>${task.text}</td></tr>
              <tr><td>${task.createdAt}</td></tr>
            </tbody>`
          });
        dataXLS += ` </table>
        </body>
      </html >`;
     // console.log("Valor de dataXLS------------->", dataXLS)
      let dataString = JSON.stringify(allTasks);
      data = JSON.parse(dataString);
      
    }else if(exportType == 'json'){
      data = JSON.stringify(allTasks);

    }else{
      data = JSON.stringify(allTasks);   
      }
  
    const result = await exportFromJSON({
        data,
        fileName,
        exportType,
        processor (content, type, fileName) {
            switch (type) {
                case 'txt':
                    res.setHeader('Content-Type', 'text/plain')
                    let title = data.
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





