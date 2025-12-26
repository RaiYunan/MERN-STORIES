import {Router} from "express"
import { googleLogin, loginUser, logoutUser, registerUser } from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router=Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/google-login").post(googleLogin);


export default router