var global_portal_lammps = {
	lammps_run_params:[],
	lammps_prog_data:[],
	buildRunComponents:function(){
		// cpu binding
		lammps_cpu_binding = new Gv.form.Checkbox({
			renderTo:'page-portal-lammps-cpu-binding',
			fieldLabel:'Yes',
			checked:true,
			handler:function(d,v){
				
			}
		});
		this.lammps_cpu_binding=lammps_cpu_binding;
		// parallel mode
		lammps_parallel_mode = new Gv.form.RadioGroup({
            id:'page-portal-lammps-parallel-mode-radio',
            renderTo: 'page-portal-lammps-parallel-mode',
            defualtName: 'hpcrun',
            items: [{
                id: 'page-portal-lammps-parallel-mode-mpp',
                value: 'dmp',
                fieldLabel: 'MPP'
            }, {
                id: 'page-portal-lammps-parallel-mode-smp',
                value: 'smp',
                fieldLabel: 'SMP',
                checked:true
            }]
    	});
    	this.lammps_parallel_mode=lammps_parallel_mode;
    	// Commucation
    	lammps_commucation = new Gv.form.RadioGroup({
            id:'page-portal-lammps-commucation-radio',
            renderTo: 'page-portal-lammps-commucation',
            defualtName: 'hpcrun',
            items: [{
                id: 'page-portal-lammps-commucation-tcp',
                value: 'tcp',
                fieldLabel: 'TCP'
            }, {
                id: 'page-portal-lammps-commucation-ib',
                value: 'ib',
                fieldLabel: 'Infiniband',
                checked:true
            }]
    	});
    	this.lammps_commucation=lammps_commucation;
    	// remote shell
    	lammps_remote_shell = new Gv.form.RadioGroup({
            id:'page-portal-lammps-remote-shell-radio',
            renderTo: 'page-portal-lammps-remote-shell',
            defualtName: 'remoteshell',
            items: [{
                id: 'page-portal-lammps-remote-shell-rsh',
                value: 'rsh',
                fieldLabel: 'RSH'
            }, {
                id: 'page-portal-lammps-remote-shell-ssh',
                value: 'ssh',
                fieldLabel: 'SSH',
                checked:true
            }]
    	});
    	this.lammps_remote_shell=lammps_remote_shell;
    	// mpi program
    	var o_prog = [];
    	for(var i in s_prog){
            if(!Gv.isEmpty(s_prog[i])){
                o_prog.push({id:s_prog[i],text:s_prog[i]});
            }	
    	}
    	this.lammps_prog_data=this.lammps_prog_data.concat(o_prog);
    	lammps_program = new Gv.form.ComboBox({
            renderTo: 'page-portal-lammps-mpi-program',
            fieldLabel: '<font color="#FF0000">*</font>MPI Program',
            allowBlank:false,
            value: program,
            autoLoad:false,
            data:o_prog
        });
        this.lammps_program=lammps_program;
        this.lammps_run_params.push(lammps_program);
        // browse...
        new Gv.Button({
            renderTo: 'page-portal-lammps-mpi-program-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            o_prog.push({id:obj,text:obj});
                            lammps_program.data(o_prog);
                            lammps_program.value(obj);
                            lammps_program.validate();
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
		// mpi type
		var o_mpi = [];
		for(var i in s_mpi){
			o_mpi.push({id:s_mpi[i],text:s_mpi[i]});
		}
		lammps_mpi_type = new Gv.form.ComboBox({
            renderTo: 'page-portal-lammps-mpi-type',
            fieldLabel: '<font color="#FF0000">*</font>MPI Type',
            allowBlank:false,
            value: mpitype,
            autoLoad:false,
            data:o_mpi
        });
        this.lammps_mpi_type=lammps_mpi_type;
        this.lammps_run_params.push(lammps_mpi_type);

        // arguments
        lammps_arguments = new Gv.form.TextField({
            renderTo: 'page-portal-lammps-arguments',
            fieldLabel: 'Arguments',
            allowBlank: true
      	});
      	this.lammps_arguments=lammps_arguments;
      	this.lammps_run_params.push(lammps_arguments);
      	// output file
      	lammps_output_log = new Gv.form.TextField({
            renderTo: 'page-portal-lammps-output-log',
            fieldLabel: '<font color="#FF0000">*</font>Output Log',
            allowBlank: false,
            value:PORTALNAM + "_" + portal_time_stamp + '.txt'
      	});
      	this.lammps_output_log=lammps_output_log;
      	this.lammps_run_params.push(lammps_output_log);

      	// work dir
      	lammps_work_dir = new Gv.form.TextField({
            renderTo: 'page-portal-lammps-work-dir',
            fieldLabel: '<font color="#FF0000">*</font>Working DIR',
            allowBlank: false,
            value:workdir
      	});
      	this.lammps_work_dir=lammps_work_dir;
      	this.lammps_run_params.push(lammps_work_dir);
      	// browse...
      	new Gv.Button({
            renderTo: 'page-portal-lammps-work-dir-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            lammps_work_dir.value(obj);
                            lammps_work_dir.validate();
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
      	// input file
      	lammps_input_file = new Gv.form.TextField({
            renderTo: 'page-portal-lammps-input-file',
            fieldLabel: '<font color="#FF0000">*</font>Input File',
            allowBlank: false
      	});
      	this.lammps_input_file=lammps_input_file;
      	this.lammps_run_params.push(lammps_input_file);
      	// browse...
      	new Gv.Button({
            renderTo: 'page-portal-lammps-input-file-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            lammps_input_file.value(obj);
                            lammps_input_file.validate();
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
        // submit
        $("#job-Submission-do").bind('click',function(){
            var submit_enable = true;
            for(var i in global_portal.component_validate) {
                if(! global_portal.component_validate[i]){
                    submit_enable = false;
                }
            }
            for(var i in global_portal_lammps.lammps_run_params){
                if(!global_portal_lammps.lammps_run_params[i].validate()){
                    submit_enable = false;
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
                "GAP_CPU_BINDING":"\'" +$("#"+global_portal_lammps.lammps_cpu_binding.getId())[0].checked?1:0+ "\'",
                "GAP_SHARE_MEMORY":"\'"+global_portal_lammps.lammps_parallel_mode.value()[0].value=='smp'?1:0+"\'",
                "GAP_COMMUCATION":"\'"+global_portal_lammps.lammps_commucation.value()[0].value+"\'",
                "GAP_REMOTE_SHELL":"\'" +global_portal_lammps.lammps_remote_shell.value()[0].value+ "\'",
                "GAP_MPI_TYPE":"\'" +global_portal_lammps.lammps_mpi_type.value()+ "\'",
                "GAP_PROGRAM":"\'" +global_portal_lammps.lammps_program.value()+ "\'",
                "GAP_PROGRAM_ARG":"\'" +global_portal_lammps.lammps_arguments.value()+ "\'",
                "GAP_WORK_DIR":"\'" +global_portal_lammps.lammps_work_dir.value()+ "\'",
                "GAP_INPUT":"\'" +global_portal_lammps.lammps_input_file.value()+ "\'",
                "GAP_OUTPUT":"\'" +global_portal_lammps.lammps_output_log.value()+ "\'",

                //vnc
                "GAP_VNC":'0',
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
                  global_portal_lammps.lammps_output_log.value(PORTALNAM + "_" + new_time_stamp + '.txt');
                },

                failure: function(response, options) {
                  Gv.msg.error({
                    html: "请求作业提交失败!"
                  });
                }
              });
            });
        

        $("#job-Submission-preset").bind('click',function(){
             //Job Schedule Parameters
              var portal_reset_timestamp = gen_time_identify_string();
              $("#portal-pbs-params-nnodes").val(numnodes);
              $("#portal-pbs-params-ppn").val(numppn);
              $("#portal-pbs-params-time").val(hours + ":" + minutes + ":" + seconds);
              $("#portal-pbs-params-queue").val(queueJsonData[0].text);
              $("#portal-pbs-params-name").val(PORTALNAM + "_" + portal_reset_timestamp);

              // run parameters
              $("#"+global_portal_lammps.lammps_cpu_binding.getId())[0].checked=true;
              $("#page-portal-lammps-parallel-mode-smp")[0].checked=true;
              $("#page-portal-lammps-commucation-ib")[0].checked=true;
              $("#page-portal-lammps-remote-shell-ssh")[0].checked=true;
              global_portal_lammps.lammps_mpi_type.value(mpitype);
              global_portal_lammps.lammps_program.data(global_portal_lammps.lammps_prog_data);
              global_portal_lammps.lammps_program.value(program);
              global_portal_lammps.lammps_arguments.value('');
              global_portal_lammps.lammps_work_dir.value(workdir);
              global_portal_lammps.lammps_output_log.value(PORTALNAM + "_" + portal_reset_timestamp+".txt");
              global_portal_lammps.lammps_input_file.value('');

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

              for(var i in global_portal_lammps.lammps_run_params){
                global_portal_lammps.lammps_run_params[i].validate();
              }
        });

    },
	onready:function(){
		this.buildRunComponents();
		this.bindEvents();
	}
};
$(function(){
	global_portal_lammps.onready();
});