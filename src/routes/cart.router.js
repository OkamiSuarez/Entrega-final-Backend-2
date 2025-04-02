import { Router } from "express";
const router = Router()

// importando el controlador 
import CartController from "../controllers/cart.controller.js"
const cartController = new CartController()

router.get("/",cartController.getCart)
router.get("/:cid",cartController.getCidCart)
router.post("/",cartController.postCart)
router.post("/:cid/product/:pid",cartController.postCidPidCart)
router.put("/:cid",cartController.putCidCart)
router.delete("/:cid",cartController.deleteCidCart)
router.delete("/:cid/products/:pid",cartController.deleteCidPidCart)
router.put("/:cid/products/:pid",cartController.putCidPidCart)
router.post("/:cid/purchase",cartController.postCidPurchase)
router.post("/:cid/purchase",cartController.postCidPurchase)

export default router
