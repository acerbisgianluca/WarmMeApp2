$(document).ready(function() {
	isLoggedIn();
	$.ajax({
		url: 'https://casaacerbis.dlinkddns.com/node/api/areas',
		headers: { Token: sessionStorage.getItem('access-token') },
		dataType: 'json',
	})
		.done(function(data) {
			if (data.error) return alert(data.error);
			data.forEach((el) =>
				$('#area').append(
					`<option value="${el.nome}">${el.nome}</option>`
				)
			);
		})
		.fail(function(data, status) {
			alert(
				"Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!"
			);
			window.location.replace('./login.html');
		});

	$('#setSensor').submit(function() {
		$.ajax({
			url: 'https://casaacerbis.dlinkddns.com/node/api/sensors',
			headers: { Token: sessionStorage.getItem('access-token') },
			data: { id: $('#sensorId').val(), area: $('#area').val() },
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
	for (let key in obj) {
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
}

function logout() {
	sessionStorage.removeItem('access-token');
	window.location.replace('./login.html');
}
