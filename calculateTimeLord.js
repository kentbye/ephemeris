var $natalPlanets;
var $transitPlanets;
var $transitInputDate;
var $natalInputDate;
var cusp = [];
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

// Set the Planetary Years from Aries/Mars being 15 Egyptian years to Pisces/Jupiter being 12 Egyptian years
var $planetaryPeriodYears = [];
$planetaryPeriodYears = [0, 15, 8, 20, 25, 19, 20, 8, 15, 12, 27, 30, 12];

// Calculate four levels planetary periods in milliseconds
var $planetaryPeriod = [];
var sign;
var level;
for (sign = 1; sign < 13; sign++) {
    $planetaryPeriod[sign] = [];
    // Convert years to milliseconds: 360 days/year, 24 hours/day, 3600 seconds/hour & 1000 milliseconds/second
    $planetaryPeriod[sign][1] = $planetaryPeriodYears[sign] * 360 * 24 * 3600000;
    for (level = 2; level < 5; level++) {
        // The next level is 1/12 the previous level
        $planetaryPeriod[sign][level] = $planetaryPeriod[sign][level - 1] / 12;
    }
}

// Set up the image glyphs for the signs and special moments
var timelordImageArray = [];
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
timelordImageArray[10].src = "timelord_assets/capricorn.png";
timelordImageArray[11] = new Image();
timelordImageArray[11].src = "timelord_assets/aquarius.png";
timelordImageArray[12] = new Image();
timelordImageArray[12].src = "timelord_assets/pisces.png";
timelordImageArray[13] = new Image();
timelordImageArray[13].src = "timelord_assets/loosingthebond.png";
timelordImageArray[14] = new Image();
timelordImageArray[14].src = "timelord_assets/majorpeak.png";
timelordImageArray[15] = new Image();
timelordImageArray[15].src = "timelord_assets/moderatepeak.png";

var sectImageArray = [];
sectImageArray[1] = new Image();
sectImageArray[2] = new Image();

// Calculate the transiting and natal planets, and set cookie when new input is submitted
$ns.calculateTimeLord = function (setCookieFlag, initialRenderingFlag) {
    var $transitPlanetLongitude = [];
	var $natalPlanetLongitude = [];
    var releasingFromSign = document.getElementById("releasingfrom");
    var fortuneSign = document.getElementById("fortune");
    var chartSectOption = document.getElementById("chartsect");
	
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
/* 		citystate = document.getElementById("city").value; */
		latitude = parseFloat(document.getElementById("latitude").value);
		longitude = parseFloat(document.getElementById("longitude").value);
	}
	
	// If there wasn't a valid Lat/Long entered, then don't try to calculate the houses
	if (!latitude || !longitude) {
		calculateHouses = false;
	}
	
	// Store the calculated Natal position as a cookie if the calculated button is clicked
	if (setCookieFlag){
        createCookie('natalday', $natalInputDate.day, 30);
        createCookie('natalmonth', $natalInputDate.month, 30);
        createCookie('natalyear', $natalInputDate.year, 30);
        createCookie('natalhours', $natalInputDate.hours, 30);
        createCookie('natalminutes', $natalInputDate.minutes, 30);
        createCookie('natalseconds', $natalInputDate.seconds, 30);
        createCookie('releasingfrom', releasingFromSign.value, 30);
        createCookie('fortune', fortuneSign.value, 30);
        createCookie('chartsect', chartSectOption.value, 30);
        if (calculateHouses) {
            createCookie('housesystem', houseSystem, 30);
            /* createCookie('citystate', citystate,30); */
            createCookie('latitude', latitude, 30);
            createCookie('longitude', longitude, 30);
        }
        createCookie('unknowntime', document.getElementById("unknowntime").checked, 30);
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
        } else {
            // Otherwise plot 0-Aries Houses if we don't know the time or location
            cusp[0] = 0;
            hsp.cusp[0] = 0;
            for (i = 1; i <= 12; i++) {
                hsp.cusp[i] = (i - 1) * 30;
                cusp[i] = (i - 1) * 30;
            }
        }

        // Draw the natal planet chart
//        ctx = document.getElementById('natalchartcanvas').getContext('2d');
//        ctx.clearRect(0,0, natalchartcanvas.width, natalchartcanvas.height);
//        $e.drawNatalChart(ctx);
//        biwheel = false;
//        $e.drawNatalPlanets(ctx, biwheel);
//        $e.drawNatalAspects(middleCircleRadius);
        
  
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

    $e.drawZodicalReleasing($natalInputDate);

    // Draw degree tick marks every 5 years
    var ctx = document.getElementById('zodicalreleasing').getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.lineWidth = 0.5;
    for (var i = 0; i < 21; i++) {
        ctx.beginPath();
        ctx.moveTo(12, L1pixelsPerYear * 5 * i);
        ctx.lineTo(20, L1pixelsPerYear * 5 * i);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(460, L1pixelsPerYear * 5 * i);
        ctx.lineTo(460 - 10, L1pixelsPerYear * 5 * i);
        ctx.stroke();
        ctx.fillText(i * 5, 0, L1pixelsPerYear * 5 * i + 4);
    }
    ctx.restore();
    // Draw degree tick marks every 1 year
    ctx.save();
    ctx.lineWidth = 0.25;
    for (var i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.moveTo(15, L1pixelsPerYear * i);
        ctx.lineTo(20, L1pixelsPerYear * i);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(455, L1pixelsPerYear * i);
        ctx.lineTo(455 - 5, L1pixelsPerYear * i);
        ctx.stroke();
    }
    ctx.restore();
};

$ns.drawZodicalReleasing = function (inputDate) {
	var utcSeconds = inputDate.epoch;
	var birthTime = new Date(0);
	birthTime.setUTCSeconds(utcSeconds);

	var ctx = document.getElementById('zodicalreleasing').getContext('2d');
	// Clear out the chartcanvas for multiple executions
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, zodicalreleasing.width, zodicalreleasing.height);
	ctx.globalAlpha = 1;

	// Color in L1
	var currentPeriod;
	var previousPeriod;
	var cumulativeTime = 0;

	var L2currentPeriod;
    var fortuneSign;
    var chartSect;
	
	if (getCookieValue("releasingfrom")) {
		L1currentPeriod = parseInt(getCookieValue("releasingfrom"));
        fortuneSign = parseInt(getCookieValue("fortune"));
        chartSect = parseInt(getCookieValue("chartsect"));
	} else {
		L1currentPeriod = 1;
        fortuneSign = 1;
        chartSect = 1;
	}
    
	var initialPass = true;
	var firstLoosing = true;
	var showLoosingIcon = false;

	L2pixelsPerYear = 3;
	var L1currentTime = new Date(birthTime.getTime());

    // Set the out of sect malific and in sect benefic flags
    var beneficSign = 0;
    var maleficSign = 0;
    if (parseInt(chartSect) == 1) {
        // Set the benefic to Jupiter
        sectImageArray[1].src =	"timelord_assets/jupiter.png";
        beneficSign = Math.floor($natalPlanets["jupiter"] / 30) + 1;
        
        // Set the malefic to Mars
        sectImageArray[2].src =	"timelord_assets/mars.png";
        maleficSign = Math.floor($natalPlanets["mars"] / 30) + 1;
    } else {
        // Set the benefic to Venus
        sectImageArray[1].src =	"timelord_assets/venus.png";
        beneficSign = Math.floor($natalPlanets["venus"] / 30) + 1;
        
        // Set the malefic to Saturn
        sectImageArray[2].src =	"timelord_assets/saturn.png";
        maleficSign = Math.floor($natalPlanets["saturn"] / 30) + 1;
    }
    
    var tenthFromFortune = fortuneSign + 9;
    if (tenthFromFortune > 12) {tenthFromFortune = tenthFromFortune - 12;}
    var fourthFromFortune = fortuneSign + 3;
    if (fourthFromFortune > 12) {fourthFromFortune = fourthFromFortune - 12;}
    var seventhFromFortune = fortuneSign + 6;
    if (seventhFromFortune > 12) {seventhFromFortune = seventhFromFortune - 12;}

	while (cumulativeTime < 2505) {
        ctx.save();
        ctx.beginPath();

        // Draw the L1 period
        ctx.fillStyle = $signColor[L1currentPeriod];
        ctx.fillRect(20,cumulativeTime, 164, cumulativeTime + $planetaryPeriodYears[L1currentPeriod]*L1pixelsPerYear);

        // Add in the sign glyph
        ctx.drawImage(timelordImageArray[L1currentPeriod], 25, cumulativeTime+2);
        
        // Add in the benefic or malefic signs
        if (L1currentPeriod == beneficSign) {
            ctx.drawImage(sectImageArray[1], 25, cumulativeTime + 32);
        }
        if (L1currentPeriod == maleficSign) {
            ctx.drawImage(sectImageArray[2], 25, cumulativeTime + 62);
        }
        if (L1currentPeriod == tenthFromFortune || L1currentPeriod == fortuneSign) {
            ctx.drawImage(timelordImageArray[14], 25, cumulativeTime+92);
        }
        if (L1currentPeriod == fourthFromFortune || L1currentPeriod == seventhFromFortune) {
            ctx.drawImage(timelordImageArray[15], 25, cumulativeTime+92);
        }
    
        // Display the current L1 date
        ctx.fillStyle = "black";
        ctx.font = '20px Helvetica';
        ctx.fillText(L1currentTime.getMonth() + 1 + "/" + L1currentTime.getDate() + "/" + L1currentTime.getFullYear(), 55, cumulativeTime + 26);
		ctx.restore();

        // Calculate the new for the next L1 period
		L2cumulativeTime = cumulativeTime;
        cumulativeTime = cumulativeTime + $planetaryPeriodYears[L1currentPeriod] * L1pixelsPerYear;
        L2currentPeriod = L1currentPeriod;
        var L2currentTime = new Date(L1currentTime.getTime());

        var L2Loosing = L1currentPeriod;
        initialPass = true;
        firstLoosing = true;
        showLoosingIcon = false;

		while (L2cumulativeTime < cumulativeTime) {
            ctx.save();
			ctx.beginPath();
            ctx.fillStyle = $signColor[L2currentPeriod];
            ctx.fillRect(188, L2cumulativeTime, 262, L2cumulativeTime + ($planetaryPeriodYears[L2currentPeriod] / 12) * L1pixelsPerYear);
            if (initialPass) { 
                ctx.fillStyle = "black";
                ctx.fillRect(20,L2cumulativeTime, 430, 2);
            }

            ctx.drawImage(timelordImageArray[L2currentPeriod], 191, L2cumulativeTime+2, 16, 16);
            if (showLoosingIcon) {
                ctx.drawImage(timelordImageArray[13], 430, L2cumulativeTime + 1, 16, 16);
                ctx.globalAlpha = 0.75;
                ctx.fillStyle = "#6600cc";
                ctx.fillRect(170, L2cumulativeTime - 1, 430, 3);
                ctx.globalAlpha = 1;
                showLoosingIcon = false;
            }
            if (L2currentPeriod == beneficSign) {
                console.log(beneficSign, sectImageArray[1], 430-40, L2cumulativeTime + 1, 16, 16);
                ctx.drawImage(sectImageArray[1], 430-40, L2cumulativeTime + 1, 16, 16);
            }
            if (L2currentPeriod == maleficSign) {
                ctx.drawImage(sectImageArray[2], 430-60, L2cumulativeTime + 1, 16, 16);
            }
            if (L2currentPeriod == tenthFromFortune || L2currentPeriod == fortuneSign) {
                ctx.drawImage(timelordImageArray[14], 430-20, L2cumulativeTime + 1, 16, 16);
            }
            if (L2currentPeriod == fourthFromFortune || L2currentPeriod == seventhFromFortune) {
                ctx.drawImage(timelordImageArray[15], 430-20, L2cumulativeTime + 1, 16, 16);
            }
            
            ctx.fillStyle = "black";
            ctx.font = '13px Helvetica';
            ctx.fillText(L2currentTime.getMonth() + 1 + "/" + L2currentTime.getDate() + "/" + L2currentTime.getFullYear(), 210, L2cumulativeTime + 14);
            ctx.restore();

            L2currentTime.setTime(L2currentTime.getTime() + $planetaryPeriod[L2currentPeriod][2]);
            L2cumulativeTime = L2cumulativeTime + ($planetaryPeriodYears[L2currentPeriod] / 12) * L1pixelsPerYear;

            L2currentPeriod++;
            if (L2currentPeriod > 12) {L2currentPeriod = 1;}
            // Loosing the Bond!	
            if (initialPass) { 
				initialPass = false;
			} else {
                if (firstLoosing) {
                    if (L2currentPeriod == L2Loosing) {
                        ctx.drawImage(timelordImageArray[13], 430, L2cumulativeTime + 1, 16, 16);
                        L2currentPeriod = L2currentPeriod + 6;
                        if (L2currentPeriod > 12) {
                            L2currentPeriod = L2currentPeriod - 12;
                        }
                        firstLoosing = false;
                        showLoosingIcon = true;
                    }
                }
            }
        }
        L1currentTime.setTime(L1currentTime.getTime() + $planetaryPeriod[L1currentPeriod][1]);
        L1currentPeriod++;
        if (L1currentPeriod > 12) {L1currentPeriod = 1;}
    }
	
    var monthfield = document.getElementById("transitmonthfield");
    var yearfield = document.getElementById("transityearfield");
    var dayfield = document.getElementById("transitdayfield");
    // This sets the date according to the local timezone, which should be sufficient for getting ephemeris data
    startDate = new Date(parseInt(monthfield.value)+"/"+parseInt(dayfield.value)+"/"+parseInt(yearfield.value)+" "+0+":"+0+":"+0);
    // Calculate the number of days from the start date to the current date in the date field
    currentDayMarker = ((startDate.getTime()-birthTime.getTime())/31557600000)*(365.24/360)*L1pixelsPerYear;

    // Draw the current day line
    ctx.globalAlpha = 0.6;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(-5,currentDayMarker-1,470,3);
    ctx.restore();
}