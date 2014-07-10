/**
 * win8导航
 * @author menghr
 */
var gv_navigation = {

		url:{
			queryQuickMenuList: context + '/main/queryQuickMenuList.action',
			queryUninstallQuickMenuList:context + '/main/queryUninstallQuickMenuList.action',
			deleteQuickMenu:context + '/main/deleteQuickMenu.action',
			saveQuickMenu:context + '/main/saveQuickMenu.action',
			toIndex:context + '/main/toIndex.action',
			logoutAction:context + '/main/logout.action'

		},
		params:{
			openSet:false, //是否打开设置设置页面
			iconNum:null
		},
		load:{
			//加载用户已配置快捷菜单
			loadSettedMenu:function(){
				Gv.ajax({
					url:gv_navigation.url.queryQuickMenuList,
					successFun:function(data){
						/*var j = 0;
						for (var i = 0; i < data.length; i++) {
							var d = data[i];
							if (d.shortCutSize == 'min') {
								j++;
							} else if(d.shortCutSize == 'normal'){
								j+=2;
							} else {
								j+=4;
							}
						}
						gv_navigation.params.iconNum = j;
						gv_navigation.events.initStyle();
						gv_navigation.events.initPlugin();*/
						//组织已配置菜单html
						gv_navigation.build.buildSettedMenu(data);
						//gv_navigation.events.initPlugin();
						gv_navigation.events.initStyle();
						$(".navigation-layout").masonry('reload');
					}
				});
			},
			//加载用户未配置菜单
			loadUNSettedMenu:function(){
				Gv.ajax({
					url:gv_navigation.url.queryUninstallQuickMenuList,
					successFun:function(data){
						Gv.log("---unset--");
						Gv.log(data.length);
						//gv_navigation.events.initPlugin();
						gv_navigation.build.buildUNSettedMenu(data);
					}
				});
			}
		},
		request:{
			deleteSetted:function(o,d){
				Gv.log(d);
				Gv.ajax({
					url:gv_navigation.url.deleteQuickMenu,
					data:{'qm.id':d.id,'qm.menuId':d.menuId},
					successFun:function(data){
						Gv.log(data);
						if (data.result) {
							gv_navigation.events.removeSetted(o,d);
						}
					}
				});
			},
			addSetted:function(o,d){
				Gv.ajax({
					url:gv_navigation.url.saveQuickMenu,
					data:{'qm.menuId':d.menuId},
					successFun:function(data){
						Gv.log('------save------');
						Gv.log(data);
						if (data.result) {
							d.id=data.data.id;
							gv_navigation.events.removeUNSetted(o,d);
						}
					}
				});
			}
		},
		build:{
			//组织已配置菜单
			buildSettedMenu:function(data){
				Gv.log('--------data--------');
				Gv.log(data);
				if (data != null && data.length !=0) {
					for ( var i = 0; i < data.length; i++) {
						//创建一个菜单
						this.buildSingleMenu(data[i]);
					}
				} else {
					//没有数据是，添加一个临时隐藏区域，保证下次添加时能够正确初始化样式
					var $tmp_l = $('<div class="navigation-block none" id="block_tmp"/>');
//					$(".navigation-layout").append($tmp_l).masonry( 'appended', $tmp_l);
					$(".navigation-layout").masonry( 'appended', $tmp_l).masonry('reload');
				}
				//gv_navigation.events.initStyle();

				$(".navigation-layout").masonry( 'reloadItems' );//.masonry('roload');
			},
			//组织未配置菜单
			buildUNSettedMenu:function(data){
				$(".navigation-app").empty();
				if (data != null && data.length !=0) {
					for ( var i = 0; i < data.length; i++) {
						//创建一个菜单
						this.buildSingleMenuForUNSet(data[i]);
					}
				} else {
					//没有数据,添加一个临时的隐藏区域,保证下次添加时能够初始化样式
					var $tmp_r = $('<div class="navigation-block none" id="block_app_tmp"/>');
					$(".navigation-app").masonry( 'appended', $tmp_r).masonry('reload');
				}
				$(".navigation-app").masonry("reload");

			},
			//根据sessionId和菜单ID，获取菜单颜色
			getMenuColorFromSession:function(sessionId,menuId,colorStr){
				if(Gv.isEmpty(colorStr)){
					return null;
				}
				if(colorStr.indexOf(sessionId) == -1){
					return null;
				}
				if(colorStr.split('%')[1].indexOf(menuId) == -1){
					return null;
				}
				Gv.log('sessionId-->: '+sessionId);
				Gv.log('menuId-->: '+menuId);
				var s = menuId;
				colorStr = colorStr.split('%')[1];
				Gv.log('s------->: ' + s);
				Gv.log('colorStr------->: ' + colorStr);
				Gv.log('colorStr.indexOf(sessionId++menuId)-->: ' + colorStr.indexOf(s));
				var si = colorStr.indexOf(s);
				var start = s.length + si;
				var end = start + 7;
				return colorStr.substring(start,end);
			},
			//创建一个已配置菜单
			buildSingleMenu:function(d){
				var $container_r = $('.navigation-layout');
				//首先从cookie中获取颜色
				//var color = Gv.util.cookier.getCookie(GV_SESSIONID_N + '-' + d.menuId);
				var colorStr = Gv.util.cookier.getCookie('color');
				Gv.log('colorStr: ' + colorStr);
				var color = this.getMenuColorFromSession(GV_SESSIONID_N,d.menuId,colorStr);
				Gv.log('color-->: ' + color);
				if(Gv.isEmpty(color)){
					color = gv_navigation.events.getColor();
					if(Gv.isEmpty(colorStr)){
						Gv.util.cookier.setCookie('color',GV_SESSIONID_N+'%'+d.menuId+color);
					} else if(colorStr.indexOf(GV_SESSIONID_N) !=-1){
						Gv.util.cookier.setCookie('color',colorStr+d.menuId+color);
					} else {
						Gv.util.cookier.setCookie('color',GV_SESSIONID_N+'%'+d.menuId+color);
					}
					//Gv.util.cookier.setCookie(GV_SESSIONID_N + '-' + d.menuId,color);
					//Gv.util.cookier.setCookie('color',Gv.isEmpty(colorStr)?GV_SESSIONID_N+'%'+d.menuId+color:colorStr+d.menuId+color);
				};
				//获取随机颜色
				//var color = gv_navigation.events.getColor();
				var $div_block = $('<div/>').addClass('navigation-block').addClass(d.shortCutSize).css('background-color',color);
				var $div_icon = $('<div/>').addClass('icondiv');
				var $i_icon = $('<i/>').addClass(d.shortCutIcon);
				$div_icon.append($i_icon);
				$div_block.append($div_icon);
				var $div_text = $('<div/>').addClass('textdiv').text(Gv.gvI18n(d.menuName));
				$div_block.append($div_text);
				var $div_colose = $('<div/>').addClass('close');
				if (d.isDefaultShortCut) {
					$div_colose.attr('remove','1');
				}
				var $i_remove = $('<i/>').addClass('icon-remove-sign');
				$div_colose.append($i_remove);
				$div_block.append($div_colose);
				gv_navigation.events.addSetted($div_block,d);
				/*//绑定移除事件
				gv_navigation.events.bindRemoveForSetted($div_colose, d);*/

			},
			//创建一个未配置菜单
			buildSingleMenuForUNSet:function(d){
				var $container_r = $('.navigation-app');
				/*var color = Gv.util.cookier.getCookie(GV_SESSIONID_N + '-' + d.menuId);
				if(Gv.isEmpty(color)){
					color = gv_navigation.events.getColor();
					Gv.util.cookier.setCookie(GV_SESSIONID_N + '-' + d.menuId,color);
				};*/
				/*var colorStr = Gv.util.cookier.getCookie('color');
				//Gv.log('colorStr: ' + colorStr);
				var color = this.getMenuColorFromSession(GV_SESSIONID_N,d.menuId,colorStr);
				//Gv.log('color-->: ' + color);
				if(Gv.isEmpty(color)){
					color = gv_navigation.events.getColor();
					//Gv.util.cookier.setCookie(GV_SESSIONID_N + '-' + d.menuId,color);
					Gv.util.cookier.setCookie('color',Gv.isEmpty(colorStr)?GV_SESSIONID_N+'-'+d.menuId+color:colorStr+GV_SESSIONID_N+'-'+d.menuId+color);
				};*/
				var colorStr = Gv.util.cookier.getCookie('color');
				Gv.log('colorStr: ' + colorStr);
				var color = this.getMenuColorFromSession(GV_SESSIONID_N,d.menuId,colorStr);
				Gv.log('color-->: ' + color);
				/*if(Gv.isEmpty(color)){
					color = gv_navigation.events.getColor();
					//Gv.util.cookier.setCookie(GV_SESSIONID_N + '-' + d.menuId,color);
					Gv.util.cookier.setCookie('color',Gv.isEmpty(colorStr)?GV_SESSIONID_N+'%'+d.menuId+color:colorStr+d.menuId+color);
				};*/
				if(Gv.isEmpty(color)){
					color = gv_navigation.events.getColor();
					if(Gv.isEmpty(colorStr)){
						Gv.util.cookier.setCookie('color',GV_SESSIONID_N+'%'+d.menuId+color);
					} else if(colorStr.indexOf(GV_SESSIONID_N) !=-1){
						Gv.util.cookier.setCookie('color',colorStr+d.menuId+color);
					} else {
						Gv.util.cookier.setCookie('color',GV_SESSIONID_N+'%'+d.menuId+color);
					}
					//Gv.util.cookier.setCookie(GV_SESSIONID_N + '-' + d.menuId,color);
					//Gv.util.cookier.setCookie('color',Gv.isEmpty(colorStr)?GV_SESSIONID_N+'%'+d.menuId+color:colorStr+d.menuId+color);
				};
				//获取随机颜色
				//var color = gv_navigation.events.getColor();
				var $div_block = $('<div/>').addClass('navigation-block').addClass(d.shortCutSize).css('background-color',color);
				var $div_icon = $('<div/>').addClass('icondiv');
				var $i_icon = $('<i/>').addClass(d.shortCutIcon);
				$div_icon.append($i_icon);
				$div_block.append($div_icon);
				var $div_text = $('<div/>').addClass('textdiv').text(Gv.gvI18n(d.menuName));
				$div_block.append($div_text);
				var $div_colose = $('<div/>').addClass('close');
				if (d.isDefaultShortCut) {
					$div_colose.attr('remove','1');
				}
				var $i_remove = $('<i/>').addClass('icon-remove-sign');
				$div_colose.append($i_remove);
				$div_block.append($div_colose);
				gv_navigation.events.addUNSetted($div_block,d);
			}
		},
		events:{
			getColor:function(){
				var temp_value=-1;
				var ran=function(num){ //num参数表示颜色的个数
					var dindex=-1;
					while(true){
						 dindex=Math.floor(num*Math.random());//随机值
						 if(dindex!=temp_value){
							 temp_value=dindex;
							 return dindex;
						 }
					}
				};
				var color_ary=["#00B8E1","#034684","#E86123","#00A786","#17994F","#BF203E","#56B10E","#E28D16"];//定义颜色
				var rad=ran(8);
				return color_ary[rad];
			},
			//添加一个菜单到已设置菜单列表中
			addSetted:function(o,d){
				Gv.log('-------------dddddddddddd--------------');
				Gv.log(d);
				var $container_r = $('.navigation-layout');
				$container_r.append(o).masonry('appended', o);
				var $tmp = $('#block_tmp');
				if ($tmp[0]) {
					$container_r.masonry('remove', $tmp).masonry("reload");
				}
				//绑定事件
				Gv.log(o.find('div[class="close"]')[0]);
				this.bindRemoveForSetted(o.find('div[class="close"]'),d);
				this.bindClickForSetted(o,d);
				if (gv_navigation.params.openSet) {
					//设置状态下
					o.find('div[class="close"]').show();
				}
			},
			//添加一个菜单到未设置菜单中
			addUNSetted:function(o,d){
				var $container_l = $('.navigation-app');
				$container_l.append(o).masonry( 'appended', o);
				$container_l.find(".close").hide();
				var $tmp = $('#block_app_tmp');
				if ($tmp[0]) {
					$container_l.masonry('remove', $tmp).masonry("reload");
				}
				//绑定点击添加到已设置菜单中,移除未设置菜单
				this.bindRemoveForUNSetted(o,d);
			},
			//绑定已设置菜单的删除事件
			bindRemoveForSetted:function(o,d){
				o.bind('click',function(){
					o.unbind('click');
					gv_navigation.request.deleteSetted(o.parent(),d);
				});
			},
			//绑定已设置菜单的单击跳转事件
			bindClickForSetted:function(o,d){
				o.bind('click',function(){
					if (!gv_navigation.params.openSet) {
						window.location.href='/pageframe/main/toIndex.action?id='+d.menuId+'&text='+Gv.gvI18n(d.menuName)+'&closed=true&load='+d.actionDest;
					}
				});
			},
			//绑定未设置菜单的删除事件
			bindRemoveForUNSetted:function(o,d){
				Gv.log("---0-----");
				Gv.log(d);
				o.bind('click',function(){
					//移除未设置菜单
					o.unbind('click');
					gv_navigation.request.addSetted(o,d);
				});
			},
			//移除已设置的菜单
			removeSetted:function(o,d){
				Gv.log(o);
				var $items = o;
				$(".navigation-layout").masonry('remove', $items ).masonry("reload");
				this.addUNSetted(o.clone(),d);
				var len = $(".navigation-layout").find('div').length;
				if (len == 0) {
					//全部移除,为保证样式,将隐藏的div加入
					var $tmp_l = $('<div class="navigation-block none" id="block_tmp"/>');
					$(".navigation-layout").append($tmp_l).masonry( 'appended', $tmp_l);
				}
			},
			//移除未设置菜单
			removeUNSetted:function(o,d){
				var $items = o;
				$(".navigation-app").masonry('remove', $items ).masonry("reload");
				this.addSetted(o.clone(),d);
				var len = $(".navigation-app").find('div').length;
				if (len == 0) {
					//全部移除,为保证样式,将隐藏的div加入
					var $tmp_r = $('<div class="navigation-block none" id="block_app_tmp"/>');
					$(".navigation-app").append($tmp_r).masonry( 'appended', $tmp_r);
				}
			},
			//绑定打开设置按钮点击事件
			bindOpenSet:function(){
				var me = this;
				$(".navigation-set").bind('click',function(){
					if($(this).find("i").attr("class")=="icon-cog"){
						gv_navigation.load.loadUNSettedMenu();
						var swichN = 400;
						$(this).find("i").attr("class","icon-circle-arrow-right");
						$(".navigation-side").animate({"width":swichN},300);
						$(".navigation-main").animate({"margin-right":swichN},300);
						$(".navigation-layout").find(".close[remove !='1']").show();
						gv_navigation.params.openSet = true;
						//me.initScroll();
						$(".navigation-layout").masonry("reload");
						me.initStyle();
					}else{
						$(this).find("i").attr("class","icon-cog");
						$(".navigation-side").animate({"width":0},300);
						$(".navigation-main").animate({"margin-right":0},300);
						$(".navigation-layout").find(".close").hide();
						gv_navigation.params.openSet = false;
						//me.initScroll();
						me.initStyle();
						$(".navigation-layout").masonry("reload");
					}
				});
			},
			//进入首页按钮事件
			bindGridviewStart:function(){
				$("#gridview_start").bind('click',function(){
					window.location.href='/pageframe/main/toIndex.action';
				});
			},
			//绑定logout事件
			bindLogOut:function(){
				$("#navigation_logout_id").bind('click',function(){
					//window.location.href='../servlet/LogoutServlet?GV_JSESSIONID='+GV_SESSIONID_N;
					Gv.ajax({
						url:gv_navigation.url.logoutAction,
						successFun:function(data){
							Gv.log("---logout--");
							Gv.log(data);
							if(data.result = "success"){
								document.write(data.msg);
							}
							//gv_navigation.events.initPlugin();
							//gv_navigation.build.buildUNSettedMenu(data);
						}
					});
				});
			},
			//初始化导航插件
			initPlugin:function(){
				 $(".navigation-layout").masonry({
					itemSelector: '.navigation-block',
					isFitWidth: false,
					columnWidth:120,
					isAnimated: true
				});
				$(".navigation-app").masonry({
					itemSelector: '.navigation-block',
					isFitWidth: false,
					isAnimated: true
				});
			},
			//初始化样式
			initStyle:function(){
				var headH = $(".navigation-head").height(),
				winH = $(window).height(),
				$wrap = $(".navigation-container"),
				$layout = $(".navigation-layout");
				$(".navigation-side").height(winH);
				$(".navigation-side-body").height(winH-125);
				$wrap.height(winH - headH);
				$layout.height(winH - headH-200);
				$layout.each(function(index, element) {
			       	var maxRows = Math.round((winH - headH-200) /120);
					var	iconNum = $(this).find(".min").length+$(this).find(".normal").length*2+$(this).find(".big").length*4;
					//iconNum = gv_navigation.params.iconNum;
					Gv.log("iconNum: " + iconNum);
					$(this).css('width',iconNum*130/maxRows+100+'px');//width(iconNum*130/maxRows+100);
					Gv.log("width: " + $(this).width());
				});
			},
			resize:function(){
				var maxRows = Math.round((winH - headH-200) /120);
				var	iconNum = $(this).find(".min").length+$(this).find(".normal").length*2+$(this).find(".big").length*4;
				iconNum = gv_navigation.params.iconNum;
				Gv.log("iconNum: " + iconNum);
				$(this).css('width',iconNum*130/maxRows+100+'px !important');//width(iconNum*130/maxRows+100);
				Gv.log("width: " + $(this).width());
			},
			//初始化滚动条
			initScroll:function(){
				$(".navigation-side-body").mCustomScrollbar({
					scrollButtons:{
						enable:true
					},
					autoHideScrollbar:true
				});
				$(".navigation-container").mCustomScrollbar({
					autoHideScrollbar:true,
					horizontalScroll:true,
					mouseWheelPixels:300,
					advanced:{
						autoExpandHorizontalScroll:true,
						updateOnContentResize: true
					},
					contentTouchScroll:true
				});
				$(".navigation-container").hover(function(){
				$(document).data({"keyboard-input":"enabled"});
					$(this).addClass("keyboard-input");
				},function(){
					$(document).data({"keyboard-input":"disabled"});
					$(this).removeClass("keyboard-input");
				});
				$(document).keydown(function(e){
					if($(this).data("keyboard-input")==="enabled"){
						var activeElem=$(".keyboard-input"),
							activeElemPos=Math.abs($(".keyboard-input .mCSB_container").position().left),
							pixelsToScroll=300;
						if(e.which===37){ //scroll up
							e.preventDefault();
							if(pixelsToScroll>activeElemPos){
								activeElem.mCustomScrollbar("scrollTo","left");
							}else{
								activeElem.mCustomScrollbar("scrollTo",(activeElemPos-pixelsToScroll),{scrollInertia:400,scrollEasing:"easeOutCirc"});
							}
						}else if(e.which===39){ //scroll down
							e.preventDefault();
							activeElem.mCustomScrollbar("scrollTo",(activeElemPos+pixelsToScroll),{scrollInertia:400,scrollEasing:"easeOutCirc"});
						}
					}
				});
			}
		},


		onReady:function(){
			//alert(GV_SESSIONID_N);
			gv_navigation.events.initScroll();
			gv_navigation.events.bindOpenSet();
			gv_navigation.events.bindGridviewStart();
			gv_navigation.events.bindLogOut();
			gv_navigation.events.initStyle();
			gv_navigation.events.initPlugin();
			$(window).resize(function() {
				gv_navigation.events.initStyle();
				$(".navigation-layout").masonry("reload");
			});
			gv_navigation.load.loadSettedMenu();
			//加载未设置菜单
			//gv_navigation.load.loadUNSettedMenu();
			//gv_navigation.events.initStyle();
		}

};
$(function(){
	gv_navigation.onReady();
});

