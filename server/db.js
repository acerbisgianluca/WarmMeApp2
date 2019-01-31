let mongoose = require('mongoose');
let dbConf = require('./config').mongo;
mongoose.Promise = require('bluebird');

mongoose.connect(
	`mongodb://${dbConf.username}:${
		dbConf.password
	}@ds147734.mlab.com:47734/arduino`,
	{ useMongoClient: true }
);
