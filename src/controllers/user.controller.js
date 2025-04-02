// import userService from "../services/user.service.js"
import jwt from "jsonwebtoken"
import UserDTO from "../dto/user.dto.js"
import { createHash, isValidPassword } from "../utils/util.js"
import cartModel from "../models/cart.model.js"
import UsuarioModel from "../models/user.model.js"

class UserController{
    async login(req,res){
        // const {email,password} = req.body

        // try {
        //     const user = await userService.loginUser(email,password)
        //     // console.log(user)
        //     const token = jwt.sign({
        //         usuario: `${user.first_name} ${user.last_name}`,
        //         email: user.email,
        //         role: user.role
        //     }, "coderhouse", {expiresIn:"1h"})
        //     // console.log(token)
        //     res.cookie("coderCookieToken", token,{maxAge:360000, httpOnly: true})
        //     res.redirect("/api/sessions/current")
        // } catch (error) {
        //     res.status(500).send("Error telible del server")
        // }

        try {
            const { email, password } = req.body;
            const user = await UsuarioModel.findOne({ email });

            if (!user) {
                return res.status(401).json({ error: "email no encontrado" });
            }

            if (!isValidPassword(password, user)) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            // genero el token
            const token = jwt.sign(
                { email: user.email, rol: user.rol },
                "coderhouse", {expiresIn: "1h"}
            );
            res.cookie("coderCookieToken", token, { httpOnly: true, maxAge: 3600000 });
            res.redirect("/api/sessions/current")
        } catch (error) {
            console.error("Error al hacer login", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }

    }
    async register(req,res){
        // const {first_name,last_name,email,age,password} = req.body

        // try {
        //     const nuevoUsuario = await userService.registerUser({first_name,last_name,email,age,password})

        //     const token = jwt.sign({
        //         usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
        //         email: nuevoUsuario.email,
        //         role: nuevoUsuario.role
        //     }, "coderhouse", {expiresIn:"1h"})
        //     res.cookie("coderCookieToken", token,{maxAge:360000, httpOnly: true})
        //     res.redirect("/api/sessions/current")
        // } catch (error) {
        //     res.status(500).send("Error telible del server")
        // }

            try {
        const { first_name, last_name, email, age, password } = req.body;

        // Crear un nuevo carrito en la base de datos
        const nuevoCarrito = new cartModel();
        await nuevoCarrito.save();

        const user = new UsuarioModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: nuevoCarrito._id // Asignar el ID del nuevo carrito al usuario
        });

        await user.save();

        res.redirect('/login')
    } catch (error) {
        console.error("Error al registrar usuario", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    }

    async logout(req,res){
    //     res.clearCookie("coderCookieToken")
    //     res.redirect("/login")
    // }
    
    
    res.clearCookie("coderCookieToken");
    res.redirect("/login")
};

// async current(req,res){
//     if(req.user){
//         const user = req.user
//         const userDTO = new UserDTO(user)
//         // res.render("home",{user: userDTO})
//         res.render("profile",{user: UserDTO})
//         // aqui me manda a api sesions login 
//         // aqui lo mando diferente por que el  home es de otro 
//     }else{
//         res.send("No autorizado")
//     }
    async current(req,res){
            if (req.user) {
                        const user = req.user
        const userDTO = new UserDTO(user)
//         // res.render("home",{user: userDTO})
//         res.render("profile",{user: UserDTO})

        res.render("profile", { user: userDTO, rol:user.rol })
    } else {
        res.send("no estas autorizado amiguito")
    }
    }
    async admin(req,res){
    if (req.user.rol !== "admin") {
        return res.status(403).send("No lo intentes, no eres admin")
    }
    res.render("admin")
    }
}

export default UserController