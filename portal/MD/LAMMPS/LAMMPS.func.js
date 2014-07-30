/*!
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * 从/opt/gridview/software/下载指定名称的软件
 *
 * @param {}
 *            softwareName
 */
/*

/** 提交函数 */
function mySubmit()
{
	if (!Ext.getCmp("simple").getForm().isValid())
		Ext.MessageBox.alert('提醒', '对不起，您提交的信息有误！', "");
	else if (Ext.getCmp("nnodes").getValue() * Ext.getCmp("ppn").getValue() * (Ext.getCmp("hours").getValue()*3600 + Ext.getCmp("minutes").getValue()*60 + Ext.getCmp("seconds").getValue()) > dUserCqSec)
		Ext.MessageBox.alert('提醒', '对不起，您申请的机时资源超过配额，请减少Walltime的值！', "");
	else
		Ext.Ajax.request( {
			url : "/jm_as/appsubmit/submitAppJob.action",
			// method:"post",
			scope : this,
			// waitMsg:"查询中,请稍后！",
			params : {
				strJobManagerID : portal_strJobManagerID,
				strJobManagerAddr : portal_strJobManagerAddr,
				strJobManagerPort : portal_strJobManagerPort,
				strJobManagerType : portal_strJobManagerType,
				strAppType : portal_strAppType,
				strAppName : portal_strAppName,
				strOSUser : portal_strOsUser,
				strKeyWord : "k1;k2;;;;",
				strRemark : "remarktest",
				mapAppJobInfo : Ext.util.JSON.encode( {
					"GAP_NNODES"       : Ext.getCmp("nnodes").getValue(),
					"GAP_PPN"          : Ext.getCmp("ppn").getValue(),
					"GAP_WALL_TIME"    : Ext.getCmp("hours").getValue()+ ":" + Ext.getCmp("minutes").getValue()+ ":" + Ext.getCmp("seconds").getValue(),
					"GAP_QUEUE"        : Ext.getCmp("queue").getValue(),
					"GAP_NAME"         : Ext.getCmp("name").getValue(),
					"GAP_MPI_TYPE"     : Ext.getCmp("mpitype").getValue(),
					"GAP_REMOTE_SHELL" : getRemoteSh(),
					"GAP_COMMUCATION"  : getNetwork(),
					"GAP_SHARE_MEMORY" : Ext.getCmp('memory').getValue(),
					"GAP_CPU_BINDING"  : Ext.getCmp('cpuBind').getValue(),
					"GAP_PROGRAM"      : "\'"+Ext.getCmp("program").getValue()+"\'",
					"GAP_PROGRAM_ARG"  : "\'"+Ext.getCmp("programarg").getValue()+"\'",
					"GAP_WORK_DIR"     : "\'"+Ext.getCmp("workdir").getValue()+"\'",
					"GAP_INPUT"        : "\'"+Ext.getCmp("inputFile").getValue()+"\'",
					"GAP_OUTPUT"       : Ext.getCmp("output").getValue(),
					"GAP_VNC"          : Ext.getCmp('IsVNC').getValue(),

					"GAP_CKECK_POINT"  : Ext.getCmp('checkpoint').getValue(),
					"GAP_INTERVAL"     : Ext.getCmp('interval').getValue(),

					"GAP_MPI_OPT"      : "\'" + Ext.getCmp("mpiAdvOpt").getValue() + "\'",
					"GAP_PBS_OPT"      : "\'" + Ext.getCmp("pbsAdvOpt").getValue().replace(/\n/ig,'...') + "\'",
					"GAP_PRE_CMD"      : "\'" + Ext.getCmp("preCommands").getValue().replace(/\n/ig,'...') + "\'",
					"GAP_POST_CMD"     : "\'" + Ext.getCmp("postCommands").getValue().replace(/\n/ig,'...') + "\'"
				})
			},

			success : function(response,options){
						try
						{
							var result = Ext.util.JSON.decode(response.responseText);
							if (result.exitVal == 0)
							{
								var resultStr = "Job submitted successfully！<br/><br/>Job ID："+ result.stdOut;
								Ext.MessageBox.show
								({
									title : "Success",
									msg : resultStr,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								});
								var currDate = new Date();
								var timeStamp = currDate.format('md_His');
								Ext.getCmp("name").setValue(name + '_' + timeStamp);
								Ext.getCmp("output").setValue( output + '_' + timeStamp + '.txt' );
							}
							else
							{
								var resultStr = "Job submitting failed！<br/><br/>"+ result.stdOut + "<br/><br/>"+ result.stdErr;
								Ext.MessageBox.show({
									title : "Error",
									msg : resultStr,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
                            }
						}
						catch(e){}
			},

			failure : function(response,options){
						var resultStr = "表单提交失败！";
						Ext.MessageBox.show({
							title : "Error",
							msg : resultStr,
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
}

function runtypeRelateRefresh()
{
	var network_status;
	var checkpoint_status;
	if (( ib_available == '1' ) && (Ext.getCmp("ib").getValue() == true))
		network_status='ib';
	else
		network_status='tcp';
	if (( checkpoint_available == '1' ) && (Ext.getCmp("checkpoint").getValue() == true))
		checkpoint_status='1';
            	
	if (Ext.getCmp("mpitype").getValue() == 'mpich2')
	{
		setNetwork(0,'tcp');
		setCR('0','0',interval);
	}
	else if(Ext.getCmp("mpitype").getValue() == 'cr_mpi')
	{
		setNetwork(ib_available,network_status);
		setCR(checkpoint_available,checkpoint,interval);
	}
	else
	{
		setNetwork(ib_available,network_status);
		setCR('0','0',interval);
	}
}

/*** 页面初始化和页面重置***/  
function formAllReset()
{
	var currDate = new Date();
	var timeStamp = currDate.format('md_His');
            
	var name2 = name + '_' + timeStamp;
	setJobSch(numnodes,numppn,hours,minutes,seconds,queSelected,name2);
	queueRelateRefresh();
 
	var output2 =output + '_' + timeStamp + '.txt';
	setRunCommon(program,workdir,output2);
	Ext.getCmp("mpitype").setValue(mpitype);
	Ext.getCmp("remoteShell").setValue(remoteshell);
	setNetwork(ib_available,network);
	Ext.getCmp("programarg").setValue(programarg);                
	Ext.getCmp("inputFile").setValue("");
	if (sharemem == "1" )
	{
		Ext.getCmp("memory").setValue(true);
	}
	else
	{
		Ext.getCmp("memory").setValue(false);
	}            		                       
	if (cpubind == "1" )
	{
		Ext.getCmp("cpuBind").setValue(true);
	}
	else
	{
		Ext.getCmp("cpuBind").setValue(false);
	}

	setVnc(vnc_available,vnc); 
	setCR(checkpoint_available,checkpoint_def,interval_def);
            
	setAdv1("","","","");
            
	mpiRelateRefresh();

	if (clusquota_available == 1) cquotaBarRefresh();
}

/*** 页面动态更新***/   
        
function formRefresh()
{
	Ext.getCmp("nnodes").on("change", function(){
		//jobScriptRefresh();
		if(clusquota_available == 1) cquotaBarRefresh();
	});

	Ext.getCmp("ppn").on("change", function(){
		//jobScriptRefresh();
		maxNNodes=totQueNodes;        //total nodes in queue, value defined by last queueRelateRefresh()
		if (maxQueNodes != 'unlimit') //max nodes allowed
		{
			if (maxNNodes > maxQueNodes) maxNNodes=maxQueNodes;
		}

		if (maxQueCores != 'unlimit') //max cores allowed
		{
			tmpNNodes=maxQueCores / Ext.getCmp("ppn").getValue();
			if (maxNNodes > tmpNNodes) maxNNodes=tmpNNodes;
		}

		Ext.getCmp("nnodes").setMaxValue(maxNNodes);
		if (clusquota_available == 1) cquotaBarRefresh();
	});

	Ext.getCmp("hours").on("change", function() {
		if (clusquota_available == 1) cquotaBarRefresh();
	});

	Ext.getCmp("checkpoint").on('check', function(){
		if (Ext.getCmp("checkpoint").getValue() == false)
		{
			Ext.getCmp("interval").disable();
		}
		else
		{
			Ext.getCmp("interval").enable();
		}
	});

	Ext.getCmp("mpitype").on('select', function() {
		mpiRelateRefresh();
	});

	Ext.getCmp("queue").on('select', function() {
		queueRelateRefresh();
		if (clusquota_available == 1) cquotaBarRefresh();
	});
           	
}