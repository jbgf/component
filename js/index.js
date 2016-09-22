
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
  	if(this.box.length != 0){
  		var btnRow = $('<div class="headRow clear"><span class="button btn-r-m bg-pink white float-l get"><img style="margin-top: -3px;" src="/img/icon_w.png" class="icon">Get!</span></div>')	
  		var tag = $("<img src='/img/js.png'>");

  		this.box.before(btnRow);

      this.box.each(function(index,ele){

        that.haveScript(ele)?$(ele).find(".headRow").append(tag)
        :"";
      })
  		$.getScript("/js/getHCJ.js",function(){
  			that.modalWindow();
  		});
  		
  	}
  }
  set.prototype.haveScript = function(box){
      console.log(box)
  }
  set.prototype.modalWindow = function () {
    var that = this;
    var hcjModal = '<div class="line hcj"><div class="block block-2"><div id="html"><div class="title">html</div><div class="content"></div></div></div><div class="block block-2"><div class="line"><div class="block block-1"><div id="css"><div class="title">css</div><div class="content"></div></div></div></div><div class="line"><div class="block block-1"><div id="js"><div class="title">js</div><div class="content"></div></div></div></div></div></div>';
  	$(document).on("click",that.options.trigger,function(){
  		  var $trigger = $(this);
  		  layer.open({
  			  type: 1,
  			  skin: 'demo-class',  //给弹窗添加特殊的class设置样式
  			  area: ['800px', '560px'],
          title:"HCJ",
  			  shadeClose: true, //点击遮罩关闭
  			  content:hcjModal,
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

  
  // DATA-API==================

  $(window).on('load.hcj.set.data-api', function () {
    $('[data-set="set"]').each(function () {
      var $set = $(this)
      Plugin.call($set, $set.data())  //#set.data()获取元素上的data-xxx的内容
    })
  })

}(jQuery);