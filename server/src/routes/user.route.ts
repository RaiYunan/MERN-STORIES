import { Router } from "express";
import { getUser } from "../controllers/user.controller";

const router=Router();

router.route("/:userId").get(getUser);

export default router