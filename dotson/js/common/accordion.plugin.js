(function($){
    $.fn.Accordion = function( options ){
        var defaults = {
        };
        var $this = $(this),
            //全部li
            $li = $this.children("li"),
            //全部标题栏
            $triggers = $li.children("a"),
            //全部内容
            $frames = $li.children("div");
        var initTriggers = function(triggers){
            triggers.unbind('click').bind('click', function(e){
                e.preventDefault();
                var $a = $(this),
                    target = $a.parent('li').children("div");
                if ( $a.parent('li').hasClass('active') ) {
                	//如果是开启状态就关闭
                    target.slideUp();
                    $a.parent("li").removeClass("active");
                } else {//如果是关闭状态就开启
                	//全部内容的都收起
                    $frames.slideUp();
                	//全部的li去掉样式
                    $li.removeClass("active");
                	//目标内容展开
                    target.slideDown();
                    $a.parent("li").addClass("active");
                }
            });
        }
        return this.each(function(){
            if ( options ) {
                $.extend(defaults, options)
            }
            initTriggers($triggers);
        });
    }
})(window.jQuery);