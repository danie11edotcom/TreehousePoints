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

  //Bar Chart: linear scale for x-axis
  var bar_xScale = function(dataArr, padding) {
    d3.scale.linear()
      .domain([0, d3.max(dataArr, function(d) {
        return d[1];
        })])
      .range([0,w-padding]);    
  };

	return {
    size: size
	};
})();