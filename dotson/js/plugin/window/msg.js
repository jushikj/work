/**
 *
 *@author LLJ
 *@version 1.0.0
 * cfg
 * cfg{}title
 * cfg{}html string 显示信息
 * cfg{}width int
 * cfg{}height int
 * cfg{}size string
 * cfg{}html string
 *
 */
 //信息提示组件之alert
Gv.msg.alert=function(opt){
	var cfg={
		   id:'',
		   title:Gv.gvI18n('page_tips'),
		   //width:'auto',
		  // height:'auto',
		  // style:'min-width:350px;',
		   bodyStyle:'padding:20px 15px;height:30px;text-align:center;'

    };
   cfg.id='alert-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true,cfg,opt);
    Gv.msg.box(cfg);

};
 //信息提示组件之error
Gv.msg.error=function(opt){
	var cfg={
		   id:'',
		   title:Gv.gvI18n('page_error'),
		   //width:'auto',
		   //height:'auto',
		   //style:'min-width:250px;',
		   // bodyStyle:'padding:20px 15px;height:30px;line-height:30px;'
		   icon:'error'

    };
   cfg.id='error-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true,cfg,opt);
   // cfg.html='<i class="icon-remove-sign" style="width:32px;height:32px;margin:0 20px 0 10px; line-height:32px; color:#B91D47; font-size:32px; display:inline-block; vertical-align:top;"></i>'+ cfg.html;
    Gv.msg.box(cfg);
};
//信息提示组件之warring
Gv.msg.warning=function(opt){
	var cfg={
		   id:'',
		   title:Gv.gvI18n('page_warn'),
		   //width:'auto',
		   //height:'auto',
		   //style:'min-width:250px;',
		   //bodyStyle:'padding:20px 15px;height:30px;line-height:30px;'
		   buttons:'YESCANCEL',
		    icon:'warning'

    };
   cfg.id='warring-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true,cfg,opt);
    //cfg.html='<i class="icon-warning-sign" style="width:32px;height:32px;margin:0 20px 0 10px; line-height:32px; color:#E3A21A; font-size:32px; display:inline-block; vertical-align:top;"></i>'+ cfg.html;
   Gv.msg.box(cfg);
};
//信息提示组件之info
Gv.msg.info=function(opt){
	var cfg={
		   id:'',
		   title:Gv.gvI18n('page_info'),
		   //width:'auto',
		  // height:'auto',
		   //style:'min-width:250px;',
		   //bodyStyle:'padding:20px 15px;height:30px;line-height:30px;'
		    icon:'info'

    };
   cfg.id='info-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true,cfg,opt);
    //cfg.html='<i class="icon-info-sign" style="width:32px;height:32px;margin:0 20px 0 10px; line-height:32px; color:#2B5797; font-size:32px; display:inline-block; vertical-align:top;"></i>'+ cfg.html;
    Gv.msg.box(cfg);
};
//信息提示组件之question
Gv.msg.question=function(opt){
	var cfg={
		   id:'',
		   title:Gv.gvI18n('page_confirm'),
		   //width:'auto',
		   //height:'auto',
		  // style:'min-width:250px;',
		   //handler:null,
		  // bodyStyle:'padding:20px 15px;height:30px;line-height:30px;'
		  buttons:'YESCANCEL',
		  icon:'question'

    };
   cfg.id='question-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true,cfg,opt);
    //cfg.html='<i class="icon-question-sign" style="width:32px;height:32px;margin:0 20px 0 10px; line-height:32px; color:#603CBA; font-size:32px; display:inline-block; vertical-align:top;"></i>'+ cfg.html;
    Gv.msg.box(cfg);
};
//信息提示组件之confirm
Gv.msg.confirm=function(opt){
	var cfg={
		   id:'',
		   title:Gv.gvI18n('page_confirm'),
		   //width:'auto',
		  // height:'auto',
		  // style:'min-width:250px;',
		  // handler:null,
		  // bodyStyle:'padding:20px 15px;height:30px;line-height:30px;'
		   buttons:'YESCANCEL',
		  icon:'ok'

    };
   cfg.id='comfirm-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
    $.extend(true,cfg,opt);
   // cfg.html='<i class="icon-ok-sign" style="width:32px;height:32px;margin:0 20px 0 10px; line-height:32px; color:#00A300; font-size:32px; display:inline-block; vertical-align:top;"></i>'+ cfg.html;
   Gv.msg.box(cfg);
};
//信息提示组件之Box(可自定义Icon)
 // icon: ''//ok,question,info,warning,error
 //  buttons:'YESNOCANCEL',
Gv.msg.box=function(opt){
	var cfg={
		   id:'',
		   title:'',
		   width:'auto',
		   height:'auto',
		   maxHeight: 100,
		   style:'min-width:250px;max-width:400px;',
		   handler:null,
		   bodyStyle:'line-height:30px;',
		   contentWrap:'',
           buttons: '',//'YESNOCANCEL'
           html:'',
           icon: ''//ok,question,info,warning,error

    };
    var a=null;
   cfg.id='msgbox-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
   cfg.contentWrap=cfg.bodyStyle;
   cfg.bodyStyle='padding:10px 20px 10px 0';
    $.extend(true,cfg,opt);

    //变换Icon
    function changeIcon(icon){
    	var i='',color='';
    	if(icon=='error'){
    		i='icon-remove-sign';
    		color='#B91D47';
    	}else if(icon=='warning'){
    	   i='icon-warning-sign';
    	   color='#E3A21A';
    	}else if(icon=='info'){
    	   i='icon-info-sign';
    	   color='#2B5797';
    	}else if(icon=='question'){
    	   i='icon-question-sign';
    	   color='#603CBA';
    	}else if(icon=='ok'){
    	   i='icon-question-sign';//'icon-ok-sign';
    	    color='#ccc';//'#00A300';
    	}else{
    		i=null;
       }
       if(!Gv.isEmpty(i)){
       	   cfg.html='<div style="display:inline-block;"><i class="'+i+'" style="width:32px;height:32px;margin:0 20px 0 10px; line-height:32px; color:'+color+'; font-size:32px; display:inline-block; vertical-align:top;"></i>'+ cfg.html+'</div>';
       	}

    }
    //变换Tbar
    function changeTbar(){
    	cfg.tbar=[];
    	if(cfg.buttons.indexOf('YES')>-1){
    		cfg.tbar.push({
				text:Gv.gvI18n('page_ok'),
				handler:function(){
					a.close();
					if($.isFunction(cfg.handler)){
						cfg.handler('yes');
					}
				}
		  });
    	}
    	if(cfg.buttons.indexOf('NO')>-1){
    	  cfg.tbar.push({
				text:Gv.gvI18n('page_no'),
				handler:function(){
					a.close();
					if($.isFunction(cfg.handler)){
						cfg.handler('no');
					}
				}
		  });
    	}
    	 if(cfg.buttons.indexOf('CANCEL')>-1){
    	   cfg.tbar.push({
				text:Gv.gvI18n('page_cancel'),
				handler:function(){
					a.close();
					if($.isFunction(cfg.handler)){
						cfg.handler('cancel');
					}
				}
		  });
    	}
    	if(Gv.isEmpty(cfg.buttons)){
    		cfg.tbar.push({
				text:Gv.gvI18n('page_ok'),
				handler:function(){
					a.close();
				}
		  });
       }
    }
    function show(){
    	    a=new Gv.Window(cfg);
	}
	changeIcon(cfg.icon);
	changeTbar();
	show();
};
/**
 *冒泡信息框
 *@author LLJ
 *@version 1.0.0
 * cfg
 * cfg{}html string 显示信息
 *
 */
Gv.MsgBubble=function(opt){
	this.cfg={
		    id:'window-bubble-'+Gv.random(),
    		 width:200,
    		 bottom:0,
			 right:10,
             html:'',
             zIndex:1000,
             listeners:{}
    };
    $.extend(true,this.cfg,opt);
	var closeStr='<span id="'+this.cfg.id+'-window-close" class="close" >x</span>';
    this.bubTop=$( '<div class="top" style="height:16px;">'+closeStr+'</div>');
    this.bubContent=$( '<div class="content" >'+this.cfg.html+'</div>');
    this.bub=$('<div id="' + this.cfg.id + '" class="frame-bubble"  />').append(this.bubTop).append(this.bubContent);
    //Gv.main().append(this.bub);
    this.bub.appendTo($('#container'));
    // this.bub.show();
    this.cfg.bottom= this.bub[0].offsetHeight;
     this.bub.css({
     	width:this.cfg.width,
   	     bottom:this.cfg.bottom
   	});
   	var self=this;
 	this.bindClick();
}
Gv.MsgBubble.prototype.html=function(html){
	this.bub.children('.content').html(html);
}
Gv.MsgBubble.prototype.bindClick=function(){
Gv.get(this.cfg.id+'-window-close').bind('click',{id:this.cfg.id },function(evet){
	//使用原型方法关闭会将main页面关闭，
   // 故只能将方法中的代码直接放到点击事件中执行，才不会出现main页面关闭现象
	Gv.get(evet.data.id).fadeOut(Gv.time5);
});
}
Gv.MsgBubble.prototype.show=function(){
	this.bub.animate({
		bottom:10
	},Gv.time5);
}
