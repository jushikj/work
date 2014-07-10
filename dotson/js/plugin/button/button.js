/**
 *普通Button
 *opts{}  id: string
 *opts{}  renderTo: string
 *opts{}  cls: String 样式
 *opts{}  iconCls: String 图标
 *opts{}  text: String
  *opts{}  title: String 提示
 *opts{}  listeners: {}
 *opts{}  handler fun
*/
Gv.Button=function(opts){
     this.cfg={
    		 renderTo:'',
    		 text:'',
    		 cls:'button',
    		 iconCls:'',
    		 listeners:null,
    		 handler:null
     };
     this.cfg.id='button-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
     $.extend(true,this.cfg,opts);
     var self=this,
     btn=Gv.get(this.cfg.renderTo);
     btn.addClass(this.cfg.cls).unbind().bind('click',function(){
    	 this.blur();
    	 self.bindClick($(this));
     });
     if(this.cfg.title){
     	btn.attr('title',this.cfg.title);
     }
     if(this.cfg.iconCls){
         var i=$('<i /></i>').addClass(this.cfg.iconCls);
         btn.append(i);
     }
     btn.append(this.cfg.text);
}
Gv.Button.prototype.bindClick=function(thiz){
     if($.isFunction(this.cfg.handler)){
    	 this.cfg.handler(thiz);
     }
}
/**
 *DropDown Button
 *opts{}  id: string
 *opts{}  renderTo: string
 *opts{}  cls: String 样式
 *opts{}  data Array 静态数组[{id:'id',text:'text'}]
 *opts{}  url String 动态数据
 *opts{}  text: String
  *opts{}  title: String 提示
  *opts{}  selectHandler: function(id,text)
 *opts{}  listeners: {}

*/
Gv.DropDownButton=function(opts){
     this.cfg={
     	     id:'',
    		 renderTo:'',
    		 text:'',
    		 cls:'dropdown-button',
    		 iconCls:'',
    		 url:'',
    		 params:{},
    		 listeners:null,
    		 handler:null
     };
     this.cfg.id ='dropdowmbutton'+Gv.timeStamp()+'-'+Gv.randomStr(5);
     $.extend(true,this.cfg,opts);

    if(this.cfg.renderTo){
    	this.build();
        Gv.get(this.cfg.renderTo).append( this.mainHtml);
    }
    if(!Gv.isEmpty(this.cfg.data)){
		this.createSelect(this.cfg.data);
	}
	if(this.cfg.autoLoad){
		this.load(this.cfg)
	}
};

Gv.DropDownButton.prototype.build=function(d){
	 this.mainHtml().append(this.btnHtml()).append(this.selectHtml())
    return this.mainHtml;
};
/**Main HTML*/
Gv.DropDownButton.prototype.mainHtml=function(){
	 this.mainHtml=$('<span id="'+this.cfg.id+'-main"  />').addClass(this.cfg.cls).css({position:'relative'});
    return  this.mainHtml;
};
/**a 标签HTML*/
Gv.DropDownButton.prototype.btnHtml=function(){
	 var span=$('<span  id="'+this.cfg.id+'-text"  />').text(this.cfg.text);
     this.btn=$('<a  id="'+this.cfg.id+'-btn"  />');
     this.bindDropDown( this.btn);
    this.icon=$('<i class="icon-caret-down"></i>');
    this.btn.append(span).append(this.icon);
    return  this.btn;
};
//绑定DropDown事件
Gv.DropDownButton.prototype.bindDropDown=function(tar){
	var self=this;
	tar.bind('click',function(){
    	      self.btnClick();
    	     return false;
     });
};
/**获得下拉的HTML*/
Gv.DropDownButton.prototype.selectHtml=function(){
	var self=this,h=this.btn[0].offsetHeight,
	top=Gv.isIE()?22:24;
	this.ulId=this.cfg.id?this.cfg.id+'-ul':this.cfg.id+'-ul';
	this.selectU=$('<ul id="'+this.ulId+'"/>').hide().css({top: top});
	return this.selectU;
};
/**创建下拉内容*/
Gv.DropDownButton.prototype.createSelect=function(d){
	this.selectU.html('');
	for(var i=0;i<d.length;i++){
		var a=$('<a  id="'+d[i].id+'"/>').click(function(){
			Gv.log('000')
			self.selectClick(this);
			return false;
		}).text(d[i].text);
		if(d[i].checked===true){
			   this.btn.find('span').text(d[i].text);
		}
		var li=$('<li id="'+d[i].id+'"/>').append(a);
		this.selectU.append(li)
	}
};
/*将下拉的HTML创建到按钮上*/
Gv.DropDownButton.prototype.load=function(cfg){
	var self=this,defualt={
		url:'',
		params:''
		};
  $.extend(true,defualt,cfg);
	 if(defualt.url){
		Gv.ajax({
			url:defualt.url,
			data:defualt.params,
			successFun:function(r){
				self.createSelect(r);
			}
		})
	}
};
/**按钮 click*/
Gv.DropDownButton.prototype.btnClick=function(){
	this.selectU.is(':visible')?this.hideSelect():this.showSelect();

};
/**select click*/
Gv.DropDownButton.prototype.selectClick=function(obj){
	var t=$(obj).text(),i=$(obj).attr('id');
    this.hideSelect();
    this.btn.find('span').text(t);
    //this.btn.text(t).append(this.icon);
    if($.isFunction(this.cfg.selectHandler)){
    	   this.cfg.selectHandler(i,t);
    }
};
Gv.DropDownButton.prototype.showSelect=function(){
	var self=this;
	this.selectU.show();
	Gv.mousedownEvent=function(evt){
		var tag=Gv.eventTarget(evt),isHidenSelect=true;
		Gv.log(tag)
		if($(tag).attr('id')==self.btn.attr('id')){
			Gv.log('==1')
			isHidenSelect=false;
			return false;
		}else if($(tag).attr('id')==self.cfg.id+'-text'){
			Gv.log('==2')
			isHidenSelect=false;
			return false;
		}else if(self.isSelectBtn($(tag).attr('id'))){
			  self.selectClick(tag);

		}
		if(isHidenSelect){
			self.hideSelect();
		}
	}
};
Gv.DropDownButton.prototype.isSelectBtn=function(id){
	var f=false;
	this.selectU.find('a').each(function(){
		if($(this).attr('id')==id){
		    f=true;
		    return false;
		}
	});
	return f;
};
Gv.DropDownButton.prototype.hideSelect=function(){
	this.selectU.hide();
	Gv.mousedownEvent=null;
};

/**
  开关Button
*/
Gv.SwitchButton=function(opt){
    this.cfg={
    		renderTo:'',
    		status:'off',//默认是off
    		onText:'ON',
    		offText:'OFF',
    		handler:null
    }
    this.cfg.id='switchButton-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    this.main=null;
    $.extend(true,this.cfg,opt);
    if(this.cfg.renderTo){
    	Gv.get(this.cfg.renderTo).append(this.build());
    	this.setStatus(this.cfg.status);
    	this.bindClick();
    }
};
Gv.SwitchButton.prototype.build=function(){
	return this.mainHtml();
};
Gv.SwitchButton.prototype.mainHtml=function(){
	this.main=$('<span class="switch-'+this.cfg.status+'">');
	var left=$('<span class="switch-left"></span>').text(this.cfg.onText);
	var space=$('<label  class="switch-space"> </label>');
	var right=$('<span class="switch-right"></span>').text(this.cfg.offText);
	this.main.append(left).append(space).append(right);
	return this.main;
};
/*on/off*/
Gv.SwitchButton.prototype.setStatus=function(status){
	this.main.attr('class','switch'+status);
	status=='on'?this.onStatus(this.main):this.offStatus(this.main)
};
//获得状态
Gv.SwitchButton.prototype.getStatus=function(status){
	var cls=this.main.attr('class');
	return cls.split('-')[1];
};
//on状态
Gv.SwitchButton.prototype.onStatus=function(tar){
   	tar.attr('class','switch-on');
   	tar.children('span.switch-left').animate({width:'50%'},300);
   	tar.children('span.switch-right').animate({width:0},300);
};
//off状态
Gv.SwitchButton.prototype.offStatus=function(tar){
	tar.attr('class','switch-off');
	tar.children('span.switch-left').animate({width:0},300);
	tar.children('span.switch-right').animate({width:'50%'},300);
};
Gv.SwitchButton.prototype.bindClick=function(){
	var self=this;
	this.main.bind('click',function(){
		 Gv.log('click')
		 var tar=$(this);
  	     var cls= tar.attr('class'),
  	     status='on';
  	     if(cls=='switch-on'){
  	     	self.offStatus(tar)
  	     	status='off';
  	     }else{
  	    	self.onStatus(tar)
  	     }
  	     if($.isFunction(self.cfg.handler)){
  	    	self.cfg.handler(status);
  	     }
	});
};
/**
icon switch
*/
Gv.SwitchIcon=function(opt){
this.cfg={
  		renderTo:'',
  		status:'0',//默认是0
  		icons:['icon-th','icon-align-justify'],
  		handler:null
  }
  this.cfg.id='switchIcon-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
  this.main=null;
  $.extend(true,this.cfg,opt);
  if(this.cfg.renderTo){
  	Gv.get(this.cfg.renderTo).append(this.build());
  	this.setStatus(this.cfg.status);
  	this.bindClick();
  }
};
Gv.SwitchIcon.prototype.build=function(){
	return this.mainHtml();
};
Gv.SwitchIcon.prototype.mainHtml=function(){
	this.main=$('<span class="switch-'+(this.cfg.status*1?'off':'on')+'">');
	var left=$('<span class="switch-left"></span>').html('<i class="icon-th"></i>');
	var space=$('<label  class="switch-space"> </label>');
	var right=$('<span class="switch-right"></span>').html('<i class="icon-align-justify"></i>');
	this.main.append(left).append(space).append(right);
	return this.main;
};
/*0/1*/
Gv.SwitchIcon.prototype.setStatus=function(status){
	this.main.attr('class','switch-'+(status*1?'off':'on'));
	status*1?this.offStatus(this.main):this.onStatus(this.main);
};
//获得状态
Gv.SwitchIcon.prototype.getStatus=function(){
	var cls=this.main.attr('class');
	return cls.split('-')[1]=='on'?0:1;
};
//on状态
Gv.SwitchIcon.prototype.onStatus=function(tar){
   	tar.attr('class','switch-on');
   	tar.children('span.switch-left').animate({width:'50%'},300);
   	tar.children('span.switch-right').animate({width:0},300);
};
//off状态
Gv.SwitchIcon.prototype.offStatus=function(tar){
	tar.attr('class','switch-off');
	tar.children('span.switch-left').animate({width:0},300);
	tar.children('span.switch-right').animate({width:'50%'},300);
};
Gv.SwitchIcon.prototype.bindClick=function(){
	var self=this;
	this.main.bind('click',function(){
		 var tar=$(this);
  	     var cls= tar.attr('class'),
  	     status='on';
  	     if(cls=='switch-on'){
  	     	self.offStatus(tar);
  	     	status='off';
  	     }else{
  	     	self.onStatus(tar);
  	     }
  	     if($.isFunction(self.cfg.handler)){
  	    	self.cfg.handler(status=='on'?0:1);
  	     }
	});
};
