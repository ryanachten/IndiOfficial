
$(document).ready(function(){
  var circle = document.createElement("div");
  circle.id = "cursor-circle";
  var circleRadius = 50;
  circle.style.width = circle.style.height = circleRadius+"px";

  document.body.appendChild(circle);

  $(document.body).mousemove(function(e){
    var curX = e.pageX;
    var curY = e.pageY;

    circle.style.left = curX+"px";
    circle.style.top = curY+"px";
  });
});
