let express = require('express');
let app = express();
let cors = require('cors');
app.use(cors());
let db = require('./db');
let Sensors = require('./data/Sensors');
let Sensor = require('./data/Sensor');
let Area = require('./data/Area');
let cron = require('./cron');
let api = require('./api.js');
let AuthController = require('./auth/AuthController');
app.use('/auth', AuthController);
app.use('/api', api);
app.listen(8080);

let mqtt = require('mqtt');

let client  = mqtt.connect('mqtt://localhost');

function insert(obj) {
    let temperatura = 0.00;
    let umidità = 0.00;
    let cont = 0;
    let media = 0.00;
    Sensor.create({idSensore:obj.id,temperatura:obj.temperature,umidità:obj.humidity}, function(err, addedSensor){
        if(err)
            throw err;
        Sensors.findOne({id: obj.id}, function(err, sensor){
            if(err)
                throw err;
            Sensors.find({area: sensor.area}, function(err, sensors){
                sensors.forEach(function(item, index, array){
                    Sensor.findOne().where('idSensore').equals(item.id).sort({_id:-1}).exec(function(err,sensore){
                        if(err)
                            throw err;
                        temperatura += parseFloat(sensore.temperatura);
                        umidità += parseFloat(sensore.umidità);
                        cont++;
                        if(array.length === cont){
                            Area.findOne({nome: sensor.area}, function (err, area) {
                                    if (err)
                                        throw(err);
                                    area.temperaturaAttuale = (temperatura/cont).toFixed(2);
                                    area.umidità = (umidità/cont).toFixed(2);
                                    if(area.temperaturaAttuale <= area.temperaturaImpostata + 1)
                                        area.acceso = true;
                                    else
                                        area.acceso = false;
                                    area.save(function (err, updatedArea) {
                                        if (err)
                                            throw(err);
                                    });
                            });
                        }
                    })
                });
            })
        })
    });
};

client.on('connect', function() {
    client.subscribe('sensors');
    console.log("Mi sono iscritto alla coda");
});

client.on('message', function (topic, message) {
    console.log("Messaggio ricevuto: " + message);
    obj = JSON.parse(message.toString());
    insert(obj);
});
