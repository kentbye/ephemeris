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
var L1pixelsPerYear = 25;

var $signColor = [
  "", // ZERO POINT
	"#cc0052", 
	"#ff9900",
	"#08b6b6",
	"#cc0052", 
	"#ff9900",
	"#08b6b6",
	"#cc0052", 
	"#ff9900",
	"#08b6b6",
	"#cc0052", 
	"#ff9900",
	"#08b6b6"

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

var timelordImageArray = new Array();
timelordImageArray[0] = "";
timelordImageArray[1] = new Image();
timelordImageArray[1].src =	"timelord_assets/aries.png";
timelordImageArray[2] = new Image();
timelordImageArray[2].src =	"timelord_assets/taurus.png";
timelordImageArray[3] = new Image();
timelordImageArray[3].src =	"timelord_assets/gemini.png";
timelordImageArray[4] = new Image();
timelordImageArray[4].src =	"timelord_assets/cancer.png";
timelordImageArray[5] = new Image();
timelordImageArray[5].src =	"timelord_assets/leo.png";
timelordImageArray[6] = new Image();
timelordImageArray[6].src =	"timelord_assets/virgo.png";
timelordImageArray[7] = new Image();
timelordImageArray[7].src =	"timelord_assets/libra.png";
timelordImageArray[8] = new Image();
timelordImageArray[8].src =	"timelord_assets/scorpio.png";
timelordImageArray[9] = new Image();
timelordImageArray[9].src =	"timelord_assets/sagittarius.png";  
timelordImageArray[10] = new Image();
timelordImageArray[10].src =	"timelord_assets/capricorn.png";
timelordImageArray[11] = new Image();
timelordImageArray[11].src =	"timelord_assets/aquarius.png";
timelordImageArray[12] = new Image();
timelordImageArray[12].src =	"timelord_assets/pisces.png";

// Calculate the transiting and natal planets, and set cookie when new input is submitted
$ns.calculateTimeLord = function (setCookieFlag, initialRenderingFlag) {
	var $transitPlanetLongitude = Array();
	var $natalPlanetLongitude = Array();
  var releasingFromSign = document.getElementById("releasingfrom");
	
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
  

  // Draw degree tick marks every 5 years
  var ctx = document.getElementById('zodicalreleasing').getContext('2d');
	ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.lineWidth = 0.5;
  for (var i = 0; i < 21; i++) {
    ctx.beginPath();
    ctx.moveTo(12, L1pixelsPerYear*5*i);
    ctx.lineTo(20, L1pixelsPerYear*5*i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(460, L1pixelsPerYear*5*i);
    ctx.lineTo(460-10, L1pixelsPerYear*5*i);
    ctx.stroke();
    ctx.fillText(i*5, 0, L1pixelsPerYear*5*i+4);
  }
  ctx.restore();

  // Draw degree tick marks every 1 year
  ctx.save();
  ctx.lineWidth = 0.25;
  for (var i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.moveTo(15, L1pixelsPerYear*i);
    ctx.lineTo(20, L1pixelsPerYear*i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(455, L1pixelsPerYear*i);
    ctx.lineTo(455-5, L1pixelsPerYear*i);
    ctx.stroke();

  }
  ctx.restore();
	
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

	var L2currentPeriod;
	cumulativeTime = 0;
	
	if (getCookieValue("releasingfrom")) {
		L1currentPeriod = getCookieValue("releasingfrom");
	} else {
		L1currentPeriod = 1;
	}
	
	L2pixelsPerYear = 3;
	
	
	while (cumulativeTime < 2505) {
	  ctx.save();
		ctx.beginPath();
	  ctx.fillStyle = $signColor[L1currentPeriod];
	  ctx.fillRect(20,cumulativeTime, 161, cumulativeTime + $planetaryPeriodYears[L1currentPeriod]*L1pixelsPerYear);
    
	  ctx.drawImage(timelordImageArray[L1currentPeriod], 25, cumulativeTime+2);
	  
		ctx.restore();
	
		L2cumulativeTime = cumulativeTime;
	  cumulativeTime = cumulativeTime + $planetaryPeriodYears[L1currentPeriod]*L1pixelsPerYear;
	  
	  L2currentPeriod = L1currentPeriod;
	  
		while (L2cumulativeTime < cumulativeTime) {
		  ctx.save();
			ctx.beginPath();
		  ctx.fillStyle = $signColor[L2currentPeriod];
		  ctx.fillRect(186,L2cumulativeTime, 264, L2cumulativeTime + ($planetaryPeriodYears[L2currentPeriod]/12)*L1pixelsPerYear);
			ctx.restore();
		
		  L2cumulativeTime = L2cumulativeTime + ($planetaryPeriodYears[L2currentPeriod]/12)*L1pixelsPerYear;
		  
		  L2currentPeriod++;
		  if (L2currentPeriod > 12) {L2currentPeriod = 1;}
	  }

	  L1currentPeriod++;
	  if (L1currentPeriod > 12) {L1currentPeriod = 1;}
  }
	

}
