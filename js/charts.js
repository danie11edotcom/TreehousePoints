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

  var clearContent = function(selector) {
    d3.select(selector).html("");
  };

  var createBarChartHorz = function(element, data, h, scale, p) {
    element.selectAll("rect")
              .data(data)
              .enter()
              .append("rect")
              .attr("x", 0)
              .attr("y", function (d,i) {
                      return i * (h / data.length);
                    })
              .attr("width", function (d) {
                      return scale(d[1]);
                    })
              .attr("height", (h / data.length) - p)
              .attr("class", function (d) {return d[2]});
  };

	return {
    size: size,
    clearContent: clearContent,
    createBarChartHorz: createBarChartHorz
	};
})();