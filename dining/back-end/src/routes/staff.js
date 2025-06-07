import { Router } from "express";
import { handleAddUser, handleGetAllUsers } from "../controllers/staff.js";
import wrapAsync from "../utils/wrap-async.js";

const router = Router();

router.post("/add", wrapAsync(handleAddUser));
router.get("/getAll", wrapAsync(handleGetAllUsers));

export default router;