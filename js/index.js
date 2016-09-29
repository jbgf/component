
+function ($) {
  'use strict';

  function set(element, options) {
    this.container = $(element);
    
    this.options = $.extend({}, set.DEFAULTS, options);
    this.ini();
  }

  set.DEFAULTS = {
    trigger: ".get",
    rowBlock:4
  }	

  set.prototype.ini = function (){
    var that = this;
    var box = that.container.find(".box");
    
    var brandName = this.options.brandName || "组件";
    var rowNum = this.options.rowBlock;
    var boxNum = box.length;
    var className = 'block block-'+rowNum+'';
    
    
    box.wrap(function() {
      return "<div class='" + className + "'></div>";
    });
   
    var a= [];
    var b_array = [];
    var block = that.container.find(".block");
//页面布局成几行几列    
    for(var i=1;i<= boxNum;i++){
        a.push(block[i-1]);
        
        if(i % rowNum == 0){
          b_array.push(a);
                
          a = []; //a.length = 0 会影响b;
          
        }
    }

    $.each(b_array,function(index,value){
        var row = b_array[index];
        var $line = $("<div class='line'></div>");
        $.each(row,function(i,v){
            $(v).appendTo($line)
        });
        $line.appendTo(that.container)
    })

//开头的brand    写组件名
    $(".brandName ").html(brandName);
    var that = this;
  	if(box.length != 0){
  		var btnRow = $('<div class="headRow clear"><span class="button btn-r-m bg-pink white float-l get"><img style="margin-top: -3px;" src="/img/icon_w.png" class="icon">Get!</span></div>')	
  		var tag = $("<img class='tag js' src='/img/js.png'>");

  		box.before(btnRow);

      block.each(function(index,ele){

        that.haveScript($(ele))?$(ele).find(".headRow").append(tag)
        :"";
      })
  		$.getScript("/js/getHCJ.js",function(){
  			that.modalWindow();
  		});
  		
  	}
  }
  set.prototype.haveScript = function($block){

    return $block.find("script").length !=0
  }
  set.prototype.modalWindow = function () {
    var that = this;
    
    $(document).on("click",that.options.trigger,function(){
  		  var $trigger = $(this);
        //判断是否有js tag标签
        var tag = $trigger.siblings(".tag").length != 0;

        var modal = HCJmodal(tag);
  		  layer.open({
  			  type: 1,
  			  skin: 'demo-class',  //给弹窗添加特殊的class设置样式
  			  area: ['800px', '560px'],
          title:false/*"HCJ"*/,
  			  shadeClose: true,    //点击遮罩关闭
  			  content:modal,
  		  	  success: function(layero, index){
  			    		 $trigger.getHCJ();
  			  }	
  		  });
  	})
	  
    function HCJmodal(tag){
        var hcjModal = '<div class="container-p-15"><div class="line hcj"><div class="block block-2"><div id="html"><div class="title">html</div><div class="content"></div></div></div><div class="block block-2"><div class="line"><div class="block block-1"><div id="css"><div class="title">css</div><div class="content"></div></div></div></div><div class="line"><div class="block block-1"><div id="js"><div class="title">js</div><div class="content"></div></div></div></div></div></div></div>';
        var hcModal = '<div class="container-p-15"><div class="line hcj"><div class="block block-2"><div id="html"><div class="title">html</div><div class="content"></div></div></div><div class="block block-2"><div id="css"><div class="title">css</div><div class="content"></div></div></div></div></div>';
        return tag?hcjModal:hcModal;
    }

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

