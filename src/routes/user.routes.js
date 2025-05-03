import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
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
router.route("/logout").post(verifyJWT, logoutUser)

//http://localhost:8000/api/v1/users/regitser

export default router;