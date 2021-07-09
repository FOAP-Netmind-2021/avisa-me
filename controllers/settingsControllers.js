const workspaceModel = require("../models/workspaceModel");
const {validationResult} = require('express-validator');

exports.renderSettings = (req,res) =>{

    const { idWorkspace } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    res.render("settings", {
      idWorkspace
    });
  }
  
exports.updateSettings = (req,res) =>{
    let urldinamica = req.params;
    let body = req.body;
    console.log(urldinamica);
    console.log("*****BODY****", body);
  }