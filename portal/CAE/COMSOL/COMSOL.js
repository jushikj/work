var global_portal_comsol = {

  comsol_params:[],
  comsol_bin_data:[],

  buildComponents:function(){
    var o_Comsolbin = [];
    for(var i in s_ComsolBin){
      o_Comsolbin.push({id:s_ComsolBin[i],text:s_ComsolBin[i]});
    }
    this.comsol_bin_data=this.comsol_bin_data.concat(o_Comsolbin);
    // comsol bin
    comsol_bin = new Gv.form.ComboBox({
            renderTo: 'page-portal-comsol-bin',
            fieldLabel: '<font color="#FF0000">*</font>Comsol Bin',
            allowBlank:false,
            value: file,
            autoLoad:false,
            data:o_Comsolbin
        });
    this.comsol_bin=comsol_bin;
    this.comsol_params.push(comsol_bin);
    // browse...
    new Gv.Button({
            renderTo: 'page-portal-comsol-bin-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            o_Comsolbin.push({id:obj,text:obj});
                            comsol_bin.data(o_prog);
                            comsol_bin.value(obj);
                            comsol_bin.validate();
                            workdirRunFilePanel.close();
                        }
                    }, { 
                        text: '关闭',
                        handler: function() {
                            workdirRunFilePanel.close();
                        }
                    }]
                });
            }
        });

    // arguments
    comsol_arguments = new Gv.form.TextField({
            renderTo: 'page-portal-comsol-arguments',
            fieldLabel: 'Arguments',
            allowBlank: true
      });
    this.comsol_arguments=comsol_arguments;
    this.comsol_params.push(comsol_arguments);

    // work dir
    comsol_work_dir = new Gv.form.TextField({
            renderTo: 'page-portal-comsol-work-dir',
            fieldLabel: '<font color="#FF0000">*</font>Working DIR',
            allowBlank: false,
            value:workdir
      });
    this.comsol_work_dir=comsol_work_dir;
    this.comsol_params.push(comsol_work_dir);
    // browse...
    new Gv.Button({
            renderTo: 'page-portal-comsol-work-dir-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            comsol_work_dir.value(obj);
                            comsol_work_dir.validate();
                            workdirRunFilePanel.close();
                        }
                    }, {
                        text: '关闭',
                        handler: function() {
                            workdirRunFilePanel.close();
                        }
                    }]
                });
            }
      });

    //input mph
    comsol_input_mph = new Gv.form.TextField({
            renderTo: 'page-portal-comsol-input-mph',
            fieldLabel: 'Input Mph',
            allowBlank: true,
            value:input_mph
      });
    this.comsol_input_mph=comsol_input_mph;
    this.comsol_params.push(comsol_input_mph);
    // browse...
    new Gv.Button({
            renderTo: 'page-portal-comsol-input-mph-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            comsol_input_mph.value(obj);
                            comsol_input_mph.validate();
                            workdirRunFilePanel.close();
                        }
                    }, {
                        text: '关闭',
                        handler: function() {
                            workdirRunFilePanel.close();
                        }
                    }]
                });
            }
      });
    // output mph
    comsol_ouput_mph = new Gv.form.TextField({
            renderTo: 'page-portal-comsol-ouput-mph',
            fieldLabel: 'Output Mph',
            allowBlank: true,
            value:PORTALNAM + "_" + portal_time_stamp + '.mph'
      });
    this.comsol_ouput_mph=comsol_ouput_mph;
    this.comsol_params.push(comsol_ouput_mph);
    // output log
    comsol_output_log = new Gv.form.TextField({
            renderTo: 'page-portal-comsol-ouput-log',
            fieldLabel: 'Output Mph',
            allowBlank: false,
            value:PORTALNAM + "_" + portal_time_stamp + '.txt'
      });
    this.comsol_output_log=comsol_output_log;
    this.comsol_params.push(comsol_output_log);
  },
  bindEvents:function(){
    $("#job-Submission-do").bind('click',function(){
        var submit_enable = true;
        for(var i in global_portal.component_validate) {
            if(! global_portal.component_validate[i]){
            submit_enable = false;
            }
        }

        for(var i in global_portal_comsol.comsol_params){
            if(!global_portal_comsol.comsol_params[i].validate()){
                submit_enable=false;
            }
        }

        if(!submit_enable){
            Gv.msg.error({
              html : "作业提交失败,请检查作业调度参数是否完全符合要求！"
            });
            return false;
        }

        var patest = {
            //Job Schedule Parameters
            "GAP_NNODES": Gv.get("portal-pbs-params-nnodes").val(),
            "GAP_PPN": Gv.get("portal-pbs-params-ppn").val(),
            "GAP_WALL_TIME": Gv.get("portal-pbs-params-time").val(),
            "GAP_QUEUE": Gv.get("portal-pbs-params-queue").val(),
            "GAP_NAME": Gv.get("portal-pbs-params-name").val(),

            // run parameters
            "GAP_PROGRAM":"\'"+global_portal_comsol.comsol_bin.value()+"\'",
            "GAP_PROGRAM_ARG":"\'" +global_portal_comsol.comsol_arguments.value()+ "\'",
            "GAP_WORK_DIR":"\'" +global_portal_comsol.comsol_work_dir.value()+ "\'",
            "GAP_INPUT_MPH":"\'" +global_portal_comsol.comsol_input_mph.value()+ "\'",
            "GAP_OUTPUT_MPH":"\'" +global_portal_comsol.comsol_ouput_mph.value()+ "\'",
            "GAP_OUTPUT_LOG":"\'" +global_portal_comsol.comsol_output_log.value()+ "\'",

            //vnc
            "GAP_VNC":'0',
            //Checkpoint/Restart Parameters
            "GAP_CHECK_POINT": "\'" + Gv.get("portal-pbs-params-checkpoint").val()+"\'",
            "GAP_INTERVAL": "\'" + Gv.get("portal-pbs-params-interval").val() + "\'",
            //Advanced Parameters
            "GAP_PBS_OPT": "\'" + Gv.get("portal-pbs-params-pbsAdvOpt").val().replace(/\n/ig, '...') + "\'",
            "GAP_PRE_CMD": "\'" + Gv.get("portal-pbs-params-preCommands").val().replace(/\n/ig, '...') + "\'",
            "GAP_POST_CMD": "\'" + Gv.get("portal-pbs-params-postCommands").val().replace(/\n/ig, '...') + "\'"

        }
        //commit request
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
          },

          failure: function(response, options) {
            Gv.msg.error({
              html: "请求作业提交失败!"
            });
          }
        });
    });

    //RESET
    $("#job-Submission-preset").bind('click',function(){
        var portal_reset_timestamp = gen_time_identify_string();
        $("#portal-pbs-params-nnodes").val(numnodes);
        $("#portal-pbs-params-ppn").val(numppn);
        $("#portal-pbs-params-time").val(hours + ":" + minutes + ":" + seconds);
        $("#portal-pbs-params-queue").val(queueJsonData[0].text);
        $("#portal-pbs-params-name").val(PORTALNAM + "_" + portal_reset_timestamp);

        //run parameters
        global_portal_comsol.comsol_bin.data(global_portal_comsol.comsol_bin_data);
        global_portal_comsol.comsol_arguments.value('');
        global_portal_comsol.comsol_work_dir.value(workdir);
        global_portal_comsol.comsol_input_mph.value('');
        global_portal_comsol.comsol_ouput_mph.value(PORTALNAM+"_"+portal_reset_timestamp+".mph");
        global_portal_comsol.comsol_output_log.value(PORTALNAM+"_"+portal_reset_timestamp+".txt");

        //Checkpoint/Restart Parameters
          if($("#portal-pbs-params-checkpoint")[0]){
            $("#portal-pbs-params-checkpoint")[0].checked=false;
          }
          $("#portal-pbs-params-interval").val("240");

          //Advanced Parameters
          $("#portal-pbs-params-pbsAdvOpt").val('');
          $("#portal-pbs-params-preCommands").val('');
          $("#portal-pbs-params-postCommands").val('');

          //validate again
          for(var comp_id in global_portal.component_validate) {
            $("#"+comp_id).trigger("focusout");
          }

          for(var i in global_portal_comsol.comsol_params){
            global_portal_comsol.comsol_params[i].validate();
          }

    });

  },
  onready:function(){
    this.buildComponents();
    this.bindEvents();
  }

};

$(function(){
  global_portal_comsol.onready();
});