import mongoose from "mongoose";

    // mongoose.connect("mongodb+srv://okami97backdev:coderhouse@cluster0.tfr60.mongodb.net/Backend2PreEntrega1?retryWrites=true&w=majority&appName=Cluster0")
    // tal vez hay que cambiarlo a la que era antes 
    mongoose.connect("mongodb+srv://okami97backdev:coderhouse@cluster0.tfr60.mongodb.net/EntregaFinal?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=> console.log('Conexion exitosa a la DB'))
    .catch((error)=>console.log("hay un problema con db", error))
