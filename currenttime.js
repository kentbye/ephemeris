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
    var yeargenerate = function(max){
          do{
            yearselect.add(new Option(year++, max--), null);}
            while(max>0);
          }(5);

    // Calculate the current positions of the planets
    $e.calculatedTime ();

};
