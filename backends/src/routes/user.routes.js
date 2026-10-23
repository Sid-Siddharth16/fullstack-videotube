import {Router} from 'express';
import {upload} from "../middlewares/multer.middleware.js"
import { validate } from '../middlewares/validate.middleware.js';
import { loginRateLimit } from '../middlewares/rate-limit.middleware.js';
import { verifyJWT, optionalJWT } from '../middlewares/auth.middleware.js';
import { registerSchema, editProfileSchema, changePasswordSchema } from '../validators/user.validator.js';
import { loggedOutUser, dashboardUser,loginUser, refreshAccessToken, registerUser, editProfile, changeAvatar, changeCoverImage, changePassword, getChannelProfile} from '../controllers/user.controller.js';

// mounted at /api/v1/users
const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    validate(registerSchema),
    registerUser
)

router.route("/login").post(loginRateLimit, loginUser)

//secured routes

router.route("/logout").post(verifyJWT, loggedOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/profile").get(verifyJWT, dashboardUser)
router.route("/edit-profile").patch(verifyJWT, validate(editProfileSchema), editProfile)
router.route("/change-avatar").patch(verifyJWT, upload.single("avatar"), changeAvatar)
router.route("/change-cover-image").patch(verifyJWT, upload.single("coverImage"), changeCoverImage)
router.route("/change-password").patch(verifyJWT, validate(changePasswordSchema), changePassword)

router.route("/channel/:userName").get(optionalJWT, getChannelProfile)

export default router;
