var mongoose = require('mongoose');
var AreasSchema = new mongoose.Schema(
	{
		nome: String,
		temperaturaAttuale: Number,
		temperaturaImpostata: Number,
		acceso: Boolean,
	},
	{ collection: 'areas' }
);

mongoose.model('Areas', AreasSchema);

module.exports = mongoose.model('Areas');
