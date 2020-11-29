module.exports = {
	method: 'GET',
	path: '/health',
	controller: (req, res) => {
		res.json({ alive: true });
	}
};
