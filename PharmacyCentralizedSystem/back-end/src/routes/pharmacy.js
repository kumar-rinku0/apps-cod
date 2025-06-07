import { Router } from "express";
import multer from "multer";
import asyncWrap from "../utils/async-wrap.js";
import { handleUploadImage } from "../utils/cloud-init.js";

import {
  handleGetPharmacyByUserId,
  handleGetPharmacyByPharmacyId,
  handleCreatePharmacy,
  handleUpdatePharmacy,
  handleDeletePharmacy,
  handleGetPharmacies,
} from "../controllers/pharmacy.js";
import { onlyAdmin, onlyLoggedInUser } from "../middlewares/auth.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router
  .route("/getbyuserid/:userId")
  .get(onlyLoggedInUser, asyncWrap(handleGetPharmacyByUserId));
router.route("/getall").get(onlyLoggedInUser, asyncWrap(handleGetPharmacies));

router
  .route("/getbypharmacyid/:pharmacyId")
  .get(onlyLoggedInUser, asyncWrap(handleGetPharmacyByPharmacyId));

router
  .route("/update/pharmacyId/:pharmacyId")
  .put(
    onlyLoggedInUser,
    upload.single("logo"),
    asyncWrap(handleUploadImage),
    asyncWrap(handleUpdatePharmacy)
  );

router
  .route("/delete/pharmacyId/:pharmacyId")
  .delete(onlyLoggedInUser, onlyAdmin, asyncWrap(handleDeletePharmacy));

// router
//   .route("/create")
//   .post(
//     upload.single("logo"),
//     asyncWrap(handleUploadImage),
//     asyncWrap(handleCreatePharmacy)
//   );

router
  .route("/create-pharmacy")
  .post(
    upload.single("logo"),
    asyncWrap(handleUploadImage),
    asyncWrap(handleCreatePharmacy)
  );

export default router;
