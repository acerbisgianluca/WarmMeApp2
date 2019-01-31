let cron = require('node-cron');
let Area = require('./models/Area');
let client = require('./mqtt');

let areasStatus = [],
	update;
Area.find().exec((err, areas) => {
	if (err) return;
	areas.forEach((el, i) => {
		areasStatus[i] = 0;
	});
});

cron.schedule('*/30 * * * * *', () => {
	Area.find().exec((err, areas) => {
		if (err) return;
		areas.forEach((el, i) => {
			if (el.acceso && areasStatus[i] === 0) {
				console.log(i + ' - ACCESO');
				areasStatus[i] = 1;
				update = { status: 'on' };
				client.publish(
					'arduinostatus' + el.nome,
					JSON.stringify(update)
				);
			} else if (!el.acceso && areasStatus[i] === 1) {
				console.log(i + ' - SPENTO');
				areasStatus[i] = 0;
				update = { status: 'off' };
				client.publish(
					'arduinostatus' + el.nome,
					JSON.stringify(update)
				);
			}
		});
	});
});
