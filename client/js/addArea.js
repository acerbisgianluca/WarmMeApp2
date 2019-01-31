$(document).ready(function() {
	isLoggedIn();
	$('#setArea').submit(function() {
		$.ajax({
			url: 'http://192.168.1.252:8080/api/areas',
			headers: { Token: sessionStorage.getItem('access-token') },
			data: {
				nome: $('#areaName').val(),
				temperaturaImpostata: $('#temp').val(),
			},
			type: 'POST',
			dataType: 'json',
		})
			.done(function(data) {
				if (data.auth) alert(data.message);
				else alert(data.error);
			})
			.fail(function(data, status) {
				alert(
					"Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!"
				);
				window.location.replace('./login.html');
			});
		return false;
	});
});

function isLoggedIn() {
	if (isEmpty(sessionStorage.getItem('access-token'))) {
		alert(
			"Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!"
		);
		window.location.replace('./login.html');
	}
}

function isEmpty(obj) {
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
}

function logout() {
	sessionStorage.removeItem('access-token');
	window.location.replace('./login.html');
}
