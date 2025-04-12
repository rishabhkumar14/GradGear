


exports.exception_handler = async function (err, req, res, next) {
	console.error(err);
	res.status(err.status || 500);
	res.json({ Error: err.message });
}