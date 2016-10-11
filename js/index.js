
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
    //box数量 = 组件数量；
    var boxNum = box.length;
    var className = 'block block-'+rowNum+'';
    
    
    box.wrap(function() {
      return "<div class='" + className + "'></div>";
    });
    
    var block = that.container.find(".block");
    var a= $.makeArray(block);
    var b_array = [];
//页面布局成几行几列    
    for(var i=0;i< boxNum;i+=rowNum){
        b_array.push(a.slice(i,i+rowNum));
        
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
  		
  		box.before(btnRow);
      var h;
      block.each(function(index,ele){
        var tag = $("<img class='tag js' src='/img/js.png'>");
        var s = that.haveTag($(ele)).script;
        var p = that.haveTag($(ele)).plugin;
        
        s?$(ele).find(".headRow").append(tag)
        :"";
        //因为调用插件方法，可能会改变文档结构，所以先保存一份。
        p?(h = $(ele).find(".box").find("script").remove().end().html(),window[p]())
        :"";


      })
  		$.getScript("/js/getHCJ.js",function(){
  			that.modalWindow({originalH:h});
  		});
  		
  	}
  }
  set.prototype.haveTag = function($block){
    var script = $block.find("script").length !=0;
    var plugin = $block.find("[data-plugin]").attr("data-plugin") || undefined;
    var state = {
      script:script,
      plugin:plugin
    };
    return state;
  }
  set.prototype.modalWindow = function (p) {
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
  			    		 $trigger.getHCJ(p);
  			  }	
  		  });
  	})
	  
    function HCJmodal(tag){
        var hcjModal = '<div class="container-p-15"><div class="line hcj"><div class="block block-2"><div id="html"><div class="title">html</div><div class="content"></div></div></div><div class="block block-2"><div class="line"><div class="block block-1"><div id="css"><div class="title">css</div><div class="content"></div></div></div></div><div class="line"><div class="block block-1"><div id="js"><div class="title">js</div><div class="content"></div></div></div></div></div></div></div>';
        var hcModal = '<div class="container-p-15"><div class="line hcj"><div class="block block-2"><div id="html"><div class="title">html</div><div class="content"></div></div></div><div class="block block-2"><div id="css"><div class="title">css</div><div class="content"></div></div></div></div></div>';
        var modal = tag?hcjModal:hcModal,
            copyBtn = '<div class="copyBtn button btn-num01 margin-l-20" >C</div>';
            modal = $(modal).find(".title").append(copyBtn).end().prop("outerHTML");
            
            $(document).on("click",".copyBtn",function(){
                var text = $(this).parents(".title").siblings(".content").text();
                var title = this.previousSibling.wholeText;
                
                copyTextToClipboard(title,text);
            })
    /*document.execCommand('copy');对input和textarea比较有效，所以还是创建一个隐藏的textarea*/
            function copyTextToClipboard(title,text) {
                var textArea = document.createElement("textarea");
                /*设置样式*/  
                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.width = '2em';
                textArea.style.height = '2em';
                textArea.style.padding = 0;
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';

                textArea.value = text;

                document.body.appendChild(textArea);

                textArea.select();

                try {
                  var successful = document.execCommand('copy');
                  var msg = successful ? 'successful' : 'unsuccessful';
                  layer.msg('Copying '+title+' command was ' + msg);
                } catch (err) {
                  layer.msg('Oops, unable to copy');
                }

                document.body.removeChild(textArea);
              }

        return modal;
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

