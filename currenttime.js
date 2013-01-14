$ns.currenttime = function () {
    var currentTime = new Date();
    var year = currentTime.getUTCFullYear();
    var month = currentTime.getUTCMonth() + 1;
    var day = currentTime.getUTCDate();
    var hours = currentTime.getUTCHours();
    var minutes = currentTime.getUTCMinutes();
    var seconds = currentTime.getUTCSeconds();
    var monthfield = document.getElementById("monthfield")
    var monthtext=['Zero','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    var dayfield = document.getElementById("dayfield")
    var yearfield = document.getElementById("yearfield");
    var hourfield = document.getElementById("hourfield");
    var minutefield = document.getElementById("minutefield");
    var secondfield = document.getElementById("secondfield");
    var leadingZero = "";

    // Populate the month dropdown
    for(var i=1; i<13; i++) {
        var monthOption = document.createElement("option");
        monthOption.textContent = monthtext[i];
        monthOption.value = i;
        monthfield.appendChild(monthOption);
    }
    monthfield.value = month;

    // Populate the Day Dropdown
    for(var i=1; i<32; i++) {
        var dayOption = document.createElement("option");
        dayOption.textContent = i;
        dayOption.value = i;
        dayfield.appendChild(dayOption);
    }
    dayfield.value = day;

    // Populate the Year Dropdown
    for(var i = year + 10; i > 1899 ; i--) {
        var yearOption = document.createElement("option");
        yearOption.textContent = i;
        yearOption.value = i;
        yearfield.appendChild(yearOption);
    }
    yearfield.value = year;

    // Populate the Hour Dropdown
    leadingZero = "0";
    for(var i=0; i<24; i++) {
        var hourOption = document.createElement("option");
        if(i>9) leadingZero = "";
        hourOption.textContent = leadingZero + i;
        hourOption.value = i;
        hourfield.appendChild(hourOption);
    }
    hourfield.value = hours;

    // Populate the Minute Dropdown
    leadingZero = "0";
    for(var i=0; i<60; i++) {
        var minuteOption = document.createElement("option");
        if(i>9) leadingZero = "";
        minuteOption.textContent = leadingZero + i;
        minuteOption.value = i;
        minutefield.appendChild(minuteOption);
    }
    minutefield.value = minutes;

    // Populate the Second Dropdown
    leadingZero = "0";
    for(var i=0; i<60; i++) {
        var secondOption = document.createElement("option");
        if(i>9) leadingZero = "";
        secondOption.textContent = leadingZero + i;
        secondOption.value = i;
        secondfield.appendChild(secondOption);
    }
    secondfield.value = seconds;
    
    // Calculate the current positions of the planets
    $e.calculatedTime ();

};
