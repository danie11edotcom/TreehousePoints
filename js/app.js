//  Treehouse Profile App
//  Danielle Hill
//  http://www.danie11e.com
//  GitHub: danie11edotcom
//  2015

//use strict declaration
'use strict';

//jQuery to get user profile name
//run when document is ready
$(document).ready(function () {
  
  //run when submit button is clicked (user submits profile name)
  $('form').submit(function (event) {
    
    //prevent form from submitting
    event.preventDefault();
    
    //disable input
    var $inputField = $('#input');
    $inputField.prop("disabled", true);
    
    //disable submit button and change text
    var $submitButton = $('#submit');
    $submitButton.attr("disabled", true).val("searching...");
  
    //AJAX part
    //store username as variable
    var user = $inputField.val();
    
    //store profile JSON path as variable using user from above
    var jsonPath = "http://teamtreehouse.com/" + user + ".json";
    
    //define function to execute using JSON file
    function execute (info) {
      
      //read profile points 
      var name = info.name;                                          //name of user (not the same same as profile name)
      var points = info.points;
      var totalPoints = points.total;
      var gravatar = info.gravatar_url;
      
      //copy points object from JSON so changes are not made to points and points is accesible later in the same state it was when download
      //copy technique from http://heyjavascript.com/4-creative-ways-to-clone-objects/
      var  pointsCopy = (JSON.parse(JSON.stringify(points)));
      
      //create array for raw data
      var dataRaw = [];
      
      //remove keys where value === 0 as well as the total points
      for (var key in pointsCopy) {
        if (pointsCopy[key] === 0 || key === "total") {
          delete pointsCopy[key];
        } else {
          dataRaw.push([key, pointsCopy[key]]);
        }        
       }

        //sort dataRaw ascending using Bostock's descending function and store as data to pass to d3.js
       var data = [];
       data = dataRaw.sort(function descending(a, b) {
            return b[1] < a[1] ? -1 : b[1] > a[1] ? 1 : b[1] >= a[1] ? 0 : NaN;
        });

        //create 3rd item in each array with css class name to pass to d3
        for (var i=0; i<data.length; i++) {
            //using index [i][0] replace spaces with underscore and make lowercase and assign to index [i][2]
            data[i][2] = data[i][0].replace(/\s/g,'_').toLowerCase();
        }

        //add message and gravatar to <main> section and make it visible
        $('#gravatar').attr({
            src: gravatar,
            alt: "user profile picture"
        });
        $('#message').html(Print.userInfo(name, totalPoints, data.length));
        $('main').show();
      
        //Add jsonPath to footer and make visible
        $('#footnote').html("Data source: <a href=" + jsonPath + " target=\"_blank\">Treehouse profile JSON</a>").show();

        //***************************************Chart points using d3.js********************************************
      
        //set array of topic names for y-axis ordinal scale using sorted data
        var topics = function (list) {
                      var newList = [];
                      for (var i=0; i<list.length; i++) 
                        newList.push(list[i][0]);
                      return newList;
                     }
        var topicsArr = topics(data);

        //set SVG size variables -- need to be based on container size for resizing
        var w = 800;          // Originial Aspect Ration: 800 / 450 = 1.777777  550/350=1.5714285714285714
        var h = 533;
        var padding = 4;

        //set linear scale for x-axis
        var xScale = d3.scale.linear()
                              .domain([0, d3.max(data, function(d) {
                                  return d[1];
                              })])
                              .range([0,w-padding]);

        //clear #chart contents (prevents multiple charts from showing at once)
        d3.select('#chart').html("");
      
        //create SVG
        var svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)                                    //added width and height to test effect in browsers with vB and pAR
                  .attr("viewBox", "0 0 " + w + " " + h + "" )          //set viewBox and perserveAspectRatio for responsiveness 
                  .attr("perserveAspectRatio", "xMinYMin");

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
                    return d[0] + ", " +d[1];
                  })
            .attr("x", function (d) {                                                         //set horizontal position of text
                    return 3 * padding;
                  })
            .attr("y", function (d,i) {                                                       //set vertical position of text
                    //center text along bar midline using power function y = h/2 * x^-0.942
                    //power function based on scatter plot trend line from plotting position of 5 sample data.length values
                    return i * (h / data.length) + (h/2 * Math.pow(data.length, -0.942));     
                  })
            .attr("font-family", "sans-serif")
            .attr("fill", "black")
            .attr("class", "text");

      //************************************************end d3.js code*************************************************************

        //Enable input and revert submit button message back to original message
        $inputField.prop("disabled", false);
        $submitButton.attr("disabled", false).val("Show Points");  
        $("#input").focus();

    } //end execute() function definition
  
    //Add support for IE9 jQuery AJAX
    jQuery.support.cors = true;
    
    $.getJSON(jsonPath, execute)
     .fail(function() {
        //log error to console
        console.log("Error: JSON not found, profile name does not exist")
        
        //show message that profile was not found and hide img element
        //links on suggested profiles not working; should resolve with history api popstate feature add
        $('#gravatar').hide();
        $('#message').html("Sorry, no profiles match " + user + ". Try <a href=\"#daniellehill2\">daniellehill2</a> or <a href=\"#mikethefrog\">mikethefrog</a>");
        $('main').show();
      
        //clear #chart contents (prevents a previously displayed chart from showing)
        d3.select('#chart').html("");
      
        //Enable input and revert submit button message
        $inputField.prop("disabled", false);
        $submitButton.attr("disabled", false).val("Show Points")
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

