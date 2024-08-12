import { Router } from "express";
import { requestToBuy, negotiateRequest, acceptRequest, denyRequest, getUserRequests } from "../controllers/request.controller.js";
import { protect } from "../utils/jwt.utils.js";
const requestRouter=Router();


// requestRouter.post('/:id/request',protect,requestToBuy);
requestRouter.put('/:id/negotiate',protect,negotiateRequest);
requestRouter.put('/:id/accept',protect,acceptRequest);
requestRouter.put('/:id/deny',protect,denyRequest);
requestRouter.get('/user/:id/requests',protect,getUserRequests);


export default requestRouter;