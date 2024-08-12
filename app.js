import express from "express";
import router from "./routes/index.routes.js";
const app=express();

app.use(express.json())
app.use('/',router)


app.get("/hello",(req,res)=>{
    res.send({
        check:"Ok"
    })
})
export default app;