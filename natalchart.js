var outerWheelRadius = 228;
var chartSignWidth = 30;
var innerCircleRadius = 80;
var middleCircleRadius = innerCircleRadius + 60;
var leadingZero = new Array();

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

$ns.drawNatalChart = function (ctx) {
	ctx.save();

	// Clear out the chartcanvas for multiple executions
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	ctx.clearRect(0, 0, 2*chartcanvas.width, 2*chartcanvas.height);

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
		ctx.lineTo(middleCircleRadius, 0);
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

};

// Draw the transiting planet locations, tick marks and transit lines
$ns.drawTransitPlanets = function (circleRadius) {
	var ctx = document.getElementById('transitcanvas').getContext('2d');

	var planetGlyphX, planetGlyphY;
	var signGlyphX, signGlyphY;
	var planetX, planetY;
	var innerX, innerY;
	var outerX, outerY;
	var signDegree;
	var planetSign;
	var tickStartX, tickStartY;
	var tickStopX, tickStopY;
	var innerTickStartX, innerTickStartY;
	var innerTickStopX, innerTickStopY;

	// Reset transform to the upper right-hand corner
	ctx.setTransform(1, 0, 0, 1, 0, 0);	 

	// Draw Planet Glpyhs and Degree lines
	// Go from the outside wheel to the inside circle
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
	
		// Draw the transiting planet degree line on inner circle
		ctx.lineWidth = 1;
		transitingPlanetX = Math.cos((180-($transitPlanets[key]))*Math.PI/180);
		transitingPlanetY = Math.sin((180-($transitPlanets[key]))*Math.PI/180);
		innerTickStartX = circleRadius * transitingPlanetX + (natalcanvas.width/2);
		innerTickStartY = circleRadius * transitingPlanetY + (natalcanvas.height/2);
		innerTickStopX = (circleRadius - 5) * transitingPlanetX + (natalcanvas.width/2);
		innerTickStopY = (circleRadius - 5) * transitingPlanetY + (natalcanvas.height/2);
		ctx.moveTo(innerTickStartX, innerTickStartY);
		ctx.lineTo(innerTickStopX, innerTickStopY);
		ctx.stroke();
	
		ctx.restore();
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

	var ctx = document.getElementById('transitcanvas').getContext('2d');
	var transitCtx = document.getElementById('transitcanvas').getContext('2d');

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

				transitingPlanetX = (circleRadius - 4 - conjunctRadius) * Math.cos((180-($transitPlanets[transitKey]))*Math.PI/180) + (transitcanvas.width/2);
        transitingPlanetY = (circleRadius - 4 - conjunctRadius) * Math.sin((180-($transitPlanets[transitKey]))*Math.PI/180) + (transitcanvas.height/2);
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
	ctx.restore();
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

	transitingPlanetX = Math.cos((180-($transitDegree))*Math.PI/180);
	transitingPlanetY = Math.sin((180-($transitDegree))*Math.PI/180);
	aspectLineStartX = (circleRadius) * transitingPlanetX + (transitcanvas.width/2);
	aspectLineStartY = (circleRadius) * transitingPlanetY + (transitcanvas.height/2);
	natalPlanetX = Math.cos((180-($natalDegree))*Math.PI/180);
	natalPlanetY = Math.sin((180-($natalDegree))*Math.PI/180);
	aspectLineStopX = circleRadius * natalPlanetX + (transitcanvas.width/2);
	aspectLineStopY = circleRadius * natalPlanetY + (transitcanvas.height/2);
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

// Draw the transiting planet locations, tick marks and transit lines
$ns.drawNatalPlanets = function (ctx, biwheel) {
	var planetGlyphX, planetGlyphY;
	var signGlyphX, signGlyphY;
	var planetX, planetY;
	var innerX, innerY;
	var outerX, outerY;
	var signDegree;
	var planetSign;
	var tickStartX, tickStartY;
	var tickStopX, tickStopY;
	var planetGlyphRadius;
	var degreeRadius;
	var signGlyphRadius;
	var circleRadius;
		
	// Move the 0,0 point to the center of the chartcanvas
	ctx.translate(natalcanvas.width/2, natalcanvas.height/2);
	
	if (biwheel) {
		// For the biwheel, draw the Sign Cusps marks from middle circle to inner circle & inner circle
		ctx.save();
		ctx.lineWidth = 0.75;
		for (var i = 0; i < 12; i++) {
			ctx.beginPath();
			ctx.rotate(Math.PI / 6);
			ctx.moveTo(middleCircleRadius, 0);
			ctx.lineTo(innerCircleRadius, 0);
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
		planetGlyphRadius = 125;
		degreeRadius = 108;
		signGlyphRadius = 93;
		circleRadius = innerCircleRadius;
	} else {
		// There's no biwheel and so place natal planets on the outer wheel
		planetGlyphRadius = 185;
		degreeRadius = 168;
		signGlyphRadius = 153;
		circleRadius = middleCircleRadius;
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);

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
		planetGlyphX = planetGlyphRadius * planetX + (natalcanvas.width/2) - 10;
		planetGlyphY = planetGlyphRadius * planetY + (natalcanvas.height/2) - 10;
		ctx.drawImage(planetImageArray[key],planetGlyphX,planetGlyphY, 20, 20);
		
		// Place degree of natal planet
		degreeX = degreeRadius * planetX + (natalcanvas.width/2);
		degreeY = degreeRadius * planetY + (natalcanvas.height/2); 
		signDegree = Math.floor($natalPlanets[key] % 30);
		ctx.fillText(signDegree+String.fromCharCode(0x00B0), degreeX-7, degreeY+5);
	
		// Place glyph of natal planet's sign
		signGlyphX = signGlyphRadius * planetX + (natalcanvas.width/2);
		signGlyphY = signGlyphRadius * planetY + (natalcanvas.height/2); 
		planetSign = Math.floor($natalPlanets[key] / 30);
		ctx.drawImage(signImageArray[planetSign],signGlyphX-7,signGlyphY-7, 14, 14);
	
		// Draw the natal planet degree line on inner circle
		ctx.lineWidth = 1;
		tickStartX = circleRadius * planetX + (natalcanvas.width/2);
		tickStartY = circleRadius * planetY + (natalcanvas.height/2);
		tickStopX = (circleRadius + 5) * planetX + (natalcanvas.width/2);
		tickStopY = (circleRadius + 5) * planetY + (natalcanvas.height/2);
		ctx.moveTo(tickStartX, tickStartY);
		ctx.lineTo(tickStopX, tickStopY);
		ctx.stroke();
		
		ctx.restore();

	};

	// Label the Inner Wheel Natal Chart
	ctx.font = "12px Arial";
	if (biwheel) {	
		ctx.fillText("Inner Wheel / Natal Chart", 0, 14);
	} else {
		ctx.fillText("Natal Chart", 0, 14);
	}
	ctx.fillText(monthtext[$natalInputDate.month]+" "+$natalInputDate.day+", "+$natalInputDate.year, 0, 28);
  $e.calculateLeadingZeros($natalInputDate);
	ctx.fillText(leadingZero[0]+$natalInputDate.hours+":"+leadingZero[1]+$natalInputDate.minutes+":"+leadingZero[0]+$natalInputDate.seconds+" GMT", 0, 42);
	ctx.fill();

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
		pluto: 1	
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

// TODO: Add in the northnode, ascendent, and midheaven = 3 once I can calculate those values
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

// TODO: Add in the northnode, ascendent, and midheaven = 3 once I can calculate those values
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

	var ctx = document.getElementById('natalchartcanvas').getContext('2d');
	
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

				transitingPlanetX = (circleRadius - 4 - conjunctRadius) * Math.cos((180-($natalPlanets[aspectKey]))*Math.PI/180) + (transitcanvas.width/2);
        transitingPlanetY = (circleRadius - 4 - conjunctRadius) * Math.sin((180-($natalPlanets[aspectKey]))*Math.PI/180) + (transitcanvas.height/2);
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
      
  // Draw the aspect grid
  // TODO: change x to 14 and y to 13 once I have the node, ascendent and midheaven
  ctx.translate(gridWidth-6,363+gridWidth);
	ctx.strokeStyle = "#000000";  
	for (var x = 0; x < 11; x++) {
		y = x;
		for (var y; y < 10; y++) {	
	    ctx.save();
		  ctx.beginPath();
		  ctx.moveTo(x*gridWidth, y*gridWidth);
			ctx.strokeRect(x*gridWidth, y*gridWidth, gridWidth, gridWidth);
			ctx.restore();
		}
	}

	// Draw the planet glpyhs onto the aspect grid
	i = 0;
	for (var natalKey in aspectOrder) {
		planetSign = Math.floor($natalPlanets[natalKey] / 30);

	  if (natalKey == "moon") {
		  ctx.drawImage(planetImageArray[natalKey], 4, -24, 20, 20);
	  } else {
			ctx.drawImage(planetImageArray[natalKey], -22, i*gridWidth+4, 20, 20);
			ctx.drawImage(planetImageArray[natalKey], (i+1)*gridWidth+4, i*gridWidth+4, 20, 20);
			i++;
		}
	}

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
	var planetSign;
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
	var elementColor = ["red", "green", "yellow", "blue"];
	var modeColor = ["red", "green", "blue"];

	// Calculate the element and mode count
	for (var planetKey in elementalWeight) {
		planetSign = Math.floor($natalPlanets[planetKey]/30);
		planetElement[planetKey] = planetSign % 4;
		planetMode[planetKey] = planetSign % 3;
		elementCount[planetElement[planetKey]] = elementCount[planetElement[planetKey]] + elementalWeight[planetKey];
		modeCount[planetMode[planetKey]] = modeCount[planetMode[planetKey]] + elementalWeight[planetKey];
  }
  console.log(modeCount);

  // Draw Element score bars
	for (var i = 0; i < 4; i++) {
		ctx.fillStyle = elementColor[i];
	  ctx.fillRect(0, 0+(i*26), -8*elementCount[i], -22);
	}

  // Draw Mode score bars
	for (var i = 0; i < 3; i++) {
		ctx.fillStyle = modeColor[i];
	  ctx.fillRect(0, 115+(i*25), -8*modeCount[i], -22);
	}
	
	// Plot the planet glyphs next to the appropriate element and mode
	// Y value for Fire = -18, Earth = 8, Air = 34, Water = 60
	// Y value for Cardinal = 97, Fixed = 122, Mutable = 147
	i=0;
	ctx.lineWidth = 3;
	for (var planetKey in elementalWeight) {
		// Draw the planet next to it's element
		ctx.drawImage(planetImageArray[planetKey], -182+(elementIncrement[planetElement[planetKey]]*15), -18+(planetElement[planetKey]*26), 15, 15);

		// Draw a line color-coded to the planet's mode
		ctx.beginPath();
		ctx.strokeStyle = modeColor[planetMode[planetKey]];
		ctx.moveTo(-182+(elementIncrement[planetElement[planetKey]]*15)+1, -18+(planetElement[planetKey]*26+18
	));
		ctx.lineTo(-182+(elementIncrement[planetElement[planetKey]]*15)+14, -18+(planetElement[planetKey]*26+18));
		ctx.stroke();
	
		elementIncrement[planetElement[planetKey]]++;

		// Draw the planet next to it's mode
		ctx.drawImage(planetImageArray[planetKey], -95+(modeIncrement[planetMode[planetKey]]*12), 97+(planetMode[planetKey]*25), 12, 12);

		// Draw a line color-coded to the planet's element
		ctx.beginPath();
		ctx.strokeStyle = elementColor[planetElement[planetKey]];
		ctx.moveTo(-95+(modeIncrement[planetMode[planetKey]]*12)+1, 97+(planetMode[planetKey]*25)+14);
		ctx.lineTo(-95+(modeIncrement[planetMode[planetKey]]*12)+10, 97+(planetMode[planetKey]*25)+14);
		ctx.stroke();
		
		modeIncrement[planetMode[planetKey]]++;
		i++;
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);	 
};