let cron = require('node-cron');
let Area = require('./models/Area');
let client = require('./mqtt');

let areasStatus = [],
	update;
Area.find().exec((err, areas) => {
	if (err) return;
	console.log('Inizializzazione dello stato dei relays nelle zone:');
	areas.forEach((el, i) => {
		areasStatus[i] = el.acceso ? 1 : 0;
		if (el.acceso) {
			console.log('\t' + i + ' - ACCESO');
			update = { status: 'on' };
			client.publish('arduinostatus' + el.nome, JSON.stringify(update));
		} else {
			console.log('\t' + i + ' - SPENTO');
		}
	});
});

let task = cron.schedule(
	'*/30 * * * * *',
	() => {
		console.log('Controllo dei relays!');
		Area.find().exec((err, areas) => {
			if (err) return;
			areas.forEach((el, i) => {
				if (el.acceso && areasStatus[i] === 0) {
					console.log('Aggiornamento relay:\t' + i + ' - ACCESO');
					areasStatus[i] = 1;
				} else if (!el.acceso && areasStatus[i] === 1) {
					console.log('Aggiornamento relay:\t' + i + ' - SPENTO');
					areasStatus[i] = 0;
				}
				update = { status: el.acceso ? 'on' : 'off' };
				client.publish(
					'arduinostatus' + el.nome,
					JSON.stringify(update)
				);
			});
		});
	},
	{
		scheduled: false,
	}
);

module.exports = task;
