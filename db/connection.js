import { connect } from "mongoose";

async function connectToDatabase(){
    try{
        await connect(process.env.MONGO_URI)
    }catch(error){
        throw new Error("cannot connect to mongoDB")
    }
}

export default connectToDatabase;