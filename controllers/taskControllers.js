const workspaceModel = require("../models/workspaceModel");

exports.completedTask = async (req, res) => {
    res.send('Task completed:' + req.params.idTask)
}

exports.updateTask = async (req, res) => {
    console.log("*********", req.body);
    const {idNote, titleModified, parafModified} = req.body;
    // find de la nota a la db con idNote
    console.log("*************", idNote);
    if(idNote){
    const taskUpdated = await workspaceModel.findById(idNote);
    console.log(taskUpdated);
    }   
}