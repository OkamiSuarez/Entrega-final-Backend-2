import { Router } from "express";
import UsuarioModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { createHash, isValidPassword } from "../utils/util.js";
// import router from "./product.router.js";
import passport from "passport";
import cartModel from "../models/cart.model.js";

const router = Router()

// probablemente aqui tambien tenga que hacer modificaciones con la consigna
router.post("/login", async (req, res) => {
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
});

// aqui debo tener en cuenta que todo es en la db no en el cart manager
router.post("/register", async (req, res) => {
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
});

router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login")
});

router.get('/current', passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user) {
        res.render("profile", { usuario: req.user.usuario })
    } else {
        res.send("no estas autorizado amiguito")
    }
})

// verificamos que el user sea admin
router.get('/admin', passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(403).send("No lo intentes, no eres admin")
    }
    res.render("admin")
})





export default router