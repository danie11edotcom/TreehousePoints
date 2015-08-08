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

	return {
    size: size,
	};
})();