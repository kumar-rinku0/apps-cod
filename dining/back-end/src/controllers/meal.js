
import Meal from "../models/meal.js"

const handleCreateMeal = async (req, res) => {
    const object = req.body;
    const meal = new Meal(object);
    await meal.save();
    return res.status(201).json({ message: "Meal created successfully", meal: meal });
}

const handleSelectMeal = async (req, res) => {
    const { mealId, itemId } = req.body;
    const meal = await Meal.findById(mealId);
    if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
    }
    const item = meal.items.find(item => item._id.toString() === itemId);
    if (item) {
        await meal.updateOne({ $pull: { items: itemId } })
        return res.status(200).json({ message: "Item removed." });
    }
    meal.items.push(itemId);
    await meal.save();
    return res.status(200).json({ message: "Meal item selected" });
}

const handleGetMealById = async (req, res) => {
    const mealId = req.params.mealId;
    const meals = await Meal.findById(mealId).populate("items").exec();
    if (!meals) {
        return res.status(404).json({ message: "Meal not found" });
    }
    return res.json(meals);
}

const handleGetMealByEventId = async (req, res) => {
    const eventId = req.params.eventId;
    const meals = await Meal.find({ eventId: eventId }).populate("items").populate({
        path: 'items',
        populate: {
            path: 'category',
            model: 'Category'
        }
    }).exec();

    if (!meals) {
        return res.status(404).json({ message: "Meal not found" });
    }

    return res.json(meals);
}
export { handleCreateMeal, handleGetMealById, handleGetMealByEventId, handleSelectMeal };