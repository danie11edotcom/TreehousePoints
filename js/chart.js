//**************************************************************************//

//Horizontal Bar Chart of Treehouse profile points using d3.js

//create variable to hold data from profile json (http://www.teamtreehouse.com/daniellehill2.json)
var dataRaw = [
            ['HTML', 2132, 'html'],
            ['CSS', 2944, 'css'],
            ['Design', 2292, 'design'],
            ['JavaScript', 3477, 'js'],
            ['Ruby', 7, 'ruby'],
            ['PHP', 649, 'php'],
            ['WordPress', 1755, 'wp'],
            ['iOS', 0, 'ios'],
            ['Android', 0, 'android'],
            ['Development Tools', 931, 'devtools'],
            ['Business', 2025, 'business'],
            ['Python', 616, 'python'],
            ['Java', 0, 'java'],
            ['Digital Literacy', 0, 'diglit']
           ];

/*//Get raw data in descending order via M. Bostock's function
function descending(a, b) {
  return b[1] < a[1] ? -1 : b[1] > a[1] ? 1 : b[1] >= a[1] ? 0 : NaN;   //inline ternary statement
}

var data = dataRaw.sort(descending);*/

//set array of topic names for y-axis ordinal scale using sorted data
var topics = function (list) {
              var newList = [];
              for (var i=0; i<list.length; i++) 
                newList.push(list[i][0]);
              return newList;
             }
var topicsArr = topics(data);


/*//variable to hold total points
var total = 18045;*/

//set SVG size variables
var w = 800;
var h = 450;
var padding = 4;

//set linear scale for x-axis
var  xScale = d3.scale.linear()
                      .domain([0, d3.max(data, function(d) {
                          return d[1];
                      })])
                      .range([0,w]);

//set ordinal scale for y-axis
var  yScale = d3.scale.ordinal()
                      .domain(topicsArr)
                      .range(d3.range(topicsArr.length));

//set y-axis
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left");

//create SVG
var svg = d3.select("#chart")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

//create chart using svg rect bound to data
  svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d,i) {
              return i * (h / data.length);
            })
      .attr("width", function (d) {
              return xScale(d[1]);
            })
      .attr("height", (h / data.length) - padding )
      .attr("class", function (d) {return d[2]});
        
//add labels
 svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function (d) {                                                              //use data value as text label
            return d[1];
          })
    .attr("x", function (d) {                                                         //set horizontal position of text
            return ( d[1] < 50  ? 15 :  xScale(d[1]) - 45);
          })
    .attr("y", function (d,i) {                                                       //set vertical position of text
            return i * (h / data.length) + 20;
          })
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .attr("fill", function (d) {                                                      //choose text color based on data value
            return ( d[1] < 50  ? "#000" :  "#fff");
          })
    .style("display", function (d) { return d[1] === 0 ? "none" : "inline"; });       //hide zero values
    

//add y-axis
 svg.append("g")
    .attr("transform", "translate(50,0)")
    .call(yAxis);