/**
 * Panel
 * author LLJ
 */
Gv.Panel=function(opt){
	this.cfg={
		width:'100%',
		height:'100%',
		//布局类型默认是Table，还有column类型
		layout:'table',
		layoutConfig:{//将父容器分成3列
			//10列
			columns:10,
			//10行
			rows:10
		},
		listeners:{
			afterLayout:null
		},
		html:'',
		items:[],
		};
	$.extend(true,this.cfg,opt);
	if(this.cfg.renderTo){
		Gv.get(this.cfg.renderTo).append(this.build());
		this.doLayout();
	}


};
Gv.Panel.prototype.build=function(){
	if(this.cfg.html){
		return this.cfg.html;
	}else{
		var content=this.cfg.layout=='table'?this.layoutTable():this.layoutColumn();
		Gv.get(this.cfg.renderTo).width(this.cfg.width).height(this.cfg.height);
		return content;
	}
};
Gv.Panel.prototype.doLayout=function(){
	Gv.elementLayout();
	if($.isFunction(this.cfg.listeners.afterLayout)){
		this.cfg.listeners.afterLayout();
	}
};
//table 布局
Gv.Panel.prototype.layoutTable=function(){
	//<div class="gv-col" cols="10" rows="10">
	var num=this.cfg.items.length,
	tab=$('<div />').addClass('gv-col').attr('cols',this.cfg.layoutConfig.columns).attr('rows',this.cfg.layoutConfig.rows);
	for(var i=0;i<num;i++){
		var rec=this.cfg.items[i];
		tab.append(this.createCell(rec));
	}
	return tab;
};
//column 布局
Gv.Panel.prototype.layoutColumn=function(){
	//<div class="gv-col" cols="10" rows="10">
	var num=this.cfg.items.length,
	tab=$('<div />').addClass('gv-col').attr('cols',this.cfg.layoutConfig.columns).attr('rows',this.cfg.layoutConfig.rows);
	for(var i=0;i<num;i++){
		var rec=this.cfg.items[i];
		var column=$('<div />').addClass('gv-col').css({display:'inline-block'});
		if(rec.columnWidth){
			column.attr('col',rec.columnWidth);
			column.attr('row',this.cfg.layoutConfig.rows);
		}
		if(rec.width){
			//column.width(rec.width);
			column.attr('wpx',rec.width);
		}
		if(rec.height){
			//column.height(rec.height);
			column.attr('hpx',rec.height);
		}
	   var content=$('<div />').addClass('gv-col').attr('cols',1).attr('rows',this.cfg.layoutConfig.rows);
		for(var n=0;n<rec.items.length;n++){
			var r=rec.items[n];
			if(r.xtype=='panel'){
				content.append(this.createCell(r));
			}
		}
		column.append(content);
		tab.append(column);
	}
	return tab;
};
Gv.Panel.prototype.createCell=function(item){
	    var cell=$('<div />').addClass('gv-row'),
	     cls=item.colspan?item.colspan:1,
		rws=item.rowspan?item.rowspan:1;
		cell.attr('col',cls);
		cell.attr('row',rws);
		if(item.width){
			//cell.width(item.width);
			cell.attr('wpx',item.width);
		}
		if(item.height){
			//cell.height(item.height);
			cell.attr('hpx',item.height);
		}
		var border=$('<div />').addClass('bdrb'),
		    title=null,
		content=$('<div attr="content" />').addClass('mgn5').html(item.html).appendTo(border);
		if(item.title){
			title=$('<div attr="title" />').text(item.title).css({
				height:30,
				lineHeight:'30px',
				display: 'block',
			    overflow: 'hidden',
			    textOverflow: 'ellipsis',
			    paddingLeft:'20px',
			    whiteSpace: 'nowrap'
			})
			content.before(title);
		}
		if(item.load){
			content.load(item.load);
		}
        if(!Gv.isEmpty(item.items)){
        	content.append(item.items[0].build());
        }
		cell.append(border);
	return cell;
};
Gv.register('panel',Gv.Panel);
/**
 UserGroupPanel
 		id:'',
		title:'',
		data:[],
		addUserHandler:null, //增加用户
		modifyUserHandler:null, //修改用户
		removeUserHandler:null, //删除用户
		removeGroupHandler:null 参数 groupName //删除用户组
*/
Gv.UserGroupPanel=function(opt){
	this.cfg={
		id:'',
		title:'',
		data:[],
		url:'',
		addUserHandler:null,
		modifyUserHandler:null,
		removeUserHandler:null,
		removeGroupHandler:null
	};
	this.cfg.id=Gv.timeStamp()+'-'+Gv.randomStr(7);
	$.extend(true,this.cfg,opt);
        if(this.cfg.renderTo){
            Gv.get(this.cfg.renderTo).append(this.build())
        }
        if(this.cfg.url){
           this.load(this.cfg);
        }
        if(this.cfg.data){
           this.display(this.cfg.data)
        }


};

Gv.UserGroupPanel.prototype.build=function(){
	  this.mainHtml().append(this.titleHtml()).append(this.contentHtml());
	  return this.mainHtml;
};

Gv.UserGroupPanel.prototype.mainHtml=function(){
	 this.mainHtml=$('<div class="os-group fl" />');
	 return  this.mainHtml;
};
Gv.UserGroupPanel.prototype.titleHtml=function(){
	this.title=$('<div class="os-group-title">');
	var self=this,
	     text=$('<h2 />').text(this.cfg.title),
	     addBtn=$('<a class="os-group-set os-group-adduser" title="'+Gv.gvI18n('page_plugin_add_user')+'" href="#">'),
	     rmBtn=$('<a class="os-group-set os-delete" title="'+Gv.gvI18n('page_plugin_del_grp')+'" href="#">');
	     addBtn.append('<i class="icon-plus"></i>').click(function(){
	     	self.addUser();
	     });
	     rmBtn.append('<i class="icon-remove"></i>').click(function(){
	     	self.removeGroup();
	     });
	this.title.append(addBtn).append(text).append(rmBtn);
	return this.title;

};
/*add user  hanlder*/
Gv.UserGroupPanel.prototype.addUser=function(){
	 if($.isFunction(this.cfg.addUserHandler)){
	 	 this.cfg.addUserHandler(this.cfg.id);
	 }
};
/*remove group  hanlder*/
Gv.UserGroupPanel.prototype.removeGroup=function(){
	 if($.isFunction(this.cfg.removeGroupHandler)){
	 	 this.cfg.removeGroupHandler(this.cfg.id);
	 }
};
/*modify user hanlder*/
Gv.UserGroupPanel.prototype.modifyUser=function(rec){
	 if($.isFunction(this.cfg.modifyUserHandler)){
	 	 this.cfg.modifyUserHandler(rec);
	 }
};
/*remove user  hanlder*/
Gv.UserGroupPanel.prototype.removeUser=function(id){
	 if($.isFunction(this.cfg.removeUserHandler)){
	 	 this.cfg.removeUserHandler(id);
	 }
};
/*全部用户的HTMl*/
Gv.UserGroupPanel.prototype.contentHtml=function(name,path){
	 this.contentHtml=$('<div class="os-group-con" />');
	 this.contentHtml;
	 return this.contentHtml;
};
/*单个用户HTMl*/
Gv.UserGroupPanel.prototype.userHtml=function(rec){
	 var userHtml=$('<div class="os-user cl" id="'+rec.strUserId+'" />');
	       userHtml.append( this.removeUserHtml(rec.strUserName))
	       .append( this.userNameHtml(rec.strUserName,rec.strHomePath))
	       .append( this.userMenuHtml(rec)).hover(function(){
				$(this).css("background","#E7F7FC");
			},function(){
				$(this).css("background","#FFF");
			});
	 return userHtml;
};
Gv.UserGroupPanel.prototype.removeUserHtml=function(name){
	var self=this,
	     con=$('<div class="os-user-delete none fl" />'),
	     btn=$('<a title="'+Gv.gvI18n('page_plugin_del')+'" href="#" />').html('<i class="icon-minus-sign" />');
	     btn.click(function(){

	     	self.removeUser(name);

	     });
	     con.append(btn);
	 return con;
};
Gv.UserGroupPanel.prototype.modifyUserHtml=function(){
	var self=this,
	     btn=$('  <a class="os-editor test" title="'+Gv.gvI18n('page_plugin_edit')+'" href="#" style="display: none;" />').html('<i class="icon-pencil" />');
	     btn.click(function(){
	     	var rec=$(this).parent().data('data');
	     	self.modifyUser(rec);
	     });
	 return btn;
};

Gv.UserGroupPanel.prototype.saveUserHtml=function(){
	var self=this,
	     btn=$('<a class="os-ture" title="'+Gv.gvI18n('page_plugin_save')+'" href="#" style="display: none;" />').html('<i class="icon-ok" />');
	     btn.click(function(){
	     	$(this).parent().parent().find(".os-user-delete").hide(100);
			$(this).parent().find(".os-editor").hide();
			$(this).parent().find(".os-ture").hide();
			$(this).parent().find(".os-set").show();
	     });
	 return btn;
};
Gv.UserGroupPanel.prototype.setUserHtml=function(){
	var self=this,
	     btn=$('<a class="os-set" title="'+Gv.gvI18n('page_plugin_set')+'" href="#" style="display: block;" />').html('<i class="icon-cog" />');
	     btn.click(function(){
			$(this).parent().parent().find(".os-user-delete").show(100);
			$(this).parent().find(".os-editor").show();
			$(this).parent().find(".os-ture").show();
			$(this).parent().find(".os-set").hide();
	     });
	 return btn;
};
Gv.UserGroupPanel.prototype.userMenuHtml=function(rec){
	var self=this,
	     con=$('<div class="os-user-menu fr" />');
	     con.append(this.modifyUserHtml()).append(this.saveUserHtml()).append(this.setUserHtml());
	     con.data('data',rec);
	 return con;
};
Gv.UserGroupPanel.prototype.userNameHtml=function(name,path){
	var self=this,
	     con=$('<div class="os-user-con fl"  style="width:70px;overflow:hidden;" />'),
	     name=$('<h5 title="'+name+'" style="text-overflow:ellipsis;white-space:nowrap;width:70px;overflow:hidden;" />').text(name),
	     path=$('<p  title="'+path+'" style="text-overflow:ellipsis;white-space:nowrap;width:70px;overflow:hidden;" />').html(path);
	     con.append(name).append(path);
	 return con;
};
Gv.UserGroupPanel.prototype.load=function(arg){
	var defualt={
	    url:this.cfg.url,
	    params:{},
	    successFun:null
	},
	     self=this;
	$.extend(true,defualt,arg)
     Gv.ajax({
     	url:defualt.url,
     	data:defualt.params,
     	successFun:function(r){
     		self.display(r)
     		if($.isFunction(defualt.successFun)){
     		    defualt.successFun(r);
     		}
     	}

     });
};
Gv.UserGroupPanel.prototype.display=function(d){
	if(Gv.isEmpty(d)){
		this.contentHtml.html('');
	}else{
		for(var i=0; i<d.length;i++){
			var rec=d[i],
			      user=this.userHtml(rec);
			this.contentHtml.append(user);
		}
	}
};