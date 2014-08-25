var global_portal_cfx = {
  cfx_params:[],
  fluent_bin_data:[],
  buildComponents:function(){
    // run mode
    cfx_run_mode = new Gv.form.Checkbox({
      renderTo:'page-portal-cfx-run-mode',
      fieldLabel:'Window',
      checked:false,
      handler:function(){
        if($('#'+cfx_run_mode.getId())[0].checked){
          
          $('#page-portal-cfx-run-parameters-group').removeClass('active');
          $('#page-portal-cfx-run-parameters-group i').attr('class','icon-chevron-sign-down');
          global_portal_cfx.cfx_def_file.disabled(true);
          global_portal_cfx.cfx_def_file_btn.disabled(true);
          global_portal_cfx.cfx_def_file.value('');
          global_portal_cfx.cfx_res_file.disabled(true);
          global_portal_cfx.cfx_res_file.value('');
          global_portal_cfx.cfx_res_file_btn.disabled(true);
          global_portal_cfx.cfx_time.disabled(true);
          $("#portal_cfx-time-type-steady")[0].checked=false;
          $("#portal_cfx-time-type-translent")[0].checked=false;
          
        }else {
          $('#page-portal-cfx-run-parameters-group').addClass('active');
          $('#page-portal-cfx-run-parameters-group i').attr('class','icon-chevron-sign-up');
          global_portal_cfx.cfx_def_file.disabled(false);
          global_portal_cfx.cfx_def_file_btn.disabled(false);
          //global_portal_cfx.cfx_def_file.value(PORTALNAM + "_" + portal_time_stamp + '.def');
          global_portal_cfx.cfx_res_file.disabled(true);
          global_portal_cfx.cfx_res_file.value('');
          global_portal_cfx.cfx_res_file_btn.disabled(true);
          global_portal_cfx.cfx_time.disabled(false);
          $("#portal_cfx-time-type-steady")[0].checked=true;
          $("#portal_cfx-time-type-translent")[0].checked=false;
        };
      }
    });
    this.cfx_run_mode=cfx_run_mode;

    // precisson
    cfx_precission = new Gv.form.RadioGroup({
            id:'page-portal-cfx-precision-radio',
            renderTo: 'page-portal-cfx-precission',
            defualtName: 'precision',
            items: [{
                id: 'portal_cfx_precision_double',
                value: 'double',
                fieldLabel: 'Double'
            }, {
                id: 'portal_cfx_precision_float',
                value: 'single',
                fieldLabel: 'Single',
        checked:true
            }]
        });
    this.cfx_precission=cfx_precission;

    // remote shell
    cfx_remote_shell = new Gv.form.RadioGroup({
            id:'page-portal-cfx-remote-shell-radio',
            renderTo: 'page-portal-cfx-remote-shell',
            defualtName: 'remoteshell',
            items: [{
                id: 'page-portal-cfx-remote-shell-rsh',
                value: 'rsh',
                fieldLabel: 'RSH'
            }, {
                id: 'page-portal-cfx-remote-shell-ssh',
                value: 'ssh',
                fieldLabel: 'SSH',
                checked:true
            }]
    });
    this.cfx_remote_shell=cfx_remote_shell;

    var o_prog = [];
    if(!Gv.isEmpty(s_prog)){
        for(var i in s_prog){
            if(!Gv.isEmpty(s_prog[i]))
                o_prog.push({id:s_prog[i],text:s_prog[i]});
        }
    }
    this.fluent_bin_data=this.fluent_bin_data.concat(o_prog);
    // cfx fluent bin
    cfx_fluent_bin = new Gv.form.ComboBox({
            renderTo: 'page-portal-cfx-fluent-bin',
            fieldLabel: '<font color="#FF0000">*</font>CFX Bin',
            allowBlank:false,
            value: program,
            autoLoad:false,
            data:o_prog
        });
    this.cfx_fluent_bin=cfx_fluent_bin;
    this.cfx_params.push(cfx_fluent_bin);
    // browse...
    new Gv.Button({
            renderTo: 'page-portal-cfx-fluent-bin-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: cfx_fluent_bin.value(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            o_prog.push({id:obj,text:obj});
                            cfx_fluent_bin.data(o_prog);
                            cfx_fluent_bin.value(obj);
                            cfx_fluent_bin.validate();
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
      cfx_mpi_type = new Gv.form.ComboBox({
          renderTo: 'page-portal-cfx-mpi-type',
          fieldLabel: '<font color="#FF0000">*</font>MPI Type',
          readOnly: false,
          allowBlank:false,
          //width: 540,
          value: mpi_def,
          autoLoad:false,
          data:o_mpi,
          disabled:false
      });
      this.cfx_mpi_type=cfx_mpi_type;
      this.cfx_params.push(cfx_mpi_type);

      //arguments
      cfx_arguments = new Gv.form.TextField({
            renderTo: 'page-portal-cfx-arguments',
            fieldLabel: 'Arguments',
            allowBlank: true
      });
      this.cfx_arguments=cfx_arguments;
      this.cfx_params.push(cfx_arguments);

      //work dir
      cfx_work_dir = new Gv.form.TextFieldSelect({
            renderTo: 'page-portal-cfx-work-dir',
            fieldLabel: '<font color="#FF0000">*</font>WorkingDIR:',
            readOnly: false,
            //width: 540,
            value: workdir,
            autoLoad:false,
            data:workdir_list.split(":")
          });

      this.cfx_work_dir=cfx_work_dir;
      this.cfx_params.push(cfx_work_dir);
      // browse ...
      new Gv.Button({
            renderTo: 'page-portal-cfx-workdir-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: cfx_work_dir.value(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            cfx_work_dir.value(obj);
                            cfx_work_dir.validate();
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

      // def file
      cfx_def_file = new Gv.form.TextField({
            renderTo: 'page-portal-cfx-def-file',
            fieldLabel: 'Def File',
            allowBlank: true,
            disabled:false

        });
      this.cfx_def_file=cfx_def_file;
      this.cfx_params.push(cfx_def_file);

      btn2 = new Gv.Button({
            renderTo: 'page-portal-cfx-def-file-btn',
            cls:'button',
            disabled:false,
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: cfx_work_dir.value(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            cfx_def_file.value(obj);
                            cfx_def_file.validate();
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
      this.cfx_def_file_btn = btn2;

      // time
      cfx_time = new Gv.form.RadioGroup({
            id:'portal_cfx_time_type',
            renderTo: 'page-portal-cfx-time-type',
            defualtName: 'jou-file',
            items: [{
                id: 'portal_cfx-time-type-steady',
                value: 'steady',
                fieldLabel: 'steady',
                checked: true,
                disabled:false,
                handler:function(){
                  global_portal_cfx.cfx_res_file.value('');
                  global_portal_cfx.cfx_res_file.disabled(true);
                  global_portal_cfx.cfx_res_file_btn.disabled(true);
                }
            }, {
                id: 'portal_cfx-time-type-translent',
                value: 'translent',
                fieldLabel: 'transient',
                disabled:false,
                handler:function(){
                  global_portal_cfx.cfx_res_file.disabled(false);
                  global_portal_cfx.cfx_res_file_btn.disabled(false);
                }
            }]
        });
      this.cfx_time=cfx_time;

      // res file
      cfx_res_file = new Gv.form.TextField({
            renderTo: 'page-portal-cfx-res-file',
            fieldLabel: 'Res File',
            allowBlank: true,
            value: '',
            disabled:true

        });
      this.cfx_res_file=cfx_res_file;
      this.cfx_params.push(cfx_res_file);
      // browse ...
      btn1 = new Gv.Button({
            renderTo: 'page-portal-cfx-res-file-btn',
            cls:'button',
            disabled:true,
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: cfx_work_dir.value(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            cfx_res_file.value(obj);
                            cfx_res_file.validate();
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
      this.cfx_res_file_btn = btn1;

  },
  bindEvents:function(){
    $("#job-Submission-do").bind('click',function(){
      //basic validate
      var submit_enable = true;
      for(var i in global_portal.component_validate) {
        if(! global_portal.component_validate[i]){
          submit_enable = false;
        }
      }
      // environment parameters
      for(var i in global_portal_cfx.cfx_params){
        if(!global_portal_cfx.cfx_params[i].validate()){
          submit_enable=false;
        }
      }
      // run parameters
      var isWindow = $("#"+global_portal_cfx.cfx_run_mode.getId())[0].checked;
      if(!submit_enable){
        Gv.msg.error({
          html : "作业提交失败,请检查作业调度参数是否完全符合要求！"
        });
        return false;
      }
      //submit params
      
      var gap_time = "";
      if(global_portal_cfx.cfx_time.value().length != 0){
        gap_time=global_portal_cfx.cfx_time.value()[0].value;
      }
      var patest = {
        //Job Schedule Parameters
        "GAP_NNODES": Gv.get("portal-pbs-params-nnodes").val(),
        "GAP_PPN": Gv.get("portal-pbs-params-ppn").val(),
        "GAP_WALL_TIME": Gv.get("portal-pbs-params-time").val(),
        "GAP_QUEUE": Gv.get("portal-pbs-params-queue").val(),
        "GAP_NAME": Gv.get("portal-pbs-params-name").val(),

        // env parameters
        "GAP_VNC":isWindow?1:0,
        "GAP_PRECISSION":"\'" +global_portal_cfx.cfx_precission.value()[0].value+ "\'",
        "GAP_REMOTE_SHELL":"\'" +global_portal_cfx.cfx_remote_shell.value()[0].value+ "\'",
        "GAP_PROGRAM":"\'" +global_portal_cfx.cfx_fluent_bin.value()+ "\'",
        "GAP_MPI_TYPE":"\'" +global_portal_cfx.cfx_fluent_bin.value()+ "\'",
        "GAP_ARGUMENTS":"\'" +global_portal_cfx.cfx_arguments.value()+ "\'",
        "GAP_WORK_DIR":"\'" +global_portal_cfx.cfx_work_dir.value()+ "\'",
        "GAP_DEF_FILE":"\'" +global_portal_cfx.cfx_def_file.value()+ "\'",
        "GAP_TIME":"\'" +gap_time+ "\'",
        "GAP_RES_FILE":"\'" +global_portal_cfx.cfx_res_file.value()+ "\'",

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

    // reset
    $("#job-Submission-preset").bind('click',function(){
      //Job Schedule Parameters
      var portal_reset_timestamp = gen_time_identify_string();
      $("#portal-pbs-params-nnodes").val(numnodes);
      $("#portal-pbs-params-ppn").val(numppn);
      $("#portal-pbs-params-time").val(hours + ":" + minutes + ":" + seconds);
      $("#portal-pbs-params-queue").val(queueJsonData[0].text);
      $("#portal-pbs-params-name").val(PORTALNAM + "_" + portal_reset_timestamp);

      //env parameters
      $("#"+global_portal_cfx.cfx_run_mode.getId())[0].checked=true;
      $("#portal_cfx_precision_float")[0].checked=true;
      $("#page-portal-cfx-remote-shell-ssh")[0].checked=true;
      global_portal_cfx.cfx_fluent_bin.data(global_portal_cfx.fluent_bin_data);
      global_portal_cfx.cfx_fluent_bin.value(program);
      global_portal_cfx.cfx_mpi_type.value(mpi_def);
      global_portal_cfx.cfx_arguments.value('');
      global_portal_cfx.cfx_work_dir.value(workdir);

      global_portal_cfx.cfx_def_file.disabled(true);
      global_portal_cfx.cfx_def_file_btn.disabled(true);
      global_portal_cfx.cfx_def_file.value('');
      global_portal_cfx.cfx_res_file.disabled(true);
      global_portal_cfx.cfx_res_file.value('');
      global_portal_cfx.cfx_time.disabled(true);
      $("#portal_cfx-time-type-steady")[0].checked=false;
      $("#portal_cfx-time-type-translent")[0].checked=false;

      $('#page-portal-cfx-run-parameters-group').removeClass('active');
      $('#page-portal-cfx-run-parameters-group i').attr('class','icon-chevron-sign-down');

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

      for(var i in global_portal_cfx.cfx_params){
        global_portal_cfx.cfx_params[i].validate();
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
    this.buildComponents();
    this.bindEvents();
  }

};
$(function(){
  global_portal_cfx.onready();
});