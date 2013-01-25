var $planetColor = {
	sun: "#feb400",
	moon: "#b2b2b2",
	mercury: "#abc600",
	venus: "#00ccce",
	mars: "#be0000",
	jupiter: "#0000cb",
	saturn: "#a28868",
	chiron: "#666666",
	uranus: "#bc00ca",
	neptune: "#116f43",
	pluto: "#6b0000"
};

$ns.natalchart = function ($transitPlanets, $natalPlanets) {
	var ctx = document.getElementById('chartcanvas').getContext('2d');
	var planetX, planetY;
	var transitingPlanetX, transitingPlanetY;
	var innerX, innerY;
	var middleX, middleY; 
	var outerX, outerY;
	var planetGlyphX, planetGlyphY;
	var signGlyphX, signGlyphY;
	var tickStartX, tickStartY;
	var innerTickStartX, innerTickStartY;
	var signDegree;
	var planetSign;
	var outerWheelRadius = 228;
	var chartSignWidth = 30;
	var innerCircleRadius = 80;
	var middleCircleRadius = innerCircleRadius + 60;

 
	ctx.save();
	// Clear out the chartcanvas for multiple executions
	ctx.setTransform(1, 0, 0, 1, 0, 0);

		// If animating, then there is no need to rerender the baseline chart
	if ($natalPlanets) {
		ctx.clearRect(0, 0, chartcanvas.width, chartcanvas.height);
		// Move the 0,0 point to the center of the chartcanvas
		ctx.translate(chartcanvas.width/2, chartcanvas.height/2);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "white";
		ctx.lineWidth = 1;

		// Sign Cusps marks
		ctx.save();
		ctx.lineWidth = 0.75;
		for (var i = 0; i < 12; i++) {
			ctx.beginPath();
			ctx.rotate(Math.PI / 6);
			ctx.moveTo(outerWheelRadius, 0);
			ctx.lineTo(innerCircleRadius, 0);
			ctx.stroke();
		}
		ctx.restore();

		// Decan marks
		ctx.save();
		ctx.lineWidth = 0.25;
		for (var i = 0; i < 36; i++) {
			ctx.beginPath();
			ctx.rotate(Math.PI / 18);
			// Outer wheel ticks
			ctx.moveTo(outerWheelRadius-10, 0);
			ctx.lineTo(outerWheelRadius, 0);
			ctx.stroke();
			// Inner Wheel ticks
			ctx.moveTo(outerWheelRadius-chartSignWidth, 0);
			ctx.lineTo(outerWheelRadius-chartSignWidth+6, 0);
			ctx.stroke();
		}
		ctx.restore();

		// Degree marks
		ctx.save();
		ctx.lineWidth = 0.1;
		for (i = 0; i < 360; i++) {
			if (i % 30 != 0) {
				ctx.beginPath();
				// Outer wheel ticks
				ctx.moveTo(outerWheelRadius-5, 0);
				ctx.lineTo(outerWheelRadius, 0);
				ctx.stroke();
				// Inner wheel ticks
				ctx.moveTo(outerWheelRadius-chartSignWidth, 0);
				ctx.lineTo(outerWheelRadius-chartSignWidth+3, 0);
				ctx.stroke();
			}
			ctx.rotate(Math.PI / 180);
		}
		ctx.restore();
		ctx.fillStyle = "black";

		// Draw outside wheel
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000000';
		ctx.arc(0, 0, outerWheelRadius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.restore();

		// Draw inside wheel with radius of chartSignWidth less than outside
		ctx.save();
			ctx.beginPath();
		ctx.arc(0, 0, outerWheelRadius-chartSignWidth, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.restore();

		// Draw middle circle with radius of middleCircleRadius
		ctx.save();
			ctx.beginPath();
		ctx.arc(0, 0, middleCircleRadius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.restore();

		// Draw inside circle with radius of innerCircleRadius 
		ctx.save();
			ctx.beginPath();
		ctx.arc(0, 0, innerCircleRadius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.restore();
	};

	// Reset transform to the upper right-hand corner
	ctx.setTransform(1, 0, 0, 1, 0, 0);	 

	// Draw Planet Degree
	// Go from the outside wheel to the inside circle
	var ctx = document.getElementById('transitcanvas').getContext('2d');
	ctx.font = "12px Arial";
	ctx.clearRect(0, 0, transitcanvas.width, transitcanvas.height);
	for (var key in $transitPlanets) {
		ctx.save();
		// Draw the transiting planet degree line on outer circle
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = $planetColor[key];
		ctx.fillStyle = $planetColor[key];
		planetX = Math.cos((180-($transitPlanets[key]))*Math.PI/180);
		planetY = Math.sin((180-($transitPlanets[key]))*Math.PI/180);

		innerX = (outerWheelRadius - chartSignWidth) * planetX + (transitcanvas.width/2);
		innerY = (outerWheelRadius - chartSignWidth) * planetY + (transitcanvas.height/2);
		outerX = outerWheelRadius * planetX + (transitcanvas.width/2);
		outerY = outerWheelRadius * planetY + (transitcanvas.height/2);
		ctx.moveTo(innerX, innerY);
		ctx.lineTo(outerX, outerY);
		ctx.stroke();

		// Draw planetary position dot the outside of the outer circle
		ctx.moveTo(outerX, outerY);
		ctx.arc(outerX, outerY, 3, 0, Math.PI * 2, true);
		ctx.fill();
		
		// Place glyph of transiting planet
		planetGlyphX = 185 * planetX + (transitcanvas.width/2) - 10;
		planetGlyphY = 185 * planetY + (transitcanvas.height/2) - 10;
		ctx.drawImage(planetImageArray[key],planetGlyphX,planetGlyphY, 20, 20);
		
		// Place degree of transiting planet
		degreeX = 168 * planetX + (transitcanvas.width/2);
		degreeY = 168 * planetY + (transitcanvas.height/2); 
		signDegree = Math.floor($transitPlanets[key] % 30);
		ctx.fillText(signDegree+String.fromCharCode(0x00B0), degreeX-7, degreeY+5);
	
		// Place glyph of transiting planet's sign
		signGlyphX = 153 * planetX + (transitcanvas.width/2);
		signGlyphY = 153 * planetY + (transitcanvas.height/2); 
		planetSign = Math.floor($transitPlanets[key] / 30);
		ctx.drawImage(signImageArray[planetSign],signGlyphX-7,signGlyphY-7, 14, 14);

		// Draw the transiting planet degree line on middle circle
		ctx.lineWidth = 1;
		tickStartX = middleCircleRadius * planetX + (transitcanvas.width/2);
		tickStartY = middleCircleRadius * planetY + (transitcanvas.height/2);
		tickStopX = (middleCircleRadius + 5) * planetX + (transitcanvas.width/2);
		tickStopY = (middleCircleRadius + 5) * planetY + (transitcanvas.height/2);
		ctx.moveTo(tickStartX, tickStartY);
		ctx.lineTo(tickStopX, tickStopY);
		ctx.stroke();
	
		ctx.restore();
	}

	// Draw the Natal Planets and sign glpyhs, if not animating. If animating, then once is enough.
	if ($natalPlanets) {
		var ctx = document.getElementById('natalcanvas').getContext('2d');
		ctx.clearRect(0, 0, natalcanvas.width, natalcanvas.height);
		for (var key in $natalPlanets) {
		ctx.save();

		// Draw the natal planet degree line on outer circle
		ctx.beginPath();
		ctx.strokeStyle = $planetColor[key];
		ctx.fillStyle = $planetColor[key];
		planetX = Math.cos((180-($natalPlanets[key]))*Math.PI/180);
		planetY = Math.sin((180-($natalPlanets[key]))*Math.PI/180);

		innerX = (outerWheelRadius - chartSignWidth) * planetX + (natalcanvas.width/2);
		innerY = (outerWheelRadius - chartSignWidth) * planetY + (natalcanvas.height/2);
		outerX = outerWheelRadius * planetX + (natalcanvas.width/2);
		outerY = outerWheelRadius * planetY + (natalcanvas.height/2);
		ctx.lineWidth = 1;
		ctx.moveTo(innerX, innerY);
		ctx.lineTo(outerX, outerY);
		ctx.stroke();

		// Draw planetary position dot the inside of the outer circle
		ctx.lineWidth = 0.5;
		ctx.moveTo(innerX, innerY);
		ctx.arc(innerX, innerY, 3, 0, Math.PI * 2, true);
		ctx.fill();
		
		// Place glyph of natal planet
		planetGlyphX = 125 * planetX + (natalcanvas.width/2) - 10;
		planetGlyphY = 125 * planetY + (natalcanvas.height/2) - 10;
		ctx.drawImage(planetImageArray[key],planetGlyphX,planetGlyphY, 20, 20);
		
		// Place degree of natal planet
		degreeX = 108 * planetX + (natalcanvas.width/2);
		degreeY = 108 * planetY + (natalcanvas.height/2); 
		signDegree = Math.floor($natalPlanets[key] % 30);
		ctx.fillText(signDegree+String.fromCharCode(0x00B0), degreeX-7, degreeY+5);
	
		// Place glyph of natal planet's sign
		signGlyphX = 93 * planetX + (natalcanvas.width/2);
		signGlyphY = 93 * planetY + (natalcanvas.height/2); 
		planetSign = Math.floor($natalPlanets[key] / 30);
		ctx.drawImage(signImageArray[planetSign],signGlyphX-7,signGlyphY-7, 14, 14);
	
		// Draw the natal planet degree line on inner circle
		ctx.lineWidth = 1;
		tickStartX = innerCircleRadius * planetX + (natalcanvas.width/2);
		tickStartY = innerCircleRadius * planetY + (natalcanvas.height/2);
		tickStopX = (innerCircleRadius + 5) * planetX + (natalcanvas.width/2);
		tickStopY = (innerCircleRadius + 5) * planetY + (natalcanvas.height/2);
		ctx.moveTo(tickStartX, tickStartY);
		ctx.lineTo(tickStopX, tickStopY);
		ctx.stroke();
	
		// Draw the transiting planet degree line on inner circle
		ctx.lineWidth = 1;
		transitingPlanetX = Math.cos((180-($transitPlanets[key]))*Math.PI/180);
		transitingPlanetY = Math.sin((180-($transitPlanets[key]))*Math.PI/180);
		innerTickStartX = innerCircleRadius * transitingPlanetX + (natalcanvas.width/2);
		innerTickStartY = innerCircleRadius * transitingPlanetY + (natalcanvas.height/2);
		innerTickStopX = (innerCircleRadius - 5) * transitingPlanetX + (natalcanvas.width/2);
		innerTickStopY = (innerCircleRadius - 5) * transitingPlanetY + (natalcanvas.height/2);
		ctx.moveTo(innerTickStartX, innerTickStartY);
		ctx.lineTo(innerTickStopX, innerTickStopY);
		ctx.stroke();
	
		ctx.restore();
		};

		// Draw the Sign Glyphs
		ctx.save();
		for(var i=0; i<12; i++){
			ctx.save();
			// Radius * Angle(+15 degrees from cusp (with 180 correction for Aries zero-point)) + Center Point (minus half the width of a glyph)
			var x = (outerWheelRadius-15) * Math.cos((180-15-(i*30))*Math.PI/180) + (natalcanvas.width/2)-10;
			var y = (outerWheelRadius-15) * Math.sin((180-15-(i*30))*Math.PI/180) + (natalcanvas.height/2)-10;
			ctx.drawImage(signImageArray[i],x,y,20,20);
			ctx.restore();
		};
	};

	 // Calculate and display transits
	if ($natalPlanets) {
		var natalTransits = new Array();
		var displayTransits = Array();
		var transitCount = 0;
		var transitIntensity = {
			moon: 1,
			sun: 2,
			mercury: 4,
			venus: 4,
			mars: 5,
			jupiter: 6,
			saturn: 7,
			chiron: 8,
			uranus: 10,
			neptune: 10,
			pluto: 10
		};

		var ctx = document.getElementById('transitcanvas').getContext('2d');

		for (var natalKey in $natalPlanets) {
			natalTransits[natalKey] = new Array();
			for (var transitKey in $transitPlanets) {
				natalTransits[natalKey][transitKey] = Math.abs($natalPlanets[natalKey] - $transitPlanets[transitKey]);
				if (natalTransits[natalKey][transitKey] > 180) {
					natalTransits[natalKey][transitKey] = 360 - natalTransits[natalKey][transitKey];
				};
				
				// plot opposition
				if (natalTransits[natalKey][transitKey] >= 179 && natalTransits[natalKey][transitKey] <= 180) {
					displayTransits[transitCount] = {
						'strength': 10 * transitIntensity[transitKey],
						'transitPlanet': transitKey,
						'natalPlanet': natalKey,
						'aspect': 'oppose',
						'color': 'red',
						'difference': Math.abs(180-natalTransits[natalKey][transitKey])
					};
					$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], innerCircleRadius);
					transitCount++;
				}	

				// plot conjunction
				if (natalTransits[natalKey][transitKey] >= 0 && natalTransits[natalKey][transitKey] <= 1) {
					displayTransits[transitCount] = {
						'strength': 10 * transitIntensity[transitKey],
						'transitPlanet': transitKey,
						'natalPlanet': natalKey,
						'aspect': 'conjunct',
						'color': 'black',
						'difference': natalTransits[natalKey][transitKey]
					};
					transitCount++;
					// Draw a Black dot on the the transiting planet tick to the natal planet
					ctx.save();
					ctx.beginPath();
					ctx.fillStyle = "black";
					transitingPlanetX = (innerCircleRadius - 7) * Math.cos((180-($transitPlanets[transitKey]))*Math.PI/180) + (transitcanvas.width/2);
	        transitingPlanetY = (innerCircleRadius - 7) * Math.sin((180-($transitPlanets[transitKey]))*Math.PI/180) + (transitcanvas.height/2);
					ctx.moveTo(transitingPlanetX, transitingPlanetY);
					ctx.arc(transitingPlanetX, transitingPlanetY, 3, 0, Math.PI * 2, true);
					ctx.fill();
					ctx.restore();
				}

				// plot square
				if (natalTransits[natalKey][transitKey] >= 89 && natalTransits[natalKey][transitKey] <= 91) {
					displayTransits[transitCount] = {
						'strength': 8 * transitIntensity[transitKey],
						'transitPlanet': transitKey,
						'natalPlanet': natalKey,
						'aspect': 'square',
						'color': 'red',
						'difference': Math.abs(90-natalTransits[natalKey][transitKey])
					};
					$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], innerCircleRadius);
					transitCount++;
				}
				
				// plot trine
				if (natalTransits[natalKey][transitKey] >= 119 && natalTransits[natalKey][transitKey] <= 121) {
					displayTransits[transitCount] = {
						'strength': 5 * transitIntensity[transitKey],
						'transitPlanet': transitKey,
						'natalPlanet': natalKey,
						'aspect': 'trine',
						'color': 'blue',
						'difference': Math.abs(120-natalTransits[natalKey][transitKey])
					};
					$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], innerCircleRadius);
					transitCount++;
				}
				
				// plot sextile
				if (natalTransits[natalKey][transitKey] >= 59 && natalTransits[natalKey][transitKey] <= 61) {
					displayTransits[transitCount] = {
						'strength': 3 * transitIntensity[transitKey],
						'transitPlanet': transitKey,
						'natalPlanet': natalKey,
						'aspect': 'sextile',
						'color': 'blue',
						'difference': Math.abs(60-natalTransits[natalKey][transitKey])
					};
					$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], innerCircleRadius);
					transitCount++;
				}
				
				// plot quincunx
				if (natalTransits[natalKey][transitKey] >= 149 && natalTransits[natalKey][transitKey] <= 151) {
					displayTransits[transitCount] = {
						'strength': 2 * transitIntensity[transitKey],
						'transitPlanet': transitKey,
						'natalPlanet': natalKey,
						'aspect': 'quincunx',
						'color': 'green',
						'difference': Math.abs(150-natalTransits[natalKey][transitKey])
					};
					$e.drawAspectLine($transitPlanets[transitKey], $natalPlanets[natalKey], displayTransits[transitCount], innerCircleRadius);
					transitCount++;
				} 
			}
		}

	
		displayTransits.sort(function compareStrength(a,b) {return b.strength - a.strength});
		var ctx = document.getElementById('aspectcanvas').getContext('2d');
		var orb;
		var x, y, lastY;
		ctx.clearRect(0, 0, aspectcanvas.width, aspectcanvas.height);

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
				ctx.strokeRect(x*115, y*50, 90, 40);
				ctx.restore();

			}
			ctx.save();
			ctx.beginPath();
			ctx.drawImage(planetImageArray[displayTransits[i].transitPlanet], x*115+0, y*50);
			ctx.drawImage(aspectImageArray[displayTransits[i].aspect], x*115+30+7, y*50+5, 16, 16);
			ctx.drawImage(planetImageArray[displayTransits[i].natalPlanet], x*115+60, y*50);

			orb = (1.0 - displayTransits[i].difference)*90;
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
			ctx.moveTo(x*115, y*50+35);
			ctx.lineTo(x*115+orb, y*50+35);
			ctx.stroke();	

			// Display the orb of the aspect in minutes 
			ctx.fillStyle = displayTransits[i].color;
		  ctx.fillText(Math.round(displayTransits[i].difference*60)+'"', x*115+30+8, y*50+29);
			
			ctx.restore();
		}
	}
	ctx.restore();
	ctx.setTransform(1, 0, 0, 1, 0, 0);	 
		
};

// Draw the aspect line onto the natal chart
$ns.drawAspectLine = function ($transitDegree, $natalDegree, displayTransits, innerCircleRadius) {
  var ctx = document.getElementById('transitcanvas').getContext('2d');
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = displayTransits.color;
	
	var orb = (1.0 - displayTransits.difference)*90;
	if (orb < 22.5) {
		ctx.lineWidth = 0.5;
	} else if (orb > 22.5 && orb < 45){
		ctx.lineWidth = 1;
	} else if (orb > 45 && orb < 67.5){
		ctx.lineWidth = 2;
	} else {
		ctx.lineWidth = 3;
	}

	transitingPlanetX = Math.cos((180-($transitDegree))*Math.PI/180);
	transitingPlanetY = Math.sin((180-($transitDegree))*Math.PI/180);
	aspectLineStartX = (innerCircleRadius - 7) * transitingPlanetX + (transitcanvas.width/2);
	aspectLineStartY = (innerCircleRadius - 7) * transitingPlanetY + (transitcanvas.height/2);
	natalPlanetX = Math.cos((180-($natalDegree))*Math.PI/180);
	natalPlanetY = Math.sin((180-($natalDegree))*Math.PI/180);
	aspectLineStopX = innerCircleRadius * natalPlanetX + (transitcanvas.width/2);
	aspectLineStopY = innerCircleRadius * natalPlanetY + (transitcanvas.height/2);
	ctx.moveTo(aspectLineStartX, aspectLineStartY);
	ctx.lineTo(aspectLineStopX, aspectLineStopY);
	ctx.stroke();
	
	// Draw Arrow
	// Place the arrow closer to the natal planet for quick visual reference of the transit direction
  midpointX = Math.abs(aspectLineStartX-aspectLineStopX)/4;
  midpointY = Math.abs(aspectLineStartY-aspectLineStopY)/4;
	var arrowHeadLength = 10;	// length of head in pixels


  if (aspectLineStartX-aspectLineStopX > 0) {
	  // Transit-to-Natal is Right-to-Left
	  arrowX = aspectLineStopX + midpointX;
  } else {
	  // Transit-to-Natal is Left-to-Right
	  arrowX = aspectLineStopX - midpointX;
  }
  if (aspectLineStartY-aspectLineStopY > 0) {
	  // Transit-to-Natal is Down-to-Up
	  arrowY = aspectLineStopY + midpointY;
  } else {
	  // Transit-to-Natal is Up-to-Down
	  arrowY = aspectLineStopY - midpointY;
  }
	var dx = aspectLineStopX-aspectLineStartX;
	var dy = aspectLineStopY-aspectLineStartY;
	var angle = Math.atan2(dy,dx);
	ctx.moveTo(arrowX, arrowY);
	ctx.lineTo(arrowX-arrowHeadLength*Math.cos(angle-Math.PI/6),arrowY-arrowHeadLength*Math.sin(angle-Math.PI/6));
	ctx.moveTo(arrowX, arrowY);
	ctx.lineTo(arrowX-arrowHeadLength*Math.cos(angle+Math.PI/6),arrowY-arrowHeadLength*Math.sin(angle+Math.PI/6));  
	ctx.stroke();	
	ctx.restore();
};

$ns.drawEphemeris = function ($natalPlanets) {
  var monthfield = document.getElementById("transitmonthfield")
  var yearfield = document.getElementById("transityearfield");

  // This sets the date according to the local timezone, which should be sufficient for getting ephemeris data
  var startDate = new Date(parseInt(monthfield.value)+"/"+1+"/"+parseInt(yearfield.value)+" "+0+":"+0+":"+0);
  var stopDate = new Date(parseInt(monthfield.value)+"/"+1+"/"+parseInt(yearfield.value)+" "+0+":"+0+":"+0);
  startDate.setMonth(startDate.getMonth() - 2);
  stopDate.setMonth(stopDate.getMonth() + 5);
  var oneDay=1000*60*60*24;
  var daysDelta = (Math.abs(stopDate.getTime() - startDate.getTime()))/oneDay;

  var marsEphemerisData = new Array();
  var jupiterEphemerisData = new Array();
  var saturnEphemerisData = new Array();
  var chironEphemerisData = new Array();
  var saturnEphemerisData = new Array();
  var uranusEphemerisData = new Array();
  var neptuneEphemerisData = new Array();
  var plutoEphemerisData = new Array();
  
  // Gather the ephemeris data for the two previous months, current month and subsequent 4 months
	$processor.init ();
  var ephemerisPlanets
  for (var i = 0; i < daysDelta; i++) {
		startDate.setDate(startDate.getDate() + 1);
	  var $inputDate = {
			day: startDate.getDate(),
			month: startDate.getMonth(),
			year: startDate.getFullYear(),
			hours: 0,
			minutes: 0,
			seconds: 0,
		};
		$const.date = $inputDate;
		
		$const.body = $moshier.body['mars'];
	  $processor.calc ($inputDate, $const.body);
	  // Store the data as mod 90, convert to pixels (8 pixels per degree), round to 2 decimal places
	  marsEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  
	  $const.body = $moshier.body['jupiter'];
	  $processor.calc ($inputDate, $const.body);
	  jupiterEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;

	  $const.body = $moshier.body['saturn'];
	  $processor.calc ($inputDate, $const.body);
	  saturnEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;

	  $const.body = $moshier.body['chiron'];
	  $processor.calc ($inputDate, $const.body);
	  chironEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;

	  $const.body = $moshier.body['uranus'];
	  $processor.calc ($inputDate, $const.body);
	  uranusEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;

	  $const.body = $moshier.body['neptune'];
	  $processor.calc ($inputDate, $const.body);
	  neptuneEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;

	  $const.body = $moshier.body['pluto'];
	  $processor.calc ($inputDate, $const.body);
	  plutoEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  
	}
/*
	console.log(marsEphemerisData);
	console.log(jupiterEphemerisData);
	console.log(saturnEphemerisData);
	console.log(chironEphemerisData);
	console.log(saturnEphemerisData);
	console.log(uranusEphemerisData);
	console.log(neptuneEphemerisData);
	console.log(plutoEphemerisData);
*/
  
	var ctx = document.getElementById('ephemeriscanvas').getContext('2d');
  // console.log($natalPlanets);

};

