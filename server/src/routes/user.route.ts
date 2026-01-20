import { Router } from "express";
import { getUser, updateUserBio } from "../controllers/user.controller";

const router=Router();

router.route("/get-user/:userId").get(getUser);
router.route("/update-user-bio/:userId").post(updateUserBio);

export default router