const testService = require('./test.service');

exports.getAllTests = async (req, res) => {
    try {
        const tests = await testService.getAllTests();
        res.json(tests);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
};

exports.createTest = async (req, res) => {
    try {
        const result = await testService.createTest(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        await testService.deleteTest(req.params.id);
        res.json({ message: 'Test deleted' });
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({ error: 'Failed to delete test' });
    }
};
