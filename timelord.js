var $L1Date = new Array();
var $L2Date = new Array();
var $L1Sign = new Array();
var $L2Sign = new Array();
var L2StartDate = new Date();

// Calculate the Zodical Releasing Dates given an input date (and a starting time)
$ns.zodicalReleasing = function (inputDate) {
  console.log(inputDate);
  var utcSeconds = inputDate.epoch;
  var birthTime = new Date(0);
  var L2Counter = 1;
  birthTime.setUTCSeconds(utcSeconds);
  // TODO: Resolve the GMT to local timezone discrepancy
  // console.log(birthTime);
  
  // Set initial releasingSign manally for now
  // TODO: Take releasingSign as an input variable
  var releasingSign;
  releasingSign = 3;
        
  // Do first level calculations
  $L1Date[1] = new Date();
  $L1Date[1] = birthTime;
  $L1Sign[1] = releasingSign;
  // LOG
  // console.log("L1 BEGIN");
  // console.log("L1 " + $L1Sign[1] + " " + $L1Date[1]);


  // Calculate 10 L1 periods
  // TODO: Abstract this into a while loop, and set it to be 120 years after birth
  for (var x=2; x<10; x++) {
    $L1Date[x] = new Date();
    // Add the Planetary Period to the previous threshold date on that level to calculate the threshold date for x
    $L1Date[x].setTime($L1Date[x-1].getTime() + $planetaryPeriod[releasingSign][1]);
    releasingSign++;
    if (releasingSign > 12) {
	    releasingSign = 1;  
    }
    // TODO: Add logic so that the 2nd return to Capricorn doesn't trigger this loosing the bond logic
    if (releasingSign == $L1Sign[1]) {
      // TODO: Store the loosing the bond trigger within the data array
      console.log("Loosing the Bond!!!")
      releasingSign = releasingSign + 6;
      if (releasingSign > 12) {
	      releasingSign = releasingSign - 12;  
      }
    }
    
    $L1Sign[x] = releasingSign;

    // Create L2 given that the ending of the next period has now been calculated as $L1L2Date[x]
    L2StartDate.setTime($L1Date[x-1]);
    var L2releasingSign = $L1Sign[x-1];
    $L2Date[L2Counter] = new Date();
    $L2Date[L2Counter].setTime(L2StartDate);
    L2Counter++;
    L2StartDate.setTime(L2StartDate.getTime() + $planetaryPeriod[L2releasingSign][2]);

    while (L2StartDate < $L1Date[x]) {
      $L2Date[L2Counter] = new Date();
      $L2Date[L2Counter].setTime(L2StartDate);

      L2releasingSign++;
      if (L2releasingSign > 12) {
	      L2releasingSign = 1;  
      }
      // TODO: Add logic so that the 2nd return to Capricorn doesn't trigger this loosing the bond logic
      if (L2releasingSign == $L1Sign[x-1]) {
        // LOG
        // console.log("Loosing the Bond!!!")
        L2releasingSign = L2releasingSign + 6;
        if (L2releasingSign > 12) {
	        L2releasingSign = 1;  
        }
      }
      $L2Sign[L2Counter] = L2releasingSign;
      // LOG
      // console.log("** L2 " + $L2Sign[L2Counter] + " " + $L2Date[L2Counter]);
	    L2Counter++;  
      L2StartDate.setTime(L2StartDate.getTime() + $planetaryPeriod[L2releasingSign][2])
    }
    
    // LOG
    // console.log("L1 " + $L1Sign[x] + " " + $L1Date[x]);
  }
  
}

