$ns.calculatedTime = function () {
    var monthfield = document.getElementById("monthfield")
    var dayfield = document.getElementById("dayfield")
    var yearfield = document.getElementById("yearfield");
    var hourfield = document.getElementById("hourfield");
    var minutefield = document.getElementById("minutefield");
    var secondfield = document.getElementById("secondfield");
	var signs = ["Zero Offset","Aries","Taurus","Gemini","Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
	var $Longitude360String = "";
	var $planetLongitude = Array();
        
	inputdate = {
		day: parseInt(dayfield.value),
		month: parseInt(monthfield.value),
		year: parseInt(yearfield.value),
		hours: parseInt(hourfield.value),
		minutes: parseInt(minutefield.value),
		seconds: parseInt(secondfield.value)
	};
	$const.date = inputdate;
    
	$processor.init ();
    
    //  Loop through each of the planets in the moshier array and calculate the Longitude
    for (var key in $moshier.body) {
      if (key != 'init' &&  key != 'earth' &&  key != 'sirius'){
        if ($moshier.body.hasOwnProperty(key)) {
          $const.body = $moshier.body[key];
          $processor.calc (inputdate, $const.body);
          $astrologicalSign = signs[Math.ceil($const.body.position.apparentLongitude/30)];
          document.getElementById(key).innerHTML = key + " = " + $astrologicalSign + " " + $const.body.position.apparentLongitude30String;
          $Longitude360String = $Longitude360String + "<br/>" + key + " = " + $const.body.position.apparentLongitude;
          $planetLongitude[key] = parseFloat($const.body.position.apparentLongitude);
        }
      }
    }
    
    $e.natalchart($planetLongitude);
    
    document.getElementById("Longitude360").innerHTML = $Longitude360String;

};
