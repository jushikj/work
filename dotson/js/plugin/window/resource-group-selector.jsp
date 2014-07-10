<%@page import="com.dawning.gridview.common.session.application.sessionmanagement.export.util.LanguageUtil"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>分组选择器</title>
<style type="text/css">
</style>
<script type='text/javascript'>

$(function () {
    var msg = {


    };
    var tips = {
        refresh: Gv.gvI18n("page_refresh"),
        checkAll:Gv.gvI18n("page_check_all"),
        removeAll: Gv.gvI18n("page_emty_check")
    };
    //初始化


    function init() {
    	Gv.get('gv-plugin-res-grp-selector-focus').focus();
    	Gv.ResouceGroupSelecterActionHandler=save;
        //资产树
        Gv.get('gv-plugin-res-grp-selector-resTree-refresh').click(function () {
            refreshResTree();
        });
        Gv.get('gv-plugin-res-grp-selector-resTree-check').click(function () {
            checkAllResTree();
        });
        Gv.get('gv-plugin-res-grp-selector-resTree-empty').click(function () {
            removeAllCheckedResTree();
        });
        //选中资产
        Gv.get('gv-plugin-res-grp-selector-selectedRes-refresh').click(function () {
            refreshSelectedRes();
        });
        Gv.get('gv-plugin-res-grp-selector-selectedRes-check').click(function () {
            checkAllSelectedRes();
        });
        //关联关系资产List刷新
        Gv.get('gv-plugin-res-grp-selector-selectedRes-empty').click(function () {
            removeAllSelectedRes();
        });
        //关联关系资产List刷新
        Gv.get('gv-plugin-res-grp-selector-relatedRes-refresh').click(function () {
            refreshRelatedRes();
        });
       //选中已有关联关系资产
        Gv.get('gv-plugin-res-grp-selector-relatedRes-check').click(function () {
            checkAllRelatedRes();
        });
        //关联关系资产List 取消全部Checkbox
        Gv.get('gv-plugin-res-grp-selector-relatedRes-empty').click(function () {
            removeAllRelatedRes();
        });
        //组资产树刷新
        Gv.get('gv-plugin-res-grp-selector-groupTree-refresh').click(function () {
            refreshGroupTree();
        });
        //组资产树清空
        Gv.get('gv-plugin-res-grp-selector-groupTree-empty').click(function () {
            removeAllGroupTree();
        });
        //资产添加到关联关系
        Gv.get('gv-selector-arrow-right').click(function () {
        	selected2Related();
        });
        //从关联关系List中移除
        Gv.get('gv-selector-arrow-left').click(function () {
        	removeRelated();
        });
        //加载资产树
       createResTree();
        //加载组资产树
        createGroupTree();
    }
    //得到选中List的Jquery对象
    function getSelectedListCon(){
	    return Gv.get('gv-plugin-res-grp-selector-seleted-list');
    }

    //刷新资产树
    function refreshResTree() {
    	removeAllCheckedResTree();
    	var root=getResTree().getNodeByParam("id", "0", null);
    	getResTree().reAsyncChildNodes(root, "refresh",false);
    }
    //全选资产树
    function checkAllResTree() {
    	getResTree().checkAllNodes(true);
    	var data=getResTree().getCheckedNodes(true);
    	for(var i=0;i<data.length;i++){
            var d=data[i];
            showResTreeSelectedList(d);
    	}
    	//resTreenodeCheck();

    }
    //取消全部选项资产树
    function removeAllCheckedResTree() {
    	getResTree().checkAllNodes(false);
    	getSelectedListCon().html('');

    }

    //刷新选择的资产
    function refreshSelectedRes() {
    	var con=getSelectedListCon();
    	con.find('input[type="checkbox"]').each(function(){
    		if($(this).attr("checked")!='checked'){
    			$(this).parent().remove();
    		}
    	});
    }
    //全选选择的资产
    function checkAllSelectedRes() {
    	var con=getSelectedListCon();
    	con.find('input[type="checkbox"]').each(function(){
    		$(this).attr("checked",true)
    		var p=$(this).parent();
    		var nodeId=p.data('data').id;
    		var node=getResTree().getNodeByParam("id", nodeId, null);
    		    getResTree().checkNode(node, true, true,false);


    	});
    }
    //清空选择的资产
    function removeAllSelectedRes() {
    	var con=getSelectedListCon();
    	con.find('input[type="checkbox"]').each(function(){
    		$(this).removeAttr("checked");
    		var p=$(this).parent();
		    var 	nodeId=p.data('data').id;
		    	Gv.log('nodeId:'+nodeId)
		   var node=getResTree().getNodeByParam("id", nodeId, null);
		    	getResTree().checkNode(node, false, true,false);

    	});
    }
    function showResTreeSelectedList(d){
    	//如果是数组
    	if(Gv.isArr(d)){
    		if(Gv.isEmpty(d)){
    			removeAllCheckedResTree();
    			return null;
    		}
            for(var i=0;i<d.length;i++){
				var r=d[i];
				addSelectedListRow(r);
            }
    	}else{
    		//是单个节点
    		addSelectedListRow(d);
    	}
    }
    //增加选择list中单条记录
    function addSelectedListRow(d){
    	var con=getSelectedListCon();
    	if(d.isParent){//只添加节点
            return null;
 		}
    	if(Gv.dom(d.id+'-selected')){
    		if(d.checked){
    		   Gv.get(d.id+'-selected').attr('checked',d.checked);
    		}else{//如果checkbox是false就删除
    			Gv.get(d.id+'-selected').parent().remove();
    		}
    	}else{
    		if(!d.checked){//如果是个新选中的节点但是checkbox是false就不添加
                return null;
     		}
	 		var r=d,
	 		    chk=$('<input type="checkbox">').attr('id',d.id+'-selected').attr('checked',d.checked),
	 		    spn=$('<span />').text(d.name),
	 		    tmpDiv=$('<div class="gv-selector-row" />').append(chk).append(spn);
	 		tmpDiv.data('data',r);
	 		chk.click(function(){
	 			resSelectedListCheck(this);
	 		});
	 		con.append(tmpDiv);

    	}
    }
    //选中List中的Click事件
    function resSelectedListCheck(obj){
    	var flag=$(obj).attr('checked')=='checked'?true:false;
    	var p=$(obj).parent(),
		    nodeId=p.data('data').id,
		    node=getResTree().getNodeByParam("id", nodeId, null);
    	getResTree().checkNode(node, flag, true,false);
    }

    function resTreenodeCheck(event, treeId, treeNode){
    	getSelectedListCon().html('');
    	//var flag=true;
    	//将所有选中的节点进行添加
    	var checks=getResTree().getCheckedNodes(true);
    	showResTreeSelectedList(checks);
    	if(treeNode==null){
    		return null;
    	}
    	//对直接点击checkbox的节点进行添加
    	showResTreeSelectedList(treeNode);

    }

    function resTreenodeClick(event, treeId, treeNode){
    		var flag=treeNode.checked==false?true:false;
    		getResTree().checkNode(treeNode, flag, true);
    		//将所有选中的节点进行添加
        	var checks=getResTree().getCheckedNodes(true);
        	showResTreeSelectedList(checks);
    		//对直接点击checkbox的节点进行添加
        	showResTreeSelectedList(treeNode);

    }

    function resOnAsyncSuccess(event, treeId, treeNode, msg){
    	if(treeNode){
    		if(!Gv.isEmpty(treeNode.children)){
				//showResTreeSelectedList()
    		}
    	}

    	//Gv.log(msg)
    }

    //===================
    //得到关联关系List
    function getRelatedListCon(){
    	return Gv.get('gv-plugin-res-grp-selector-related-list');
    }
    //刷新选中的有关联关系资产
    function refreshRelatedRes() {
    	var con=getRelatedListCon();
    	con.find('input[type="checkbox"]').each(function(){
    		if($(this).attr("checked")!='checked'){
    			$(this).parent().remove();
    		}
    	});
    }
    //全选选中的有关联关系资产
    function checkAllRelatedRes() {
    	var con=getRelatedListCon();
    	con.find('input[type="checkbox"]').each(function(){
    		$(this).attr("checked",true)
    		//var p=$(this).parent(),
    		   // nodeId=p.data('data').id,
    		    //node=getGroupTree().getNodeByParam("id", nodeId, null);
    		   // getGroupTree().checkNode(node, true, true,false);


    	});
    }
    //清空选中的有关联关系资产
    function removeAllRelatedRes() {
    	var con=getRelatedListCon();
    	Gv.log(con)
    	con.find('input[type="checkbox"]').each(function(){
    		$(this).removeAttr("checked");
    		var p=$(this).parent();
		    var 	nodeId=p.data('data').id;
		    Gv.log('nodeId:'+nodeId)
		   // var	node=getGroupTree().getNodeByParam("id", nodeId, null);
          // getGroupTree().checkNode(node, false, true,false);

    	});
    }

    //刷新组资产树
    function refreshGroupTree() {
    	removeAllGroupTree();
    	var root=getGroupTree().getNodeByParam("id", "0", null);
    	getGroupTree().reAsyncChildNodes(root, "refresh",false);
    }
    //清空全部checkbox组资产树
    function removeAllGroupTree() {
    	var groupTree=getGroupTree();
      	var checks=groupTree.getCheckedNodes(true);
      	for(var i=0;i<checks.length;i++){
      		groupTree.checkNode(checks[i], false, null);
      	}
    	//getGroupTree().checkAllNodes(false);
    	getRelatedListCon().html('');

    }
    function showGroupTreeRelatedList(d){
    	if(Gv.isArr(d)){
    		//if(Gv.isEmpty(d)){
    		//	removeAllGroupTree();
    		//	return null;
    		//}
            for(var i=0;i<d.length;i++){
				var r=d[i];
				addRelatedListRow(r);
            }
    	}else{
    		addRelatedListRow(d);
    	}


    }

    //增加关系list中单条记录
    function addRelatedListRow(d){
    	var con=getRelatedListCon();
    	if(d.isParent){//只添加节点
            return null;
 		}
    	//如果存在表示已经在关联关系列表中了
    	if(Gv.dom(d.id+'-related')){
    		return false;
     	}
    	Gv.log('getRelatedListCon')
    	/**
    	if(Gv.dom(d.id+'-related')){
    		if(d.checked){
    		   Gv.get(d.id+'-related').attr('checked',d.checked);
    		}else{//如果checkbox是false就删除
    			Gv.get(d.id+'-related').parent().remove();
    		}
    	}else{
    		if(!d.checked){//如果是个新选中的节点但是checkbox是false就不添加
                return null;
     		}

	 		var r=d,
	 		    chk=$('<input type="checkbox">').attr('id',d.id+'-related').attr('checked',d.checked),
	 		    spn=$('<span />').text(d.name),
	 		    tmpDiv=$('<div class="gv-selector-row" />').append(chk).append(spn);
	 		tmpDiv.data('data',r);
	 		chk.click(function(){
	 			resRelateListCheck(this);
	 		});
	 		if(r.related===false){
	 			tmpDiv.addClass('gv-selector-norelated')
	 		}
	 		con.append(tmpDiv);

    	}*/
    	var r=d,
		    chk=$('<input type="checkbox">').attr('id',d.id+'-related').attr('checked',true),
		    spn=$('<span />').text(d.name),
		    tmpDiv=$('<div class="gv-selector-row" />').append(chk).append(spn);
		tmpDiv.data('data',r);
		chk.click(function(){
			resRelateListCheck(this);
		});
		if(r.related===false){
			tmpDiv.addClass('gv-selector-norelated')
		}
		con.append(tmpDiv);
    }
    //关联关系List中的Click事件
    function resRelateListCheck(obj){
    	var flag=$(obj).attr('checked')=='checked'?true:false;
    	var p=$(obj).parent(),
		    nodeId=p.data('data').id,
		    node=getGroupTree().getNodeByParam("id", nodeId, null);
    	    getGroupTree().checkNode(node, flag, true,false);

    }
    //组资产树选择前事件
    function groupTreenodeBeforeCheck(treeId, treeNode){
    	/*
    	var flag=treeNode.checked;
    	var isOpen = treeNode.open;
    	//没有选中同时也没有展开
    	if(!flag&&!isOpen){
    		getGroupTree().expandNode(treeNode,true);
    	}*/
    	Gv.log(treeId+'   '+ treeNode);
    	return true;

    }
    //组资产树选择事件
    function groupTreenodeCheck(event, treeId, treeNode){
    	//清空关联关系列表内容
    	getRelatedListCon().html('');
    	var flag=treeNode.checked;
    	Gv.log('groupTreenodeCheck'+flag)
    	var children=treeNode.children;
	    	if(!flag){//取消选中 清空列表
	    		var con=getRelatedListCon();
	    		con.html('');
	    	}else{
		    	if(Gv.isArr(children)){
		    	    showGroupTreeRelatedList(children);
		    	}
	    	}
    	//对直接点击checkbox的节点进行添加
    	//showGroupTreeRelatedList(treeNode);

    }
    //组资产树点击前事件
    function groupTreenodeBeforeClick(treeId, treeNode){

    }
    //组资产树点击事件
    function groupTreenodeClick(event, treeId, treeNode){
    	    //getRelatedListCon().html('');
    	    // var flag=treeNode.checked
    	    //getGroupTree().checkAllNodes(false);
    	    //treeNode.checked=flag;
    		//flag=treeNode.checked==false?true:false;
    		//getGroupTree().checkNode(treeNode, flag, true,false);
    		//将所有选中的节点进行添加
        	//var checks=getGroupTree().getCheckedNodes(true),
        	//    flag;
        	//showGroupTreeRelatedList(checks);
    		//对直接点击checkbox的节点进行添加
        	//showGroupTreeRelatedList(treeNode);
    }
    function groupDataFilter(treeId, parentNode, childNodes) {
    	//for(var i=0, l=childNodes.length; i<l; i++) {
		//	childNodes[i].checked = parentNode.checked;
		//	childNodes[i].checked = true;
		//}
    	if (childNodes) {
				for (var i=0, l=childNodes.length; i<l; i++) {
					var u = childNodes[i];
					if (u.id!=="0") {
						return null;
					}

				}

			}
		return childNodes;
	}
    function groupOnAsyncSuccess(event, treeId, treeNode, msg){
    	if(treeNode){
    		if(!Gv.isEmpty(treeNode.children)){
    			Gv.log('groupOnAsyncSuccess')
    		}
    	}
    }
    function createResTree() {
    	var setting = {
    	        callback: {
    	        	onCheck: resTreenodeCheck,
    	            onClick: resTreenodeClick,
    	            onAsyncSuccess: resOnAsyncSuccess,

    	        },
    	        check: {
    				enable: true
    			},
    	        async: {
    	            enable: true,
    	            url: Gv.resouceGroupSelecterUrl.resTreeUrl,
    	            autoParam: ["id"]
    	        }
    	    }
    	/*
    	Gv.resouceGroupSelecterUrl={
    	 		actionUrl:,
    	 		resTreeUrl:,
    	 		groupTreeUrl:
    	 	};*/

        $.fn.zTree.init($("#gv-plugin-res-grp-selector-resTree"), setting);


    }

    function createGroupTree() {
      var setting = {
    			callback: {
    				beforeCheck:groupTreenodeBeforeCheck,
    	        	onCheck: groupTreenodeCheck,
    	        	beforeClick:groupTreenodeBeforeClick,
    	            onClick: groupTreenodeClick,
    	            onAsyncSuccess: groupOnAsyncSuccess

    	        },
    			check: {
    				enable: true,
    				chkStyle: "radio"
    				//radioType: "all"
    			},
			async: {
				enable: true,
				url:Gv.resouceGroupSelecterUrl.groupTreeUrl,
				autoParam:["id"]
			    //dataFilter: groupDataFilter
			}
    	};
       $.fn.zTree.init($("#gv-plugin-res-grp-selector-groupTree"), setting);


    }
    //从选择资产List到关联关系List
    function selected2Related(){
    	var checks=getGroupTree().getCheckedNodes(true);
    	Gv.log(checks)
    	if(checks.length<1){//没有选中组
    		new Gv.msg.info({
    			html:Gv.gvI18n("page_select_group")
    		});
    		return false;
    	}
    	if(checks[0].id=='0'){//是根节点
    		new Gv.msg.info({
    			html:Gv.gvI18n('page_select_sub_resource')
    		});
    		return false;
    	}
    	var sCon=getSelectedListCon(),
    	    rCon=getRelatedListCon();
    	    sCon.find('input[type="checkbox"]').each(function(){
    		if($(this).attr("checked")=='checked'){
    			var r=$(this).parent().data('data'),
    				node=getResTree().getNodeByParam("id", r.id, null);
    			    node.related=false;
    			    showGroupTreeRelatedList(node);
    		   }
    	     });
    	    doAction('add');

    }
    //取消关联关系List
    function removeRelated(){
    	doAction('delete');
    	getRelatedListCon().find('input[type="checkbox"]').each(function(){
    		var r=$(this).parent().data('data'),
    		    node=getGroupTree().getNodeByParam("id", r.id, null);
    		    if(node!=null){
    		       getGroupTree().checkNode(node, false, true,false);
    		    }
    		    if($(this).attr("checked")=='checked'){
    		    	$(this).parent().remove();
        		}


    	});

    }
    //增加或减少，提交后台
    function doAction(type){
    	var con=type=='add'?getSelectedListCon():getRelatedListCon(),resArr=[];
    	con.find('input[type="checkbox"]').each(function(){
    		if($(this).attr("checked")=='checked'){
    			var r=$(this).parent().data('data');
    			resArr.push(r.id);
    		}
    	});
    	var chks=getGroupTree().getCheckedNodes(true),
	    maxPathNode=null;
		for(var i=0;i<chks.length;i++){
			if(chks[i].isParent){
	    		var  a=chks[i],
	    		     maxPathNode=a;
	    		maxPathNode=maxPathNode.path>a.path?maxPathNode:a;
			}
		}
		if($.isFunction(Gv.resouceGroupSelecterUrl.actionHandler)){
		    var groupId=maxPathNode?maxPathNode.id:'';
	   	    Gv.resouceGroupSelecterUrl.actionHandler(resArr,groupId,type);
	    }
    }
    //保存信息-暂时不用
    function save(){
    	var con=getRelatedListCon(),resArr=[];
    	con.find('input[type="checkbox"]').each(function(){
    		if($(this).attr("checked")=='checked'){
    			var r=$(this).parent().data('data');
    			resArr.push(r.id);
    		}
    	});
    	var chks=getGroupTree().getCheckedNodes(true),
    	    maxPathNode=null;
    	for(var i=0;i<chks.length;i++){
    		if(chks[i].isParent){
	    		var  a=chks[i],
	    		     maxPathNode=a;
	    		maxPathNode=maxPathNode.path>a.path?maxPathNode:a;
    		}
    	}
    	if($.isFunction(Gv.resouceGroupSelecterUrl.actionHandler)){
    	    var groupId=maxPathNode?maxPathNode.id:'';
       	    Gv.resouceGroupSelecterUrl.actionHandler(resArr,groupId);
        }
    }
    function getResTree(){
    	return getTree('gv-plugin-res-grp-selector-resTree');
    }
    function getGroupTree(){
    	return getTree('gv-plugin-res-grp-selector-groupTree');
    }
    function getTree(id) {
        return  $.fn.zTree.getZTreeObj(id);
    }
    init();
})
</script>
</head>

<body>
<div class="pd10 cl"  style="display: inline-block;">
	<div class="pd10 fl">
    	<div class="page-select-tree">
        	<div class="page-select-tree-title">
            	<h3><%=LanguageUtil.getText("page_asset_types_and_asset") %></h3>
            </div>
            <div class="page-select-tree-body cl">
            	<div class="page-select-tree-l">
                	<div class="side-tool">
                        <i class="icon-refresh" id="gv-plugin-res-grp-selector-resTree-refresh"></i>
                        <i class="icon-check" id="gv-plugin-res-grp-selector-resTree-check"></i>
                        <i class="icon-check-empty"  id="gv-plugin-res-grp-selector-resTree-empty"></i>
                    </div>
                    <div class="page-select-tree-con ztree" id="gv-plugin-res-grp-selector-resTree">

                    </div>
                </div>
                <div class="page-select-tree-r bdl">
                	<div class="side-tool">
                        <i class="icon-refresh"  id="gv-plugin-res-grp-selector-selectedRes-refresh"></i>
                        <i class="icon-check"  id="gv-plugin-res-grp-selector-selectedRes-check"></i>
                        <i class="icon-check-empty"  id="gv-plugin-res-grp-selector-selectedRes-empty"></i>
                    </div>
                    <div class="page-select-tree-con" id="gv-plugin-res-grp-selector-seleted-list">
					</div>
                </div>
            </div>
        </div>
    </div>
    <div class="pd10 fl">
    	<div class="page-select-tree-btn">
        	<button id='gv-selector-arrow-right'><i class="icon-circle-arrow-right"></i></button>
            <button id='gv-selector-arrow-left' ><i class="icon-circle-arrow-left"></i></button><!-- class="disabled" -->
        </div>
    </div>
    <div class="pd10 fl">
    	<div class="page-select-tree">
        	<div class="page-select-tree-title posi-right">
            	<h3><%=LanguageUtil.getText("page_group_and_association") %></h3>
            </div>
            <div class="page-select-tree-body cl">
                <div class="page-select-tree-r">
                	<div class="side-tool">
                        <i class="icon-refresh"   id="gv-plugin-res-grp-selector-relatedRes-refresh"></i>
                        <i class="icon-check"   id="gv-plugin-res-grp-selector-relatedRes-check"></i>
                        <i class="icon-check-empty"    id="gv-plugin-res-grp-selector-relatedRes-empty"></i>
                    </div>
                    <div class="page-select-tree-con" id='gv-plugin-res-grp-selector-related-list'>

                    </div>
                </div>
                <div class="page-select-tree-l bdl">
                	<div class="side-tool">
                		<i class="icon-refresh"   id="gv-plugin-res-grp-selector-groupTree-refresh"></i>
                		<i class="icon-check-empty"   id="gv-plugin-res-grp-selector-groupTree-empty"></i>
                    </div>
                	<div class="page-select-tree-con  ztree" id='gv-plugin-res-grp-selector-groupTree'>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
