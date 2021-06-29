const { connect } = require("mongoose");

const uri =
  "mongodb+srv://root:root@cluster0.clmgc.mongodb.net/AvisameDB?retryWrites=true&w=majority";

exports.connectdb = async () => {
  try {
    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB se ha conectado a la base de datos correctamente.");
  } catch (error) {
    console.log("Ha fallado la conexión:", error);
  }
};
