$ns.currenttime = function () {
	var textAreas = document.body.getElementsByTagName ('textarea');

    var currentTime = new Date();
    var year = currentTime.getUTCFullYear();
    var month = currentTime.getUTCMonth() + 1;
    var day = currentTime.getUTCDate();
    var hours = currentTime.getUTCHours();
    var minutes = currentTime.getUTCMinutes();
    var seconds = currentTime.getUTCSeconds();
    var milliseconds = currentTime.getUTCMilliseconds();

    document.getElementById("$const.date").innerHTML = day + "." + month + "." + year + " " + hours+":"+minutes+":"+seconds+"."+milliseconds;

    $e.calculatedTime ();

};
