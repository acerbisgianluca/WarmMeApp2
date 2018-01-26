var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://admin:admin@localhost:27017/eziohouse', {useMongoClient: true});
