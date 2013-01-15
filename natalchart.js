$ns.natalchart = function ($planets) {
  var ctx = document.getElementById('canvas').getContext('2d');
  var planetDegree;
  var center;

  var $planetColor = {
		sun: "#feb400",
		moon: "#b2b2b2",
		mercury: "#abc600",
		venus: "#1bc2c2i",
		mars: "#be0000",
		jupiter: "#0000cb",
		saturn: "#a28868",
		chiron: "#666666",
		uranus: "#bc00ca",
		neptune: "#116f43",
		pluto: "#6b0000"
  };
    
  ctx.save();
  // Clear out the canvas for multiple executions
  ctx.clearRect(0, 0, 400, 400);
  // Move the 0,0 point to the center of the canvas
  ctx.translate(200, 200);
  // Rotate to get the zero point of Aries to be on the left-hand side
  ctx.rotate((2*Math.PI)/2);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;

  // Sign Cusps marks
  ctx.save();
  ctx.lineWidth = 0.75;
  for (var i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 6);
    ctx.moveTo(195-60, 0);
    ctx.lineTo(195, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Decan marks
  ctx.save();
  ctx.lineWidth = 0.25;
  for (var i = 0; i < 36; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 18);
    // Outer wheel ticks
    ctx.moveTo(195-10, 0);
    ctx.lineTo(195, 0);
    ctx.stroke();
    // Inner Wheel ticks
    ctx.moveTo(195-60, 0);
    ctx.lineTo(195-60+6, 0);
    ctx.stroke();

  }
  ctx.restore();
  
  // Degree marks
  ctx.save();
  ctx.lineWidth = 0.1;
  for (i = 0; i < 360; i++) {
    if (i % 30 != 0) {
      ctx.beginPath();
      // Outer wheel ticks
      ctx.moveTo(195-5, 0);
      ctx.lineTo(195, 0);
      ctx.stroke();
      // Inner wheel ticks
      ctx.moveTo(195-60, 0);
      ctx.lineTo(195-60+3, 0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI / 180);
  }
  ctx.restore();
  ctx.fillStyle = "black";

  // Draw outside wheel with radius of 195
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.arc(0, 0, 195, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.restore();

  // Draw inside wheel with radius of 60 less than outside
  ctx.save();  
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.arc(0, 0, 195-60, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.restore();

  // Draw inside circle with radius of 70 
  ctx.save();  
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.arc(0, 0, 70, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.restore();

  // Draw Planet Degree
  // Go from the outside wheel to the inside circle
  ctx.lineWidth = 195-70;
  center = 195 - (195-70)/2;
  for (var key in $planets) {
	  ctx.save();
	  ctx.beginPath();
	  ctx.strokeStyle = $planetColor[key];
	  planetDegree = $planets[key];
	  // Need a combination of rotation and subtracting from 360 to get the proper degree mapping.
	  ctx.arc(0, 0, center, ((360.15-planetDegree)*Math.PI)/180, ((360-planetDegree-0.15)* Math.PI)/180, true);
	  // TODO: Add the Planet Glyphs and degrees
	  ctx.stroke();
	  ctx.restore();
  }

  // Reset all of the transforms for the next run.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};
