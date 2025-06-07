import Event from '../models/event.js';

const handleCreateEvent = async (req, res) => {
    const userId = req.user._id;
    const obj = req.body;
    const event = new Event({ ...obj, userId: userId });
    await event.save();
    return res.status(201).json({ message: 'Form submitted successfully', event: event });
}


const handleGetEventById = async (req, res) => {
    const { eventId } = req.params;
    const event = await EventForm.findById(eventId);

    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(event);
}
export { handleCreateEvent, handleGetEventById }