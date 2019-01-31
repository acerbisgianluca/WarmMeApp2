let mqtt = require('mqtt');
let mqttOptions = require('./config').mqtt;

let client = mqtt.connect(
	'mqtts://mqtt.acerbisgianluca.com',
	mqttOptions
);

module.exports = client;
