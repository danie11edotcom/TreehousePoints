var Data = (function() {

  var getTimeStamps = function(arr) {
    var timeStamps = [];
    for (var val in arr) {  //for ES6 use for...of (IE not supported as of time of writing)
      timeStamps.push(arr[val].earned_date);
    }
    return timeStamps;
  };

  var getDate = function(arr) {
    var dates = [];
    for (var times in arr) {
      dates.push(arr[times].slice(0,10));
    }
    return dates;
  };

  var dateMs = function(arr) {
    var dateString = [];
    for (var date in arr) {
      dateString.push(Date.parse(arr[date]));
    }
    return dateString;
  };

  var badgesPerDay = function(arr) {
    //StackOverflow answer by radicand: http://stackoverflow.com/questions/5667888/counting-the-occurrences-of-javascript-array-elements
    var obj = arr.reduce(function(countMap, word) {countMap[word] = ++countMap[word] || 1; return countMap}, {});
    return obj;
  };

  var objCopy = function(obj) {
    //copy points object from JSON so changes are not made to points and points is accesible later in the same state it was when download
    //copy technique from http://heyjavascript.com/4-creative-ways-to-clone-objects/
    var duplicateObj = (JSON.parse(JSON.stringify(obj)));
    return duplicateObj;
  };

  var extractPoints = function(pointsObj) {
    var dataRaw = [];
    for (var key in pointsObj) {
      if (pointsObj[key] === 0 || key === "total") {
        delete pointsObj[key];
      } else {
        dataRaw.push([key, pointsObj[key]]);
      }        
     }
     return dataRaw;
  };

  var objToArr = function(obj) {
    var newArray = [];
    for (var key in obj) {
      newArray.push([key, obj[key]]);
    }
    console.log(newArray);
    return newArray;
  };

  var sortPoints = function(dataArr) {
    //sort dataRaw ascending using Bostock's descending function and store as data to pass to d3.js
   var newArr = [];
   newArr = dataArr.sort(function descending(a, b) {
        return b[1] < a[1] ? -1 : b[1] > a[1] ? 1 : b[1] >= a[1] ? 0 : NaN;
    }); 

    //create 3rd item in each array with css class name to pass to d3
    for (var i=0; i<newArr.length; i++) {
        //using index [i][0] replace spaces with underscore and make lowercase and assign to index [i][2]
        newArr[i][2] = newArr[i][0].replace(/\s/g,'_').toLowerCase();
    }
    return newArr;
  };

  return {
    getTimeStamps: getTimeStamps,
    getDate: getDate,
    dateMs: dateMs,
    badgesPerDay: badgesPerDay,
    objToArr: objToArr,
    objCopy: objCopy,
    extractPoints: extractPoints,
    sortPoints: sortPoints
	};
})();