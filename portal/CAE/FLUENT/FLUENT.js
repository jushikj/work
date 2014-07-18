var global_jobscheduler_general = {
	fluent_params:[], //需校验的参数
    initrunparams: function() {
		program_id = 'portal_pbs_params_program';
		//run mode
		run_mode = new Gv.form.Checkbox({
			renderTo:'page-portal-fluent-run-mod',
			fieldLabel:'Window',
			checked:true,
			handler:function(d,v){
				if($('#'+run_mode.getId())[0].checked){
					
					$('#page-portal-fluent-batch-mode-parames').removeClass('active');
					$('#page-portal-fluent-batch-mode-parames i').attr('class','icon-chevron-sign-down');
					
				}else {
					$('#page-portal-fluent-batch-mode-parames').addClass('active');
					$('#page-portal-fluent-batch-mode-parames i').attr('class','icon-chevron-sign-up');
				};
			}
		});
		global_jobscheduler_general.run_mode = run_mode;
		
        var cur_id = 'portal-pbs-params-workdir';
		//fluent bin
		var o_prog = [];
        if(!Gv.isEmpty(s_prog)){
            for(var i in s_prog){
                if(!Gv.isEmpty(s_prog[i]))
                    o_prog.push({id:s_prog[i],text:s_prog[i]});
            }
        }
        fluent_bin = new Gv.form.ComboBox({
            renderTo: 'page-portal-fluent-bin-path',
            fieldLabel: '<font color="#FF0000">*</font>Fluent Bin',
            allowBlank:false,
            value: program,
            autoLoad:false,
            data:o_prog
        });

        this.fluent_params.push(fluent_bin);
		global_jobscheduler_general.fluent_bin=fluent_bin;
		//fluent bin browers button
		new Gv.Button({
            renderTo: 'page-portal-WorkingDIR-Select-fluent',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            o_prog.push({id:obj,text:obj});
                            fluent_bin.data(o_prog);
                            fluent_bin.value(obj);
							fluent_bin.validate();
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
		//Dimension select
        var o_version = [];
        if (!Gv.isEmpty(s_version)) {
            for(var i in s_version){
                o_version.push({id:s_version[i],text:s_version[i]});
            }
        };
		dimension_select = new Gv.form.ComboBox({
            renderTo: 'page-portal-fluent-version',
            fieldLabel: '<font color="#FF0000">*</font>Dimension',
            readOnly: false,
			allowBlank:false,
            //width: 540,
            value: version,
            autoLoad:false,
            data:o_version
        });
        this.fluent_params.push(dimension_select);
		global_jobscheduler_general.dimension_select=dimension_select;
		//Precision radio
		precision_radio = new Gv.form.RadioGroup({
			id:'page-portal-fluent-precision-radio',
            renderTo: 'page-portal-fluent-precision',
            defualtName: 'precision',
            items: [{
                id: 'portal_fluent_parames_precision_double',
                value: 'double',
                fieldLabel: 'Double'
            }, {
                id: 'portal_fluent_parames_precision_float',
                value: 'single',
                fieldLabel: 'Single',
				checked:true
            }]
        });
		global_jobscheduler_general.precision_radio=precision_radio;
		//mpi type select
        var o_mpi=[];
        if(!Gv.isEmpty(s_mpi)){
            for(var i in s_mpi){
                o_mpi.push({id:s_mpi[i],text:s_mpi[i]});
            }
        }
		mpitype_select = new Gv.form.ComboBox({
            renderTo: 'page-portal-fluent-mpi-type',
            fieldLabel: '<font color="#FF0000">*</font>MPI Type',
            readOnly: false,
			allowBlank:false,
            //width: 540,
            value: mpitype,
            autoLoad:false,
            data:o_mpi
        });
        this.fluent_params.push(mpitype_select);
		global_jobscheduler_general.mpitype_select=mpitype_select;
		//remote shell radio
		remote_shell_radio = new Gv.form.RadioGroup({
			id:'page-portal-fluent-remote-shell',
            renderTo: 'page-portal-fluent-remote-shell',
            defualtName: 'remote-shell',
            items: [{
                id: 'portal_fluent_parames_remote_shell_ssh',
                value: 'ssh',
                fieldLabel: 'SSH',
                checked: true
            }, {
                id: 'portal_fluent_parames_remote_shell_rsh',
                value: 'rsh',
                fieldLabel: 'RSH'
            }]
        });
		global_jobscheduler_general.remote_shell_radio=remote_shell_radio;
		//arguments
		arguments_input = new Gv.form.TextField({
            renderTo: 'page-portal-Arguments',
            fieldLabel: 'Arguments',
            allowBlank: true,
            bodyStyle: ''
            //width: 540
        });
        this.fluent_params.push(arguments_input);
		global_jobscheduler_general.arguments_input=arguments_input;
		//work dir
		input_workdir = new Gv.form.TextField({
            renderTo: 'page-portal-WorkingDIR',
            fieldLabel: '<font color="#FF0000">*</font>Working DIR',
            allowBlank: true,
            value: workdir,
            bodyStyle: ''
            //width: 540
        });
        this.fluent_params.push(input_workdir);
		global_jobscheduler_general.input_workdir=input_workdir;
		//work dir button
		new Gv.Button({
            renderTo: 'page-portal-WorkingDIR-Select',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            input_workdir.value(obj);
							input_workdir.validate();
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
		
		//output file
        var outputFile = new Gv.form.TextField({
            id: 'portal-pbs-params-output',
            renderTo: 'page-portal-OutputFile',
            fieldLabel: '<font color="#FF0000">*</font>Output File',
            allowBlank: false,
            value: PORTALNAM + "_" + portal_time_stamp + '.txt',
            bodyStyle: '',
            //width: 540,
            listeners: {
                focus: function(v) {},
                focusout: function(v) {}
            }

        });
        this.fluent_params.push(outputFile);
		global_jobscheduler_general.outputFile=outputFile;
    },
	initBatchModeParams:function(){
		//jou file input
		input_jou_file = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-bmp-jou-file-input',
            fieldLabel: '<font color="#FF0000">*</font>Jou File',
            allowBlank: false,
            value: PORTALNAM + "_" + portal_time_stamp + '.jou',
            bodyStyle: '',
			disabled:false
           // width: 540
        });
        this.fluent_params.push(input_jou_file);
		global_jobscheduler_general.input_jou_file=input_jou_file;
		//jou file radio
		radio_jou_file = new Gv.form.RadioGroup({
	    id:'portal_fluent_batch_mode_parames_time_type',
            renderTo: 'page-portal-fluent-bmp-jou-file-radio',
            defualtName: 'jou-file',
            items: [{
                id: 'portal_fluent_batch_mode_parames_dingchang',
                value: 'steady',
                fieldLabel: 'steady',
                checked: true,
				disabled:false,
				handler:function(){
					input_iteration_step_num.disabled(false);
					input_data_save.disabled(false);
					input_data_file.disabled(false);
					btn2.disabled(false);
					
					input_time_step.disabled(true);
					input_time_step_num.disabled(true);
					input_autosave_step_num.disabled(true);
					input_max_iterations.disabled(true);
				}
            }, {
                id: 'portal_fluent_batch_mode_parames_no_dingchang',
                value: 'translent',
                fieldLabel: 'translent',
				disabled:false,
				handler:function(){
					input_iteration_step_num.disabled(true);
					input_data_save.disabled(true);
					input_data_file.disabled(true);
					btn2.disabled(true);
					
					input_time_step.disabled(false);
					input_time_step_num.disabled(false);
					input_autosave_step_num.disabled(false);
					input_max_iterations.disabled(false);
				}
            }]
        });
		global_jobscheduler_general.radio_jou_file=radio_jou_file;
        
		//cas file
		input_case_file = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-bmp-case-file',
            fieldLabel: 'Cas File',
            allowBlank: true,
            regex:/.+.cas$/i,
            //regex:/.*(?!\.cas)$/,
			disabled:false,
            regexText:'非法cas文件',
            emptyText:'文件后缀为.cas,不区分大小写'
            //width: 540
        });
        this.fluent_params.push(input_case_file);
		global_jobscheduler_general.input_case_file=input_case_file;
		//与data save 关联
		$("#"+input_case_file.getId()).bind('keyup',function(){
            var r = input_case_file.validate();
            if(r){
                var obj = input_case_file.value();
                if(Gv.isEmpty(obj)){
                    input_data_save.value('');
                    input_data_save.validate();
                    input_data_save.disabled(true);
                    return;
                }
                var n = obj.substring(obj.lastIndexOf('/')+1,obj.lastIndexOf('.')) + '.dat';
                input_data_save.value(n);
                input_data_save.validate();
                input_data_save.disabled(false);
            }
		});
		//cas file buttion
		btn1 = new Gv.Button({
            renderTo: 'page-portal-fluent-case-file-dir-select',
            cls:'button',
            text:'Browse...',
			disabled:false,
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            input_case_file.value(obj);
                            var r = input_case_file.validate();
                            if(r){
                                var n = obj.substring(obj.lastIndexOf('/')+1,obj.lastIndexOf('.')) + '.dat';
                                input_data_save.value(n);
                            }
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
		
		//data file 
		input_data_file = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-bmp-data-file',
            fieldLabel: 'Dat File',
            regex:/.+.dat$/i,
            regexText:'非法dat文件',
            allowBlank: true,
			disabled:false,
            emptyText:'文件后缀为.dat,不区分大小写'
            //width: 540
        });
        this.fluent_params.push(input_data_file);
		global_jobscheduler_general.input_data_file=input_data_file;
		//data file button
		btn2 = new Gv.Button({
            renderTo: 'page-portal-fluent-data-file-dir-select',
            cls:'button',
            text:'Browse...',
			disabled:false,
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            input_data_file.value(obj);
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

		//time step
		input_time_step = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-time-step-input',
            fieldLabel: '<font color="#FF0000">*</font>Time Step Size(s)',
            allowBlank: false,
			labelWidth:195,
            value: '0.01',
            bodyStyle: '',
			disabled:true,
			regex:/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
			regexText:'只能输入大于0的数',
            //width: 540
        });
        this.fluent_params.push(input_time_step);
		global_jobscheduler_general.input_time_step=input_time_step;
		//time_step_number
		input_time_step_num = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-time-step-number',
            fieldLabel: '<font color="#FF0000">*</font>Number of Time Steps',
            allowBlank: false,
			labelWidth:195,
            value: '1000',
            bodyStyle: '',
			disabled:true,
			regex:/^[0-9]*[1-9][0-9]*$/,
			regexText:'只能输入正整数'
            //width: 540
        });
        this.fluent_params.push(input_time_step_num);
		global_jobscheduler_general.input_time_step_num=input_time_step_num;
		//iteration_step_number
		input_iteration_step_num = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-iteration-step-number',
            fieldLabel: '<font color="#FF0000">*</font>Number of Iterations',
            allowBlank: false,
			labelWidth:195,
            value: '1000',
            bodyStyle: '',
			disabled:false,
			regex:/^[0-9]*[1-9][0-9]*$/,
			regexText:'只能输入正整数'
            //width: 540
        });
        this.fluent_params.push(input_iteration_step_num);
		global_jobscheduler_general.input_iteration_step_num=input_iteration_step_num;
		//auto_save_step_number
		input_autosave_step_num = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-autosave-step-number',
            fieldLabel: '<font color="#FF0000">*</font>AutoSave Every(Time Steps)',
            allowBlank: false,
			labelWidth:195,
            value: '100',
            bodyStyle: '',
			disabled:true,
			regex:/^[0-9]*[1-9][0-9]*$/,
			regexText:'只能输入正整数'
            //width: 540
        });
        this.fluent_params.push(input_autosave_step_num);
		global_jobscheduler_general.input_autosave_step_num=input_autosave_step_num;
		//max iteartions
		input_max_iterations = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-max-iteration-time-steps',
            fieldLabel: '<font color="#FF0000">*</font>Max Iterations/Time Step',
            allowBlank: false,
			labelWidth:195,
            value: '20',
            bodyStyle: '',
			disabled:true,
			regex:/^[0-9]*[1-9][0-9]*$/,
			regexText:'只能输入正整数'
            //width: 540
        });
        this.fluent_params.push(input_max_iterations);
		global_jobscheduler_general.input_max_iterations=input_max_iterations;
		//dat save
		input_data_save = new Gv.form.TextField({
            renderTo: 'page-portal-fluent-data-save',
            fieldLabel: 'Dat Save',
            allowBlank: true,
            regex:/.+.dat$/i,
            regexText:'非法文件后缀',
			disabled:true,
            emptyText:'文件名与cas文件名相同,后缀为.dat'
            
        });
        this.fluent_params.push(input_data_save);
		global_jobscheduler_general.input_data_save=input_data_save;
		
	},
	bindEvent:function(){
		//提交
		$("#job-Submission-do").bind('click',function(){
			//基本参数校验，通用
			var submit_enable = true;
			for(var i in global_portal.component_validate) {
				if(! global_portal.component_validate[i]){
					submit_enable = false;
				}
			}
			//fluent 相关参数校验
			for(var o in global_jobscheduler_general.fluent_params){
				if(!global_jobscheduler_general.fluent_params[o].validate()){
					submit_enable=false;
				}
			}
			
			if(!submit_enable){
				Gv.msg.error({
					html : "作业提交失败,请检查作业调度参数是否完全符合要求！"
				});
				return false;
			}
            var isWindow = $("#"+global_jobscheduler_general.run_mode.getId())[0].checked;
			//提交参数
			var patest = {
				//Job Schedule Parameters
				"GAP_NNODES": Gv.get("portal-pbs-params-nnodes").val(),
				"GAP_PPN": Gv.get("portal-pbs-params-ppn").val(),
				"GAP_WALL_TIME": Gv.get("portal-pbs-params-time").val(),
				"GAP_QUEUE": Gv.get("portal-pbs-params-queue").val(),
				"GAP_NAME": Gv.get("portal-pbs-params-name").val(),
				//run parameters
				"GAP_RUN_MODE":$("#"+global_jobscheduler_general.run_mode.getId())[0].checked, //true or false
				"GAP_PROGRAM":global_jobscheduler_general.fluent_bin.value(),
				"GAP_DIMENSION":global_jobscheduler_general.dimension_select.value(),
				"GAP_PRECISION":global_jobscheduler_general.precision_radio.value()[0].value,
				"GAP_REMOTE_SHELL":global_jobscheduler_general.remote_shell_radio.value()[0].value,
				"GAP_MPI_TYPE":global_jobscheduler_general.mpitype_select.value(),
				"GAP_WORK_DIR":global_jobscheduler_general.input_workdir.value(),
				"GAP_ARGUMENTS":global_jobscheduler_general.arguments_input.value(),
				"GAP_OUTPUT_FILE":global_jobscheduler_general.outputFile.value(),
				//jou parameters
				"GAP_JOU_FILE":global_jobscheduler_general.input_jou_file.value(),
				"GAP_TIME":global_jobscheduler_general.radio_jou_file.value()[0].value,
				"GAP_CAS_FILE":global_jobscheduler_general.input_case_file.value(),
				"GAP_DAT_FILE":global_jobscheduler_general.input_data_file.value(),
				"GAP_DATA_SAVE":global_jobscheduler_general.input_data_save.value(),
				"GAP_TIME_STEP":global_jobscheduler_general.input_time_step.value(),
				"GAP_NUM_TIME_STEP":global_jobscheduler_general.input_time_step_num.value(),
				"GAP_NUM_ITERATIONS":global_jobscheduler_general.input_iteration_step_num.value(),
				"GAP_AUTO_SAVE_TIME_STEP":global_jobscheduler_general.input_autosave_step_num.value(),
				"GAP_MAX_ITERATIONS":global_jobscheduler_general.input_max_iterations.value(),
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
			console.log(patest);
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
					global_jobscheduler_general.outputFile.value(PORTALNAM + "_" + new_time_stamp + '.txt');
					global_jobscheduler_general.input_jou_file.value(PORTALNAM + "_" + new_time_stamp + '.jou');
				},

				failure: function(response, options) {
					Gv.msg.error({
						html: "请求作业提交失败!"
					});
				}
			});
			
			
		});
		//重置
		$("#job-Submission-preset").bind('click',function(){
			//Job Schedule Parameters
			var portal_reset_timestamp = gen_time_identify_string();
			$("#portal-pbs-params-nnodes").val(numnodes);
			$("#portal-pbs-params-ppn").val(numppn);
			$("#portal-pbs-params-time").val(hours + ":" + minutes + ":" + seconds);
			$("#portal-pbs-params-queue").val(queueJsonData[0].text);
			$("#portal-pbs-params-name").val(PORTALNAM + "_" + portal_reset_timestamp);
			//run parameters and jou parameters
			if(!$("#"+global_jobscheduler_general.run_mode.getId())[0].checked){
				$("#"+global_jobscheduler_general.run_mode.getId())[0].checked=true;
			}
			$('#page-portal-fluent-batch-mode-parames').removeClass('active');
			$('#page-portal-fluent-batch-mode-parames i').attr('class','icon-chevron-sign-down');
			
			global_jobscheduler_general.fluent_bin.value(program);
			$("#portal_fluent_parames_precision_float")[0].checked=true;
			$("#portal_fluent_parames_remote_shell_ssh")[0].checked=true;
			
			global_jobscheduler_general.dimension_select.value(version); 
			global_jobscheduler_general.mpitype_select.value(mpitype);
			global_jobscheduler_general.input_workdir.value(workdir);
			global_jobscheduler_general.arguments_input.value('');
			global_jobscheduler_general.outputFile.value(PORTALNAM + "_" + portal_reset_timestamp + '.txt');
			
			global_jobscheduler_general.input_jou_file.value(PORTALNAM + "_" + portal_reset_timestamp + '.jou');
			$("#portal_fluent_batch_mode_parames_dingchang").click();
			global_jobscheduler_general.input_case_file.value('');
			global_jobscheduler_general.input_data_file.value('');
			global_jobscheduler_general.input_data_save.value('');
			global_jobscheduler_general.input_time_step.value('0.01');
			global_jobscheduler_general.input_time_step_num.value('1000');
			global_jobscheduler_general.input_iteration_step_num.value('1000');
			global_jobscheduler_general.input_autosave_step_num.value('100');
			global_jobscheduler_general.input_max_iterations.value('20');
			//Remote Visualization Parameters
			$("#portal-pbs-params-vnc")[0].checked=false;
			$('#page-portal-vnc').removeClass('active');
			$('#page-portal-vnc i').attr('class','icon-chevron-sign-down');
			
			//Checkpoint/Restart Parameters
			if($("#portal-pbs-params-checkpoint")[0]){
				$("#portal-pbs-params-checkpoint")[0].checked=false;
			}
			$("#portal-pbs-params-interval").val("240");
			$('#page-portal-chkpoint').removeClass('active');
			$('#page-portal-chkpoint i').attr('class','icon-chevron-sign-down');
			//Advanced Parameters
			$('#page-portal-advanced').removeClass('active');
			$('#page-portal-advanced i').attr('class','icon-chevron-sign-down');
			$("#portal-pbs-params-pbsAdvOpt").val('');
			$("#portal-pbs-params-preCommands").val('');
			$("#portal-pbs-params-postCommands").val('');
			
			//validate again
			for(var comp_id in global_portal.component_validate) {
				$("#"+comp_id).trigger("focusout");
			}
			for(var o in global_jobscheduler_general.fluent_params){
				global_jobscheduler_general.fluent_params[o].validate();
			}
			
		});
		
	},
    onReady: function() {
        global_jobscheduler_general.initrunparams();
		global_jobscheduler_general.initBatchModeParams();
		global_jobscheduler_general.bindEvent();
    }
};


$(function() {
    global_jobscheduler_general.onReady();
});
