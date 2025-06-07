import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import { handleCreatePersonal, handleGetPersonal } from "../controller/personal.js";


const router = Router();

router.route("/create").post(wrapAsync(handleCreatePersonal));
router.route("/:userId/get").get(wrapAsync(handleGetPersonal));

export default router;
