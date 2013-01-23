$ns.calculatedTime = function () {
	var $transitPlanetLongitude = Array();
	var $natalPlanetLongitude = Array();
	var $transitInputDate = $e.inputTime("transit");
	var $natalInputDate = $e.inputTime("natal");

	// The epoch conversion took a UTC input and assumes a PDT output. Correcting it here for display
	var correctedEpoch = $transitInputDate.epoch - ($transitInputDate.timezoneoffset)*60;
    var chartDate = new Date(1000*(correctedEpoch));
    document.getElementById("charttime").innerHTML = chartDate;


    // TODO: Remove the natal planets from being re-rendered during increment() animations
	$const.date = $natalInputDate;
	$processor.init ();
    $natalPlanetLongitude = $e.calculateLongitude($natalInputDate);

    $const.date = $transitInputDate;
    $transitPlanetLongitude = $e.calculateLongitude($transitInputDate);

    $e.natalchart($transitPlanetLongitude, $natalPlanetLongitude);
    
};

// Get the current Plantary Longitude values and display the values to the screen.
$ns.calculateLongitude = function ($inputdate) {
	var signs = ["Zero Offset","Aries","Taurus","Gemini","Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
	var $planetLongitude = Array();

    //  Loop through each of the planets in the moshier array and calculate the Longitude
    for (var key in $moshier.body) {
      if (key != 'init' &&  key != 'earth' &&  key != 'sirius'){
        if ($moshier.body.hasOwnProperty(key)) {
          $const.body = $moshier.body[key];
          $processor.calc ($inputdate, $const.body);
          $planetLongitude[key] = Math.round(parseFloat($const.body.position.apparentLongitude)*10000)/10000;
          $astrologicalSign = signs[Math.ceil($const.body.position.apparentLongitude/30)];
          document.getElementById(key).innerHTML = key + " = " + $astrologicalSign + " " + $const.body.position.apparentLongitude30String;
        }
      }
    }
    return $planetLongitude;
};

$ns.inputTime = function (planet) {
    if (planet == "transit") {
	    var monthfield = document.getElementById("transitmonthfield")
	    var dayfield = document.getElementById("transitdayfield")
	    var yearfield = document.getElementById("transityearfield");
	    var hourfield = document.getElementById("transithourfield");
	    var minutefield = document.getElementById("transitminutefield");
	    var secondfield = document.getElementById("transitsecondfield");
      }
    else {
	    var monthfield = document.getElementById("natalmonthfield")
	    var dayfield = document.getElementById("nataldayfield")
	    var yearfield = document.getElementById("natalyearfield");
	    var hourfield = document.getElementById("natalhourfield");
	    var minutefield = document.getElementById("natalminutefield");
	    var secondfield = document.getElementById("natalsecondfield");
    }

    var day = parseInt(dayfield.value) 
    var month = parseInt(monthfield.value) 
    var year = parseInt(yearfield.value)
    var hours = parseInt(hourfield.value)
    var minutes = parseInt(minutefield.value)
    var seconds = parseInt(secondfield.value)
	var myDate = new Date(month+" "+day+", "+year+" "+hours+":"+minutes+":"+seconds);
    var myEpoch = myDate.getTime()/1000.0;
	var timezoneoffset = myDate.getTimezoneOffset();
	
	var $inputdate = {
		day: day,
		month: month,
		year: year,
		hours: hours,
		minutes: minutes,
		seconds: seconds,
		epoch: myEpoch,
		timezoneoffset: timezoneoffset
	};
  
    return $inputdate;
};

$ns.increment = function (timeDelta) {
	var monthfield = document.getElementById("transitmonthfield")
	var dayfield = document.getElementById("transitdayfield")
	var yearfield = document.getElementById("transityearfield");
	var hourfield = document.getElementById("transithourfield");
	var minutefield = document.getElementById("transitminutefield");
	var secondfield = document.getElementById("transitsecondfield");
	var epoch;
	var $inputtime = $e.inputTime("transit");
	epoch = $inputtime.epoch + timeDelta;
	var incrementedDate = new Date(1000*epoch);
	
	monthfield.value = incrementedDate.getMonth() + 1;
	dayfield.value = incrementedDate.getDate();
	yearfield.value = incrementedDate.getFullYear();
	hourfield.value = incrementedDate.getHours();
	minutefield.value = incrementedDate.getMinutes();
	secondfield.value = incrementedDate.getSeconds();
	
	$e.calculatedTime();
}

var timerId = null;

$ns.animateStart = function ()  {
	if (timerId) return;
	// Default to advancing 1 day at a time
	timerId = setInterval("$e.increment("+86400+")", 50);
}

$ns.animateStop = function ()  {
	clearInterval(timerId);
	timerId = null;
} 


