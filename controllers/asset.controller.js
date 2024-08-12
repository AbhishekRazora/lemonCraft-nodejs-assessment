import Asset from "../models/asset.model.js";

export const createAsset=async (req,res) => {
    try {
        const {name,description,image,status}=req.body;
        const asset=await Asset.create({
            name,
            description,
            image,
            creator:req.user._id,
            currentHolder:req.user._id,
            status
        })
        res.status(201).json({message:"Asset created successfully",
            assetId:asset._id
        })
    } catch (error) {
        res.status(400).json({message:error.message})
    }
    
}

export const updateAsset=async(req,res)=>{
    try {
        const {id}=req.params;
        const {name,description,image,status}=req.body;
        const asset=await Asset.findByIdAndUpdate(id,{name,description,image,status},{new:true})
        res.status(200).json({message:'Asset updated successfully',assetId:asset._id})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const getAssetDetails=async (req,res) => {
    try {
        const {id}=req.params;
        const asset=await Asset.findById(id).populate('creator currentHolder tradingJourney.holder');
        res.status(200).json(asset);
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
    


}

export const getUserAssets=async(req,res)=>{
    try {
        const assets = await Asset.find({ currentHolder: req.user._id });
        res.status(200).json(assets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}