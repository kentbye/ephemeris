var hoursDelta;
var startDate;
var stopDate;
var startDateEpoch;
var stopDateEpoch;
var currentDayMarker;
var dayLabel = Array();
  
// Draw a 90-degree graphical ephemeris after calculating 7 months of outer planet positions
$ns.moonEphemeris = function () {
  var monthfield = document.getElementById("transitmonthfield")
  var dayfield = document.getElementById("transitdayfield");
  var yearfield = document.getElementById("transityearfield");
  var monthMarker = new Array();
  var monthLabel = new Array();
  var yearLabel = new Array();
  var planetSignGlyph;

  
  // Calculate the day boundaries according to the offset & local timezone, but need to convert to UTC time for actual moon calculations

  startDate = new Date(chartTransitDate.getTime()-86400000);
  stopDate = new Date(chartTransitDate.getTime()+86400000);

  dayLabel[0] = monthtext[startDate.getMonth()+1] + " " + startDate.getDate();
  dayLabel[1] = monthtext[chartTransitDate.getMonth()+1] + " " + chartTransitDate.getDate();
  dayLabel[2] = monthtext[stopDate.getMonth()+1] + " " + stopDate.getDate();
       
  hoursDelta = 72;
  
  // This data will be converted to Mod 30degrees, and then pixels units of 24px/degree for easy plotting
  var ephemerisData = {
  	moon: new Array(),
  };

  // This data will be used to determine the type of hard aspect
  var ephemerisRawData = {
  	moon: new Array(),
  };
    
  // Gather the ephemeris data for the previous day, current day and next day
	$processor.init ();
  var ephemerisPlanets;
  var natalY;
  // Go through each day, and calculate the longitude of each of the outer planets
  for (var i = 0; i < hoursDelta; i++) {
    // Increment the day on every day except the first one.
		if (i>0) {
		  startDate.setHours(startDate.getHours() + 1);
		} else {
			startDate.setHours(0);
			startDate.setMinutes(0);
			startDate.setSeconds(0);
			startDate.setMilliseconds(0);
			startDateEpoch = startDate.getTime()
			stopDateEpoch = startDateEpoch + 2*(86400000);
		}
		
	  var $inputDate = {
			day: startDate.getUTCDate(),
			month: startDate.getUTCMonth()+1,
			year: startDate.getUTCFullYear(),
			hours: startDate.getUTCHours(),
			minutes: 0,
			seconds: 0,
		};
		$const.date = $inputDate;

		// For each day, calculate each outer planet longitude
		for (var transitKey in ephemerisData) {
			$const.body = $moshier.body[transitKey];
		  $processor.calc ($inputDate, $const.body);
		  // Store the data as mod 30, convert to pixels (24 pixels/degree), round to 2 decimal places
		  ephemerisData[transitKey][i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 30) * 2400)/100;
		  ephemerisRawData[transitKey][i] = parseFloat($const.body.position.apparentLongitude);
		}
	}

	// Plot the results onto the graphical ephemeris canvas	
	var ctx = document.getElementById('ephemeriscanvas').getContext('2d');

  // Clear out the chartcanvas for multiple executions
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, ephemeriscanvas.width, ephemeriscanvas.height);
	
	// Move the 0,0 point to the center of the chartcanvas
	ctx.translate(40, 30);
	
	// Draw boundaries for the graphical ephemeris
	ctx.strokeStyle = "black";
  ctx.strokeRect(0,0,hoursDelta*5.278,720);
  ctx.stroke();
  
  // Draw degree tick marks every 5 degrees
  ctx.globalAlpha = 0.5;
  ctx.save();
  ctx.lineWidth = 0.75;
  for (var i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 120*i);
    ctx.lineTo(10, 120*i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hoursDelta*5.278, 120*i);
    ctx.lineTo(hoursDelta*5.278-10, 120*i);
    ctx.stroke();
    ctx.fillText(i*5+String.fromCharCode(0x00B0), -40, 120*i+6);
  }
  ctx.restore();

  // Draw degree tick marks every 1 degree
  ctx.save();
  ctx.lineWidth = 0.5;
  for (var i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 24*i);
    ctx.lineTo(5, 24*i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hoursDelta*5.278, 24*i);
    ctx.lineTo(hoursDelta*5.278-5, 24*i);
    ctx.stroke();
  }
  ctx.restore();
	
	// Draw lines every 8 hours
	ctx.globalAlpha = 0.15;
	for (var i = 0; i < 9; i++) {
	  ctx.beginPath();
	  // Mark the night hours in grey box, and show the date label. Have the beginning of day have darker line
    if ((i % 3)==0) {
    	ctx.globalAlpha = 0.05;
			ctx.fillRect(i*(5.278*72)/9,0,(5.278*72)/9,720);
			ctx.globalAlpha = 0.5;
			yOffset = -30;
			ctx.fillText(dayLabel[i/3], (i/3)*(5.278*72)/3 + (5.278*72)/9 + 10, -20);
    } else {
	    ctx.globalAlpha = 0.15;
	    yOffset = 0;
    }
    ctx.moveTo(i*(5.278*72)/9, 0 + yOffset);
    ctx.lineTo(i*(5.278*72)/9, 720);
    ctx.stroke();
	}

	// Draw hour lines
	for (var i = 0; i < 72; i++) {
	  ctx.beginPath();
    ctx.moveTo(i*5.278, 0);
    ctx.lineTo(i*5.278, 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i*5.278, 720);
    ctx.lineTo(i*5.278, 720-5);
    ctx.stroke();
	};


  ctx.globalAlpha = 1;

	// Draw Ephemeris Data for each planet
	for (var transitKey in ephemerisData) {
	  ctx.save();
	  ctx.lineWidth = 2;
	  ctx.strokeStyle = $planetColor[transitKey];
	  var dayXPosition = 0;
	  ctx.beginPath();
	  ctx.moveTo(dayXPosition-7, ephemerisData[transitKey][0]);  
	  for (var i = 1; i < hoursDelta; i++) {
	    dayXPosition = i * 5.278;
	    if(ephemerisData[transitKey][i]-ephemerisData[transitKey][i-1] > -50) {
			  ctx.lineTo(dayXPosition, ephemerisData[transitKey][i]);
			} else {
			  // The planet is moving into a cardinal sign. Move the Line instead of connecting it
			  // TODO: Determine logic for detecting the retrograde from 0 to 360.
				ctx.moveTo(dayXPosition-1.75, 0);
				ctx.lineTo(dayXPosition, ephemerisData[transitKey][i]);
	
				// Place the glyph and sign on top 
				ctx.drawImage(planetImageArray[transitKey], dayXPosition-7, -17, 14, 14);
				planetSignGlyph = Math.floor(ephemerisRawData[transitKey][i] / 30);
				ctx.drawImage(signImageArray[planetSignGlyph],dayXPosition+7, -17, 14, 14);
	
				// Place the glyph and sign on bottom
				ctx.drawImage(planetImageArray[transitKey], dayXPosition-8.75, 723, 14, 14);
				planetSignGlyph = Math.floor(ephemerisRawData[transitKey][i-1] / 30);
				ctx.drawImage(signImageArray[planetSignGlyph],dayXPosition+8.75, 723, 14, 14);						
			}
		}
		ctx.stroke();
	  ctx.drawImage(planetImageArray[transitKey], -20, ephemerisData[transitKey][0]-7, 14, 14);
		planetSignGlyph = Math.floor(ephemerisRawData[transitKey][0] / 30);
	  ctx.drawImage(signImageArray[planetSignGlyph],-20 -14 -2, ephemerisData[transitKey][0]-7, 14, 14);
  };

  ctx.restore();

	// Plot natal position lines & glyphs
	ctx.lineWidth = 1;
  for (var natalKey in $natalPlanets) {
	  ctx.strokeStyle = $planetColor[natalKey];
	  ctx.fillStyle = $planetColor[natalKey];
	  
	  // Take the 30-degree modulus of the natal planet and convert it to pixels
	  natalY = ($natalPlanets[natalKey]  % 30) * 24;
	  ctx.globalAlpha = 0.2;
	  ctx.beginPath();

	  // Plot a 1-degree orb for a degree before and after the natal planet position. 
	  ctx.fillRect(0,natalY-8,hoursDelta*5.278,16);
	  ctx.fill();

	  // Plot the natal planet longitude line
	  ctx.globalAlpha = 1.0;
	  ctx.beginPath();
	  ctx.moveTo(0,natalY);
	  ctx.lineTo(hoursDelta*5.278 + 10,natalY);
	  ctx.stroke();
	  
	  // Draw the planet and sign glyphs
	  // TODO: Save to an array to be able sort and add margins if needed to avoid overlapping glyphs
	  // TODO: Order the Glyphs so that they are centered within a house line
	  ctx.drawImage(planetImageArray[natalKey], hoursDelta*5.278 + 10, natalY-7, 14, 14);
	  planetSignGlyph = Math.floor($natalPlanets[natalKey] / 30);
		ctx.drawImage(signImageArray[planetSignGlyph],hoursDelta*5.278 +10 +14, natalY-7, 14, 14);
		if (calculateHouses) {
				ctx.fillText(natalPlanetHouse[natalKey], hoursDelta*5.278 +10 +14 +2 +12, natalY-7+10);
		}

  }

  // Plot Current Hour Line
  $e.drawCurrentHour();
  
  // Determine whether there is a transit to a natal planet
  var natalMod;
  var transitCount = 0;
  var displayTransitDates = Array();
  var aspect;
  var aspectDegree;
  var AspectFlag;

  // Add different orbs for each planet. This is in pixel units, there are 8px/degree.
  var exactOrb = {
		moon: 5,
  };
  
  // Loop through each natal planet to see if they're within orb of an exact aspect, and then plot the aspect
  for (var natalKey in $natalPlanets) {
  	natalModLongitude = ($natalPlanets[natalKey] % 30);
		for (var i = 0; i < hoursDelta; i++) {
			// Check against the 90-degree mod values (in px units) to see if there is a cjt/opp/sq
		  if (Math.abs(natalModLongitude*24-ephemerisData['moon'][i]) < exactOrb['moon']) {
		  	aspectDegree = Math.abs(ephemerisRawData['moon'][i]-$natalPlanets[natalKey]);
		  	AspectFlag = true;
		  	if (aspectDegree > 175 && aspectDegree < 185) {
			  	aspect = 'oppose';
			  	console.log('moon' + " OPPOSE " + natalKey +" = "+aspectDegree);
		  	} else if (aspectDegree < 5) {
			  	aspect = 'conjunct';
			  	console.log('moon' + " CONJUNCT " + natalKey +" = "+aspectDegree);
		  	} else if (aspectDegree > 85 && aspectDegree < 95){
			  	aspect = 'square';
			  	console.log('moon' + " SQUARE " + natalKey +" = "+aspectDegree);
		  	} else if (aspectDegree > 145 && aspectDegree < 155){
			  	aspect = 'quincunx';
			  	console.log('moon' + " QUNICUNX " + natalKey +" = "+aspectDegree);
		  	} else if (aspectDegree > 55 && aspectDegree < 65){
			  	aspect = 'sextile';
			  	console.log('moon' + " SEXTILE " + natalKey +" = "+aspectDegree);
		  	} else if (aspectDegree > 265 && aspectDegree < 275){
			  	aspect = 'square';
			  	console.log('moon' + " SQUARE " + natalKey +" = "+aspectDegree);
		  	} else if (aspectDegree > 115 && aspectDegree < 125){
			  	aspect = 'trine';
			  	console.log('moon' + " TRINE " + natalKey +" = "+aspectDegree);
		  	} else if (aspectDegree > 235 && aspectDegree < 245){
			  	aspect = 'trine';
			  	console.log('moon' + " TRINE " + natalKey +" = "+aspectDegree);
			  } else {
				  AspectFlag = false;
			  }
		  	// TODO: Prune these exact dates. Retrograde motion creates a lot of duplicate entries,
		  	// but too small of an orb will miss exact dates
		  	if (AspectFlag){
					ctx.drawImage(aspectImageArray[aspect], i*5.278-7, natalModLongitude*24-7, 14, 14);	  			  	
					displayTransitDates[transitCount] = {
						'transitPlanet': 'moon',
						'natalPlanet': natalKey,
						'aspect': aspect,
						'date': i,
						'natalLongitude': natalModLongitude*24,
						'aspectOrb': natalModLongitude*24-ephemerisData['moon'][i]
					};
					transitCount++;
				}
		  }
		}
	}

	// TODO: List out the past and upcoming transits ordered by transiting planet.
	// console.log(displayTransitDates);
};

$ns.drawCurrentHour = function () {
	// Subtract the UTC timezone offset from the epoch to see if the current time is on the graph
  var $transitEpoch = $transitInputDate.epoch*1000 - chartTransitDate.getTimezoneOffset()*60*1000;
  if ($transitEpoch > startDateEpoch && $transitEpoch < (stopDateEpoch+86400000)) {

  	// If the transitInputDate is in between the start and stop date, then draw the current day
		var ctx = document.getElementById('currentdaycanvas').getContext('2d');
		// Clear out the chartcanvas for multiple executions
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, ephemeriscanvas.width, ephemeriscanvas.height);
		
		// Move the 0,0 point to the center of the chartcanvas
		ctx.translate(40, 30);
		
		// Draw the current hour line
		currentDayMarker =  (chartTransitDate.getTime() - startDateEpoch)/(1000*3600);
		ctx.globalAlpha = 0.2;
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.fillRect(currentDayMarker*5.278-5.278,-30,3.5,770);
		ctx.restore();
  } else {
  	// Redraw the ephemeris with new start and stop dates before drawing the current day.
	  $e.moonEphemeris();
  }
}

