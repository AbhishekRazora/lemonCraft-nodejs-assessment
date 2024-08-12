import { config } from "dotenv";
import connectToDatabase from "./db/connection.js";
import app from "./app.js";
config()

const port=process.env.PORT||5000;

connectToDatabase().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port} and connect to database`)
    })
}).catch(err=>console.log(err))