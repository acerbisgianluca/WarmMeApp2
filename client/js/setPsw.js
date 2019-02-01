$(document).ready(function() {
	isLoggedIn();
	$('#setPsw').submit(function() {
		$.ajax({
			url: 'https://casaacerbis.dlinkddns.com/node/auth/changePsw',
			headers: { Token: sessionStorage.getItem('access-token') },
			data: { oldPsw: $('#oldPsw').val(), newPsw: $('#newPsw').val() },
			type: 'PUT',
			dataType: 'json',
		})
			.done(function(data) {
				if (data.auth == false) alert(data.error);
				else {
					alert('La password è stata modificata con successo!');
					sessionStorage.removeItem('access-token');
					isLoggedIn();
				}
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
