import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleUserSignUp,
  handleUserSignUpWithRoles,
  handleUserSignIn,
  handleUserLogout,
  handleGetOneUser,
  handleGetUserByCompanyId,
  handleUserVerify,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleUserResetPassword,
} from "../controller/user.js";

const route = Router();

route.route("/").get((req, res) => {
  return res.status(200).json({ msg: "ok" });
});

route.route("/verify").get(wrapAsync(handleUserVerify));
route.route("/verify").post(wrapAsync(handleUserSendVerifyEmail));

route.route("/reset").post(wrapAsync(handleUserSendResetEmail));
route.route("/reset").put(wrapAsync(handleUserResetPassword));

route.route("/userId/:userId").get(wrapAsync(handleGetOneUser));
route.route("/companyId/:companyId").get(wrapAsync(handleGetUserByCompanyId));

route.route("/signin").post(wrapAsync(handleUserSignIn));
route.route("/signup").post(wrapAsync(handleUserSignUp));
route.route("/signupwithrole").post(wrapAsync(handleUserSignUpWithRoles));
route.route("/logout").get(wrapAsync(handleUserLogout));

export default route;
