import Holiday from "../model/holidays.js";

const handleCreateHoliday = async (req, res) => {

    const holiday = new Holiday(req.body);
    const saved = await holiday.save();
    res.status(201).json(saved);
}

const handleGetHolidaysByYear = async (req, res) => {
    const { year } = req.params;

    const holidays = await Holiday.find({
        date: { $regex: `^${year}` },
    }).sort({ date: 1 });
    res.json(holidays);
}

export { handleCreateHoliday, handleGetHolidaysByYear }
