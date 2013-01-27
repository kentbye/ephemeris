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
    stopDate.setMonth(stopDate.getMonth() + 1);
  }
  
  // Tthe total number of days across a 7-month period ranges from 212-215. Used to calculate graph width
  daysDelta = monthMarker[7];
  
  var marsEphemerisData = new Array();
  var jupiterEphemerisData = new Array();
  var saturnEphemerisData = new Array();
  var chironEphemerisData = new Array();
  var saturnEphemerisData = new Array();
  var uranusEphemerisData = new Array();
  var neptuneEphemerisData = new Array();
  var plutoEphemerisData = new Array();

  var marsEphemerisRawData = new Array();
  var jupiterEphemerisRawData = new Array();
  var saturnEphemerisRawData = new Array();
  var chironEphemerisRawData = new Array();
  var saturnEphemerisRawData = new Array();
  var uranusEphemerisRawData = new Array();
  var neptuneEphemerisRawData = new Array();
  var plutoEphemerisRawData = new Array();
  
  // Gather the ephemeris data for the two previous months, current month and subsequent 4 months
	$processor.init ();
  var ephemerisPlanets;
  var natalY;
  for (var i = 0; i < daysDelta; i++) {
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
		$const.body = $moshier.body['mars'];
	  $processor.calc ($inputDate, $const.body);
	  
	  // Store the data as mod 90, convert to pixels (8 pixels per degree), round to 2 decimal places
	  marsEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  marsEphemerisRawData[i] = parseFloat($const.body.position.apparentLongitude);
	  
	  $const.body = $moshier.body['jupiter'];
	  $processor.calc ($inputDate, $const.body);
	  jupiterEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  jupiterEphemerisRawData[i] = parseFloat($const.body.position.apparentLongitude);

	  $const.body = $moshier.body['saturn'];
	  $processor.calc ($inputDate, $const.body);
	  saturnEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  saturnEphemerisRawData[i] = parseFloat($const.body.position.apparentLongitude);

	  $const.body = $moshier.body['chiron'];
	  $processor.calc ($inputDate, $const.body);
	  chironEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  chironEphemerisRawData[i] = parseFloat($const.body.position.apparentLongitude);;

	  $const.body = $moshier.body['uranus'];
	  $processor.calc ($inputDate, $const.body);
	  uranusEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  uranusEphemerisRawData[i] = parseFloat($const.body.position.apparentLongitude);

	  $const.body = $moshier.body['neptune'];
	  $processor.calc ($inputDate, $const.body);
	  neptuneEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  neptuneEphemerisRawData[i] = parseFloat($const.body.position.apparentLongitude);

	  $const.body = $moshier.body['pluto'];
	  $processor.calc ($inputDate, $const.body);
	  plutoEphemerisData[i] = Math.round((parseFloat($const.body.position.apparentLongitude) % 90) * 800)/100;
	  plutoEphemerisRawData[i] = parseFloat($const.body.position.apparentLongitude);
	  
	}
	
	var ctx = document.getElementById('ephemeriscanvas').getContext('2d');
  // Clear out the chartcanvas for multiple executions
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, ephemeriscanvas.width, ephemeriscanvas.height);
	
/*
		// Draw Debugging Grid marks every 10 units
  ctx.save();
  ctx.lineWidth = 0.25;
  for (var i = 0; i < ephemeriscanvas.height/10+1; i++) {
    ctx.beginPath();
    ctx.moveTo(10*i, 0);
    ctx.lineTo(10*i, ephemeriscanvas.height);
    ctx.stroke();
    ctx.moveTo(0, 10*i);
    ctx.lineTo(ephemeriscanvas.width, 10*i);
    ctx.stroke();

  }
  ctx.restore();

  // Draw Debugging Grid marks every 50 units
  ctx.save();
  ctx.lineWidth = 0.5;
  for (var i = 0; i < ephemeriscanvas.height/50+1; i++) {
    ctx.beginPath();
    ctx.moveTo(50*i, 0);
    ctx.lineTo(50*i, ephemeriscanvas.height);
    ctx.stroke();
    ctx.moveTo(0, 50*i);
    ctx.lineTo(ephemeriscanvas.width, 50*i);
    ctx.stroke();
  }
  ctx.restore();
*/
	
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
    ctx.fillText(monthtext[monthLabel[i]+1], monthMarker[i]*1.75 + 15, -20);
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
		
	// Draw Mars Ephemeris Data
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = $planetColor['mars'];
  var dayXPosition = 0;
  ctx.beginPath();
  ctx.moveTo(dayXPosition-7, marsEphemerisData[0]);  
  for (var i = 1; i < daysDelta; i++) {
    dayXPosition = i * 1.75;
    if(marsEphemerisData[i]-marsEphemerisData[i-1] > -50) {
		  ctx.lineTo(dayXPosition, marsEphemerisData[i]);
		} else {
		  // The planet is moving into a cardinal sign. Move the Line
			ctx.moveTo(dayXPosition-1.75, 0);
			ctx.lineTo(dayXPosition, marsEphemerisData[i]);

			// Place the glyph and sign on top
			ctx.drawImage(planetImageArray['mars'], dayXPosition-7, -17, 14, 14);
			planetSign = Math.floor(marsEphemerisRawData[i] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+7, -17, 14, 14);

			// Place the glyph and sign on bottom
			ctx.drawImage(planetImageArray['mars'], dayXPosition-8.75, 723, 14, 14);
			planetSign = Math.floor(marsEphemerisRawData[i-1] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+8.75, 723, 14, 14);						
		}
	}
	ctx.stroke();
  ctx.drawImage(planetImageArray['mars'], -20, marsEphemerisData[0]-7, 14, 14);
	planetSign = Math.floor(marsEphemerisRawData[0] / 30);
  ctx.drawImage(signImageArray[planetSign],-20 -14 -2, marsEphemerisData[0]-7, 14, 14);

	// Draw Jupiter Ephemeris Data
  ctx.strokeStyle = $planetColor['jupiter'];
  dayXPosition = 0;
  ctx.beginPath();
  ctx.moveTo(dayXPosition-7, jupiterEphemerisData[0]);
  for (var i = 1; i < daysDelta; i++) {
    dayXPosition = i * 1.75;
    if(jupiterEphemerisData[i]-jupiterEphemerisData[i-1] > -50) {
		  ctx.lineTo(dayXPosition, jupiterEphemerisData[i]);
		} else {
			ctx.moveTo(dayXPosition-1.75, 0);
			ctx.lineTo(dayXPosition, jupiterEphemerisData[i]);

			// Place the glyph and sign on top
			ctx.drawImage(planetImageArray['jupiter'], dayXPosition-7, -17, 14, 14);
			planetSign = Math.floor(jupiterEphemerisRawData[i] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+7, -17, 14, 14);

			// Place the glyph and sign on bottom
			ctx.drawImage(planetImageArray['jupiter'], dayXPosition-8.75, 723, 14, 14);
			planetSign = Math.floor(jupiterEphemerisRawData[i-1] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+8.75, 723, 14, 14);						
		}
	}
	ctx.stroke();
  ctx.drawImage(planetImageArray['jupiter'], -20, jupiterEphemerisData[0]-7, 14, 14);
	planetSign = Math.floor(jupiterEphemerisRawData[0] / 30);
  ctx.drawImage(signImageArray[planetSign],-20 -14 -2, jupiterEphemerisData[0]-7, 14, 14);
	
	// Draw Saturn Ephemeris Data
  ctx.strokeStyle = $planetColor['saturn'];
  dayXPosition = 0;
  ctx.beginPath();
  ctx.moveTo(dayXPosition-7, saturnEphemerisData[0]);
  for (var i = 1; i < daysDelta; i++) {
    dayXPosition = i * 1.75;
    if(saturnEphemerisData[i]-saturnEphemerisData[i-1] > -50) {
		  ctx.lineTo(dayXPosition, saturnEphemerisData[i]);
		} else {
			ctx.moveTo(dayXPosition-1.75, 0);
			ctx.lineTo(dayXPosition, saturnEphemerisData[i]);
			
			// Place the glyph and sign on top
			ctx.drawImage(planetImageArray['saturn'], dayXPosition-7, -17, 14, 14);
			planetSign = Math.floor(saturnEphemerisRawData[i] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+7, -17, 14, 14);

			// Place the glyph and sign on bottom
			ctx.drawImage(planetImageArray['saturn'], dayXPosition-8.75, 723, 14, 14);
			planetSign = Math.floor(saturnEphemerisRawData[i-1] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+8.75, 723, 14, 14);						

		}
	}
	ctx.stroke();
	ctx.drawImage(planetImageArray['saturn'], -20, saturnEphemerisData[0]-7, 14, 14);
	planetSign = Math.floor(saturnEphemerisRawData[0] / 30);
  ctx.drawImage(signImageArray[planetSign],-20 -14 -2, saturnEphemerisData[0]-7, 14, 14);

	// Draw Chiron Ephemeris Data
  ctx.strokeStyle = $planetColor['chiron'];
  dayXPosition = 0;
  ctx.beginPath();
  ctx.moveTo(dayXPosition-7, chironEphemerisData[0]);
  for (var i = 1; i < daysDelta; i++) {
    dayXPosition = i * 1.75;
    if(chironEphemerisData[i]-chironEphemerisData[i-1] > -50) {
		  ctx.lineTo(dayXPosition, chironEphemerisData[i]);
		} else {
			ctx.moveTo(dayXPosition-1.75, 0);
			ctx.lineTo(dayXPosition, chironEphemerisData[i]);
			
			// Place the glyph and sign on top
			ctx.drawImage(planetImageArray['chiron'], dayXPosition-7, -17, 14, 14);
			planetSign = Math.floor(chironEphemerisRawData[i] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+7, -17, 14, 14);

			// Place the glyph and sign on bottom
			ctx.drawImage(planetImageArray['chiron'], dayXPosition-8.75, 723, 14, 14);
			planetSign = Math.floor(chironEphemerisRawData[i-1] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+8.75, 723, 14, 14);	
		}
	}
	ctx.stroke();
	ctx.drawImage(planetImageArray['chiron'], -20, chironEphemerisData[0]-7, 14, 14);
	planetSign = Math.floor(chironEphemerisRawData[0] / 30);
  ctx.drawImage(signImageArray[planetSign],-20 -14 -2, chironEphemerisData[0]-7, 14, 14);

	// Draw Uranus Ephemeris Data
  ctx.strokeStyle = $planetColor['uranus'];
  dayXPosition = 0;
  ctx.beginPath();
  ctx.moveTo(dayXPosition-7, uranusEphemerisData[0]);
  for (var i = 1; i < daysDelta; i++) {
    dayXPosition = i * 1.75;
    if(uranusEphemerisData[i]-uranusEphemerisData[i-1] > -50) {
		  ctx.lineTo(dayXPosition, uranusEphemerisData[i]);
		} else {
			ctx.moveTo(dayXPosition-1.75, 0);
			ctx.lineTo(dayXPosition, uranusEphemerisData[i]);
			
			// Place the glyph and sign on top
			ctx.drawImage(planetImageArray['uranus'], dayXPosition-7, -17, 14, 14);
			planetSign = Math.floor(uranusEphemerisRawData[i] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+7, -17, 14, 14);

			// Place the glyph and sign on bottom
			ctx.drawImage(planetImageArray['uranus'], dayXPosition-8.75, 723, 14, 14);
			planetSign = Math.floor(uranusEphemerisRawData[i-1] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+8.75, 723, 14, 14);	
		}
	}
	ctx.stroke();
	ctx.drawImage(planetImageArray['uranus'], -20, uranusEphemerisData[0]-7, 14, 14);
	planetSign = Math.floor(uranusEphemerisRawData[0] / 30);
  ctx.drawImage(signImageArray[planetSign],-20 -14 -2, uranusEphemerisData[0]-7, 14, 14);

	// Draw Neptune Ephemeris Data
	ctx.strokeStyle = $planetColor['neptune'];
  dayXPosition = 0;
  ctx.beginPath();
  ctx.moveTo(dayXPosition-7, neptuneEphemerisData[0]);
  for (var i = 1; i < daysDelta; i++) {
    dayXPosition = i * 1.75;
    if(neptuneEphemerisData[i]-neptuneEphemerisData[i-1] > -50) {
		  ctx.lineTo(dayXPosition, neptuneEphemerisData[i]);
		} else {
			ctx.moveTo(dayXPosition-1.75, 0);
			ctx.lineTo(dayXPosition, neptuneEphemerisData[i]);
			
			// Place the glyph and sign on top
			ctx.drawImage(planetImageArray['neptune'], dayXPosition-7, -17, 14, 14);
			planetSign = Math.floor(neptuneEphemerisRawData[i] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+7, -17, 14, 14);

			// Place the glyph and sign on bottom
			ctx.drawImage(planetImageArray['neptune'], dayXPosition-8.75, 723, 14, 14);
			planetSign = Math.floor(neptuneEphemerisRawData[i-1] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+8.75, 723, 14, 14);	
		}
	}
	ctx.stroke();
	ctx.drawImage(planetImageArray['neptune'], -20, neptuneEphemerisData[0]-7, 14, 14);
	planetSign = Math.floor(neptuneEphemerisRawData[0] / 30);
  ctx.drawImage(signImageArray[planetSign],-20 -14 -2, neptuneEphemerisData[0]-7, 14, 14);

	// Draw Pluto Ephemeris Data
	ctx.strokeStyle = $planetColor['pluto'];
  dayXPosition = 0;
  ctx.beginPath();
  ctx.moveTo(dayXPosition-7, plutoEphemerisData[0]);
  for (var i = 1; i < daysDelta; i++) {
    dayXPosition = i * 1.75;
    if(plutoEphemerisData[i]-plutoEphemerisData[i-1] > -50) {
		  ctx.lineTo(dayXPosition, plutoEphemerisData[i]);
		} else {
			ctx.moveTo(dayXPosition-1.75, 0);
			ctx.lineTo(dayXPosition, plutoEphemerisData[i]);
			
			// Place the glyph and sign on top
			ctx.drawImage(planetImageArray['pluto'], dayXPosition-7, -17, 14, 14);
			planetSign = Math.floor(plutoEphemerisRawData[i] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+7, -17, 14, 14);

			// Place the glyph and sign on bottom
			ctx.drawImage(planetImageArray['pluto'], dayXPosition-8.75, 723, 14, 14);
			planetSign = Math.floor(plutoEphemerisRawData[i-1] / 30);
			ctx.drawImage(signImageArray[planetSign],dayXPosition+8.75, 723, 14, 14);	
		}
	}
	ctx.stroke();
	ctx.drawImage(planetImageArray['pluto'], -20, plutoEphemerisData[0]-7, 14, 14);
	planetSign = Math.floor(plutoEphemerisRawData[0] / 30);
  ctx.drawImage(signImageArray[planetSign],-20 -14 -2, plutoEphemerisData[0]-7, 14, 14);
  ctx.restore();

	// Plot natal position lines & glyphs
	ctx.lineWidth = 1;
  for (var natalKey in $natalPlanets) {
	  ctx.strokeStyle = $planetColor[natalKey];
	  ctx.fillStyle = $planetColor[natalKey];
	  natalY = ($natalPlanets[natalKey]  % 90) * 8;
	  ctx.globalAlpha = 0.2;
	  ctx.beginPath();
	  ctx.fillRect(0,natalY-8,daysDelta*1.75,16);
	  ctx.fill();
	  ctx.globalAlpha = 1.0;
	  ctx.beginPath();
	  ctx.moveTo(0,natalY);
	  ctx.lineTo(daysDelta*1.75 + 10,natalY);
	  ctx.stroke();
	  ctx.drawImage(planetImageArray[natalKey], daysDelta*1.75 + 10, natalY-7, 14, 14);
	  planetSign = Math.floor($natalPlanets[natalKey] / 30);
		ctx.drawImage(signImageArray[planetSign],daysDelta*1.75 +10 +14 +2, natalY-7, 14, 14);
  }

  // Plot Current Day Line
  $e.drawCurrentDay();
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
