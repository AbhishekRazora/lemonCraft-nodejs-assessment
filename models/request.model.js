import mongoose from "mongoose";

const requestSchema=new mongoose.Schema({
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proposedPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' },
    negotiationHistory: [
      {
        price: { type: Number },
        date: { type: Date, default: Date.now }
      }
    ]
})

const Request=mongoose.model("Request",requestSchema)
export default Request;