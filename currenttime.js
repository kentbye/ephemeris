var monthtext=['Zero','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

$ns.currenttime = function (sourcePageFlag) {
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
    // var city = document.getElementById("city");
    var latitude = document.getElementById("latitude");
    var longitude = document.getElementById("longitude");

    var leadingZero = "";

    city.style.visibility = "hidden";

    // Use the URL parameters as input if present
    const queryString = window.location.search;
	  const urlParams = new URLSearchParams(queryString);
    const urlLat = parseFloat(urlParams.get('lat'));
    const urlLong = parseFloat(urlParams.get('long'));
    const urlYear = parseInt(urlParams.get('year'));
    const urlMonth = parseInt(urlParams.get('month'));
    const urlDay = parseInt(urlParams.get('day'));
    const urlHours = parseInt(urlParams.get('hour'));
	  const urlMinutes = parseInt(urlParams.get('minute'));
    const urlSeconds = parseInt(urlParams.get('second'));
    const urlYearTransit = parseInt(urlParams.get('t_year'));
    const urlMonthTransit = parseInt(urlParams.get('t_month'));
    const urlDayTransit = parseInt(urlParams.get('t_day'));
    const urlHoursTransit = parseInt(urlParams.get('t_hour'));
	  const urlMinutesTransit = parseInt(urlParams.get('t_minute'));
    const urlSecondsTransit = parseInt(urlParams.get('t_second'));


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
    
    // Populate the Year Dropdown
    for(var i = 1800; i < 2101 ; i++) {
        var yearOption = document.createElement("option");
        yearOption.textContent = i;
        yearOption.value = i;
        transityearfield.appendChild(yearOption);
        var natalYearOption = document.createElement("option");
        natalYearOption.textContent = i;
        natalYearOption.value = i;
        natalyearfield.appendChild(natalYearOption);
    }   

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
    

    // Fill in natal chart fields with URL parameters or defaults
    if (urlYear) {
        natalyearfield.value = urlYear;
    } else {
        natalyearfield.value = 1970;
    }
    if (urlMonth) {
        natalmonthfield.value = urlMonth;
    } else {
        natalmonthfield.value = 1;
    }
    if (urlDay) {
        nataldayfield.value = urlDay;
    } else {
        nataldayfield.value = 1;
    }

    if (urlHours || urlHours == 0) {
        natalhourfield.value = urlHours;
    } else {
        natalhourfield.value = 0;
    }
    if (urlMinutes || urlMinutes == 0) {
        natalminutefield.value = urlMinutes;
    } else {
        natalminutefield.value = 0;
    }
    if (urlSeconds || urlSeconds == 0) {
        natalsecondfield.value = urlSeconds;
    } else {
        natalsecondfield.value = 0;
    }	

    // Fill in transit chart fields with URL parameters or current time  
    if (urlYearTransit) {
        transityearfield.value = urlYearTransit;
    } else {
        transityearfield.value = year;
    }
    if (urlMonthTransit) {
        transitmonthfield.value = urlMonthTransit;
    } else {
        transitmonthfield.value = month;
    }
    if (urlDayTransit) {
        transitdayfield.value = urlDayTransit;
    } else {
        transitdayfield.value = day;
    }

    if (urlHoursTransit || urlHoursTransit == 0) {
        transithourfield.value = urlHoursTransit;
    } else {
        transithourfield.value = hours;
    }
    if (urlMinutesTransit || urlMinutesTransit == 0) {
        transitminutefield.value = urlMinutesTransit;
    } else {
        transitminutefield.value = minutes;
    }
    if (urlSecondsTransit || urlSecondsTransit == 0) {
        transitsecondfield.value = urlSecondsTransit;
    } else {
        transitsecondfield.value = seconds;
    }	

    // Change the house system if it was passed in the URL
    const urlHouse = urlParams.get('house');
    if (urlHouse) {
        housesystem.value = urlHouse;
    } else {
      housesystem.value = 'P';
    }

    // Change this flag to the latest cookies added, otherwise Chrome will give a TypeError
    areCookiesSet = getCookieValue("housesystem");
    // If cookies are set, then populate the text fields with the saved values
    if (areCookiesSet) {
      if (urlYear) {
        natalyearfield.value = urlYear;
      } else {
        natalyearfield.value = getCookieValue("natalyear");
      }
      if (urlMonth) {
        natalmonthfield.value = urlMonth;
      } else {
        natalmonthfield.value = getCookieValue("natalmonth");
      }
      if (urlDay) {
        nataldayfield.value = urlDay;
      } else {
        nataldayfield.value = getCookieValue("natalday");
      }

      if (urlHours || urlHours == 0) {
        natalhourfield.value = urlHours;
      } else {
        natalhourfield.value = getCookieValue("natalhours");
      }
      if (urlMinutes || urlMinutes == 0) {
        natalminutefield.value = urlMinutes;
      } else {
        natalminutefield.value = getCookieValue("natalminutes");
      }
      if (urlSeconds || urlSeconds == 0) {
        natalsecondfield.value = urlSeconds;
      } else {
        natalsecondfield.value = getCookieValue("natalseconds");
      }	
      
      if (urlHouse) {
        housesystem.value = urlHouse;
      } else {
        housesystem.value = getCookieValue("housesystem");
      }

      var timeFlag = getCookieValue("unknowntime");
      if (timeFlag == 'true') {
      	unknowntimeCheckBox.checked = true;
      } else {
	      unknowntimeCheckBox.checked = false;
      }
      //city.value = getCookieValue("citystate");
   
      if (urlLat) {
        latitude.value = urlLat;
      } else {
        latitude.value = getCookieValue("latitude");
      }
      if (urlLong) {
        longitude.value = urlLong;
      } else {
        longitude.value = getCookieValue("longitude");
      }

    } else {
      if (urlYear) {
        natalyearfield.value = urlYear;
      } else {
        natalyearfield.value = 1970;
      }
      if (urlMonth) {
        natalmonthfield.value = urlMonth;
      } else {
        natalmonthfield.value = 1;
      }
      if (urlDay) {
        nataldayfield.value = urlDay;
      } else {
        nataldayfield.value = 1;
      }

      if (urlHours || urlHours == 0) {
        natalhourfield.value = urlHours;
      } else {
        natalhourfield.value = 0;
      }
      if (urlMinutes || urlMinutes == 0) {
        natalminutefield.value = urlMinutes;
      } else {
        natalminutefield.value = 0;
      }
      if (urlSeconds || urlSeconds == 0) {
        natalsecondfield.value = urlSeconds;
      } else {
        natalsecondfield.value = 0;
      }	
      
      // Set the default house system to Whole Sign if there is no data
      if (urlHouse) {
        housesystem.value = urlHouse;
      } else {
        housesystem.value = 'P';
      }

      unknowntimeCheckBox.checked = false;
      //city.value = "";
      // Set a default Lat/Long of New York City
      if (urlLat) {
        latitude.value = urlLat;
      } else {
        latitude.value = "";
      }
      if (urlLong) {
        longitude.value = urlLong;
      } else {
        longitude.value = "";
      }
    }

    // Calculate the current positions of the planets
    var setCookieFlag = false; // Don't need to set the cookie on initial page load
    var initialRenderingFlag = true; // Go ahead and plot the natal chart and natal planets
    // Look at the moonFlag variable input into the currenttime function. It's set to TRUE on the moon.html page and false on the index.html page
    if (sourcePageFlag == "moon"){
	    $natalPlanets = $e.calculateMoon (setCookieFlag, initialRenderingFlag);
    } else if (sourcePageFlag == "index"){
    	$natalPlanets = $e.calculatedTime (setCookieFlag, initialRenderingFlag);
    } else if (sourcePageFlag == "timelord"){
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