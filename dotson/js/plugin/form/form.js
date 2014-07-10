/**
 * 表单组件
 */
 /**

@cfg{} id String
@cfg{} name String
@cfg{} width:'390',
@cfg{} height:'',
@cfg{} renderTo String
@cfg{} validate:function()//验证监听，如果覆写，原来的验证（正则就失效）
@cfg{} bodyStyle string
	};

comb
 */
Gv.form.FormPanel=function(opt){
	this.cfg={
		id:'',
		renderTo:'',
		url:'',
		layout:'form',//表单布局类型 column 和form 默认是form
		width:'410',
		height:'',
		bodyStyle: ''
	};
	this.fields={};
this.cfg.id='form-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,this.cfg,opt);
	if(this.cfg.renderTo){
		Gv.get(this.cfg.renderTo).append(this.build());
	}
};
Gv.form.FormPanel.prototype.build=function(){
	this.mainHtml();
	this.itemsHtml();
	this.cfg.layout=='form'?this.layoutForm(this.fields):this.layoutColumn();
	return this.form;
};
Gv.form.FormPanel.prototype.mainHtml=function(){
	this.form=$('<form id="'+this.cfg.id+'" action="'+this.cfg.url+'" enctype="multipart/form-data" method="post" />')
	return this.form;
};
Gv.form.FormPanel.prototype.field=function(o){
	   var tmp,obj;
	    if(o.constructor==Object){
			tmp=Gv.xtypeObject(o.xtype);
			obj=new tmp(o);
		}else{
		    obj=o;
		}
		return obj;
};
Gv.form.FormPanel.prototype.itemsHtml=function(){
	for(var i=0;i<this.cfg.items.length;i++){
		if(this.cfg.layout=='form'){
			var itm=this.cfg.items[i],
		    field=this.field(itm);
		   this.fields[field.getId()]=field;

		}else{
	    /*
			for(var m=0;m<this.cfg.items.length;m++){
				var clnItms=this.cfg.items[m];
				for(var n=0;n<clnItms.length;n++){
					 field=this.field(clnItms[n]);
		             this.fields[field.getId()]=field;
				}
			}*/
	   }

	}
};
Gv.form.FormPanel.prototype.layoutForm=function(arr){
	for(var k in arr){
		var f=arr[k];
		this.form.append(f.build());
   }
};
Gv.form.FormPanel.prototype.layoutColumn=function(){
	var i=0,
	//tmp=num%2 == 0?num/2:(num+1)/2,
	col='';
	//col1=$('<div />').css({display:'block',width:'50%',float:'left'}),
	//col2=$('<div />').css({display:'block',width:'50%',float:'left'});
	for(var m=0;m<this.cfg.items.length;m++){
		      Gv.log('column '+m)
		       col=$('<div />').css({display:'block',width:'50%',float:'left'});
				var clnItms=this.cfg.items[m];
				for(var n=0;n<clnItms.items.length;n++){
					Gv.log('column '+m+' item: '+n);
					Gv.log(clnItms);
					 field=this.field(clnItms.items[n]);
					  this.fields[field.getId()]=field;
		             col.append(field.build());
				}
				this.form.append(col);
	}
	/*
	for(var k in arr){
		  var f=arr[k];
		  if(i++%2!=0){
		  	col1.append(f.build());
		  }else{
		  	col2.append(f.build());
		  }
	}*/
	//this.form.append(col1).append(col2);
};
Gv.form.FormPanel.prototype.validate=function(){
	var f=true;
	for(var k in this.fields){
		  var itm=this.fields[k];
		  if(itm.validate()===false){
		  	f=itm.validate();
		  	//break;
		  }
	}
	return f;
};
Gv.form.FormPanel.prototype.getId=function(){
	return this.cfg.id;
};
/**
根据Id得到表单中的单个field
*/
Gv.form.FormPanel.prototype.fieldBy=function(id){
	return  this.fields[id];
};
/**
o{}
o.successFun(json){
   //得到返回值
}
*/
Gv.form.FormPanel.prototype.submit=function(o){
	var params=Gv.get(this.cfg.id).serialize(),
	d={};
	$.extend(d,o);
	Gv.ajax({
		url:this.cfg.url,
		data:params,
		successFun:function(r){
			if($.isFunction(d.successFun)){
				d.successFun(r);
			}
		}
	})
};
Gv.register('form',Gv.form.FormPanel);

/**
 * 输入框组件
 */
 /**

@cfg{} id String
@cfg{} name String
@cfg{} renderTo String
@cfg{} fieldLabel String
@cfg{} labelWidth int
@cfg{} width int
@cfg{} xtype String
@cfg{} allowBlank boolean
@cfg{} emptyText String
@cfg{} regex :'' ,//正则
@cfg{} regexText  String//正则错误提示
@cfg{} readOnly boolean
@cfg{} disabled boolean
@cfg{} listeners:{
         	//焦点事件
@cfg{} focus:function(v){
         	},
         	//失去焦点事件
@cfg{} focusout:function(v){
         	},
@cfg{} validate:function(textField,value)//验证监听，如果覆写，原来的验证（正则就失效）
         	参数 textField 输入框自己
             参数 value  获取输入框值
@cfg{} bodyStyle string
	};


 */
Gv.form.TextField=function(opt){
	this.cfg={
		id:'',
		name:'',
		renderTo:'',
		fieldLabel: '',
		labelWidth: '105',
		width:'390',
		value:'',
		type:'text',
		allowBlank: true,
		hidden: false,
		blankText:Gv.gvI18n('page_plugin_required'),
		emptyText: '',
	     regex :'' ,//正则
         regexText : '',//正则错误提示
         readOnly:false,
         disabled:false,
         maxLength:'',
       //  maxLengthText:'',
         minLength:'',
       //  minLengthText:'',
         listeners:{
         	//焦点事件
         	focus:function(v){
         	},
         	//失去焦点事件
         	focusout:function(v){
         	},
         	layout:null,
         	validate:null,//验证监听，如果覆写，原来的验证（正则就失效）
         	select:null,
         	change:null
         },
		bodyStyle: ''
	};
	this.tipsContent='';
	this.cfg.id='form-field-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,this.cfg,opt);
	if(this.cfg.renderTo){
		Gv.get(this.cfg.renderTo).append(this.build());
		if(this.placeholder){
			this.placeholder.height(this.input.height())
		}
	}
};
Gv.form.TextField.prototype.build=function(){
	//this.mainHtml().append(this.labelHtml()).append(this.inputHtml()).append(this.warningIconHtml());
	this.mainHtml().append(this.labelHtml()).append(this.inputHtml()).append(this.placeholderHtml());
	this.bindEvent();
	return this.field;
};
Gv.form.TextField.prototype.mainHtml=function(){
	this.field=$('<div class="page-form-control" />').width(this.cfg.width);
	if(this.cfg.hidden){
		this.field.css('display', 'none');
	}
	var self=this;
	this.field.bind('mouseenter',function(event){
		  if($(this).attr('class').indexOf('gv-field-error')>-1){
		  	    event.clientX
		        self.showErrorTips($(this),self.errprTips(),event.clientX,event.clientY);
		   } ;
	   }).bind('mouseleave',function(event){
		     self.removeErrorTips($(this),self.errprTips());
	   })
	return this.field;
};
Gv.form.TextField.prototype.labelHtml=function(){
	this.label=$('<label />').width(this.cfg.labelWidth).html(this.cfg.fieldLabel);
	return this.label;
};
Gv.form.TextField.prototype.placeholderHtml=function(){
	this.placeholder=null;
	var self=this;
	if(this.cfg.emptyText){
		var w=this.cfg.width-this.cfg.labelWidth-2;
		this.placeholder=$('<span  class="placeholder" />')
		.width(w)
		.text(this.cfg.emptyText)
		.unbind('click').bind('click',function(){
			$(this).hide();
			self.input.focus();
	     });
		if(!Gv.isEmpty(this.cfg.value)){
			this.placeholder.css({
				display:'none'
			})
		}
	}
	return this.placeholder;
};
/* 隐藏文本框的方法 */
Gv.form.TextField.prototype.hiddenText=function(flag){
	if(flag){
		this.field.css('display', 'none');
	}else{
		this.field.css('display', '');
	}
}
Gv.form.TextField.prototype.inputHtml=function(){
	var t=this.cfg.type,
     	w=this.cfg.width-this.cfg.labelWidth-2,
	    val=this.cfg.value,
	    self=this;
	// placeholder="'+this.cfg.emptyText+'"
	this.input=$('<input  type="'+t+'"    />').attr({
		name:this.cfg.name,
		id:this.cfg.id,
		defualt:this.cfg.emptyText
	}).width(w);
	if(!Gv.isEmpty(this.cfg.maxLength)){
		this.input.attr('maxLength',parseInt(this.cfg.maxLength))
	}
	if(!Gv.isEmpty(this.cfg.minLength)){
		this.input.attr('minLength',parseInt(this.cfg.minLength))
	}
	if(!Gv.isEmpty(val)){
		this.input.val(val)
	}
	if(this.cfg.readOnly===true){
		this.readOnly(true);

	}
	if(this.cfg.disabled===true){
		this.disabled(true);
	}
	return this.input;

};
/**
 * @param b boolean
 */
Gv.form.TextField.prototype.readOnly=function(b){
	if(b===true){
		this.input.attr('readonly','readonly').addClass('disabled');
	}else{
		this.input.removeAttr('readonly').removeClass('disabled');
	}
};
/**
 * @param b boolean
 */
Gv.form.TextField.prototype.disabled=function(b){
	if(b===true){
		this.input.attr('disabled','disabled').addClass('disabled');
	}else{
		this.input.removeAttr('disabled').removeClass('disabled');
	}
};
Gv.form.TextField.prototype.getId=function(){
	return this.cfg.id;
};
//绑定全部事件
Gv.form.TextField.prototype.bindEvent=function(){
	this.bindFocus();
	this.bindFocusout();
	this.bindSelect();
	this.bindChange();
	if(this.cfg.allowBlank===false||this.cfg.regex!=''){
		this.bindMouseenter();
	    this.bindMouseleave();
	}

};
Gv.form.TextField.prototype.bindSelect=function(){

};
//change Event
Gv.form.TextField.prototype.bindChange=function(){
	var self=this;
	this.input.unbind('change').bind('change',function(){
			if(self.placeholder){
				if (self.input.attr('value') == '') {
					self.placeholder.show();
				}else{
					self.placeholder.hide();
				}
			}
			if($.isFunction(self.cfg.listeners.change)){
				self.cfg.listeners.change();
			}
	})
};
//获得焦点
Gv.form.TextField.prototype.bindFocus=function(){
	var self=this;
	this.input.unbind('focus').bind('focus',function(){
			self.hideWarningIcon();
			if(self.placeholder){
				self.placeholder.hide();
			}
			if($.isFunction(self.cfg.listeners.focus)){
				self.cfg.listeners.focus();
			}
			self.removeError();

	})
};

//焦点离开事件
Gv.form.TextField.prototype.bindFocusout=function(){
	var self=this;
	this.input.unbind('focusout').bind('focusout',function(){
		var f=self.validate();
		if(self.placeholder){
			if ($(this).attr('value') == '') {
				self.placeholder.show();
			}
		}
		//Gv.log('bindFocusout-'+f)
		// f?self.removeError():self.addError();
		// !f?self.showWarningIcon():self.hideWarningIcon();
		if($.isFunction(self.cfg.listeners.focusout)){
				self.cfg.listeners.focusout();
	    }
	})
};
//鼠标移上
Gv.form.TextField.prototype.bindMouseenter =function(){
};

//鼠标离开
Gv.form.TextField.prototype.bindMouseleave =function(){
};
Gv.form.TextField.prototype.showWarningIcon =function(){
	//this.warningIcon.attr('class','icon-warning-sign fg-color-red ');
};
Gv.form.TextField.prototype.hideWarningIcon =function(){
	//this.warningIcon.removeAttr('class');
};
Gv.form.TextField.prototype.showErrorTips =function(target,msg,x,y){
	Gv.textTips(true,target,msg,x,y);
};
Gv.form.TextField.prototype.removeErrorTips =function(target){
	//this.tipsContent='';
	Gv.textTips(false,target)
};
//得到验证结果
Gv.form.TextField.prototype.validate=function(){
	var v=this.input.val(),f=false;
	this.errorType='regex';
	if($.isFunction(this.cfg.listeners.validate)){//如果覆写了验证方法就不能在使用正则验证
		return this.cfg.listeners.validate(this,v);
	}else{
		if(this.cfg.allowBlank===true){//允许为空
			var tempReg=this.cfg.regex;
			if(Gv.isEmpty($.trim(v))){
				tempReg='';
			}
			f=tempReg?this.cfg.regex.test(v):true;
		}else{//不允许为空
			if(Gv.isEmpty($.trim(v))){
				f=false;
				this.errorType='required'
			}else{
			    f=this.cfg.regex?this.cfg.regex.test(v):true;
			}
		}
	f?this.removeError():this.addError();
	return f;
	}

};
Gv.form.TextField.prototype.setTipsContent=function(v){
	this.tipsContent=v;
}
Gv.form.TextField.prototype.errprTips=function(){
	var result;
	if(this.tipsContent){
		result=this.tipsContent;
	}else{
	   result=this.errorType=='regex'?this.cfg.regexText:this.cfg.blankText;
	}
	return result;
}
//设置和获取表单值
Gv.form.TextField.prototype.value=function(v){
	if(v!==undefined){
		if(!Gv.isEmpty(v)&&this.placeholder){
			this.placeholder.hide();
		}
		this.input.val(v);
	}
	return this.input.val();
};
Gv.form.TextField.prototype.removeError=function(){
	this.removeErrorTips(this.field);
	this.field.removeClass('gv-field-error');
};
Gv.form.TextField.prototype.addError=function(){
	this.field.addClass('gv-field-error');
};
Gv.form.TextField.prototype.empty=function(){
	this.input.val('');
	if(this.placeholder){
		this.placeholder.show();
	}
};

Gv.register('textfield',Gv.form.TextField);

/**
 * 有下拉选项的TextField
 * */
Gv.form.TextFieldSelect=function(opt){
	var defualt={
			data:[],
			emptyValue:'',
			emptyText:'',
			listeners:{
			   afterLoad:null,
			   change:null
			},
			autoLoad:true,
			params:{},
			url:''
	};
	$.extend(true,defualt,opt);
	Gv.form.TextField.call(this,defualt);
};
Gv.extend(Gv.form.TextFieldSelect,Gv.form.TextField);

Gv.form.TextFieldSelect.prototype.build=function(){
	this.mainHtml().append(this.hiddenHtml())
	.append(this.labelHtml()).append(this.inputHtml()).append(this.selectHtml());
	this.bindEvent();
	return this.field;
};
Gv.form.TextFieldSelect.prototype.mainHtml=function(){
	this.field=$('<div class="page-form-control gv-field-select-wrap" />').width(this.cfg.width);
	if(this.cfg.hidden){
		this.field.css('display', 'none');
	}
	var self=this;
	this.field.bind('mouseenter',function(event){
		  if($(this).attr('class').indexOf('gv-field-error')>-1){
		  	    event.clientX
		        self.showErrorTips($(this),self.errprTips(),event.clientX,event.clientY);
		   } ;
	   }).bind('mouseleave',function(event){
		     self.removeErrorTips($(this),self.errprTips());
	   })
	return this.field;
};

Gv.form.TextFieldSelect.prototype.selectHtml=function(){
	if(Gv.isEmpty(this.cfg.data)&&this.cfg.autoLoad){//静态数据为空，动态为true
	    this.load(this.cfg.params);
	}else if(Gv.isArr(this.cfg.data)&&this.cfg.data.length>0){//只用静态数据，
	    if(this.cfg.autoLoad==false){//动态为false
		   this.ulHtml(this.cfg.data);
		}else{//既有静态又有动态数据
			Gv.ajax({
				url:this.cfg.url,
				data:this.cfg.params,
				async: false,
				successFun:function(r){
					if(Gv.isArr(r)){
						for(var i=0;i<r.length;i++){
							self.cfg.data.push(r[i]);
						}
					}
				}
			})
		  this.ulHtml(this.cfg.data);
		}
	}else{
		 this.ulHtml([]);
	}
	return this.ul;
};
//隐藏域
Gv.form.TextFieldSelect.prototype.hiddenHtml=function(){
	this.hedden=$('<input type="hidden" />');
	return this.hedden;
};
//下拉菜单
Gv.form.TextFieldSelect.prototype.ulHtml=function(arr){
	    // arr 数据格式['显示值1','显示值2']
	   if(!this.ul){
		   this.ul=$('<ul class="gv-field-select-ul" />').css({
			   top:this.input.outerHeight(),
			   left:this.label.outerWidth(),
			   width:this.cfg.width-this.label.outerWidth()
		   })
		}
	   this.ul.hide();
	   var self=this;
       if(!Gv.isEmpty(arr)){
    	   this.ul.html('');
            for(var i=0,len=arr.length;i<len;i++){
            	var rec=arr[i];
            	var li='<li attr="select" id="'+rec+'">'+rec+'</li>';
            	this.ul.append(li);
            }
            this.ul.unbind().bind('mousemove',function(event){
            	if($(event.target).attr('class')=='hover') return false;
                 $(event.target).addClass('hover').siblings().removeClass('hover');
	  	    }).bind('mouseleave',function(event){
	  		    $(this).find('li').removeClass('hover');
	  	    })
         }
         return this.ul;
};
Gv.form.TextFieldSelect.prototype.setUrl=function(url){
	this.cfg.url=url;
};
Gv.form.TextFieldSelect.prototype.load=function(params){
	var self=this,tempPs=Gv.isEmpty(params)?this.cfg.params:params;
	Gv.ajax({
		url:this.cfg.url,
		data:tempPs,
		successFun:function(r){
			self.ulHtml(r);
			if($.isFunction(self.cfg.listeners.afterLoad) ){
				self.cfg.listeners.afterLoad(r);
		    }
		}
	})
};
//设置和获取表单值
Gv.form.TextFieldSelect.prototype.value=function(v){
	if(v!==undefined){
		if(!Gv.isEmpty(v)&&this.placeholder){
			this.placeholder.hide();
		}
		this.input.val(v);
	}
	return this.input.val();
};
//获得焦点
Gv.form.TextFieldSelect.prototype.bindFocus=function(){
	var self=this;
	this.input.unbind('focus').bind('focus',function(){
			self.hideWarningIcon();
			if(self.placeholder){
				self.placeholder.hide();
			}
			self.ul.show();
			if($.isFunction(self.cfg.listeners.focus)){
				self.cfg.listeners.focus();
			}
			self.removeError();

	})
};
//焦点离开事件
Gv.form.TextFieldSelect.prototype.bindFocusout=function(){
	var self=this;
	 this.input.unbind('focusout').bind('focusout',function(e){
		   var tar=$(this);
    		var sel=tar.siblings('ul').children('li[class*="hover"]');
    		self.hedden.val(sel.attr('id'));
    		tar.val(sel.text());
    		$.isFunction(self.cfg.listeners.change)&&self.listeners.change(sel.text());
    		tar.siblings('ul').hide();
	})

};
Gv.register('textFieldSelect',Gv.form.TextFieldSelect);





/**带图标的TextField*/
// iconHandler
/**
 * iconHandler
 */
Gv.form.TextFieldIcon=function(opt){
	var defualt={
	  icon:'icon-search'
	};
	$.extend(true,defualt,opt);
	Gv.form.TextField.call(this,defualt);
};
Gv.extend(Gv.form.TextFieldIcon,Gv.form.TextField);

Gv.form.TextFieldIcon.prototype.build=function(){
	//this.mainHtml().append(this.labelHtml()).append(this.inputHtml()).append(this.warningIconHtml());
	this.mainHtml().append(this.labelHtml()).append(this.inputHtml())
	.append(this.placeholderHtml())
	.append(this.iconHtml()).css('position','relative');
	this.bindEvent();
	return this.field;
};
Gv.form.TextFieldIcon.prototype.mainHtml=function(){
	this.field=$('<div class="page-form-control" />').width(this.cfg.width);
	if(this.cfg.hidden){
		this.field.css('display', 'none');
	}
	var self=this;
	this.field.bind('mouseenter',function(event){
		  if(this.tagName.toLowerCase( )=='i'){
		     return false;
		  }
		  if($(this).attr('class').indexOf('gv-field-error')>-1){
		  	    event.clientX
		        self.showErrorTips($(this),self.errprTips(),event.clientX,event.clientY);
		   } ;
	   }).bind('mouseleave',function(event){
		   	if(this.tagName.toLowerCase( )=='i'){
			     return false;
			 }
		     self.removeErrorTips($(this),self.errprTips());
	   })
	return this.field;
};
Gv.form.TextFieldIcon.prototype.placeholderHtml=function(){
	this.placeholder=null;
	var self=this;
	if(this.cfg.emptyText){
		var w=this.cfg.width-this.cfg.labelWidth-2-20;
		this.placeholder=$('<span  class="placeholder" />')
		.css({
			width:w,
			right:20
		})
		.text(this.cfg.emptyText)
		.unbind('click').bind('click',function(){
			$(this).hide();
			self.input.focus();
	     });
		if(!Gv.isEmpty(this.cfg.value)){
			this.placeholder.css({
				display:'none'
			})
		}
	}
	return this.placeholder;
};
Gv.form.TextFieldIcon.prototype.inputHtml=function(){

	var t=this.cfg.type,
     	w=this.cfg.width-this.cfg.labelWidth-25,
	    val=this.cfg.value,
	    self=this;
	this.input=$('<input  type="'+t+'" name="'+this.cfg.name+'"  id="'+this.cfg.id+'"  />').width(w);
	if(!Gv.isEmpty(this.cfg.maxLength)){
		this.input.attr('maxLength',parseInt(this.cfg.maxLength))
	}
	if(!Gv.isEmpty(this.cfg.minLength)){
		this.input.attr('minLength',parseInt(this.cfg.minLength))
	}
	if(!Gv.isEmpty(val)){
		this.input.val(val)
	}
	if(this.cfg.readOnly===true){
		this.readOnly(true);

	}
	if(this.cfg.disabled===true){
		this.disabled(true);
	}
	return this.input;
};
Gv.form.TextFieldIcon.prototype.iconHtml=function(){
	var self=this,
	     i=$('<i />').addClass('icon-search').css({right:0,
	     	top:10,
	     	position:'absolute',
	     	 color:'#999999',
            cursor:' pointer',
           fontSize: '14px',
           height: 20,
           width: 20
	     	}).bind('click',function(){
			   if($.isFunction(self.cfg.iconHandler)){
				   self.cfg.iconHandler(self.cfg.id);
			  }
		     return false;
	    })
	return i;
};
Gv.register('textfieldicon',Gv.form.TextFieldIcon);
/**文本域组件*/
Gv.form.TextArea=function(opt){
	Gv.form.TextField.call(this,opt);
};
Gv.extend(Gv.form.TextArea,Gv.form.TextField);

Gv.form.TextArea.prototype.mainHtml=function(){
	this.field=$('<div class="page-form-control textarea" />').width(this.cfg.width);
	if(this.cfg.hidden){
		this.field.css('display', 'none');
	}
	var self=this;
	this.field.bind('mouseenter',function(event){
		  if($(this).attr('class').indexOf('gv-field-error')>-1){
		        self.showErrorTips($(this),self.errprTips(),event.clientX,event.clientY);
		   } ;
	   }).bind('mouseleave',function(){
		     self.removeErrorTips($(this),self.errprTips());
	   });
	return this.field;
};
//placeholder="'+this.cfg.emptyText+'"
Gv.form.TextArea.prototype.inputHtml=function(){
	var w=this.cfg.width-this.cfg.labelWidth-12,val=this.cfg.value;
	this.input=$('<textarea id="'+this.cfg.id+'"  name="'+this.cfg.name+'"   />').width(w);
	if(this.cfg.height){
		this.input.height(this.cfg.height);
	}
	if(this.cfg.rows){
		this.input.attr('rows',this.cfg.rows)
	}
	if(!Gv.isEmpty(val)){
		this.input.val(val)
	}
	if(!Gv.isEmpty(this.cfg.maxLength)){
		this.input.attr('maxLength',parseInt(this.cfg.maxLength));
		this.bindKeypress();
	}
	if(!Gv.isEmpty(this.cfg.minLength)){
		this.input.attr('minLength',parseInt(this.cfg.minLength))
	}
	if(this.cfg.readOnly===true){
		this.readOnly(true);
	}
	if(this.cfg.disabled===true){
		this.disabled(true);
	}
	return this.input;
};
Gv.form.TextArea.prototype.bindKeypress=function(){
	this.input.bind('keypress',function(){
		   var self=$(this);
		   var maxLength = self.attr('maxLength')*1;
	        if (self.val().length >maxLength) {
	        	self.val(self.val().substring(0, maxLength));
	        }
	})
};

/* 隐藏文本域的方法 */
Gv.form.TextArea.prototype.hiddenText=function(flag){

	if(flag){
		this.field.css('display', 'none');
		Gv.log(this.field);
	}else{
		this.field.css('display', '');
	}
}
Gv.register('textarea',Gv.form.TextArea);

/**
IP 输入框
*/
Gv.form.IPField=function(opt){
	var reg=Gv.regexSelector('ip'),
	cfg={
	     regex :reg.regex,
         regexText :reg.regexText
	};
	$.extend(true,cfg,opt);
	Gv.form.TextField.call(this,cfg);
};
Gv.extend(Gv.form.IPField,Gv.form.TextField);
Gv.register('ipfield',Gv.form.IPField);
/**
Password  输入框
*/
Gv.form.Password=function(opt){
    var cfg={type:'password'};
	$.extend(true,cfg,opt);
	Gv.form.TextField.call(this,cfg);
};
Gv.extend(Gv.form.Password,Gv.form.TextField);
Gv.register('password',Gv.form.Password);


/**
  文件  上传
*/
Gv.form.FileUpload=function(opt){
	var defualt={
	  type:'file'
	};
	$.extend(true,defualt,opt);
	Gv.form.TextField.call(this,defualt);
};
Gv.extend(Gv.form.FileUpload,Gv.form.TextField);
Gv.register('fileupload',Gv.form.FileUpload);

/**
 *时间组件
 *opts{}  id: string
 *opts{}  renderTo: string
    type String 默认'date',   还有'time'
    showSecond: boolean,默认false 是否显示秒
	timeFormat: Stirng 默认 hh:mm 例子 'hh:mm:ss',
	dateFormat: Stirng 默认 "yy-mm-dd",
	minDate: Date //new Date(2010, 11, 20, 8, 30),
	maxDate: Date //new Date(2010, 11, 31, 17, 30)
*/

Gv.form.TimeField=function(opt){
     var defualt={
    	 dateFormat: "yy-mm-dd",
    	  timeFormat: 'hh:mm:ss',
  		   stepSecond: 1,
	       timeRange:false,// 设置时间范围 默认false
	        startDate:null, //开始时间输入框Id
	        endDate:null//结束时间输入框Id
     }
     $.extend(true,defualt,opt);
	Gv.form.TextField.call(this,defualt);
};
Gv.extend(Gv.form.TimeField,  Gv.form.TextField);
Gv.form.TimeField.prototype.inputHtml=function(){
	var self=this;
	var t=this.cfg.type,
	w=this.cfg.width-this.cfg.labelWidth-2,
	val=this.cfg.value;
	this.input=$('<input  type="'+t+'" name="'+this.cfg.name+'"  id="'+this.cfg.id+'"  />').width(w);
	if(!Gv.isEmpty(val)){
		this.input.val(val)
	}
	if(this.cfg.readOnly===true){
		this.readOnly(true);
	}
	if(this.cfg.disabled===true){
		this.disabled(true);
	}
	if(this.cfg.timeRange){
		if(this.cfg.startDate){
			this.cfg.onSelect=function(){
				$('#'+self.cfg.startDate).datetimepicker('option', 'maxDate', self.input.datetimepicker('getDate') );
			};
			this.cfg.onClose=function(dateText, inst) {
				var startDatefile=$('#'+self.cfg.startDate)
				if (startDatefile.val() != '') {
					var testEndDate = self.input.datetimepicker('getDate');
					var  testStartDate= startDatefile.datetimepicker('getDate');
					if (testStartDate > testEndDate)
						startDatefile.datetimepicker('setDate', testEndDate);
				}else {
					startDatefile.val(dateText);
				}
			};
		}
       if(this.cfg.endDate){

    	   this.cfg.onSelect=function(){
				$('#'+self.cfg.endDate).datetimepicker('option', 'minDate', self.input.datetimepicker('getDate') );
			};
			this.cfg.onClose=function(dateText, inst) {
				var endDatefile=$('#'+self.cfg.endDate)
				if (endDatefile.val() != '') {
					var testStartDate= self.input.datetimepicker('getDate');
					var   testEndDate =endDatefile.datetimepicker('getDate');
					if (testStartDate > testEndDate)
						endDatefile.datetimepicker('setDate', testStartDate);
				}else {
					endDatefile.val(dateText);
				}
			};
		}
	}
	this.input.datetimepicker(this.cfg);
	this.input.bind('click',function(){
		self.placeholder.hide();
	})
	this.input.bind('keypress',function(){
           $(this).val('');
	})
	this.input.bind('keyup',function(){
           $(this).val('');
	})
	return this.input;

};
Gv.form.TimeField.prototype.placeholderHtml=function(){
	this.placeholder=null;
	var self=this;
	if(this.cfg.emptyText){
		var w=this.cfg.width-this.cfg.labelWidth-2;
		this.placeholder=$('<span  class="placeholder" />')
		.width(w)
		.text(this.cfg.emptyText)
		.unbind('click').bind('click',function(){
			$(this).hide();
			self.placeholder.hide();
			self.input.focus();
	     });
		if(!Gv.isEmpty(this.cfg.value)){
			this.placeholder.css({
				display:'none'
			})
		}
	}
	return this.placeholder;
};
//由于与时间插件的焦点事件冲突，故置空
Gv.form.TimeField.prototype.bindFocus=function(){};
Gv.form.TextField.prototype.bindClick=function(){};
Gv.register('timefield',Gv.form.TimeField);
/**
Email 输入框
*/
Gv.form.EmailField=function(opt){
	var reg=Gv.regexSelector('email'),
	cfg={
		 maxLength:'50',
	     regex :reg.regex,
         regexText :reg.regexText,
         allowBlank:true
	};
	$.extend(true,cfg,opt);
	Gv.form.TextField.call(this,cfg);
};
Gv.extend(Gv.form.EmailField,Gv.form.TextField);

Gv.register('emailfield',Gv.form.EmailField);
/**
隐藏域
*/
Gv.form.HiddenField=function(opt){
  this.cfg={
		id:'',
		name:'',
		renderTo:'',
		value:''
	};
	$.extend(true,this.cfg,opt);
	if(this.cfg.renderTo){
		Gv.get(this.cfg.renderTo).append(this.build());
	};
}
Gv.form.HiddenField.prototype.build=function(){
	return this.mainHtml();
};
Gv.form.HiddenField.prototype.mainHtml=function(){
	this.field=$('<input id="'+this.cfg.id+'" type="hidden"  name="'+this.cfg.name+'"  >').val(this.cfg.value);
	return this.field;
};
Gv.form.HiddenField.prototype.value=function(v){
	if(!Gv.isEmpty(v)){
		this.field.val(v);
	}
	return this.field.val();
};
Gv.form.HiddenField.prototype.getId=function(){
	return this.cfg.id;
};
Gv.register('hiddenfield',Gv.form.HiddenField);

/**
ComboBox
*/
Gv.form.ComboBox=function(opt){
	var defualt={
		data:[],
		emptyValue:'',
		emptyText:'',
		listeners:{
		   afterLoad:null,
		   change:null
		},
		autoLoad:true,
		params:{},
		url:''
	};
	$.extend(true,defualt,opt);
	Gv.form.TextField.call(this,defualt);
};
Gv.extend(Gv.form.ComboBox,Gv.form.TextField);

Gv.form.ComboBox.prototype.build=function(){
	this.mainHtml().append(this.labelHtml()).append(this.inputHtml());
	this.bindEvent();
	return this.field;
};
Gv.form.ComboBox.prototype.inputHtml=function(){
	var self=this,w=this.cfg.width-this.cfg.labelWidth-15;
	this.input=$('<select id="'+this.cfg.id+'"  name="'+this.cfg.name+'" />').width(w);
	if(!Gv.isEmpty(this.cfg.emptyText)){
		var tmp=$('<option placeholder="ph"  value="'+this.cfg.emptyValue+'" />').text(this.cfg.emptyText);
		this.input.addClass('placholderColor');
        this.input.append(tmp);
	}
	if(Gv.isEmpty(this.cfg.data)&&this.cfg.autoLoad){//静态数据为空，动态为true
	    this.load(this.cfg.params);
	}else if(Gv.isArr(this.cfg.data)&&this.cfg.data.length>0){//只用静态数据，
	    if(this.cfg.autoLoad==false){//动态为false
		  this.optionHtml(this.cfg.data);
		}else{//既有静态又有动态数据
			Gv.ajax({
				url:this.cfg.url,
				data:this.cfg.params,
				async: false,
				successFun:function(r){
					if(Gv.isArr(r)){
						for(var i=0;i<r.length;i++){
							self.cfg.data.push(r[i]);
						}
					}
				}
			})
		  this.optionHtml(this.cfg.data);
		}

	}

	if(this.cfg.readOnly===true){
		this.readOnly(true);
	}
	if(this.cfg.disabled===true){
		this.disabled(true);
	}
	return this.input;
};
Gv.form.ComboBox.prototype.setUrl=function(url){
	this.cfg.url=url;
};
Gv.form.ComboBox.prototype.load=function(params){
	var self=this,tempPs=Gv.isEmpty(params)?this.cfg.params:params;
	Gv.ajax({
		url:this.cfg.url,
		data:tempPs,
		successFun:function(r){
			self.optionHtml(r);
			if($.isFunction(self.cfg.listeners.afterLoad) ){
				self.cfg.listeners.afterLoad(r);
		    }
		}

	})
};
Gv.form.ComboBox.prototype.data=function(data){
    this.optionHtml(data);
};
Gv.form.ComboBox.prototype.optionHtml=function(data){
	//[{id:'隐藏值',text:'显示值'},{id:'隐藏值',text:'显示值'}...]
	this.input.html('');
	var val=this.cfg.value;
	if(!Gv.isEmpty(this.cfg.emptyText)){
		var tmp=$('<option value="'+this.cfg.emptyValue+'" placeholder="ph" />').text(this.cfg.emptyText);
		this.input.addClass('placholderColor');
		Gv.log(this.cfg.emptyText)
        this.input.append(tmp);
	}else{
		if($.browser.version=="9.0" ){
			this.input.addClass('placholderColor');
		}
	}
	if(Gv.isArr(data)&&data.length>0){
		var opts='';
		if(!Gv.isEmpty(this.cfg.emptyText)){
			opts+='<option value="'+this.cfg.emptyValue+'" placeholder="ph" >'+this.cfg.emptyText+'</option>';
		}
		for(var i=0;i<data.length;i++){
			var d=data[i];
			opts+='<option value="'+d.id+'" >'+d.text+'</option>';
			//opt=$('<option value="'+d.id+'" />').text(d.text);
			//this.input.append(opt);
		}
		this.input.html(opts);
	}
	if(!Gv.isEmpty(val)){
		 this.input.val(val)
	}
};
Gv.form.ComboBox.prototype.value=function(v){
   if(!Gv.isEmpty(v)){
	   if(!Gv.isEmpty(v)&&this.placeholder){
			this.placeholder.hide();
		}
	   Gv.log('v:'+v)
 	   this.input.val(v);
 	}
    return this.input.find("option:selected").val();
};
Gv.form.ComboBox.prototype.text=function(t){
    //this.input.find("option:selected").text(t);

    if(!Gv.isEmpty(t)){
 	   this.input.val(t);
 	}
    return   this.input.find("option:selected").text();
};
//change Event
Gv.form.ComboBox.prototype.bindChange=function(){
	var self=this;
	this.input.bind('change',function(e){
		if(self.value()==self.cfg.emptyValue){
			$(this).addClass('placholderColor');
		}else{
			$(this).removeClass('placholderColor');
		}
		if($.isFunction(self.cfg.listeners.change)){
			self.cfg.listeners.change($(this).val(),self.text());
		   //self.cfg.listeners.change(self.value(),self.text());
		}

	})
};
Gv.register('comobox',Gv.form.ComboBox);
/*
<select>
<option >1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
</select>*/



/**
  GroupComboBox 分组ComboBox
*/
Gv.form.GroupComboBox=function(opt){
	var defualt={
		data:[],
		listeners:{
		   afterLoad:null,
		   change:null
		},
		autoLoad:true,
		params:{},
		url:''
	};
	$.extend(true,defualt,opt);
	Gv.form.ComboBox.call(this,defualt);
};
Gv.extend(Gv.form.GroupComboBox,Gv.form.ComboBox);

Gv.form.GroupComboBox.prototype.optionHtml=function(data){
	//[{group:'分组1',data:[{id:'隐藏值',text:'显示值'},{id:'隐藏值',text:'显示值'}]},{group:'分组2',data:[{id:'隐藏值',text:'显示值'},{id:'隐藏值',text:'显示值'}]},...]
	this.input.html('');
	var val=this.cfg.value;
	if(!Gv.isEmpty(this.cfg.emptyText)){
		var tmp=$('<option value="'+this.cfg.emptyValue+'" placeholder="ph" />').text(this.cfg.emptyText);
        this.input.append(tmp);
	}
	if($.browser.version=="9.0" ){
		this.input.addClass('placholderColor');
	}
	for(var i=0;i<data.length;i++){
		var g=data[i],
		optgroup=$('<optgroup />').attr('label',g.group);

		var groupName = g.group;
		for(var n=0;n<g.data.length;n++){
			var d=g.data[n];
			groupName = groupName.replace(' ','~');
			opt = '<option value=' +d.id+ ' pgrouplocal=' +groupName+ '>' +d.text+ '</option>';
			optgroup.append(opt);
		}
		this.input.append(optgroup);
	}
	if(!Gv.isEmpty(val)){
		    this.input.val(val)
	}
};
Gv.register('groupcomobox',Gv.form.GroupComboBox);
/**
获取GroupComboBox组件的选中项的值
*/
Gv.form.GroupComboBox.prototype.value=function(v){
if(!Gv.isEmpty(v)){
	if(!Gv.isEmpty(v)&&this.placeholder){
		this.placeholder.hide();
	}
	   this.input.val(v);
	}
return this.input.find("option:selected").val();
};
/**
获取GroupComboBox组件选中项的text值
*/
Gv.form.GroupComboBox.prototype.text=function(v){
if(!Gv.isEmpty(v)){
	   this.input.val(v);
	}
return this.input.find("option:selected").text();
};
/**
获取GroupComboBox组件选中项的上层值
*/
Gv.form.GroupComboBox.prototype.group=function(v){
	var groupName = this.input.find("option:selected").attr("pgrouplocal");
	if(!Gv.isEmpty(groupName)){
 	   return groupName.replace('~',' ');
	}
	return '';
};
Gv.register('groupcomobox',Gv.form.GroupComboBox);
/*
<select>
<optgroup label="服务器">
	<option value="10" pgrouplocal="服务器">Windows系列操作系统</option>
	<option value="11" pgrouplocal="服务器">Linux系列操作系统</option>
</optgroup>
<optgroup label="机柜">
	<option value="20" pgrouplocal="机柜">曙光水冷机柜</option>
	<option value="21" pgrouplocal="机柜">曙光风冷机柜</option>
</optgroup>
</select>
*/


//checkbox
Gv.form.Checkbox=function(opt){
	var defualt={
		checked:false,
		handler:null
	};
	$.extend(true,defualt,opt)
	Gv.form.TextField.call(this,defualt);
};
Gv.extend(Gv.form.Checkbox,Gv.form.TextField);

Gv.form.Checkbox.prototype.build=function(){
	this.mainHtml().append(this.inputHtml()).append(this.labelHtml());
	return this.field;
};
Gv.form.Checkbox.prototype.mainHtml=function(){
	this.field=$('<label class="input-control checkbox"  />');
	return this.field;
};
Gv.form.Checkbox.prototype.bindClick=function(){
	var self=this;
	this.input.bind('click',function(event){
		var $this=$(this);
		if($.isFunction(self.cfg.handler)){
			self.cfg.handler($this.attr('id'),$this.val());
		}
	});

};
Gv.form.Checkbox.prototype.inputHtml=function(){
	var val=this.cfg.checked,
	    self=this;
	this.input=$('<input type="checkbox"  id="'+this.cfg.id+'"  name="'+this.cfg.name+'" />').val(this.cfg.value);
    this.bindClick();
	if(this.cfg.checked){
		this.input.attr('checked',true);
	}
	if(this.cfg.readOnly===true){
		this.readOnly(true);
	}
	if(this.cfg.disabled===true){
		this.disabled(true);
	}
	return this.input;
};
Gv.form.Checkbox.prototype.labelHtml=function(){
	this.label=$('<span class="helper"/>').text(this.cfg.fieldLabel);
	return this.label;
};
Gv.form.Checkbox.prototype.value=function(v){
	this.input.val(v);
	return v;
};
Gv.form.Checkbox.prototype.getId=function(){
	return this.cfg.id;
};
Gv.register('checkbox',Gv.form.Checkbox);
/*
普通
<input type="checkbox" name="r" value="1">a<br>
<input type="checkbox" name="r" value="2">b<br>

//新样式
<label class="input-control checkbox">
<input type="checkbox">
<span class="helper">Namd</span>
</label>
*/


//Radio
Gv.form.Radio=function(opt){
	var defualt={
		checked:false
	};
	$.extend(true,defualt,opt)
	Gv.form.Checkbox.call(this,defualt);
};
Gv.extend(Gv.form.Radio,Gv.form.Checkbox);

Gv.form.Radio.prototype.mainHtml=function(){
	this.field=$('<label class="input-control radio"  />');
	return this.field;
};

Gv.form.Radio.prototype.inputHtml=function(){
	var val=this.cfg.checked;
	this.input=$('<input type="radio"  id="'+this.cfg.id+'"  name="'+this.cfg.name+'" />').val(this.cfg.value);
	this.bindClick();
	if(this.cfg.checked){
		this.input.attr('checked',true);
	}
	if(this.cfg.readOnly===true){
		this.readOnly(true);
	}
	if(this.cfg.disabled===true){
		this.disabled(true);
	}
	return this.input;
};
Gv.register('radio',Gv.form.Radio);
/*
普通
< input type = "radio" name = "radiobutton" value = "A" / > A . 拥有一套货一套以上< br / >
< input type = "radio" name = "radiobutton" value = "B" / > B . 还没有，不过计划要买< br / >
< input type = "radio" name = "radiobutton" value = "C" / > C. 有这个想法，不过 还没有< br / >

//新样式
<label class="input-control radio">
<input type="radio" name="time">
<span class="helper">及时发送</span>
</label>
*/


/** checkBox 组*/
Gv.form.CheckboxGroup=function(opt){
	this.cfg={
		id:'',
		width:'',
		height:40,
		type:'checkbox',
		readOnly:false,
		disabled:false,
		checkedArr:[],
		renderTo:'',
		items:[]
	};
	$.extend(true,this.cfg,opt);
	if(this.cfg.renderTo){
		Gv.get(this.cfg.renderTo).append(this.build());
	}
}
Gv.form.CheckboxGroup.prototype.build=function(){
	this.mainHtml();
	var num=this.cfg.items.length;
	for(var i=0;i<num;i++){
		var item=this.cfg.items[i],
		obj=null,tmp=null;
		if(item.constructor==Object){
			tmp=Gv.xtypeObject(this.cfg.type);
			obj=new tmp(item);
		}else{
		   obj=item;
		}
		for(var n=0;n<this.cfg.checkedArr.length;n++){
			var id=this.cfg.checkedArr[n];
			if(id==obj.getId()){
			 obj.checked();
			}
		}
		if(this.cfg.readOnly===true){
			obj.readOnly(true)
		}
		if(this.cfg.disabled===true){
			obj.disabled(true)
		}
		this.field.append(obj.build());

	}
	return this.field;
};
Gv.form.CheckboxGroup.prototype.mainHtml=function(){
	this.field=$('<span id="'+this.cfg.id+'" />').css({
		width:this.cfg.width,
		height:this.cfg.height,
		marginBottom:10
		});
	return this.field;
};
//params arr Array [{id:'id',value:''},{id:'id',value:''}..]
Gv.form.CheckboxGroup.prototype.value=function(arr){
	var result=[];
	if(!Gv.isEmpty(arr)){
		for(var i=0;i<arr.length;i++){
			var r=arr[i];
			check=Gv.get(this.cfg.id).find('input[id="'+r.id+'"]');
			if(r.value){
				check.attr('checked',true);
			}else{
				check.removeAttr('checked');
			}
		}
	}
	Gv.get(this.cfg.id).find('input[type="'+this.cfg.type+'"]').each(function(i){
		if($(this).attr('checked')=='checked'){
			result.push({
				id:$(this).attr('id'),
			 	value:$(this).val()
			});
		}
	  });
	return result;
};
Gv.form.CheckboxGroup.prototype.getChecked=function(){
	 var result=[];
	 Gv.get(this.cfg.id).find('input[type="'+this.cfg.type+'"]').each(function(i){
				   if($(this).attr('checked')=='checked'){
						result.push($(this).attr('id'));
				   }

	  });
	  return result;
};
Gv.form.CheckboxGroup.prototype.getId=function(){
	return this.cfg.id;
};


Gv.register('checkboxgroup',Gv.form.CheckboxGroup);
/** radio 组*/
Gv.form.RadioGroup=function(opt){
	var defualt={
		checkedId:'',
		type:'radio',
		defualtName:''

	};
	$.extend(true,defualt,opt);
	Gv.form.CheckboxGroup.call(this,defualt);
};
Gv.extend(Gv.form.RadioGroup,Gv.form.CheckboxGroup);

Gv.form.RadioGroup.prototype.build=function(){
	this.mainHtml();
	var num=this.cfg.items.length;
	for(var i=0;i<num;i++){
		var item=this.cfg.items[i],
		obj=null,tmp=null;
		if(item.constructor==Object){
			tmp=Gv.xtypeObject(this.cfg.type);
			item.name=this.cfg.defualtName;
			obj=new tmp(item);
		}else{
		  obj=item;
		}
		if(obj.getId()==this.cfg.checkedId){
			obj.checked();
		}
		if(this.cfg.readOnly===true){
			obj.readOnly(true)
		}
		if(this.cfg.disabled===true){
			obj.disabled(true)
		}
		this.field.append(obj.build());

	}
	return this.field;
};
//params {} obj  {id:'id',value:''}
Gv.form.RadioGroup.prototype.value=function(o){
	var result=[];
	if(!Gv.isEmpty(o) &&　!Gv.isEmpty(o.id)){
		Gv.get(this.cfg.id).find('input[id="'+o.id+'"]').val(o.value);
	}
	Gv.get(this.cfg.id).find('input[type="'+this.cfg.type+'"]').each(function(i){
		if($(this).attr('checked')=='checked'){
				   result.push({
							 id:$(this).attr('id'),
							 value:$(this).val()
							});
		}
	  });
	return result;
};
Gv.form.RadioGroup.prototype.getChecked=function(){
	var result='';
	Gv.get(this.cfg.id).find('input[type="'+this.cfg.type+'"]').each(function(i){
					if($(this).attr('checked')=='checked'){
						result=$(this).attr('id');
						return false;
				   }
	  });
	return result;
};

Gv.register('radiogroup',Gv.form.RadioGroup);
