import { Router } from "express";
const router = Router()
import ProductController from "../controllers/product.controller.js";
const productController = new ProductController

router.get("/", productController.getProduct)
router.get("/:pid", productController.getPidProduct)
router.post("/", productController.postProduct)
router.put("/:id", productController.putProduct)
router.delete("/:pid", productController.deleteProduct)

export default router