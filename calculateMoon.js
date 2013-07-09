var $natalPlanets;
var $transitPlanets;
var $transitInputDate;
var $natalInputDate;
var cusp = Array();
var houseSystem;
var calculateHouses;
var latitude;
var longitude;
var displayDate = Array();
var chartTransitDate;
  
// Calculate the transiting and natal planets, and set cookie when new input is submitted
$ns.calculateMoon = function (setCookieFlag, initialRenderingFlag) {
	var $transitPlanetLongitude = Array();
	var $natalPlanetLongitude = Array();
	var moonPhoto;
	
	$transitInputDate = $e.inputTime("transit");
	$natalInputDate = $e.inputTime("natal");

	moonPhoto = $transitInputDate.year + "-" + $e.addZero($transitInputDate.month) + "-" + $e.addZero($transitInputDate.day)  + "-" + $e.addZero($transitInputDate.hours)+".jpg";
  
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
			createCookie('latitude',latitude,30);
			createCookie('longitude',longitude,30);
		}
		createCookie('unknowntime',document.getElementById("unknowntime").checked,30);
		
	}
	
	// The epoch conversion took a UTC input and assumes a PDT output. Correcting it here for display
	var correctedEpoch = $transitInputDate.epoch - ($transitInputDate.timezoneoffset)*60;
  chartTransitDate = new Date(1000*(correctedEpoch));
  displayDate.year = chartTransitDate.getFullYear();
  displayDate.month = chartTransitDate.getMonth() + 1;
  displayDate.day = chartTransitDate.getDate();
  displayDate.hours = chartTransitDate.getHours();
  displayDate.minutes = chartTransitDate.getMinutes();
  displayDate.seconds = chartTransitDate.getSeconds();
  displayDate.offset = chartTransitDate.getTimezoneOffset();
	
  var moonPhase;
  var moonPhaseName;

	$const.date = $natalInputDate;
	$processor.init ();
  $natalPlanets = $e.calculateLongitude($natalInputDate);
  
  $const.date = $transitInputDate;
	$transitPlanets = $e.calculateLongitude($transitInputDate);

  // Display the moon photo
  document.getElementById("moonphoto").innerHTML = '<img src="moon/'+moonPhoto+'">';
	ctx = document.getElementById('moonMetadata').getContext('2d');
	ctx.clearRect(0,0, moonMetadata.width, moonMetadata.height);
	ctx.font = "16px Arial";
	ctx.fillStyle = "#000000";

	moonPhase = Math.round($e.mod360($transitPlanets['moon']-$transitPlanets['sun'])*1000)/1000;

	if (moonPhase >= 0 && moonPhase < 45) {
		nextPhaseName = "New Moon";
		moonPhaseName = "New Moon";
	} else if (moonPhase >= 45 && moonPhase < 90) {
		nextPhaseName = "1st Quarter";
		moonPhaseName = "Crescent";
	} else if (moonPhase >= 90 && moonPhase < 135) {
		nextPhaseName = "1st Quarter";
		moonPhaseName = "1st Quarter";
	} else if (moonPhase >= 135 && moonPhase < 180) {
		nextPhaseName = "Full Moon";
		moonPhaseName = "Gibbous";
	} else if (moonPhase >= 180 && moonPhase < 225) {
		nextPhaseName = "Full Moon";
		moonPhaseName = "Full Moon";
	} else if (moonPhase >= 225 && moonPhase < 270) {
		nextPhaseName = "3rd Quarter";
		moonPhaseName = "Disseminating";
	} else if (moonPhase >= 270 && moonPhase < 315) {
		nextPhaseName = "3rd Quarter";
		moonPhaseName = "3rd Quarter";
	} else if (moonPhase >= 315) {
		nextPhaseName = "New Moon";
		moonPhaseName = "Balsamic";
	};

	ctx.fillText(moonPhase+String.fromCharCode(0x00B0) + " " + moonPhaseName + " phase", 220, 90);
	ctx.fillText(nextPhase+nextPhaseName, 220, 110);
	ctx.fillText(Math.round($illuminatedFraction*100000)/1000+"% Illuminated", 220, 130);


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
	  ctx = document.getElementById('chartcanvas').getContext('2d');
	  ctx.clearRect(0,0, chartcanvas.width, chartcanvas.height);
	  $e.drawNatalChart(ctx);
	  biwheel = false;
	  $e.drawNatalPlanets(ctx, biwheel);
  }

  // Draw the Transit Planets and Transit Lines
	$e.drawMoonTransits(outerWheelRadius);
	$e.drawMoonTransitLines(middleCircleRadius);

  // Draw the current time on the ephemeris only when calculating a new time
  if (initialRenderingFlag) {
  	$e.moonEphemeris ();
  }
};

$ns.addZero = function (timeNumber) {
    if (timeNumber < 10) {
      return "0"+timeNumber;
    }
    else {
       return timeNumber;
    }
};

$ns.addHouseNumber = function (houseNumber) {
    if (houseNumber == 1) {
      return houseNumber+"st";
    }
    else if (houseNumber == 2){
      return houseNumber+"nd";
    }
    else if (houseNumber == 3){
      return houseNumber+"rd";
    }
    else {
      return houseNumber+"th";
    }
};


$ns.mod360 = function (degree) {
    if (degree < 0) {
      return degree+360;
    }
    else {
      return degree;
    }
};

$ns.incrementMoon = function (timeDelta) {
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
  $e.calculateMoon(setCookieFlag, initialRenderingFlag);
  $e.drawCurrentHour();
}

$ns.animateStartMoon = function ()  {
	if (timerId) return;
	// Default to advancing 1 day at a time
	//timerId = setInterval("$e.increment("+86400+")", 50);
	// TEMP: Have the increment 1 hour at a time
	timerId = setInterval("$e.incrementMoon("+3600+")", 150);
	// TODO: Make this increment dynamic
	// increment an hour at a time
	//timerId = setInterval("$e.increment("+3600+")", 50); 
}


// Draw the transiting planet locations, tick marks and transit lines
$ns.drawMoonTransits = function (circleRadius) {
	var ctx = document.getElementById('transitcanvas').getContext('2d');

	var planetGlyphX, planetGlyphY;
	var signGlyphX, signGlyphY;
	var planetX, planetY;
	var outerX, outerY;
	var signDegree, signMinute;
	var minuteX, minuteY;	
	var tickStartX, tickStartY;
	var tickStopX, tickStopY;
	var innerTickStartX, innerTickStartY;
	var innerTickStopX, innerTickStopY;
	var luminaries = Array();

	// Reset transform to the upper right-hand corner
	ctx.setTransform(1, 0, 0, 1, 0, 0);	 

	// Draw Planet Glpyhs and Degree lines
	// Go from the outside wheel to the inside circle
	ctx.font = "10px Arial";
	ctx.clearRect(0, 0, transitcanvas.width, transitcanvas.height);
	ctx.save();
	ctx.translate(transitcanvas.width/2, transitcanvas.height/2);

	luminaries['moon'] = 0;
	luminaries['sun'] = 0;
	var i = 0;

	// Calculate which house the transiting planet is in
	if (calculateHouses){
		transitingPlanetHouse = calculateHouseCusps($transitPlanets);
	}

	for (var key in luminaries) {
		// Draw the transiting planet degree line on outer circle
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = $planetColor[key];
		ctx.fillStyle = $planetColor[key];
		planetX = Math.cos((180-swe_degnorm($transitPlanets[key]-hsp.cusp[1]))*DEGTORAD);
		planetY = Math.sin((180-swe_degnorm($transitPlanets[key]-hsp.cusp[1]))*DEGTORAD);
		outerX = outerWheelRadius * planetX;
		outerY = outerWheelRadius * planetY;

		// Draw planetary position dot the outside of the outer circle
		ctx.moveTo(outerX, outerY);
		ctx.arc(outerX, outerY, 3, 0, Math.PI * 2, true);
		ctx.fill();

		
		// Place glyph of transiting planet
		planetGlyphX = 128 * planetX - 8;
		planetGlyphY = 128 * planetY - 8;
		ctx.drawImage(planetImageArray[key],planetGlyphX,planetGlyphY, 16, 16);
  	ctx.save();

		context = document.getElementById('moonMetadata').getContext('2d');
		context.drawImage(planetImageArray[key],220, 2+(i*32), 30, 30);

  	ctx.restore();		
		// Place degree of transiting planet
		degreeX = 113 * planetX;
		degreeY = 113 * planetY; 
		signDegree = Math.floor($transitPlanets[key] % 30);
		ctx.fillText(signDegree+String.fromCharCode(0x00B0), degreeX-5, degreeY+3);
  	ctx.save();

    context.font = "24px Arial";
  	context.fillStyle = "#000000";
  	context.fillText($e.addZero(signDegree)+String.fromCharCode(0x00B0), 250, 30+(i*32));

  	ctx.restore();		
		// Place glyph of transiting planet's sign
		signGlyphX = 100 * planetX;
		signGlyphY = 100 * planetY; 
		transitingPlanetSign[key] = Math.floor($transitPlanets[key] / 30);
		ctx.drawImage(signImageArray[transitingPlanetSign[key]],signGlyphX-6,signGlyphY-6, 12, 12);
  	ctx.save();

		context.drawImage(signImageArray[transitingPlanetSign[key]],288, 6+(i*32), 28, 28);

  	ctx.restore();		
		// Place miniute of transiting planet's sign
		minuteX = 84 * planetX;
		minuteY = 84 * planetY; 
		signMinute = Math.round((($transitPlanets[key] % 30)-signDegree)*60);
		ctx.fillText(signMinute+'"', minuteX-5, minuteY+3);
  	ctx.save();

  	context.fillText($e.addZero(signMinute) + '" (' + $e.addHouseNumber(transitingPlanetHouse[key]) + ')', 320, 30+(i*32));

  	ctx.restore();		
		// Draw the transiting planet degree line on middle circle
		ctx.lineWidth = 1;
		tickStartX = middleCircleRadius * planetX;
		tickStartY = middleCircleRadius * planetY;
		tickStopX = (middleCircleRadius + 5) * planetX;
		tickStopY = (middleCircleRadius + 5) * planetY;
		ctx.moveTo(tickStartX, tickStartY);
		ctx.lineTo(tickStopX, tickStopY);
		ctx.stroke();
	
		// Draw the transiting planet degree line on inner circle
		ctx.lineWidth = 1;
		transitingPlanetX = Math.cos((180-swe_degnorm($transitPlanets[key]-hsp.cusp[1]))*DEGTORAD);
		transitingPlanetY = Math.sin((180-swe_degnorm($transitPlanets[key]-hsp.cusp[1]))*DEGTORAD);
		innerTickStartX = circleRadius * transitingPlanetX;
		innerTickStartY = circleRadius * transitingPlanetY;
		innerTickStopX = (circleRadius - 5) * transitingPlanetX;
		innerTickStopY = (circleRadius - 5) * transitingPlanetY;
		ctx.moveTo(innerTickStartX, innerTickStartY);
		ctx.lineTo(innerTickStopX, innerTickStopY);
		ctx.stroke();
		
		//Increment counter for y-offset for glyph plotting 
		i++;
	}
	ctx.restore();

	
		
	// Label the Outer Wheel Transits
	ctx.font = "12px Arial";	
	ctx.fillText("Inner Wheel / Transits", 335, 14);
	ctx.fillText(monthtext[displayDate.month]+" "+displayDate.day+", "+displayDate.year, 385, 28);
	ctx.fillText($e.addZero(displayDate.hours)+":"+$e.addZero(displayDate.minutes)+":"+$e.addZero(displayDate.seconds) +" -"+displayDate.offset/60+"00", 380, 42);
	ctx.fill();
}


var moonAspectOrb = {
		conjunct: 4.5,
		oppose: 4.5,
		trine: 1.5,
		square: 2.25,
		sextile: 1.5,
		quincunx: 0.75
}

// Calculate and display transits
$ns.drawMoonTransitLines = function (circleRadius) {
	var natalTransits = new Array();
	var displayTransits = Array();
	var transitCount = 0;
	var conjunctRadius;
	var orb;
	var luminaries = Array();
	var aspectDegrees;
	var aspectMinutes;
	

  luminaries['moon'] = 0;
  
	if (calculateHouses){
		$natalPlanets['ascendant'] = hsp.ac;
		$natalPlanets['midheaven'] = hsp.mc;
	}

	var ctx = document.getElementById('transitcanvas').getContext('2d');
	var transitCtx = document.getElementById('transitcanvas').getContext('2d');
	ctx.save();
	ctx.translate(transitcanvas.width/2, transitcanvas.height/2);


	for (var natalKey in $natalPlanets) {
		natalTransits[natalKey] = new Array();
		for (var transitKey in luminaries) {
			natalTransits[natalKey][transitKey] = Math.abs($natalPlanets[natalKey] - $transitPlanets[transitKey]);
			if (natalTransits[natalKey][transitKey] > 180) {
				natalTransits[natalKey][transitKey] = 360 - natalTransits[natalKey][transitKey];
			};
			
			// plot opposition
			if (natalTransits[natalKey][transitKey] >= 180-moonAspectOrb['oppose']) {
				displayTransits[transitCount] = {
					'strength': 10 * transitIntensity[transitKey],
					'transitPlanet': transitKey,
					'natalPlanet': natalKey,
					'aspect': 'oppose',
					'color': 'red',
					'difference': Math.abs(180-natalTransits[natalKey][transitKey])
				};
				$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], circleRadius, transitCtx);
				transitCount++;
			}	

			// plot conjunction
			if (natalTransits[natalKey][transitKey] >= 0 && natalTransits[natalKey][transitKey] <= moonAspectOrb['conjunct']) {
				displayTransits[transitCount] = {
					'strength': 10 * transitIntensity[transitKey],
					'transitPlanet': transitKey,
					'natalPlanet': natalKey,
					'aspect': 'conjunct',
					'color': 'black',
					'difference': natalTransits[natalKey][transitKey]
				};
				// Draw a Black dot on the the transiting planet tick to the natal planet
				ctx.save();
				ctx.beginPath();
				ctx.fillStyle = "black";
				// Calculate the radius of the conjunction circle based upon the closeness of the orb of the conjunction
				orb = (1.0 - displayTransits[transitCount].difference)*90;
				if (orb < 22.5) {
					conjunctRadius= 3;
				} else if (orb > 22.5 && orb < 45){
					conjunctRadius = 4;
				} else if (orb > 45 && orb < 67.5){
					conjunctRadius = 5;
				} else {
					conjunctRadius = 6;
				}

				transitingPlanetX = (circleRadius - 4 - conjunctRadius) * Math.cos((180-swe_degnorm($transitPlanets[transitKey]-hsp.cusp[1]))*DEGTORAD);
        transitingPlanetY = (circleRadius - 4 - conjunctRadius) * Math.sin((180-swe_degnorm($transitPlanets[transitKey]-hsp.cusp[1]))*DEGTORAD);
				ctx.moveTo(transitingPlanetX, transitingPlanetY);
								
				ctx.arc(transitingPlanetX, transitingPlanetY, conjunctRadius, 0, Math.PI * 2, true);
				ctx.fill();
				ctx.restore();
				transitCount++;
			}

			// plot square
			if (natalTransits[natalKey][transitKey] >= 90-moonAspectOrb['square'] && natalTransits[natalKey][transitKey] <= 90+moonAspectOrb['square']) {
				displayTransits[transitCount] = {
					'strength': 8 * transitIntensity[transitKey],
					'transitPlanet': transitKey,
					'natalPlanet': natalKey,
					'aspect': 'square',
					'color': 'red',
					'difference': Math.abs(90-natalTransits[natalKey][transitKey])
				};
				$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], circleRadius, transitCtx);
				transitCount++;
			}
			
			// plot trine
			if (natalTransits[natalKey][transitKey] >= 120-moonAspectOrb['trine'] && natalTransits[natalKey][transitKey] <= 120+moonAspectOrb['trine']) {
				displayTransits[transitCount] = {
					'strength': 5 * transitIntensity[transitKey],
					'transitPlanet': transitKey,
					'natalPlanet': natalKey,
					'aspect': 'trine',
					'color': 'blue',
					'difference': Math.abs(120-natalTransits[natalKey][transitKey])
				};
				$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], circleRadius, transitCtx);
				transitCount++;
			}
			
			// plot sextile
			if (natalTransits[natalKey][transitKey] >= 60-moonAspectOrb['sextile'] && natalTransits[natalKey][transitKey] <= 60+moonAspectOrb['sextile']) {
				displayTransits[transitCount] = {
					'strength': 3 * transitIntensity[transitKey],
					'transitPlanet': transitKey,
					'natalPlanet': natalKey,
					'aspect': 'sextile',
					'color': 'blue',
					'difference': Math.abs(60-natalTransits[natalKey][transitKey])
				};
				$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], circleRadius, transitCtx);
				transitCount++;
			}
			
			// plot quincunx
			if (natalTransits[natalKey][transitKey] >= 150-moonAspectOrb['quincunx'] && natalTransits[natalKey][transitKey] <= 150+moonAspectOrb['quincunx']) {
				displayTransits[transitCount] = {
					'strength': 2 * transitIntensity[transitKey],
					'transitPlanet': transitKey,
					'natalPlanet': natalKey,
					'aspect': 'quincunx',
					'color': 'green',
					'difference': Math.abs(150-natalTransits[natalKey][transitKey])
				};
				$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], circleRadius, transitCtx);
				transitCount++;
			} 
		}
	}

	ctx.restore();
  // Sort the displayTransits array in order of the closest aspects first
	displayTransits.sort(function compareStrength(a,b) {return a.difference - b.difference});
	
	var ctx = document.getElementById('aspectcanvas').getContext('2d');
	var orb;
	var x, y;
	ctx.clearRect(0, 0, aspectcanvas.width, aspectcanvas.height);
	ctx.font = "9px Arial";
		
	// Display the ordered aspects with an orb indication
	for (var i = 0; i < transitCount; i++) {
		x = i % 4;
		y = Math.floor(i/4);
		// draw a grey rectangle around the outer planet transits
		if(displayTransits[i].transitPlanet == 'pluto' || displayTransits[i].transitPlanet == 'neptune' || displayTransits[i].transitPlanet == 'uranus') {
      ctx.save();
		  ctx.strokeStyle = "#CDCDCD";
		  ctx.beginPath();
		  ctx.moveTo(x*115, y*50);
			ctx.strokeRect(x*115, y*50, 100, 40);
			ctx.restore();
		}
		ctx.save();
		ctx.beginPath();

		// Draw the Transiting Planet, Sign and House
		ctx.drawImage(planetImageArray[displayTransits[i].transitPlanet], x*115+0, y*50);
		ctx.drawImage(signImageArray[transitingPlanetSign[[displayTransits[i].transitPlanet]]], (x*115)+22, (y*50)+20, 12, 12);
		if (calculateHouses){
			ctx.fillText(transitingPlanetHouse[[displayTransits[i].transitPlanet]], x*115+25, y*50+19);
		}

		// Draw the Transiting Aspect
		ctx.drawImage(aspectImageArray[displayTransits[i].aspect], x*115+30+12, y*50+5, 16, 16);

		// Draw the Natal Planet, Sign and House
		ctx.drawImage(planetImageArray[displayTransits[i].natalPlanet], x*115+60, y*50);
		ctx.drawImage(signImageArray[planetSign[[displayTransits[i].natalPlanet]]], x*115+60+22, y*50+20, 12, 12);
		if (calculateHouses){
			ctx.fillText(natalPlanetHouse[[displayTransits[i].natalPlanet]], x*115+60+27, y*50+19);
		}

		ctx.restore();
		ctx.save();

		// Calculate the orb strength and plot the bar graph
		orb = ((moonAspectOrb[displayTransits[i].aspect] - displayTransits[i].difference)/moonAspectOrb[displayTransits[i].aspect])*90;
		if (orb < 22.5) {
			ctx.lineWidth = 1;
		} else if (orb > 22.5 && orb < 45){
			ctx.lineWidth = 3;
		} else if (orb > 45 && orb < 67.5){
			ctx.lineWidth = 5;
		} else {
			ctx.lineWidth = 7;
		}
		ctx.strokeStyle = displayTransits[i].color;
		ctx.moveTo(x*115, (y*50)+35);
		ctx.lineTo((x*115)+orb, (y*50)+35);
		ctx.stroke();	

		// Display the orb of the aspect in minutes 
		ctx.fillStyle = displayTransits[i].color;
		aspectDegrees = Math.floor(displayTransits[i].difference);
		aspectMinutes = Math.round((displayTransits[i].difference-aspectDegrees)*60)
	  ctx.fillText(aspectDegrees+String.fromCharCode(0x00B0)+aspectMinutes+'"', x*115+30+13, y*50+29);
		ctx.restore();
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);	 
};

