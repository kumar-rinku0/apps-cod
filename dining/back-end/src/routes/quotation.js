import { Router } from 'express';
import {
    handleCreateQuotation,
    handleGetQuotationByIdWithMeals,
    handleGetQuotationByUserId,
    handleGetAllQuotations,
    handleGetQuotationById,
    handleUpdateQuotationStatus,
    handleDeleteQuotation
} from '../controllers/quotation.js';
import wrapAsync from '../utils/wrap-async.js';

const router = Router();


router.get("/get-all", wrapAsync(handleGetAllQuotations));
router.get("/get/:id", wrapAsync(handleGetQuotationById));
router.get("/getwithmeals/:id", wrapAsync(handleGetQuotationByIdWithMeals));
router.get("/getbyuserid/:userId", wrapAsync(handleGetQuotationByUserId));
router.put("/update/status/:id", wrapAsync(handleUpdateQuotationStatus));
router.delete("/delete/:id", wrapAsync(handleDeleteQuotation));

export default router;



//okk
