$ns.currenttime = function () {
	var textAreas = document.body.getElementsByTagName ('textarea');

    var currentTime = new Date();
    var year = currentTime.getUTCFullYear();
    var month = currentTime.getUTCMonth() + 1;
    var day = currentTime.getUTCDate();
    var hours = currentTime.getUTCHours();
    var minutes = currentTime.getUTCMinutes();
    var seconds = currentTime.getUTCSeconds();

    document.getElementById("$const.date").innerHTML = day + "." + month + "." + year + " " + hours+":"+minutes+":"+seconds;

    // Populate the Current Date into Dropdowns
    var yearselect = document.getElementById("year"), year;
    
    for(var i = year + 10; i > 1899 ; i--) {
        var yr = document.createElement("option");
        yr.textContent = i;
        yr.value = i;
        yearselect.appendChild(yr);
    }

    // Calculate the current positions of the planets
    $e.calculatedTime ();

};
