var Print = (function() {
	
	var userInfo = function(name, points, categories) {
		var msg = name + " has earned " + points + " total points in " + categories + " different categories!";
		return msg;
	};
	
	return {
		userInfo: userInfo
	};	
})();