$ns.natalchart = function ($planets) {
  var ctx = document.getElementById('canvas').getContext('2d');
  var planetDegree;
  var i;
  ctx.save();
  ctx.clearRect(0, 0, 500, 500);
  ctx.translate(225, 225);
  ctx.scale(1.75, 1.75);
  ctx.rotate((2*Math.PI)/2);
  
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;

  // Sign Cusps marks
  ctx.save();
  for (var i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 6);
    ctx.moveTo(90, 0);
    ctx.lineTo(120, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Decan marks
  ctx.save();
  for (var i = 0; i < 36; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 18);
    ctx.moveTo(112, 0);
    ctx.lineTo(120, 0);
    ctx.stroke();
    ctx.moveTo(90, 0);
    ctx.lineTo(92, 0);
    ctx.stroke();

  }
  ctx.restore();
  
  // Minute marks
  ctx.save();
  ctx.lineWidth = 1;
  for (i = 0; i < 360; i++) {
    if (i % 30 != 0) {
      ctx.beginPath();
      ctx.moveTo(117, 0);
      ctx.lineTo(120, 0);
      ctx.stroke();
      ctx.moveTo(90, 0);
      ctx.lineTo(91, 0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI / 180);
  }
  ctx.restore();
  ctx.fillStyle = "black";

  // Draw outside wheel
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.arc(0, 0, 120, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.restore();

  // Draw inside wheel
  ctx.save();  
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.arc(0, 0, 90, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.restore();

  // Draw inside circle
  ctx.save();  
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.arc(0, 0, 50, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.restore();

  
  // Draw Planet Degree
  for (var key in $planets) {
	  ctx.save();
	  ctx.beginPath();
	  ctx.lineWidth = 70;
	  ctx.strokeStyle = '#FF0000';
	  planetDegree = $planets[key];
	  ctx.arc(0, 0, 85, ((360.25-planetDegree)*Math.PI)/180, ((360-planetDegree-0.25)* Math.PI)/180, true);
	  ctx.stroke();
	  ctx.restore();
  }

};
