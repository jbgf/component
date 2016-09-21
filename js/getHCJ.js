
+function ($) {
  'use strict';

  function getHCJ(element, options) {
       //传入的triggerbtn
       this.triggerBtn = $(element);

       this.getSelector(this.triggerBtn);
  }

  getHCJ.DEFAULTS = {
    
  }	
  getHCJ.prototype.getSelector = function(triggerBtn){
  	   var h = triggerBtn.parent().next(".box");
  	   this.getH(h)	
  }
  getHCJ.prototype.getH = function (h){
    var that = this;
    
    var script = $(h).find("script").detach().text();
	  var html = $(h).html();
	  console.log(html);
    console.log(script);  
  }
  getHCJ.prototype.getC = function () {
    var that = this;
	function css(selector){

		function readCss(a){

		    var sheets = document.styleSheets, o = [];
		    a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector;
		    for (var i in sheets) {
		        var rules = sheets[i].rules || sheets[i].cssRules;
		        for (var r in rules) {
		            if (a.matches(rules[r].selectorText)) {
		                o[rules[r].selectorText] = (rules[r].cssText);
		            }
		        }
		    }
		    return o;
		};
		
		function writeCss(){

		};

		var ele = $(selector)[0];
		var cssArray = readCss(ele);
		
	};
	
  }
  getHCJ.prototype.getJ = function () {
    var that = this;
	//js
	console.log($("#float-r").next("script").text());
	
  }
  
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('hcj.get')
      var options = typeof option == 'object' && option

      if (!data) $this.data('hcj.get', (data = new getHCJ(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.set

  $.fn.getHCJ             = Plugin
  $.fn.getHCJ.Constructor = getHCJ

  $.fn.set.noConflict = function () {
    $.fn.getHCJ = old
    return this
  }

}(jQuery);						

						
						
						
						
						

						