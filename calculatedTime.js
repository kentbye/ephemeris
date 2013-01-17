$ns.calculatedTime = function () {
	var $planetLongitude = Array();
	var $inputdate = $e.inputTime();
	$const.date = $inputdate;
    
	$processor.init ();
    $planetLongitude = $e.calculateLongitude($inputdate);
    $e.natalchart($planetLongitude);
};

// Get the current Plantary Longitude values and display the values to the screen.
$ns.calculateLongitude = function ($inputdate) {
	var signs = ["Zero Offset","Aries","Taurus","Gemini","Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
	var $Longitude360String = "";
	var $planetLongitude = Array();

    //  Loop through each of the planets in the moshier array and calculate the Longitude
    for (var key in $moshier.body) {
      if (key != 'init' &&  key != 'earth' &&  key != 'sirius'){
        if ($moshier.body.hasOwnProperty(key)) {
          $const.body = $moshier.body[key];
          $processor.calc ($inputdate, $const.body);
          $astrologicalSign = signs[Math.ceil($const.body.position.apparentLongitude/30)];
          document.getElementById(key).innerHTML = key + " = " + $astrologicalSign + " " + $const.body.position.apparentLongitude30String;
          $Longitude360String = $Longitude360String + "<br/>" + key + " = " + $const.body.position.apparentLongitude;
          $planetLongitude[key] = parseFloat($const.body.position.apparentLongitude);
        }
      }
    }
    document.getElementById("Longitude360").innerHTML = $Longitude360String;
    return $planetLongitude;
};

$ns.inputTime = function () {
    var monthfield = document.getElementById("monthfield")
    var dayfield = document.getElementById("dayfield")
    var yearfield = document.getElementById("yearfield");
    var hourfield = document.getElementById("hourfield");
    var minutefield = document.getElementById("minutefield");
    var secondfield = document.getElementById("secondfield");
    var day = parseInt(dayfield.value) 
    var month = parseInt(monthfield.value) 
    var year = parseInt(yearfield.value)
    var hours = parseInt(hourfield.value)
    var minutes = parseInt(minutefield.value)
    var seconds = parseInt(secondfield.value)
	var myDate = new Date(month+" "+day+", "+year+" "+hours+":"+minutes+":"+seconds);
    var myEpoch = myDate.getTime()/1000.0;
	
	var $inputdate = {
		day: day,
		month: month,
		year: year,
		hours: hours,
		minutes: minutes,
		seconds: seconds,
		epoch: myEpoch
	};
  
    return $inputdate;
};

$ns.increment = function (timeDelta) {
	var monthfield = document.getElementById("monthfield")
	var dayfield = document.getElementById("dayfield")
	var yearfield = document.getElementById("yearfield");
	var hourfield = document.getElementById("hourfield");
	var minutefield = document.getElementById("minutefield");
	var secondfield = document.getElementById("secondfield");
	var epoch;
	var $inputtime = $e.inputTime();
	epoch = $inputtime.epoch + timeDelta;
	var incrementedDate = new Date(1000*epoch);
	
	console.log(incrementedDate);
	monthfield.value = incrementedDate.getMonth() + 1;
	dayfield.value = incrementedDate.getDate();
	yearfield.value = incrementedDate.getFullYear();
	hourfield.value = incrementedDate.getHours();
	minutefield.value = incrementedDate.getMinutes();
	secondfield.value = incrementedDate.getSeconds();
	
	$e.calculatedTime();
}