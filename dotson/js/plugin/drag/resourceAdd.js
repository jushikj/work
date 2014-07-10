/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};
var currentDevice = 't1';

// redips initialization
redips.init = function () {
    var blankDiv = '<div id="" class="drag placeholder" style="display:none" type="1u">blank</div>';
    var maxRowIndex = getDragTableRows().length - 1;
    // reference to the REDIPS.drag library
    var rd = REDIPS.drag;
    var isRemoveClone = false;
    //[0]表示rowIndex [1]表示colIndex
    var original = [];
    // initialization
    rd.init();
    // set hover color
    rd.hover.colorTd = '#9BB3DA';
    var msg = $('#message');
    // single element per cell
    rd.dropMode = 'single';
    // A and B elements can't be placed to other table cells (this is default value)
    rd.only.other = 'deny';
    //click 事件
    rd.event.clicked = function (e) {
        console.log('clicked')
        //记录原始位置
        removeStopAllClass();
        placeholder(getClickDeviceType());
        var pos = rd.getPosition();
        var clonedId = rd.obj.id;
        var clone = $('#' + clonedId);
        var rowIndex = pos[1];
        var colIndex = pos[2];
        console.log(getClickTabId())
        if(getClickTabId()=='table2'){
        	 //记录原始位置
        	  original[0]=pos[1];
        		original[1]=pos[2];
        }else{
        	original=[];
        }
       
        msg.text('新增机器位置: ' +'第'+ pos[1] + '行， 第' + pos[2]+'列' + clonedId);
        //var tar=$(e).children('div');
        //addAllStopClass();
        //removeStopAllClass();
        //修改样式
        //tar.addClass('orange');
        //$(e).parent().siblings().find('div').removeClass('orange');
    };
    rd.event.changed = function () {

        // get target and source position (method returns positions as array)
        var targetCell = rd.td.target;

        var pos = rd.getPosition();
        var rowIndex = pos[1];
        var colIndex = pos[2];
        msg.text('新增机器位置: ' +'第'+ pos[1] + '行， 第' + pos[2]+'列');
    };
    rd.event.dropped = function () {
       	var device=getClickDeviceJQ();
       	var targetCell=getTargetCell();
        var type =getClickDeviceType();
        if (targetCell.className) {
            device.remove();
        }
        console.log('changeCellsByType------' + type);
        if (!changeCellsByType(type, targetCell)) {
            console.log('changeCellsByType------');
            isRecover=true;
            device.remove();
        }
        
        refreshTable();
    };
    //删除
    rd.event.deleted = function (cloned) {
        // refreshTable();
    };
    // event handler invoked after element is cloned
    rd.event.cloned = function () {
        // set id of cloned element
        //var clonedId = rd.obj.id;
        //var divId=clonedId.substr(0, 2);
        // var type=$('#'+divId).attr('type');
    };
    //==============================

    function isEmptyCell(cell) {
        console.log('$(cell).children()')
        console.log($(cell).children().length)
        return $(cell).children().length > 0 ? false : true;
    }
    //判断一行中的单元格是否都为空，如果有一个不为空就返回false

    function isEmptyCellByRow(row) {
        var cells = row.cells;
        var f = true;
        for (var i = 0, num = cells.length; i < num; i++) {
            if ($(cells[i]).children()[0]) {
                f = false;
                break;
            }
        }
        return f;
    }
    //得到table2 的Dom
    function getDragTable() {
        return document.getElementById("table2");
    }

    function getDragTableRows() {
        return getDragTable().rows;
    }
    //清空一行所有单元格

    function emptyRowCells(row) {
        $(row).empty();
    }
    //将Table复原到初始状态（2个单元格 ，每个单元格是可以拖拽的,如果单元格有内容就不变 ）

    function refreshTable() {
        var rows = getDragTableRows();
        for (var i = 0, num = rows.length; i < num; i++) {
            var row = rows[i];
            var rowType = $(row).attr('type');
            var rowPrev = $(row).prev()[0];
            if (!isEmptyCellByRow(row)) {
                continue;
            }
            if (rowPrev && !isEmptyCellByRow(rowPrev) && rowType == '2u') {
                continue;
            }
            recoverRow(row);
            $(row).removeAttr('type');
        }
    }
    //将行复原到初始状态（2个单元格 ，每个单元格是可以拖拽的 ）

    function recoverRow(row) {
        emptyRowCells(row);
        for (var j = 0; j < 2; j++) {
            var cell = document.createElement("td");
            //cell.className='last';
            row.appendChild(cell);
        }
    }
    //合并单元格（每个单元格是可以拖拽的）

    function colSpan(row) {
        row.cells[0].colSpan = 2;
        row.cells[0].rowSpan = 1;
        //row.cells[0].className='last';
        if (row.cells[1]) {
            row.deleteCell(1);
        }

    }

    function removeStopAllClass() {
        $(getDragTable()).find('td').removeClass('mark');
    }

    function addAllStopClass() {
        $(getDragTable()).find('td').attr('class', 'mark');
    }
    //增加可拖动样式,根据类型1u 2u tw

    function addCellDragClsByType(type) {
        var rows = getDragTableRows();
        for (var i = 0, num = rows.length; i < num; i++) {
            if ($(rows[i]).attr('type') == type) {
                var cells = rows[i].cells;
                for (var j = 0, len = cells.length; j < len; j++) {
                    cells[j].className = 'last';
                }
            }
        }
    }
    //是否可以移动到目标位置上

    function isMoveTarget(type, targetCell) {
        var cellIndex = targetCell.cellIndex;
        var f = true;
        if ('1u' == type) {
            console.log('1u')
            if (cellIndex == 1) {
                f = false;
                console.log('1u cellIndex==1')
            }

        } else if ('2u' == type) {
            console.log('2u')
            if (cellIndex == 1) {
                f = false;
            }
            if (f) {
                var nextRow = $(targetCell).parent().next()[0];
                if (nextRow && isEmptyCellByRow(nextRow)) {} else {
                    f = false;
                }
            }
        } else if ('tw' == type) {

        }
        console.log('f ' + f);
        return f;
    }
    //占位
    function placeholder(type) {
        if (type == '1u') {
            eachTableRow(function (i, row) {
                //如果右边有东西，左边单元格也不能放
            	  if(row.cells[1]){
            	  	console.log(i)
            	  	if( $(row.cells[1]).children().length>0){
            	  		$(row.cells[0]).attr('class', 'mark');
            	  	}else{
            	  		$(row.cells[1]).attr('class', 'mark');
            	  	}
            	  
            	  }
            	  
               
            });
        }else if(type == '2u'){
        	 eachTableRow(function (i, row) {
        	 	    //如果右边有东西，左边单元格也不能放
                if(row.cells[1]){
            	  	if( $(row.cells[1]).children().length>0){
            	  		$(row.cells[0]).attr('class', 'mark');
            	  	}else{
            	  		$(row.cells[1]).attr('class', 'mark');
            	  	}
            	  }
            	  //最后一行不能放
            	  if(i===getMaxRowIndex()){
            	  	$(row).children().attr('class', 'mark');
            	  }
            	  var f=false;
            	  $(row).next().children('td').each(function(){
            	  	console.log(' $(row).next()')
            	  	if($(this).children().length>0){
            	  	   f=true;
            	  	   return 	false;
            	  	}
            	  	
            	  });
            	  //如果他的下一行单元格中也有东西
            	  if(f){
            	  	$(row).children().attr('class', 'mark');
            	  }
            });
        }

    }
    //改变单元格,根据类型1u 2u tw 
    //return boolean
    function changeCellsByType(type, targetCell) {
        var f = true;

        var cellIndex = targetCell.cellIndex;
        var row = $(targetCell).parent()[0];
        console.log('changeCellsByType ' + type + '  ')
        console.log(targetCell)
        console.log(row)
        if ('1u' == type) {
            console.log('1u')
            if (cellIndex == 1) {
                f = false;
                console.log('1u cellIndex==1')
            }

            if (f) {
                console.log('1u colSpan')
                colSpan(row);
            }
        } else if ('2u' == type) {
            console.log('2u')
            if (cellIndex == 1) {
                f = false;
            }
            if (f) {
                var nextRow = $(targetCell).parent().next()[0];
                console.log('2u  nextRow')
                console.log(nextRow)
                console.log('isEmptyCellByRow(nextRow) ' + isEmptyCellByRow(nextRow))
                if (nextRow && isEmptyCellByRow(nextRow)) {
                    colSpan(row);
                    emptyRowCells(nextRow);
                    row.cells[0].rowSpan = 2;
                    $(nextRow).attr('type', '2u');
                    console.log('----------------')
                } else {
                    f = false;
                }
            }
        } else if ('tw' == type) {

        }
        console.log('f ' + f);
        return f;
    }
    //遍历table每一行
    // fun(inndex,row)index是序号 row是单行html
    function eachTableRow(fun) {
        var rows = getDragTableRows();
        for (var i = 0, num = rows.length; i < num; i++) {
            var row = rows[i];
            fun(i, row);
        }

    }
    //得到当前点中设备的类型
    function getClickDeviceType() {
        return $('#' + getClickDeviceId()).attr('type');
    }
    //得到当前点中设备的Id
    function getClickDeviceId() {
        return rd.obj.id;
    }
    //得到当前点中设备的Jquery 对象
    function getClickDeviceJQ() {
        return $('#' + getClickDeviceId());
    }
    //得到当前点中设备的table
    function getClickTabId() {
        return getClickDeviceJQ().parent().parent().parent().parent().attr('id');
    }
    //得到目标单元格（有可能为undefined）
    function getTargetCell(){
    	return rd.td.target;
    	
    }
    //得到最大可见的行序号
    function getMaxRowIndex(){
    	var index=0;
    	$(getDragTable()).find('tr').each(function(i){
    		index=i;
    		return $(this).is(":visible");
    		
    	});
    	return index-1;
    	
    }
    //克隆副本
    function cloneCell(html) {
        return $(html).clone();

    }
   
};


// add onload event listener
if (window.addEventListener) {
    window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
    window.attachEvent('onload', redips.init);
}
$(function(){
	redips.init();
});