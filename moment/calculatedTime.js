var $natalPlanets;
var $transitPlanets;
var $transitInputDate;
var $natalInputDate;
var cusp = Array();
var houseSystem;
var calculateHouses;
var latitude;
var longitude;
var $illuminatedFraction;
var nextPhase;

// Calculate the transiting and natal planets, and set cookie when new input is submitted
$ns.calculatedTime = function (setCookieFlag, initialRenderingFlag) {
	var $transitPlanetLongitude = Array();
	var $natalPlanetLongitude = Array();
	
	$transitInputDate = $e.inputTime("transit");
	$natalInputDate = $e.inputTime("natal");

	// If there is an unknown time checkbox marked, then don't calculate houses and set global flag
	if (document.getElementById("unknowntime").checked) {
		calculateHouses = false;
	} else {
		calculateHouses = true;
	}
  
	if (calculateHouses) {
		houseSystem = document.getElementById("housesystem").value;
		citystate = document.getElementById("city").value;
		latitude = parseFloat(document.getElementById("latitude").value);
		longitude = parseFloat(document.getElementById("longitude").value);
	}
	
	// If there wasn't a valid Lat/Long entered, then don't try to calculate the houses
	if (!latitude || !longitude) {
		calculateHouses = false;
	}
	
	// Store the calculated Natal position as a cookie if the calculated button is clicked
	if (setCookieFlag){
	  createCookie('natalday',$natalInputDate.day,30);
	  createCookie('natalmonth',$natalInputDate.month,30);
	  createCookie('natalyear',$natalInputDate.year,30);
	  createCookie('natalhours',$natalInputDate.hours,30);
	  createCookie('natalminutes',$natalInputDate.minutes,30);
	  createCookie('natalseconds',$natalInputDate.seconds,30);
	  if (calculateHouses) {
			createCookie('housesystem',houseSystem,30);
			createCookie('citystate',citystate,30);
			//createCookie('latitude',latitude,30);
			//createCookie('longitude',longitude,30);
		}
		createCookie('unknowntime',document.getElementById("unknowntime").checked,30);
		
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
  	// Calculate the House Cusps if we have the location and time
    if (calculateHouses) {
	    // Convert the natal chart date to Julian time
	    var natalJulianDate =	$moshier.julian.calc($natalInputDate);

	 		/*   
	     * houseSystem = letter code for house system;
	     *		K  Koch
	     *		O  Porphyry
	     *		P  Placidus
	     *		W  equal, whole sign
	     */
	    
	    // Calculate the house cusps -- returns the hsp global variable
	    $e.swe_houses(natalJulianDate, latitude, longitude, houseSystem);

	    // For plotting house cusp lines, normalize the degrees so that Ascendant is at 0 degrees
	    cusp[0] = 0;
	    cusp[1] = 0;
	    for (i = 2; i <= 12; i++) { 
	    	cusp[i] = swe_degnorm(hsp.cusp[i]-hsp.cusp[1]);
	    }
    } 
    // Otherwise plot 0-Aries Houses if we don't know the time or location
    else {
    	cusp[0] = 0;
    	hsp.cusp[0] = 0;
	    for (i = 1; i <= 12; i++) {
	    	hsp.cusp[i] = (i-1)*30;
	    	cusp[i] = (i-1)*30;
	    }
    }

	  // Draw the natal planet chart
	  ctx = document.getElementById('natalchartcanvas').getContext('2d');
	  ctx.clearRect(0,0, natalchartcanvas.width, natalchartcanvas.height);
	  $e.drawNatalChart(ctx);
	  biwheel = false;
	  $e.drawNatalPlanets(ctx, biwheel);
	  $e.drawNatalAspects(middleCircleRadius);
  
    
    // Draw the transits to natal planet Bi-Wheel chart along with natal planets
    var ctx = document.getElementById('chartcanvas').getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  	ctx.clearRect(0,0, chartcanvas.width, chartcanvas.height);
    
    
	  $e.drawNatalChart(ctx);
	  
	  ctx = document.getElementById('natalcanvas').getContext('2d');
	  ctx.clearRect(0,0, natalcanvas.width, natalcanvas.height);

	  var biwheel = true;
	  $e.drawNatalPlanets(ctx, biwheel);
	  
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
          if (key=='moon') {
	          $illuminatedFraction = $const.body.position.illuminatedFraction;
	          if ($const.body.position.phaseDaysBefore) {
		          nextPhase = Math.round($const.body.position.phaseDaysBefore*24*100)/100 + " hrs until ";
	          } else {
			        nextPhase = Math.round($const.body.position.phaseDaysPast*24*100)/100 + " hrs after ";  
	          }
          }

          //Output the position to the screen.
          //document.getElementById(key).innerHTML = key + " = " + $astrologicalSign + " " + $const.body.position.apparentLongitude30String;
        }
      }
    }
    return $planetLongitude;
};

$ns.inputTime = function (planet) {
    if (planet == "transit") {
	    var monthfield = document.getElementById("transitmonthfield");
	    var dayfield = document.getElementById("transitdayfield");
	    var yearfield = document.getElementById("transityearfield");
	    var hourfield = document.getElementById("transithourfield");
	    var minutefield = document.getElementById("transitminutefield");
	    var secondfield = document.getElementById("transitsecondfield");
      }
    else {
	    var monthfield = document.getElementById("natalmonthfield");
	    var dayfield = document.getElementById("nataldayfield");
	    var yearfield = document.getElementById("natalyearfield");
	    var hourfield = document.getElementById("natalhourfield");
	    var minutefield = document.getElementById("natalminutefield");
	    var secondfield = document.getElementById("natalsecondfield");
    }

  var day = parseInt(dayfield.value); 
  var month = parseInt(monthfield.value);
  var year = parseInt(yearfield.value);
  var hours = parseInt(hourfield.value);
  var minutes = parseInt(minutefield.value);
  var seconds = parseInt(secondfield.value);
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
	// TEMP: Have the increment 1 hour at a time
	//timerId = setInterval("$e.increment("+3600+")", 50);
	// TODO: Make this increment dynamic
	// increment an hour at a time
	//timerId = setInterval("$e.increment("+3600+")", 50); 
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

var spacebarAnimate = true;

$ns.disableSpacebarAnimate = function (flag) {
	spacebarAnimate = flag;
}