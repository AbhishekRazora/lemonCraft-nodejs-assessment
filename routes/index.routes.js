import { Router } from "express";
import assetRouter from "./asset.routes.js";
import authRouter from "./auth.routes.js";
import marketplaceRouter from "./marketplace.routes.js";
import requestRouter from "./request.routes.js";
const router=Router()

router.use('/auth',authRouter);
router.use('/assets',assetRouter);
router.use('/marketplace',marketplaceRouter);
router.use('/requests',requestRouter)

export default router;