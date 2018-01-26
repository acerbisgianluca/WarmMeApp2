$(document).ready(function() {
    $("#loginform").submit(function() {
        $.ajax({
            url: "http://192.168.42.69:8080/auth/login",
            data: {username: $('#username').val(), password: $('#password').val()},
            type: 'POST',
            dataType: "json"})
            .done(function(data){
                sessionStorage.setItem('access-token', data.token);
                window.location.replace("./index.html");
            })
            .fail(function(data, status){
                alert("Dati di accesso non corretti");
            });
        return false;
    });
});
