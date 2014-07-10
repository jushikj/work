(function ($) {
    $.fn.drag = function (options) {
        var defaults = {
            handler: false,
            opacity: 0.5
        },
            domPos = {};
        var opts = $.extend(defaults, options);
        this.each(function () {
            var isMove = false,
                handler = opts.handler ? $(this).find(opts.handler) : $(this),
                _this = $(this),
                dx, dy;
            $(document).mousemove(function (event) {
                if (isMove) {
                    var eX = event.pageX,
                        eY = event.pageY;
                    domPos['left'] = eX - dx;
                    domPos['top'] = eY - dy;
                    _this.css({
                        'left': eX - dx,
                        'top': eY - dy
                    });
                }
               // return false;
            }).mouseup(function () {
                isMove = false;
                var flag = false,
                    _thisDom = _this.get(0);
                _this.fadeTo('fast', 1);
                if (domPos.left < 0) {
                    domPos.left = 0;
                    flag = true;
                }
                if (domPos.top < 0) {
                    flag = true;
                    domPos.top = 0;
                }
                if (domPos.left + _thisDom.offsetWidth > Gv.clientW) {
                    flag = true;
                    domPos.left = Gv.clientW - _thisDom.offsetWidth;
                }
                if (domPos.top + _thisDom.offsetHeight > Gv.clientH) {
                    flag = true;
                    domPos.top = Gv.clientH - _thisDom.offsetHeight ;
                }


                if (flag) {
                    _this.animate({
                        top: domPos.top + 'px',
                        left: domPos.left + 'px'
                    }, 300);
                }
            });
            handler.mousedown(function (event) {
                if ($(event.target).is(handler)) {
                    isMove = true;
                    $(this).css('cursor', 'move');
                    if (opts.dragEvent && $.isFunction(opts.dragEvent)) {
                        opts.dragEvent();
                    }
                    _this.fadeTo('fast', opts.opacity);
                    dx = event.pageX - parseInt(_this.css("left"));//
                    dy = event.pageY - parseInt(_this.css("top"));//
                }
                //return false;
            });
        });
    };
})(jQuery);
/**
 *弹出窗口组件
 *@author LLJ
 *@version 1.0.0
 * cfg
 * cfg{}id
 * cfg{}title
 * cfg{}html string
  * cfg{}style string //window 整体样式
  * cfg{}bodyStyle string //window 中部Body样式
 * cfg{}size  string 快速设置窗口尺寸small、normal、big
 * cfg{}load string 加载路径
 * cfg{}closable 是否允许关闭窗口，默认为true
 * cfg{}zIndex int，默认为100
 * cfg{} tbar array
 * listeners:{
 *  beforeDrag
 *  afterLayout
 *  beforeScroll
 *  close
 * }
 */
Gv.Window=function(opt){
	this.cfg={
		    id:'',
    	    height:'',
    		width:'',
    		top:'',
			left:'',
            title:'',
            size:'small',
            style:'',
            bodyStyle:'padding:10px;',
            contentWrap:'',
            html:'',
             items:[],
             closable:true,
             zIndex:9999,
             listeners:{}
    };
	this.tbarIds=[];
	this.win=null;
	this.winTop=null;
	this.winContent=null;
	this.winTbar=null;
	this.cfg.id='window-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,this.cfg,opt);
	this.setSize();
	this.display();
	this.bindFocus();
	this.bindWindowScroll();
}
Gv.Window.prototype.display=function(){
    var me=this,tbar = '',closeStr,titleStr;
    if (!Gv.isEmpty(this.cfg.tbar)) {
        tbar += '<div id="' + this.cfg.id + '-tbar" class="tbar">';
        if (this.cfg.tbar.length > 0) {
            for (var i = 0; i < this.cfg.tbar.length; i++) {
            	var btnId=this.cfg.id + '-btn-' + i;
            	this.tbarIds.push(btnId);
                tbar += '<a id="' + btnId + '" class="button" href="javascript:void(0);">' + this.cfg.tbar[i].text + '</a>';
            }
            tbar += '</div>';
        }
    }
    Gv.mask(true,this.cfg.id+'-mask',this.cfg.zIndex-1);
    var titleW=typeof this.cfg.width=='string'?(250-40):( this.cfg.width-40);
    closeStr=this.cfg.closable===true?'<span id="'+this.cfg.id+'-window-close" class="close" ><i class="icon-remove-sign"></i></span>':'';
    titleStr='<div id="'+this.cfg.id+'-window-title"  class="title" style="width:'+titleW+'px;cursor: move;">'+this.cfg.title+'</div>';
    this.winTop=$( '<div class="top">'+titleStr+closeStr+'</div>');
    if(!Gv.isEmpty(this.cfg.maxHeight)){
    	this.winContent=$( '<div class="content-wrap" style="'+this.cfg.contentWrap+'"><div class="content" style="width:'+this.cfg.width+'px;'+this.cfg.bodyStyle+'">'+this.cfg.html+'</div></div>').height(this.cfg.height).width(this.cfg.width+20).css({maxHeight:this.cfg.maxHeight});
    }else{
    	this.winContent=$( '<div class="content-wrap" style="'+this.cfg.contentWrap+'"><div class="content" style="width:'+this.cfg.width+'px;'+this.cfg.bodyStyle+'">'+this.cfg.html+'</div></div>').height(this.cfg.height).width(this.cfg.width+20).css({maxHeight:480});
    }
    if(this.cfg.load){
    	if(this.cfg.load.indexOf('?') > -1){
    		this.cfg.load += "&nocache="+new Date().getTime();
    	}else{
    		this.cfg.load += "?nocache="+new Date().getTime();
    	}
    	this.winContent.find('.content').load(this.cfg.load);
    }
    //增加时间戳防止页面缓存
    this.winTbar=$('<div class="tabar" >'+tbar+'</div>');
    this.win=$('<div id="' + this.cfg.id + '" class="frame-window" style="'+this.cfg.style+'"  />').append(this.winTop).append(this.winContent).append(this.winTbar);
    Gv.main().append(this.win);
    if(!Gv.isEmpty(this.cfg.items)){
    	 for(var i=0;i<this.cfg.items.length;i++){
    	 	var itm=this.cfg.items[i];
    	 	 this.winContent.find('.content').append(itm.build());
    	 }

    }
    var h=Gv.get(this.cfg.id).height()?Gv.get(this.cfg.id).height():Gv.getHeight(this.cfg.id);
    var top=this.cfg.top?this.cfg.top:((Gv.clientH-h)/2);
    this.win.css({
    	zIndex:this.cfg.zIndex,
    	width:this.cfg.width+40,
    	top:top,
	    //marginTop:(-this.cfg.height/2) - 50,
    	left:this.cfg.left?this.cfg.left:(Gv.clientW-(typeof this.cfg.width=='string'?250:this.cfg.width))/2
	    //marginLeft:- this.cfg.width / 2 ,
    }).fadeIn(Gv.time5,function(){
    	if(!Gv.isEmpty(me.cfg.listeners)){
        	if($.isFunction(me.cfg.listeners.afterLayout)){
        		me.cfg.listeners.afterLayout();
        	}
        }
    });
   this.bindClose();
    this.bindTbar();
    this.buildDrag();
    this.winContent.mCustomScrollbar({
		advanced:{
			updateOnContentResize: true,
			updateOnBrowserResize: true,
			autoScrollOnFocus:false
		},
		scrollButtons:{
			enable:true
		},
		theme:"dark-thin",
		autoHideScrollbar:true
	});
};
Gv.Window.prototype.setSize=function(){
	if(!Gv.isEmpty(this.cfg.size)&&Gv.isEmpty(this.cfg.width)){
		if(this.cfg.size=='small'){
			this.cfg.width=350;
			this.cfg.height=150;
		}else if(this.cfg.size=='normal'){
			this.cfg.width=600;
			this.cfg.height=240;
		}else if(this.cfg.size=='big'){
		    this.cfg.width=900;
			this.cfg.height=480;
		}
	}
};
/**
 * 绑定Tbar
 */
Gv.Window.prototype.bindTbar=function(){
	var me=this;
	 if (!Gv.isEmpty(this.tbarIds)) {
	        for (var i = 0; i < this.tbarIds.length; i++) {
	            Gv.get( this.tbarIds[i]).bind('click',{},function(){
	            	var id=$(this).attr('id');
	            	var index=id.split('-btn-')[1];
	            	me.cfg.tbar[index].handler(id);
	            });
	        }
	    }
};
Gv.Window.prototype.bindClose=function(){
	var me=this;
	Gv.get(this.cfg.id+'-window-close').unbind('click');
	Gv.get(this.cfg.id+'-window-close').bind('click',function(){
		me.close();
	});
};
Gv.Window.prototype.bindFocus=function(){
	 if (Gv.isArr(this.tbarIds)) {
		 Gv.log("bindFocusbindFocus")
	     Gv.get( this.tbarIds[0]).focus();
	}
};
/**
 * 绑定Scroll
 */
Gv.Window.prototype.bindWindowScroll=function(){
	var me=this;
	if(!me.cfg.listeners){
		me.cfg['listeners']={};
	}
	$(window).bind('scroll',function(e){
		if($.isFunction(me.cfg.listeners.beforeScroll)){
			me.cfg.listeners.beforeScroll();
		}
	});


};
/**
 * 取消Scroll绑定
 */
Gv.Window.prototype.unbindWindowScroll=function(){
	$(window).unbind('scroll');
};

/**
 * 弹出窗口内容HTML（获取或设置）
 * */
Gv.Window.prototype.html=function(h){
	//Gv.get(this.cfg.id + '_content').html(h);
	this.winContent.html(h);
    //return Gv.dom(this.cfg.id + '_content').innerHTML;
    return this.winContent.html();
};
Gv.Window.prototype.close=function(){
	if(!this.cfg.listeners){
		this.cfg['listeners']={};
	}
	if($.isFunction(this.cfg.listeners.close)){
		this.cfg.listeners.close();
	}
	this.unbindWindowScroll();
    //Gv.get(this.cfg.id).remove();
    this.win.remove();
    Gv.mask(false,this.cfg.id+'-mask',this.cfg.zIndex-1);

};
Gv.Window.prototype.buildDrag=function(){
	var me=this;
	if(!me.cfg.listeners){
		me.cfg['listeners']={};
	}
	//Gv.get(this.cfg.id)
    this.win.drag({
    	handler:$('#'+me.cfg.id + '-window-title'),
    	opacity: 0.8,
    	dragEvent:me.cfg.listeners.beforeDrag
    });
};


//=========ResouceGroupSelecter=====

/**
 *组资源选择器
 *@author LLJ
 *@version 1.0.0
 * cfg
 * cfg{}resTreeUrl   资源树后台路径
 * cfg{}groupTreeUrl  组资源树后台路径
 * cfg{}actionHandler   提交后台使用的Handler(resArr,groupId,type)
 * resArr 资源ID Arr
 * groupId 组资源Id
 * type 操作类型 ‘add /delete’
//保存时调用的Handler 有两个参数 resId Array;groupId String
 */

 Gv.ResouceGroupSelecter=function(opt){
 	Gv.resouceGroupSelecterUrl={
 	    actionHandler:null,
 		resTreeUrl:opt.resTreeUrl,
 		groupTreeUrl:opt.groupTreeUrl
 	};
 	$.extend(true,Gv.resouceGroupSelecterUrl,opt);

 	//var path=Gv.hostPath?Gv.hostPath+'/js/plugin/window/resource-group-selector.jsp':'js/plugin/window/resource-group-selector.jsp';
 	var path='/pageframe/main/groupSelectorPageTo.action';
 	var style="outline: none;filter:alpha(opacity=0);	-moz-opacity:0.0;-khtml-opacity: 0.0;opacity: 0.0;text-decoration:none;cursor:move;";
 	 var pageWin=new Gv.Window({
		id:'test45',
		title:Gv.gvI18n("page_group_manage")+'<a href="javascript:void(0);"  id="gv-plugin-res-grp-selector-focus" style="'+style+'">&nbsp;</a>',
		width:845,
		height:400,
		load:path,
	    bodyStyle:'padding:0px;'
		   /*
		tbar:[{
			text:'确定',
			handler:function(){
				  Gv.ResouceGroupSelecterActionHandler();
				}
			},{
			text:'关闭',
			handler:function(){
				pageWin.close();
				}
			}]*/
		});
 };


 //文件选择框
 Gv.SelectFileWindow=function(opt){
	 	var me = this;
	 	this.selectedValue = null;
	    var defualt={
	    		html:'<div><ul id="select_managerment_server_selectTess_id" class="ztree"></ul></div>'
	    			+'<em id="select_managerment_server_nodata_id" style="font-style:normal;display:none; padding:155px 0 0 165px;">暂无数据</em>',
	    		//url:'/jm_jobmanagement/jobsubmit/queryFileList.action',
	    		title:Gv.gvI18n("page_file_selector"),
				width:400,
				height:400,
	    		listeners:{
	    			afterLayout:function(){
	    					me.loadTree();
	    			}
	    		}
	    };
	    defualt.id='selectFileWindow-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
		$.extend(true,defualt,opt);
		Gv.Window.call(this,defualt);
	};
Gv.extend(Gv.SelectFileWindow,Gv.Window);


/**
 * 绑定Tbar
 */
Gv.SelectFileWindow.prototype.loadTree=function(){
	var me=this;

	var arr_tmp = new Array();
	var dirPath="/";
	/*
	//arr_tmp.push("node12");
	if (dirPath=='/') {
		arr_tmp.push('/');
	}else {
		arr_tmp.push('/');
		var arr_tmp_2 = dirPath.substring(1).split('/');
		for (var i = 0; i < arr_tmp_2.length; i++) {
			arr_tmp.push(arr_tmp_2[i]);
		}
	}
	*/

	linkedList = new LoadLinked(dirPath);
	//目录树
	var setting = {
			view: {
				showLine: false,
				selectedMulti:false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			async: {
				enable: true,
				url:'/jm_jobmanagement/jobsubmit/queryFileList.action',
				autoParam:["path=dirPath","fileNodeName","isRootNode"],
				dataFilter:function(treeId, parentNode, responseData){
					Gv.log(responseData);
					responseData = responseData.data;

					if (responseData) {
					      for(var i =0; i < responseData.length; i++) {
					        if (responseData[i].isDir ) {
 								//responseData[i].iconSkin='pIcon01';
								responseData[i].isParent=true;
					        }
					      }
					    }
					return responseData;
				}
			},
			callback: {
				beforeClick:beforeClick,
				onClick:onClick,
				//onDblClick:onDblClick,
				onAsyncSuccess: zTreeOnAsyncSuccess
			}
		};

		var firstAsyncSuccessFlag  = 0;
		var fileNodeName;
		function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {

			//处理ajax请求超时无退出的情况
			var test  = "<script>window.top.location='/login'</script>";
        	if(msg == test){
        		document.write(msg);
        	}
        	/*
        	if(msg.data == null){
        		//$("#select_managerment_server_nodata_id").css({display:'block'});
        	}else{
        		//$("#select_managerment_server_nodata_id").css({display:'none'});
        	}
        	*/

			if(linkedList != null && typeof(linkedList) != 'undefined'){
				var zTree = $.fn.zTree.getZTreeObj(treeId);
				//sid 我这里node加载的唯一标示SID（可以理解为简单数据模式下的SID）
				var sid = linkedList.getNextPath();
				Gv.log("sid:"+sid);
				var node = zTree.getNodeByParam("name", sid);
				Gv.log("node:"+node);
				//判断是否存在需要展开的节点，如果没有继续链路展开
				if(node != null && typeof(node) != 'undefined'){
					zTree.expandNode(node, true);
				}
			}
		}

		function beforeClick (treeId, treeNode, clickFlag){
			if(treeNode.path==undefined){
				return false;
			}
			return true;
		}

		function onClick (event, treeId, treeNode, clickFlag){
			me.selectedValue = treeNode.path;
		}
		//初始化树和文件列表
		var fileSelectTree =  $.fn.zTree.init($("#select_managerment_server_selectTess_id"), setting);

};

/**
 * 绑定Tbar
 */
Gv.SelectFileWindow.prototype.bindTbar=function(){
	var me=this;
	 if (!Gv.isEmpty(this.tbarIds)) {
	        for (var i = 0; i < this.tbarIds.length; i++) {
	            Gv.get( this.tbarIds[i]).bind('click',{},function(){
	            	var id=$(this).attr('id');
	            	var index=id.split('-btn-')[1];
	            	me.cfg.tbar[index].handler(me.selectedValue);
	            });
	        }
	    }
};


//节点选择器
Gv.SelectNodeWindow=function(opt){
 	var me = this;
 	this.selectedValue = null;
 	this.nodeTree=null;
    var defualt={
    		html:'<div><ul id="selectnode_managerment_server_selectTess_id" class="ztree"></ul></div>'
    			+'<em id="selectnode_managerment_server_nodata_id" style="font-style:normal;display:none; padding:155px 0 0 165px;">暂无数据</em>',
    		//url:'/jm_jobmanagement/jobsubmit/queryFileList.action',
    		title:Gv.gvI18n("page_node_selector"),
    		clusterId:'',
    		selectedValue:'',
			width:400,
			height:400,
    		listeners:{
    			afterLayout:function(){
    					me.loadTree();
    			}
    		}
    };
    defualt.id='selectFileWindow-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,defualt,opt);
	Gv.Window.call(this,defualt);
};
Gv.extend(Gv.SelectNodeWindow,Gv.Window);


/**
 * 绑定Tbar
 */
Gv.SelectNodeWindow.prototype.loadTree=function(){
	var me=this;
	var inputselectedValue = me.cfg.selectedValue;
	//var nodeTree;
	//目录树
	var setting = {
			view: {
				showLine: false
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			async: {
				enable: true,
				url:'/jm_jobmanagement/jobsubmit/listMultiNode.action?nocache='+new Date().getTime(),
				autoParam:["tid"],
				otherParam:{
					'clusterIDList':me.cfg.clusterId,
				},
				dataType:'json',
				dataFilter:function(treeId, parentNode, responseData){

					if (responseData) {
						for (var i = 0; i < responseData.length; i++) {
							var queue = responseData[i];
							if (inputselectedValue.indexOf(queue.text)!=-1) {
								queue.checked = true;
								if (parentNode) {
									parentNode.checked = true;
								}
							}
						}
					}

					return responseData;
				}
			},
			check:{
				enable:true
			},
			data:{
				key:{
					name:'text'
				}
			},
			callback: {
				//beforeClick:beforeClick,
				//onClick:onClick,
				//onDblClick:onDblClick,
				onAsyncSuccess: function(event, treeId, treeNode, msg){
					var zTree = $.fn.zTree.getZTreeObj(treeId);
					var nodes = zTree.getNodes();
					zTree.expandNode(nodes[0], true);
				}
			}
		};
		//初始化树和文件列表
		 this.nodeTree =  $.fn.zTree.init($("#selectnode_managerment_server_selectTess_id"), setting);

};

/**
 * 绑定Tbar
 */
Gv.SelectNodeWindow.prototype.bindTbar=function(){
	var me=this;
	 if (!Gv.isEmpty(this.tbarIds)) {
	        for (var i = 0; i < this.tbarIds.length; i++) {
	            Gv.get( this.tbarIds[i]).bind('click',{},function(){

	            	var id=$(this).attr('id');
	            	var index=id.split('-btn-')[1];
	            	var tmpArr = me.nodeTree.getCheckedNodes();
	            	var nodeArr = [];
					if (tmpArr.length >1) {
						for (var i = 1; i < tmpArr.length; i++) {
							nodeArr.push(tmpArr[i].text);
						}
					}
					Gv.log(nodeArr);
	            	me.cfg.tbar[index].handler(nodeArr);

	            });
	        }
	    }
};


