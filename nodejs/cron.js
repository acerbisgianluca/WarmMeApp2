var cron = require('node-cron');
var Area = require('./data/Area');
var gpio = require('gpio');

var gpio19 = gpio.export(19, {direction: "out", ready:function(){}});
var gpio16 = gpio.export(16, {direction: "out", ready:function(){}});
var gpio26 = gpio.export(26, {direction: "out", ready:function(){}});
var gpio20 = gpio.export(20, {direction: "out", ready:function(){}});

var relays = [gpio19,gpio16,gpio26,gpio20];

relays.forEach(function(el,i){
    relays[i].set(0);
})

cron.schedule('*/10 * * * * *', function(){
    Area.find().exec(function(err, areas){
        areas.forEach(function(el, i){
            if(el.acceso && relays[i].value == 0){
                console.log(i + " - ACCESO");
                relays[i].set();
            }
            else if(!el.acceso && relays[i].value == 1){
                console.log(i + " - SPENTO");
                relays[i].set(0);
            }
        })
    })
});

// function write(pin) {
//     gpio.write(pin, false, function(err) {
//         if (err) throw err;
//     });

/*
ZONE: A - B - STUFA1 - STUFA2
PIN: 19 - 26 - 16 - 20

ASSOCIATION:{
A - 19
B -
STUFA1 -

}
*/
