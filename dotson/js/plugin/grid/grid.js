/**
 * 带分页的表格组件
 *@author LLJ
 *@version 1.0.0
 */
/**
 * @param cfg{}
 * @param cfg{} id  String
 * @param cfg{} renderTo String
 * @param cfg{} columns array()
 * @param cfg{} autoPrev boolean 默认是true 自动向前翻一页（当最后一页中的数据删除后表格会向前自动翻一页）
 * @param cfg{} store {}
 * @param cfg{} autoLoad  boolean 自动加载（默认True）
 * @param cfg{} isCheckBox boolean（默认false）
 * @param cfg{} isPageBar boolean（默认true）
 * @param cfg{} emptyText String 没有数据时显示文字
 * @param cfg{} waitText String  加载数据时显示文字
 *
 * listeners{
 *   beforeLoad(data)
 *   afterLoad(data)
 * }
 */
Gv.grid.GridPanel = function (c) {
    //配置参数默认值
    this.cfg = {
    	renderTo:'',
    	width: 600,
        height: 300,
        cls:'',
        //是否显示蒙照
        isLoadMask:true,
        //是否显示PageBar
        store: {
        	filter:null,
        	baseParams:{},
            params: {
                key: '',
                limit: 0,
                sort: 'ASC',
                start: 0
            }
        },
        viewConfig: {
        	//自适应父类宽高
            forceFit: false
        },
        //contextmenu:true,
        autoPrev: true,
        autoLoad: true,
        isPageBar:true,
        emptyText:Gv.gvI18n("page_no_data"),//'没有数据',
        waitText:Gv.gvI18n("page_wait"),//'加载中,请稍候...',
        rowCcontextmenu:null,
        listeners: {
            beforeLoad: null,
            afterLoad: null
        }
    };
    this.msg={
    	prev:Gv.gvI18n('page_plugin_prev'),
    	next:Gv.gvI18n('page_plugin_next'),
    	refresh:Gv.gvI18n('page_plugin_refresh'),
    	first:Gv.gvI18n('page_plugin_first'),
    	last:Gv.gvI18n('page_plugin_last')

    };
    this.baseParams = {};
    this.tmpStore={};//只用于load和分页使用
    this.cfg.id='grid-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true, this.cfg, c);
    this.data;
    //搜索值
    this.key = '';
    //每页显示行数
    this.limit = this.cfg.store.params.limit?this.cfg.store.params.limit:0;
    //开始行数
    this.start = 0;
    //总条数
    this.total = 0;
    //排序字段
    this.sort = '';
    //排序方向 ASC:升序，DESC:降序，
    this.dir = '';
    this.realTableOffSetWidth=0;
    this.baseParams=this.cfg.store.baseParams;
    if(typeof this.cfg.width =='string'&&this.cfg.width.indexOf('%')>-1){
    	this.realTableOffSetWidth=Gv.get(this.cfg.renderTo).width()||Gv.get(this.cfg.renderTo)[0].offsetWidth;
    }else{
    	this.realTableOffSetWidth=this.cfg.width;
    }
    if(this.cfg.renderTo){
    	this.build();
    	Gv.get(this.cfg.renderTo).append(this.table);
		//增加滚动条
		this.table.children('.page-table-body').mCustomScrollbar({
			advanced:{
			updateOnContentResize: true,
			updateOnBrowserResize: true
			},
			scrollButtons:{
				enable:true
			},
			theme:"dark-thick"//,
			//autoHideScrollbar:true
		});

    }
    if (this.cfg.autoLoad) {//使用后台数据
        this.load(this.cfg.store)
    }
    if(!Gv.isEmpty(this.cfg.data)){//使用静态数据
    	this.display(this.cfg.data)
    }
    if (this.cfg.isCheckBox) {
        this.bindCheckBoxClick();
    }
    this.bindResizeEvent();
};


/*创建Table HTML*/
Gv.grid.GridPanel.prototype.build = function () {
	//table header
    this.header = this.headerHtml();
    //table body
    this.body = $('<div class="page-table-body" />').css({
        position: 'relative',
        overflowY:'auto',
        overflowX:'hidden'
    }).append('<table><tbody></tbody></table>');
    //table page
    this.page=$('<div class="page-table-page" />');
    //table
    this.table = $('<div id="'+this.cfg.id+'" class="page-table" />')
    .append(this.header)
    .append(this.body)
    .append(this.page)
    .append(this.loadMaskHtml())
    .css({position:'relative'});
    //set width height
    if(this.cfg.width){
    	this.setWidth(this.cfg.width);
    }
    if(this.cfg.height){
    	this.setHeight(this.cfg.height);
    }
    if(this.cfg.cls){
    	this.table.addClass(this.cfg.cls);
    }
    return this.table;
};
/*创建列头HTML*/
Gv.grid.GridPanel.prototype.headerHtml = function () {
    var self = this,
        header = $('<div class="page-table-head">'),
        thead, tr,tmpDiv,tmpTh;
    if (!Gv.isEmpty(this.cfg.columns)) {
        thead = $('<thead />');
        tr = $('<tr />');
        if (this.cfg.isCheckBox) {
        	tmpTh=$('<th />').css({
        		width:30,
        		//height:'100%',
        		textAlign:'center'
        	}).append('<input type="checkbox"  id="all">').wrap("<th />");
            tr.html(tmpTh);
        }
        for (var i = 0; i < this.cfg.columns.length; i++) {
            var col = this.cfg.columns[i];
            if(col.hidden===true){
            	continue;
            }
            var maxW=0;
            if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
            	maxW=(parseFloat(col.width||100)/100)*(this.realTableOffSetWidth)-2;
            }else{
            	maxW=parseFloat(col.width||100);
            }
            tmpDiv=$('<div />').css({
        		width:col.width?col.width:100,
            	maxWidth:maxW-14,
            	width:'auto !important',
            	display:'block',
            	overflow: 'hidden',
            	textOverflow: 'ellipsis',
            	whiteSpace: 'nowrap',
        		textAlign:col.headerAlign?col.headerAlign:'center'
        	}).append(col.header);
            var th = $('<th />').append(tmpDiv).css({
                width:col.width?col.width:100,
                maxWidth:maxW-14
            });
            if(col.headerHidden){
            	tmpDiv.css('margin-top','-999px');
            }
            if(col.headerTips==null||col.headerTips==undefined||col.headerTips==true){
            	tmpDiv.attr('title',col.header)
            }
            if(col.sortable!==false){
            	tmpDiv.append('<i class="icon-caret-down" style="display:none;"></i>');
            	th.css({
                    cursor: 'pointer'
                }).bind('click',function () {
                    self.headerClick($(this));
                }).bind('mouseenter',function(){
                	$(this).find('i').fadeIn(200);
                }).bind('mouseleave',function(){
                	$(this).find('i').fadeOut(200);
                }).attr({
                    id: col.dataIndex,
                    sort: 'DESC'
                });
            }
            tr.append(th)
        };
        tr.append('<th></th>');
        thead.append(tr);
    }
   $('<table />').append(thead).appendTo(header);
    return header;
};
/*设置列内容DIv宽*/
Gv.grid.GridPanel.prototype.setColumnContentWidth=function(){
   var gridW=Gv.get(this.cfg.renderTo).width()||Gv.dom(this.cfg.renderTo).offsetWidth;
   var colWidthArr=[];
   this.realTableOffSetWidth=gridW;
   if (!Gv.isEmpty(this.cfg.columns)) {
	   for (var i = 0; i < this.cfg.columns.length; i++) {
           var col = this.cfg.columns[i];
           if(col.hidden===true){
           	continue;
           }
		   var maxW=0;
	       if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
	       	maxW=(parseFloat(col.width||100)/100)*(this.realTableOffSetWidth)-2;
	       }else{
	       	maxW=parseFloat(col.width||100);
	       }
	       colWidthArr.push(maxW-14);
	   }

   }
   //如果有checkbox 就增加一个占位
   if (this.cfg.isCheckBox) {
	   colWidthArr.unshift(30);
   }
   this.header.find('tr').each(function(){
	   var tr=$(this);
	   tr.find('th').each(function(index,el){
		   var tdW= colWidthArr[index];
		   $(el).css({  maxWidth:tdW+14 })
		   $(el).children('div').css({
			   maxWidth:tdW
		   })
	   })
   })
   this.body.find('tr').each(function(){
	   var tr=$(this);
	   tr.find('td').each(function(index,el){
		   var tdW= colWidthArr[index];
		   $(el).css({ maxWidth:tdW+14 })
		   $(el).children('div').css({
			   maxWidth:tdW
		   })
	   })
   })
};
/*绑定resize事件 */
Gv.grid.GridPanel.prototype.bindResizeEvent=function(){
	//var me=this;
   //$(window).resize(function(){
	//   me.setColumnContentWidth();
   //})
};
Gv.grid.GridPanel.prototype.layout=function(){
	this.setColumnContentWidth();
};
/**
 * 暂时不用，return '';
 * 创建列头副本 HTML*/
Gv.grid.GridPanel.prototype.copyHeaderHtml = function () {
	/**
    var self = this,
        thead, tr,tmpDiv,tmpTh;
    if (!Gv.isEmpty(this.cfg.columns)) {
        thead = $('<thead />');
        tr = $('<tr />');
        if (this.cfg.isCheckBox) {
        	tmpTh=$('<th />').css({
        		width:30,
        		//height:'100%',
        		textAlign:'center'
        	}).append('<input type="checkbox"  id="all">').wrap("<th />");
            tr.html(tmpTh);
        }
        for (var i = 0; i < this.cfg.columns.length; i++) {
            var col = this.cfg.columns[i];
            if(col.hidden===true){
            	continue;
            }
            var th = $('<th />').append(col.header).css({
                cursor: 'pointer',
                width:col.width?col.width:100
            });
            tr.append(th)
        };
        tr.append('<th></th>');
        thead.append(tr).hide();
    }
    */
    return '';//thead;
};
/*Grid Header Click*/
Gv.grid.GridPanel.prototype.headerClick=function(target){
	 var sort = target.attr('sort'),
	 tempSort='',
     orderBy = target.attr('id'),
     i=target.find('i');
	 this.fieldSort(sort,orderBy);
	 if(sort == 'DESC' ){
		 i.attr('class','icon-caret-up');
		 tempSort='ASC' ;
	 }else{
		 i.attr('class','icon-caret-down');
		 tempSort='DESC' ;
	 }
	 target.attr('sort', tempSort);
};
/*创建tbody HTML*/
Gv.grid.GridPanel.prototype.tbodyHtml = function (d) {
    var self = this,tmpDiv,tmpTh;
    this.body.find('tbody').html('').before(this.copyHeaderHtml());
    if (!Gv.isEmpty(this.cfg.columns) && !Gv.isEmpty(d)) {
        for (var x = 0; x < d.length; x++) {
            var rec = d[x],
                tr = $('<tr />').attr('rowIndex',x);
            this.rowHtml(x,rec,tr);
            this.body.find('tbody').append(tr);
        }

    }else{
    	var empty='<div style="padding:10px;text-align:center;">'+this.cfg.emptyText+'</div>';
    	this.body.find('tbody').html(empty);
    }
};
/*行 HTML*/
Gv.grid.GridPanel.prototype.rowHtml=function(index,rec,tr){
	var tmptd='';
	var self=this;
	if (this.cfg.isCheckBox) {
    	tmptd=$('<td />').css({
    		width:30,
    		//height:'100%',
    		textAlign:'center'
    	}).append('<input type="checkbox"  id="' + index + '">').wrap("<th />");
        tr.html(tmptd);
    }
    for (var i = 0; i < this.cfg.columns.length; i++) {
        var col = this.cfg.columns[i],
            td = $('<td />');
        if(col.hidden===true){
        	continue;
        }
        var maxW=0;
        if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
        	//maxW=(parseFloat(col.width)/100)*Gv.frameTabPanel.getTabInnerWidth()-2;
        	maxW=(parseFloat(col.width||100)/100)*(this.realTableOffSetWidth)-2;
        }else{
        	maxW=parseFloat(col.width||100);
        }
        tmpDiv=$('<div id="'+index+'-'+col.dataIndex+'" />').css({
    		//width:col.width?col.width:100,
        	maxWidth:maxW-14,
        	width:'auto !important',
        	display:'block',
        	overflow: 'hidden',
        	textOverflow: 'ellipsis',
        	whiteSpace: 'nowrap',
    		textAlign:col.textAlign?col.textAlign:'center'
    	});
        if (col.xtype == 'actioncolumn') {
    			var fieldText=rec[col.dataIndex];
    			if($.isFunction(col.render)){
    				col.items=col.render(rec);
    			}
            for (var m = 0; m < col.items.length; m++) {
                var aTag = $('<a  href="#" />'),
                    iTag = $('<i />').addClass(col.items[m].icon).appendTo(aTag);
                if (col.items[m].tips) {
                    aTag.attr('title', col.items[m].tips)
                }
                if (col.items[m].text) {
                    aTag.append(col.items[m].text)
                }
                this.bindActionColumnHandler(aTag, col.items[m].handler, this, index, rec);
                tmpDiv.append(aTag);
            }
            td.append(tmpDiv).css({
            	width:col.width?col.width:100,
            	maxWidth:maxW-14
            });
            tr.append(td);
            continue;
        }
        var dataIndex = col.dataIndex,
            fieldText=rec[dataIndex];
        //layer2
        if(col.xtype == 'layer2'){
        	var  fieldText1=rec[col.fields[0]];
        	var  fieldText2=rec[col.fields[1]];
        	if(Gv.isArr(col.renders)){
        		 if($.isFunction(col.renders[0])){
        			 fieldText1=col.renders[0](fieldText1,index,this);
        		 };
        		 if($.isFunction(col.renders[1])){
        			 fieldText2=col.renders[1](fieldText2,index,this);
        		 }

        	}
        	var  layer1=$('<div style="width:100%" />').html(fieldText1);
        	var  layer2=$('<div style="width:100%" />').html(fieldText2);
        	if(col.tips){
        		layer1.attr('title',rec[col.fields[0]]);
        		layer2.attr('title',rec[col.fields[1]]);
            }
        	 tmpDiv.append(layer1).append(layer2);
        	 td.append(tmpDiv).width(col.width?col.width:100);
             tr.append(td);
        	 continue;
        }

        if(col.tips){
        	var tempFieldText=fieldText;
        	if($.isFunction(col.toolTip)){
        		tempFieldText=col.toolTip(fieldText);
        	}
        	tmpDiv.attr('title',tempFieldText);
        }
        if($.isFunction(col.render)){
        	fieldText=col.render(fieldText,index,this);
        	tmpDiv.html(fieldText);
        }else{
        	tmpDiv.text(fieldText);
        }
        td.append(tmpDiv).width(col.width?col.width:100);
        tr.append(td);
    };
   //行单击(默认都绑定行点击事件)
    this.bindRowClick(tr, this.cfg.rowClick, this, index, rec);
    //if($.isFunction(this.cfg.rowClick)){
   // }
    //行双击
    if($.isFunction(this.cfg.rowDbClick)){
    	this.bindRowDbClick(tr, this.cfg.rowDbClick, this, index, rec);
    }
    //右击
    if($.isFunction(this.cfg.rowContextmenu)){
    	this.bindRowContextmenu(tr, this.cfg.rowContextmenu, this, index, rec);
    }
    tr.append('<td />').data('data', rec);
};
/*.bind action Column Handler*/
Gv.grid.GridPanel.prototype.bindActionColumnHandler = function (tag, handler, grid, rowIndex, recorder) {
    tag.unbind().bind('click', {
        grid: grid,
        rowIndex: rowIndex,
        data: recorder
    }, function (event) {
    	var rec=event.data.grid.body.find('tr[rowIndex="'+event.data.rowIndex+'"]').data('data');
        handler(event.data.grid, event.data.rowIndex, rec, event)
    })
}
/*设置基础参数，不会随load的使用而自动清空*/
Gv.grid.GridPanel.prototype.setBaseParams = function (key, value) {
    this.baseParams[key] = value;
}
/*清空基础参数*/
Gv.grid.GridPanel.prototype.emptyBaseParams = function () {
	//清空临时参数和基础参数
	for(var k in this.baseParams){
		var v=this.tmpStore.params[k];
		if(!Gv.isEmpty(v)){
			delete this.tmpStore.params[k];
		}
	}
    this.baseParams = {};
};
/*行单击*/
Gv.grid.GridPanel.prototype.bindRowClick=function(tag, handler, grid,rowIndex,recorder){
	var self=this;
	tag.bind('click', {
        grid: grid,
        rowIndex: rowIndex,
        data: recorder
    }, function (event) {
    	var tr=$(this);
    	var rec=tr.data('data');
    	tr.siblings().removeClass('grid-click-row-color');
    	tr.addClass('grid-click-row-color');
    	 if($.isFunction(self.cfg.rowClick)){
    		 handler(event.data.grid, event.data.rowIndex, rec,event)
    	 }
    })
};
/*行双击*/
Gv.grid.GridPanel.prototype.bindRowDbClick=function(tag, handler, grid,rowIndex,recorder){
	tag.unbind('dblclick').bind('dblclick', {
        grid: grid,
        rowIndex: rowIndex,
        data: recorder
    }, function (event) {
    	var rec=$(this).data('data');
        handler(event.data.grid, event.data.rowIndex,rec,event)
    })
};
/*加载数据*/
Gv.grid.GridPanel.prototype.load = function (cfg) {
	if(this.cfg.isLoadMask){
		this.isLoadMask(true);
	}
    var self = this;
    if ($.isFunction(self.cfg.listeners.beforeLoad)) {
        self.cfg.listeners.beforeLoad();
    }
    this.tmpStore = {
    	timeout: this.cfg.store.timeout,
        url: this.cfg.store.url,
        params: {}
    };
    if(!Gv.isEmpty(cfg)){
    	$.extend(true, this.tmpStore, cfg);
    	$.extend(true, this.baseParams, cfg.baseParams);
    }
    $.extend(true, this.tmpStore.params, this.baseParams);
    this.limit=this.tmpStore.params.limit;
    this.start=this.tmpStore.params.start;
    Gv.ajax({
        url: this.tmpStore.url,
        data: this.tmpStore.params,
        timeout:this.tmpStore.timeout,
        successFun:function(json) {
        	if(self.cfg.isLoadMask){
        		self.isLoadMask(false);
    		}
        	var total=0,data=[];
        	if(!$.isEmptyObject(json)){
        		data=Gv.isArr(json.data)?json.data:[];
        		total=isNaN(parseInt(json.total))?0:json.total;
        	}
        	self.total=total;
        	//清空全选框
        	self.header.find('input').removeAttr("checked");
        	self.display(data);
        	if($.isFunction(self.cfg.store.filter)){
    			json=self.cfg.store.filter(json);
    		}
            if ($.isFunction(self.cfg.listeners.afterLoad)) {
                self.cfg.listeners.afterLoad(json);
            }
            if(self.cfg.isPageBar){
            	self.pageHtml();
            }
        },
        errorFun:function(event){
        	if(self.cfg.isLoadMask){
        		self.isLoadMask(false);
    		}
        	self.total=0;
        	//清空全选框
        	self.header.find('input').removeAttr("checked");
        	self.display([]);
        }
    });
};
/*展示*/
Gv.grid.GridPanel.prototype.display = function (d) {
    if(this.cfg.isLoadMask){
        		this.isLoadMask(false);
    }
    this.tbodyHtml(d);
    if(this.isForceFit()){
    	var pDom=this.table.parent()[0];
    	this.setHeihgt(pDom.offsetHeight);
    	this.setWidth(pDom.offsetWidth)

    }
};
/*bind CheckBox Click*/
Gv.grid.GridPanel.prototype.bindCheckBoxClick = function () {
	var self = this;
    /*Gv.get(this.cfg.renderTo + ' input[id="all"]').click(function () {
        var checkboxs = Gv.get(self.cfg.renderTo).find('input[type="checkbox"]');
        if ($(this).attr("checked") == 'checked') {
            checkboxs.attr("checked", true);
        } else {
            checkboxs.removeAttr("checked");
        }
    })*/
    Gv.get(this.cfg.renderTo + ' input[type="checkbox"]').bind('click',function () {

    	var allCkbox = Gv.get(self.cfg.renderTo + ' input[id="all"]');
    	var checkboxs =self.body.find('tbody input[type="checkbox"]');
    	if($(this).attr("id")=='all'){
            if ($(allCkbox).attr("checked") == 'checked') {
                checkboxs.attr("checked", true);
            } else {
                checkboxs.removeAttr("checked");
            }
    	}else{
            var status = checkboxs[0].checked;
            var i = 0;
            for(i=1; i<checkboxs.length; i++){
            	if(status != checkboxs[i].checked){
            		break;
            	}
            }
            if(i==(checkboxs.length) && status==true){
            	$(allCkbox).attr("checked", true);
            }else{
            	$(allCkbox).attr("checked", false);
            }
    	}
    })
};
/*得到选中的数据*/
Gv.grid.GridPanel.prototype.getChecked = function () {
    var arr = [];
    Gv.get(this.cfg.renderTo).find('input[type="checkbox"]').each(function () {
        if ($(this).attr("checked") == 'checked' && $(this).attr("id") != 'all') {
            var rec = $(this).parent().parent().data('data');
            arr.push(rec);
        }
    });
    return arr;
};
/**
 * 设置数据（修改数据）
 * @params rowIndex 行序号
 * @params data{}
 */
Gv.grid.GridPanel.prototype.setRecord=function(rowIndex,data){
	if(!$.isEmptyObject(data)){
		var tr=this.body.find('tr[rowindex="'+rowIndex+'"]');
		var tempD=tr.data('data');
		$.extend(true,tempD,data);
		tr.data('data', tempD);
		for(var item in data){
			 for (var i = 0; i < this.cfg.columns.length; i++) {
			        var col = this.cfg.columns[i];
			        if(col.dataIndex==item){
			        	var dis=tr.find('div[id="'+rowIndex+'-'+item+'"]');
		 				if(dis[0]){
							var fieldText=data[item];
					        if($.isFunction(col.render)){
					        	fieldText=col.render(data[item]);
					        	dis.html(fieldText);
					        }else{
					        	dis.text(fieldText);
					        }
						}
			        }
			 }

		}
	}
};
/**
 * @param rowIndex  行序号
 * @param fieldName 字段名称
 */
Gv.grid.GridPanel.prototype.getFiledDisplayValue=function(rowIndex,fieldName){
	var tr=this.body.find('tr[rowindex="'+rowIndex+'"]');
	return tr.find('div[id="'+rowIndex+'-'+fieldName+'"]');
};
/**
 * 获取一条数据
 * @params rowIndex 行序号
 */
Gv.grid.GridPanel.prototype.getRecord=function(rowIndex){
	var tr=this.body.find('tr[rowindex="'+rowIndex+'"]');
	return tr.data('data');
};
Gv.grid.GridPanel.prototype.waitText = function () {
    Gv.get('list').html(this.waitText);
};
Gv.grid.GridPanel.prototype.showWaitMask = function () {
    this.closeWaitMask();
    var dom = this.tbody[0],
        h = dom.offsetHeight,
        w = dom.offsetWidth,
        t = dom.offsetTop,
        l = dom.offsetLeft;
    this.tbody.append('<div id="' + this.cfg.id + '_gridMask" style="text-align:center;width:' + w + 'px;height:' + h + 'px;position:absolute;top:0px;left:0px;z-index:90;">' + this.waitText() + '</div>');
};
Gv.grid.GridPanel.prototype.closeWaitMask = function () {
    this.tbody.not('#' + this.cfg.id + '_gridMask');
};
/**
 * PageBar的HTML
 */
Gv.grid.GridPanel.prototype.pageHtml=function(){
	var self=this,pageContent=$('<div class="page-table-page-content" />'),
	nextBtn=$('<a class="button"/>').html('<i class="icon-chevron-right" title="'+this.msg.next+'"></i>').click(function(){
		self.nextPage();
	}),
	prevBtn=$('<a class="button"/>').html('<i class="icon-chevron-left" title="'+this.msg.prev+'"></i>').click(function(){
		self.previousPage();
	}),
	firstBtn=$('<a class="button"/>').html('<i class="icon-step-backward" title="'+this.msg.first+'"></i>').click(function(){
		self.firstPage();
	}),
	lastBtn=$('<a class="button"/>').html('<i class="icon-step-forward" title="'+this.msg.last+'"></i>').click(function(){
		self.lastPage();
	}),//
	refreshBtn=$('<a class="button"/>').html('<i class="icon-refresh" title="'+this.msg.refresh+'"></i>').click(function(){
		self.refreshPage();
	}),
	currentPageNum=this.getCurrentPageNumber(),
	totalNum=this.getTotalPageNumber();
	this.currentPageInput=$('<input class="currentPage" />').val(currentPageNum).unbind('keyup')
	.bind('keyup',function(){
			self.showCurrentPageNum(this);
	}),
	this.maxPage=$('<span />').text('/'+totalNum+' '+Gv.gvI18n('page_plugin_page')+' ('+Gv.gvI18n('page_plugin_total')+' '+this.total+' '+Gv.gvI18n('page_plugin_record')+')');
	pageContent.append(firstBtn).append(prevBtn).append(this.currentPageInput)
	.append(this.maxPage).append(nextBtn).append(lastBtn).append(refreshBtn);
	this.page.html(pageContent);
};
/**
 * 绑定刷新事件
 */
Gv.grid.GridPanel.prototype.refreshPage=function(){
	var currentPageInput=this.getCurrentPageInput();
	if(Gv.isEmpty(currentPageInput)){
		currentPageInput=this.getCurrentPageNumber();
	}
	this.start=(currentPageInput-1)*this.limit;
	this.refresh();
};
/**
 * 下一页
 */
Gv.grid.GridPanel.prototype.nextPage=function(){
	var currentPageInput=this.getCurrentPageInput();
	if(Gv.isEmpty(currentPageInput)){
		currentPageInput=this.getCurrentPageNumber();
	}
	if(currentPageInput<this.getTotalPageNumber()){
		this.start=currentPageInput*this.limit;
		var s=this.start,
		l=this.limit;
		$.extend(true,this.tmpStore.params,{start:s,limit:l});
		this.load({
			params:this.tmpStore.params
		});
	}
};
/**
 * 上一页
 */
Gv.grid.GridPanel.prototype.previousPage=function(){
	var currentPageInput=this.getCurrentPageInput();
	if(Gv.isEmpty(currentPageInput)){
		currentPageInput=this.getCurrentPageNumber();
	}
	if(currentPageInput>1){
		this.start=(currentPageInput-2)*this.limit;
		var s=this.start,
		l=this.limit;
		$.extend(true,this.tmpStore.params,{start:s,limit:l});
		this.load({
			params:this.tmpStore.params
		});
	}
};
/**
 * 第一页
 */
Gv.grid.GridPanel.prototype.firstPage=function(){
	this.start=0;
	$.extend(true,this.tmpStore.params,{start:this.start,limit:this.limit});
	this.load({
		params:this.tmpStore.params
	})
};
/**
 * 末页
 */
Gv.grid.GridPanel.prototype.lastPage=function(){
	var t=this.getTotalPageNumber();
	this.start=(t-1)*this.limit;
	$.extend(true,this.tmpStore.params,{start:this.start,limit:this.limit});
	this.load({
		params:this.tmpStore.params
	})
};
/**
 * 得到总页数
 */
Gv.grid.GridPanel.prototype.getTotalPageNumber=function(){
	var num=Math.ceil(this.total/this.limit);
	num=parseInt(num+'');
	num=isNaN(num)?1:num;
	return num===0?1:num;
};
//得到当前输入框中的数字
Gv.grid.GridPanel.prototype.getCurrentPageInput=function(){
	var v=this.currentPageInput.val();
	return Gv.isEmpty(v)?'':parseInt(v);
};
/**
 * 得到当前页数(从1开始)
 */
Gv.grid.GridPanel.prototype.getCurrentPageNumber=function(){
	var t=Math.ceil(this.start/this.limit);
	t=parseInt(t+'');
	t=isNaN(t)?1:t;
	return t===0?1:t+1;
};
/**显示当前页数*/
Gv.grid.GridPanel.prototype.showCurrentPageNum=function(obj){
	var v=$(obj).val();
	if(Gv.isEmpty(v)){
		$(obj).val('');
	}else{
		v=this.currentPageNumValidate($(obj).val())?$(obj).val():this.getCurrentPageNumber();
		//this.setCurrentPageInputStyle(v);
		v=v<=0?1:v;
		$(obj).val(v);
	}
};
/**
 * 当前页数验证
 */
Gv.grid.GridPanel.prototype.currentPageNumValidate=function(v){
	var reg=/^[\d]+$/,
	pageSize=this.getTotalPageNumber();
	return reg.test(v)&&v<=pageSize&&v>=1;
};
/**
 * 表格刷新
 */
Gv.grid.GridPanel.prototype.refresh=function(){
	$.extend(true,this.tmpStore.params,{start:this.start,limit:this.limit});
	this.load({
		params:this.tmpStore.params
	});
};
/**
 * 字段排序
 */
Gv.grid.GridPanel.prototype.fieldSort=function(sort,orderBy){
	this.load({
        params: {
            sort: sort,
            orderBy: orderBy,
            start: this.start,
            limit: this.limit
        }
    });
};
Gv.grid.GridPanel.prototype.getId=function(){
   return this.cfg.id;
};
Gv.grid.GridPanel.prototype.setWidth=function(w){
	var self=this;
	this.cfg.width=w;
	this.table.width(w);
	this.header.width(w);
	this.realTableOffSetWidth=Gv.get(this.cfg.renderTo).width()||Gv.get(this.cfg.renderTo)[0].offsetWidth;
	this.header.find('th').each(function(i){
		self.setCellWidth($(this))
	});
	this.header.find('table').width(w);
	this.body.width(w);
	this.body.find('table').width(w);
	this.body.find('td').each(function(){
		self.setCellWidth($(this))
	});
	this.page.width(w);
};
Gv.grid.GridPanel.prototype.setCellWidth=function(cellParent){
   	    var cssText=cellParent[0].style.cssText;
		var arr=cssText.split(';');
		var width='',maxW;
		for(var i=0,num=arr.length;i<num;i++){
			  if(arr[i].indexOf('width')>-1){
				width=arr[i]
			  	break;
			  }
	   }
	   width=width.split(':')[1];
	   if(typeof width=='string'&&width.indexOf('%')>-1){
	     	maxW=(parseFloat(width||100)/100)*(self.realTableOffSetWidth)-2;
	     }else{
	     	maxW=parseFloat(width||100);
	   }
	 cellParent.children('div').css('maxWidth',maxW-14)
}
Gv.grid.GridPanel.prototype.setHeight=function(h){
	this.cfg.height=h;
	this.table.height(h);
	var bodyH=h-38-2;
	if(this.cfg.isPageBar){
		bodyH-=38;
	}
	this.body.height(bodyH);
	this.table.children('.page-table-body').mCustomScrollbar("update");
	//this.body.find('table').height(bodyH);
};
Gv.grid.GridPanel.prototype.isForceFit=function(){
	return this.cfg.viewConfig.forceFit;
};
Gv.grid.GridPanel.prototype.loadMaskHtml=function(){
  var h='<div style="margin:100px auto;width:190px;background:#000; padding:10px;color:#fff;">'+
    '<img src="'+Gv.hostPath+'/images/loading.gif" style="margin-right:10px;">'+this.cfg.waitText+'</div>';
  return $('<div id="'+this.cfg.id+'-mask" />').html(h).css({
		width:'100%',
		height:'100%',
		position:'absolute',
		top:0,
		left:0,
		background:'#fff',
		display:'none',
		opacity:0.8
  });
};
/**
 * @param b boolean true show | false close
 */
Gv.grid.GridPanel.prototype.isLoadMask=function(b){
	//Gv.get(this.cfg.id+'-mask').show()
	b?Gv.get(this.cfg.id+'-mask').show():Gv.get(this.cfg.id+'-mask').hide();
};
/*
 var gridcfg = {
    id: 'test-grid',
    renderTo: 'test-grid',
    //页面元素Id（必须有）
    columns: [{ //表格列
        header: 'ID',
        //显示名称
        dataIndex: 'id',
        sortable:false,//不对改字段排序，默认是true
        tips:true,
        //id
        width: 100 //可以不写，默认是自动
    },
    {
        header: 'CreateTime',
        dataIndex: 'createTime',
        render:change//自定义方法，返回String
    },
    {
        dataIndex: 'modifyTime',
        hidden: true //列隐藏
    },
    {
        xtype:'actioncolumn'
        header: 'Opt',
        items: [{
                icon: 'icon-pencil',
                // Use a URL in the icon config
                tips: 'Modify',
                handler: function (grid, rowIndex, record) {
                    alert("rowIndex " + rowIndex + ' record ' + record)
                }
            },
            {
                icon: 'icon-remove',
                // Use a URL in the icon config
                tips: 'remove',
                handler: function (grid, rowIndex, record) {
                    alert("rowIndex " + rowIndex + ' record ' + record)
                }
            }]
    }],
    store: {
        url: 'index.php?r=user/shareReceive/query',
        //后台请求路径
        baseParams: { //调用load时不会自动清空
        },
        params: { //调用load时会自动清空
            limit: 50,
            //每页显示条数
            start: 0 //开始的行数
        }
    },
    //是否显示CheckBox（默认false）
    isCheckBox: true,
    //是否显示分页条（默认true）
    isPageBar: true,
    //自动加载（默认True）
    autoLoad: true,
    //没有数据时显示文字
    emptyText: '',
    //加载数据时显示文字
    waitText: ''

};
new Gv.grid.GridPanel(gridcfg );



 */
//数据格式
/*
 {
  total:400,
 data:[
 {id:'123',icon:'myfolder32',filename:'123'},
 {id:'1232',icon:'file32',filename:'123'},

 ]
 }
 */
/**
 * 继承了 GridPanel
 * 行展开表格RowExpandPanel
 * @param cfg{}
 * @param cfg{} expandFun  function(recorde) 但行记录 在此方法中组织显示展开
 *              return string
 */


Gv.grid.RowExpandPanel=function(opt){
    var defualt={
    		expand:[],
    		expandFun:null,
    		rowDbClick:function(){}
    };
    defualt.id='rowExpandPanel-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,defualt,opt);
	Gv.grid.GridPanel.call(this,defualt);
};
Gv.extend(Gv.grid.RowExpandPanel,Gv.grid.GridPanel);

/*创建列头HTML*/
Gv.grid.RowExpandPanel.prototype.headerHtml = function () {
    var self = this,
        header = $('<div class="page-table-head">'),
        thead, tr,tmpDiv,tmpTh,expendTd;
	this.showColumnNum=0;
    if (!Gv.isEmpty(this.cfg.columns)) {
        thead = $('<thead />');
        tr = $('<tr />');
        if (this.cfg.isCheckBox) {
        	tmpTh=$('<th />').css({
        		width:30,
        		//height:'100%',
        		textAlign:'center'
        	}).append('<input type="checkbox"  id="all">').wrap("<th />");
            tr.html(tmpTh);
            this.showColumnNum++;
        }
        expendTd=$('<th />').css({
        		width:30,
        		//height:'100%',
        		textAlign:'center'
        	}).append(' ').wrap("<th />");
            tr.append(expendTd);
        this.showColumnNum++;
        for (var i = 0; i < this.cfg.columns.length; i++) {
            var col = this.cfg.columns[i],f=false;
            if(col.hidden===true){
            	continue;
            }
            /*
            for(var m=0;m<this.cfg.expand.length;m++){
                var e=this.cfg.expand[m];
                if(col.dataIndex==e){
                	  f=true;
                      break;
                }
            }
            if(f){//如果是可展开的dataIndex就跳过
            	continue;
            }*/
            this.showColumnNum++;

            tmpDiv=$('<div />').css({
        		textAlign:col.headerAlign?col.headerAlign:'center'
        	}).append(col.header);
            var th = $('<th />').append(tmpDiv).css({
                width:col.width?col.width:100
            });
            if(col.headerTips==null||col.headerTips==undefined||col.headerTips==true){
            	tmpDiv.attr('title',col.header)
            }
            if(col.sortable!==false){
            	tmpDiv.append('<i class="icon-caret-down" style="display:none;"></i>');
            	th.css({
                    cursor: 'pointer'
                }).bind('click',function () {
                    self.headerClick($(this));
                }).bind('mouseenter',function(){
                	$(this).find('i').fadeIn(200);
                }).bind('mouseleave',function(){
                	$(this).find('i').fadeOut(200);
                }).attr({
                    id: col.dataIndex,
                    sort: 'DESC'
                });
            }

            /*tmpDiv=$('<div />').css({
        		textAlign:col.textAlign?col.textAlign:'center'
        	}).append(col.header).append('<i class="icon-caret-down" style="display:none;"></i>');
            var th = $('<th />').append(tmpDiv).css({
                cursor: 'pointer',
                width:col.width?col.width:100
            }).bind('click',function () {
                self.headerClick($(this));
            }).bind('mouseenter',function(){
            	$(this).find('i').fadeIn(200);
            }).bind('mouseleave',function(){
            	$(this).find('i').fadeOut(200);
            }).attr({
                id: col.dataIndex,
                sort: 'DESC'
            });*/
            tr.append(th)
        };
        tr.append('<th></th>');
        this.showColumnNum++;
        thead.append(tr);
    }
    $('<table />').append(thead).appendTo(header);
    return header;
};
/*设置列内容DIv宽*/
Gv.grid.RowExpandPanel.prototype.setColumnContentWidth=function(){
   var gridW=Gv.get(this.cfg.renderTo).width()||Gv.get(this.cfg.renderTo)[0].offsetWidth;
   var colWidthArr=[];
   this.realTableOffSetWidth=gridW;
   if (!Gv.isEmpty(this.cfg.columns)) {
	   for (var i = 0; i < this.cfg.columns.length; i++) {
           var col = this.cfg.columns[i];
           if(col.hidden===true){
           	continue;
           }
		   var maxW=0;
	       if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
	       	maxW=(parseFloat(col.width||100)/100)*(this.realTableOffSetWidth)-2;
	       }else{
	       	maxW=parseFloat(col.width||100);
	       }
	       colWidthArr.push(maxW-14);
	   }
   }
   //增加一个占位（因为有个行展开按钮）
   colWidthArr.unshift(30);
   this.header.find('tr').each(function(){
	   var tr=$(this);
	   tr.find('th').each(function(index,el){
		   var tdW= colWidthArr[index];
		   $(el).css({  maxWidth:tdW+14 })
		   $(el).children('div').css({
			   maxWidth:tdW
		   })
	   })
   })
   this.body.find('tr').each(function(){
	   var tr=$(this);
	   tr.find('td').each(function(index,el){
		   var tdW= colWidthArr[index];
		   $(el).css({ maxWidth:tdW+14 })
		   $(el).children('div').css({
			   maxWidth:tdW
		   })
	   })
   })
};
/*创建tbody HTML*/
Gv.grid.RowExpandPanel.prototype.tbodyHtml = function (d) {
    var self = this,tmpDiv,tmpTh;
    this.body.find('tbody').html('').before(this.copyHeaderHtml());
    if (!Gv.isEmpty(this.cfg.columns) && !Gv.isEmpty(d)) {
        for (var x = 0; x < d.length; x++) {
            var rec = d[x],
                tr = $('<tr rowindex="'+x+'" />'),ex='';
            this.rowHtml(x,rec,tr),
            //添加扩展部分
            ex=this.expanderHtml(x+'_expand',rec);
            this.body.find('tbody').append(tr).append(ex);
        }

    }else{
    	var empty='<div style="padding:10px;text-align:center;">'+this.cfg.emptyText+'</div>';
    	this.body.find('tbody').html(empty);
    }
};
Gv.grid.RowExpandPanel.prototype.rowHtml=function(index,rec,tr){
	var tmptd='';
	if (this.cfg.isCheckBox) {
    	tmptd=$('<td />').css({
    		width:30,
    		//height:'100%',
    		textAlign:'center'
    	}).append('<input type="checkbox"  id="' + index + '">').wrap("<th />");
        tr.html(tmptd);
    }
	//展开关闭开关
	var cls=this.cfg.autoExpand?'icon-minus-sign':'icon-plus-sign',
	    self=this,
	    expendTd,
	    expendBtn=$('<i class="'+cls+'" style="margin-right:8px;font-size:16px; cursor: pointer;" />').bind('click',function(){
		   self.expandHandler(this);
		   return false;
	    });
	expendTd=$('<td />').css({
		width:30,
		textAlign:'center'
	}).append(expendBtn);
    tr.append(expendTd);

    for (var i = 0; i < this.cfg.columns.length; i++) {
        var col = this.cfg.columns[i],f,
            td = $('<td />');
        if(col.hidden===true){
        	continue;
        }
        /*
        for(var m=0;m<this.cfg.expand.length;m++){
            var e=this.cfg.expand[m];
            if(col.dataIndex==e){
            	  f=true;
                  break;
            }
        }
        if(f){//如果是可展开的dataIndex就跳过
        	continue;
        }*/
        var maxW=0;
        if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
        	maxW=(parseFloat(col.width||100)/100)*Gv.frameTabPanel.getTabInnerWidth()-2;
        }else{
        	maxW=parseFloat(col.width||100);
        }
        tmpDiv=$('<div />').css({
        	maxWidth:maxW-14,
        	width:'auto !important',
        	display:'block',
        	overflow: 'hidden',
        	textOverflow: 'ellipsis',
        	whiteSpace: 'nowrap',
    		textAlign:col.textAlign?col.textAlign:'center'
    	});
        if (col.xtype == 'actioncolumn') {
            for (var m = 0; m < col.items.length; m++) {
                var aTag = $('<a  href="#" />'),
                    iTag = $('<i />').addClass(col.items[m].icon).appendTo(aTag);
                if (col.items[m].tips) {
                    aTag.attr('title', col.items[m].tips)
                }
                this.bindActionColumnHandler(aTag, col.items[m].handler, this, index, rec);
                tmpDiv.append(aTag);
            }
            td.append(tmpDiv).width(col.width?col.width:100);
            tr.append(td);
            continue;
        }
        var dataIndex = col.dataIndex,
	        fieldText=rec[dataIndex];
        if(col.tips){
        	var tempFieldText=fieldText;
        	if($.isFunction(col.toolTip)){
        		tempFieldText=col.toolTip(fieldText);
        	}
        	tmpDiv.attr('title',tempFieldText);
        }
	    if($.isFunction(col.render)){
	    	fieldText=col.render(fieldText);
	    	tmpDiv.html(fieldText);
	    }else{
	    	tmpDiv.text(fieldText);
	    }
        td.append(tmpDiv).width(col.width?col.width:100);
        tr.append(td);
    };
    //行单击(默认都绑定行点击事件)
    this.bindRowClick(tr, this.cfg.rowClick, this, index, rec);
    //if($.isFunction(this.cfg.rowClick)){
   // }
    //行双击
    if($.isFunction(this.cfg.rowDbClick)){
    	this.bindRowDbClick(tr, this.cfg.rowDbClick, this, index, rec);
    }
    tr.append('<td />').data('data', rec);
};
/**
 * 扩展行
 */

Gv.grid.RowExpandPanel.prototype.expanderHtml=function(index,rec){
	 var  tr=$('<tr rowindex="'+index+'" />'),
           con=$('<td colspan="'+this.showColumnNum+'" />').css({padding:'10px 5px ',display:'none'}),
           h;
     /*
	 for(var itm in rec){
    	  var f=true,
    	  	  e;
    	  for(var m=0;m<this.cfg.expand.length;m++){
              e=this.cfg.expand[m];
              if(itm!=e){
            	  f=true;
              }else{
            	  f=false;
            	  break;
              }
          }
    	  if(f){
    		  delete rec[itm];
    	  }


      }*/
      h=this.cfg.expandFun(rec);
      con.html('<div style="text-indent:30px;padding:5px;white-space:normal;">'+h+'</div>').appendTo(tr);
      return tr;
};
/*行双击*/
Gv.grid.RowExpandPanel.prototype.bindRowDbClick=function(tag, handler, grid,rowIndex,record){
	tag.unbind('dblclick').bind('dblclick', {
        grid: grid,
        rowIndex: rowIndex,
        data: record
    }, function (event) {
    	//grid.expandHandler(grid,rowIndex,record);

    })

};
Gv.grid.RowExpandPanel.prototype.expandHandler=function(obj){
	/*
	var expand=grid.table.find('tr[rowindex="'+rowIndex+'_expand"]'),f=false;
	if(expand[0]){
		f=expand.children('td').is(":visible");
	}
	if(!f){//隐藏状态
		$(this).addClass('actived');
		expand.addClass('expand-actived');
		expand.children('td').stop().slideDown(300);
	}else{
		$(this).removeClass('actived');
		expand.removeClass('expand-actived');
		expand.children('td').stop().slideUp(300);
	}*/

	 var groupId=$(obj).parent().parent().attr('rowindex');
	 if($(obj).attr('class')=='icon-plus-sign'){
		 $(obj).removeClass('icon-plus-sign').addClass('icon-minus-sign');
		 this.body.find('tr[rowindex^="'+groupId+'_"]>td').stop().slideDown(500);
	 }else{
		 $(obj).removeClass('icon-minus-sign').addClass('icon-plus-sign')
   	     this.body.find('tr[rowindex^="'+groupId+'_"]>td').stop().slideUp(500);
	 }
};
Gv.register('rowexpandpanel',Gv.grid.RowExpandPanel);


/**
 * 继承了 GridPanel
 * 行展开表格FileList
 * @param cfg{}
 */

Gv.grid.FileList=function(opt){
	var defualt={
			isPageBar:false,
			cls:'page-nobordered-table'
	};
	 defualt.id='fileList-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,defualt,opt);
	Gv.grid.GridPanel.call(this,defualt);
};
Gv.extend(Gv.grid.FileList,Gv.grid.GridPanel);

/**行单击*/
Gv.grid.FileList.prototype.rowClick=function(tag,handler,grid,rowIndex,recorder){
	tag.unbind('click').bind('click', {
        grid: grid,
        rowIndex: rowIndex,
        data: recorder
    }, function (event) {
        handler(event.data.grid, event.data.rowIndex, event.data.data,event)
    })
};
/**行双击*/
Gv.grid.FileList.prototype.rowDbClick=function(tag,handler,grid,rowIndex,recorder){
	tag.unbind('dblclick').bind('dblclick', {
        grid: grid,
        rowIndex: rowIndex,
        data: recorder
    }, function (event) {
        handler(event.data.grid, event.data.rowIndex, event.data.data,event)
    })
};
/**右击*/
Gv.grid.FileList.prototype.rowContextmenu=function(tag,handler,grid,rowIndex,recorder){
	tag.unbind('contextmenu').bind('contextmenu', {
		grid: grid,
		rowIndex: rowIndex,
		data: recorder
	}, function (event) {
		handler(event.data.grid, event.data.rowIndex, event.data.data,event)
	})
};




/**
 * 继承了 GridPanel
 * GroupGrid
 * @param cfg{}
 */
Gv.grid.GroupGrid=function(opt){
	var defualt={
			groupField:'',//分组的field
			autoExpand:true,//是否全部展开
			groupFieldRender:null//参数name,num

	};
	 defualt.id='groupGrid-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,defualt,opt);
	Gv.grid.GridPanel.call(this,defualt);

};

Gv.extend(Gv.grid.GroupGrid,Gv.grid.GridPanel);
/*创建列头HTML*/
Gv.grid.GroupGrid.prototype.headerHtml = function () {
    var self = this,
        header = $('<div class="page-table-head">'),
        thead, tr,tmpDiv,tmpTh;
	this.showColumnNum=0;
    if (!Gv.isEmpty(this.cfg.columns)) {
        thead = $('<thead />');
        tr = $('<tr />');
        if (this.cfg.isCheckBox) {
        	tmpTh=$('<th />').css({
        		width:30,
        		//height:'100%',
        		textAlign:'center'
        	}).append('<input type="checkbox"  id="all">').wrap("<th />");
            tr.html(tmpTh);
            this.showColumnNum++;
        }
        for (var i = 0; i < this.cfg.columns.length; i++) {
            var col = this.cfg.columns[i],f=false;
            if(col.hidden===true){
            	continue;
            }
            if(col.dataIndex==this.cfg.groupField){////如果是组Field的dataIndex就跳过
          	  continue;
            }
            this.showColumnNum++;
            var maxW=0;
            if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
            	maxW=(parseFloat(col.width||100)/100)*Gv.frameTabPanel.getTabInnerWidth()-2;
            }else{
            	maxW=parseFloat(col.width||100);
            }
            tmpDiv=$('<div />').css({
        		textAlign:col.headerAlign?col.headerAlign:'center'
        	}).append(col.header);
            var th = $('<th />').append(tmpDiv).css({
                width:col.width?col.width:100,
                maxW:maxW-14
            });
            if(col.headerTips==null||col.headerTips==undefined||col.headerTips==true){
            	tmpDiv.attr('title',col.header)
            }
            if(col.sortable!==false){
            	tmpDiv.append('<i class="icon-caret-down" style="display:none;"></i>');
            	th.css({
                    cursor: 'pointer'
                }).bind('click',function () {
                    self.headerClick($(this));
                }).bind('mouseenter',function(){
                	$(this).find('i').fadeIn(200);
                }).bind('mouseleave',function(){
                	$(this).find('i').fadeOut(200);
                }).attr({
                    id: col.dataIndex,
                    sort: 'DESC'
                });
            }
            tr.append(th)
        };
        tr.append('<th></th>');
        this.showColumnNum++;
        thead.append(tr);
    }
    $('<table />').append(thead).appendTo(header);
    return header;
};
/*设置列内容DIv宽*/
Gv.grid.GroupGrid.prototype.setColumnContentWidth=function(){
   var gridW=Gv.get(this.cfg.renderTo).width()||Gv.get(this.cfg.renderTo)[0].offsetWidth;
   var colWidthArr=[];
   this.realTableOffSetWidth=gridW;
   if (!Gv.isEmpty(this.cfg.columns)) {
	   for (var i = 0; i < this.cfg.columns.length; i++) {
           var col = this.cfg.columns[i];
           if(col.hidden===true){
           	continue;
           }
		   var maxW=0;
	       if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
	       	maxW=(parseFloat(col.width||100)/100)*(this.realTableOffSetWidth)-2;
	       }else{
	       	maxW=parseFloat(col.width||100);
	       }
	       colWidthArr.push(maxW-14);
	   }
   }
   //如果有checkbox 就增加一个占位
	if (this.cfg.isCheckBox) {
		 colWidthArr.unshift(30);
    }
   //增加一个占位（因为有个行展开按钮）
   colWidthArr.unshift(30);
   this.header.find('tr').each(function(){
	   var tr=$(this);
	   tr.find('th').each(function(index,el){
		   var tdW= colWidthArr[index];
		   $(el).css({  maxWidth:tdW+14 })
		   $(el).children('div').css({
			   maxWidth:tdW
		   })
	   })
   })
   this.body.find('tr').each(function(){
	   var tr=$(this);
	   tr.find('td').each(function(index,el){
		   var tdW= colWidthArr[index];
		   $(el).css({ maxWidth:tdW+14 })
		   $(el).children('div').css({
			   maxWidth:tdW
		   })
	   })
   })
};
/*创建tbody HTML*/
Gv.grid.GroupGrid.prototype.tbodyHtml = function (d) {
    var self = this,tmpDiv,tmpTh,n=0;x=0
    this.body.find('tbody').html('').before(this.copyHeaderHtml());
    for(var k in d){
       n++;
    }
    if (n!==0) {
        for (var gname in d) {
             var data = d[gname],tr,rec;
             ++x;
            //组名行
            ex=this.expanderHtml(x,gname,data.length),
            dis=this.cfg.autoExpand?'table-row':'none';
            //可扩展部分
          //  exContentTr=$('<tr  id="'+x+'-group-content"  style="display:none;"  />');
           // exContentTd=$('<td colspan="'+this.showColumnNum+'" />').appendTo(exContentTr);
            this.body.find('tbody').append(ex);

            for(var m=0;m<data.length;m++){
            	tr = $('<tr rowIndex="'+x+'-'+m+'" />').css({display:dis});
            	rec=data[m];
            	this.rowHtml(x+'-'+m,rec,tr);
            	this.body.find('tbody').append(tr);
            }
          //  this.body.find('tbody').append(exContentTr);

        }

    }else{
    	var empty='<div style="padding:10px;text-align:center;">'+this.cfg.emptyText+'</div>';
    	this.body.find('tbody').html(empty);
    }
};
Gv.grid.GroupGrid.prototype.rowHtml=function(index,rec,tr){
	var tmptd='';
	if (this.cfg.isCheckBox) {
    	tmptd=$('<td />').css({
    		width:30,
    		//height:'100%',
    		textAlign:'center'
    	}).append('<input type="checkbox"  id="' + index + '">').wrap("<th />");
        tr.html(tmptd);
    }
    for (var i = 0; i < this.cfg.columns.length; i++) {
        var col = this.cfg.columns[i],f,
            td = $('<td />');
        if(col.hidden===true){
        	continue;
        }
        if(col.dataIndex==this.cfg.groupField){////如果是组Field的dataIndex就跳过
        	  continue;
        }
        var maxW=0;
        if(typeof col.width=='string'&&col.width.indexOf('%')>-1){
        	maxW=(parseFloat(col.width||100)/100)*Gv.frameTabPanel.getTabInnerWidth()-2;
        }else{
        	maxW=parseFloat(col.width||100);
        }
        tmpDiv=$('<div />').css({
        	maxWidth:maxW-14,
        	width:'auto !important',
        	display:'block',
        	overflow: 'hidden',
        	textOverflow: 'ellipsis',
        	whiteSpace: 'nowrap',
    		textAlign:col.textAlign?col.textAlign:'center'
    	});
        if (col.xtype == 'actioncolumn') {
            for (var m = 0; m < col.items.length; m++) {
                var aTag = $('<a  href="#" />'),
                    iTag = $('<i />').addClass(col.items[m].icon).appendTo(aTag);
                if (col.items[m].tips) {
                    aTag.attr('title', col.items[m].tips)
                }
                this.bindActionColumnHandler(aTag, col.items[m].handler, this, index, rec);
                tmpDiv.append(aTag);
            }
            td.append(tmpDiv).width(col.width?col.width:100);
            tr.append(td);
            continue;
        }
        var dataIndex = col.dataIndex,
	        fieldText=rec[dataIndex];
        if(col.tips){
        	var tempFieldText=fieldText;
        	if($.isFunction(col.toolTip)){
        		tempFieldText=col.toolTip(fieldText);
        	}
        	tmpDiv.attr('title',tempFieldText);
        }
	    if($.isFunction(col.render)){
	    	fieldText=col.render(fieldText);
	    	tmpDiv.html(fieldText);
	    }else{
	    	tmpDiv.text(fieldText);
	    }
        td.append(tmpDiv).width(col.width?col.width:100);
        tr.append(td);
    };
    tr.append('<td />').data('data', rec);
};

/**
 * 扩展行
 */

Gv.grid.GroupGrid.prototype.expanderHtml=function(index,name,num){
	 var  self=this,tr=$('<tr rowIndex="'+index+'" />'),//-group
          con=$('<td colspan="'+this.showColumnNum+'" />').css({padding:' 5px 40px 5px 10px',
        	  borderBottom:'2px solid #3483AA',
        	  fontWeight:'bold',
        	  color:'#0A7CC9'
          	  }),
          h=this.cfg.groupFieldRender(name,num),
          cls=this.cfg.autoExpand?'icon-minus-sign':'icon-plus-sign';
          expendBtn=$('<i class="'+cls+'" style="margin-right:8px;font-size:16px; cursor: pointer;" />').bind('click',function(){
        	  self.expandHandler(this);
          });
      con.append(expendBtn).append(h).appendTo(tr);
      return tr;
};
/**
 * @param b boolean true show|false hidden
 */
Gv.grid.GroupGrid.prototype.expandHandler=function(obj){
	 var groupId=$(obj).parent().parent().attr('rowindex');
	 if($(obj).attr('class')=='icon-plus-sign'){
		 $(obj).removeClass('icon-plus-sign').addClass('icon-minus-sign');
		 this.body.find('tr[rowindex^="'+groupId+'-"]').stop().slideDown(500);
	 }else{
		 $(obj).removeClass('icon-minus-sign').addClass('icon-plus-sign')
    	 this.body.find('tr[rowindex^="'+groupId+'-"]').stop().slideUp(500);
	 }
};

/**
 * 创建GroupData 分组数据
 */
Gv.grid.GroupGrid.prototype.createGroupData=function(data){
    var n=data.length,
        groupData={};
	for(var i=0;i<n;i++){
        var rec=data[i],
            f=true;
        for(var k in groupData){
            if(k==rec[this.cfg.groupField]){
               groupData[k].push(rec);
               f=false;
               break;
            }
        }
        if(f){
        	var gname=rec[this.cfg.groupField];
        	groupData[gname]=[];
        	groupData[gname].push(rec);
        }
  }
	return groupData;
};
/*加载数据*/
Gv.grid.GroupGrid.prototype.load = function (cfg) {
	var self = this;
	if(this.cfg.isLoadMask){
		this.isLoadMask(true);
	}
    if ($.isFunction(self.cfg.listeners.beforeLoad)) {
        self.cfg.listeners.beforeLoad();
    }
    this.tmpStore= {
        url: this.cfg.store.url,
        params: {}
    };
    $.extend(true, this.tmpStore, cfg);
    $.extend(true, this.baseParams, cfg.baseParams);
    $.extend(true, this.tmpStore.params, this.baseParams);
    this.limit=this.tmpStore.params.limit;
    this.start=this.tmpStore.params.start;
    Gv.ajax({
        url: this.tmpStore.url,
        data: this.tmpStore.params,
        successFun:function(json) {
        	if(self.cfg.isLoadMask){
        		self.isLoadMask(false);
        	}
        	self.total=json.total;
        	var data=self.createGroupData(json.data);
        	self.display(data);
            if ($.isFunction(self.cfg.listeners.afterLoad)) {
                self.cfg.listeners.afterLoad(json);
            }
            if(self.cfg.isPageBar){
            	self.pageHtml();
            }
        }
    });
};
/**
 * 继承了 GridPanel
 * ArrayGrid
 * @param cfg{}
 */
Gv.grid.ArrayGrid=function(opt){
	var defualt={
			cls:'page-bordered-table',
			isPageBar:false
	};
	defualt.id='arrayGrid-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,defualt,opt);
	Gv.grid.GridPanel.call(this,defualt);

};
Gv.extend(Gv.grid.ArrayGrid,Gv.grid.GridPanel);


