$(document).ready(function() {
	$.ajax({
		url: 'http://192.168.1.252:8080/api/areas',
		headers: { Token: sessionStorage.getItem('access-token') },
		dataType: 'json',
		success: function(data) {
			if (data.error) return alert('Nessuna area registrata!');
			var items = [];
			$.each(data, function() {
				items.push([
					this.nome,
					this.temperaturaImpostata,
					this.temperaturaAttuale,
					"<input type='checkbox' name='areaName[]' id='" +
						this.nome +
						"' value='" +
						this.nome +
						"'>",
				]);
			});

			table = $('#areasTable').DataTable({
				searching: false,
				paging: false,
				lengthChange: false,
				data: items,
				columns: [
					{ title: 'Nome' },
					{ title: 'Temperatura impostata' },
					{ title: 'Temperatura attuale' },
					{ title: 'Cancella', orderable: false },
				],
			});
		},
		error: function(data, status) {
			alert(
				"Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!"
			);
			window.location.replace('./login.html');
		},
	});

	$('#submit').click(function() {
		var ids = [];
		$('input:checkbox:checked').each(function() {
			ids.push($(this).val());
		});
		ids.forEach(function(v, i) {
			$.ajax({
				url: 'http://192.168.1.252:8080/api/areas/' + v,
				headers: { Token: sessionStorage.getItem('access-token') },
				type: 'DELETE',
				dataType: 'json',
			})
				.done(function(data) {
					if (data.auth)
						if (i + 1 == ids.length) {
							alert(data.message);
							aggiorna();
						} else {
							if (i + 1 == ids.length) {
								alert(data.error);
								aggiorna();
							}
						}
				})
				.fail(function(data, status) {
					alert(
						"Devi eseguire l'accesso per poter accedere ai dati. Cliccando su 'OK' verrai reindirizzato alla pagina di accesso!"
					);
					window.location.replace('./login.html');
				});
		});
		return false;
	});
});

function aggiorna() {
	table.destroy();
	$.ajax({
		url: 'http://192.168.1.252:8080/api/areas',
		headers: { Token: sessionStorage.getItem('access-token') },
		dataType: 'json',
		success: function(data) {
			if (data.error) return alert('Nessuna area registrata!');

			var items = [];
			$.each(data, function() {
				items.push([
					this.nome,
					this.temperaturaImpostata,
					this.temperaturaAttuale,
					"<input type='checkbox' name='areaName[]' id='" +
						this.nome +
						"' value='" +
						this.nome +
						"'>",
				]);
			});

			table = $('#areasTable').DataTable({
				searching: false,
				paging: false,
				lengthChange: false,
				data: items,
				columns: [
					{ title: 'Nome' },
					{ title: 'Temperatura impostata' },
					{ title: 'Temperatura attuale' },
					{ title: 'Cancella', orderable: false },
				],
			});
		},
	});
}

function logout() {
	sessionStorage.removeItem('access-token');
	window.location.replace('./login.html');
}

$('#closeTable').click(function() {
	document.getElementById('divTable').style.display = 'none';
});
