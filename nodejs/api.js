var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Sensors = require('./data/Sensors');
var Sensor = require('./data/Sensor');
var Area = require('./data/Area');
var VerifyToken = require('./auth/VerifyToken');

router.get('/sensors', VerifyToken, function(req, res, next){
    Sensors.find().exec(function(err, sensors){
        if(err)
            throw err;
        if(isEmpty(sensors))
            return res.json({auth: true, error: "No sensors found"});
        res.json(sensors);
    });
});

router.get('/sensor/:id', VerifyToken, function(req, res, next){
    Sensor.find().where('idSensore').equals(req.params.id).limit(1).sort({_id:-1}).exec(function(err, sensor){
        if(err)
            throw err;
        if(isEmpty(sensor))
            return res.json({auth: true, error: "No data found for that sensor"});
        res.json(sensor[0]);
    });
});

router.get('/sensorAll/:id', VerifyToken, function(req, res, next){
    Sensor.find().where('idSensore').equals(req.params.id).sort({_id:-1}).exec(function(err, sensor){
        if(err)
            throw err;
        if(isEmpty(sensor))
            return res.json({auth: true, error: "No data found for that sensor"});
        res.json(sensor);
    });
});

router.get('/areas', VerifyToken, function(req, res, next){
    Area.find().exec(function(err, areas){
        if(err)
            throw err;
        if(isEmpty(areas))
            return res.json({auth: true, error: "No sensors found"});
        res.json(areas);
    });
});

router.post('/setTemp', VerifyToken, function(req, res, next){
    Area.findOne({nome: req.body.nome}, function (err, area) {
        if (err)
            return handleError(err);
        area.temperaturaImpostata = req.body.temperaturaImpostata;
        if(area.temperaturaAttuale <= area.temperaturaImpostata + 1)
            area.acceso = true;
        else
            area.acceso = false;
        area.save(function (err, updatedArea) {
            if (err)
                return res.json({auth: false, error: "Impossibile salvare i dati!"});;
            res.json({auth: true, message: "I dati sono stati aggiornati con successo!"});
        });
    });
});

router.post('/addSensor', VerifyToken, function(req, res, next){
    Sensors.findOne({id: req.body.id}, function(err, sensor){
        if(err)
            return res.json({auth:false, error: "Impossibile controllare se il sensore esiste già."});;
        if(sensor)
            return res.json({auth:false, error: "Un sensore con questo id esiste già!"});;
            Sensors.create({id: req.body.id, area: req.body.area}, function(err, addedSensor){
                if(err)
                    return res.json({auth:false, error: "Impossibile creare il sensore"});;
                res.json({auth: true, message: "Il sensore è stato aggiunto con successo"});
            });
    });
});

router.post('/delSensor', VerifyToken, function(req, res, next){
    Sensors.find({id: req.body.id}).remove().exec(function(err, removedSensor){
        if(err)
            return res.json({auth: false, error: "Impossibile eliminare il sensore"});;
        res.json({auth: true, message: "Il sensore è stato eliminato con successo"});;
    });
});

function isEmpty(obj) {
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
};

module.exports = router;
