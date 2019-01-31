let mongoose = require('mongoose');
let TemperatureSchema = new mongoose.Schema(
	{
		idSensore: Number,
		temperatura: Number,
		umidità: Number,
	},
	{ collection: 'temperature' }
);

mongoose.model('Temperature', TemperatureSchema);

module.exports = mongoose.model('Temperature');
