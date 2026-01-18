import {Router} from "express"
import {  loginUser, logoutUser, oauthLogin, registerUser } from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router=Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/oauth-login").post(oauthLogin);

export default router