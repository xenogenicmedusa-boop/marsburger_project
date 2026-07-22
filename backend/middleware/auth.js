const jwt = require("jsonwebtoken");

const JWT_SECRET =
process.env.JWT_SECRET || "mars_lab_super_secret_key_2026";

module.exports = (req,res,next)=>{

    const auth=req.headers.authorization;

    if(!auth){

        return res.status(401).json({

            success:false,

            message:"未登入"

        });

    }

    const token=auth.replace("Bearer ","");

    try{

        req.user=jwt.verify(token,JWT_SECRET);

        next();

    }

    catch{

        return res.status(401).json({

            success:false,

            message:"Token 已失效"

        });

    }

}