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
      var date1 = badges[0].earned_date.slice(0,4);
      var tsData = Data.arrOfObjs(Data.badgesPerDay(Data.getDate(Data.getTimeStamps(badges))));
      var data = Data.sortPoints(Data.extractPoints(Data.objCopy(points)));

      //add message and gravatar to <main> section and make it visible
     $('#errorDisplay').hide();
      $('#gravatar').attr({
          src: gravatar,
          alt: "user profile picture"
      }).show();
      $('#name').html(name);
      $('#date1').html('Learning since ' + date1);
      $('#name-heading').html(name);
      $('#totalPoints').html(totalPoints.toLocaleString());
      $('#totalAchievements').html(badges.length.toLocaleString());

      //Add jsonPath to footer and make visible
      $('#footnote').html(Print.footer(jsonPath)).show();

      //Plot chart of points using d3
      //set SVG size variable for bar chart
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
        .attr("height", barChartSize.h)
        .attr("viewBox", "0 0 " + barChartSize.w + " " + barChartSize.h + "" ) 
        .attr("perserveAspectRatio", "xMinYMin");

      //create and label charts for time series
      var tsDataMG = MG.convert.date(tsData, 'day')
      MG.data_graphic({
        data: tsData,
        width: 800,
        height: 275,
        target: '#timeseries',
        x_accessor: 'day',
        y_accessor: 'achievements',
        missing_is_zero: true,
        xax_start_at_min: true,
        yax_count: 7,
        point_size: 3.5
      });

      //create and label charts for bar chart
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
        console.log(Print.conLogError());
        
        //show message that profile was not found and hide img element
        $('#gravatar').hide();
        $('#errorDisplay').html(Print.jsonFail(user, "daniellehill2", "mikethefrog")).show();
        $('#sample1').click(function() {
           $('#input').val("daniellehill2");
        });
        $('#sample2').click(function() {
           $('#input').val( "mikethefrog");
        });
        $('#name').html('User Name');
        $('#date1').html('Learning since...');
        $('#name-heading').html('User Name');
        $('#totalPoints').html('# Points');
        $('#totalAchievements').html('# Achievements');
      
        //clear charts (prevents previously displayed charts from showing)
        Charts.clearContent('#timeseries');
        Charts.clearContent('#chart');
      
        //Enable input and submit btn and change btn text
        disableFormEl(false);
        $("#input").focus();
              
      }); //end fail

      //use HTML History API to update URL and allow back and forward navigation
        //create state Object to pass to pushState method
        var pageData = {
            title: "Treehouse Dashboard",
            url: user,
        };  

        history.pushState(pageData, pageData.title, pageData.url);
        console.log('History length: ' + history.length);
  });   //end submit

  //On popstate change input val to user name in url and submit form
  window.addEventListener('popstate', function(event) {
    console.log('Popstate fired. History length = ' + history.length);
    $('#input').val(location.pathname.slice(1));
    //$.getJSON("http://teamtreehouse.com/" + location.pathname.slice(1) + ".json", execute);
  });

});    //end ready

