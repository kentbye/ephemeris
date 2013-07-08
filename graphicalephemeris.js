var daysDelta;
var startDate;
var stopDate;
var startDateEpoch;
var stopDateEpoch;
var oneDay;
var currentDayMarker;
  
// Draw a 90-degree graphical ephemeris after calculating 7 months of outer planet positions
$ns.drawEphemeris = function () {
  var monthfield = document.getElementById("transitmonthfield")
  var yearfield = document.getElementById("transityearfield");
  var monthMarker = new Array();
  var monthLabel = new Array();
  var yearLabel = new Array();
  var planetSignGlyph;

  // This sets the date according to the local timezone, which should be sufficient for getting ephemeris data
  startDate = new Date(parseInt(monthfield.value)+"/"+1+"/"+parseInt(yearfield.value)+" "+0+":"+0+":"+0);
  stopDate = new Date(parseInt(monthfield.value)+"/"+1+"/"+parseInt(yearfield.value)+" "+0+":"+0+":"+0);

  // Calculate the starting month (previous 2 months leading up to current month
  startDate.setMonth(startDate.getMonth() - 2);
  oneDay=1000*60*60*24;
   
  // Calculate the number of days from the start date to the current date in the date field
  startDateEpoch = startDate.getTime();
  
  // Calculate 7 months from the start date and save each new month. 
  stopDate.setMonth(stopDate.getMonth() - 2 );
  for (var i = 0; i < 8; i++) {
    stopDateEpoch = stopDate.getTime();
  	monthMarker[i] = Math.round((stopDateEpoch - startDateEpoch)/oneDay); 
  	monthLabel[i] = stopDate.getMonth();
  	yearLabel[i] = stopDate.getFullYear();
    stopDate.setMonth(stopDate.getMonth() + 1);
  }
  
  // Tthe total number of days across a 7-month period ranges from 212-215. Used to calculate graph width
  daysDelta = monthMarker[7];
  
  // This data will be converted to Mod 90degrees, and then pixels units of 8px/degree for easy plotting
  var ephemerisData = {
  	mars: new Array(),
	  jupiter: new Array(),
	  saturn: new Array(),
	  chiron: new Array(),
	  saturn: new Array(),
	  uranus: new Array(),
	  neptune: new Array(),
	  pluto: new Array()
  };

  // This data will be used to determine the type of hard aspect
  var ephemerisRawData = {
  	mars: new Array(),
	  jupiter: new Array(),
	  saturn: new Array(),
	  chiron: new Array(),
	  saturn: new Array(),
	  uranus: new Array(),
	  neptune: new Array(),
	  pluto: new Array()
  };
    
  // Gather the ephemeris data for the two previous months, current month and subsequent 4 months
	$processor.init ();
  var ephemerisPlanets;
  var natalY;
  // Go through each day, and calculate the longitude of each of the outer planets
  for (var i = 0; i < daysDelta; i++) {
    // Increment the day on every day except the first one.
		if (i>0) {
		  startDate.setDate(startDate.getDate() + 1);
		}
		
	  var $inputDate = {
			day: startDate.getDate(),
			month: startDate.getMonth()+1,
			year: startDate.getFullYear(),
			hours: 0,
			minutes: 0,
			seconds: 0,
		};
		$const.date = $inputDate;
		
		// For each day, calculate each outer planet longitude

		for (var transitKey in ephemerisData) {
			$const.body = $moshier.body[transitKey];
		  $processor.calc ($inputDate, $const.body);
		  // Store the data as mod 90, convert to pixels (8 pixels/degree), round to 2 decimal places
		  ephemerisData[transitKey][i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
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
  ctx.strokeRect(0,0,daysDelta*1.75,720);
  ctx.stroke();
  
  // Draw degree tick marks every 10 degrees
  ctx.globalAlpha = 0.5;
  ctx.save();
  ctx.lineWidth = 0.5;
  for (var i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 80*i);
    ctx.lineTo(10, 80*i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(daysDelta*1.75, 80*i);
    ctx.lineTo(daysDelta*1.75-10, 80*i);
    ctx.stroke();
    ctx.fillText(i*10+String.fromCharCode(0x00B0), -40, 80*i+6);
  }
  ctx.restore();

  // Draw degree tick marks every 1 degree
  ctx.save();
  ctx.lineWidth = 0.25;
  for (var i = 0; i < 90; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 8*i);
    ctx.lineTo(5, 8*i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(daysDelta*1.75, 8*i);
    ctx.lineTo(daysDelta*1.75-5, 8*i);
    ctx.stroke();
  }
  ctx.restore();
	
	// Draw 6 month lines and place the text of the month
	ctx.globalAlpha = 0.25;
	for (var i = 0; i < 7; i++) {
	  ctx.beginPath();
    ctx.moveTo(monthMarker[i]*1.75, 0);
    ctx.lineTo(monthMarker[i]*1.75, 720);
    ctx.stroke();
    ctx.fillText(monthtext[monthLabel[i]+1], monthMarker[i]*1.75 + 10, -20);
    ctx.fillText("'"+yearLabel[i].toString().slice(2), monthMarker[i]*1.75 + 30, -20);
	}

	// Draw Day lines every 7 days
	for (var i = 1; i < Math.floor(daysDelta/7); i++) {
	  ctx.beginPath();
    ctx.moveTo(i*7*1.75, 0);
    ctx.lineTo(i*7*1.75, 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i*7*1.75, 720);
    ctx.lineTo(i*7*1.75, 720-7);
    ctx.stroke();

	}

  ctx.globalAlpha = 1;

	// Draw Ephemeris Data for each planet
	for (var transitKey in ephemerisData) {
	  ctx.save();
	  ctx.lineWidth = 2;
	  ctx.strokeStyle = $planetColor[transitKey];
	  var dayXPosition = 0;
	  ctx.beginPath();
	  ctx.moveTo(dayXPosition-7, ephemerisData[transitKey][0]);  
	  for (var i = 1; i < daysDelta; i++) {
	    dayXPosition = i * 1.75;
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
	  
	  // Take the 90-degree modulus of the natal planet and convert it to pixels
	  natalY = ($natalPlanets[natalKey]  % 90) * 8;
	  ctx.globalAlpha = 0.2;
	  ctx.beginPath();

	  // Plot a 1-degree orb for a degree before and after the natal planet position. 
	  ctx.fillRect(0,natalY-8,daysDelta*1.75,16);
	  ctx.fill();

	  // Plot the natal planet longitude line
	  ctx.globalAlpha = 1.0;
	  ctx.beginPath();
	  ctx.moveTo(0,natalY);
	  ctx.lineTo(daysDelta*1.75 + 10,natalY);
	  ctx.stroke();
	  
	  // Draw the planet and sign glyphs
	  // TODO: Save to an array to be able sort and add margins if needed to avoid overlapping glyphs
	  // TODO: Order the Glyphs so that they are centered within a house line
	  ctx.drawImage(planetImageArray[natalKey], daysDelta*1.75 + 10, natalY-7, 14, 14);
	  planetSignGlyph = Math.floor($natalPlanets[natalKey] / 30);
		ctx.drawImage(signImageArray[planetSignGlyph],daysDelta*1.75 +10 +14, natalY-7, 14, 14);
		if (calculateHouses) {
				ctx.fillText(natalPlanetHouse[natalKey], daysDelta*1.75 +10 +14 +2 +12, natalY-7+10);
		}

  }

  // Plot Current Day Line
  $e.drawCurrentDay();
  
  // Determine the Exact Aspects
  // Determine the largest longitude for a transiting planet
  var maximumLongitude = {
    mars:		  Math.max.apply(Math, ephemerisData['mars'])/8,
  	jupiter:  Math.max.apply(Math, ephemerisData['jupiter'])/8,
  	saturn:		Math.max.apply(Math, ephemerisData['saturn'])/8,
  	chiron: 	Math.max.apply(Math, ephemerisData['chiron'])/8,
  	uranus: 	Math.max.apply(Math, ephemerisData['uranus'])/8,
  	neptune:	Math.max.apply(Math, ephemerisData['neptune'])/8,
  	pluto:		Math.max.apply(Math, ephemerisData['pluto'])/8
  }  

  // Determine the minimum longitude for a transiting planet
  var minimumLongitude = {
    mars:		  Math.min.apply(Math, ephemerisData['mars'])/8,
  	jupiter:  Math.min.apply(Math, ephemerisData['jupiter'])/8,
  	saturn:		Math.min.apply(Math, ephemerisData['saturn'])/8,
  	chiron: 	Math.min.apply(Math, ephemerisData['chiron'])/8,
  	uranus: 	Math.min.apply(Math, ephemerisData['uranus'])/8,
  	neptune:	Math.min.apply(Math, ephemerisData['neptune'])/8,
  	pluto:		Math.min.apply(Math, ephemerisData['pluto'])/8
  }  

  // Determine whether there is a transit to a natal planet
  var natalMod;
  var transitCount = 0;
  var displayTransitDates = Array();
  var aspect;
  var aspectDegree;

  // Add different orbs for each planet. This is in pixel units, there are 8px/degree.
  var exactOrb = {
		mars: 3,
		jupiter: 1.5,
		saturn: 1,
		chiron: .2,
		uranus: .2,
		neptune: .1,
		pluto: .1
  };
  
  // Loop through each natal planet to see if they're within orb of an exact aspect, and then plot the aspect
  for (var natalKey in $natalPlanets) {
  	natalModLongitude = ($natalPlanets[natalKey] % 90);
  	for (var transitKey in maximumLongitude) {
  		// Check to see if the natal longitude is within the max/min range of values for a transiting planet
  		if (natalModLongitude <= maximumLongitude[transitKey] && natalModLongitude >= minimumLongitude[transitKey]) {
  			for (var i = 0; i < daysDelta; i++) {
  				// Check against the 90-degree mod values (in px units) to see if there is a cjt/opp/sq
  			  if (Math.abs(natalModLongitude*8-ephemerisData[transitKey][i]) < exactOrb[transitKey]) {
  			  	aspectDegree = Math.abs(ephemerisRawData[transitKey][i]-$natalPlanets[natalKey]);
  			  	if (aspectDegree > 175 && aspectDegree < 185) {
	  			  	aspect = 'oppose';
	  			  	//console.log(transitKey + " OPPOSE " + natalKey +" = "+aspectDegree);
  			  	} else if (aspectDegree < 5) {
	  			  	aspect = 'conjunct';
	  			  	//console.log(transitKey + " CONJUNCT " + natalKey +" = "+aspectDegree);
  			  	} else {
	  			  	aspect = 'square';
	  			  	//console.log(transitKey + " SQUARE " + natalKey +" = "+aspectDegree);
  			  	}
  			  	// TODO: Prune these exact dates. Retrograde motion creates a lot of duplicate entries,
  			  	// but too small of an orb will miss exact dates
						ctx.drawImage(aspectImageArray[aspect], i*1.75-7, natalModLongitude*8-7, 14, 14);	  			  	
	  				displayTransitDates[transitCount] = {
							'strength': 10 * transitIntensity[transitKey],
							'transitPlanet': transitKey,
							'natalPlanet': natalKey,
							'aspect': aspect,
							'date': i,
							'natalLongitude': natalModLongitude*8,
							'aspectOrb': natalModLongitude*8-ephemerisData[transitKey][i]
						};
						transitCount++;
  			  }
				}
			}
  	}
	}
	// TODO: List out the past and upcoming transits ordered by transiting planet.
	// console.log(displayTransitDates);
};

$ns.drawCurrentDay = function () {
  if ($transitInputDate.epoch*1000 > startDateEpoch && $transitInputDate.epoch*1000 < stopDateEpoch) {
  	// If the transitInputDate is in between the start and stop date, then draw the current day
		var ctx = document.getElementById('currentdaycanvas').getContext('2d');
		// Clear out the chartcanvas for multiple executions
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, ephemeriscanvas.width, ephemeriscanvas.height);
		
		// Move the 0,0 point to the center of the chartcanvas
		ctx.translate(40, 30);
		
		// Draw the current day line
		currentDayMarker = Math.round(($transitInputDate.epoch*1000 - startDateEpoch)/oneDay); 
		console.log(currentDayMarker);
		ctx.globalAlpha = 0.2;
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.fillRect(currentDayMarker*1.75-1.75,-30,3.5,770);
		ctx.restore();
  } else {
  	// Redraw the ephemeris with new start and stop dates before drawing the current day.
	  $e.drawEphemeris();
  }

}

