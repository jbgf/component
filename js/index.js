
+function ($) {
  'use strict';

  function set(element, options) {
    this.container = $(element);
    this.box = $(element).find(".box");
    this.options = $.extend({}, set.DEFAULTS, options);
    this.ini();
  }

  set.DEFAULTS = {
    trigger: ".get"
  }	

  set.prototype.ini = function (){
    var that = this;
	if(this.box != 0){
		var btnRow = $('<div class="headRow clear"><span class="button btn-r-m bg-pink white float-l get"><img style="margin-top: -3px;" src="/img/icon_w.png" class="icon">Get!</span></div>')	
		
		this.box.before(btnRow);
		$.getScript("/js/getHCJ.js",function(){
			that.modalWindow();
		});
		
	}
  }
  set.prototype.modalWindow = function () {
    var that = this;
    
	$(document).on("click",that.options.trigger,function(){
		  var $trigger = $(this);
		  layer.open({
			  type: 1,
			  skin: 'demo-class',  //给弹窗添加特殊的class设置样式
			  area: ['800px', '560px'],
			  shadeClose: true, //点击遮罩关闭
			  content:'<div class="line hcj"><div id="html" class="block block-2"><div class="title">html</div><div class="content"></div></div><div class="block block-2"><div class="line"><div id="css" class="block block-1"><div class="title">css</div><div class="content"></div></div></div><div class="line"><div id="js" class="block block-1"><div class="title">js</div><div class="content"></div></div></div></div></div>',
		  	  success: function(layero, index){
			    		 $trigger.getHCJ();
			  }	
		  });
	})
	
  }
  
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('hcj.set')
      var options = typeof option == 'object' && option

      if (!data) $this.data('hcj.set', (data = new set(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.set

  $.fn.set             = Plugin
  $.fn.set.Constructor = set

  $.fn.set.noConflict = function () {
    $.fn.set = old
    return this
  }

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.hcj.set.data-api', function () {
    $('[data-set="set"]').each(function () {
      var $set = $(this)
      Plugin.call($set, $set.data())  //#set.data()获取元素上的data-xxx的内容
    })
  })

}(jQuery);