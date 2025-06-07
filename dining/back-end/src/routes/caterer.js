// routes/caterer.js
import { Router } from "express";
import multer from "multer";
import wrapAsync from "../utils/wrap-async.js";
import { 
  handleRegisterCaterer, 
  handleGetOneCatererById,
  handleGetOneCatererByUserId,
  handleUpdateCaterer,
  handleDeleteCaterer
} from "../controllers/caterer.js";
import { handleUploadImage } from "../utils/cloud-init.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Register new caterer
router.post(
  "/register",
  upload.single("logo"),
  wrapAsync(handleUploadImage), 
  wrapAsync(handleRegisterCaterer) 
);

// Get caterer by ID
router.get("/getbyid/:id", wrapAsync(handleGetOneCatererById));
router.get("/getbyuserid/:userId", wrapAsync(handleGetOneCatererByUserId));

// Update caterer
router.put(
  "/update/:id",
  upload.single("logo"),
  wrapAsync(handleUploadImage),
  wrapAsync(handleUpdateCaterer)
);

// Delete caterer
router.delete("/delete/:id", wrapAsync(handleDeleteCaterer));

export default router;