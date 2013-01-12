$ns.calculatedTime = function () {
	var textAreas = document.body.getElementsByTagName ('textarea');
	var ids;
	var signs = ["Zero Offset","Aries","Taurus","Gemini","Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
	var $Longitude360String = "";
    
    // Get the entered date from the form
	if (textAreas) {
		for (i = 0; i < textAreas.length; i ++) {
			ids = textAreas [i].getAttribute ('id');
			try {
				eval ('' + ids + ' = "' + textAreas [i].value + '"');
			} catch (exception) {
			}
		}
	}

    // Parse the submitted date into the date object
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
    
	$processor.init ();
    
    //  Loop through each of the planets in the moshier array and calculate the Longitude
    for (var key in $moshier.body) {
      if (key != 'init' &&  key != 'earth' &&  key != 'sirius'){
        if ($moshier.body.hasOwnProperty(key)) {
          $const.body = $moshier.body[key];
          $processor.calc (date, $const.body);
          $astrologicalSign = signs[Math.ceil($const.body.position.apparentLongitude/30)];
          document.getElementById(key).innerHTML = key + " = " + $astrologicalSign + " " + $const.body.position.apparentLongitude30String;
          $Longitude360String = $Longitude360String + "<br/>" + key + " = " + $const.body.position.apparentLongitude;
        }
      }
    }
    
    document.getElementById("Longitude360").innerHTML = $Longitude360String;

};
