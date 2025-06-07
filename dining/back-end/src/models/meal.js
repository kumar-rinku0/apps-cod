import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    mealNumber: Number,
    mealType: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    address: { type: String, required: true },
    numberOfGuests: { type: Number, required: true },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Item',
    },
}, { timestamps: true });

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
