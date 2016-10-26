
+function ($) {
  'use strict';

  function set(element, options) {
    this.container = $(element);
    this.originalH = [];
    this.options = $.extend({}, set.DEFAULTS, options);
    this.ini();
  }

  set.DEFAULTS = {
    trigger: ".get",
    rowBlock:4,
    'js_array' : {
         "superslide":"/js/jquery.SuperSlide.2.1.1.js"
    }
  }	
  
  set.prototype.ini = function (){
    var that = this;
    that.options = $.extend({},that.options,{deviceType:that.device()})

    var box = that.container.find(".box");
    var brandName = this.options.brandName || "组件";
    var rowNum = this.options.rowBlock;
    var bn_temp_array = [];
    var node_array = [];
    var count = 0;
    //box数量 = 组件数量；
    var boxNum = box.length;
    var className = 'block block-'+rowNum+'';
    
    box.each(function(i,e){
      var bn = $(e).attr("data-block") || rowNum;
          if(bn){
            var classNameNew = 'block block-'+bn+'';
            $(e).wrap(function() {
                   return "<div class='"+ classNameNew +"'></div>";
            });
            if($.inArray(bn, bn_temp_array) == -1){
                node_array[bn] = [] ;
                node_array[bn].push($(e).parent(".block"));                
                bn_temp_array.push(bn);   
            }else{
                if(node_array[bn])
                node_array[bn].push($(e).parent(".block"));
            }
          }
    })
    for(var i = 0 ;i<node_array.length;i++){
       if(node_array[i]){that.divide(node_array[i],i);}
    }
    var block = that.container.find(".block");


//开头的brand    写组件名
    $(".brandName ").html(brandName);
    
  	if(box.length != 0){
  		var btnRow = $('<div class="headRow clear"><span class="button btn-r-m bg-pink white float-l get"><img style="margin-top: -3px;" src="/img/icon_w.png" class="icon">Get!</span></div>')	
  		box.before(btnRow);
      block.each(function(index,ele){
        var status = that.haveTag($(ele));
        var s = status.script;
        var p = status.plugin;
        var mt = $(box[index]).data("fixed")=="top";
        var caseName = status.caseName; 
        var stag ;
        var ptag,caseNameTag;
        var headRow = $(ele).find(".headRow");
            headRow.css("margin-top",mt?"50px":"");
/*添加标签*/

        s?(
          stag = $("<span class='tag button green'>Javascript</span>"),  
          headRow.append(stag)):"";

        //因为调用插件方法，可能会改变文档结构，所以先获取插件调用前的html。  
        p?(
          ptag = $("<span class='tag button green'>"+p+"</span>"),
          caseNameTag = $("<span class='tag button green'>"+caseName+"</span>"),
          headRow.append(ptag,caseNameTag),
          that.originalH.push($(ele).find(".box").clone().find("script").remove().end().html()),
          $.getScript(that.options.js_array[p],function(){window[caseName]()})
          
          )
        :"";
      })
  		$.getScript("/js/getHCJ.js",function(){
  			  that.modalWindow();
  		});
  		
  	}
  }

  set.prototype.divide = function(a,rn){
    var that = this;
    var b_array = [];
    var b_box = $("<div id=c"+rn+"></div>");
//页面布局成几行几列 start
    for(var i=0;i< a.length;i+=rn){
        b_array.push(a.slice(i,i+rn));
    }

    $.each(b_array,function(index,value){
        var row = b_array[index];
        var $line = $("<div class='line'></div>");
        $.each(row,function(i,v){
            $(v).appendTo($line)
        });
        $line.appendTo(b_box)
    })
    b_box.appendTo(that.container)
  }

  set.prototype.haveTag = function($block){
    var script = $block.find("script").length != 0 ;
    var plugin = $block.find("[data-plugin]").attr("data-plugin") || undefined;
    var caseName = $block.find("[data-plugin]").attr("data-p-caseName") || undefined;
    var state = {
      script:script,
      plugin:plugin,
      caseName:caseName
    };

    return state;
  }
  set.prototype.device = function(){
    var d;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && $(window).width()<700 ){
      d="mobile";
    }else{
      d="web";  
    } 
    return d;
  }

  set.prototype.frame = function(num,array,target,module){
      /*num表示几行或几列；
        array表示对这几行或列再分割，
        module表示纵横，即分行/列，
        target表示目标对象，
        如num = 2，array = [2,4],target，module = h表示：
        将target分为2行，分为2格，4格。
      */
      var propertyOne,propertyTwo,className;
          if(module == "v"){propertyOne = "width";propertyTwo = "height"; className = "column"};
          if(module == "h"){propertyOne = "height";propertyTwo = "width";className = "line"};
          var data = {propertyOne : "width",propertyTwo : "height" ,className :"column"};
          //行列
          for(var i=0;i<num;i++){
            $('<div class='+className+'></div>').appendTo(target).css(propertyOne,100/num+'%')
                                                                 .css(propertyTwo,'100%')           
          };
         
          $(target ).addClass('frame');
          var rowColumn= $(target ).children("[class*='"+className+"']");
          
          rowColumn.each(function(index){
            console.log(array[index])
            block(array[index],$(this),module);
          });
      
      function block(num,target,module){
          for(var i=0;i<num;i++){
              $('<div class="block "></div>').appendTo(target)
                                             .css(propertyOne,'100%')
                                             .css(propertyTwo,100/num+'%')
          };
      };
  }
  set.prototype.template = function(jsTag){
        var that = this;
        var isJs = jsTag;
        var isMobile = that.options.deviceType == "mobile";
        var a01,a02,num,direction,
            shell = $('<div id="" class="templateHCJ container-p-15"></div>');
            isJs ?(a01 = ["html","css","js"],a02 = [1,2]):(a01 = ["html","css"],a02 = [1,1]);  
            isMobile ?(num = isJs ? 3 : 2,a02 = isJs ? [1,1,1] : [1,1] , direction = "h" )
                     :(num = 2 , direction = "v" );
            
            that.frame(num,a02,shell,direction); 
            content(shell); 

        var copyBtn = '<div class="copyBtn button btn-num01 margin-l-20" >C</div>';
            var m = $(shell).find(".title").append(copyBtn).end().prop("outerHTML");
            
            $(document).on("click",".copyBtn",function(){
                var text = $(this).parents(".title").siblings(".content").text();
                var title = this.previousSibling.wholeText;
                copyTextToClipboard(title,text);
            })

            function content(s){
                var b = s.find(".block");
                $.each(a01,function(i,e){
                  b.eq(i).append('<div id='+e+'><div class="title">'+e+'</div><div class="content"></div></div>');
                });     
            }
    /*document.execCommand('copy');对input和textarea比较有效，所以还是创建一个隐藏的textarea*/
            function copyTextToClipboard(title,text){
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
                /*赋值，加入dom树，选择*/                  
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();

                try {/*复制*/
                  var successful = document.execCommand('copy');
                  var msg = successful ? 'successful' : 'unsuccessful';
                  layer.msg('Copying '+title+' command was ' + msg);
                } catch (err) {
                  layer.msg('Oops, unable to copy');
                }

                document.body.removeChild(textArea);
              }

        return m;
      
  }  

  set.prototype.modalWindow = function () {
    var that = this;
    
    $(document).on("click",that.options.trigger,function(){
  		  var $trigger = $(this);
        //判断是否有js tag标签
        var jsTag = that.haveTag($trigger.parents(".block")).script
        
        var deviceType = that.device();
        
        var modal = that.template(jsTag);

        var areaWeb = ['800px','600px'],
            areaMobile = [$(window).width()*.9+'px',$(window).height()*.8+'px'],
            areaConfig = deviceType == "mobile" ? areaMobile : areaWeb;
            
  		  layer.open({
  			  type: 1,
  			  skin: 'demo-class',  //给弹窗添加特殊的class设置样式
  			  area: areaConfig,
          title:false/*"HCJ"*/,
  			  shadeClose: true,    //点击遮罩关闭
  			  content:modal,
  		  	success: function(layero, index){
  			    		 $trigger.getHCJ({
                                  oh:that.originalH,
                                  trigger:that.options.trigger
                 });
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

