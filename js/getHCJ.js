
+function ($) {
  'use strict';

  function getHCJ(element, options) {
       //传入的triggerbtn
       this.triggerBtn = $(element);
       this.options = options;
       this.box = this.triggerBtn.parent().siblings(".box");
       this.script = this.box.find("script").detach().html();

  }

  getHCJ.DEFAULTS = {
       
  }	
  getHCJ.prototype.getSelector = function(_relatedTarget){
  	   //获取box元素
       
  	   //获取box元素内的html
       var box = this.box;
       this.getH(box);
       this.getC(box);
       this.getJ(box);
       
  }
  
  getHCJ.prototype.getH = function (box){
    var that = this;
	  var html = this.options.oh.length>0 ? this.options.oh
               :box.html();
          
	  $("#html .content").text(html);

  }

  getHCJ.prototype.getC = function(box){
    var that = this;
    var cssDiv = $("#css .content");
    var css = {
        allNode:function(){
            
            var $node = box[0].querySelectorAll("*");
            return $node;
        },
        readCss:function(a){
           
            var sheets = document.styleSheets, 
                o = [];

            /*function getPseudo(a){
                console.log(a)
                var after = window.getComputedStyle(a,":after");
                var before = window.getComputedStyle(a,":before");

            }
            getPseudo(a);*/
            a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector;
            //不要base.css,从1开始。
            for (var i = 1; i < sheets.length; i++){
                var rules = sheets[i].rules || sheets[i].cssRules;
            //不要ui库的样式表，不要本插件使用的弹窗插件layer的样式表      
                if(
                  sheets[i].ownerNode.className == "base" ||
                  sheets[i].ownerNode.className == "ui" || 
                  sheets[i].ownerNode.id == "layui_layer_skinlayercss"
                  ){continue}
                for (var r in rules){
                    if (a.matches(rules[r].selectorText)){
                        o.push(rules[r].cssText);
                    }
                }
            }
            
            if(o.length>0){return o}


        }

    }
		
		function writeCss(){
          var s = css.allNode();
          var tra = [];
          Array.prototype.map.call(s,function(v){

            var c = css.readCss(v);

            if(c){
              for(var j = 0 ;j<c.length;j++){
                  //非重复
                  if(tra.indexOf(c[j]) == -1){
                        tra.push(c[j]);
                        cssDiv.append(c[j]+'<br>');
                  }
                  
              }      
            }

          })
		};

	  writeCss(); 
    
  }
  getHCJ.prototype.getJ = function (box) {
    var that = this;
	  var jsDiv = $("#js .content"); 
	  var scriptText = that.script;
   
    jsDiv.append(scriptText);
	   
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

  //  DATA-API
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
    /*this即是Plugin定义中的_relatedTarget参数,
    带有[data-toggle="getHCJ"]的触发按钮*/
    Plugin.call($target, option, this)  
  })

}(jQuery);						

						
						
						
						
						

						