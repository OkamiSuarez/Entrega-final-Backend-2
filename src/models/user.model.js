import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    // ESTO SE MODIFICA CON RELACION A LO QUE PIDE LA CONSIGNA 
    
    first_name:String,
    last_name:String,
    email:{
        type:String,
        unique: true
    },
    age:Number,
    password: String,
    cart: String,
    // usuario: String,
    rol:{
        type:String,
        enum: ["admin","user"],
        default:"user"
    }
})

const UsuarioModel = mongoose.model("usuarios",usuarioSchema)

export default UsuarioModel
