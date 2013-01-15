$ns.calculatedTime = function () {
    var monthfield = document.getElementById("monthfield")
    var dayfield = document.getElementById("dayfield")
    var yearfield = document.getElementById("yearfield");
    var hourfield = document.getElementById("hourfield");
    var minutefield = document.getElementById("minutefield");
    var secondfield = document.getElementById("secondfield");
	var $Longitude360String = "";
	var signNumber;
	var $planetLongitude = Array();
    
	var $planetGlyphs = {
		sun: String.fromCharCode (0x2609),
		moon: String.fromCharCode (0x263D),
		mercury: String.fromCharCode (0x263F),
		venus: String.fromCharCode (0x2640),
		mars: String.fromCharCode (0x2642),
		jupiter: String.fromCharCode (0x2643),
		saturn: String.fromCharCode (0x2644),
		chiron: "K",
		uranus: String.fromCharCode (0x2645),
		neptune: String.fromCharCode (0x2646),
		pluto: String.fromCharCode (0x2647)
	}
	var signs = ["Zero Offset","Aries","Taurus","Gemini","Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
	var $signGlyphs = ["Zero Offset", String.fromCharCode (0x2648), String.fromCharCode (0x2649), String.fromCharCode (0x264A), String.fromCharCode (0x264B), String.fromCharCode (0x264C), String.fromCharCode (0x264D), String.fromCharCode (0x264E), String.fromCharCode (0x264F), String.fromCharCode (0x2650), String.fromCharCode (0x2651), String.fromCharCode (0x2652), String.fromCharCode (0x2653)];
	
	
	console.log($signGlyphs);
        
	var $inputdate = {
		day: parseInt(dayfield.value),
		month: parseInt(monthfield.value),
		year: parseInt(yearfield.value),
		hours: parseInt(hourfield.value),
		minutes: parseInt(minutefield.value),
		seconds: parseInt(secondfield.value)
	};
	$const.date = $inputdate;
    
    
	$processor.init ();
    
    //  Loop through each of the planets in the moshier array and calculate the Longitude
    for (var key in $moshier.body) {
      if (key != 'init' &&  key != 'earth' &&  key != 'sirius'){
        if ($moshier.body.hasOwnProperty(key)) {
          $const.body = $moshier.body[key];
          $processor.calc ($inputdate, $const.body);
          signNumber = Math.ceil($const.body.position.apparentLongitude/30)
          $astrologicalSign = signs[signNumber];
          document.getElementById(key).innerHTML = key + " (" + $planetGlyphs[key] + ") (" + $signGlyphs[signNumber] + ") " + $const.body.position.apparentLongitude30String + " - " + $astrologicalSign;
          $Longitude360String = $Longitude360String + "<br/>" + key + " = " + $const.body.position.apparentLongitude;
          $planetLongitude[key] = parseFloat($const.body.position.apparentLongitude);
        }
      }
    }
    
    $e.natalchart($planetLongitude);
    
    document.getElementById("Longitude360").innerHTML = $Longitude360String;

};
