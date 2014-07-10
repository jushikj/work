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


 */
Gv.chart.ChartPanel=function(opt){

	this.cfg={
		id:'',
		renderTo:'',
		width:'100%',
		height:'100%',
		xtype:'',
		xmlData:'',
		xmlUrl:''
	};
	this.fields={};
    this.cfg.id='chart-'+Gv.timeStamp()+'-'+Gv.randomStr(5);
	$.extend(true,this.cfg,opt);
	if(this.cfg.renderTo){
		//Gv.get(this.cfg.renderTo);
		this.build();
	}
};
Gv.chart.ChartPanel.prototype.build=function(){
	/*
	if (GALLERY_RENDERER && GALLERY_RENDERER.search(/javascript|flash/i)==0){

	}*/

        FusionCharts.setCurrentRenderer("javascript");
        var path=gv_main_contextPath+'/js/plugin/charts/gvcharts/Charts/'+this.cfg.xtype;
	var chart = new FusionCharts(
			path,
			this.cfg.id,this.cfg.width,
			this.cfg.height,
			'0','1');
    if(!Gv.isEmpty(this.cfg.xmlData)){
    	chart.setXMLData(this.cfg.xmlData);
    }else{
        Gv.ajax({
        	url:this.cfg.xmlUrl,
        	dataType:'text',
        	successFun:function(r){
        		chart.setXMLData(r);
        	}
        });
    }
    chart.render(this.cfg.renderTo);
};

