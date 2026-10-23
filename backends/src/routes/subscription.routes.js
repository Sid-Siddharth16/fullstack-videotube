import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription, getDiscoverChannels } from "../controllers/subscription.controller.js";

// mounted at /api/v1/subscriptions
const router = Router();

router.use(verifyJWT);

router.route("/discover").get(getDiscoverChannels);
router.route("/c/:channelId").post(toggleSubscription);

export default router;
