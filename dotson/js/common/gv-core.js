/**
 * Gridview 页面框架基础JS文件
 * version 1.0.0
 * 包含基本方法\全局变量\组件类名
 * March 4 2013
 * author LLJ < dalaoliiiii@gmail.com >
 *
 */
var Gv = {
    /*grid分页*/
    gridLimit:25,
    /* 浏览器可见内容宽度 */
    clientW: 0,
    /* 浏览器可见内容高度 */
    clientH: 0,
    /*右侧导航的宽度*/
    frameNavWidth: 0,
    /*表格内容高度*/
    gridContentH: '',
    /* 1000毫秒 */
    timeM: 1000,
    /* 500毫秒*/
    time5: 500,
    /* 300毫秒 */
    time3: 300,
    /*当前WPanel的Id*/
    currentWPanelId: '',
    currentUser:{},
    /* 根路径 */
    hostPath: '',
    isFullScreen: false,
    /*主右侧导航是否开启*/
    isNavOpenn: 'open',
    //默认是开启
    /*是否日志输出*/
    isLog: true,
    /*主右侧导航*/
    frameNavPanel: '',
    /*主Tab panel*/
    frameTabPanel: '',
    /*窗口*/
    Window: {},
    WebCmd: {},
     /*用户组Panel*/
    UserGroupPanel:{},
    /*冒泡提示框*/
    MsgBubble:{},
    //信息提示组件
    msg:{},
    TabCardPanel:{},
    /*上传组件对象*/
    upload: {},
    /*树*/
    tree: {},
    /*面板  */
    panel: {},
    /*表格*/
    grid: {},
    /*菜单*/
    menu: {},
    /*框架*/
    frame: {},
    /*图表*/
    chart:{},
    //工具
    util:{},
    //组资源选择器
    ResouceGroupSelecter:{},
    //组资源选择器URL（包含tree后台和修改后台）
    resouceGroupSelecterUrl:{},
     /*表单组件*/
    form: {},
    /*多语化信息*/
    languageData: '',
    /*sessionId*/
    sessionId: '',
    /*保存多语化信息的全局变量*/
    languages:{},
    LoadingHtml:'<img src="/pageframe/images/btnloading.gif" style="padding:0 5px"/>',
    isLoadLanguageConfig:{},
    /**
     * @param c {}
     * @param c{} id
     * @param c{} html
     */
    html: function (c) {
        if ($('#' + c.id).get(0)) {
            $('#' + c.id).html(c.html);
        }
    },
	/**
     * @param c {}
     * @param c{} tag
     * @param c{} id
	 * @param c{} cls
     */
	createElement:function(c){
		var e = document.createElement(c.tag);
		$(e).attr('id',c.id);
		$(e).attr('class',c.cls);
		return e;
	},
    /**
     * @param c {}
     * @param c{} id
     * @param c{} text
     */
    text: function (c) {
        if ($('#' + c.id).get(0)) {
            $('#' + c.id).text(c.text);
        }
    },
    //初始化框架布局
    initLayout: function () {
        this.clientW = $(window).width();
        this.clientH =Gv.isIE()?($(window).height()-3):$(window).height();
        this.frameNavWidth = 100;
        this.get('main').height(this.clientH).width(this.clientW);
        if (this.isNavOpenn == 'open') {
            this.get('frame-nav').width(this.frameNavWidth);
        }
        var containerH =this.clientH;

            this.get('frame-main').css({
                marginLeft: this.frameNavWidth
            });
        this.get('container').height( containerH);
        this.get('frame-nav-body-scroll').height(this.getHeight('frame-nav') - this.getHeight('frame-btn-nav')-71);
        //this.get('frame-nav-body')
        if (this.dom('tab-menu')) {
            this.get('tab-menu').width((this.getWidth('frame-main') - 76));
        }
    },
    //初始化事件
    initEvent: function () {
    	this.bindCloseNavClick();
        this.bindSubMenuEvent();
		this.bindMiniMenuClick();
        $(window).keydown(function(event){
        	if(event.keyCode==13){
             	if($.isFunction(Gv.enterEvent)){
        		   Gv.enterEvent();
        		    return false;
        	    }
        	}else if(event.keyCode==27){
        		if($.isFunction(Gv.escEvent)){
        		   Gv.escEvent();
        		    return false;
        	    }
           }

        }).mousedown(function(event){
		 		if($.isFunction(Gv.mousedownEvent)){
        		    Gv.mousedownEvent(event);
        	    }
		});
        Gv.resizeEvent();

    },
    //初始化导航滚动条
    initNavScrollbar:function(){
    	  this.get('frame-nav-body-scroll').mCustomScrollbar({
  			advanced:{
  				updateOnContentResize: true,
  				updateOnBrowserResize: true
  				},
  				scrollButtons:{
  					enable:true
  				},
  				theme:"light-thin",
  				autoHideScrollbar:true
  			});
    },
	//关闭导航事件
	bindCloseNavClick:function(){
		 $('#frame-btn-nav a.navswitch').click(function () {
            Gv.frameNavSwitch('close');
        });
	},
	//迷你菜单点击事件
	bindMiniMenuClick:function(){

		Gv.get('frame-mini-nav span[attr="open"]').bind('click',function(){

			Gv.frameNavSwitch("open");
		})

	},
    bindSubMenuEvent:function(){
  	    $("#frame-subnav ul li").click(function(){
			$(this).addClass("active").children('ul').stop(false,true).slideDown(300);
		});
		$("#frame-subnav ul li").mouseleave(function(){
			$(this).removeClass("active").children('ul').stop(false,true).slideUp(300);
	    });
    },
    shortcutMenuOpen: function () {
        $('#frame-shortcutMenu').addClass('frame-shortcutMenuShadow').removeClass('transparent').stop(false, true).animate({
            right: 0
        }, 300);
    },
    shortcutMenuClose: function () {
        $('#frame-shortcutMenu').stop(false, true).animate({
            right: -59
        }, 300, function () {
            $(this).removeClass('frame-shortcutMenuShadow').addClass('transparent');
        });
    },
    iframeHWAuto:function(thiz){
    	       thiz.style.width=$(thiz).parent().get(0).offsetWidth+'px';
    	       thiz.style.height=$(thiz).parent().get(0).offsetHeight+'px';
    	},

   /*
    *框架导航开关函数
    * a string  'open' or 'close'
    */
    frameNavSwitch: function ( a) {
       // if (!this.isEmpty(this.frameNavPanel)) {
//            if (a == 'close') {
//                this.frameNavPanel.closeAll();
//                this.frameNavPanel.bindIconEvent();
//            } else {
//                this.frameNavPanel.bindClick();
//            }
//        }
        var $nav = $('#frame-nav'),
            $fmain = $('#frame-main'),
			$tabHeader=$('#tab-header'),
            $tabMenu = $('#tab-menu'),
			$miniMenu = $('#frame-mini-nav'),
            $tabContent=$('#tab-content');
        if (a == 'close') {
			Gv.log('close :'+ this.frameNavWidth);
            this.isNavOpenn = 'close';
            //this.get('frame-btn-nav a i').attr('class', 'icon-align-justify');
			$miniMenu.show();
            $nav.addClass('frame-iconNav').stop(false, true).css('overflow','hidden').animate({
                width: 0
            }, Gv.time3);
			 $tabHeader.addClass('frame-iconNav').stop(false, true).animate({
                marginLeft: 78
            }, Gv.time3);
            $fmain.stop(false, true).animate({
                marginLeft: 0
            }, Gv.time3,function(){
            	Gv.frameTabPanel.resizeTab(Gv.clientW,Gv.getHeight('tab-content'));
            });
            Gv.get('frame-tab div.scroll-right').stop(false, true).animate({
                right:230
            });
        } else {
			Gv.log('open :'+ this.frameNavWidth);
            this.isNavOpenn = 'true';
           // this.get('frame-btn-nav a i').attr('class', 'icon-resize-small');
			$miniMenu.fadeOut(Gv.time3);
            $nav.removeClass('frame-iconNav').stop(false, true).css('overflow','visible').animate({
                width: this.frameNavWidth
			            }, Gv.time3);
            $fmain.stop(false, true).animate({
                marginLeft: this.frameNavWidth
            }, Gv.time3,function(){
            	//Gv.log("$fmain"+Gv.clientW-Gv.frameNavWidth)
            	Gv.frameTabPanel.resizeTab(Gv.clientW-Gv.frameNavWidth,Gv.getHeight('tab-content'));
            });
			 $tabHeader.addClass('frame-iconNav').stop(false, true).animate({
                marginLeft: 0
            }, Gv.time3);
			Gv.get('frame-tab div.scroll-right').stop(false, true).animate({
	                right:210
	         });

        }

    },
    //回车事件
    enterEvent:null,
    //鼠标按下事件
    mousedownEvent:null,
    //Esc事件
    escEvent:null,
    resizeEvent: function () {
        $(window).resize(function () {
            Gv.initLayout();
            Gv.get('frame-nav-body-scroll').mCustomScrollbar("update");
            $('#frame-main').css({
                marginLeft: $('#frame-nav').width()
            });
            $('#tab-content').height($('#container').height() - $('#tab-header').height());
            Gv.elementLayout();
            var tabW=this.clientW-Gv.get('frame-nav').width();
            Gv.frameTabPanel.resizeTab(tabW,$('#tab-content').height());
        });
    },
    clearEventBubble: function (evt) {
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
    },
    /**
     *flag boolean (开启/关闭)
     *id string
     *zIndex int
     */
    mask: function (flag, id, zIndex) {
        id = this.isEmpty(id) ? 'frame-mask' : id;
        zIndex = this.isEmpty(zIndex) ? 999 : zIndex;
        var mask = this.get(id);
        if (!mask[0]) {
            mask = $('<div id="' + id + '" class="frame-mask" />').appendTo(this.main());
        }
        flag ? mask.css('zIndex', zIndex).show() : mask.hide();

    },
    /*
     * 带信息的蒙照
     * flag boolean true显示/false 关闭
     * id String 目标Id
     * msg显示信息
     * zIndex z 轴大小
     */
    maskMsg: function (flag,id,msg,zIndex) {
        var mask = this.get('maskMsg-'+id);

        if (!mask[0]) {
            mask = $('<div id="maskMsg-' + id + '" class="frame-mask" />').appendTo(this.get(id));
        }
        if(this.isEmpty(msg)){
        	msg=this.gvI18n('page_wait');
        }
        if(this.isEmpty(zIndex)){
        	zIndex=999;
        }
        var path=Gv.hostPath?Gv.hostPath+'/images/loading.gif':'images/loading.gif',
            h='<div style="margin:150px auto;min-width:150px;width:150px;background:#000; padding:10px;color:#fff;display:block;">'+
               '<img src="'+path+'" style="margin-right:10px;">'+msg+'</div>';
         mask.html(h);
        if(flag){
        	this.get(id).css({position:'relative',overflow:'hidden'});
        	 mask.css({
				width:this.getWidth(id),
				height:this.getHeight(id),
				background:'#FFF',
				display:'block',
				zIndex:zIndex,
				opacity:0.7,
				position:'absolute'
		  }).show();
        }else{
        	this.get(id).css({position:'',overflow:'auto'});
        	mask.remove();
        }
    },
    body: function () {
        return $('body');
    },
    bodyAppend: function (h) {
        this.body().append(h);
    },
    main: function () {
        return this.get('main');
    },
    /*return Jquery Object*/
    get: function (i) {
        return $('#' + i);
    },
    /*return dom*/
    dom: function (i) {
        return document.getElementById(i);
    },
    /*return Number*/
    getHeight: function (i) {
        return this.get(i)[0].offsetHeight?this.get(i)[0].offsetHeight:this.get(i).height();
    },
    /*return Number*/
    getWidth: function (i) {
        return this.get(i)[0].offsetWidth?this.get(i)[0].offsetWidth:this.get(i).width();
    },
    /*根据class名称得到object return Jquery Object*/
    cls: function (c) {
        return $('.' + c);
    },
    //获得定位
    positionXY: function (i) {
        var o = {};
        o.x = this.get(i).offset().left;
        o.y = this.get(i).offset().top;
        return o;
    },
    /* 验证是否为空 return true*/
    isEmpty: function (o) {
        return o === null || o === undefined || ((Object.prototype.toString.apply(o) === "[object Array]" && !o.length)) || o === "";
    },
    /*元素是否可见*/
    isVisible:function(i){
    	return this.get(i).is(":visible");
    },
    isArr: function (o) {
        return Object.prototype.toString.apply(o) === "[object Array]";
    },
    isIE: function () {
        return $.browser.msie;
    },
    //日志
    log: function (o) {
        if (this.isLog) {
        	if(!this.isIE()){
        		console.log(o);
        	}

        }
    },
    eventTarget: function (evt) {
        evt = evt || window.event;
        return (evt.srcElement || evt.target);
    },
    //随机数
    random: function () {
        return Math.floor(Math.random() * 10000 + 1)
    },
    //随机字符串 len长度
    randomStr:function(len){
    	        var x = "123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
                var str = "";
                for (var i = 0; i < len; i++) {
                    str += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
                }
                return str;
    },
    //时间戳
    timeStamp:function(){
    	return new Date().getTime();
    },
    /**
    * 主元素Id
    */
    elementLayout:function(){
    	    $('.gv-row, .gv-col').each(function(index, element) {
		     	var self=$(this).css({overflow:'hidden'}),
		     	//获取父层的宽高
			    w = self.parent()[0].offsetWidth,
				h = self.parent()[0].offsetHeight,
				//获取父层的设置的列数和行数
				columns = self.parent().attr("cols"),
				rows= self.parent().attr("rows"),
				//获取自己是跨几行和几列
				c= self.attr("col"),
				r= self.attr("row"),
				//获取自己设定的宽高
				wpx=self.attr("wpx"),
				hpx=self.attr("hpx"),twidth,theight;
		     	//如果父层没有设定列数和行数，就按实际宽高设定
				if(!columns&&!rows){
				   self.width(w).height(h);
				   twidth=w;
				   theight=h;
				}else{
					//固定宽高值优先
					twidth=wpx?wpx:w*c/columns;
					theight=hpx?hpx:h*r/rows;

			   }
			    self.width(twidth).height(theight);
			    self.children().width(twidth-1).height(theight-1).css({overflow:'hidden'});
			    //判断有没有title
			    if(self.children().find('div[attr="title"]')[0]){
			    	self.children().children('div[attr="content"]').width(twidth-11).height(theight-11-30);
			    }else{
			    	self.children().children('div[attr="content"]').width(twidth-11).height(theight-11);
			    }


		});
    },
    /*String to Json*/
    string2Json:function(s){
    	return eval('('+s+')');
    },
    errorMsgWin:function(msg){
    	var errorMsgWin=new Gv.Window({
       	 id:'gv-frame-errorWin',
       	 title:Gv.gvI18n('page_tips'),
       	 width:400,
		 height:80,
       	 html:'<div style="text-align:center;line-height:80px;">'+msg+'</div>',
       	 tbar:[{
					text:Gv.gvI18n('page_close'),
					handler:function(){
						errorMsgWin.close();
						}
				}]
        });
    },
    date2String:function(d){
    	var s = d.getFullYear() + "-";

    	s += ("0"+(d.getMonth()+1)).slice(-2) + "-";

    	s += ("0"+d.getDate()).slice(-2) + " ";

    	s += ("0"+d.getHours()).slice(-2) + ":";

    	s += ("0"+d.getMinutes()).slice(-2) + ":";

    	s += ("0"+d.getSeconds()).slice(-2) + ".";

    	s += ("00"+d.getMilliseconds()).slice(-3);
    	return s;
    },
    object:function(o){
    	  function F(){}
    	  F.prototype=o;
    	  return new F();
    	},
    //继承
    extend:function(sub,parent){
    	   var prototype=this.object(parent.prototype);
    	   prototype.constructor=sub;
    	   sub.prototype=prototype;
    	},
    ajax: function (c) {
        var settings = {
            data: {
                rand: ''
            },
            type: 'post',
            async: true,
            dataType: 'json'
        };
        $.extend(true, settings, c);
            return $.ajax({
                url: settings.url,
                type: settings.type,
                dataType: settings.dataType,
                data: settings.data,
                cache: false,
                async: settings.async,
                timeout:settings.timeout||300000,
                beforeSend:function(){
                	if ($.isFunction(settings.beforeSend)) {
                        return settings.beforeSend();
                    }
                },
                success: function (result) {
                    if ($.isFunction(settings.successFun)) {
                        settings.successFun(result);
                    }
                },
                error: function (event) {
                	if(event.status==404){
                		//new Gv.msg.error({html:event.statusText});
                	}
                	if(event.status==0){
                		//new Gv.msg.error({html:'网络异常'});
                	}
                	if ($.isFunction(settings.errorFun)) {
                        settings.errorFun(event);
                    }
                },
                complete:function(result){
                	//Gv.log(result.responseText);
                	var test  = "<script>window.top.location='/'</script>";
                	if(result.responseText == test){
                		document.write(result.responseText);
                	}

                }
            });
    },
    regexSelector:function(v){
    	     	var res='';
			switch (v) {
			    case "email":
			         t={regex:/^([a-zA-Z0-9]+[_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,regexText:Gv.gvI18n('page_email_unavailable')};
			        break;
			    case "ip":
			          t={regex:/^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/,regexText:Gv.gvI18n('page_input_ip')};
			        break;
			   default:
			        t={regex:/^.$/,regexText:''};
			    }
			 return t;
    	},
    	msgNote:function(msg){
    		 var d=this.get('gv-msg-note-div'),//self=this;
	             n=$('<span class="gv-msg-note"></span>').text(msg);
			    if(!d[0]){
					d=$('<div class="gv-msg-note-div" id="gv-msg-note-div"></div>').append(n);
			    	this.main().append(d);
			    }else{
			    	d.html(n);
			    }
			    d.stop().animate({top:60},500).delay(2000).fadeOut(300,function(){
			    	d.css({top:-100}).show();
			    });
    	},
    	/**
    	* params b bolean true-(显示) false(隐藏)
    	* params target object 目标对象
    	* params msg String 显示内容
    	* params dir String 显示方向
    	* params type String 显示tips类型
    	*/
    	textTips:function(b,target,msg,x,y){
    		var tips,text,arrow,top,left,w;
    		if(this.dom('gv-tips')){
    			this.get('gv-tips').remove();
    		}
    		tips=$('<span id="gv-tips" style="display:none" />').addClass('gv-field-tips');
    		text=$('<div />').addClass('text');
    		arrow=$('<div />').addClass('arrow');
    		//tips.append(text).append(arrow);
    		tips.append(text);
    		this.main().append(tips);
    		tips.find('div.text').text(msg);
    		if(b===false){
    			tips.fadeOut(300);
    			return false;
    		}
    		function getOffsetW(o){
    			return $(o)[0].offsetWidth?$(o)[0].offsetWidth:$(o).width();
    		}
    		//目标容器的坐标
    		var top=y||(target.offset().top-40),//target[0].offsetTop-40,
    		      left= x||(target.offset().left+(target.outerWidth(true)/2));//target[0].offsetLeft+(getOffsetW(target[0])/2);
    		tips.css({
    				top:top,
    				left:left
    			}).fadeIn(300);
    	},
    	xtype:{},
    	// xtyp类型转换成Object
       xtypeObject:function(key){
       	   return this.xtype[key];
       },
       //组件注册
       register:function(k,v){
       	  this.xtype[k]=v;
       },
       //argname参数名称
       getParaStr:function(argname){
		   var hrefstr,pos,parastr,para,tempstr;
		   hrefstr = window.location.href;
		   pos = hrefstr.indexOf("?")
		   parastr = hrefstr.substring(pos+1);
		   para = parastr.split("&");
		   tempstr="";
		   for(i=0;i<para.length;i++)
		   {
			tempstr = para[i];
			pos = tempstr.indexOf("=");
			if(tempstr.substring(0,pos) == argname)
			{
			 return tempstr.substring(pos+1);
			 }
		   }
		   return null;
	},
       /**
         *等待信息(公用)
         *@params msg 提示信息
         *@params b boolean 是否显示（true  显示|false 关闭）
       */
       waitMsg:function(msg,b){
	        if(!b){
	             this.get('main-wait-mask').hide();
	             return null;
	        }
            var path=Gv.hostPath?Gv.hostPath+'/images/loading.gif':'images/loading.gif',
                  h='<div style="margin:150px auto;width:100px;background:#000; padding:10px;color:#fff;">'+
                        '<img src="'+path+'" style="margin-right:10px;">'+msg+'</div>';
          this.get('main-wait-mask').html(h).css({
				width:this.clientW,
				height:this.clientH,
				background:'#FFF',
				display:'block',
				zIndex:9999,
				opacity:0.7
		  });
       	},
       	gvI18n:function(key){
       	    // 输入判断
            if(this.isEmpty(key)){return null;}
       		var text = this.languages[key];
       		// key没有对应的value，返回Key
       		return this.isEmpty(text)?key:text;
       	},
    	gvRegisterLanguage:function(v){
    		if(this.isEmpty(v)){return null;}
       		$.extend(this.languages, v);
       	},
       	//获取url的contextPath
       	getContextPath:function(url){
       		var preffix = "/";
       		if(url == null || url == ""){
       			return null;
       		}
			var index = url.indexOf(preffix);
			if(index != -1 && index ==0){
				 return url.substring(1,url.indexOf(preffix,1));
			}else{
				 return url.substring(0,index);
			}

       	},
       	//判断此contextPath的菜单是否加载过
       	isLoaded:function(contextPath){
       		Gv.log(this.isLoadLanguageConfig[contextPath]);
       		if(this.isLoadLanguageConfig[contextPath] == undefined){
       			return true;
       		}
       		return false;
       	},
       	/**
       	 *params modelName String 型号名称
       	 *params tabCfg {} 框架tabPanel配置参数
       	 *params pageCfg {} 展示内容配置参数
       	 */
       	pagePanelGenerator:function(modelName,tabCfg,pageCfg){
       		try{
       			var pages={
       					//win server
       					WINDOWS:'gv_window_server_page_generator',
       					//linux server
       					LINUX:'gv_linux_server_page_generator',
       					//水冷机柜
       					DAWNINGLIQUIDCOOLRACK:null,
       					//风冷机柜
       					DAWNINGRACK:null,
       					//TC3600刀片机箱
       					TC3600:'gv_bladechassis3600_page_generator',
       					//TC4600刀片机箱
       					TC4600:'gv_bladechassis4600_page_generator',
       					//TC4600H刀片机箱
       					TC4600H:'gv_bladechassis4600h_page_generator',
       					//IB交换机
       					IBSWITCH:null,
       					//以太网交换机
       					ETHSWITCH:null,
       					//思科交换机
       					CISCOSWITCH:'gv_switches_page_generator',
       					//h3c交换机
       					H3CSWITCH:'gv_switches_page_generator'
       			};
       			var func=eval('('+pages[modelName]+')')
       			if($.isFunction(func)){
       				var itm=func(pageCfg);
       				tabCfg.items=[itm];
       				Gv.frameTabPanel.addTab(tabCfg);//;
       			}
       		}catch(e){
       			Gv.log(e);
       		}
       	},
        //对象转字符串
        Obj2str: function(o) {
            if (o == undefined) {
                return "";
            }
            var r = [];
            if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
            if (typeof o == "object") {
                if (!o.sort) {
                    for (var i in o)
                        r.push("\"" + i + "\":" + this.Obj2str(o[i]));
                    if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                        r.push("toString:" + o.toString.toString());
                    }
                    r = "{" + r.join() + "}"
                } else {
                    for (var i = 0; i < o.length; i++)
                        r.push(this.Obj2str(o[i]))
                    r = "[" + r.join() + "]";
                }
                return r;
            }
            return o.toString().replace(/\"\:/g, '":""');
        }
};
