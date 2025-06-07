import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    eventName: String,
    eventType: String,
    startDate: Date,
    endDate: Date,
    venue: String,
    fullName: String,
    email: String,
    phone: String,
    address: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;