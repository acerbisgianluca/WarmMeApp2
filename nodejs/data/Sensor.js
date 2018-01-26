var mongoose = require('mongoose');
var SensorSchema = new mongoose.Schema({
    idSensore: Number,
    temperatura: Number,
    umidità: Number
},{collection: 'temperature'});

mongoose.model('Temperature', SensorSchema);

module.exports = mongoose.model('Temperature');
