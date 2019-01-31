let mongoose = require('mongoose');
let UsersSchema = new mongoose.Schema(
	{
		nome: String,
		email: String,
		password: String,
	},
	{ collection: 'users' }
);

mongoose.model('Users', UsersSchema);

module.exports = mongoose.model('Users');
