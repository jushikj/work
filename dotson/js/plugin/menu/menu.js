
/**
 * buttonMenu
 *opts{}  id: string
 *opts{}  renderTo: string
 *opts{}  cls: String 样式
 *opts{}  iconCls: String 图标
 *opts{}  text: String
 *opts{}  title: String 提示
 *opts{}  listeners: {}
 *opts{}  handler fun 参数 id
 */
Gv.menu.ButtonMenu=function(opt){
    this.cfg={
   		 renderTo:'',
   		 text:'',
   		 cls:'gv-button-menu',
   		 iconCls:'',
   		 url:'',
   		 data:null,
   		 params:null,
   		 listeners:null,
   		 handler:null
    };
    this.cfg.id='buttonMenu-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true,this.cfg,opt);

    if(this.cfg.renderTo){
    	this.build();
    	Gv.get(this.cfg.renderTo).append( this.mainHtml);
    }

};
Gv.menu.ButtonMenu.prototype.build=function(){
	var self=this;
    this.mainHtml().append(this.btnHtml());
    if(Gv.isEmpty(this.cfg.data)){
	    if(this.cfg.autoLoad){
	    	   this.load(this.cfg.params);
	    }
	}else{
		this.subMenuHtml(this.cfg.data);
	}
    return this.mainHtml;
};

Gv.menu.ButtonMenu.prototype.mainHtml=function(){
	 this.mainHtml=$('<span id="'+this.cfg.id+'-main"  />').addClass(this.cfg.cls);
	 var self=this;
	 this.mainHtml.mouseleave(function(){
			self.hideSubMenu();
	 });
	 return  this.mainHtml;
};
/**a 标签HTML*/
Gv.menu.ButtonMenu.prototype.btnHtml=function(){
	// var span=$('<span  id="'+this.cfg.id+'-text"  />').text();
     this.btn=$('<a  id="'+this.cfg.id+'-btn"  href="#" />');
     this.bindBtnClick(this.btn);
     if(this.cfg.title){
    	 this.btn.attr('title',this.cfg.title);
     }
     if(this.cfg.iconCls){
         var i=$('<i /></i>').addClass(this.cfg.iconCls);
         this.btn.append(i);
     }
     this.btn.append(this.cfg.text);
     return  this.btn;
};
Gv.menu.ButtonMenu.prototype.subMenuHtml=function(data){
	var subMen=Gv.get(this.cfg.renderTo).find('ul');
	if(!subMen[0]){
		subMen=$('<ul class="sub-menu" />');
	}
	subMen.html('');
	if(Gv.isEmpty(data)){
		return null;
	}
	for(var i=0;i<data.length;i++){
		var r=data[i],
		    l=$('<li id="'+r.id+'" />'),
		    a=$('<a href="#" />').text(r.text);
		l.append(a);
		this.bindSubMenuClick(l);
		subMen.append(l);
	}
	this.mainHtml.append(subMen);
};
//绑定bindSubMenuClick事件
Gv.menu.ButtonMenu.prototype.bindSubMenuClick=function(tar){
	var self=this;
	tar.bind('click',function(){
    	      if($.isFunction(self.cfg.handler)){
    	    	  self.cfg.handler($(this).attr('id'));
    	      }
    	      return false;
     });
};
Gv.menu.ButtonMenu.prototype.load=function(params){
	var self=this,
	    tempPs=Gv.isEmpty(params)?this.cfg.params:params;
	Gv.ajax({
		url:this.cfg.url,
		data:tempPs,
		successFun:function(r){
			self.subMenuHtml(r);
			if($.isFunction(self.cfg.listeners.afterLoad) ){
				self.cfg.listeners.afterLoad(r);
		    }
		}

	})
};
Gv.menu.ButtonMenu.prototype.bindBtnClick=function(tar){
	var self=this;
	tar.click(function(){
		if(self.mainHtml[0].className.indexOf('active')<0){
			self.showSubMenu();
		}
	})

};
Gv.menu.ButtonMenu.prototype.showSubMenu=function(){
	this.mainHtml.addClass("active").children('ul').stop(false,true).slideDown(300);
};
Gv.menu.ButtonMenu.prototype.hideSubMenu=function(){
	this.mainHtml.removeClass("active").children('ul').stop(false,true).slideUp(300);
};


