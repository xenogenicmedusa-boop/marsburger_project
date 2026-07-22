const express=require("express");

const router=express.Router();

const controller=require("../controllers/orderController");

const auth=require("../middleware/auth");

router.get("/",controller.getOrders);

router.post("/",controller.createOrder);

router.patch("/:id",controller.updateOrder);

router.delete("/:id",controller.deleteOrder);

router.get("/user",auth,controller.getUserOrders);

module.exports=router;