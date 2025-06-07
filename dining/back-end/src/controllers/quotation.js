import Quotation from "../models/quotation.js";
import Meal from "../models/meal.js";
import Event from "../models/event.js";

// Create quotation
const handleCreateQuotation = async (req, res) => {
    const obj = req.body;
    const { eventId } = obj;
    const quotation = new Quotation(obj);
    await quotation.save();
    const event = await Event.findById(eventId);
    return res.status(201).json({ quotation: quotation, event: event, message: "okay." });
}

// Get all quotations
const handleGetAllQuotations = async (req, res) => {
    const quotations = await Quotation.find().populate("userId").populate("eventId");
    return res.json(quotations);
}

// Get single quotation by ID
const handleGetQuotationById = async (req, res) => {
    const { id } = req.params;
    const quotation = await Quotation.findById(id).populate("userId").populate("eventId");
    if (!quotation) return res.status(404).json({ error: "Quotation not found" });
    res.json(quotation);
}

// Get single quotation by ID
const handleGetQuotationByUserId = async (req, res) => {
    const { userId } = req.params;
    const quotation = await Quotation.find({ userId: userId }).populate("eventId");
    if (!quotation) return res.status(404).json({ error: "Quotation not found" });
    return res.json(quotation);
}

// Get single quotation by ID
const handleGetQuotationByIdWithMeals = async (req, res) => {
    const { id } = req.params;
    const quotation = await Quotation.findById(id).populate("userId").populate("eventId");
    if (!quotation) return res.status(404).json({ error: "Quotation not found" });
    const meals = await Meal.find({ eventId: quotation.eventId._id }).populate("items").populate({
        path: 'items',
        populate: {
            path: 'category',
            model: 'Category'
        }
    }).exec();
    return res.json({ quotation: quotation, meals: meals });
}
// Update quotation status
const handleUpdateQuotationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Quotation.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ message: "Quotation not found" });
    }

    return res.status(200).json({ message: "Status updated", quotation: updated });
}

// Delete quotation
const handleDeleteQuotation = async (req, res) => {
    const { id } = req.params;
    await Quotation.findByIdAndDelete(id);
    return res.json({ message: "Quotation deleted" });
}

export { handleCreateQuotation, handleGetQuotationByUserId, handleGetQuotationByIdWithMeals, handleGetAllQuotations, handleGetQuotationById, handleUpdateQuotationStatus, handleDeleteQuotation }