// Draw a 90-degree graphical ephemeris after calculating 7 months of outer planet positions
$ns.drawEphemeris = function () {
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
  //console.log($natalPlanets);

};

