var monthtext=['Zero','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

$ns.currenttimeTimelord = function (sourcePageFlag) {
    var currentTime = new Date();
    var year = currentTime.getUTCFullYear();
    var month = currentTime.getUTCMonth() + 1;
    var day = currentTime.getUTCDate();
    var hours = currentTime.getUTCHours();
    var minutes = currentTime.getUTCMinutes();
    var seconds = currentTime.getUTCSeconds();
    var areCookiesSet;
    var transitmonthfield = document.getElementById("transitmonthfield")
    var transitdayfield = document.getElementById("transitdayfield")
    var transityearfield = document.getElementById("transityearfield");
    var transithourfield = document.getElementById("transithourfield");
    var transitminutefield = document.getElementById("transitminutefield");
    var transitsecondfield = document.getElementById("transitsecondfield");
    var natalmonthfield = document.getElementById("natalmonthfield")
    var nataldayfield = document.getElementById("nataldayfield")
    var natalyearfield = document.getElementById("natalyearfield");
    var natalhourfield = document.getElementById("natalhourfield");
    var natalminutefield = document.getElementById("natalminutefield");
    var natalsecondfield = document.getElementById("natalsecondfield");
    var housesystem = document.getElementById("housesystem");
    var unknowntimeCheckBox = document.getElementById("unknowntime");
    var city = document.getElementById("city");
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");

    var leadingZero = "";

		// HIDE Form elements
		housesystem.style.visibility = "hidden";
		unknowntimeCheckBox.style.visibility = "hidden";
/* 		city.style.visibility = "hidden"; */
		latitude.style.visibility = "hidden";
		longitude.style.visibility = "hidden";
//		transitmonthfield.style.visibility = "hidden";
//		transitdayfield.style.visibility = "hidden";
//		transityearfield.style.visibility = "hidden";
		transithourfield.style.visibility = "hidden";
		transitminutefield.style.visibility = "hidden";
		transitsecondfield.style.visibility = "hidden";
	
	  // Populate the releasing & fortune sign dropdown
	  var releasingFromSign = document.getElementById("releasingfrom");
	  var fortuneSign = document.getElementById("fortune");
	  for(var i=1; i<13; i++) {
	      var signOption = document.createElement("option");
	      signOption.textContent = signNames[i];
	      signOption.value = i;
	      releasingFromSign.appendChild(signOption);
	      var fortuneSignOption = document.createElement("option");
	      fortuneSignOption.textContent = signNames[i];
	      fortuneSignOption.value = i;
	      fortuneSign.appendChild(fortuneSignOption);	      
	  }

	  var chartSect = document.getElementById("chartsect");
	  var sectOptions = Array();
	  sectOptions[1] = "Day Chart";
	  sectOptions[2] = "Night Chart";
	  for(var i=1; i<3; i++) {
	      var sectOption = document.createElement("option");
	      sectOption.textContent = sectOptions[i];
	      sectOption.value = i;
	      chartSect.appendChild(sectOption);
	  }
	  
    // Populate the month dropdown
    for(var i=1; i<13; i++) {
        var monthOption = document.createElement("option");
        monthOption.textContent = monthtext[i];
        monthOption.value = i;
        transitmonthfield.appendChild(monthOption);
        var natalMonthOption = document.createElement("option");
        natalMonthOption.textContent = monthtext[i];
        natalMonthOption.value = i;
        natalmonthfield.appendChild(natalMonthOption);
    }
    transitmonthfield.value = month;

    leadingZero = "0";
    // Populate the Day Dropdown
    for(var i=1; i<32; i++) {
        var dayOption = document.createElement("option");
        if(i>9) leadingZero = "";
        dayOption.textContent = leadingZero + i;
        dayOption.value = i;
        transitdayfield.appendChild(dayOption);
        var natalDayOption = document.createElement("option");
        natalDayOption.textContent = leadingZero + i;
        natalDayOption.value = i;
        nataldayfield.appendChild(natalDayOption);
    }
    transitdayfield.value = day;

    // Populate the Year Dropdown
    for(var i = 1900; i < 2101 ; i++) {
        var yearOption = document.createElement("option");
        yearOption.textContent = i;
        yearOption.value = i;
        transityearfield.appendChild(yearOption);
        var natalYearOption = document.createElement("option");
        natalYearOption.textContent = i;
        natalYearOption.value = i;
        natalyearfield.appendChild(natalYearOption);
    }
    transityearfield.value = year;

    // Populate the Hour Dropdown
    leadingZero = "0";
    for(var i=0; i<24; i++) {
        var hourOption = document.createElement("option");
        if(i>9) leadingZero = "";
        hourOption.textContent = leadingZero + i;
        hourOption.value = i;
        transithourfield.appendChild(hourOption);
        var natalHourOption = document.createElement("option");
        natalHourOption.textContent = leadingZero + i;
        natalHourOption.value = i;
        natalhourfield.appendChild(natalHourOption);
    }
    transithourfield.value = hours;

    // Populate the Minute Dropdown
    leadingZero = "0";
    for(var i=0; i<60; i++) {
        var minuteOption = document.createElement("option");
        if(i>9) leadingZero = "";
        minuteOption.textContent = leadingZero + i;
        minuteOption.value = i;
        transitminutefield.appendChild(minuteOption);
        var natalMinuteOption = document.createElement("option");
        natalMinuteOption.textContent = leadingZero + i;
        natalMinuteOption.value = i;
        natalminutefield.appendChild(natalMinuteOption);
    }
    transitminutefield.value = minutes;

    // Populate the Second Dropdown
    leadingZero = "0";
    for(var i=0; i<60; i++) {
        var secondOption = document.createElement("option");
        if(i>9) leadingZero = "";
        secondOption.textContent = leadingZero + i;
        secondOption.value = i;
        transitsecondfield.appendChild(secondOption);
        var natalSecondOption = document.createElement("option");
        natalSecondOption.textContent = leadingZero + i;
        natalSecondOption.value = i;
        natalsecondfield.appendChild(natalSecondOption);
    }
    transitsecondfield.value = seconds;
    
    // Populate the House System
    var houseOption1 = document.createElement("option");
    houseOption1.text = "Placidus";
    houseOption1.value = 'P';
    housesystem.options.add(houseOption1);
    var houseOption2 = document.createElement("option");
    houseOption2.text = "Porphyry";
    houseOption2.value = 'O';
    housesystem.options.add(houseOption2);
    var houseOption3 = document.createElement("option");
    houseOption3.text = "Koch";
    houseOption3.value = 'K';
    housesystem.options.add(houseOption3);
    var houseOption4 = document.createElement("option");
    houseOption4.text = "Whole Sign";
    houseOption4.value = 'W';
    housesystem.options.add(houseOption4);
    housesystem.value = 'P';

    // Change this flag to the latest cookies added, otherwise Chrome will give a TypeError
    areCookiesSet = getCookieValue("natalyear");

    // If cookies are set, then populate the text fields with the saved values
    if (areCookiesSet) {
      natalmonthfield.value = getCookieValue("natalmonth");
      nataldayfield.value = getCookieValue("natalday");
      natalyearfield.value = getCookieValue("natalyear");
      natalhourfield.value = getCookieValue("natalhours");
      natalminutefield.value = getCookieValue("natalminutes");
      natalsecondfield.value = getCookieValue("natalseconds");
      housesystem.value = getCookieValue("housesystem");
      releasingFromSign.value = getCookieValue("releasingfrom");
      fortuneSign.value = getCookieValue("fortune");
      chartSect.value = getCookieValue("chartsect");
      var timeFlag = getCookieValue("unknowntime");
      if (timeFlag == 'true') {
      	unknowntimeCheckBox.checked = true;
      } else {
	      unknowntimeCheckBox.checked = false;
      }
/*       city.value = getCookieValue("citystate"); */
      latitude.value = getCookieValue("latitude");
      longitude.value = getCookieValue("longitude");

    } else {
      natalmonthfield.value = 1;
      nataldayfield.value = 1;
      natalyearfield.value = 1970;
      natalhourfield.value = 0;
      natalminutefield.value = 0;
      natalsecondfield.value = 0;
      releasingFromSign.value = 1;
      fortuneSign.value = 1;
      chartSect.value = 1;


      // Set the default house system to Placidus
      housesystem.value = 'W';
      unknowntimeCheckBox.checked = false;
/*       city.value = ""; */
      // Set a default Lat/Long of New York City
      latitude.value = "";
      longitude.value = "";
    }

    // Calculate the current positions of the planets
    var setCookieFlag = false; // Don't need to set the cookie on initial page load
    var initialRenderingFlag = true; // Go ahead and plot the natal chart and natal planets
    // Look at the moonFlag variable input into the currenttime function. It's set to TRUE on the moon.html page and false on the index.html page
    if (sourcePageFlag == "timelord"){
	    $natalPlanets = $e.calculateTimeLord (setCookieFlag, initialRenderingFlag);
    }
};

function getCookieValue(key) {
  currentcookie = document.cookie;
  if (currentcookie.length > 0) {
    firstidx = currentcookie.indexOf(key + "=");
    if (firstidx != -1) {
      firstidx = firstidx + key.length + 1;
      lastidx = currentcookie.indexOf(";",firstidx);
      if (lastidx == -1) {
          lastidx = currentcookie.length;
      }
      return unescape(currentcookie.substring(firstidx, lastidx));
    }
  }
  return "";
}