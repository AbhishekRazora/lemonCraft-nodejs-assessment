import mongoose from "mongoose";

const tradeHistorySchema = new mongoose.Schema({
    holder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number
    }
})

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentHolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tradingJourney: [tradeHistorySchema],
    averageTradingPrice: {
        type: Number,
        default: 0
    },
    lastTradingPrice: {
        type: Number,
        default: 0
    },
    numberOfTransfers: {
        type: Number,
        default: 0
    },
    isListed: {
        type: Boolean,
        default: false
    },
    proposals: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    }
})


const Asset=mongoose.model('Asset',assetSchema)
export default Asset;