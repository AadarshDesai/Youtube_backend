import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();
router.route("/register").post(registerUser);

//http://localhost:8000/api/v1/users/regitser

export default router;