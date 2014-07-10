/***
 * 原创鼠标悬浮气泡提示Jquery插件
 * author LLJ
 * version:1.0
 ***/
$(function() {
	$.fn.hoverTips = function(options) {
		var defaults = {
			position : "t",			//箭头指向上(t)、箭头指向下(b)、箭头指向左(l)、箭头指向右(r)
			value : 0				//小箭头偏离左边和上边的位置
		};
		var options = $.extend(defaults,options);
		//目标对象
		var $this = $(this),
		     id=$this.attr('id'),
		     //tips框对象
		     $btip = $('#gv-hovertip'),//$('#'+id+'-hovertip'),
		     offset,h ,w ;
		$this.unbind("mouseenter").bind("mouseenter",function(){
			var tips=$(this).attr("tips");
			if(!tips){
				return false;
			}
			creatTipDiv(id);
			$(".hover-inner").html(tips);
			offset = $(this).offset();
			h = $btip.height();
			w = $btip.width();
			switch(options.position){
				case "t" ://当它是上面的时候
					$(".hover-triangle-t").css('left',options.value);
					$btip.css({ "left":offset.left  ,  "top":offset.top+25 });
					break;
				case "b" ://当它是向下的时候(ff、IE、Chrome已调试)
					var tempLeft=offset.left+($this.width()/2)-(w/2);
					var triangleLeft=options.value+(w/2)-10;
					var absoluteLeft=$(this).get(0).offsetLeft;
					var diffW=tempLeft+w-$(window).width();
					//超出右边界的算法
					if($(window).width()<tempLeft+w){
						tempLeft-=diffW;
						triangleLeft+=diffW;
					}
					//箭头
					$(".hover-triangle-b").css('left',triangleLeft);
					//TIps框
					$btip.css({ "left":tempLeft ,  "top":offset.top-h-10+10});
					break;
				case "l" ://当它是左边的时候
					$(".hover-triangle-l").css('top',options.value);
					$btip.css({ "left":offset.left+10+$this.width()  ,  "top":offset.top-h/2 });
					break;
				case "r" ://当它是右边的时候
					$(".hover-triangle-r").css('top',options.value);
					$btip.css({ "left":offset.left-10-w  ,  "top":offset.top-h/2 });
					break;
			}
			show($btip);

		});
		$this.unbind("mouseleave").bind("mouseleave",function(){
			$btip.stop(true,true).fadeOut(300,function(){
				$btip.remove();
			 });
		});
		function show(o){
			o.stop(true,true).hide().delay(500).fadeIn(500).delay(3800).fadeOut(300,function(){
			 	o.remove();
			 });
		}
		function dom(id){
		   return document.getElementById(id);
		}
		function creatTipDiv(id){
			var divId='gv-hovertip';
			if($('#'+divId)[0]){
				$('#'+divId).remove();
			}
			$btip=$('<div class="gv-hover-tips" id="'+divId+'"><div class="hover-con"><i class="hover-triangle-'+options.position+'"></i><div class="hover-inner"></div></div></div>');
			$("#main").append($btip);
		}
	}
});