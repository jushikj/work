var global_jobscheduler_portal_ansys = {

  ansys_components:[], //store component that need to be validate
  ansys_runp_components:[],//run parameters components
  buildEnvPComponent:function(){
    //build Environment Parameters Components
    //run mode
    ansys_run_mode = new Gv.form.Checkbox({
      renderTo:'page-portal-ansys-run-mode',
      fieldLabel:'Window',
      checked:true,
      handler:function(d,v){
        if($('#'+ansys_run_mode.getId())[0].checked){
          
          $('#page-portal-ansys-run-parameters-group').removeClass('active');
          $('#page-portal-ansys-run-parameters-group i').attr('class','icon-chevron-sign-down');
          //clear run parameters value and disable it,then close
          for(var i in global_jobscheduler_portal_ansys.ansys_runp_components){
            var o = global_jobscheduler_portal_ansys.ansys_runp_components[i];
            o.disabled(true);
          }
          
        }else {
          $('#page-portal-ansys-run-parameters-group').addClass('active');
          $('#page-portal-ansys-run-parameters-group i').attr('class','icon-chevron-sign-up');
          for(var i in global_jobscheduler_portal_ansys.ansys_runp_components){
            var o = global_jobscheduler_portal_ansys.ansys_runp_components[i];
            o.disabled(false);
          }
        };
      }
    });
    global_jobscheduler_portal_ansys.ansys_run_mode=ansys_run_mode;

    //ansys bin
    var o_mpiProg = [];
    if(!Gv.isEmpty(s_mpiProg)){
        for(var i in s_mpiProg){
          if(!Gv.isEmpty(s_mpiProg[i])){
            o_mpiProg.push({id:s_mpiProg[i],text:s_mpiProg[i]});
          }
        }
    }
    ansys_ansys_bin_input=new Gv.form.ComboBox({
            renderTo: 'page-portal-ansys-bin',
            fieldLabel: 'ANSYS Bin',
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
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
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
    ansys_mpi_type_radio=new Gv.form.RadioGroup({
            id:'page-portal-ansys-mpi-type-radio',
            renderTo: 'page-portal-ansys-mpi-type',
            defualtName: 'mpitype',
            items: [{
                id: 'page-portal-ansys-mpi-type-intelmpi',
                value: 'intelmpi',
                fieldLabel: 'Intelmpi'
            }, {
                id: 'page-portal-ansys-mpi-type-hpmpi',
                value: 'hpmpi',
                fieldLabel: 'HPmpi',
                checked:true
            }]
    });
    this.ansys_mpi_type_radio = ansys_mpi_type_radio;
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
    ansys_work_dir_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-work-dir',
            fieldLabel: 'Working DIR',
            allowBlank: false,
            value:workdir
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
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
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

    //job name
    ansys_job_name_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-job-name',
            fieldLabel: 'Job Name',
            allowBlank: true
    });
    this.ansys_job_name_input = ansys_job_name_input;
    this.ansys_components.push(ansys_job_name_input);
    //working dir browse...
    new Gv.Button({
            renderTo: 'page-portal-ansys-job-name-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            ansys_job_name_input.value(obj);
                            ansys_job_name_input.validate();
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
    ansys_inp_file_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-inp-file',
            fieldLabel: 'Inp File',
            allowBlank: false,
            disabled:true
    });
    this.ansys_inp_file_input=ansys_inp_file_input;
    this.ansys_runp_components.push(ansys_inp_file_input);

    //use custom memory settings
    ansys_use_custom=new Gv.form.Checkbox({
      renderTo:'page-portal-ansys-use-custom-memory-setting',
      fieldLabel:'Use custom memory settings',
      checked:false,
      disabled:true
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
                fieldLabel: 'INP',
                checked:true,
                disabled:true
            }]
    });
    this.ansys_input_type_radio = ansys_input_type_radio;
    this.ansys_runp_components.push(ansys_input_type_radio);

    //Parallel Mode(hpc run)
    ansys_hpc_run_radio=new Gv.form.RadioGroup({
            id:'page-portal-ansys-hpc-run-radio',
            renderTo: 'page-portal-ansys-hpc-run',
            defualtName: 'hpcrun',
            items: [{
                id: 'page-portal-ansys-hpc-run-mpp',
                value: 'dmp',
                fieldLabel: 'MPP',
                disabled:true
            }, {
                id: 'page-portal-ansys-hpc-run-smp',
                value: 'smp',
                fieldLabel: 'SMP',
                checked:true,
                disabled:true
            }]
    });
    this.ansys_hpc_run_radio = ansys_hpc_run_radio;
    this.ansys_runp_components.push(ansys_hpc_run_radio);

    //total workspace
    ansys_total_workspace_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-total-workspace',
            fieldLabel: 'Total Workspace(MB)',
            allowBlank: false,
            regex:/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
            regexText:'只能输入大于0的数字',
            labelWidth:145,
            emptyText:'请输入大于0的数字',
            disabled:true
    });
    this.ansys_total_workspace_input=ansys_total_workspace_input;
    this.ansys_runp_components.push(ansys_total_workspace_input);

    //database
    ansys_database_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-database',
            fieldLabel: 'Database(MB)',
            allowBlank: false,
            regex:/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
            regexText:'只能输入大于0的数字',
            labelWidth:145,
            emptyText:'请输入大于0的数字',
            disabled:true
    });
    this.ansys_database_input=ansys_database_input;
    this.ansys_runp_components.push(ansys_database_input);

    //input file
    ansys_input_file_input=new Gv.form.TextField({
            renderTo: 'page-portal-ansys-input',
            fieldLabel: 'Input File',
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
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
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
            fieldLabel: 'Log File',
            allowBlank: false,
            disabled:true
    });
    this.ansys_log_file_input=ansys_log_file_input;
    this.ansys_runp_components.push(ansys_log_file_input);
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
      //ansys run parameters validate
      for(var o in global_jobscheduler_portal_ansys.ansys_components){
        if(!global_jobscheduler_portal_ansys.ansys_components[o].validate()){
          submit_enable=false;
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
        //run parameters
        "GAP_MPI_LIC_TYPE"     : global_jobscheduler_portal_ansys.ansys_license_select.value(),
        "GAP_MPI_REMOTE_SHELL" : global_jobscheduler_portal_ansys.ansys_remote_shell_radio.value()[0].value,
        "GAP_MPI_MPIRUNTYPE"   : global_jobscheduler_portal_ansys.ansys_mpi_type_radio.value()[0].value,
        "GAP_MPI_PARAMODE"     : global_jobscheduler_portal_ansys.ansys_hpc_run_radio.value()[0].value,
        "GAP_MPI_INPUTTYPE"    : global_jobscheduler_portal_ansys.ansys_input_type_radio.value()[0].value,
        "GAP_MPI_PROGRAM"      : global_jobscheduler_portal_ansys.ansys_ansys_bin_input.value(),
        "GAP_MPI_PROGRAM_ARG"  : global_jobscheduler_portal_ansys.ansys_arguments_input.value(),
        "GAP_MPI_WORK_DIR"     : global_jobscheduler_portal_ansys.ansys_work_dir_input.value(),
        "GAP_MPI_INPUT"        : global_jobscheduler_portal_ansys.ansys_input_file_input.value(),
        "GAP_MPI_OUTPUT"       : global_jobscheduler_portal_ansys.ansys_output_file_input.value(),
        
        //Remote Visualization Parameters
        "GAP_VNC": "\'" + Gv.get("portal-pbs-params-vnc").val()+"\'",
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
          global_jobscheduler_portal_ansys.ansys_output_file_input.value(PORTALNAM + "_" + new_time_stamp + '.txt');
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
      //run parameters
      $("#page-portal-ansys-mpi-type-hpmpi")[0].checked=true;
      $("#page-portal-ansys-hpc-run-smp")[0].checked=true;
      $("#page-portal-ansys-remote-shell-ssh")[0].checked=true;
      $("#page-portal-ansys-input-type-inp")[0].checked=true;

      global_jobscheduler_portal_ansys.ansys_license_select.value(lictype);
      global_jobscheduler_portal_ansys.ansys_work_dir_input.value(workdir);
      global_jobscheduler_portal_ansys.ansys_ansys_bin_input.value(file);
      global_jobscheduler_portal_ansys.ansys_input_file_input.value('');
      global_jobscheduler_portal_ansys.ansys_arguments_input.value('');
      global_jobscheduler_portal_ansys.ansys_output_file_input.value(PORTALNAM + "_" + portal_reset_timestamp + '.txt');

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
