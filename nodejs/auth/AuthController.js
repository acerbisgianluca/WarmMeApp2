var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../user/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');

router.post('/register', function(req, res, next) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.findOne({ name: req.body.username }, function (err, user) {
        if (err)
            return res.status(500).send("Un altro utente è già registrato con questa email.");
        if(user)
            return res.status(500).send("C'è un problema nella registrazione dell'utente.");
        User.create({
            name : req.body.username,
            email : req.body.email,
            password : hashedPassword
        },
        function (err, user) {
            if (err)
                return res.status(500).send("C'è un problema nella registrazione dell'utente.");
            var token = jwt.sign({ username: user.name }, config.secret);
            res.status(200).send({ auth: true, token: token });
        });
    });
});

router.post('/changePsw', VerifyToken, function(req, res, next){
    User.findOne({name: req.username}, function (err, user) {
        if (err)
            throw (err);
        var passwordIsValid = bcrypt.compareSync(req.body.oldPsw, user.password);
        if(!passwordIsValid)
            return res.json({auth: false, error: "La password vecchia non è valida!"});;
        user.password = bcrypt.hashSync(req.body.newPsw, 8);
        user.save(function (err, updatedUser) {
            if (err)
                return res.json({auth: false, error: "Impossibile salvare i dati!"});;
            res.json({auth: true, message: "La password è stata aggiornata con successo!"});
        });
    });
});

router.post('/login', function(req, res, next) {
    User.findOne({name: req.body.username}, function (err, user) {
        if (err)
            return res.status(500).json({auth:false, error:'Errore nel server.'});
        if (!user)
            return res.status(404).json({auth:false, error:'Nessun utente trovato.'});
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid)
            return res.status(401).json({auth:false, error:'Password non valida.'});
        var token = jwt.sign({ username: user.name }, config.secret);
        res.status(200).json({auth: true, token: token});
    });
});

module.exports = router;
