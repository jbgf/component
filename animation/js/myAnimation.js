  $(function(){
        $.fn.extend({
                        animateCss: function (animationName,callBack){
                            
                            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                            $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                          //      $(this).removeClass('animated ' + animationName);
                                if (!callBack) return;
                                callBack();
                            });
                        }
                    });

        var jump = function(){
                    location.href = "http://www.baidu.com";
            };
        var animation = (function(selector,callBack){
            
/*点击触发动画*/                
            $(".animation_select").click(function(){
                $(this).is("a")

                var $move_module = $(selector);
                var animation = $(this).attr("data-animation");
                $move_module.animateCss(animation,callBack);
                return false;
            });
/*页面载入初始动画*/            
            $(selector).animateCss("bounce");
        })("body"/*,jump*/);
         
        })