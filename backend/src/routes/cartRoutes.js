import express from "express";
import * as cartController from "../controllers/cart.js";

const router = express.Router();

router.get("/", cartController.getCartItems);
router.post("/add", cartController.addToCart);
router.delete("/remove", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

export default router;
