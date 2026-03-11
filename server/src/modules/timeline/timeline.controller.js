const timelineService = require('./timeline.service');

exports.getTimeline = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) return res.status(400).json({ message: 'Search term is required' });

        const rows = await timelineService.getTimeline(search);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching timeline' });
    }
};
