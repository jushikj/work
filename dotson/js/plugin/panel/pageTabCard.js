/**
 *子页面选项卡
 *TabCardPanel
 *opts{}  renderTo: string
 *opts{}  activeTab: int
 *opts{}  width int
 *opts{}  height: 250
 *opts{}  border: true
 *opts{}  cls: String//添加的CSS样式类
 *opts{}  listeners: {}
 *opts{}  listeners afterLayout fun
 *opts{}  items array
*/
Gv.TabCardPanel = function(opts) {
	this.cfg = {
		id:'',
		widht : 200,
		activeTab : 0,
		height : 'auto',
		border : true,// 是否显示边框
		cls : '',// 添加的CSS样式类
		listeners : {},
		items : []
	};
	$.extend(true, this.cfg, opts);
	if (!this.cfg.id) {
		alert('TabCardPanel id is null');
		return null;
	}
	this.buildMain();
};
Gv.TabCardPanel.prototype.buildMain = function() {
	this.main = $('<div id="' + this.cfg.id + '"/>').addClass(this.cfg.cls);
	this.main.appendTo($('#' + this.cfg.renderTo));
	this.main.append(this.tabMenu()).append(this.tabContent());
	if ($.isFunction(this.cfg.listeners.afterLayout)) {
		this.cfg.listeners.afterLayout();
	}
};
/* tabMenu */
Gv.TabCardPanel.prototype.tabMenu = function() {
	var self = this;
	this.menu = $('<div class="page-tab-card" />');
	this.menuContainer = $('<ul id="tabCard" class="cl"></ul>');
	for ( var i = 0; i < this.cfg.items.length; i++) {
		var menuBtn = $('<li />');
		if (this.cfg.activeTab == i) {
			menuBtn.addClass('active');
		}
		menuBtn.append('<a>' + this.cfg.items[i].title + '</a>');
		menuBtn.bind('click', {
			index : i
		}, function(event) {
			self.bindClick(this, event);
			if($.isFunction(self.cfg.clickTabHandler)){
				self.cfg.clickTabHandler(event.data.index);
			}
		});
		this.menuContainer.append(menuBtn);
		// str+='<li class="active" onclick="nTabs(this,0);"><a>节点组</a></li>'
	}
	return this.menu.append(this.menuContainer);
};
/* bind click */
Gv.TabCardPanel.prototype.bindClick = function(thiz, event) {
	var self = this;
	var menuBtn = $(thiz);
	if (menuBtn.attr('class') == "active") {
		return null
	};
	var tabList = $('#' + this.cfg.id + ' ul[id="tabCard"]').children('li');
	tabList.each(function(i) {
		var clsName = 'active';
		if (i == event.data.index) {
			Gv.get(
					self.cfg.id + ' div.page-tab-con>div[id="tabCard-Content'
							+ i + '"]').show();
		} else {
			Gv.get(
					self.cfg.id + ' div.page-tab-con>div[id="tabCard-Content'
							+ i + '"]').hide();
			clsName = 'normal';
		}
		$(this).attr('class', clsName);

	});
};
/* tab content */
Gv.TabCardPanel.prototype.tabContent = function() {
	var contentStr = $('<div class="page-tab-con" />')
	this.content = $(contentStr);
	for ( var i = 0; i < this.cfg.items.length; i++) {
		var con = $('<div id="tabCard-Content' + i + '" />');
		con.append(this.cfg.items[i].html);
		if (this.cfg.items[i].load) {
			if (this.cfg.items[i].load.indexOf(' domain') > 0) {
				var iframeId = this.cfg.id + 'iframe';
				var iframe = $(
						'<iframe width="0" height="0"  align="center"  id="'
								+ iframeId
								+ '" name="'
								+ iframeId
								+ '"  frameborder="0"   onLoad="Gv.iframeHWAuto(this)" >')
						.attr('src', item.load.replace(' domain', ''));
				con.append(iframe);
			} else {
				con.load(this.cfg.items[i].load);
			}
		}
		this.cfg.activeTab == i ? con.show() : con.hide();
		this.content.append(con);
	}
	return this.content;
};
/*得到当前active tab 序号*/
Gv.TabCardPanel.prototype.getActiveTabIndex=function(){
	var index=0;
	Gv.get(this.cfg.id+' div[id^="tabCard-Content"]').each(function(i){
		if($(this).is(":visible")){
			index=i
			return false;
		}
	});
    return index;
} ;
/**
new Gv.TabCardPanel({
    renderTo: document.body,
    activeTab: 0,
    cls:'test',//添加的CSS样式类
    width: 400,
    height: 250,
    border: true,
    clickTabHandler:function(index){
       //index 序号
    },
    listeners: {
        afterLayout: function () {}
    },
    items: [{
        title: 'Normal Tab',
        html: "My content was added during construction.",
        load:''
    },
    {
        title: 'Ajax Tab 1',
        load: 'ajax1.htm'
    },
    {
        title: 'Ajax Tab 2',
        html: '',
    }]
});
 *
 */
