


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
         "superslide":{url:"/js/jquery.SuperSlide.2.1.1.js"},
         "swiper":{url:"/js/swiper.min.js"},
         "affix-m":{url:"/js/affix-m.js"},
         "affixBeta":{url:"/js/affixBeta.js"},
         "bootstrap":{url:"/js/bootstrap.min.js"},
         "equalHeights":{url:"/js/equalHeights.js"},
         "modalBox":{url:"/js/modalBox.js"},
         "glide":{url:"/js/glide.min.js"},
         "hammer":{url:"/js/hammer.min.js"},
         "jQuery.validator":{url:"/js/jquery.validate.js"},
         "tooltip":{url:"/js/tooltip.js"},
        "videojs":{url:"/js/videojs.js"}

    },
    'css_array': {
         "swiper":"/css/swiper.min.css",
         "modalBox":"/css/modalBox.css",
         "glide":"/css/glide.core.css",
        "videojs":"/css/videojs.css"

    }
  }	
  
  set.prototype.jsPlugin = function(pname,fname){

    var that = this;
    var c = false, /*js加载完成；*/
        i = false; /*js开始准备加载*/
    var a = pname.split(";");

    var jsA = that.options.js_array;
    var jsTemp = [];
      for(var k = 0;k<a.length;k++){
        Array.prototype.push.call(jsTemp,jsA[a[k]])
      };

    i = Array.prototype.every.call(jsTemp,function(v){
      return v?v.ini:false;
    });

    if(i){
      //直接用setTimeout(window[fname],0),有时会不灵
      if(fname)callUntil(fname)();
/*加载js，css*/
    }else{

      var d = getJs(a);
      if(d){
        d.done(function(){
            
            pname in that.options.css_array ?
            $("head").append('<link class="ui" rel="stylesheet" type="text/css" href='+that.options.css_array[pname]+'>'):"";
            if(fname)window[fname]();
            for(var i in a){
              jsA[a[i]].compelete = true;
            } 
        });
        
      }else{

      window[fname]();}
    }
    
    function getJs(array){
      var diff,ua = []; 
          
          for(var i = 0;i< array.length;i++){
            
            var u = jsA[array[i]].url;

            ua.push($.getScript(u));
            jsA[array[i]].ini = true;
          } 
          diff = $.when.apply($,ua);
       
      return diff;
    }

    //递归直到完成插件js+css的载入才调用函数；
    function callUntil(callBack){
      c = Array.prototype.every.call(jsTemp,function(v,i){
        return v.compelete;
      });
      return function(){if(c){window[callBack](); }else{setTimeout(callUntil(callBack),100);}}
    }
  }

  set.prototype.ini = function (){
    var that = this;
        that.options = $.extend({},that.options,{deviceType:that.device()});
    var box = that.container.find(".box");
    var brandName = this.options.brandName || "组件";
    var rowNum = this.options.rowBlock;
    var bn_temp_array = [];
    var node_array = [];    

//开头的brand    写组件名
    $(".brandName ").html(brandName);
    box.each(function(i,e){
        
        var bn = $(e).attr("data-block") || rowNum;
          if(bn){
            /*var classNameNew = 'block block-'+bn+' frameBlock';*/
            var classNameNew = 'block row-'+bn+'-block frameBlock';


            $(e).wrap(function() {

                   return "<div class='"+ classNameNew +"'></div>";
            });
            if($.inArray(bn, bn_temp_array) == -1){
                node_array[bn] = [] ;
                node_array[bn].push($(e).parent(".frameBlock"));                
                bn_temp_array.push(bn);   
            }else{
                if(node_array[bn])
                node_array[bn].push($(e).parent(".frameBlock"));
            }
          }
        var block = $(e).parents(".frameBlock").wrapInner("<div class='innerBlock'></div>");
        var btnRow = '<div class="headRow clear"><span class="button btn-r-m bg-pink white float-l get"><img style="margin-top: -3px;" src="/img/icon_w.png" class="icon">Get!</span></div>';  
        var status = that.haveTag(block);
        var s = status.script;
        var p = status.plugin ;
        var tit = status.title;
        var des = status.des;
        /*status.plugin.indexOf(";")*/

        var u = status.ui;
        var position = status.fixedPosition;
        var t = status.type;
        $(e)[position == "top" ? "after" : "before" ](btnRow);
        
        var caseName = status.caseName; 
        var stag,ptag,uiTag,caseNameTag,typeTag,tagLine = "";
        var titlestring = "",describestring = "";
/*添加标签*/
        u?(tagLine += uiTag = "<span class='tagFrame tag-blue blue'>UI: "+u+"</span>"):"";
        s?(tagLine += stag = "<span class='tagFrame jsTag tag-green green'>Javascript</span>"):"";
        tit?(titlestring = "<span class='tagFrame tag-blue blue'>title:"+tit+"</span>",
             tagLine += titlestring)
            :"";
        des?(describestring = "<span class='tagFrame tag-blue white bg-black'>Describe| "+des+"</span>",
            tagLine += describestring)    /*描述标签*/
            :"";

        //因为调用插件方法，可能会改变文档结构，所以先获取插件调用前的html。  
        p?(
          tagLine += ptag = "<span class='tagFrame  tag-red  red'>"+p+"</span>",
          tagLine += caseNameTag = "<span class='tagFrame tag-red  red'>"+caseName+"</span>",
          
          p in that.options.css_array 
          ?tagLine += uiTag = "<span class='tagFrame tag-blue blue'>UI: "+p+"</span>"
          : " ",  

          that.jsPlugin(p,caseName)
         
          )
        :"";
        t?tagLine += typeTag = "<span class='tagFrame typeTag tag-black black'>type: "+t+"</span>":"";

        var headRow = block.find(".headRow");
            headRow.css("margin-top",position == "top"?"30px":"");
        if(tagLine !="")headRow.append(tagLine);

    })
/*分行分列*/
    for(var i = 0 ;i<node_array.length;i++){
       if(node_array[i]){that.divide(node_array[i],i);}
    }
/*因为分行分列后dom布局改变，重新遍历frameBlock*/
    $(".frameBlock").map(function(index,e){
      that.originalH.push($(e).children(".innerBlock").clone().find("script,.headRow").remove().end().html());
      that.switchPlugin(e);
    });
  	that.tip();
    if(box.length != 0){
  		$.getScript("/js/getHCJ.js",function(){
  			  that.modalWindow();
  		});
  	}
  }
  
  set.prototype.listen_scroll = function(fb,type_array_name){
    var s = true,
        that = this;

    addWheelListener(fb, function( e ){
        /*一段时间内只执行一次*/
        var dy = e.deltaY;
        s
        ?(call_f(fb,dy,type_array_name),
          s = false,
          setTime(1000))
        :"";
         
        e.preventDefault();
    });

    function setTime(time){
       setTimeout(function(){s = true;},time)
    }
    function call_f(fb,dy,type_array_name){
        var a = that[type_array_name];
        if(a.length <=1)return;
        var i = a.indexOf(fb),
            l = a.length,
            activeIndex;
        dy > 0 ? 
               i == l-1 ? activeIndex = 0 : activeIndex = i + 1
               :
               i == 0 ? activeIndex = l-1 : activeIndex = i - 1;
        a[activeIndex].className +=" on";
        a[i].className = a[i].className.replace("on","");
    }
  }
  set.prototype.switchPlugin = function(fb){
    var t = $(fb).find("[data-type]");
    var a = t.attr("data-type");
    var type_array_name = a+'_a';
    
    /*affix_right*/
    if( a == "affix_right" ){
      $(fb).addClass("switchHide");
      this[type_array_name].push(fb);
      this.listen_scroll(fb,type_array_name);
      
    }
  }

  set.prototype.tip = function(fb){
    var a = "affix_right";
    var type_array_name = a+'_a';
    var array = this[type_array_name];
    if(array && array.length>1){
      array[0].className+=" on";

      $.each(this[type_array_name],function(index, el) {
         $(el).mouseover(function(event) {
           /*alert('TEST')*/
         });
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
        var $line = $("<div class='rows'></div>");
        $.each(row,function(i,v){
            $(v).appendTo($line)
        });
        $line.appendTo(b_box)
    })
    b_box.appendTo(that.container)
  }

/*根据tag即data-属性来给组件分类*/
  set.prototype.haveTag = function($block){
    var script = $block.find(".jsTag").length != 0 || $block.find("script").length != 0;
    var plugin = $block.find("[data-plugin]").attr("data-plugin") || undefined;
    var title = $block.find("[data-title]").attr("data-title") || undefined;
    var des = $block.find("[data-des]").attr("data-des") || undefined;
    var caseName = $block.find("[data-plugin]").attr("data-p-caseName") || undefined;
    var fixedPosition = $block.find("[data-fixed]").attr("data-fixed") || undefined;
    var ui = $block.find("[data-ui]").attr("data-ui") || undefined;
    var type = $block.find("[data-type]").attr("data-type") || undefined,type_array;
        if(type){
          type_array = type+'_a';
          /*不可以用this.type_array来新建数组*/
          if(!this[type_array]){this[type_array] = [];}    /*新建类别数组；*/
        }
     
    /*data-ui 类似bootstrap这种*/
    var state = {
      script:script,
      plugin:plugin,
      caseName:caseName,
      fixedPosition:fixedPosition,
      ui:ui,
      type:type,
        title:title,
        des:des
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
          if(module == "h"){propertyOne = "height";propertyTwo = "width";className = "row02"};
          var data = {propertyOne : "width",propertyTwo : "height" ,className :"column"};
          //行列
          for(var i=0;i<num;i++){
            $('<div class='+className+'></div>').appendTo(target)
                                                .css(propertyOne,100/num+'%')
                                                .css(propertyTwo,'100%')
                                                .css("float","left")
          };
         
          $(target ).addClass('frame');
          var rowColumn= $(target ).children("[class*='"+className+"']");
          
          rowColumn.each(function(index){
           
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
  set.prototype.copyBoard = function(jsTag){
        var that = this;
        var isJs = jsTag;

        var isMobile = that.options.deviceType == "mobile";
        var a01,a02,num,direction,toggleBtn,
            shell = $('<div id="" class="templateHCJ padding-t-15"></div>');
            isJs ?(a01 = ["html","css","js"],a02 = [1,2]):(a01 = ["html","css"],a02 = [1,1]);  
            if(isMobile){
              num = isJs ? 3 : 2;
              a02 = isJs ? [1,1,1] : [1,1] ;
              direction = "h";
              toggleBtn = '<span class="toggleBtn01 button float-r blue">【详细】</span>';
              shell.addClass("mobile");

              $(document).off("click.toggle").on("click.toggle",".toggleBtn01",function(){
                  /*shell 点击按钮是，页面已加载shell；*/
                  var content = $(this).closest(".block").find(".content");
                      content.toggleClass("open");                 
              })
            }
            else{
              num = 2 ; 
              direction = "v" ;
            };
               
            that.frame(num,a02,shell,direction); 
            var m = content(shell); 
            
            $(document).off("click.copy").on("click.copy",".copyBtn",function(){
                
                var text = $(this).parents(".title").siblings(".content").text();
                var title = this.previousSibling.wholeText;
                copyTextToClipboard(title,text);
            })

            function content(s){
                var b = s.find(".block");
                var copyBtn = '<div class="copyBtn button btn-num01 margin-l-20" >C</div>';
                var titleBtnRow = copyBtn + (toggleBtn || '');

                $.each(a01,function(i,e){
                  b.eq(i).append('<div id='+e+'><div class="title">'+e+titleBtnRow+'</div><div class="content"></div></div>');
                });
                return $(shell).prop("outerHTML");     
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
                  layer.msg('Copying '+title+' command was ' + msg );
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
        var i = $(that.options.trigger).index($trigger);

        var deviceType = that.device();
        
        var modal = that.copyBoard(jsTag);

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
                                  oh:that.originalH[i],
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

