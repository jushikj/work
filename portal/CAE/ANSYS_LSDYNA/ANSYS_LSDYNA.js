var global_portal_ansys_lsdyna = {

  ansys_lsdyna_env_params:[],
  ansys_bin_data:[],
  buildEnvComponents:function(){

    var o_version_list = [];
    for(var i in s_version_list){
      o_version_list.push({id:s_version_list[i],text:s_version_list[i]});
    }
    // version
    ansys_lsdyna_version = new Gv.form.ComboBox({
            renderTo: 'page-portal-ansys-lsdyna-version',
            fieldLabel: '<font color="#FF0000">*</font>Version',
            allowBlank:false,
            value: ansys_lsdyna_version_def,
            autoLoad:false,
            data:o_version_list
        });
    this.ansys_lsdyna_version=ansys_lsdyna_version;
    this.ansys_lsdyna_env_params.push(ansys_lsdyna_version);
    // parallel mode
    ansys_lsdyna_parallel_mode = new Gv.form.RadioGroup({
            id:'page-portal-ansys-lsdyna-parallel-mode-radio',
            renderTo: 'page-portal-ansys-lsdyna-parallel-mode',
            defualtName: 'hpcrun',
            items: [{
                id: 'page-portal-ansys-lsdyna-parallel-mode-mpp',
                value: 'dmp',
                fieldLabel: 'MPP'
            }, {
                id: 'page-portal-ansys-lsdyna-parallel-mode-smp',
                value: 'smp',
                fieldLabel: 'SMP',
                checked:true
            }]
    });
    this.ansys_lsdyna_parallel_mode=ansys_lsdyna_parallel_mode;

    $("#"+ansys_lsdyna_parallel_mode.getId()+" input").bind('click',function(){
        if(this.value=='dmp'){
            ansys_lsdyna_mpi_type.disabled(false);
        } else {
            ansys_lsdyna_mpi_type.disabled(true);
        }
    });

    // precission
    ansys_lsdyna_precission = new Gv.form.RadioGroup({
            id:'page-portal-ansys-lsdyna-precision-radio',
            renderTo: 'page-portal-ansys-lsdyna-precision',
            defualtName: 'precision',
            items: [{
                id: 'portal_ansys_lsdyna_precision_double',
                value: 'double',
                fieldLabel: 'Double'
            }, {
                id: 'portal_ansys_lsdyna_precision_float',
                value: 'single',
                fieldLabel: 'Single',
        checked:true
            }]
        });
    this.ansys_lsdyna_precission=ansys_lsdyna_precission;

    // remote shell
    ansys_lsdyna_remote_shell = new Gv.form.RadioGroup({
            id:'page-portal-ansys-lsdyna-remote-shell-radio',
            renderTo: 'page-portal-ansys-lsdyna-remote-shell',
            defualtName: 'remoteshell',
            items: [{
                id: 'page-portal-ansys-lsdyna-remote-shell-rsh',
                value: 'rsh',
                fieldLabel: 'RSH'
            }, {
                id: 'page-portal-ansys-lsdyna-remote-shell-ssh',
                value: 'ssh',
                fieldLabel: 'SSH',
                checked:true
            }]
    });
    this.ansys_lsdyna_remote_shell=ansys_lsdyna_remote_shell;

    var o_mpiProg = [];
    if(!Gv.isEmpty(s_mpiProg)){
        for(var i in s_mpiProg){
          if(!Gv.isEmpty(s_mpiProg[i])){
            o_mpiProg.push({id:s_mpiProg[i],text:s_mpiProg[i]});
          }
        }
    }
    this.ansys_bin_data=this.ansys_bin_data.concat(o_mpiProg);
    // ansys bin
    ansys_lsdyna_ansys_bin = new Gv.form.ComboBox({
            renderTo: 'page-portal-ansys-lsdyna-ansys-bin',
            fieldLabel: '<font color="#FF0000">*</font>ANSYS Bin',
            allowBlank:false,
            value: file,
            autoLoad:false,
            data:o_mpiProg
        });
    this.ansys_lsdyna_ansys_bin=ansys_lsdyna_ansys_bin;
    this.ansys_lsdyna_env_params.push(ansys_lsdyna_ansys_bin);
    // browse ...
    new Gv.Button({
            renderTo: 'page-portal-ansys-lsdyna-ansys-bin-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            o_mpiProg.push({id:obj,text:obj});
                            ansys_lsdyna_ansys_bin.data(o_mpiProg);
                            ansys_lsdyna_ansys_bin.value(obj);
                            ansys_lsdyna_ansys_bin.validate();
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
    
    var o_mpi=[];
    if(!Gv.isEmpty(s_mpilist)){
        for(var i in s_mpilist){
            o_mpi.push({id:s_mpilist[i],text:s_mpilist[i]});
        }
    }
    // mpi type
    ansys_lsdyna_mpi_type = new Gv.form.ComboBox({
        renderTo: 'page-portal-ansys-lsdyna-mpi-type',
        fieldLabel: '<font color="#FF0000">*</font>MPI Type',
        readOnly: false,
        allowBlank:false,
        //width: 540,
        value: mpi_def,
        autoLoad:false,
        data:o_mpi,
        disabled:true
    });
    this.ansys_lsdyna_mpi_type=ansys_lsdyna_mpi_type;
    this.ansys_lsdyna_env_params.push(ansys_lsdyna_mpi_type);

    // work dir
    ansys_lsdyna_work_dir = new Gv.form.TextField({
            renderTo: 'page-portal-ansys-lsdyna-work-dir',
            fieldLabel: '<font color="#FF0000">*</font>Working DIR',
            allowBlank: false,
            value:workdir
    });
    this.ansys_lsdyna_work_dir=ansys_lsdyna_work_dir;
    this.ansys_lsdyna_env_params.push(ansys_lsdyna_work_dir);
    // browse...
    new Gv.Button({
            renderTo: 'page-portal-ansys-lsdyna-workdir-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            ansys_lsdyna_work_dir.value(obj);
                            ansys_lsdyna_work_dir.validate();
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
    ansys_lsdyna_arguments = new Gv.form.TextField({
            renderTo: 'page-portal-ansys-lsdyna-arguments',
            fieldLabel: 'Arguments',
            allowBlank: true
    });
    this.ansys_lsdyna_arguments = ansys_lsdyna_arguments;
    this.ansys_lsdyna_env_params.push(ansys_lsdyna_arguments);

    // memory
    ansys_lsdyna_memory = new Gv.form.TextField({
            renderTo: 'page-portal-ansys-lsdyna-memory',
            fieldLabel: 'Memory(MB)',
            allowBlank: true
    });
    this.ansys_lsdyna_memory=ansys_lsdyna_memory;
    this.ansys_lsdyna_env_params.push(ansys_lsdyna_memory);

    // keyword file
    ansys_lsdyna_keyword_file = new Gv.form.TextField({
            renderTo: 'page-portal-ansys-lsdyna-keyword-file',
            fieldLabel: 'Keyword File',
            allowBlank: true
    });
    this.ansys_lsdyna_keyword_file=ansys_lsdyna_keyword_file;
    this.ansys_lsdyna_env_params.push(ansys_lsdyna_keyword_file);
    // browse...
    new Gv.Button({
            renderTo: 'page-portal-ansys-lsdyna-keyword-file-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            ansys_lsdyna_keyword_file.value(obj);
                            ansys_lsdyna_keyword_file.validate();
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

  bindEvents:function(){
    $("#job-Submission-do").bind('click',function(){
        var submit_enable = true;
        for(var i in global_portal.component_validate) {
          if(! global_portal.component_validate[i]){
            submit_enable = false;
          }
        }
        for(var i in global_portal_ansys_lsdyna.ansys_lsdyna_env_params){
          if(!global_portal_ansys_lsdyna.ansys_lsdyna_env_params[i].validate()){
            submit_enable = false;
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
        "GAP_ANSYS_VERSION":"\'"+global_portal_ansys_lsdyna.ansys_lsdyna_version.value()+"\'",
        "GAP_PARAMODE":"\'" + global_portal_ansys_lsdyna.ansys_lsdyna_parallel_mode.value()[0].value + "\'",
        "GAP_PRECISSION":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_precission.value()[0].value+ "\'",
        "GAP_MPI_TYPE":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_mpi_type.value()+ "\'",
        "GAP_REMOTE_SHELL":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_remote_shell.value()[0].value+ "\'",
        "GAP_ARGUMENTS":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_arguments.value()+ "\'",
        "GAP_PROGRAM":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_ansys_bin.value()+ "\'",
        "GAP_WORK_DIR":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_work_dir.value()+ "\'",
        "GAP_MEMORY":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_memory.value()+ "\'",
        "GAP_KEYWORD_FILE":"\'" +global_portal_ansys_lsdyna.ansys_lsdyna_keyword_file.value()+ "\'",

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
      global_portal_ansys_lsdyna.ansys_lsdyna_version.value(ansys_lsdyna_version_def);
      $("#page-portal-ansys-lsdyna-parallel-mode-smp")[0].checked=true;
      $("#portal_ansys_lsdyna_precision_float")[0].checked=true;
      $("#page-portal-ansys-lsdyna-remote-shell-ssh").checked=true;
      global_portal_ansys_lsdyna.ansys_lsdyna_mpi_type.value(mpi_def);
      global_portal_ansys_lsdyna.ansys_lsdyna_mpi_type.disabled(true);
      global_portal_ansys_lsdyna.ansys_lsdyna_ansys_bin.data(global_portal_ansys_lsdyna.ansys_bin_data);
      global_portal_ansys_lsdyna.ansys_lsdyna_arguments.value('');
      global_portal_ansys_lsdyna.ansys_lsdyna_memory.value('');
      global_portal_ansys_lsdyna.ansys_lsdyna_work_dir.value(workdir);
      global_portal_ansys_lsdyna.ansys_lsdyna_keyword_file.value('');

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

      for(var i in global_portal_ansys_lsdyna.ansys_lsdyna_env_params){
        global_portal_ansys_lsdyna.ansys_lsdyna_env_params[i].validate();
      }

    });

  
  },

  onready:function(){
    this.buildEnvComponents();
    this.bindEvents();
  }

};
$(function(){
  global_portal_ansys_lsdyna.onready();
});