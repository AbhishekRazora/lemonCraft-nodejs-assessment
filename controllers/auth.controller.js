import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.utils.js";


export const signup=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const newUser=await User.create({username,email,password})
        const token=signToken(newUser._id);
        res.status(200).json({
            message:"User created successfully",
            token
        })
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }

};

export const login=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials!' });
          }
          const token = signToken(user._id);
          res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      };
