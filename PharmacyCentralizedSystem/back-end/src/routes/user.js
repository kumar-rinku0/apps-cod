import { Router } from "express";
import wrapAsync from "../utils/async-wrap.js";
import {
  handleUserSignUp,
  handleUserSignIn,
  handleUserLogout,
  handleGetOneUser,
  handleUserVerify,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleUserResetPassword,
  handleDeleteUser,
  handleGetUsers,
  handleToggleUserStatus,
  handleUpdateAdminAstrisk,
} from "../controllers/user.js";
import { onlyAdmin, onlyLoggedInUser } from "../middlewares/auth.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/verify").get(wrapAsync(handleUserVerify));
route.route("/verify").post(wrapAsync(handleUserSendVerifyEmail));

route.route("/reset").post(wrapAsync(handleUserSendResetEmail));
route.route("/reset").put(wrapAsync(handleUserResetPassword));

route
  .route("/userId/:userId")
  .get(onlyLoggedInUser, wrapAsync(handleGetOneUser));

route
  .route("/admin-role-update/:userid")
  .get(onlyLoggedInUser, onlyAdmin, wrapAsync(handleUpdateAdminAstrisk));

route.route("/signin").post(wrapAsync(handleUserSignIn));
route.route("/signup").post(wrapAsync(handleUserSignUp));

route.route("/logout").get(onlyLoggedInUser, wrapAsync(handleUserLogout));
route
  .route("/delete/:id")
  .delete(onlyLoggedInUser, onlyAdmin, wrapAsync(handleDeleteUser));

route
  .route("/get-all")
  .get(onlyLoggedInUser, onlyAdmin, wrapAsync(handleGetUsers));
route
  .route("/:id/toggle-status")
  .put(onlyLoggedInUser, onlyAdmin, wrapAsync(handleToggleUserStatus));

export default route;
