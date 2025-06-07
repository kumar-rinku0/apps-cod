import { Router } from 'express';
import { handleCreateEvent, handleGetEventById } from '../controllers/event.js';
import { onlyLoggedInUser } from '../middlewares/auth.js';
import wrapAsync from '../utils/wrap-async.js';

const router = Router();

router.post('/submit', onlyLoggedInUser, wrapAsync(handleCreateEvent));
router.get("/:eventId", wrapAsync(handleGetEventById));

export default router;
