import { Router } from "express";
import { listAssetOnMarketplace, getAssetsOnMarketplace } from "../controllers/marketplace.controller.js";
import { protect } from "../utils/jwt.utils.js";

const marketplaceRouter=Router()

// marketplaceRouter.put('/:id/publish',protect,listAssetOnMarketplace);
marketplaceRouter.get('/assets',getAssetsOnMarketplace);


export default marketplaceRouter;