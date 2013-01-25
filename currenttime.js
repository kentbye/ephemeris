$ns.currenttime = function () {
    var currentTime = new Date();
    var year = currentTime.getUTCFullYear();
    var month = currentTime.getUTCMonth() + 1;
    var day = currentTime.getUTCDate();
    var hours = currentTime.getUTCHours();
    var minutes = currentTime.getUTCMinutes();
    var seconds = currentTime.getUTCSeconds();
    var defaultNatalYear;
    var monthtext=['Zero','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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

    var leadingZero = "";

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

    // Populate the Day Dropdown
    for(var i=1; i<32; i++) {
        var dayOption = document.createElement("option");
        dayOption.textContent = i;
        dayOption.value = i;
        transitdayfield.appendChild(dayOption);
        var natalDayOption = document.createElement("option");
        natalDayOption.textContent = i;
        natalDayOption.value = i;
        nataldayfield.appendChild(natalDayOption);
    }
    transitdayfield.value = day;

    // Populate the Year Dropdown
    for(var i = year + 100; i > 1899 ; i--) {
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

    // Set the default natal year to a reasonable year, otherwise there is a lot of scrolling
    defaultNatalYear = getCookieValue("natalyear");
    if (defaultNatalYear) {
      natalmonthfield.value = getCookieValue("natalmonth");
      nataldayfield.value = getCookieValue("natalday");
      natalyearfield.value = defaultNatalYear;
      natalhourfield.value = getCookieValue("natalhours");
      natalminutefield.value = getCookieValue("natalminutes");
      natalsecondfield.value = getCookieValue("natalseconds");
    } else {
      natalmonthfield.value = 1;
      nataldayfield.value = 1;
      natalyearfield.value = 1970;
      natalhourfield.value = 0;
      natalminutefield.value = 0;
      natalsecondfield.value = 0;
    }

    // Calculate the current positions of the planets
    var setCookieFlag = false;
    var $natalPlanets;
    $natalPlanets = $e.calculatedTime (setCookieFlag);
    
    // Draw the current time on the ephemeris
    $e.drawEphemeris ($natalPlanets);

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