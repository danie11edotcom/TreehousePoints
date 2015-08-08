var Charts = (function() {

  var size = function(w, h, p) {
    var width = w;
    var height = h;
    var padding = p;
    return {
    	w: width,
      h: height,
      p: padding
    };
  };

 /* var createSvg = function(w, h) {
  	d3.select(this)
     .append("svg")
     .attr("width", w)
     .attr("height", h)  //added width and height to test effect in browsers with vB and pAR
     .attr("viewBox", "0 0 " + w + " " + h + "" )  //set viewBox and perserveAspectRatio for responsiveness 
     .attr("perserveAspectRatio", "xMinYMin");
  };*/

	return {
    size: size,
    //createSvg: createSvg
	};
})();