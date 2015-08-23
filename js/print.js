var Print = (function() {
	
	var userInfo = function(name, points, categories) {
	  var a = name + " has earned " + points + " total points in " + categories + " different categories!";
		return a;
	};

  var footer = function(path) {
		var b = "Data source: <a href=" + path + " target=\"_blank\">Treehouse profile JSON</a>";
		return b;
	};

	var jsonFail = function(user, sample1, sample2) {
		var c = "Sorry, no profiles match " + user + ". Try <a href=\"#" + sample1 + "\"> " +sample1 + "</a> or <a href=\"#" + sample2 + "\">" +sample2 +"</a>";
		return c;
	};

	var btnText = {
			disabled: "searching...",
			enabled: "Search"
		};

	var conLogError = function (){
		var e = "Error: JSON not found, profile name does not exist";
		return e;
	};
	
	return {
	  userInfo: userInfo,
	  footer: footer,
	  jsonFail: jsonFail,
	  btnText: btnText,
	  conLogError: conLogError
	};	
})();