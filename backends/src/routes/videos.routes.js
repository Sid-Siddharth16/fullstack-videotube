import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadVideoSchema } from "../validators/video.validator.js";
import { uploadVideo, getMyVideos, getSubscriptionFeed, getChannelVideos } from "../controllers/video.controller.js";

// mounted at /api/v1/videos
const router = Router();

router.route("/upload").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validate(uploadVideoSchema),
  uploadVideo
);

router.route("/my-videos").get(verifyJWT, getMyVideos);
router.route("/feed").get(verifyJWT, getSubscriptionFeed);
router.route("/channel/:userName").get(verifyJWT, getChannelVideos);

export default router;
