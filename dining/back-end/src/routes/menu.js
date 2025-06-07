import { Router } from 'express';
import multer from 'multer';
import { handleCreateCategory, handleGetAllCategories, handleCreateItem, handleGetAllItems, handleUpdateMenuItem, handleDeleteMenuItem, handleUpdateMenuCategory, handleDeleteMenuCategory } from '../controllers/menu.js';
import wrapAsync from '../utils/wrap-async.js';
import { handleUploadImage } from '../utils/cloud-init.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', upload.single("image"), wrapAsync(handleUploadImage), wrapAsync(handleCreateCategory));
router.get('/getAll', wrapAsync(handleGetAllCategories));

router.post('/create/item', upload.single("image"), wrapAsync(handleUploadImage), wrapAsync(handleCreateItem));
router.get('/getAll/:categoryId', wrapAsync(handleGetAllItems));

router.put('/update/item/:id', upload.single("image"), wrapAsync(handleUploadImage), wrapAsync(handleUpdateMenuItem));
router.delete('/delete/item/:id', wrapAsync(handleDeleteMenuItem));

router.put('/update/category/:id', upload.single("image"), wrapAsync(handleUploadImage), wrapAsync(handleUpdateMenuCategory));
router.delete('/delete/category/:id', wrapAsync(handleDeleteMenuCategory));


export default router;
