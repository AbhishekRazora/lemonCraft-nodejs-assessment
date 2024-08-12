import { Router } from "express";
import { createAsset, updateAsset, getAssetDetails, getUserAssets } from "../controllers/asset.controller.js";
import { protect } from "../utils/jwt.utils.js";
import { listAssetOnMarketplace } from "../controllers/marketplace.controller.js";
import { requestToBuy } from "../controllers/request.controller.js";


const assetRouter=Router()

assetRouter.post("/",protect,createAsset);
assetRouter.post("/:id",protect,updateAsset)
assetRouter.get('/:id',protect,getAssetDetails);
assetRouter.get('/users/:id/assets',protect,getUserAssets)
assetRouter.put("/:id/publish",protect,listAssetOnMarketplace)
assetRouter.post("/:id/request",protect,requestToBuy)
export default assetRouter;