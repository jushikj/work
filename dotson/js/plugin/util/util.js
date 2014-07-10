/**
 * 定时器
 */
Gv.util.TaskRunner = function () {
    var tasks = {},
        num = 0,
        //定时任务序号
        index = '1';
    //运行
    this.run = function (cfg, k) {
        //console.log(num+' '+k)
        if (cfg.repeat > 0) {
            if (num == cfg.repeat) {
                this.stop(cfg);
                return false;
            }
            num++;
        }
        var me = this;
        //console.log(tasks[k])
        tasks[k].time = setTimeout(function () {
            me.run(cfg, k)
        }, cfg.interval);
        cfg.run();
    };
    //开始
    this.start = function (cfg) {
        tasks[index] = {
            task: cfg,
            time: null
        };
        this.run(cfg, index);
        index += 1;
    };
    //停止
    this.stop = function (cfg) {
        for (var k in tasks) {
            if (tasks[k].task == cfg) {
                clearTimeout(tasks[k].time);
                delete tasks[k];
                break;
            }
        }
    };
};
/**
//创建一个任务
var task1 = {
    run : function(){
        console.log('1 test');
    },
    interval : 1000,
    repeat: 0
};
var task2 = {
    run : function(){
        console.log('2 test');
    },
    interval : 1000,
    repeat: 0
};
// 开始执行任务task1
var taskMgr=new Gv.util.TaskRunner();
    taskMgr.start(task1);
    taskMgr.start(task2);

taskMgr.stop(task1);
taskMgr.stop(task2);
*/

/**
 *cookies 的设置器
 */
Gv.util.cookier = {
		//获取Cookie
	    getCookie: function (cookieName) {
	        var cookieString = document.cookie,
	            start = cookieString.indexOf(cookieName + '=');
	        if (start == -1) { return null; };
	        start += cookieName.length + 1;
	        var end = cookieString.indexOf(';', start);
	        if (end == -1) {
	            return unescape(cookieString.substring(start));
	        };
	        return unescape(cookieString.substring(start, end));
	    },
	    //设置Cookie
	    setCookie: function (name, value) {
	        var expires = new Date();
	        expires.setTime(expires.getTime() + 12 * 30 * 24 * 60 * 60 * 1000);
	        document.cookie = name + '=' + value + ';expires=' + expires.toGMTString();
	    }
};
/**
 * 获取热图的单元格的宽度和高度
 *params  total int 总共多少个cell
 *dashboardW int   显示区域的宽度
 *dashboardH int   显示区域的高度
 */
Gv.util.heatmapWH=function(total,dashboardW,dashboardH){
	var minNodeWidth=12;
	//宽大于高，就按高计算单个节点的最大边长,否则相反
	var maxNodeWidth=dashboardW>dashboardH?dashboardH:dashboardW;
	//得到行数
    function getRowNum(total) {
        var tempNodeWidth =maxNodeWidth;
        var area =dashboardH * maxNodeWidth;
        //根据总面积/总数得到单个面积进行平方根处理，获得一个正方形的边长
        var squareW = Math.sqrt(area / total);
        ///正方形的边长大于最大边长，就是用最大边长
        squareW = squareW > maxNodeWidth ? maxNodeWidth : squareW;
        var rowNum = Math.floor(dashboardH / squareW);
        return rowNum;
    }
    //*得到每行最多个数（一定要在getRowNum之后才行）
    function getMaxColumnNum(total,rowNum) {
        return  Math.ceil(total/rowNum);
    }
  //根据总数得到显示总数
   function getDisplayTotal(total){
    	return total < 101 ? 100 : total;
    }
  //得到单个节点的边长
   function  getNodeWidth(total) {
        total=getDisplayTotal(total);
        var w =minNodeWidth;
        var rnum=getRowNum(total);
        var maxCol=getMaxColumnNum(total,rnum);
        if (total > 1) {
            //真实的节点宽度
            var realNodeW = dashboardW / maxCol;
            w = realNodeW - 1;
        } else {
            w = maxNodeWidth;
        }
        return w;
    }
   return getNodeWidth(total);
};
