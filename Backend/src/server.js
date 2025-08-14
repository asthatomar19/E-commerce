const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/route");
const cors = require("cors")
const app = express();

// let middleware1 = (req,res,next)=>{
//     console.log("Middleware 1");
//     // res.json({msg:"Middleware 1"})
//     next();
// }
// let middleware2 = (req,res,next)=>{
//     console.log("Middleware 2");
//     next();
// }

// app.use(middleware1);
// app.use(middleware2);

app.use(cors())
app.use(express.json());
app.use("/",router);

// Database Connection
mongoose.connect("mongodb+srv://asthatomar528:8Id8Aarca2QBRHbs@cluster0.ugcx8t7.mongodb.net/E-commerce")
.then(()=>console.log("MongoDB is connected"))
.catch(()=>console.log("MongoDB connection is failed"));

let Port = 4000;
app.listen(Port,(err)=>{
    err?
    console.log("Connection is failed"):
    console.log(`Server is running at ${Port}`);
})