 var clinetH = 0,
     clinetW = 0,
     album={
     	 currentNum:1,
     	 width:0,
     	 height:0,
     	 totalPages:1
     },
     rightQuickPanelPos={},
     currentQuickAppPos={},
     installedAppArr=[],
     uninstallAppArr=[],
     staticInstalledAppArr=[{colspan:1},{colspan:2},{colspan:1},{colspan:1},{colspan:2},{colspan:1},{colspan:2},{colspan:1},{colspan:2},{colspan:1}];
function showAppPanel() {
    $('#rightSliderPanel').animate({
        width: 300,
        height: clinetH,
        opacity: 0.5
    }, 300, function () {
        $(this).css({
            opacity: 1
        });
        appBtnBindAnimate();
        appBtnBindClick();

    });
};

function closeAppPanel() {
    $('#rightSliderPanel').animate({
        width: 0,
        height: "100%",
        opacity: 0
    }, 300,appBtnUnBindAnimate);



};
function quickBtnBindEvent(){
	var lastDivDom=$('#quickContainer ul li div:last')[0];
	currentQuickAppPos.top=lastDivDom.offsetTop;
	currentQuickAppPos.left=lastDivDom.offsetWidth+lastDivDom.offsetLeft+10;
	$('#quickContainer ul li div').bind('mouseenter',function(e){
		var imgJ=$(this).prev(),
		    
		    w = $(this).width(),
            h = $(this).height(),
            zoomW = w * 0.1,
            zommH = h * 0.1;//.css('z-index','10')
        imgJ.stop(false, true).animate({
        	  zIndex:10,
            width: w * 1.1,
            height: h * 1.1,
            left: zoomW / 2 * (-1),
            top: zommH / 2 * (-1)
        }, 200);
          
		
		
		});
	$('#quickContainer ul li div').bind('mouseleave ',function(e){
		 var imgJ=$(this).prev(),
	        w = $(this).width(),
	            h = $(this).height();//.css('z-index','0')
	        imgJ.stop(false, true).animate({
	        	  zIndex:0,
	            width: w,
	            height: h,
	            left: 0,
	            top: 0
	        }, 200);
		});
};
function quickBtnUnBindEvent(){
	$('#quickContainer ul li div').unbind('mouseenter');
	$('#quickContainer ul li div').unbind('mouseleave');
};
function addBtnBindEvent(){
		$('#addBtnContainer div').bind('mouseenter',function(e){
		var imgJ=$(this).prev(),
		    w = $(this).width(),
            h = $(this).height(),
            zoomW = w * 0.1,
            zommH = h * 0.1;//.css('z-index','10')
        imgJ.stop(false, true).animate({
        	  zIndex:10,
            width: w * 1.1,
            height: h * 1.1,
            left: zoomW / 2 * (-1),
            top: zommH / 2 * (-1)
        }, 200);
		
		
		});
	$('#addBtnContainer div').bind('mouseleave ',function(e){
		 var imgJ=$(this).prev(),
	        w = $(this).width(),
	        h = $(this).height();//.css('z-index','0')
	        imgJ.stop(false, true).animate({
	        	  zIndex:0,
	            width: w,
	            height: h,
	            left: 0,
	            top: 0
	        }, 200);
		});
		
    $('#appback').bind('click', function (e) {
    	 
        closeAppPanel();

    });
    $('#addBtnContainer div').bind('click', function (e) {
    	  $('#appTitle').html('未安装应用');
        showAppPanel();

    })
	};
function removeBtnBindEvent(){
	  $('#removeBtnContainer div').unbind('mouseenter');
		$('#removeBtnContainer div').bind('mouseenter',function(e){
		var imgJ=$(this).prev(),
		    w = $(this).width(),
            h = $(this).height(),
            zoomW = w * 0.1,
            zommH = h * 0.1;//.css('z-index','10')
        imgJ.stop(false, true).animate({
        	  zIndex:10,
            width: w * 1.1,
            height: h * 1.1,
            left: zoomW / 2 * (-1),
            top: zommH / 2 * (-1)
        }, 200);
		
		
		});
	$('#removeBtnContainer div').unbind('mouseleave');
	$('#removeBtnContainer div').bind('mouseleave',function(e){
		 var imgJ=$(this).prev(),
	        w = $(this).width(),
	        h = $(this).height();//.css('z-index','0')
	        imgJ.stop(false, true).animate({
	        	  zIndex:0,
	            width: w,
	            height: h,
	            left: 0,
	            top: 0
	        }, 200);
		});
		
    $('#appback').bind('click', function (e) {
        closeAppPanel();

    });
    $('#removeBtnContainer div').bind('click', function (e) {
    	 $('#appTitle').html('已安装应用');
        showAppPanel();

    })
	};
function appBtnBindAnimate(){
		$('#appContainer ul li div').bind('mouseenter',function(e){
		var imgJ=$(this).prev(),
		    w = $(this).width(),
            h = $(this).height(),
            zoomW = w * 0.1,
            zommH = h * 0.1;//.css('z-index','10')
        imgJ.stop(false, true).animate({
        	  zIndex:10,
            width: w * 1.1,
            height: h * 1.1,
            left: zoomW / 2 * (-1),
            top: zommH / 2 * (-1)
        }, 200);
		
		
		});
	$('#appContainer ul li div').bind('mouseleave ',function(e){
		 var imgJ=$(this).prev(),
	        w = $(this).width(),
	        h = $(this).height();//.css('z-index','0')
	        imgJ.stop(false, true).animate({
	        	  zIndex:0,
	            width: w,
	            height: h,
	            left: 0,
	            top: 0
	        }, 200);
		});
	
	
	}
function appBtnUnBindAnimate(){
		$('#appContainer ul li div').unbind('mouseenter');
	  $('#appContainer ul li div').unbind('mouseleave ');
	}
function appBtnBindClick(){
		$('#appContainer ul li div').bind('click',function(e){
			var imgJ=$(this).prev(),liJ=$(this).parent(),
	        w = $(this).width(),
	        h = $(this).height();
	        imgJ.css('z-index','0');
	        imgJ.stop(false, true).animate({
	            width: 0,
	            height: 0,
	            opacity: 0.5
	            
	        }, 300,function(){
	        	 $(this).css('display','none');
	        	 liJ.animate({
	            width: 0,
	            height: 0,
	            
	          }, 300,function(){
	          	$(this).css('display','none');
	          });
	        	
	        	addApp2QuickPanel(imgJ.attr('id'));
	        	
	        	
	        	});
			
			
			
			});
	
	
}	
function addApp2QuickPanel(id){
	installedAppArr.push({id:id,colspan:1});
  staticInstalledAppArr.push({id:id,colspan:1});
	getAlbumInfo();
	if(album.totalPages>1){
		return null;
		
	}
	$('#quickContainer ul').append('<li class="mimi" attr="dynamic"><img class="mimi" src="img/'+id+'.gif"/><div  class="mimi"></div></li>');
	quickBtnUnBindEvent();
	quickBtnBindEvent();
  $('#quickContainer ul li:last').stop(false,true).fadeIn(500);
  
  
  
}

function removeApp4QuickPanel(id){
	for(var i=0;i<staticInstalledAppArr.length;i++){
		if(staticInstalledAppArr[i].id==id){
		   staticInstalledAppArr.splice(i,1);
		   break;
	  }
	}
	$('#quickContainer ul').append('<li class="mimi" attr="dynamic"><img class="mimi" src="img/'+id+'.gif"/><div  class="mimi"></div></li>');
	quickBtnUnBindEvent();
	quickBtnBindEvent();
  $('#quickContainer ul li:last').stop(false,true).fadeIn(500);
  installedAppArr.push({id:id,colspan:1});
  staticInstalledAppArr.push({id:id,colspan:1});
  getAlbumInfo();
  
}
function getAlbumInfo(){
	var albumDom=$('#quickBtnPanel')[0],colWidth=0,rowNum=1,colNum=0;
	for(var i=0;i<staticInstalledAppArr.length;i++){
		colNum+=staticInstalledAppArr[i].colspan;
		
		if((colNum*130)>album['width']){
			--i;
			rowNum+=1;
			colNum=0;
			console.log(rowNum)
		}
		if((rowNum*130)>album['height']){
			rowNum=0;
			album['totalPages']+=1;
		}
		
	}
	if(album['totalPages']>1){
		//showPrevNextBtn();
		
		}
console.log(album)	
	
	
}
function clearEventBubble(evt){
	evt = evt || window.event;

    if (evt.stopPropagation) {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }

    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
}
function showPrevNextBtn(){
     $('#prevBtn').css({
	   	top:(rightQuickPanelPos.top+40+130)+'px',
	   	left:(rightQuickPanelPos.left-50)+'px'
	   	});
	   $('#nextBtn').css({
	   	top:(rightQuickPanelPos.top+40+130)+'px',
	   	left:(rightQuickPanelPos.left+5*130+10)+'px'
	   	
	   	});	
}
function onReady() {
	  document.oncontextmenu=function(evt){
	  	clearEventBubble(evt)
	  }
	  
    clinetH = $(window).height();
    clinetW = $(window).width();
    $('#maincontainer').css({
        height: clinetH + 'px',
        width: clinetW + 'px'

    });
    $('#rightQuickPanel').css({
        height:clinetH*0.6 + 'px',
        width:clinetW*0.75*0.8+'px'

    });
    
     console.log('----'+document.getElementById('quickContainer').offsetLeft)
     album['width']=$('#rightQuickPanel').width();
     album['height']=$('#rightQuickPanel').height();
     rightQuickPanelPos={
     	  top:$('#quickContainer').get(0).offsetTop,
     	  left:$('#quickContainer').get(0).offsetLeft
     	
     	
     	};
      
     quickBtnBindEvent();
     addBtnBindEvent();
     removeBtnBindEvent();
     getAlbumInfo();
     
    
   
};
/*
$(function () {
    onReady();
});
*/
$(document).ready(function(){
　onReady();
});