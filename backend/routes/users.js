const express=require("express");

const router=express.Router();

const auth=require("../middleware/auth");

const user=require("../controllers/userController");

router.get("/profile",auth,user.getProfile);

router.put("/profile",auth,user.updateProfile);

router.put("/password",auth,user.changePassword);

module.exports=router;