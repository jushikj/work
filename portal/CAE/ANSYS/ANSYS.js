﻿var global_jobscheduler_portal_ansys = {

  ansys_components:[], //store component that need to be validate
  ansys_runp_components:[],//run parameters components
  ansys_bin_data:[],

  controlRunParameters:function(){
    $('#page-portal-ansys-run-parameters-group').removeClass('active');
    $('#page-portal-ansys-run-parameters-group i').attr('class','icon-chevron-sign-down');
    //clear run parameters value and disable it,then close
    for(var i in global_jobscheduler_portal_ansys.ansys_runp_components){
        var o = global_jobscheduler_portal_ansys.ansys_runp_components[i];
        if($.isFunction(o.value)){
            o.value('');
        }
        $("#page-portal-ansys-input-type-inp")[0].checked=true;
        if($("#"+global_jobscheduler_portal_ansys.ansys_use_custom.getId())[0].checked){
            $("#"+global_jobscheduler_portal_ansys.ansys_use_custom.getId())[0].checked=false;
        }
        //$("#page-portal-ansys-hpc-run-smp")[0].checked=true;
        if($.isFunction(o.removeError)){
            o.removeError();
        }
        if($.isFunction(o.removeErrorTips)){
            o.removeErrorTips();
        }
        o.disabled(true);

    }
  },

  buildEnvPComponent:function(){
    //build Environment Parameters Components
    //run mode
    ansys_run_mode = new Gv.form.Checkbox({
      renderTo:'page-portal-ansys-run-mode',
      fieldLabel:'Window',
      checked:true,
      handler:function(d,v){
        if($('#'+ansys_run_mode.getId())[0].checked){
          
          global_jobscheduler_portal_ansys.controlRunParameters();
          
        }else {
          $('#page-portal-ansys-run-parameters-group').addClass('active');
          $('#page-portal-ansys-run-parameters-group i').attr('class','icon-chevron-sign-up');
          for(var i in global_jobscheduler_portal_ansys.ansys_runp_components){
            var o = global_jobscheduler_portal_ansys.ansys_runp_components[i];
            o.disabled(false);
          }
          global_jobscheduler_portal_ansys.ansys_database_input.disabled(true);
          global_jobscheduler_portal_ansys.ansys_total_workspace_input.disabled(true);
        };
      }
    });
    global_jobscheduler_portal_ansys.ansys_run_mode=ansys_run_mode;

    //Parallel Mode(hpc run)
    ansys_hpc_run_radio=new Gv.form.RadioGroup({
            id:'page-portal-ansys-hpc-run-radio',
            renderTo: 'page-portal-ansys-hpc-run',
            defualtName: 'hpcrun',
            items: [{
                id: 'page-portal-ansys-hpc-run-mpp',
                value: 'dmp',
                fieldLabel: 'MPP'
            }, {
                id: 'page-portal-ansys-hpc-run-smp',
                value: 'smp',
                fieldLabel: 'SMP',
                checked:true
            }]
    });
    this.ansys_hpc_run_radio = ansys_hpc_run_radio;

    //bind click event
    $("#"+ansys_hpc_run_radio.getId()+" input").bind('click',function(){
        if(this.value=='dmp'){
            ansys_mpi_type_select.disabled(false);
        } else {
            ansys_mpi_type_select.disabled(true);
        }
    });


    //ansys bin
    var o_mpiProg = [];
    if(!Gv.isEmpty(s_mpiProg)){
        for(var i in s_mpiProg){
          if(!Gv.isEmpty(s_mpiProg[i])){
            o_mpiProg.push({id:s_mpiProg[i],text:s_mpiProg[i]});
          }
        }
    }
    global_jobscheduler_portal_ansys.ansys_bin_data=global_jobscheduler_portal_ansys.ansys_bin_data.concat(o_mpiProg);
    ansys_ansys_bin_input=new Gv.form.ComboBox({
            renderTo: 'page-portal-ansys-bin',
            fieldLabel: '<font color="#FF0000">*</font>ANSYS Bin',
            allowBlank:false,
            value: file,
            autoLoad:false,
            data:o_mpiProg
        });
    this.ansys_ansys_bin_input=ansys_ansys_bin_input;
    this.ansys_components.push(ansys_ansys_bin_input);
    //ansys bin browse...
    new Gv.Button({
            renderTo: 'page-portal-ansys-bin-select-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: ansys_ansys_bin_input.value(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            o_mpiProg.push({id:obj,text:obj});
                            ansys_ansys_bin_input.data(o_mpiProg);
                            ansys_ansys_bin_input.value(obj);
                            ansys_ansys_bin_input.validate();
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
    //mpi type
    var o_mpi=[];
    if(!Gv.isEmpty(s_mpilist)){
        for(var i in s_mpilist){
            o_mpi.push({id:s_mpilist[i],text:s_mpilist[i]});
        }
    }
    ansys_mpi_type_select = new Gv.form.ComboBox({
        renderTo: 'page-portal-ansys-mpi-type',
        fieldLabel: '<font color="#FF0000">*</font>MPI Type',
        readOnly: false,
        allowBlank:false,
        //width: 540,
        value: mpi_def,
        autoLoad:false,
        data:o_mpi,
        disabled:true
    });
    this.ansys_mpi_type_select=ansys_mpi_type_select;
    this.ansys_components.push(ansys_mpi_type_select);
    //remote shell
    ansys_remote_shell_radio=new Gv.form.RadioGroup({
            id:'page-portal-ansys-remote-shell-radio',
            renderTo: 'page-portal-ansys-remote-shell',
            defualtName: 'remoteshell',
            items: [{
                id: 'page-portal-ansys-remote-shell-rsh',
                value: 'rsh',
                fieldLabel: 'RSH'
            }, {
                id: 'page-portal-ansys-remote-shell-ssh',
                value: 'ssh',
                fieldLabel: 'SSH',
                checked:true
            }]
    });
    this.ansys_remote_shell_radio=ansys_remote_shell_radio;

    //arguments
    ansys_arguments_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-arguments',
            fieldLabel: 'Arguments',
            allowBlank: true
    });
    this.ansys_arguments_input=ansys_arguments_input;

    //working dir
    ansys_work_dir_input=new Gv.form.TextFieldSelect({
            renderTo: 'page-portal-ansys-work-dir',
            fieldLabel: '<font color="#FF0000">*</font>WorkingDIR:',
            readOnly: false,
            value: workdir,
            autoLoad:false,
            data:workdir_list.split(":")
    });
    
    this.ansys_work_dir_input = ansys_work_dir_input;
    this.ansys_components.push(ansys_work_dir_input);
    //working dir browse...
    new Gv.Button({
            renderTo: 'page-portal-ansys-workdir-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: ansys_work_dir_input.value(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            ansys_work_dir_input.value(obj);
                            ansys_work_dir_input.validate();
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
  }, 


  buildRunPComponent:function(){
    //build all run parameters components
    //inp file
    /*
    ansys_inp_file_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-inp-file',
            fieldLabel: 'Inp File',
            allowBlank: false,
            disabled:true
    });
    this.ansys_inp_file_input=ansys_inp_file_input;
    this.ansys_runp_components.push(ansys_inp_file_input);
    */
    //use custom memory settings
    ansys_use_custom=new Gv.form.Checkbox({
      renderTo:'page-portal-ansys-use-custom-memory-setting',
      fieldLabel:'Use custom memory settings',
      checked:false,
      disabled:true,
      handler:function(d,v){
        if($("#"+ansys_use_custom.getId())[0].checked){
            global_jobscheduler_portal_ansys.ansys_database_input.disabled(false);
            global_jobscheduler_portal_ansys.ansys_total_workspace_input.disabled(false);
        }else {
            global_jobscheduler_portal_ansys.ansys_database_input.value('');
            global_jobscheduler_portal_ansys.ansys_total_workspace_input.value('');
            global_jobscheduler_portal_ansys.ansys_database_input.validate();
            global_jobscheduler_portal_ansys.ansys_total_workspace_input.validate();
            global_jobscheduler_portal_ansys.ansys_database_input.disabled(true);
            global_jobscheduler_portal_ansys.ansys_total_workspace_input.disabled(true);
        }
        
      }
    });
    this.ansys_use_custom=ansys_use_custom;
    this.ansys_runp_components.push(ansys_use_custom);
    //input type
    ansys_input_type_radio=new Gv.form.RadioGroup({
            id:'page-portal-ansys_input_type_radio',
            renderTo: 'page-portal-ansys-input-type',
            defualtName: 'input',
            items: [{
                id: 'page-portal-ansys-input-type-db',
                value: 'db',
                fieldLabel: 'DB',
                disabled:true
            }, {
                id: 'page-portal-ansys-input-type-inp',
                value: 'inp',
                fieldLabel: 'INP/CDB',
                checked:true,
                disabled:true
            }]
    });
    this.ansys_input_type_radio = ansys_input_type_radio;
    this.ansys_runp_components.push(ansys_input_type_radio);

    //total workspace
    ansys_total_workspace_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-total-workspace',
            fieldLabel: 'Total Workspace(MB)',
            allowBlank: true,
            regex:/^\d+$/,
            regexText:'只能输入正整数',
            labelWidth:150,
            emptyText:'请输入正整数',
            disabled:true
    });
    this.ansys_total_workspace_input=ansys_total_workspace_input;
    this.ansys_runp_components.push(ansys_total_workspace_input);

    //database
    ansys_database_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-database',
            fieldLabel: 'Database(MB)',
            allowBlank: true,
            regex:/^\d+$/,
            regexText:'只能输入正整数',
            labelWidth:150,
            emptyText:'请输入正整数',
            disabled:true
    });
    this.ansys_database_input=ansys_database_input;
    this.ansys_runp_components.push(ansys_database_input);

    //input file
    ansys_input_file_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-input',
            fieldLabel: '<font color="#FF0000">*</font>Input File',
            allowBlank: false,
            disabled:true
    });
    this.ansys_input_file_input=ansys_input_file_input;
    this.ansys_runp_components.push(ansys_input_file_input);
    //input file browse...
    ansys_input_file_browse = new Gv.Button({
            renderTo: 'page-portal-ansys-input-btn',
            cls:'button',
            text:'Browse...',
            disabled:true,
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: global_jobscheduler_portal_ansys.ansys_work_dir_input.value(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            ansys_input_file_input.value(obj);
                            ansys_input_file_input.validate();
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
    this.ansys_runp_components.push(ansys_input_file_browse);
    //log file
    ansys_log_file_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-log-file',
            fieldLabel: '<font color="#FF0000">*</font>Output File',
            allowBlank: false,
            disabled:true,
            value:PORTALNAM + "_" + portal_time_stamp
    });
    this.ansys_log_file_input=ansys_log_file_input;
    this.ansys_runp_components.push(ansys_log_file_input);
    $("#"+ansys_log_file_input.getId()).bind('keyup',function(){
            Gv.get("portal-pbs-params-name").val(ansys_log_file_input.value());
    });
    //end
  },
  bindEvents:function(){
    //bind events (commit,reset ...)
    //commit
    $("#job-Submission-do").bind('click',function(){
      //basic validate
      var submit_enable = true;
      for(var i in global_portal.component_validate) {
        if(! global_portal.component_validate[i]){
          submit_enable = false;
        }
      }
      //ansys environment parameters validate
      for(var o in global_jobscheduler_portal_ansys.ansys_components){
        if(!global_jobscheduler_portal_ansys.ansys_components[o].validate()){
          submit_enable=false;
        }
      }
      //ansys run parameters validate
      var isWindow = $("#"+global_jobscheduler_portal_ansys.ansys_run_mode.getId())[0].checked;
      if(!isWindow){
        //if not window
        for(var i in global_jobscheduler_portal_ansys.ansys_runp_components){

            if($.isFunction(global_jobscheduler_portal_ansys.ansys_runp_components[i].validate) && !global_jobscheduler_portal_ansys.ansys_runp_components[i].validate()){
                submit_enable=false;
            }
        }
      }

      if(!submit_enable){
        Gv.msg.error({
          html : "作业提交失败,请检查作业调度参数是否完全符合要求！"
        });
        return false;
      }
      //submit params
      var patest = {
        //Job Schedule Parameters
        "GAP_NNODES": Gv.get("portal-pbs-params-nnodes").val(),
        "GAP_PPN": Gv.get("portal-pbs-params-ppn").val(),
        "GAP_WALL_TIME": Gv.get("portal-pbs-params-time").val(),
        "GAP_QUEUE": Gv.get("portal-pbs-params-queue").val(),
        "GAP_NAME": Gv.get("portal-pbs-params-name").val(),
        //environment parameters
        "GAP_REMOTE_SHELL" : global_jobscheduler_portal_ansys.ansys_remote_shell_radio.value()[0].value,
        "GAP_MPIRUNTYPE"   : global_jobscheduler_portal_ansys.ansys_mpi_type_select.value(),
        "GAP_PROGRAM"      : global_jobscheduler_portal_ansys.ansys_ansys_bin_input.value(),
        "GAP_WORK_DIR"     : global_jobscheduler_portal_ansys.ansys_work_dir_input.value(),
        "GAP_PROGRAM_ARG"  : global_jobscheduler_portal_ansys.ansys_arguments_input.value(),
        //"GAP_JOB_NAME"         : global_jobscheduler_portal_ansys.ansys_job_name_input.value(),

        //run parameters
        "GAP_INPUTTYPE"    : isWindow?'':global_jobscheduler_portal_ansys.ansys_input_type_radio.value()[0].value,
        "GAP_CUSTOM_MEM_SET":isWindow?0:$("#"+global_jobscheduler_portal_ansys.ansys_use_custom.getId())[0].checked?1:0,
        "GAP_INPUT"        : isWindow?'':global_jobscheduler_portal_ansys.ansys_input_file_input.value(),
        "GAP_PARAMODE"     : isWindow?'':global_jobscheduler_portal_ansys.ansys_hpc_run_radio.value()[0].value,
        //"GAP_INP_FILE"         : isWindow?'':global_jobscheduler_portal_ansys.ansys_inp_file_input.value(),
        "GAP_OUTPUT"         : isWindow?'':global_jobscheduler_portal_ansys.ansys_log_file_input.value(),
        "GAP_DATABASE"         : isWindow?'':global_jobscheduler_portal_ansys.ansys_database_input.value(),
        "GAP_TOTAL_WORKSPACE"  : isWindow?'':global_jobscheduler_portal_ansys.ansys_total_workspace_input.value(),
        
        //Remote Visualization Parameters
        //"GAP_VNC": "\'" + Gv.get("portal-pbs-params-vnc").val()+"\'",
        "GAP_VNC":isWindow?1:0,
        //Checkpoint/Restart Parameters
        "GAP_CHECK_POINT": "\'" + Gv.get("portal-pbs-params-checkpoint").val()+"\'",
        "GAP_INTERVAL": "\'" + Gv.get("portal-pbs-params-interval").val() + "\'",
        //Advanced Parameters
        "GAP_PBS_OPT": "\'" + Gv.get("portal-pbs-params-pbsAdvOpt").val().replace(/\n/ig, '...') + "\'",
        "GAP_PRE_CMD": "\'" + Gv.get("portal-pbs-params-preCommands").val().replace(/\n/ig, '...') + "\'",
        "GAP_POST_CMD": "\'" + Gv.get("portal-pbs-params-postCommands").val().replace(/\n/ig, '...') + "\'"
      };
     
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
          global_jobscheduler_portal_ansys.ansys_log_file_input.value(PORTALNAM + "_" + new_time_stamp);
        },

        failure: function(response, options) {
          Gv.msg.error({
            html: "请求作业提交失败!"
          });
        }
      });
    });
    //reset
    $("#job-Submission-preset").bind('click',function(){
      //Job Schedule Parameters
      var portal_reset_timestamp = gen_time_identify_string();
      $("#portal-pbs-params-nnodes").val(numnodes);
      $("#portal-pbs-params-ppn").val(numppn);
      $("#portal-pbs-params-time").val(hours + ":" + minutes + ":" + seconds);
      $("#portal-pbs-params-queue").val(queueJsonData[0].text);
      $("#portal-pbs-params-name").val(PORTALNAM + "_" + portal_reset_timestamp);
      //environment parameters

      //$("#page-portal-ansys-mpi-type-hpmpi")[0].checked=true;
      $("#page-portal-ansys-remote-shell-ssh")[0].checked=true;
      $("#page-portal-ansys-hpc-run-smp")[0].checked=true;
      global_jobscheduler_portal_ansys.ansys_mpi_type_select.value(mpi_def);
      global_jobscheduler_portal_ansys.ansys_mpi_type_select.disabled(true);
      global_jobscheduler_portal_ansys.ansys_arguments_input.value('');
      global_jobscheduler_portal_ansys.ansys_ansys_bin_input.data(global_jobscheduler_portal_ansys.ansys_bin_data);
      //console.log(global_jobscheduler_portal_ansys.ansys_bin_data);
      global_jobscheduler_portal_ansys.ansys_ansys_bin_input.value(file);
      global_jobscheduler_portal_ansys.ansys_work_dir_input.value(workdir);
      
      //global_jobscheduler_portal_ansys.ansys_input_file_input.value('');
      
      if(!$("#"+global_jobscheduler_portal_ansys.ansys_run_mode.getId())[0].checked){
        $("#"+global_jobscheduler_portal_ansys.ansys_run_mode.getId())[0].checked=true;
        global_jobscheduler_portal_ansys.controlRunParameters();
      }
      global_jobscheduler_portal_ansys.ansys_log_file_input.value(PORTALNAM + "_" + portal_reset_timestamp);
      //Remote Visualization Parameters
      if($("#portal-pbs-params-vnc")[0]){
        $("#portal-pbs-params-vnc")[0].checked=false;
      }
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
      for(var o in global_jobscheduler_portal_ansys.ansys_components){
        global_jobscheduler_portal_ansys.ansys_components[o].validate();
      }
    });
    
    //预设参数
    $("#job-Submission-predifine").bind('click',function(){
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
            var predefineFormPanel = new Gv.form.FormPanel({
                layout: 'form',
                items: formList
            });

            var isContinue = true;
            var win = new Gv.Window({
                id:'win-page-troublesubmit-id',
                title: '参数预定义',
                width: 700,
                height: 250,
                items: [predefineFormPanel],
                bodyStyle: 'padding:10px;',
                listeners:{
                    afterLayout:function(){
                    }
                },
                tbar: [{
                    text: '确定',
                    handler: function(){
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
                }, {
                    text: '还原默认值',
                    handler: function(){
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

                },{
                    text: '关闭',
                    handler: function () {
                        win.close();
                    }
                }]
            });


        });
  
  },
  onready:function(){
    //start
    this.buildEnvPComponent();
    this.buildRunPComponent();
    this.bindEvents();
  }
}
$(function(){
  global_jobscheduler_portal_ansys.onready();
});
