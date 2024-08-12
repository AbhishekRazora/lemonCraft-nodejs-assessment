import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

export const protect=async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return res.status(401).json({message:"You are not logged in!"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const currentUser=await User.findById(decoded.id);
        if(!currentUser){
            return res.status(401).json({message:'The user belonging to this token does no longer exist.'})
        }
        req.user=currentUser;
        next();
    } catch (error) {
        return res.status(401).json({message:'Invalid token!'})
    }
}
