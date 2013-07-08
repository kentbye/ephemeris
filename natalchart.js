var outerWheelRadius = 228;
var chartSignWidth = 20;
var innerCircleRadius = 70;
var middleCircleRadius = innerCircleRadius + 70;
var leadingZero = new Array();
var elementColor = ["red", "green", "yellow", "blue"];
	
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
	pluto: "#6b0000",
	ascendant: "#000000",
	midheaven: "#000000"
};

$ns.drawNatalChart = function (ctx) {
	var y, color;
	
	ctx.save();

	// Clear out the chartcanvas for multiple executions
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	ctx.clearRect(0, 0, 2*chartcanvas.width, 2*chartcanvas.height);

	// Move the 0,0 point to the center of the chartcanvas
	ctx.translate(chartcanvas.width/2, chartcanvas.height/2);
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black";
	ctx.lineWidth = 1;

	ctx.save();
	// Start on the Ascendant
	ctx.rotate(Math.PI);
	// Rotate by the Ascendant to start at 0 degrees Aries
	ctx.rotate(hsp.cusp[1]*Math.PI/180);
	// Draw outside wheel with colors
	for (var i = 0; i < 12; i++) {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = elementColor[i % 4];
		ctx.arc(0, 0, outerWheelRadius, 0, -30*Math.PI/180, true);
		ctx.rotate(-Math.PI/6);
		ctx.stroke();
	}
	// Draw outside wheel with black outline
	ctx.beginPath();
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = "black";
	ctx.arc(0, 0, outerWheelRadius, 0, 2*Math.PI, true);
	ctx.stroke();	

	ctx.lineWidth = 1.2;
	// Draw Decan Marks
	for (var i = 0; i < 36; i++) {
		ctx.beginPath();
		// Outer wheel ticks
		ctx.moveTo(outerWheelRadius-6, 0);
		ctx.lineTo(outerWheelRadius, 0);
		ctx.stroke();
		ctx.rotate(-Math.PI/18);
	}
	
	// Draw Degree marks
	ctx.lineWidth = 0.5;
	for (i = 0; i < 360; i++) {
		if (i % 30 != 0) {
			ctx.beginPath();
			// Outer wheel ticks
			ctx.moveTo(outerWheelRadius-4, 0);
			ctx.lineTo(outerWheelRadius, 0);
			ctx.stroke();
		}
		ctx.rotate(-Math.PI / 180);
	}
	ctx.restore();
	
	// Draw the House Cusps
	var houseCuspBeginX, houseCuspBeginY, houseCuspEndX, houseCuspEndY;
	var glpyhCuspBeginX, glpyhCuspBegin7;
	var degreeCuspBeginX, degreeCuspBeginY;
	var minuteCuspBeginX, minuteCuspBeginY;
	var degreeDegreeOffset = Array();
	var degreeRadiusOffset = Array();
	var minuteDegreeOffset = Array();
	var minuteRadiusOffset = Array();

	var signDegree, signMinute;
	ctx.save();
	ctx.font = "10px Arial";
	for (var i = 1; i < 13; i++) {
		ctx.beginPath();
		houseCuspBeginX = (outerWheelRadius-chartSignWidth)*Math.cos((180-(cusp[i]))*DEGTORAD);
		houseCuspBeginY = (outerWheelRadius-chartSignWidth)*Math.sin((180-(cusp[i]))*DEGTORAD);
		houseCuspEndX = middleCircleRadius*Math.cos((180-(cusp[i]))*DEGTORAD);
		houseCuspEndY = middleCircleRadius*Math.sin((180-(cusp[i]))*DEGTORAD);
		ctx.moveTo(houseCuspBeginX, houseCuspBeginY);
		ctx.lineTo(houseCuspEndX, houseCuspEndY);
		ctx.stroke();
		// Draw the midheaven arrow
		if (i == 10) {
			// Draw Midheaven Arrow
		  var arrowHeadLength = 10;	// length of head in pixels
			var dx = houseCuspBeginX-houseCuspEndX;
			var dy = houseCuspBeginY-houseCuspEndY;
			var angle = Math.atan2(dy,dx);
			ctx.moveTo(houseCuspBeginX, houseCuspBeginY);
			ctx.lineTo(houseCuspBeginX-arrowHeadLength*Math.cos(angle-Math.PI/6),houseCuspBeginY-arrowHeadLength*Math.sin(angle-Math.PI/6));
			ctx.moveTo(houseCuspBeginX, houseCuspBeginY);
			ctx.lineTo(houseCuspBeginX-arrowHeadLength*Math.cos(angle+Math.PI/6),houseCuspBeginY-arrowHeadLength*Math.sin(angle+Math.PI/6));  
			ctx.stroke();	
		}
		// Draw Cusp Sign Glpyhs and Degrees
		glpyhCuspBeginX = (outerWheelRadius-9)*Math.cos((180-(cusp[i]))*DEGTORAD) - 7;
		glpyhCuspBeginY = (outerWheelRadius-9)*Math.sin((180-(cusp[i]))*DEGTORAD) - 7;
		ctx.drawImage(signImageArray[Math.floor(hsp.cusp[i]/30)],glpyhCuspBeginX,glpyhCuspBeginY,14,14);
		
		// Add an individual offset to position each degree near the house cusp
		// TODO: Refactor this array to be based upon the degree relative to zero Aries. Break into quarters. Use sin & cos
		degreeDegreeOffset = [0, -3, -3, -3, -5, -6,  -6,   3,   4,   4,   6,   6,  5];
		degreeRadiusOffset = [0, -3, -3, -3, -3, -8, -14, -16, -16, -16, -16, -10, -6];
		degreeCuspBeginX = (outerWheelRadius+degreeRadiusOffset[i])*Math.cos((180-(cusp[i]+degreeDegreeOffset[i]))*DEGTORAD);
		degreeCuspBeginY = (outerWheelRadius+degreeRadiusOffset[i])*Math.sin((180-(cusp[i]+degreeDegreeOffset[i]))*DEGTORAD);
		signDegree = Math.floor(hsp.cusp[i] % 30);
		ctx.fillText(signDegree+String.fromCharCode(0x00B0), degreeCuspBeginX, degreeCuspBeginY);

		// Add an individual offset to position each minute near the house cusp
		// TODO: Refactor this array to be based upon the degree relative to zero Aries. Break into quarters. Use sin & cos
		minuteDegreeOffset = [0, -5, -4, -4, -3, -2,  -3,   5,   4,   4,   4,   2,  3];
		minuteRadiusOffset = [0, -2, -2, -2, -2, -8, -14, -16, -16, -16, -16, -13, -7];
		minuteCuspBeginX = (outerWheelRadius+minuteRadiusOffset[i]-1)*Math.cos((180-(cusp[i]-minuteDegreeOffset[i]))*DEGTORAD);
		minuteCuspBeginY = (outerWheelRadius+minuteRadiusOffset[i])*Math.sin((180-(cusp[i]-minuteDegreeOffset[i]))*DEGTORAD);
		signMinute = Math.round(((hsp.cusp[i] % 30)-signDegree)*60);
		ctx.fillText(signMinute+'"',minuteCuspBeginX, minuteCuspBeginY);
	}

	// Draw inside wheel with radius of chartSignWidth less than outside
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.arc(0, 0, outerWheelRadius-chartSignWidth, 0, Math.PI * 2, true);
	ctx.stroke();
	ctx.restore();

	// Draw middle circle with radius of middleCircleRadius
	ctx.save();
	ctx.beginPath();
	ctx.arc(0, 0, middleCircleRadius, 0, Math.PI * 2, true);
	ctx.stroke();
	ctx.restore();

};

var transitingPlanetSign = Array();
var transitingPlanetHouse = Array();

// Draw the transiting planet locations, tick marks and transit lines
$ns.drawTransitPlanets = function (circleRadius) {
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

	// Reset transform to the upper right-hand corner
	ctx.setTransform(1, 0, 0, 1, 0, 0);	 

	// Draw Planet Glpyhs and Degree lines
	// Go from the outside wheel to the inside circle
	ctx.font = "10px Arial";
	ctx.clearRect(0, 0, transitcanvas.width, transitcanvas.height);
	ctx.save();
	ctx.translate(transitcanvas.width/2, transitcanvas.height/2);
	for (var key in $transitPlanets) {
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
		planetGlyphX = 198 * planetX - 8;
		planetGlyphY = 198 * planetY - 8;
		ctx.drawImage(planetImageArray[key],planetGlyphX,planetGlyphY, 16, 16);
		
		// Place degree of transiting planet
		degreeX = 184 * planetX;
		degreeY = 184 * planetY; 
		signDegree = Math.floor($transitPlanets[key] % 30);
		ctx.fillText(signDegree+String.fromCharCode(0x00B0), degreeX-5, degreeY+3);
	
		// Place glyph of transiting planet's sign
		signGlyphX = 170 * planetX;
		signGlyphY = 170 * planetY; 
		transitingPlanetSign[key] = Math.floor($transitPlanets[key] / 30);
		ctx.drawImage(signImageArray[transitingPlanetSign[key]],signGlyphX-6,signGlyphY-6, 12, 12);

		// Place miniute of transiting planet's sign
		minuteX = 155 * planetX;
		minuteY = 155 * planetY; 
		signMinute = Math.round((($transitPlanets[key] % 30)-signDegree)*60);
		ctx.fillText(signMinute+'"', minuteX-5, minuteY+3);
		
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
	}
	ctx.restore();

	// Calculate which house the transiting planet is in
	if (calculateHouses){
		transitingPlanetHouse = calculateHouseCusps($transitPlanets);
	}
		
	// Label the Outer Wheel Transits
	ctx.font = "12px Arial";	
	ctx.fillText("Outer Wheel / Transits", 335, 14);
	ctx.fillText(monthtext[$transitInputDate.month]+" "+$transitInputDate.day+", "+$transitInputDate.year, 385, 28);
	$e.calculateLeadingZeros($transitInputDate);
	ctx.fillText(leadingZero[0]+$transitInputDate.hours+":"+leadingZero[1]+$transitInputDate.minutes+":"+leadingZero[2]+$transitInputDate.seconds+" GMT", 380, 42);
	ctx.fill();
}

// Make the transitIntensity ratings other to other functions
var	transitIntensity = {
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

// Calculate and display transits
$ns.drawTransitLines = function (circleRadius) {
	var natalTransits = new Array();
	var displayTransits = Array();
	var transitCount = 0;
	var conjunctRadius;
	var orb;

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
		for (var transitKey in $transitPlanets) {
			natalTransits[natalKey][transitKey] = Math.abs($natalPlanets[natalKey] - $transitPlanets[transitKey]);
			if (natalTransits[natalKey][transitKey] > 180) {
				natalTransits[natalKey][transitKey] = 360 - natalTransits[natalKey][transitKey];
			};
			
			// plot opposition
			if (natalTransits[natalKey][transitKey] >= 179) {
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
			if (natalTransits[natalKey][transitKey] >= 0 && natalTransits[natalKey][transitKey] <= 1) {
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
			if (natalTransits[natalKey][transitKey] >= 89 && natalTransits[natalKey][transitKey] <= 91) {
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
			if (natalTransits[natalKey][transitKey] >= 119 && natalTransits[natalKey][transitKey] <= 121) {
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
			if (natalTransits[natalKey][transitKey] >= 59 && natalTransits[natalKey][transitKey] <= 61) {
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
			if (natalTransits[natalKey][transitKey] >= 149 && natalTransits[natalKey][transitKey] <= 151) {
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
  // Sort the displayTransits array in order of the strongest transits first
	displayTransits.sort(function compareStrength(a,b) {return b.strength - a.strength});
	
	var ctx = document.getElementById('aspectcanvas').getContext('2d');
	var orb;
	var x, y;
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
		ctx.moveTo(x*115, (y*50)+35);
		ctx.lineTo((x*115)+orb, (y*50)+35);
		ctx.stroke();	

		// Display the orb of the aspect in minutes 
		ctx.fillStyle = displayTransits[i].color;
	  ctx.fillText(Math.round(displayTransits[i].difference*60)+'"', x*115+30+13, y*50+29);
		ctx.restore();
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);	 
};

// Draw the aspect line onto the natal chart
$ns.drawAspectLine = function ($transitDegree, $natalDegree, displayTransits, circleRadius, ctx) {
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = displayTransits.color;
	
	// Increase the width of the aspect line depending on the closeness of the orb
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

	transitingPlanetX = Math.cos((180-swe_degnorm($transitDegree-hsp.cusp[1]))*DEGTORAD);
	transitingPlanetY = Math.sin((180-swe_degnorm($transitDegree-hsp.cusp[1]))*DEGTORAD);
	aspectLineStartX = (circleRadius) * transitingPlanetX;
	aspectLineStartY = (circleRadius) * transitingPlanetY;
	natalPlanetX = Math.cos((180-swe_degnorm($natalDegree-hsp.cusp[1]))*DEGTORAD);
	natalPlanetY = Math.sin((180-swe_degnorm($natalDegree-hsp.cusp[1]))*DEGTORAD);
	aspectLineStopX = circleRadius * natalPlanetX;
	aspectLineStopY = circleRadius * natalPlanetY;
	ctx.moveTo(aspectLineStartX, aspectLineStartY);
	ctx.lineTo(aspectLineStopX, aspectLineStopY);
	ctx.stroke();
	
	// Place the arrow closer to the natal planet for quick visual reference of the transit direction
  midpointX = Math.abs(aspectLineStartX-aspectLineStopX)/4;
  midpointY = Math.abs(aspectLineStartY-aspectLineStopY)/4;
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

	// Draw Arrow
  var arrowHeadLength = 10;	// length of head in pixels
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

var planetSign = Array();
var natalPlanetHouse = Array();

// Draw the transiting planet locations, tick marks and transit lines
$ns.drawNatalPlanets = function (ctx, biwheel) {
	var planetGlyphX, planetGlyphY;
	var signGlyphX, signGlyphY;
	var planetX, planetY;
	var innerX, innerY;
	var middleX, middleY;
	var degreeX, degreeY, minuteX, minuteY;
	var signDegree, signMinute;
	var tickStartX, tickStartY;
	var tickStopX, tickStopY;
	var planetGlyphRadius;
	var degreeRadius, minuteRadius;
	var signGlyphRadius;
	var circleRadius;
	var natalGlyphSize, signGlyphSize;
	var maxHouse;
	
	if (calculateHouses){
		if (houseSystem !="W"){
			delete $natalPlanets['ascendant'];
			delete $natalPlanets['midheaven'];
		} else {
			$natalPlanets['ascendant'] = hsp.ac;
			$natalPlanets['midheaven'] = hsp.mc;
		}
	}
	// Move the 0,0 point to the center of the chartcanvas
	ctx.translate(natalcanvas.width/2, natalcanvas.height/2);
	
	if (biwheel) {
		// For the biwheel, draw the House Cusps marks from middle circle to inner circle & inner circle
		var houseCuspBeginX, houseCuspBeginY, houseCuspEndX, houseCuspEndY;
		ctx.save();
		ctx.lineWidth = 0.75;
		for (var i = 1; i < 13; i++) {
			ctx.beginPath();
			houseCuspBeginX = middleCircleRadius*Math.cos((180-(cusp[i]))*DEGTORAD);
			houseCuspBeginY = middleCircleRadius*Math.sin((180-(cusp[i]))*DEGTORAD);
			houseCuspEndX = innerCircleRadius*Math.cos((180-(cusp[i]))*DEGTORAD);
			houseCuspEndY = innerCircleRadius*Math.sin((180-(cusp[i]))*DEGTORAD);
			ctx.moveTo(houseCuspBeginX, houseCuspBeginY);
			ctx.lineTo(houseCuspEndX, houseCuspEndY);
			ctx.stroke();
		}
		ctx.restore();

		// Draw inside circle with radius of innerCircleRadius 
		ctx.save();
		ctx.beginPath();
		ctx.arc(0, 0, innerCircleRadius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.restore();

		// For the biwheel, place natal planet info on the inner wheel
		planetGlyphRadius = 128;
		degreeRadius = 113;
		signGlyphRadius = 100;
		minuteRadius = 84;
		circleRadius = innerCircleRadius;
	} else {
		// There's no biwheel and so place natal planets on the outer wheel
		planetGlyphRadius = 193;
		degreeRadius = 178;
		signGlyphRadius = 165;
		minuteRadius = 150;
		circleRadius = middleCircleRadius;
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(chartcanvas.width/2, chartcanvas.height/2);
		
	for (var key in $natalPlanets) {
		ctx.save();
	
		// Draw the natal planet degree line on outer circle
		ctx.beginPath();
		ctx.strokeStyle = $planetColor[key];
		ctx.fillStyle = $planetColor[key];
		planetX = Math.cos((180-swe_degnorm($natalPlanets[key]-hsp.cusp[1]))*DEGTORAD);
		planetY = Math.sin((180-swe_degnorm($natalPlanets[key]-hsp.cusp[1]))*DEGTORAD);
		innerX = (outerWheelRadius - chartSignWidth) * planetX;
		innerY = (outerWheelRadius - chartSignWidth) * planetY;
		middleX = middleCircleRadius * planetX;
		middleY = middleCircleRadius * planetY;

		ctx.lineWidth = 0.5;

		// Draw planetary position dot on the middle cirlce
		if (biwheel) {
			ctx.moveTo(middleX, middleY);
			ctx.arc(middleX, middleY, 2, 0, Math.PI * 2, true);
			ctx.fill();
			
			// Draw planetary position dot on the inside of the outer circle w/ radius of 2
			ctx.moveTo(innerX, innerY);
			ctx.arc(innerX, innerY, 2, 0, Math.PI * 2, true);
			ctx.fill();

			natalGlyphSize = 16;
			signGlyphSize = 12;
		} else {
			// Draw planetary position dot on the inside of the outer circle w/ radius of 3
			ctx.moveTo(innerX, innerY);
			ctx.arc(innerX, innerY, 3, 0, Math.PI * 2, true);
			ctx.fill();

			natalGlyphSize = 20;
			signGlyphSize = 14;			
		}
		
		// Place glyph of natal planet
		planetGlyphX = planetGlyphRadius * planetX - natalGlyphSize/2;
		planetGlyphY = planetGlyphRadius * planetY - natalGlyphSize/2;
		ctx.drawImage(planetImageArray[key],planetGlyphX,planetGlyphY, natalGlyphSize, natalGlyphSize);
		
		// Place degree of natal planet
		degreeX = degreeRadius * planetX;
		degreeY = degreeRadius * planetY; 
		signDegree = Math.floor($natalPlanets[key] % 30);
		ctx.fillText(signDegree+String.fromCharCode(0x00B0), degreeX-7, degreeY+5);
	
		// Place glyph of natal planet's sign
		signGlyphX = signGlyphRadius * planetX;
		signGlyphY = signGlyphRadius * planetY; 
		planetSign[key] = Math.floor($natalPlanets[key] / 30);
		ctx.drawImage(signImageArray[planetSign[key]],signGlyphX-signGlyphSize/2,signGlyphY-signGlyphSize/2, signGlyphSize, signGlyphSize);

		// Place minute of natal planet
		minuteX = minuteRadius * planetX;
		minuteY = minuteRadius * planetY; 
		signMinute = Math.round((($natalPlanets[key] % 30)-signDegree)*60);
		ctx.fillText(signMinute+'"', minuteX-7, minuteY+5);
	
		// Draw the natal planet degree line on inner circle
		ctx.lineWidth = 1;
		tickStartX = circleRadius * planetX;
		tickStartY = circleRadius * planetY;
		tickStopX = (circleRadius + 5) * planetX;
		tickStopY = (circleRadius + 5) * planetY;
		ctx.moveTo(tickStartX, tickStartY);
		ctx.lineTo(tickStopX, tickStopY);
		ctx.stroke();
		
		ctx.restore();

	};

	ctx.setTransform(1, 0, 0, 1, 0, 0);

	// Label the Inner Wheel Natal Chart
	ctx.font = "12px Arial";
	if (biwheel) {	
		ctx.fillText("Inner Wheel / Natal Chart", 0, 14);
	} else {
		ctx.fillText("Natal Chart", 0, 14);
	}
	ctx.fillText(monthtext[$natalInputDate.month]+" "+$natalInputDate.day+", "+$natalInputDate.year, 0, 28);
  $e.calculateLeadingZeros($natalInputDate);
	ctx.fillText(leadingZero[0]+$natalInputDate.hours+":"+leadingZero[1]+$natalInputDate.minutes+":"+leadingZero[2]+$natalInputDate.seconds+" GMT", 0, 42);
	ctx.fill();

	// Determine which house the natal planet is in
	if (calculateHouses){
		$natalPlanets['ascendant'] = hsp.ac;
		$natalPlanets['midheaven'] = hsp.mc;
		natalPlanetHouse = calculateHouseCusps($natalPlanets);
		planetSign['ascendant'] = Math.floor($natalPlanets['ascendant'] / 30);
		planetSign['midheaven'] = Math.floor($natalPlanets['midheaven'] / 30);
	}

};

Array.max = function(array) {
    return Math.max.apply(Math, array);
};

// Determine if the hours, seconds and minutes need to have a leading zero
$ns.calculateLeadingZeros = function($inputDate) {
  leadingZero[0] = '';
	leadingZero[1] = '';
	leadingZero[2] = '';
	if($inputDate.hours < 10) {
		leadingZero[0] = '0';
	} 
	if($inputDate.minutes < 10) {
		leadingZero[1] = '0';
	} 
	if($inputDate.seconds < 10) {
		leadingZero[2] = '0';
	} 
}

// Make the transitIntensity ratings other to other functions
var	aspectIntensity = {
		moon: 10,
		sun: 10,
		mercury: 8,
		venus: 8,
		mars: 7,
		jupiter: 5,
		saturn: 4,
		chiron: 2,
		uranus: 1,
		neptune: 1,
		pluto: 1
};

// TODO: Add in the north node = 0, ascendent = 3 and midheaven = 3 once I can calculate those values
var elementalWeight = {
		moon: 3,
		sun: 3,
		mercury: 2,
		venus: 2,
		mars: 2,
		jupiter: 1,
		saturn: 1,
		chiron: 0,
		uranus: 1,
		neptune: 1,
		pluto: 1,
}


// TODO: Set the orb for the aspects to be a degree larger for the luminaries of the Sun and Moon
// TODO: Calculate whether an aspect is applying or separating, and have special smaller orbs if it's separating.
var aspectOrb = {
		conjunct: 9,
		oppose: 8,
		trine: 7,
		square: 6,
		sextile: 3.5,
		quincunx: 2.5
}

// TODO: Add in the north node, ascendent, and midheaven = 3 once I can calculate those values
var aspectOrderGridCount = {
		moon: 0,
		sun: 1,
		mercury: 2,
		venus: 3,
		mars: 4,
		jupiter: 5,
		saturn: 6,
		uranus: 7,
		neptune: 8,
		pluto: 9,
		chiron: 10
};

// TODO: Add in the north node, ascendent, and midheaven = 3 once I can calculate those values
var aspectOrder = {
		moon: 0,
		sun: 1,
		mercury: 2,
		venus: 3,
		mars: 4,
		jupiter: 5,
		saturn: 6,
		uranus: 7,
		neptune: 8,
		pluto: 9,
		chiron: 10,
};


// Draw the aspect lines on the natal chart, draw the aspect grid, and draw element/mode bar graphs
$ns.drawNatalAspects = function (circleRadius) {
	var natalAspects = new Array();
	var displayAspects = Array();
	var aspectCount = 0;
	var conjunctRadius;
	var orb;
		// Add in the Ascendant and Midheaven if calculating House Cusps
	if (calculateHouses){
		aspectIntensity['ascendant'] = 10;
		aspectIntensity['midheaven'] = 10;
		elementalWeight['ascendant'] = 3;
		elementalWeight['midheaven'] = 3;
		aspectOrderGridCount['ascendant'] = 11;
		aspectOrderGridCount['midheaven'] = 12;
		aspectOrder['ascendant'] = 11;
		aspectOrder['midheaven'] = 12;
		$natalPlanets['ascendant'] = hsp.ac;
		$natalPlanets['midheaven'] = hsp.mc;
		planetSign['ascendant'] = Math.floor($natalPlanets['ascendant'] / 30);
		planetSign['midheaven'] = Math.floor($natalPlanets['midheaven'] / 30);		
	} else {
		delete aspectIntensity['ascendant'];
		delete aspectIntensity['midheaven'];
		delete elementalWeight['ascendant'];
		delete elementalWeight['midheaven'];
		delete aspectOrderGridCount['ascendant'];
		delete aspectOrderGridCount['midheaven'];
		delete aspectOrder['ascendant'];
		delete aspectOrder['midheaven'];
		delete $natalPlanets['ascendant'];
		delete $natalPlanets['midheaven'];
		delete planetSign['ascendant'];
		delete planetSign['midheaven'];
	}

	var ctx = document.getElementById('natalchartcanvas').getContext('2d');
	ctx.save();
	// Use the width of 460/2 to center the aspect lines
	ctx.translate(230,230);
	for (var natalKey in aspectOrderGridCount) {
		natalAspects[natalKey] = new Array();
		delete aspectOrderGridCount[natalKey];
		for (var aspectKey in aspectOrderGridCount) {
			natalAspects[natalKey][aspectKey] = Math.abs($natalPlanets[natalKey] - $natalPlanets[aspectKey]);
			if (natalAspects[natalKey][aspectKey] > 180) {
				natalAspects[natalKey][aspectKey] = 360 - natalAspects[natalKey][aspectKey];
			};
			
			//TODO: Remove the strength calculations since it's likely not needed for an aspect grid.
			// plot conjunction
			if (natalAspects[natalKey][aspectKey] >= 0 && natalAspects[natalKey][aspectKey] <= aspectOrb['conjunct']) {
				displayAspects[aspectCount] = {
					'strength': 10 * aspectIntensity[aspectKey],
					'transitPlanet': natalKey,
					'natalPlanet': aspectKey,
					'aspect': 'conjunct',
					'color': 'black',
					'difference': natalAspects[natalKey][aspectKey]
				};
				// Draw a Black dot on the the transiting planet tick to the natal planet
				ctx.save();
				ctx.beginPath();
				ctx.fillStyle = "black";
				// Calculate the radius of the conjunction circle based upon the closeness of the orb of the conjunction
				orb = (9.0 - displayAspects[aspectCount].difference)*90;
				if (orb < 200) {
					conjunctRadius= 3;
				} else if (orb > 200 && orb < 400){
					conjunctRadius = 4;
				} else if (orb > 400 && orb < 600){
					conjunctRadius = 5;
				} else {
					conjunctRadius = 6;
				}

				transitingPlanetX = (circleRadius - 4 - conjunctRadius) * Math.cos((180-swe_degnorm($natalPlanets[aspectKey]-hsp.cusp[1]))*DEGTORAD);
        transitingPlanetY = (circleRadius - 4 - conjunctRadius) * Math.sin((180-swe_degnorm($natalPlanets[aspectKey]-hsp.cusp[1]))*DEGTORAD);
				ctx.moveTo(transitingPlanetX, transitingPlanetY);
								
				ctx.arc(transitingPlanetX, transitingPlanetY, conjunctRadius, 0, Math.PI * 2, true);
				ctx.fill();
				ctx.restore();
				aspectCount++;
			}

			// plot opposition
			if (natalAspects[natalKey][aspectKey] >= 180-aspectOrb['oppose']) {
				displayAspects[aspectCount] = {
					'strength': 10 * aspectIntensity[aspectKey],
					'transitPlanet': natalKey,
					'natalPlanet': aspectKey,
					'aspect': 'oppose',
					'color': 'red',
					'difference': Math.abs(180-natalAspects[natalKey][aspectKey])
				};
				$e.drawAspectLine($natalPlanets[natalKey], $natalPlanets[aspectKey], displayAspects[aspectCount], circleRadius, ctx);
				aspectCount++;
			}	

			// plot trine
			if (natalAspects[natalKey][aspectKey] >= 120-aspectOrb['trine'] && natalAspects[natalKey][aspectKey] <= 120+aspectOrb['trine']) {
				displayAspects[aspectCount] = {
					'strength': 5 * aspectIntensity[aspectKey],
					'transitPlanet': natalKey,
					'natalPlanet': aspectKey,
					'aspect': 'trine',
					'color': 'blue',
					'difference': Math.abs(120-natalAspects[natalKey][aspectKey])
				};
				$e.drawAspectLine($natalPlanets[natalKey], $natalPlanets[aspectKey], displayAspects[aspectCount], circleRadius, ctx);
				aspectCount++;
			}

			// plot square
			if (natalAspects[natalKey][aspectKey] >= 90-aspectOrb['square'] && natalAspects[natalKey][aspectKey] <= 90+aspectOrb['square']) {
				displayAspects[aspectCount] = {
					'strength': 8 * aspectIntensity[aspectKey],
					'transitPlanet': natalKey,
					'natalPlanet': aspectKey,
					'aspect': 'square',
					'color': 'red',
					'difference': Math.abs(90-natalAspects[natalKey][aspectKey])
				};
				$e.drawAspectLine($natalPlanets[natalKey], $natalPlanets[aspectKey], displayAspects[aspectCount], circleRadius, ctx);
				aspectCount++;
			}
			
			// plot sextile
			if (natalAspects[natalKey][aspectKey] >= 60-aspectOrb['sextile'] && natalAspects[natalKey][aspectKey] <= 60+aspectOrb['sextile']) {
				displayAspects[aspectCount] = {
					'strength': 3 * aspectIntensity[aspectKey],
					'transitPlanet': natalKey,
					'natalPlanet': aspectKey,
					'aspect': 'sextile',
					'color': 'blue',
					'difference': Math.abs(60-natalAspects[natalKey][aspectKey])
				};
				$e.drawAspectLine($natalPlanets[natalKey], $natalPlanets[aspectKey], displayAspects[aspectCount], circleRadius, ctx);
				aspectCount++;
			}
			
			// plot quincunx
			if (natalAspects[natalKey][aspectKey] >= 150-aspectOrb['quincunx'] && natalAspects[natalKey][aspectKey] <= 150+aspectOrb['quincunx']) {
				displayAspects[aspectCount] = {
					'strength': 2 * aspectIntensity[aspectKey],
					'transitPlanet': natalKey,
					'natalPlanet': aspectKey,
					'aspect': 'quincunx',
					'color': 'green',
					'difference': Math.abs(150-natalAspects[natalKey][aspectKey])
				};
				$e.drawAspectLine($natalPlanets[natalKey], $natalPlanets[aspectKey], displayAspects[aspectCount], circleRadius, ctx);
				aspectCount++;
			} 
		}
	}

	ctx.restore();
	// Redefine altered aspectOrderGridCount in case there are multiple calculations done on a single pageload.
	aspectOrderGridCount = {
		moon: 0,
		sun: 1,
		mercury: 2,
		venus: 3,
		mars: 4,
		jupiter: 5,
		saturn: 6,
		uranus: 7,
		neptune: 8,
		pluto: 9,
		chiron: 10
	};

	// Draw Aspect Grid for Natal Chart
	var orb;
	var x, y;
	var aspectBarWidth;
	var aspectDegrees; 
	var aspectMinutes;
	
	// Set the aspect grid width
  var gridWidth = 29;
      
	// Add in the Ascendant and Midheaven if calculating House Cusps
  // TODO: change x to 14 once I have the node
	var numberOfGridRows;
	if (calculateHouses){
		numberOfGridRows = 13;
  } else {
	  numberOfGridRows = 11;
  }

  // Draw the aspect grid
  ctx.translate(gridWidth-6,363+gridWidth);
	ctx.strokeStyle = "#000000";  
	for (var x = 0; x < numberOfGridRows; x++) {
		y = x;
		for (var y; y < numberOfGridRows-1; y++) {	
	    ctx.save();
		  ctx.beginPath();
		  ctx.moveTo(x*gridWidth, y*gridWidth);
			ctx.strokeRect(x*gridWidth, y*gridWidth, gridWidth, gridWidth);
			ctx.restore();
		}
	}

	ctx.save();
	ctx.font = "9px Arial";
	// Draw the planet glpyhs onto the aspect grid
	i = 0;
	for (var natalKey in aspectOrder) {
	  if (natalKey == "moon") {
		  ctx.drawImage(planetImageArray[natalKey], 0, -24, 20, 20);
		  ctx.drawImage(signImageArray[planetSign[natalKey]], 16, -14, 10, 10);
//		  if (calculateHouses) {
		  	// For some reason this line is causing Android mobile browswer to crash out.
				//ctx.fillText(natalPlanetHouse[natalKey], 19, -15, 10, 10);
//			}

	  } else {
	  	// Draw planet glyphs on the left-hand side of the aspect grid
			ctx.drawImage(planetImageArray[natalKey], -23, i*gridWidth+4, 20, 20);
			ctx.drawImage(signImageArray[planetSign[natalKey]], -22+12, i*gridWidth+4+13, 10, 10);

			// Draw planet glyphs on the right-hand side of the aspect grid
			ctx.drawImage(planetImageArray[natalKey], (i+1)*gridWidth+2, i*gridWidth+4, 20, 20);
			ctx.drawImage(signImageArray[planetSign[natalKey]], (i+1)*gridWidth+2+15, i*gridWidth+4+13, 10, 10);
			if (calculateHouses) {
				ctx.fillText(natalPlanetHouse[natalKey], (i+1)*gridWidth+2+18, i*gridWidth+13+3);
			}

			i++;
		}
	}
	ctx.restore();
	
	// Draw all of the aspects in the aspect grid
	for (var i = 0; i < aspectCount; i++) {
		ctx.save();
		ctx.beginPath();
		
		x = aspectOrder[displayAspects[i].transitPlanet];
		y = aspectOrder[displayAspects[i].natalPlanet]-1;

		// Draw the aspect in the aspect grid
		ctx.drawImage(aspectImageArray[displayAspects[i].aspect], x*gridWidth+9, y*gridWidth+1, 11, 11);

		// Display the orb of the aspect in minutes 
		ctx.fillStyle = displayAspects[i].color;
		aspectDegrees = Math.floor(displayAspects[i].difference);
		aspectMinutes = Math.round((displayAspects[i].difference-aspectDegrees)*60)
	  ctx.fillText(aspectDegrees+String.fromCharCode(0x00B0)+aspectMinutes+'"', x*gridWidth+1, y*gridWidth+21);
		
    // Calculate the percentage of the orb relative to the aspect. 1.00 would be an exact aspect.
		orb = (aspectOrb[displayAspects[i].aspect] - displayAspects[i].difference)/aspectOrb[displayAspects[i].aspect];
		
		if (orb < 0.25) {
			ctx.lineWidth = 1;
		} else if (orb > 0.25 && orb < 0.50){
			ctx.lineWidth = 3;
		} else if (orb > 0.50 && orb < 0.75){
			ctx.lineWidth = 5;
		} else {
			ctx.lineWidth = 7;
		}

		// Draw the Aspect Bar at the bottom of each aspect. 100% would be the width of the grid (34 pixels).
		ctx.strokeStyle = displayAspects[i].color;
		ctx.moveTo(x*gridWidth, y*gridWidth+25);
		aspectBarWidth = gridWidth*orb;
		ctx.lineTo(x*gridWidth+aspectBarWidth, y*gridWidth+25);
		ctx.stroke();	
		
		ctx.restore();
	}
	
	// Draw the Elements
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(310,460);
	ctx.beginPath();
	ctx.strokeRect(-83, 2, 232, 102);
	ctx.beginPath();
	ctx.strokeRect(4, 117, 145, 74);
  ctx.fillText('Fire', 103, 18);
  ctx.fillText('Earth', 103, 44);
  ctx.fillText('Air', 103, 70);
  ctx.fillText('Water', 103, 96);
  ctx.fillText('Cardinal', 103, 131);
  ctx.fillText('Fixed', 103, 157);
  ctx.fillText('Mutable', 103, 183);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(410,485);
	ctx.beginPath();

	// Initialize variables for the counting of the elements and modes
	var planetElement = Array();
	var elementCount = Array();
	var planetMode = Array();
	var modeCount = Array();
	var elementIncrement = Array();
	var modeIncrement = Array();
	for (var i = 0; i < 3; i++) {
		elementCount[i] = 0;
		modeCount[i] = 0;	
		elementIncrement[i] = 0;
		modeIncrement[i] = 0;
	}
	elementCount[3] = 0;
	elementIncrement[3] = 0;
	var modeColor = ["red", "green", "blue"];

	// Calculate the element and mode count
	for (var planetKey in elementalWeight) {
		planetElement[planetKey] = planetSign[planetKey] % 4;
		planetMode[planetKey] = planetSign[planetKey] % 3;
		elementCount[planetElement[planetKey]] = elementCount[planetElement[planetKey]] + elementalWeight[planetKey];
		modeCount[planetMode[planetKey]] = modeCount[planetMode[planetKey]] + elementalWeight[planetKey];
  }

  ctx.save();

  // Draw Element score bars
	for (var i = 0; i < 4; i++) {
		ctx.fillStyle = elementColor[i];
		ctx.globalAlpha = 0.3;
	  ctx.fillRect(0, 0+(i*26), -8*elementCount[i], -22);
	}

  // Draw Mode score bars
	for (var i = 0; i < 3; i++) {
		ctx.fillStyle = modeColor[i];
		ctx.globalAlpha = 0.3;
	  ctx.fillRect(0, 115+(i*25), -4*modeCount[i], -22);
	}

	ctx.restore();
	
	// Plot the planet glyphs next to the appropriate element and mode
	// Y value for Fire = -18, Earth = 8, Air = 34, Water = 60
	// Y value for Cardinal = 97, Fixed = 122, Mutable = 147
	i=0;
	ctx.lineWidth = 3;
	for (var planetKey in elementalWeight) {
		// Draw the planet next to it's element
		ctx.drawImage(planetImageArray[planetKey], -182+(elementIncrement[planetElement[planetKey]]*17), -18+(planetElement[planetKey]*26), 15, 15);
		// Draw the planet's sign as a subscript
		ctx.drawImage(signImageArray[planetSign[planetKey]], -182+9+(elementIncrement[planetElement[planetKey]]*17), -18+10+(planetElement[planetKey]*26), 9, 9);
	
		elementIncrement[planetElement[planetKey]]++;

		// Draw the planet next to it's mode
		ctx.drawImage(planetImageArray[planetKey], -95+(modeIncrement[planetMode[planetKey]]*13), 97+(planetMode[planetKey]*25), 12, 12);
		ctx.drawImage(signImageArray[planetSign[planetKey]], -95+7+(modeIncrement[planetMode[planetKey]]*13), 97+8+(planetMode[planetKey]*25), 8, 8);
		
		modeIncrement[planetMode[planetKey]]++;
		i++;
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);	
};

function calculateHouseCusps (planets) {
	var houses = Array();

	// Find which House goes from Pisces to Aries
	maxHouse = hsp.cusp.indexOf(Math.max.apply(Math, hsp.cusp));

	// Calculate the Planet's House
	for (var key in planets) {
		for (var i = 1; i <= 12; i++) {
			if (i == 12) { 
				// If a planet isn't in houses 1-11, then it'll be in 12
				houses[key] = 12;
			} 
			// The house with the maximum house value goes from Pisces to Aries, and so check both
			else if (i==maxHouse){
				if ((planets[key] >= hsp.cusp[i] && planets[key] < 360) ||
						(planets[key] >= 0 && planets[key] < hsp.cusp[i+1])) {
							houses[key] = i;
							i = 13;
				}
			} else if (planets[key] >= hsp.cusp[i] && planets[key] < hsp.cusp[i+1]) {
				houses[key] = i;
				i = 13;
			} 
		}
	}
	return houses;
}