// import { soloAdmin, soloUser } from "../middleware/auth.js";
// router.get("/realtimeproducts",soloAdmin, viewsController.getRealtimeproductsViews)
// router.get("/products", soloUser, viewsController.getViews)

import { Router } from "express";
const router = Router()
import ViewsController from "../controllers/views.controller.js";
const viewsController = new ViewsController()

router.get("/products", viewsController.getViews)
router.get("/cart/:cid", viewsController.getCartCidViews)
router.get("/realtimeproducts", viewsController.getRealtimeproductsViews)
router.get("/register",viewsController.getRegisterViews)
router.get("/login",viewsController.getLoginViews)

export default router
