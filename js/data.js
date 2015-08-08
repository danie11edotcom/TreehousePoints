var Data = (function() {

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

	var test = "Testing Data module";

	return {
		objCopy: objCopy,
		test: test,
		extractPoints: extractPoints,
		sortPoints: sortPoints
	};
})();