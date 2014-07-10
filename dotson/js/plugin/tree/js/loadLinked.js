if(typeof mochaGlobal == "undefined") mochaGlobal = new Object();
mochaGlobal.LoadLinked = function(path)
{
//加载路径
this.linkedPath = path;
//加载数组
this.linkedPathList = this.linkedPath.split(",");

//加载是否结束
this.loadStatus = false;
//当前加载下标
this.loadIndex = 0;
//本次加载最大次数
this.loadMaxSize = this.linkedPathList.length;
}
mochaGlobal.LoadLinked.prototype = {
getNextPath:function(){
if(this.loadIndex == this.loadMaxSize-1){
this.loadStatus = true;
}
if(this.loadStatus){
return this.linkedPathList[this.loadIndex];
}else{
return this.linkedPathList[this.loadIndex++];
}
}
,
getLoaclPathIndex:function(){return this.loadIndex;}

};
var LoadLinked = mochaGlobal.LoadLinked;