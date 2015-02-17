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
var L3pixelsPerYear = 100;
var beneficSign = 0;
var maleficSign = 0;
var zodicalReleasingArray = new Array();
var zodicalReleasingL4Array = new Array();

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
sectImageArray[1].src =	"timelord_assets/jupiter.png";
sectImageArray[2] = new Image();
sectImageArray[2].src =	"timelord_assets/mars.png";
sectImageArray[3] = new Image();
sectImageArray[3].src =	"timelord_assets/venus.png";
sectImageArray[4] = new Image();
sectImageArray[4].src =	"timelord_assets/saturn.png";
        
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

    // Draw the Zodical Releasing only on the initial render
    if (initialRenderingFlag) {
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
    }

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
    
    if (parseInt(chartSect) == 1) {
        // Set the benefic to Jupiter
        beneficSign = Math.floor($natalPlanets["jupiter"] / 30) + 1;

        // Set the malefic to Mars
        maleficSign = Math.floor($natalPlanets["mars"] / 30) + 1;
    } else {
        // Set the benefic to Venus
        beneficSign = Math.floor($natalPlanets["venus"] / 30) + 1;

        // Set the malefic to Saturn
        maleficSign = Math.floor($natalPlanets["saturn"] / 30) + 1;
    } 
    
    var tenthFromFortune = fortuneSign + 9;
    if (tenthFromFortune > 12) {tenthFromFortune = tenthFromFortune - 12;}
    var fourthFromFortune = fortuneSign + 3;
    if (fourthFromFortune > 12) {fourthFromFortune = fourthFromFortune - 12;}
    var seventhFromFortune = fortuneSign + 6;
    if (seventhFromFortune > 12) {seventhFromFortune = seventhFromFortune - 12;}

    var zodicalReleasingCounter = 1;
    
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
            if (chartSect == 1) {
                ctx.drawImage(sectImageArray[1], 25, cumulativeTime + 32);
            } else {
                ctx.drawImage(sectImageArray[3], 25, cumulativeTime + 32);
            }
        }
        if (L1currentPeriod == maleficSign) {
            if (chartSect == 1) {
                ctx.drawImage(sectImageArray[2], 25, cumulativeTime + 62);
            } else {
                ctx.drawImage(sectImageArray[4], 25, cumulativeTime + 62);
            }
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
						// Store the data for later
						zodicalReleasingArray[zodicalReleasingCounter] = new Array();
						zodicalReleasingArray[zodicalReleasingCounter] = [L1currentPeriod, L2currentPeriod, L2cumulativeTime, showLoosingIcon];
						zodicalReleasingArray[zodicalReleasingCounter][4] = new Date(L2currentTime.getTime());

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
                if (chartSect == 1) {
                    ctx.drawImage(sectImageArray[1], 430-40, L2cumulativeTime + 1, 16, 16);
                } else {
                    ctx.drawImage(sectImageArray[3], 430-40, L2cumulativeTime + 1, 16, 16);
                }
            }
            if (L2currentPeriod == maleficSign) {
                if (chartSect == 1) {
                    ctx.drawImage(sectImageArray[2], 430-60, L2cumulativeTime + 1, 16, 16);
                } else {
                    ctx.drawImage(sectImageArray[4], 430-60, L2cumulativeTime + 1, 16, 16);
                }
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

            zodicalReleasingCounter++;
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
    transitDate = new Date(parseInt(monthfield.value)+"/"+parseInt(dayfield.value)+"/"+parseInt(yearfield.value)+" "+0+":"+0+":"+0);
    
    // Send the Current Time to the L3 calculation
		var counter = 1;
		while (transitDate.getTime() > zodicalReleasingArray[counter][4].getTime()) {
			  counter++;
		}
		
		$e.drawL3L4periods(counter-1, false);
		$e.drawCurrentDayZodicalReleasingL2(transitDate);
		$e.drawCurrentDayZodicalReleasingL4(zodicalReleasingArray[counter-1][4], transitDate);

}

$ns.drawL3L4periods = function (counter, snapToBoundary) {
		// Draw degree tick marks every 5 years
    var ctx = document.getElementById('zodicalreleasingL3').getContext('2d');
    // Clear out the chartcanvas for multiple executions
    ctx.clearRect(0, 0, zodicalreleasingL3.width, zodicalreleasingL3.height);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.lineWidth = 0.5;
    for (var i = 0; i < 21; i++) {
        ctx.beginPath();
        ctx.moveTo(12, L3pixelsPerYear * 5 * i);
        ctx.lineTo(20, L3pixelsPerYear * 5 * i);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(460, L3pixelsPerYear * 5 * i);
        ctx.lineTo(460 - 10, L3pixelsPerYear * 5 * i);
        ctx.stroke();
        // TODO: Fix this to regular years, and then to a more sane decimal increment added to Years Old
        ctx.fillText(Math.round(((i * 5)/12)*100)/100, 0, L3pixelsPerYear * 5 * i + 4);
    }
    ctx.restore();
    // Draw degree tick marks every 1 year
    ctx.save();
    ctx.lineWidth = 0.25;
    for (var i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.moveTo(15, L3pixelsPerYear * i);
        ctx.lineTo(20, L3pixelsPerYear * i);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(455, L3pixelsPerYear * i);
        ctx.lineTo(455 - 5, L3pixelsPerYear * i);
        ctx.stroke();
    }
    ctx.restore();


	ctx.globalAlpha = 1;

	// Color in L3
	var currentPeriod;
	var previousPeriod;
	var cumulativeTime = 0;

	var L3currentPeriod;
  var fortuneSign;
  var chartSect;
    
	
	if (getCookieValue("releasingfrom")) {
        fortuneSign = parseInt(getCookieValue("fortune"));
        chartSect = parseInt(getCookieValue("chartsect"));
	} else {
        fortuneSign = 1;
        chartSect = 1;
	}

  var L1currentPeriod = zodicalReleasingArray[counter][0];
  var L2currentPeriod = zodicalReleasingArray[counter][1];
  var L3currentPeriod = L2currentPeriod;
	var initialPass = true;
	var firstLoosing = true;
	var showLoosingIcon = false;

	// L4pixelsPerYear = 3; // TODO: Remove L2pixelsPerYear above?
	
	var L2currentTime = new Date(zodicalReleasingArray[counter][4].getTime());
	var L3currentTime = new Date(zodicalReleasingArray[counter][4].getTime());

	if (snapToBoundary) {
			// Draw the current day line now that the L2 time is found
		  $e.drawCurrentDayZodicalReleasingL2(L2currentTime);
		  $e.drawCurrentDayZodicalReleasingL4(L2currentTime, L2currentTime);
		   
		  // Set the Drop down menus to be whatever the clicked L2 current time was
		  var monthfield = document.getElementById("transitmonthfield")
			var dayfield = document.getElementById("transitdayfield")
			var yearfield = document.getElementById("transityearfield");
			var hourfield = document.getElementById("transithourfield");
			var minutefield = document.getElementById("transitminutefield");
			var secondfield = document.getElementById("transitsecondfield");
			monthfield.value = L2currentTime.getMonth() + 1;
			dayfield.value = L2currentTime.getDate();
			yearfield.value = L2currentTime.getFullYear();
			hourfield.value = L2currentTime.getHours();
			minutefield.value = L2currentTime.getMinutes();
			secondfield.value = L2currentTime.getSeconds();

			// Recalculate the natal positions of the planets with the new dates, but not initial pass
			$e.calculateTimeLord (true, false);
	}
 
    if (parseInt(chartSect) == 1) {
        // Set the benefic to Jupiter
        beneficSign = Math.floor($natalPlanets["jupiter"] / 30) + 1;

        // Set the malefic to Mars
        maleficSign = Math.floor($natalPlanets["mars"] / 30) + 1;
    } else {
        // Set the benefic to Venus
        beneficSign = Math.floor($natalPlanets["venus"] / 30) + 1;

        // Set the malefic to Saturn
        maleficSign = Math.floor($natalPlanets["saturn"] / 30) + 1;
    } 
    
    
    var tenthFromFortune = fortuneSign + 9;
    if (tenthFromFortune > 12) {tenthFromFortune = tenthFromFortune - 12;}
    var fourthFromFortune = fortuneSign + 3;
    if (fourthFromFortune > 12) {fourthFromFortune = fourthFromFortune - 12;}
    var seventhFromFortune = fortuneSign + 6;
    if (seventhFromFortune > 12) {seventhFromFortune = seventhFromFortune - 12;}

    var zodicalReleasingCounter = 1;

    ctx.save();
    ctx.beginPath();

    // Draw the L1 period
    ctx.fillStyle = $signColor[L1currentPeriod];
    ctx.fillRect(20,cumulativeTime, 45, cumulativeTime + $planetaryPeriodYears[L2currentPeriod]*L3pixelsPerYear);

    // Draw the L2 period
    ctx.fillStyle = $signColor[L2currentPeriod];
    ctx.fillRect(70,cumulativeTime, 114, cumulativeTime + $planetaryPeriodYears[L2currentPeriod]*L3pixelsPerYear);

    // Add in the sign glyph for L1
    ctx.drawImage(timelordImageArray[L1currentPeriod], 25, cumulativeTime+2);

    // Add in the sign glyph for L2
    ctx.drawImage(timelordImageArray[L2currentPeriod], 75, cumulativeTime+2);

    
    // Add in the benefic or malefic signs
    if (L2currentPeriod == beneficSign) {
        if (chartSect == 1) {
            ctx.drawImage(sectImageArray[1], 75, cumulativeTime + 32);
        } else {
            ctx.drawImage(sectImageArray[3], 75, cumulativeTime + 32);
        }
    }
    if (L1currentPeriod == beneficSign) {
        if (chartSect == 1) {
            ctx.drawImage(sectImageArray[1], 25, cumulativeTime + 32);
        } else {
            ctx.drawImage(sectImageArray[3], 25, cumulativeTime + 32);
        }
    }
    if (L2currentPeriod == maleficSign) {
        if (chartSect == 1) {
            ctx.drawImage(sectImageArray[2], 75, cumulativeTime + 62);
        } else {
            ctx.drawImage(sectImageArray[4], 75, cumulativeTime + 62);
        }
    }
    if (L1currentPeriod == maleficSign) {
        if (chartSect == 1) {
            ctx.drawImage(sectImageArray[2], 25, cumulativeTime + 62);
        } else {
            ctx.drawImage(sectImageArray[4], 25, cumulativeTime + 62);
        }
    }

    if (L2currentPeriod == tenthFromFortune || L2currentPeriod == fortuneSign) {
        ctx.drawImage(timelordImageArray[14], 75, cumulativeTime+92);
    }
    if (L2currentPeriod == fourthFromFortune || L2currentPeriod == seventhFromFortune) {
        ctx.drawImage(timelordImageArray[15], 75, cumulativeTime+92);
    }
    if (L1currentPeriod == tenthFromFortune || L1currentPeriod == fortuneSign) {
        ctx.drawImage(timelordImageArray[14], 25, cumulativeTime+92);
    }
    if (L1currentPeriod == fourthFromFortune || L1currentPeriod == seventhFromFortune) {
        ctx.drawImage(timelordImageArray[15], 25, cumulativeTime+92);
    }
    
    
    if (zodicalReleasingArray[counter][3]) {
        ctx.drawImage(timelordImageArray[13], 75, cumulativeTime+122);
    }

    // Display the current L2 date
    ctx.fillStyle = "black";
    ctx.font = '16px Helvetica';
    ctx.fillText(L3currentTime.getMonth() + 1 + "/" + L3currentTime.getDate() + "/" + L3currentTime.getFullYear(), 102, cumulativeTime + 26);
    ctx.restore();
    var L2PixelBoxHeight = $planetaryPeriodYears[L2currentPeriod] * L3pixelsPerYear;
    var L3initialPass = true;
    var L3firstLoosing = true;
    var L3showLoosingIcon = false;
    var L3Loosing = L2currentPeriod;

  // Create the L3 & L4 periods
	while (cumulativeTime < L2PixelBoxHeight) {
        ctx.save();
        ctx.beginPath();

        // Draw the L3 period
        ctx.fillStyle = $signColor[L3currentPeriod];
        ctx.fillRect(188,cumulativeTime, 180, cumulativeTime + ($planetaryPeriodYears[L3currentPeriod]/12)*L3pixelsPerYear);

        if (L3initialPass) { 
          	L3initialPass = false;
        } else {
            if (L3firstLoosing) {
                if (L3currentPeriod == L3Loosing) {
                    //ctx.drawImage(timelordImageArray[13], 450, cumulativeTime + 1, 16, 16);
                    L3currentPeriod = L3currentPeriod + 6;
                    if (L3currentPeriod > 12) {
                        L3currentPeriod = L3currentPeriod - 12;
                    }
                    L3firstLoosing = false;
                    L3showLoosingIcon = true;
                }
            }
        }


        if (L3showLoosingIcon) {
		        ctx.drawImage(timelordImageArray[13], 430-80, cumulativeTime + 1, 16, 16);
		        ctx.globalAlpha = 0.75;
		        ctx.fillStyle = "#6600cc";
		        // Draw loosing line at L3
		        ctx.fillRect(170, cumulativeTime, 310, 3);
		        ctx.globalAlpha = 1;
		        L3showLoosingIcon = false;
        }

        // Add in the sign glyph
        ctx.drawImage(timelordImageArray[L3currentPeriod], 191, cumulativeTime+2, 16, 16);

        // Add in the benefic or malefic signs
        if (L3currentPeriod == beneficSign) {
            if (chartSect == 1) {
                ctx.drawImage(sectImageArray[1], 430-120, cumulativeTime + 1, 16, 16);
            } else {
                ctx.drawImage(sectImageArray[3], 430-120, cumulativeTime + 1, 16, 16);
            }
        }
        if (L3currentPeriod == maleficSign) {
            if (chartSect == 1) {
                ctx.drawImage(sectImageArray[2], 430-140, cumulativeTime + 1, 16, 16);
            } else {
                ctx.drawImage(sectImageArray[4], 430-140, cumulativeTime + 1, 16, 16);
            }
        }
        if (L3currentPeriod == tenthFromFortune || L3currentPeriod == fortuneSign) {
            ctx.drawImage(timelordImageArray[14], 430-100, cumulativeTime+1, 16, 16);
        }
        if (L3currentPeriod == fourthFromFortune || L3currentPeriod == seventhFromFortune) {
            ctx.drawImage(timelordImageArray[15], 430-100, cumulativeTime+1, 16, 16);
        }
    
        // Display the current L3 date
        ctx.fillStyle = "black";
        ctx.font = '13px Helvetica';
        ctx.fillText(L3currentTime.getMonth() + 1 + "/" + L3currentTime.getDate() + "/" + L3currentTime.getFullYear(), 210, cumulativeTime + 14);
        ctx.restore();

        // Calculate the new for the next L3 period
        L4cumulativeTime = cumulativeTime;
        cumulativeTime = cumulativeTime + $planetaryPeriodYears[L3currentPeriod]/12 * L3pixelsPerYear;
        L4currentPeriod = L3currentPeriod;
        var L4currentTime = new Date(L3currentTime.getTime());
            
        var L4Loosing = L3currentPeriod;
        initialPass = true;
        firstLoosing = true;
        showLoosingIcon = false;

		while (L4cumulativeTime < cumulativeTime) {
						// Store the data for later
						zodicalReleasingL4Array[zodicalReleasingCounter] = new Array();
						zodicalReleasingL4Array[zodicalReleasingCounter] = [L3currentPeriod, L4currentPeriod, L4cumulativeTime, showLoosingIcon];
						zodicalReleasingL4Array[zodicalReleasingCounter][4] = new Date(L4currentTime.getTime());

            ctx.save();
            ctx.beginPath();
            // Draw the L4 period
            ctx.fillStyle = $signColor[L4currentPeriod];
            ctx.fillRect(372, L4cumulativeTime, 80, L4cumulativeTime + (($planetaryPeriodYears[L4currentPeriod] / 12)/12) * L3pixelsPerYear);
            if (initialPass) { 
                ctx.fillStyle = "black";
                ctx.fillRect(188,L4cumulativeTime, 264, 2);
            }

            ctx.drawImage(timelordImageArray[L4currentPeriod], 372, L4cumulativeTime+1, 9, 9);
            if (showLoosingIcon) {
                //ctx.drawImage(timelordImageArray[13], 430, L4cumulativeTime + 1, 9, 9);
                ctx.globalAlpha = 0.75;
                ctx.fillStyle = "#6600cc";
                // Draw loosing line at L4
                ctx.fillRect(360, L4cumulativeTime - 1, 110, 3);
                ctx.globalAlpha = 1;
                showLoosingIcon = false;
            }
            if (L4currentPeriod == beneficSign) {
                if (chartSect == 1) {
                    ctx.drawImage(sectImageArray[1], 443-10, L4cumulativeTime + 1, 7, 7);
                } else {
                    ctx.drawImage(sectImageArray[3], 443-10, L4cumulativeTime + 1, 7, 7);
                }
            }
            if (L4currentPeriod == maleficSign) {
                if (chartSect == 1) {
                    ctx.drawImage(sectImageArray[2], 443-20, L4cumulativeTime + 1, 7, 7);
                } else {
                    ctx.drawImage(sectImageArray[4], 443-20, L4cumulativeTime + 1, 7, 7);
                }
            }

            if (L4currentPeriod == tenthFromFortune || L4currentPeriod == fortuneSign) {
                ctx.drawImage(timelordImageArray[14], 443, L4cumulativeTime + 1, 9, 9);
            }
            if (L4currentPeriod == fourthFromFortune || L4currentPeriod == seventhFromFortune) {
                ctx.drawImage(timelordImageArray[15], 443, L4cumulativeTime + 1, 9, 9);
            }
            
            ctx.fillStyle = "black";
            ctx.font = '8px Helvetica';
            ctx.fillText(L4currentTime.getMonth() + 1 + "/" + L4currentTime.getDate() + "/" + L4currentTime.getFullYear(), 382, L4cumulativeTime+7);
            ctx.restore();

            L4currentTime.setTime(L4currentTime.getTime() + $planetaryPeriod[L4currentPeriod][4]);
            L4cumulativeTime = L4cumulativeTime + (($planetaryPeriodYears[L4currentPeriod] / 12)/12) * L3pixelsPerYear;

            zodicalReleasingCounter++;
            L4currentPeriod++;
            if (L4currentPeriod > 12) {L4currentPeriod = 1;}
            // Loosing the Bond!	
            if (initialPass) { 
	            	initialPass = false;
	          } else {
                if (firstLoosing) {
                    if (L4currentPeriod == L4Loosing) {
                        ctx.drawImage(timelordImageArray[13], 450, L4cumulativeTime + 1, 9, 9);
                        L4currentPeriod = L4currentPeriod + 6;
                        if (L4currentPeriod > 12) {
                            L4currentPeriod = L4currentPeriod - 12;
                        }
                        firstLoosing = false;
                        showLoosingIcon = true;
                    }
                }
            }
        }
        L3currentTime.setTime(L3currentTime.getTime() + $planetaryPeriod[L3currentPeriod][3]);
        L3currentPeriod++;
        if (L3currentPeriod > 12) {L3currentPeriod = 1;}
    }

		// Delete extra sections with a white rectangle
		ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, L2PixelBoxHeight, 460, 2500);
    ctx.restore();

}

$ns.drawCurrentDayZodicalReleasingL2 = function (transitDate) {
		var birthTime = new Date(0);
		birthTime.setUTCSeconds($natalInputDate.epoch);
		var ctx = document.getElementById('currentDayZodicalReleasing').getContext('2d');
		// Clear out the chartcanvas for multiple executions
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, currentDayZodicalReleasing.width, currentDayZodicalReleasing.height);
		
    // Calculate the number of days from the start date to the current date in the date field
    currentDayMarker = ((transitDate.getTime()-birthTime.getTime())/31557600000)*(365.24/360)*L1pixelsPerYear;

    // Draw the current day line
    ctx.globalAlpha = 0.6;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(-5,currentDayMarker-1,470,3);
    ctx.restore();
}

$ns.drawCurrentDayZodicalReleasingL4 = function (L2StartDate, transitDate) {
		var ctx = document.getElementById('currentDayZodicalReleasingL3').getContext('2d');
		// Clear out the chartcanvas for multiple executions
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, currentDayZodicalReleasingL3.width, currentDayZodicalReleasingL3.height);
		
    // Calculate the number of days from the start date to the current date in the date field
    currentDayMarker = ((transitDate.getTime()-L2StartDate.getTime())/31557600000)*(365.24/360)*L3pixelsPerYear*12;

    // Draw the current day line
    ctx.globalAlpha = 0.6;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(-5,currentDayMarker-1,470,3);
    ctx.restore();
}


$ns.displayL3FromClick = function (clickedY) {
		var counter = 1;
		while (clickedY > zodicalReleasingArray[counter][2]) {
			  counter++;
		}
		$e.drawL3L4periods(counter-1, true);
}

$ns.displayL4FromClick = function (clickedY) {
		var counter = 1;
		while (clickedY > zodicalReleasingL4Array[counter][2]) {
			  counter++;
		}
		var L4currentTime = new Date(zodicalReleasingL4Array[counter-1][4].getTime());

		$e.drawCurrentDayZodicalReleasingL4(zodicalReleasingL4Array[1][4], L4currentTime);
		$e.drawCurrentDayZodicalReleasingL2(L4currentTime);		
		
		// Set the Drop down menus to be whatever the clicked L2 current time was
		var monthfield = document.getElementById("transitmonthfield")
		var dayfield = document.getElementById("transitdayfield")
		var yearfield = document.getElementById("transityearfield");
		var hourfield = document.getElementById("transithourfield");
		var minutefield = document.getElementById("transitminutefield");
		var secondfield = document.getElementById("transitsecondfield");
		monthfield.value = L4currentTime.getMonth() + 1;
		dayfield.value = L4currentTime.getDate();
		yearfield.value = L4currentTime.getFullYear();
		hourfield.value = L4currentTime.getHours();
		minutefield.value = L4currentTime.getMinutes();
		secondfield.value = L4currentTime.getSeconds();

		// Recalculate the natal positions of the planets with the new dates, but not initial pass
		$e.calculateTimeLord (true, false);

}