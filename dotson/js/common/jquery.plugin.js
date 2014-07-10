/*
 * 得到绝对宽度、高度
 *$('#test').offsetWidth();
 *$('#test').offsetHeight();
 *
 **/
(function($){$.fn.offsetWidth = function(){return $(this)[0].offsetWidth;};$.fn.offsetHeight = function(){return $(this)[0].offsetHeight;};})(jQuery);
