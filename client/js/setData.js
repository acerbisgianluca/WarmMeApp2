$(document).ready(function() {
    $.ajax({
        url: "http://192.168.42.69:8080/api/areas",
        headers: {Token: sessionStorage.getItem('access-token')},
        dataType: "json",
        success: function(data){
            if(isEmpty(data))
                return alert("Nessuna area registrata!");;
            var items = [];
            $.each(data, function(){
                items.push([this.nome, this.temperaturaAttuale, "<input type = 'hidden' value = '" + this.nome + "' name='nome[]'/><input class = 'form-control' type = 'number' value = '" + this.temperaturaImpostata + "' min = '15' max = '30' name = 'temp[]'/>", this.acceso]);
            });

            table = $('#areasTable').DataTable({
                searching: false,
                paging: false,
                lengthChange: false,
                processing:true,
                data: items,
                columns: [
                    {title: "Area"},
                    {title: "Temperatura attuale"},
                    {title: "Imposta temperatura", orderable: false},
                    {title: "Acceso"}
                ]
            });
        },
        error: function(data, status){
            alert("Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!");
            window.location.replace("./login.html");
        }});

    $("#setTemp").submit(function() {
        var nomi = [], temps = [];
        $("input[name='nome\\[\\]']").each(function(){
            nomi.push($(this).val())
        })
        $("input[name='temp\\[\\]']").each(function(){
            temps.push($(this).val())
        })
        nomi.forEach(function(v,i){
            $.ajax({
                url: "http://192.168.42.69:8080/api/setTemp",
                headers: {Token: sessionStorage.getItem('access-token')},
                data: {nome: v, temperaturaImpostata: temps[i]},
                type: 'POST',
                dataType: "json"})
                .done(function(data){
                    if((i + 1) == nomi.length){
                        alert("I dati sono stati inviati correttamente");
                        aggiorna();
                    }
                })
                .fail(function(data, status){
                    alert("Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!");
                    window.location.replace("./login.html");
                });
        });
        return false;
    });
});

function isEmpty(obj) {
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function aggiorna(){
    table.destroy();
    $.ajax({
        url: "http://192.168.42.69:8080/api/areas",
        headers: {Token: sessionStorage.getItem('access-token')},
        dataType: "json",
        success: function(data){
            if(isEmpty(data))
                return alert("Nessuna area registrata!");;
            var items = [];
            $.each(data, function(){
                items.push([this.nome, this.temperaturaAttuale, "<input type = 'hidden' value = '" + this.nome + "' name='nome[]'/><input class = 'form-control' type = 'number' value = '" + this.temperaturaImpostata + "' min = '15' max = '30' name = 'temp[]'/>", this.acceso]);
            });

            table = $('#areasTable').DataTable({
                searching: false,
                paging: false,
                lengthChange: false,
                processing:true,
                data: items,
                columns: [
                    {title: "Area"},
                    {title: "Temperatura attuale"},
                    {title: "Imposta temperatura", orderable: false},
                    {title: "Acceso"}
                ]
            });
        },
        error: function(data, status){
            alert("Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!");
            window.location.replace("./login.html");
        }});
}

function logout(){
    sessionStorage.removeItem('access-token');
    window.location.replace("./login.html");
}
