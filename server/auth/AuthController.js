let express = require('express');
let bodyParser = require('body-parser');
let User = require('../models/Users');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config');
let VerifyToken = require('./VerifyToken');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
	let hashedPassword = bcrypt.hashSync(req.body.password, 8);

	User.findOne({ nome: req.body.username }, function(err, user) {
		if (err)
			return res
				.status(500)
				.send('C\'è un problema nella registrazione dell\'utente.');

		if (user)
			return res
				.status(409)
				.send('Un altro utente è già registrato con questa email.');

		User.create(
			{
				nome: req.body.username,
				email: req.body.email,
				password: hashedPassword,
			},
			(err, user) => {
				if (err)
					return res
						.status(500)
						.send(
							'C\'è un problema nella registrazione dell\'utente.'
						);

				let token = jwt.sign({ username: user.nome }, config.secret);
				res.status(200).send({ auth: true, token: token });
			}
		);
	});
});

router.put('/changePsw', VerifyToken, (req, res) => {
	User.findOne({ nome: req.username }, (err, user) => {
		if (err) throw err;
		let passwordIsValid = bcrypt.compareSync(
			req.body.oldPsw,
			user.password
		);
		if (!passwordIsValid)
			return res.json({
				auth: false,
				error: 'La password vecchia non è corretta!',
			});
		user.password = bcrypt.hashSync(req.body.newPsw, 8);
		user.save((err) => {
			if (err)
				return res.json({
					auth: false,
					error: 'Errore nell\'aggiornamento della password!',
				});

			res.json({
				auth: true,
				message: 'La password è stata aggiornata con successo!',
			});
		});
	});
});

router.post('/login', (req, res) => {
	User.findOne({ nome: req.body.username }, function(err, user) {
		if (err)
			return res
				.status(500)
				.json({ auth: false, error: 'Errore nel server.' });

		if (!user)
			return res
				.status(404)
				.json({ auth: false, error: 'Nessun utente trovato.' });

		let passwordIsValid = bcrypt.compareSync(
			req.body.password,
			user.password
		);
		if (!passwordIsValid)
			return res
				.status(401)
				.json({ auth: false, error: 'Password non valida.' });

		let token = jwt.sign({ username: user.nome }, config.secret);
		res.status(200).json({ auth: true, token: token });
	});
});

module.exports = router;
