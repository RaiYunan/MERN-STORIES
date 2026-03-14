import { Router } from "express";
import { getUser, updateUserBio, updateUserDetails } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router=Router();

router.route("/get-user/:userId").get(getUser);
router.patch("/me/bio", verifyJWT, updateUserBio);
router.patch("/me/user-details",verifyJWT,updateUserBio)

router.route("/me/update-user-details").patch(verifyJWT,upload.single("avatar"),updateUserDetails)
export default router