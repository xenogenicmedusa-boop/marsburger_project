require("dotenv").config();

const express=require("express");

const cors=require("cors");

const path=require("path");

const app=express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname,"..")));

app.use("/api",require("./routes/auth"));

app.use("/api/orders",require("./routes/orders"));

app.use("/api/user",require("./routes/users"));

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{

    console.log(`🚀 Server Running http://localhost:${PORT}`);

});