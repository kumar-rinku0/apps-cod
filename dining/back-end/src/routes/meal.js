import { Router } from 'express';
import { handleCreateMeal, handleGetMealByEventId, handleGetMealById, handleSelectMeal } from '../controllers/meal.js';
import wrapAsync from '../utils/wrap-async.js';

const router = Router();

router.post('/create', wrapAsync(handleCreateMeal));
router.post('/select', wrapAsync(handleSelectMeal));
router.get('/mealbyid/:mealId', wrapAsync(handleGetMealById));
router.get('/mealbyeventid/:eventId', wrapAsync(handleGetMealByEventId));


export default router;
