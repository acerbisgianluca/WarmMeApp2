let express = require('express');
let bodyParser = require('body-parser');
let Sensors = require('./models/Sensors');
let Temperature = require('./models/Temperature');
let Area = require('./models/Area');
let VerifyToken = require('./auth/VerifyToken');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/sensors', VerifyToken, (req, res) => {
	Sensors.find().exec((err, sensors) => {
		if (err) throw err;
		if (isEmpty(sensors))
			return res.json({ auth: true, error: 'Nessun sensore trovato' });

		res.json(sensors);
	});
});

// TODO aggiungere limit al client (/sensor/:id)
// TODO /sensorAll/:id
router.get('/temperature/:id', VerifyToken, (req, res) => {
	Temperature.find()
		.where('idSensore')
		.equals(req.params.id)
		.sort({ _id: -1 })
		.exec((err, sensor) => {
			if (err) throw err;
			if (isEmpty(sensor))
				return res.json({
					auth: true,
					error: 'Nessun dato per quel sensore',
				});
			if (req.query.limit) return res.json(sensor[0]);

			res.json(sensor);
		});
});

router.get('/areas', VerifyToken, (req, res) => {
	Area.find().exec((err, areas) => {
		if (err) throw err;
		if (isEmpty(areas))
			return res.json({ auth: true, error: 'Nessun sensore trovato' });
		res.json(areas);
	});
});

// TODO /setTemp diventa PUT /areas
router.put('/areas/:nome', VerifyToken, (req, res) => {
	Area.findOne({ nome: req.params.nome }, (err, area) => {
		if (err) throw err;
		area.temperaturaImpostata = req.body.temperaturaImpostata;
		if (area.temperaturaAttuale <= area.temperaturaImpostata + 1)
			area.acceso = true;
		else area.acceso = false;

		area.save((err) => {
			if (err)
				return res.json({
					auth: false,
					error: 'Impossibile impostare la temperatura!',
				});

			res.json({
				auth: true,
				message: 'La temperatura è stata aggiornata con successo!',
			});
		});
	});
});

// TODO era addSensor ora diventa POST /sensors
router.post('/sensors', VerifyToken, (req, res) => {
	Sensors.findOne({ id: req.body.id }, (err, sensor) => {
		if (err)
			return res.json({
				auth: false,
				error: 'Impossibile controllare se il sensore esiste già!',
			});

		if (sensor)
			return res.json({
				auth: false,
				error: 'Un sensore con questo id esiste già!',
			});

		Sensors.create({ id: req.body.id, area: req.body.area }, (err) => {
			if (err)
				return res.json({
					auth: false,
					error: 'Impossibile aggiungere il sensore!',
				});
			res.json({
				auth: true,
				message: 'Il sensore è stato aggiunto con successo!',
			});
		});
	});
});

router.post('/areas', VerifyToken, (req, res) => {
	Area.findOne({ nome: req.body.nome }, (err, area) => {
		if (err)
			return res.json({
				auth: false,
				error: 'Impossibile controllare se il sensore esiste già!',
			});

		if (area)
			return res.json({
				auth: false,
				error: 'Un\'area con questo id esiste già!',
			});

		Area.create(
			{
				nome: req.body.nome,
				temperaturaAttuale: 15,
				temperaturaImpostata: req.body.temperaturaImpostata,
				acceso: false,
			},
			(err) => {
				if (err)
					return res.json({
						auth: false,
						error: 'Impossibile aggiungere l\'area!',
					});
				res.json({
					auth: true,
					message: 'L\'area è stata aggiunta con successo!',
				});
			}
		);
	});
});

router.delete('/areas/:nome', VerifyToken, (req, res) => {
	Area.count({}, (err, count) => {
		if (err)
			return res.json({
				auth: false,
				error: 'Impossibile eliminare l\'area!',
			});
		if (count === 1)
			return res.json({
				auth: false,
				error: 'Impossibile eliminare l\'ultima area!',
			});

		Area.find({ nome: req.params.nome })
			.remove()
			.exec((err) => {
				if (err)
					return res.json({
						auth: false,
						error: 'Impossibile eliminare l\'area!',
					});

				res.json({
					auth: true,
					message: 'L\'area è stata eliminata con successo!',
				});
			});
	});
});

// TODO era delSensor ora diventa DELETE /sensors/:id
router.delete('/sensors/:id', VerifyToken, (req, res) => {
	Sensors.count({}, (err, count) => {
		if (err)
			return res.json({
				auth: false,
				error: 'Impossibile eliminare il sensore',
			});
		if (count === 1)
			return res.json({
				auth: false,
				error: 'Impossibile eliminare l\'ultimo sensore',
			});

		Sensors.find({ id: req.params.id })
			.remove()
			.exec((err) => {
				if (err)
					return res.json({
						auth: false,
						error: 'Impossibile eliminare il sensore!',
					});

				res.json({
					auth: true,
					message: 'Il sensore è stato eliminato con successo!',
				});
			});
	});
});

let isEmpty = (obj) => {
	for (let key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
};

module.exports = router;
