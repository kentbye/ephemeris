var $natalPlanets;
var $transitPlanets;
var $transitInputDate;
var $natalInputDate;


// Calculate the transiting and natal planets, and set cookie when new input is submitted
$ns.calculatedTime = function (setCookieFlag, initialRenderingFlag) {
	var $transitPlanetLongitude = Array();
	var $natalPlanetLongitude = Array();
	
	$transitInputDate = $e.inputTime("transit");
	$natalInputDate = $e.inputTime("natal");
	
	// Store the calculated Natal position as a cookie if the calculated button is clicked
	if (setCookieFlag){
	  createCookie('natalday',$natalInputDate.day,30);
	  createCookie('natalmonth',$natalInputDate.month,30);
	  createCookie('natalyear',$natalInputDate.year,30);
	  createCookie('natalhours',$natalInputDate.hours,30);
	  createCookie('natalminutes',$natalInputDate.minutes,30);
	  createCookie('natalseconds',$natalInputDate.seconds,30);
	}
	
	// The epoch conversion took a UTC input and assumes a PDT output. Correcting it here for display
	var correctedEpoch = $transitInputDate.epoch - ($transitInputDate.timezoneoffset)*60;
  var chartDate = new Date(1000*(correctedEpoch));

	$const.date = $natalInputDate;
	$processor.init ();
  $natalPlanets = $e.calculateLongitude($natalInputDate);

  $const.date = $transitInputDate;
	$transitPlanets = $e.calculateLongitude($transitInputDate);

  // Only need to draw the natal chart and natal planets once. Animation can skip these steps
  if (initialRenderingFlag) {
    // Draw the transits to natal planet Bi-Wheel chart along with natal planets
    var ctx = document.getElementById('chartcanvas').getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  	ctx.clearRect(0,0, chartcanvas.width, chartcanvas.height);
    
    var natalJulianDate =	$moshier.julian.calc($natalInputDate);
    
    // Calculate the House Cusps
 		/*   
     * hsys = letter code for house system;
     *		K  Koch
     *		O  Porphyry
     *		P  Placidus
     *		W  equal, whole sign
     */

    hsys = 'P';
    $e.swe_houses(natalJulianDate, 39.768333333, -86.158055556, hsys);
    console.log(hsp);
	  $e.drawNatalChart(ctx);
	  
	  ctx = document.getElementById('natalcanvas').getContext('2d');
	  ctx.clearRect(0,0, natalcanvas.width, natalcanvas.height);

	  var biwheel = true;
	  $e.drawNatalPlanets(ctx, biwheel);
	  
	  // Draw the natal planet chart
	  ctx = document.getElementById('natalchartcanvas').getContext('2d');
	  ctx.clearRect(0,0, natalchartcanvas.width, natalchartcanvas.height);
	  $e.drawNatalChart(ctx);
	  biwheel = false;
	  $e.drawNatalPlanets(ctx, biwheel);
	  $e.drawNatalAspects(middleCircleRadius);
  }

  // Draw the Transit Planets and Transit Lines
	$e.drawTransitPlanets(innerCircleRadius);
	$e.drawTransitLines(innerCircleRadius);

  // Draw the current time on the ephemeris only when calculating a new time
  if (initialRenderingFlag) {
  	$e.drawEphemeris ();
  }
	
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
    var myDate = new Date(month+"/"+day+"/"+year+" "+hours+":"+minutes+":"+seconds);
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
		timezoneoffset: timezoneoffset,
		date: myDate
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
	$transitInputDate = $e.inputTime("transit");

	epoch = $transitInputDate.epoch + timeDelta;
		
	var incrementedDate = new Date(1000*epoch);
	
	monthfield.value = incrementedDate.getMonth() + 1;
	dayfield.value = incrementedDate.getDate();
	yearfield.value = incrementedDate.getFullYear();
	hourfield.value = incrementedDate.getHours();
	minutefield.value = incrementedDate.getMinutes();
	secondfield.value = incrementedDate.getSeconds();

  var setCookieFlag = false; // Don't need to set the cookie on initial page load
  var initialRenderingFlag = false; // Don't need to re-plot the natal chart and natal planets
  $e.calculatedTime(setCookieFlag, initialRenderingFlag);
  $e.drawCurrentDay();
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

function createCookie(name,value,days) {
	if (days) {
	  var date = new Date();
	  date.setTime(date.getTime()+(days*24*60*60*1000));
	  var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/;";
}



