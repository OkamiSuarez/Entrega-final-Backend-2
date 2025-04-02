// import CartManager from "../managers/cart-manager.js"
import cartModel from "../models/cart.model.js";
import productModel from "../models/products.model.js";
import UsuarioModel from "../models/user.model.js";
import TicketModel from "../models/ticket.model.js";
import CartRepository from "../repositories/cart.repository.js";
class CartController{
    async getCart(req,res){
        try {
            const getCart = await cartModel.find()
            res.send(getCart)
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el cart' })
        }
    }
    async getCidCart(req,res){
        try {
            const getCart = await cartModel.findById(req.params.cid).populate('products.product').lean()
            res.send(getCart)
        } catch (error) {
            res.status(500).send("no se pudo encontrar")
        }
    }
    async postCart(req,res){
            try {
                const addCart = new cartModel(req.body)
                await addCart.save()
                res.send({ mensaje: 'Carrito creado exitosamente', addCart })
            } catch (error) {
                res.status(500).json({ mensaje: 'Error al agregar un producto al carrito' })
            }
    }
    async postCidPidCart(req,res){
            // CREAR CARRITO CON POPULATE 
        try {
            const getCart = await cartModel.findById(req.params.cid)
            const getProduct = await productModel.findById(req.params.pid)
            getCart.products.push({
                product: getProduct,
                quantity: 1
            })
            await getCart.save()
            res.send({ mensaje: "producto agregado", getCart })
        } catch (error) {
            console.log(error)
        }
    }
    async putCidCart(req,res){
        
    try {
        const { cid } = req.params;
        const { products } = req.body;

        // Validar que products sea un arreglo
        if (!Array.isArray(products)) {
            return res.status(400).send("El campo 'products' debe ser un arreglo");
        }

        // Validar la estructura de cada producto en el arreglo
        const validProducts = products.every(item => 
            mongoose.Types.ObjectId.isValid(item.product) && 
            Number.isInteger(item.quantity) && 
            item.quantity >= 0
        );

        if (!validProducts) {
            return res.status(400).send("Estructura de productos inválida");
        }

        // Actualizar el carrito
        const updatedCart = await cartModel.findByIdAndUpdate(
            cid,
            { $set: { products: products } },
            { new: true, runValidators: true }
        );

        if (!updatedCart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.status(200).json({
            status: "success",
            message: "Carrito actualizado exitosamente",
            cart: updatedCart
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("No se pudo actualizar el carrito: " + error.message);
    }

    try {
        const putCart = await cartModel.findByIdAndUpdate(req.params.cid, req.body)
        res.send("Producto actualizado")
    } catch (error) {
        res.status(500).send("no se pudo actualizar")
    }
    }
    async deleteCidCart(req,res){
        try {
            const delCart = await cartModel.findByIdAndDelete(req.params.cid)
            if (!delCart) {
                return res.json({
                    error: "Producto no encontrado por ID"
                });
            }
            res.send('Producto eliminado')
        } catch (error) {
            res.status(500).send("no se pudo eliminar el carrito")
        }
    }
    async deleteCidPidCart(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await cartModel.findByIdAndUpdate(
                cartId,
                { $pull: { products: { "_id": productId } } },
                { new: true }
            ).populate('products.product');
            if (!updatedCart) {
                return res.status(404).json({ mensaje: "Carrito no encontrado" });
            }
            res.send({ mensaje: "producto eliminado", updatedCart })
        } catch (error) {
            console.log(error)
        }
    }
    async putCidPidCart(req,res){
            // SOLO LA QTY LA EDITA
            // RECIBIR Y MODIFICAR NADA MAS ESO 
        
            try {
                const cartId = req.params.cid;
                const productId = req.params.pid;
                const { quantity } = req.body
                if (!quantity || quantity < 0) {
                    return res.status(400).json({ mensaje: "Cantidad inválida" });
                }
                const updatedCart = await cartModel.findOneAndUpdate(
                    {
                        _id: cartId,
                        "products._id": productId
                    },
                    {
                        $set: {"products.$.quantity": quantity} 
                    },
                    {
                        new: true
                    }
                ).populate('products.product');;
                res.send({ mensaje: "producto actualizado", updatedCart })
            } catch (error) {
                console.log(error)
            }
        
    }
    async postCidPurchase(req, res) {
        const cartId = req.params.cid;

        function generateUniqueCode() {
            return `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
    
        try {
            // Obtener el carrito utilizando el repositorio
            const cart = await CartRepository.obtenerProductosDeCarrito(cartId);
            if (!cart) {
                return res.status(404).json({ mensaje: "Carrito no encontrado" });
            }
    
            const products = cart.products;
    
            // Inicializar un arreglo para almacenar los productos no disponibles
            const productosNoDisponibles = [];
    
            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const product = await productModel.findById(item.product._id);
                if (!product) {
                    productosNoDisponibles.push(item.product._id);
                    continue;
                }
    
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    productosNoDisponibles.push(item.product._id);
                }
            }
    
            // Obtener el usuario asociado al carrito
            const userWithCart = await UsuarioModel.findOne({ cart: cartId });
            if (!userWithCart) {
                return res.status(404).json({ mensaje: "Usuario asociado al carrito no encontrado" });
            }
            if (isNaN(totalAmount) || totalAmount <= 0) {
                return res.status(400).json({ mensaje: "El monto total de la compra no es válido" });
            }
            
            if (!userWithCart || !userWithCart._id) {
                return res.status(400).json({ mensaje: "Usuario asociado al carrito no válido" });
            }
    
            // Calcular el total de la compra
            const totalAmount = products
            .filter(item => {
                // Verificar que el producto tenga un precio y una cantidad válidos
                if (!item.product || typeof item.product.price !== "number" || typeof item.quantity !== "number") {
                    console.warn(`Producto inválido o datos faltantes: ${JSON.stringify(item)}`);
                    return false; 
                }
                return !productosNoDisponibles.includes(item.product._id);
            })
            .reduce((total, item) => total + item.product.price * item.quantity, 0);
    
            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userWithCart._id
            });
            await ticket.save();
    
            // Eliminar del carrito los productos que sí se compraron
            const productosRestantes = products.filter(item =>
                productosNoDisponibles.includes(item.product._id)
            );
    
            // Actualizar el carrito utilizando el repositorio
            await CartRepository.actualizarProductosEnCarrito(cartId, productosRestantes);
    
            res.status(200).json({
                mensaje: "Compra procesada exitosamente",
                productosNoDisponibles,
                ticket
            });
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            res.status(500).json({ error: "Error interno del servidor", detalles: error.message });
        }
    }
}

export default CartController
