(function ($) {
    $.fn.Tab = function (opt) {
        //默认配置
        var cfg = {
            items: [{
                'text': 'tab',
                'closed': true,
                'icon': '',
                'html': '',
                'load': '',
                //强制刷新
                'forceLoad':false,
                'callback': function () {}
            }],
            //tab的属性
            width: '100%',
            height: '100%',
            tabcontentWidth: 498,
            tabWidth: 150,
            //单个标签宽度
            tabHeight: 40,
            //单个标签高度
            tabScroll: true,
            //是否实现有滚动按钮（默认是true）
            tabScrollWidth: 19,
            tabClass: 'tab',
            tabMenuPrefix: 'tab-menu-',
            tabMenuClass: 'tab-menu',
            tabContentPrefix: 'tab-content-',
            tabContentClass: 'tab-content',
            tabClassOn: 'on',
            tabClassOff: 'off',
            tabClassClose: 'close',
            //单个标签中关闭样式
            tabClassInner: 'inner',
            //单个标签样式
            tabClassText: 'text',
            //单个标签中文字样式
            tabClassScrollLeft: 'scroll-left',
            tabClassScrollRight: 'scroll-right',
            tabHeaderClass: 'tab-header',
            //标签集合parent DIV 样式
            tabClassHtmlDiv: 'tab-html',
            tabHtml: '',
            currentActiveId:null,
            //用于存放已经打开的Tab，并放置各种监听'close','active'
            tabs: {}
        },
           $this = $(this);
        $.extend(cfg, opt);
        //tab target content
        var tabContent = $('<div />').attr('id', cfg.tabContentClass).width('100%').height(cfg.height - cfg.tabHeight).addClass(cfg.tabContentClass),
            scrollLeft, scrollRight,
        //tabDiv,该div是自动增加的
        tab = $('<div />').attr('id', 'tab_div').height(cfg.tabHeight).addClass(cfg.tabClass).append('<ul />'),
            tabHeader, obj, tabMenu = $('<div id="' + cfg.tabMenuClass + '" class="' + cfg.tabMenuClass + '" />').css({
            'width': cfg.width - cfg.tabScrollWidth * 4,
            //cW,
            'height': cfg.tabHeight
        }).append(tab);
        bulidTabScrollBtn();
        tabHeader = $('<div />').css({
            'overflow': 'hidden',
            'position': 'relative',
            'width': cfg.width,
            'height': cfg.tabHeight
        }).attr('id', cfg.tabHeaderClass).append(scrollLeft).append(scrollRight).addClass(cfg.tabHeaderClass);

        obj = $this.append(tabHeader.append(tabMenu)).append(tabContent);

        $.each(cfg.items, function (i, o) {
            addTab(o);
        });

        //add tab
        function addTab(item) {
        	//标签存在就不加了
    		if (Gv.get(cfg.tabMenuPrefix + item.id).get(0)) {
    			actionTab(item.id,item);
    			displayTabContent(item);
    			return null;
    		}

            //close
            var close = '',inner = '';
            if (item.closed) { //是否有关闭按钮
                close = $('<a class="' + cfg.tabClassClose + '" onclick="return false;" ><i class="icon-remove-sign"></i></a>').click(function () {
                    removeTab($(this).parent().attr('id').split(cfg.tabMenuPrefix)[1]);
                });
            }
            inner = $('<a class="' + cfg.tabClassInner + '" onclick="return false;">' + '<span class="' + cfg.tabClassText + '">' + item.text + '</span></a>');
            setTabClassOnOff(tab.find('ul').children('li'), cfg.tabClassOff);
            var li=$('<li id="' + cfg.tabMenuPrefix + item.id + '"></li>').attr({
            	resId:item.id
            });
            li.addClass(cfg.tabClassOff).css({
                width: cfg.tabWidth
            }).bind('click',function(event){
            	 clickTab($(this), {id:$(this).attr('resId')});
            }).append(close).append(inner).appendTo(tab.find('ul'));
            setTabScrollBtn();
            actionTab(item.id,item);
            displayTabContent(item);
        }

        function clickTab(_self, item) {
            if (_self.hasClass(cfg.tabClassOn)) return;
            var currentActive=_self.parent().find('li.on');
            setTabClassOnOff(_self.parent().find('li'), cfg.tabClassOff);
            setTabClassOnOff(_self, cfg.tabClassOn);
            //回调函数是什么
            if (item.callback) item.callback(_self);
            actionTab(item.id,item);
            displayTabContent(item);
        }
        //关闭Tab的方法
        function removeTab(/*string*/id) {
            var $obj = $('#' + cfg.tabMenuPrefix + '' + id),
                currentObj = '',
                flag = false;
            if ($obj.attr('class') == 'on') { //如果删除的是当前激活标签
                if ($obj.prev().get(0)) {
                    currentObj = $obj.prev();
                } else if ($obj.next().get(0)) {
                    currentObj = $obj.next();
                }
                if (currentObj != '') {
                	//var tempId=currentObj.attr('id').split(cfg.tabMenuPrefix)[1];
                	actionTab(currentObj.attr('id').split(cfg.tabMenuPrefix)[1]);
                }
            }
            //激活监听
            if (cfg.tabs[id]) {
                if ($.isFunction(cfg.tabs[id]['close'])) {
                	Gv.log('listeners close')
                    cfg.tabs[id]['close']();
                }
            }
            delete cfg.tabs[id];
            $obj.remove();
            $('#' + cfg.tabContentPrefix + '' + id).remove();
            rightSrcollFun();
            setTabScrollBtn();
        }
        //得到当前当前tabId
        function getCurrentTabId() {
            var id = '';
            Gv.get('frame-tab').find('li[id^="' + cfg.tabMenuPrefix + '"]').each(function () {
                if ($(this).attr('class') == 'on') {
                    var tmp = $(this).attr('id');
                    id = tmp.substring(cfg.tabMenuPrefix.length);
                    return false;
                }
            });
            return id;
        }
        /*设置标签当前样式*/
        function setTabClassOnOff($obj, cls) {
            $obj.removeClass().addClass(cls);
        }
        /*展示tab的内容*/
        function displayTabContent(item) {
            var content = $('#' + cfg.tabContentPrefix + item.id);
            //强制重新加载数据
            if(item.forceLoad){
            	 if (content[0]) {
            		 content.remove();
            		 content = $('#' + cfg.tabContentPrefix + item.id);
            	 }
            }
            $('div[id^="' + cfg.tabContentPrefix + '"]').hide();
            if (!content[0]) {
                content = $('<div id="' + cfg.tabContentPrefix + item.id + '" />').hide().appendTo(tabContent);
                content.show();
                //判断是显示html代码还是ajax请求内容
                if (item.html) {
                    content.html(item.html);
                    return null;
                }
                //url 请求
                if (item.load) {

                	if(item.load.indexOf('?') != -1){
                		item.load = item.load + "&nocache="+new Date().getTime();
                	}else{
                		item.load = item.load + "?nocache="+new Date().getTime();
                	}
                    if (item.load.indexOf(' domain') > -1) { //跨域显示判断
                        var iframeId = cfg.tabContentPrefix + item.id;
                        var iframe = $('<iframe width="0" height="0"  align="center"  id="' + iframeId + '" name="' + iframeId + '"  frameborder="0"   onLoad="Gv.iframeHWAuto(this)" >').attr('src', item.load.replace(' domain', ''));
                        content.append(iframe);
                    } else {
                        content.load(item.load);
                    }

                }
                //items 对象
                if (!Gv.isEmpty(item.items)) {
                   	 for(var i=0;i<item.items.length;i++){
                   	 	var itm=item.items[i],
	                   	    tmp,obj;
	             	    if(itm.constructor==Object){
	             			tmp=Gv.xtypeObject(itm.xtype);
	             			obj=new tmp(itm);
	             		}else{
	             		    obj=o;
	             		}
                   	    content.append(obj.build());
                   	    if($.isFunction(obj.doLayout)){
                   	    	obj.doLayout();
                   	    }
                   	 }

                }
            } else {
                content.show();
            }
        }
        //得到Tab的内高度
        function getTabInnerHeight() {
            var h = 0;
            $('.' + cfg.tabContentClass).each(function () {
                if ($(this).is(":visible")) {
                    h = $(this)[0].offsetHeight;
                    return false;
                }
            });
            return h;
        }
        //得到Tab的内宽度
        function getTabInnerWidth() {
            var w = 0;
            //$('.'+cfg.tabContentClass).each(function(){
            //	if( $(this).is(":visible")){
            //		w=$(this)[0].offsetWidth;
            //		return false;
            //	}
            //});
            return Gv.clientW - Gv.get('frame-nav').width();
        }
        //激活监听
        /**
         * @param tabId string
         * @param fun function
         */
        function activeTabListener(tabId, fun){
        	  if (cfg.tabs[tabId]) {
                  cfg.tabs[tabId]['active'] = fun;
              } else {
                  cfg.tabs[tabId] = {};
                  cfg.tabs[tabId].active = fun;
              }
        }
        //非激活监听
        /**
         * @param tabId string
         * @param fun function
         */
        function inactiveTabListener(tabId, fun){
        	  if (cfg.tabs[tabId]) {
                  cfg.tabs[tabId]['inactive'] = fun;
              } else {
                  cfg.tabs[tabId] = {};
                  cfg.tabs[tabId].inactive = fun;
              }
        }
        //关闭tab时的监听
        /**
         * @param tabId string
         * @param fun function
         */
        function closeTabListener(tabId, fun) {
            if (cfg.tabs[tabId]) {
                cfg.tabs[tabId]['close'] = fun;
            } else {
                cfg.tabs[tabId] = {};
                cfg.tabs[tabId].close = fun;
            }
        }
        /**
         * @param tabId string
         * @param fun function
         */
        function resizeTabListener(tabId, fun) {
            if (cfg.tabs[tabId]) {
                cfg.tabs[tabId]['resize'] = fun;
            } else {
                cfg.tabs[tabId] = {};
                cfg.tabs[tabId].resize = fun;
            }
        }
        //tab大小发生变化
        /**
         * @param w tabInnerWidth(变化后的宽)
         * @param h tabInnerHeight(变化后的height)
         */
        function resizeTab(w, h) {
            //resize监听
            for (var id in cfg.tabs) {
                if ($.isFunction(cfg.tabs[id]['resize'])) {
                	Gv.log('listeners resize')
                    cfg.tabs[id]['resize'](w, h);
                }
            }
        }
        /**
         * 将要激活的标签放到Tab menu中来
         * id string
         */
        function actionTab(id,item) {
            var index = $('#' + cfg.tabMenuPrefix + id).index(),
                tabMenuW = getTabMenuWidth(),
            /*做偏移量*/
            tabOffsetLeft = getTabOffsetLeft(),
                $liArr = tab.find('li');
            //判断要激活的标签是否在tabMenu中
            var left = (index + 1) * (cfg.tabWidth + 2) - Math.abs(tabOffsetLeft),
                //2是 li标签的margin-left
            tempW = left - tabMenuW;
            if (left <= 0) { //在Tabmenu 的左边框外
                tab.animate({
                    'left': tabOffsetLeft + Math.abs(left) + (cfg.tabWidth + 2)
                }, 300,function(){
                	showHideLeftRightBtn();
                });
            } else if (left < cfg.tabWidth) { //有部分在Tabmenu 的左边框外
                tab.animate({
                    'left': tabOffsetLeft + (cfg.tabWidth - left+2)
                }, 300,function(){
                	showHideLeftRightBtn();
                });
            } else if (tempW > 0) { //在Tabmenu 的右边框外
                tab.animate({
                    'left': tabOffsetLeft - tempW
                }, 300,function(){
                	showHideLeftRightBtn();
                });
            }
            var currentActive=Gv.get(cfg.tabMenuPrefix + cfg.currentActiveId);
            if(currentActive[0]&&id!=cfg.currentActiveId){
            	//非激活监听
            	var inactiveId=currentActive.attr('id').split(cfg.tabMenuPrefix)[1];
            		if(!Gv.isEmpty(cfg.tabs[inactiveId])){
            			if ($.isFunction(cfg.tabs[inactiveId]['inactive'])) {
            				Gv.log('listeners inactive')
            				cfg.tabs[inactiveId]['inactive']();
            			}
            		}
            }
            setTabClassOnOff($('li[id^="' + cfg.tabMenuPrefix + '"]'), cfg.tabClassOff);
            setTabClassOnOff($liArr.eq(index), cfg.tabClassOn);
            $('div[id^="' + cfg.tabContentPrefix + '"]').hide();
            $('#' + cfg.tabContentPrefix + id).show();
            item=Gv.isEmpty(item)?{}:item;
            if (cfg.tabs[id]&&!item.forceLoad) {
	           	 //激活监听
	           	if ($.isFunction(cfg.tabs[id]['active'])) {
	           		Gv.log('listeners active')
	           		cfg.tabs[id]['active']();
	           	}
           }
            cfg.currentActiveId=id;

        }
        /*tabMenu 左移动函数 */
        function leftSrcollFun() {
            var tabOffsetLeft = getTabOffsetLeft(),
                sumW = getTabLiSumWidth(),
                //2是 li标签的margin-left
                left = 0,
                width = 0,
                tempV = sumW - Math.abs(tabOffsetLeft) - getTabMenuWidth();
            //右边的按钮
            var rightBtn=scrollRight;
            //左边的按钮
            var leftBtn=rightBtn.parent().children('div.scroll-left');
            var cls=leftBtn.attr('class');

            if (isShowRightBtn()) {
            	if(cls.indexOf('scroll-left-disable')>-1){
            		leftBtn.removeClass('scroll-left-disable');
            	}
                left = tempV - cfg.tabWidth > 0 ? (cfg.tabWidth + 2) : tempV;
                tab.animate({
                    'left': tabOffsetLeft - left
                }, 300,function(){
                	if(!isShowRightBtn()){
                		scrollRight.addClass('scroll-right-disable');
                	}
                });
            }else{
            	scrollRight.addClass('scroll-right-disable');
            }

        }
        /*tabMenu 右移动函数 */
        function rightSrcollFun() {
            var tabOffsetLeft = getTabOffsetLeft(),
                left = 0;
            //获得左边的按钮
            var leftBtn=scrollLeft;
           //获得右边的按钮
            var rightBtn=leftBtn.parent().children('div.scroll-right');
            var cls=rightBtn.attr('class');
            if (isShowLeftBtn()) {
            	if(cls.indexOf('scroll-right-disable')>-1){
            		rightBtn.removeClass('scroll-right-disable');
            	}
                left = tabOffsetLeft + cfg.tabWidth >= 0 ? 0 : tabOffsetLeft + cfg.tabWidth;
                tab.animate({
                    'left': left
                }, 300,function(){
                        showHideLeftRightBtn();
                });
            }
            showHideLeftRightBtn();
        }
        /*是否长过tabMenu的长度*/
        function isLongerTabMenu() {
            var tabHeaderW = getTabHeaderWidth();
            return getTabLiSumWidth() > getTabMenuWidth();
        }
        /*设置滚动按钮*/
        function setTabScrollBtn() {
            if (cfg.tabScroll) {
                var flag = isLongerTabMenu();
                setTabMenuStyle(flag);
                displayTabScrollBtn(flag);
            }
        }
        /*创建滚动按钮*/
        function bulidTabScrollBtn() {
            scrollLeft = $('<div class="' + cfg.tabClassScrollLeft + '"><i class="icon-chevron-left"></i></div>').hide().click(function () {
                rightSrcollFun();
            });
            scrollRight = $('<div class="' + cfg.tabClassScrollRight + '"><i class="icon-chevron-right"></i></div>').hide().click(function () {
                leftSrcollFun();
            });
        }
        /*显示滚动按钮 true-显示 false-隐藏*/
        function displayTabScrollBtn(/*boolean*/b) {
             if(b){
            	scrollRight.addClass('scroll-right-disable');
             }else{
            	 scrollRight.removeClass('scroll-right-disable');
            	 scrollLeft.removeClass('scroll-left-disable');
             }
            b ? tabHeader.find('div[class^="scroll-"]').show() : tabHeader.find('div[class^="scroll-"]').hide();
        }

        function setTabMenuStyle(b) {
            tabMenu.css({
                width: getTabHeaderWidth() - cfg.tabScrollWidth * 4
            });
        }

        function getTabMenuWidth() {
            return tabMenu[0].offsetWidth;
        }

        function getTabHeaderWidth() {
            return tabHeader[0].offsetWidth-180;
        }
        /*tab左偏移量*/
        function getTabOffsetLeft() {
            return Number(tab.css('left').replace('px', ''));
        }
        /*是否显示Right侧按钮*/
        function isShowRightBtn(){
        	 var tabOffsetLeft = getTabOffsetLeft(),
             sumW =getTabLiSumWidth(),
             tempV = sumW - Math.abs(tabOffsetLeft) - getTabMenuWidth();
        	 Gv.log('isShowRightBtn:'+(tempV>0))
             return tempV>0;
        }
        /*是否显示Left侧按钮*/
        function isShowLeftBtn(){
        	Gv.log('isShowLeftBtn:'+ (getTabOffsetLeft()<0))
        	return  getTabOffsetLeft()<0;
        }
        //获取全部li的总宽度
        function getTabLiSumWidth(){
        	var liNumber = tabMenu.find('li').length;
      	  //2是 li标签的margin-left
            return  liNumber * (cfg.tabWidth + 2);
        }
        //显示或隐藏left or right btn
        function showHideLeftRightBtn(){
        	if(!isShowLeftBtn()){
            	scrollLeft.addClass('scroll-left-disable');
            }else{
            	scrollLeft.removeClass('scroll-left-disable');
            }
            if(!isShowRightBtn()){
            	scrollRight.addClass('scroll-right-disable');
            }else{
            	scrollRight.removeClass('scroll-right-disable');
            }
        }
        return obj.extend({
            'addTab': addTab,
            'removeTab': removeTab,
            'actionTab': actionTab,
            'resizeTab': resizeTab,
            'getTabInnerHeight': getTabInnerHeight,
            'getTabInnerWidth': getTabInnerWidth,
            'activeTabListener': activeTabListener,
            'inactiveTabListener': inactiveTabListener,
            'closeTabListener': closeTabListener,
            'getCurrentTabId': getCurrentTabId,
            'resizeTabListener': resizeTabListener
            //'refresh':refresh
        });
    };
})(jQuery);