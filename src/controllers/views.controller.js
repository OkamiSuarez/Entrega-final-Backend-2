// import ProductManager from "../managers/product-manager.js";
import productModel from "../models/products.model.js";
import cartModel from "../models/cart.model.js";
// import { soloAdmin, soloUser } from "../middleware/auth.js";

class ViewsController{
    async getViews(req,res){
        const page = req.query.page || 1;
        const limit = 3
        const productos = await productModel.paginate({},{limit,page})
        const productosRender = productos.docs.map(
            producto=>{
                const {_id,...rest} = producto.toObject()
                return rest
            }
        )
        res.render("home",{
            productos: productosRender,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        })
    }
    async getCartCidViews(req,res){
        try {
            const cart = await cartModel.findById(req.params.cid).populate('products.product')
            if (!cart) {
                return res.status(404).send("Carrito no encontrado");
            }
            const cartProducts = cart.products.map(item => ({
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.product.price * item.quantity
            }));
            const totalAmount = cartProducts.reduce((total, product) => total + product.subtotal, 0);
            res.render("cartId", { 
                cartId: cart._id,
                products: cartProducts,
                totalAmount: totalAmount.toFixed(2) 
            });
            } catch (error) {
                console.error("Error al obtener el carrito:", error);
                res.status(500).send("No se pudo encontrar el carrito");
            }
    
    }
    async getRealtimeproductsViews(req,res){
        res.render("realtimeproducts")
    }
    async getRegisterViews(req,res){
        res.render("register")
    }
    async getLoginViews(req,res){
        res.render("login")
    }
}
export default ViewsController