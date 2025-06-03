import { Router } from "express";
import { 
    changeCurrentPassword, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateAvatar, 
    updateCoverImage
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
    registerUser
    );

router.route("/login").post(loginUser);

//Secured routes - Only if user is logged in.
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").put(verifyJWT, changeCurrentPassword);
router.route("/update-account-details").put(verifyJWT, updateAccountDetails);
router.route("/update-avatar").put(
    upload.fields([
        {
            name: avatar,
            maxCount: 1
        }
    ]),
    verifyJWT,
    updateAvatar
);
router.route("/update-coverImage").put(
    upload.fields([
        {
            name: coverImage,
            maxCount: 1
        }
    ]),
    verifyJWT,
    updateCoverImage
)

//http://localhost:8000/api/v1/users/regitser

export default router;