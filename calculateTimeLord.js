var $natalPlanets;
var $transitPlanets;
var $transitInputDate;
var $natalInputDate;
var cusp = Array();
var calculateHouses;
var latitude;
var longitude;
var $illuminatedFraction;
var nextPhase;
var startDate;
var startDateEpoch;
var oneDay;

var $signColor = [
  "", // ZERO POINT
	"#cc0052", 
	"#08b6b6",
	"#ff9900",
	"#cc0052", 
	"#08b6b6",
	"#ff9900",
	"#cc0052", 
	"#08b6b6",
	"#ff9900",
	"#cc0052", 
	"#08b6b6",
	"#ff9900"
];

var signNames = [
  "", // ZERO POINT
	"Aries", 
	"Taurus",
	"Gemini",
	"Cancer", 
	"Leo",
	"Virgo",
	"Libra", 
	"Scorpio",
	"Sagittarius",
	"Capricorn", 
	"Aquarius",
	"Pisces"
];


// Calculate the transiting and natal planets, and set cookie when new input is submitted
$ns.calculateTimeLord = function (setCookieFlag, initialRenderingFlag) {
	var $transitPlanetLongitude = Array();
	var $natalPlanetLongitude = Array();
	
	$transitInputDate = $e.inputTime("transit");
	$natalInputDate = $e.inputTime("natal");
	
	// HIDE Form elements
	var houseSystem = document.getElementById("housesystem");
  var unknowntimeCheckBox = document.getElementById("unknowntime");
  var city = document.getElementById("city");
  var latitude = document.getElementById("latitude");
  var longitude = document.getElementById("longitude");
  var transitmonthfield = document.getElementById("transitmonthfield")
  var transitdayfield = document.getElementById("transitdayfield")
  var transityearfield = document.getElementById("transityearfield");
  var transithourfield = document.getElementById("transithourfield");
  var transitminutefield = document.getElementById("transitminutefield");
  var transitsecondfield = document.getElementById("transitsecondfield");
  
	houseSystem.style.visibility = "hidden";
	unknowntimeCheckBox.style.visibility = "hidden";
	city.style.visibility = "hidden";
	latitude.style.visibility = "hidden";
	longitude.style.visibility = "hidden";
	transitmonthfield.style.visibility = "hidden";
	transitdayfield.style.visibility = "hidden";
	transityearfield.style.visibility = "hidden";
	transithourfield.style.visibility = "hidden";
	transitminutefield.style.visibility = "hidden";
	transitsecondfield.style.visibility = "hidden";

  // Populate the Sign dropdown
  var releasingFromSign = document.getElementById("releasingfrom");
  for(var i=1; i<13; i++) {
      var signOption = document.createElement("option");
      signOption.textContent = signNames[i];
      signOption.value = i;
      releasingFromSign.appendChild(signOption);
  }
	
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
	  createCookie('releasingfrom',releasingFromSign.value,30);
	  if (calculateHouses) {
			createCookie('housesystem',houseSystem,30);
			createCookie('citystate',citystate,30);
			createCookie('latitude',latitude,30);
			createCookie('longitude',longitude,30);
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
/*
	  ctx = document.getElementById('natalchartcanvas').getContext('2d');
	  ctx.clearRect(0,0, natalchartcanvas.width, natalchartcanvas.height);
	  $e.drawNatalChart(ctx);
	  biwheel = false;
	  $e.drawNatalPlanets(ctx, biwheel);
	  $e.drawNatalAspects(middleCircleRadius);
*/
  
    
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
  	//$e.drawEphemeris ();
  }

  $e.drawZodicalReleasing();


  // Show Zodical releasing
  $e.zodicalReleasing($natalInputDate);
	
};

$ns.drawZodicalReleasing = function () {
	var ctx = document.getElementById('zodicalreleasing').getContext('2d');
	// Clear out the chartcanvas for multiple executions
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, zodicalreleasing.width, zodicalreleasing.height);
	ctx.globalAlpha = 1;

	var showCurrentDay = false;
	if (showCurrentDay) {	
		var monthfield = document.getElementById("transitmonthfield");
	  var yearfield = document.getElementById("transityearfield");
		// This sets the date according to the local timezone, which should be sufficient for getting ephemeris data
	  startDate = new Date(parseInt(monthfield.value)+"/"+1+"/"+parseInt(yearfield.value)+" "+0+":"+0+":"+0);
		// Calculate the number of days from the start date to the current date in the date field
	  startDateEpoch = startDate.getTime();
	  oneDay=1000*60*60*24;
		
		// Draw the current day line
		currentDayMarker = Math.round(($transitInputDate.epoch*1000 - startDateEpoch)/oneDay); 
		ctx.globalAlpha = 0.2;
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.fillRect(currentDayMarker*1.75-1.75,-30,3.5,770);
		ctx.restore();
	}
	// Color in L1
	var currentPeriod;
	var previousPeriod;
	var cumulativeTime;
	var pixelsPerYear;
	var L2currentPeriod;
	cumulativeTime = 0;
	
	if (getCookieValue("releasingfrom")) {
		L1currentPeriod = getCookieValue("releasingfrom");
	} else {
		L1currentPeriod = 1;
	}
	
	L1pixelsPerYear = 25;
	L2pixelsPerYear = 3;
	
	while (cumulativeTime < 2310) {
	  ctx.save();
		ctx.beginPath();
	  ctx.fillStyle = $signColor[L1currentPeriod];
	  ctx.fillRect(10,cumulativeTime, 220, cumulativeTime + $planetaryPeriodYears[L1currentPeriod]*L1pixelsPerYear);
		ctx.restore();
	
		L2cumulativeTime = cumulativeTime;
	  cumulativeTime = cumulativeTime + $planetaryPeriodYears[L1currentPeriod]*L1pixelsPerYear;
	  
	  L2currentPeriod = L1currentPeriod;
	  
		while (L2cumulativeTime < cumulativeTime) {
		  ctx.save();
			ctx.beginPath();
		  ctx.fillStyle = $signColor[L2currentPeriod];
		  ctx.fillRect(235,L2cumulativeTime, 450, L2cumulativeTime + ($planetaryPeriodYears[L2currentPeriod]/12)*L1pixelsPerYear);
			ctx.restore();
		
		  L2cumulativeTime = L2cumulativeTime + ($planetaryPeriodYears[L2currentPeriod]/12)*L1pixelsPerYear;
		  
		  L2currentPeriod++;
		  if (L2currentPeriod > 12) {L2currentPeriod = 1;}
	  }

	  L1currentPeriod++;
	  if (L1currentPeriod > 12) {L1currentPeriod = 1;}
  }
	

}
