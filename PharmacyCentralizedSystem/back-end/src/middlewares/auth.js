// user is logged in or not check.
import { getInfo, setUser, verifyUser } from "../utils/jwt.js";
import User from "../models/user.js";

const isLoggedInCheck = async (req, res, next) => {
  const cookie = req.cookies?.JWT_TOKEN;
  if (!cookie) {
    req.user = null;
    return next();
  }
  const user = getInfo(cookie);
  // console.log(user);
  req.user = user;
  const isVerified = verifyUser(cookie);
  console.log(isVerified);
  if (!isVerified) {
    const isExist = await User.findById(user._id);
    if (!isExist) {
      res.clearCookie("JWT_TOKEN");
    } else if (isExist && isExist.status === "inactive") {
      res.clearCookie("JWT_TOKEN");
    } else {
      const token = setUser(isExist);
      res.cookie("JWT_TOKEN", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    }
  }
  return next();
};

const onlyLoggedInUser = (req, res, next) => {
  // req.session.originalUrl = req.originalUrl;
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .send({ type: "error", message: "login application to access route!" });
  }
  return next();
};

const onlyAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .send({ type: "error", message: "don't have right access!" });
};
const onlyPhamacist = (req, res, next) => {
  const user = req.user;
  if (user.role !== "pharmacist") {
    return res
      .status(403)
      .send({ type: "error", message: "don't have right access!" });
  }
  return next();
};

export { isLoggedInCheck, onlyLoggedInUser, onlyAdmin, onlyPhamacist };
