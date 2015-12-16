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

  var createTsChart = function(element) {
    
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
    .attr("class", function (d) { return (d[2] === 'c#') ? 'csharp' : d[2]; })
  };

  var labelBarChartHorz = function(element, data, p, h, font, fill, text) {
    element.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function (d) {  //use data value as text label
      return d[0] + ", " +d[1];
    })
     .attr("x", function (d) { //set horizontal position of text
        return 3 * p;
    })
    .attr("y", function (d,i) { //set vertical position of text
      //center text along bar midline using power function y = h/2 * x^-0.942
      //power function based on scatter plot trend line from plotting position of 5 sample data.length values
      return i * (h / data.length) + (h/2 * Math.pow(data.length, -0.942));     
    })
    .attr("font-family", font)
    .attr("fill", fill)
    .attr("class", text);
  };

  return {
    size: size,
    clearContent: clearContent,
    createTsChart: createTsChart,
    createBarChartHorz: createBarChartHorz,
    labelBarChartHorz: labelBarChartHorz
	};
})();