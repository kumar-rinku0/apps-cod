import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleRequestLeave,
  handleGetAllPendingRequestLeave,
  handleGetAllNotPendingRequestLeave,
  handleGetOneUserNotPendingRequestLeave,
  handleGetOneUserPendingRequestLeave,
  deleteLeave,
  updateLeaveStatus,
} from "../controller/leaves.js";
import {
  onlyManagerAdmin,
  onlyEmployeeManager,
  onlyEmployee,
} from "../middleware/auth.js";

const router = Router();

router
  .route("/request")
  .post(onlyEmployeeManager, wrapAsync(handleRequestLeave));

router.route("/oneuserpending").get(wrapAsync(handleGetOneUserPendingRequestLeave))
router.route("/oneusernotpending").get(wrapAsync(handleGetOneUserNotPendingRequestLeave))

router
  .route("/allpending")
  .get(onlyManagerAdmin, wrapAsync(handleGetAllPendingRequestLeave));
router
  .route("/allnotpending")
  .get(onlyEmployee, wrapAsync(handleGetAllNotPendingRequestLeave));

router.route("/update/:id").put(onlyManagerAdmin, wrapAsync(updateLeaveStatus));

router.route("/delete/:id").delete(wrapAsync(deleteLeave));

export default router;
