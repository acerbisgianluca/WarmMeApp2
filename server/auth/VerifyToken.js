var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
	var token = req.get('Token');
	if (!token)
		return res
			.status(403)
			.json({ auth: false, error: 'Nessun token fornito.' });

	jwt.verify(token, config.secret, function(err, decoded) {
		if (err)
			return res.status(500).json({
				auth: false,
				error: 'Tentativo di autenticazione fallito.',
			});

		req.username = decoded.username;
		next();
	});
}

module.exports = verifyToken;
