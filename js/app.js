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
      var name = info.name; //name of user -- not the same same as profile name
      var points = info.points;
      var totalPoints = points.total;
      var gravatar = info.gravatar_url;
      var badges = info.badges;
      var tsData = Data.arrOfObjs(Data.badgesPerDay(Data.getDate(Data.getTimeStamps(badges)))); //pass to d3.js for time series
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
      //var tsChartSize = Charts.size(800, 275, 4);
      var barChartSize = Charts.size(800, 533, 4);  // Originial Aspect Ration: 800 / 450 = 1.777777  550/350=1.5714285714285714

      //set linear scale for x-axis for bar chart
      var xScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d[1];
          })])
        .range([0,barChartSize.w-barChartSize.p]);

      //clear contents of elements containing charts (prevents multiple charts from showing at once)
      Charts.clearContent('#timeseries');
      Charts.clearContent('#chart');

      var svg = d3.select("#chart")
        .append("svg")
        .attr("width", barChartSize.w)
        .attr("height", barChartSize.h)  //added width and height to test effect in browsers with vB and pAR
        .attr("viewBox", "0 0 " + barChartSize.w + " " + barChartSize.h + "" )  //set viewBox and perserveAspectRatio for responsiveness 
        .attr("perserveAspectRatio", "xMinYMin");

      //create and label charts
      //time series
      var tsDataMG = MG.convert.date(tsData, 'day')
      MG.data_graphic({
        //title: 'Achievement Timeline',
        data: tsData,
        width: 800,
        height: 275,
        target: '#timeseries',
        x_accessor: 'day',
        y_accessor: 'achievements',
        missing_is_zero: true
      });

      //bar chart
      Charts.createBarChartHorz(svg, data, barChartSize.h, xScale, barChartSize.p);
      Charts.labelBarChartHorz(svg, data, barChartSize.p, barChartSize.h, "sans-serif", "black", "text");

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
        Charts.clearContent('#chart');
      
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
  });   //end submit
});    //end ready

