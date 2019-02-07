let express = require('express');
let db = require('./db');
let Sensors = require('./models/Sensors');
let Temperature = require('./models/Temperature');
let Area = require('./models/Area');
let cron = require('./cron');
let api = require('./api.js');
let AuthController = require('./auth/AuthController');
let cors = require('cors');
let client = require('./mqtt');

let app = express();
app.use(cors());
app.use('/auth', AuthController);
app.use('/api', api);
app.listen(8080);

cron.start();
console.log('Cronjob di controllo dei relays avviato!');

let insert = (obj) => {
	let temperatura = 0.0;
	let umidità = 0.0;
	let cont = 0;
	Temperature.create(
		{
			idSensore: obj.id,
			temperatura: obj.temp,
			umidità: obj.hum,
		},
		(err) => {
			if (err) throw err;
			Sensors.findOne({ id: obj.id }, (err, sensor) => {
				if (err) throw err;
				Sensors.find({ area: sensor.area }, (err, sensors) => {
					sensors.forEach((item, index, array) => {
						Temperature.findOne()
							.where('idSensore')
							.equals(item.id)
							.sort({ _id: -1 })
							.exec((err, sensore) => {
								if (err) throw err;
								temperatura += parseFloat(sensore.temperatura);
								umidità += parseFloat(sensore.umidità);
								cont++;
								if (array.length === cont) {
									Area.findOne(
										{ nome: sensor.area },
										(err, area) => {
											if (err) throw err;
											area.temperaturaAttuale = (
												temperatura / cont
											).toFixed(2);
											area.umidità = (
												umidità / cont
											).toFixed(2);
											if (
												area.temperaturaAttuale <
												area.temperaturaImpostata
											)
												area.acceso = true;
											else area.acceso = false;
											area.save((err) => {
												if (err) throw err;
											});
										}
									);
								}
							});
					});
				});
			});
		}
	);
};

client.on('connect', () => {
	console.log('Connesso al broker!');
	client.subscribe('arduinodata');
	console.log('Iscritto ad arduinodata!');
});

client.on('message', (topic, message) => {
	console.log('Messaggio ricevuto da : ' + topic + '\t' + message);
	let obj = JSON.parse(message.toString());
	insert(obj);
});
