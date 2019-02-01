$(document).ready(function() {
	table1 = $('#sensorTable').DataTable({
		searching: false,
		order: [[0, 'desc']],
		columns: [
			{ title: 'Data e ora' },
			{ title: 'Temperatura' },
			{ title: 'Umidità' },
		],
	});

	$.ajax({
		url: 'http://192.168.1.252:8080/api/sensors',
		headers: { Token: sessionStorage.getItem('access-token') },
		dataType: 'json',
		success: function(data) {
			if (data.error) return alert('Nessun sensore registrato!');
			let items = [];
			$.each(data, function() {
				items.push([
					this.id,
					this.area,
					"<button type='button' class='btn btn-primary' id = '" +
						this.id +
						"'  onclick='showTable(" +
						this.id +
						")'>Mostra</button>",
					"<input type='checkbox' name='sensorId[]' id='" +
						this.id +
						"' value='" +
						this.id +
						"'>",
				]);
			});

			table = $('#sensorsTable').DataTable({
				searching: false,
				paging: false,
				lengthChange: false,
				data: items,
				columns: [
					{ title: 'Id' },
					{ title: 'Area' },
					{ title: 'Dettagli', orderable: false },
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
		let ids = [];
		$('input:checkbox:checked').each(function() {
			ids.push($(this).val());
		});
		ids.forEach(function(v, i) {
			$.ajax({
				url: 'http://192.168.1.252:8080/api/sensors/' + v,
				headers: { Token: sessionStorage.getItem('access-token') },
				type: 'DELETE',
				dataType: 'json',
			})
				.done(function(data) {
					if (data.error) return alert(data.error);

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
	table.clear();
	$.ajax({
		url: 'http://192.168.1.252:8080/api/sensors',
		headers: { Token: sessionStorage.getItem('access-token') },
		dataType: 'json',
		success: function(data) {
			if (data.error) return alert('Nessun sensore registrato!');

			let items = [];
			$.each(data, function() {
				items.push([
					this.id,
					this.area,
					"<button type='button' class='btn btn-primary' id = '" +
						this.id +
						"'  onclick='showTable(" +
						this.id +
						")'>Mostra</button>",
					"<input type='checkbox' value='" + this.id + "'>",
				]);
			});

			table.rows.add(items);
			table.draw();
		},
	});
}

function showTable(id) {
	table1.clear();
	document.getElementById('divTable').style.display = 'block';
	document.getElementById('sensor').innerHTML = ' Storico sensore ' + id;

	$.ajax({
		url: 'http://192.168.1.252:8080/api/temperature/' + id,
		headers: { Token: sessionStorage.getItem('access-token') },
		dataType: 'json',
		success: function(data) {
			if (data.error)
				return alert(
					'Nessun valore registrato per il sensore ' + id + '!'
				);
			let objs = [];
			$.each(data, function() {
				objs.push([
					new Date(
						parseInt(this._id.substring(0, 8), 16) * 1000
					).toLocaleString(),
					this.temperatura,
					this.umidità,
				]);
			});

			table1.rows.add(objs);
			table1.draw();

			let temps = [];
			let date = [];
			$.each(data, function() {
				temps.push(this.temperatura);
				date.push(
					new Date(
						parseInt(this._id.substring(0, 8), 16) * 1000
					).toLocaleTimeString()
				);
			});

			let ctx = document.getElementById('grafico');
			let chart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: date.slice(0, 0 + 15).reverse(),
					datasets: [
						{
							label: 'Temperatura',
							lineTension: 0.3,
							backgroundColor: 'rgba(2,117,216,0.2)',
							borderColor: 'rgba(2,117,216,1)',
							pointRadius: 5,
							pointBackgroundColor: 'rgba(2,117,216,1)',
							pointBorderColor: 'rgba(255,255,255,0.8)',
							pointHoverRadius: 5,
							pointHoverBackgroundColor: 'rgba(2,117,216,1)',
							pointHitRadius: 20,
							pointBorderWidth: 2,
							data: temps.slice(0, 0 + 15).reverse(),
						},
					],
				},
				options: {
					scales: {
						xAxes: [
							{
								time: {
									unit: 'date',
								},
								gridLines: {
									display: false,
								},
								ticks: {
									maxTicksLimit: 7,
								},
							},
						],
						yAxes: [
							{
								ticks: {
									min: 10,
									max: 40,
									maxTicksLimit: 5,
								},
								gridLines: {
									color: 'rgba(0, 0, 0, .125)',
								},
							},
						],
					},
					legend: {
						display: false,
					},
				},
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
