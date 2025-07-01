$ns.load = function () {
	var textAreas = document.body.getElementsByTagName ('textarea');
	var selects = document.body.getElementsByTagName ('select');
	var classes, ids, value;
	var i, j, key;

	var date = {
		year: 1986,
		month: 1,
		day: 1,
		hours: 16,
		minutes: 47,
		seconds: 0
	};

	//$processor.test ();

	// fill input
	if (textAreas) {
		for (i = 0; i < textAreas.length; i ++) {
			ids = textAreas [i].getAttribute ('id');
			try {
				eval ('' + ids + ' = "' + textAreas [i].value + '"');
			} catch (exception) {
			}
		}
	}

	if ($const.date) {
		var tokens = $const.date.split (' ');

		tokens [0] = tokens [0].split ('.');
		tokens [1] = tokens [1].split (':');

		date = {
			day: parseFloat (tokens [0][0]),
			month: parseFloat (tokens [0][1]),
			year: parseFloat (tokens [0][2]),
			hours: parseFloat (tokens [1][0]),
			minutes: parseFloat (tokens [1][1]),
			seconds: parseFloat (tokens [1][2])
		};
		$const.date = date;
	}

	// fill input bodies
	if (selects) {
		for (i = 0; i < selects.length; i ++) {
			classes = selects [i].getAttribute ('class');
			ids = selects [i].getAttribute ('id');
			if (classes) {
				try {
					var selector = eval ('(' + classes + ')');
					if (selects [i].innerHTML) {
						eval (ids + ' = ' + classes + '.' + selects [i].value);
					} else {
						var selections = [];
						for (key in selector) {
							if (selector.hasOwnProperty (key) && selector [key].key == key && key != 'earth') {
								selections.push ('<option label=' + key + '>' + key + '</option>');
							}
						}
						selects [i].innerHTML = selections;
					}
				} catch (exception) {
				}
			}
		}
	}

	$processor.init ();

	$processor.calc (date, $const.body);

	var info = document.getElementById ('info');

	if (info) {
		info.innerHTML =
			'julian = ' + date.julian + ', ' +
			'delta = ' + date.delta + '<br/>' +
			'terrstrial = ' + date.terrestrial + '<br/>' +
			'universal = ' + date.universal + ' - ' + (
				date.universalDate.day + '.' +
				date.universalDate.month + '.' +
				date.universalDate.year + ' ' +
				date.universalDate.hours + ':' +
				date.universalDate.minutes + ':' +
				date.universalDate.seconds + '.' +
				date.universalDate.milliseconds
			) + '' +
			''
		;
	}

	var ephemeris = document.getElementById ('ephemeris');

	if (ephemeris) {
		ephemeris.innerHTML =
			'<td>earth</td>' +
			''
		;
	}

	// fill output
	if (textAreas) {
		for (i = 0; i < textAreas.length; i ++) {
			classes = (textAreas [i].getAttribute ('class') || '').split (' ');
			for (j = 0; j < classes.length; j ++) {
				try {
					value = eval ('(' + classes [j] + ')');
					if (value || value === 0) {
						textAreas [i].value = value.join ? value.join ('\n') : value;
						break;
					}
				} catch (exception) {
				}
			}
		}
	}
};
