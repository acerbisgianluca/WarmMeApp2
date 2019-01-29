var mongoose = require('mongoose');
var SensorsSchema = new mongoose.Schema(
	{
		id: Number,
		area: String,
	},
	{ collection: 'sensors' }
);

mongoose.model('Sensors', SensorsSchema);

module.exports = mongoose.model('Sensors');
