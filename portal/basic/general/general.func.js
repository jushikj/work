function mySubmit() {
    var submit_enable = 1;
    for(var i in global_portal.component_validate) {
        if(! global_portal.component_validate[i]){
            submit_enable = 0;
        }
    }
    if (! submit_enable){
        Gv.msg.error({
            html : "作业提交失败,请检查作业调度参数是否完全符合要求！"
        });
        return false;
    }
    var patest = {
        "GAP_NNODES": Gv.get("portal-pbs-params-nnodes").val(),
        "GAP_PPN": Gv.get("portal-pbs-params-ppn").val(),
        "GAP_WALL_TIME": Gv.get("portal-pbs-params-time").val(),
        "GAP_QUEUE": Gv.get("portal-pbs-params-queue").val(),
        "GAP_NAME": Gv.get("portal-pbs-params-name").val(),

        "GAP_PROGRAM": "\'" + Gv.get("portal-pbs-params-program").val() + "\'",
        "GAP_WORK_DIR": "\'" + Gv.get("portal-pbs-params-workdir").val() + "\'",
        "GAP_OUTPUT": "\'" + Gv.get("portal-pbs-params-output").val() + "\'",

        "GAP_VNC": "\'" + Gv.get("portal-pbs-params-vnc").val()+"\'",

        "GAP_CKECK_POINT": "\'" + Gv.get("portal-pbs-params-checkpoint").val()+"\'",
        "GAP_INTERVAL": "\'" + Gv.get("portal-pbs-params-interval").val() + "\'",

        "GAP_PBS_OPT": "\'" + Gv.get("portal-pbs-params-pbsAdvOpt").val().replace(/\n/ig, '...') + "\'",
        "GAP_PRE_CMD": "\'" + Gv.get("portal-pbs-params-preCommands").val().replace(/\n/ig, '...') + "\'",
        "GAP_POST_CMD": "\'" + Gv.get("portal-pbs-params-postCommands").val().replace(/\n/ig, '...') + "\'"
    };
    $.ajax({
        url: "/jm_as/appsubmit/submitAppJob.action",
        type: 'post',
        data: {
            strJobManagerID: portal_strJobManagerID,
            strJobManagerAddr: portal_strJobManagerAddr,
            strJobManagerPort: portal_strJobManagerPort,
            strJobManagerType: portal_strJobManagerType,
            strAppType: portal_strAppType,
            strAppName: portal_strAppName,
            strOSUser: portal_strOsUser,
            strKeyWord: "k1;k2;;;;",
            strRemark: "remarktest",
            mapAppJobInfo: Gv.Obj2str(patest)
        },

        success: function(response, options) {
            if (response.exitVal == "0") {
                var jobInfoPanel_success = new Gv.Window({
                    id:'portal-pbs-job-info',
                    title:'Job Information',
                    width:200,
                    height:100,
                    html:"作业提交成功: "+response.stdOut,
                    tbar:[{
                        text:'确定',
                        handler:function(){
                            jobInfoPanel_success.close();
                        }
                    },{
                        text:'作业列表',
                        handler:function(){
	                    var cfg = {
	                        'id':'jmijm',
	                        'text':Gv.gvI18n('page_jmijm'),
	                        'closed':true,
	                        'load':'/jm_jobmanagement/jobmanagement/jobManagerView.action'
	                    };
	                    Gv.frameTabPanel.addTab(cfg);
                            jobInfoPanel_success.close();
                        }
                    }]
                });
            } else {
                Gv.msg.error({html:"作业提交失败: "+response.stdErr});
            }
            new_time_stamp = gen_time_identify_string();
            $("#portal-pbs-params-name").val(PORTALNAM+"_"+new_time_stamp);
            $("#portal-pbs-params-output").val(PORTALNAM+"_"+new_time_stamp+".txt");
        },

        failure: function(response, options) {
            Gv.msg.error({
                html: "请求作业提交失败!"
            });
        }
    });
}

function predefineSubmit() {
    
    var patest = {};
    for(var key in portal_predefine_list){
        var predefine_value = portal_predefine_list[eval("\""+key+"\"")];
        patest[predefine_value] = "\'" +Gv.get("portal-pbs-predefine-"+predefine_value).val() +"\'";
    }
    $.ajax( {
        url : "/jm_as/appsubmit/predefineAppJob.action",
        type:'post',
        data : {
            strJobManagerID : portal_strJobManagerID,
            strJobManagerAddr : portal_strJobManagerAddr,
            strJobManagerPort : portal_strJobManagerPort,
            strJobManagerType : portal_strJobManagerType,
            strAppType : portal_strAppType,
            strAppName : portal_strAppName,
            strOSUser : portal_strOsUser,
            strKeyWord : "k1;k2;;;;",
            strRemark : "remarktest",
            mapAppJobInfo :Gv.Obj2str(patest)
        },

        success : function(response,options) {
            if(response.exitVal == "0"){
                Gv.msgNote("参数预设成功,加载预设请刷新portal");
            } else {
                Gv.msg.error({html:"参数预设失败: "+response.stdErr});
            }
        },

        failure : function(response,options){
            Gv.msg.error({
                html : "请求参数预设失败!"
            });
        }
    });
}

function predefineClean() {
    
    var patest = {};
    $.ajax( {
        url : "/jm_as/appsubmit/predefineAppJob.action",
        type:'post',
        data : {
            strJobManagerID : portal_strJobManagerID,
            strJobManagerAddr : portal_strJobManagerAddr,
            strJobManagerPort : portal_strJobManagerPort,
            strJobManagerType : portal_strJobManagerType,
            strAppType : portal_strAppType,
            strAppName : portal_strAppName,
            strOSUser : portal_strOsUser,
            strKeyWord : "k1;k2;;;;",
            strRemark : "remarktest",
            mapAppJobInfo :Gv.Obj2str(patest)
        },

        success : function(response,options) {
            if(response.exitVal == "0"){
                Gv.msgNote("默认值还原成功,加载预设请刷新portal");
            } else {
                Gv.msg.error({html:"默认值还原失败失败: "+response.stdErr});
            }
        },

        failure : function(response,options){
            Gv.msg.error({
                html : "请求还原默认值失败!"
            });
        }
    });
}

function formReset() {
    var portal_reset_timestamp = gen_time_identify_string();
    $("#portal-pbs-params-nnodes").val(numnodes);
    $("#portal-pbs-params-ppn").val(numppn);
    $("#portal-pbs-params-time").val(hours + ":" + minutes + ":" + seconds);
    $("#portal-pbs-params-queue").val(queueJsonData[0].text);
    $("#portal-pbs-params-name").val(PORTALNAM + "_" + portal_reset_timestamp);
    $("#portal-pbs-params-program").val(program);
    $("#portal-pbs-params-workdir").val(userhome);
    $("#portal-pbs-params-output").val(PORTALNAM + "_" + portal_reset_timestamp + ".txt");
    for(var comp_id in global_portal.component_validate) {
        $("#"+comp_id).trigger("focusout");
    }
}

function formPredefine() {
    var formList = [];
    for(var key in portal_predefine_list){
        var predefine_value = portal_predefine_list[key];
        formList.push(new Gv.form.TextField({
            id: 'portal-pbs-predefine-'+predefine_value,
            name: 'portal_pbs_predefine_'+predefine_value,
            fieldLabel: key,
            value: eval(predefine_value),
            labelWidth: '200',
            width: '670',
            allowBlank: false,
            listeners: {
                focus: function (v) {},
                focusout: function (v) {
                }
            }
        }));
    }
    //创建formPanel放置上面的元素
    var predefineFormPanel = new Gv.form.FormPanel({
        layout: 'form',
        //单列形式form,双列形式column
        items: formList

    });
    //弹出预定义窗口
    var isContinue = true;
    var win = new Gv.Window({
        id:'win-page-troublesubmit-id',
        title: '参数预定义',
        width: 700,
        height: 300,
        items: [predefineFormPanel],
        bodyStyle: 'padding:10px;',
        listeners:{
            afterLayout:function(){
            }
        },
        tbar: [{
            text: '确定',
            handler: predefineSubmit
        }, {
            text: '还原默认值',
            handler: predefineClean

        },{
            text: '关闭',
            handler: function () {
                win.close();
            }
        }]
    });
}
