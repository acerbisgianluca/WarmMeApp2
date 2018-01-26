$(document).ready(function() {
    table1 = $('#sensorTable').DataTable({
        searching: false,
        order: [[ 0, "asc" ]],
        columns: [
            {title: "Data e ora"},
            {title: "Temperatura"},
            {title: "Umidità"}
        ]
    });

    $.ajax({
        url: "http://192.168.42.69:8080/api/sensors",
        headers: {Token: sessionStorage.getItem('access-token')},
        dataType: "json",
        success:function(data){
            if(isEmpty(data))
                return alert("Nessun sensore registrato!");;
            var items = [];
            $.each(data, function(){
                items.push([this.id, this.area, "<button type='button' class='btn btn-primary' id = '" + this.id + "'  onclick='showTable(" + this.id + ")'>Mostra</button>", "<input type='checkbox' name='sensorId[]' id='" + this.id + "' value='" + this.id + "'>"]);
            });

            table = $('#sensorsTable').DataTable({
                searching: false,
                paging: false,
                lengthChange: false,
                data: items,
                columns: [
                    {title: "Id"},
                    {title: "Area"},
                    {title: "Dettagli", orderable: false},
                    {title: "Cancella", orderable: false}
                ]
            });
        },
        error: function(data, status){
            alert("Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!");
            window.location.replace("./login.html");
        }});

    $("#submit").click(function() {
        var ids = [];
        $('input:checkbox:checked').each(function() {
            ids.push($(this).val());
        });
        ids.forEach(function(v, i){
            $.ajax({
                url: "http://192.168.42.69:8080/api/delSensor",
                headers: {Token: sessionStorage.getItem('access-token')},
                data: {id: v},
                type: 'POST',
                dataType: "json"})
                .done(function(data){
                    if(data.auth)
                        if((i + 1) == ids.length){
                            alert(data.message);
                            aggiorna();
                        }
                    else{
                        if((i + 1) == ids.length){
                            alert(data.error);
                            aggiorna();
                        }
                    }
                })
                .fail(function(data, status){
                    alert("Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!");
                    window.location.replace("./login.html");
                });
        })
        return false;
    });
});

function aggiorna(){
    table.destroy();
    $.ajax({
        url: "http://192.168.42.69:8080/api/sensors",
        headers: {Token: sessionStorage.getItem('access-token')},
        dataType: "json",
        success:function(data){
            if(isEmpty(data))
                return alert("Nessun sensore registrato!");;
            var items = [];
            $.each(data, function(){
                items.push([this.id, this.area, "<button type='button' class='btn btn-primary' id = '" + this.id + "'  onclick='showTable(" + this.id + ")'>Mostra</button>", "<input type='checkbox' value='" + this.id + "'>"]);
            });

            table = $('#sensorsTable').DataTable({
                searching: false,
                paging: false,
                lengthChange: false,
                data: items,
                columns: [
                    {title: "Id"},
                    {title: "Area"},
                    {title: "Dettagli", orderable: false},
                    {title: "Cancella", orderable: false}
                ]
            });
        }});
};

function showTable(id) {
    table1.destroy();
    document.getElementById("divTable").style.display="block";
    document.getElementById("sensor").innerHTML = " Storico sensore " + id;

    $.ajax({
        url: "http://192.168.42.69:8080/api/sensorAll/" + id,
        headers: {Token: sessionStorage.getItem('access-token')},
        dataType: "json",
        success: function(data){
            if(isEmpty(data))
                return alert("Nessun valore registrato per il sensore " + id + "!");;
            var objs = [];
            $.each(data, function(){
                objs.push([new Date(parseInt(this._id.substring(0, 8), 16) * 1000).toUTCString(),this.temperatura, this.umidità]);
            });

            table1 = $('#sensorTable').DataTable({
                searching: false,
                order: [[ 0, "asc" ]],
                data: objs,
                columns: [
                    {title: "Data e ora"},
                    {title: "Temperatura"},
                    {title: "Umidità"}
                ]
            });

            var temps = [];
            var date = [];
            $.each(data, function(){
                temps.push(this.temperatura);
                date.push(new Date(parseInt(this._id.substring(0, 8), 16) * 1000).toUTCString().substring(17,25));
            });

            var ctx = document.getElementById("grafico");
            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: date.slice(0,0+10),
                    datasets: [{
                        label: "Temperatura",
                        lineTension: 0.3,
                        backgroundColor: "rgba(2,117,216,0.2)",
                        borderColor: "rgba(2,117,216,1)",
                        pointRadius: 5,
                        pointBackgroundColor: "rgba(2,117,216,1)",
                        pointBorderColor: "rgba(255,255,255,0.8)",
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(2,117,216,1)",
                        pointHitRadius: 20,
                        pointBorderWidth: 2,
                        data: temps.slice(0, 0 + 10),
                    }],
                },
                options: {
                    scales: {
                        xAxes: [{
                            time: {
                                unit: 'date'
                            },
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                maxTicksLimit: 7
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                min: 10,
                                max: 40,
                                maxTicksLimit: 5
                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, .125)",
                            }
                        }],
                    },
                    legend: {
                        display: false
                    }
                }
            });
    }});


};

function isEmpty(obj) {
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function logout(){
    sessionStorage.removeItem('access-token');
    window.location.replace("./login.html");
};

$('#closeTable').click(function(){
    document.getElementById("divTable").style.display="none";
})
