//use strict declaration
'use strict';

$(document).ready(function () {
  
  //run when submit button is clicked (user submits profile name)
  $('form').submit(function (event) {
    
    //prevent form from submitting
    event.preventDefault();
    
    //input, submit btn and json path variables
    var $inputField = $('#input');
    var $submitButton = $('#submit');
    var user = $inputField.val();
    var jsonPath = "http://teamtreehouse.com/" + user + ".json";

    //Function to disable/enable input and submit btn and change btn text
    var disableFormEl = function(bool) {
      $inputField.prop("disabled", bool);  
      $submitButton.attr("disabled", bool);

      if (bool === true) {
        $submitButton.val(Print.btnText.disabled);
      } else {
        $submitButton.val(Print.btnText.enabled);
      }
    };

    //disable input and submit btn and change btn text
    disableFormEl(true);

    //define function to execute using JSON file
    function execute (info) {
      
      //read profile points and prep data to pass to d3.js for visualization and to print message
      var name = info.name; //name of user (not the same same as profile name)
      var points = info.points;
      var totalPoints = points.total;
      var gravatar = info.gravatar_url;
      var data = Data.sortPoints(Data.extractPoints(Data.objCopy(points)));

      //add message and gravatar to <main> section and make it visible
      $('#gravatar').attr({
          src: gravatar,
          alt: "user profile picture"
      });
      $('#message').html(Print.userInfo(name, totalPoints, data.length));
      $('main').show();
    
      //Add jsonPath to footer and make visible
      $('#footnote').html(Print.footer(jsonPath)).show();

      //Plot chart of points using d3
        //set SVG size variables -- need to be based on container size for resizing
        var barChartSize = Charts.size(800, 533, 4);  // Originial Aspect Ration: 800 / 450 = 1.777777  550/350=1.5714285714285714

        //set linear scale for x-axis
        var xScale = d3.scale.linear()
          .domain([0, d3.max(data, function(d) {
            return d[1];
            })])
          .range([0,barChartSize.w-barChartSize.p]);
  
        //clear #chart contents (prevents multiple charts from showing at once)
        d3.select('#chart').html("");
      
        //create SVG
        var svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", barChartSize.w)
                  .attr("height", barChartSize.h)  //added width and height to test effect in browsers with vB and pAR
                  .attr("viewBox", "0 0 " + barChartSize.w + " " + barChartSize.h + "" )  //set viewBox and perserveAspectRatio for responsiveness 
                  .attr("perserveAspectRatio", "xMinYMin");

        //create chart using svg rect bound to data
          svg.selectAll("rect")
              .data(data)
              .enter()
              .append("rect")
              .attr("x", 0)
              .attr("y", function (d,i) {
                      return i * (barChartSize.h / data.length);
                    })
              .attr("width", function (d) {
                      return xScale(d[1]);
                    })
              .attr("height", (barChartSize.h / data.length) - barChartSize.p)
              .attr("class", function (d) {return d[2]});

        //add labels
         svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function (d) {  //use data value as text label
                    return d[0] + ", " +d[1];
                  })
            .attr("x", function (d) { //set horizontal position of text
                    return 3 * barChartSize.p;
                  })
            .attr("y", function (d,i) { //set vertical position of text
                    //center text along bar midline using power function y = h/2 * x^-0.942
                    //power function based on scatter plot trend line from plotting position of 5 sample data.length values
                    return i * (barChartSize.h / data.length) + (barChartSize.h/2 * Math.pow(data.length, -0.942));     
                  })
            .attr("font-family", "sans-serif")
            .attr("fill", "black")
            .attr("class", "text");

        //Enable input and submit btn and change btn text
        disableFormEl(false); 
        $("#input").focus();

    } //end execute() function definition
  
    //Add support for IE9 jQuery AJAX
    jQuery.support.cors = true;
    
    $.getJSON(jsonPath, execute)
     .fail(function() {
        console.log(Print.conLogError);
        
        //show message that profile was not found and hide img element
        //links on suggested profiles not working; should resolve with history api popstate feature add
        $('#gravatar').hide();
        $('#message').html(Print.jsonFail(user, "daniellehill2", "mikethefrog"));
        $('main').show();
      
        //clear #chart contents (prevents a previously displayed chart from showing)
        d3.select('#chart').html("");
      
        //Enable input and submit btn and change btn text
        disableFormEl(false);
        $("#input").focus();
              
      }); //end fail

      //use HTML History API to update URL and allow back and forward navigation
        //create state Object to pass to pushState method
        var pageData = {
            title: "Treehouse Points",
            url: "/#"+ user
        };  

        history.pushState(pageData, pageData.title, pageData.url);
        //url is updating; next get corresponding page to load by populating input and submitting form
  });   //end submit
});    //end ready

