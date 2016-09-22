
+function ($) {
  'use strict';

  function getHCJ(element, options) {
       //传入的triggerbtn
       this.triggerBtn = $(element);

  }

  getHCJ.DEFAULTS = {
    
  }	
  getHCJ.prototype.getSelector = function(_relatedTarget){

  	   //获取box元素
       var box = this.triggerBtn.parent().next(".box");
  	   //获取box元素内的html
       this.getH(box)	
  }
  
  getHCJ.prototype.getH = function (box){
    var that = this;
    
    var script = box.find("script").detach().text();
	  var html = box.html();
    
	  $("#html .content").text(html);
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
  
  function Plugin(option,_relatedTarget) {
    return this.each(function () {
      
      var $this   = $(this)
      var data    = $this.data('hcj.get')
      var options = $.extend({}, getHCJ.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('hcj.get', (data = new getHCJ(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else { data.getSelector(_relatedTarget)}
    })
  }
  
  var old = $.fn.set

  $.fn.getHCJ             = Plugin
  $.fn.getHCJ.Constructor = getHCJ

  $.fn.set.noConflict = function () {
    $.fn.getHCJ = old
    return this
  }

  // modalBox DATA-API
  // ==============

  $(document).on('click.hcj.get.data-api', '[data-toggle="getHCJ"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.getHCJ') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.getHCJ', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if getHCJ will actually get shown
      $target.one('hidden.bs.getHCJ', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)  //this即是Plugin定义中的_relatedTarget参数
  })

}(jQuery);						

						
						
						
						
						

						