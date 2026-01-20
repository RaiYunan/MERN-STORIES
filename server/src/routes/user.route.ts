import { Router } from "express";
import { getUser, updateUserBio } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router=Router();

router.route("/get-user/:userId").get(getUser);
router.patch("/me/bio", verifyJWT, updateUserBio);

export default router