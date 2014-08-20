var global_jobscheduler_portal_abaqus = {

	abaqus_run_components:[], //run parameters components
	abaqus_bin_data:[],
	abaqus_Parallelization_Method_data:[],
	abaqus_Explicit_Precision_data:[],
	abaqus_Parallel_Mode_data:[],

    abaqus_components_standard:[],
    abaqus_components_explicit:[],

	buildRunParameters:function(){
		// build run parameters components
		// run mode
		abaqus_run_mode = new Gv.form.Checkbox({
	      renderTo:'page-portal-abaqus-run-mode',
	      fieldLabel:'Window',
	      checked:false,
	      handler:function(d,v){
	        if($("#"+abaqus_run_mode.getId())[0].checked){
                
                global_jobscheduler_portal_abaqus.abaqus_parallel_mode.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_mode.disabled(true);                
                global_jobscheduler_portal_abaqus.abaqus_gpu.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_output_precision.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_job_name.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_maximum.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_maximum_t.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_number_domain.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_explicit_precision.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_parallelization_method.disabled(true);
                global_jobscheduler_portal_abaqus.abaqus_input_file.disabled(true);

                global_jobscheduler_portal_abaqus.abaqus_input_btn.disabled(true);

            }else {
                global_jobscheduler_portal_abaqus.abaqus_parallel_mode.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_mode.disabled(false);
                if(global_jobscheduler_portal_abaqus.abaqus_mode.value()[0].value=="standard"){
                    global_jobscheduler_portal_abaqus.abaqus_maximum.disabled(false);
                    global_jobscheduler_portal_abaqus.abaqus_maximum_t.disabled(false);
                }else {
                    global_jobscheduler_portal_abaqus.abaqus_number_domain.disabled(false);
                    global_jobscheduler_portal_abaqus.abaqus_explicit_precision.disabled(false);
                    global_jobscheduler_portal_abaqus.abaqus_parallelization_method.disabled(false);
                }
                                
                global_jobscheduler_portal_abaqus.abaqus_gpu.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_output_precision.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_job_name.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_input_file.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_input_btn.disabled(false);
            }
	      }
	    });
	    this.abaqus_run_mode=abaqus_run_mode;

	    // parallel mode
	    var o_d3 = [];
        for(var i in s_parallel_mode){
        	if(!Gv.isEmpty(s_parallel_mode[i])){
        		o_d3.push({id:s_parallel_mode[i],text:s_parallel_mode[i]});
        	}
        }
        this.abaqus_Parallel_Mode_data=o_d3;
	    abaqus_parallel_mode = new Gv.form.ComboBox({
            renderTo: 'page-portal-abaqus-parallel-mode',
            fieldLabel: '<font color="#FF0000">*</font>Parallel Mode',
            allowBlank:false,
            //labelWidth:125,
            value: parallel_mode_default,
            autoLoad:false,
            data:o_d3
        });
        this.abaqus_parallel_mode=abaqus_parallel_mode;
	    this.abaqus_components_explicit.push(abaqus_parallel_mode);
        this.abaqus_components_standard.push(abaqus_parallel_mode);

    	// abaqus bin
    	var o_mpiProg = [];
	    if(!Gv.isEmpty(s_mpiProg)){
	        for(var i in s_mpiProg){
	          if(!Gv.isEmpty(s_mpiProg[i])){
	            o_mpiProg.push({id:s_mpiProg[i],text:s_mpiProg[i]});
	          }
	        }
	    }
	    this.abaqus_bin_data=this.abaqus_bin_data.concat(o_mpiProg);
    	abaqus_bin = new Gv.form.ComboBox({
            renderTo: 'page-portal-abaqus-bin',
            fieldLabel: '<font color="#FF0000">*</font>ABAQUS Bin',
            allowBlank:false,
            //labelWidth:125,
            value: file,
            autoLoad:false,
            data:o_mpiProg
        });
        this.abaqus_bin=abaqus_bin;
    	this.abaqus_run_components.push(abaqus_bin);
    	// browse...
    	new Gv.Button({
            renderTo: 'page-portal-abaqus-bin-select-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: abaqus_bin.value(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            o_mpiProg.push({id:obj,text:obj});
                            abaqus_bin.data(o_mpiProg);
                            abaqus_bin.value(obj);
                            abaqus_bin.validate();
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

		// work dir
   		abaqus_work_dir = new Gv.form.TextFieldSelect({
            renderTo: 'page-portal-abaqus-work-dir',
            fieldLabel: '<font color="#FF0000">*</font>WorkingDIR:',
            readOnly: false,
            //width: 540,
            value: workdir,
            autoLoad:false,
             data:workdir_list.split(":")
          });
   		this.abaqus_work_dir=abaqus_work_dir;
   		this.abaqus_run_components.push(abaqus_work_dir);
   		// browse...
   		new Gv.Button({
            renderTo: 'page-portal-abaqus-workdir-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: abaqus_work_dir.value(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            abaqus_work_dir.value(obj);
                            abaqus_work_dir.validate();
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
    	abaqus_arguments = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-arguments',
            fieldLabel: 'Arguments',
            //labelWidth:125,
            allowBlank: true
    	});
    	this.abaqus_arguments=abaqus_arguments;

    	// output file
    	abaqus_output_file = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-output-file',
            fieldLabel: '<font color="#FF0000">*</font>Output Log',
            allowBlank: false,
            value: PORTALNAM + "_" + portal_time_stamp + '.log'
        });
        this.abaqus_output_file = abaqus_output_file;
        this.abaqus_run_components.push(abaqus_output_file);

        //mode
        abaqus_mode = new Gv.form.RadioGroup({
            id:'page-portal-abaqus-mode-raido',
            renderTo: 'page-portal-abaqus-mode',
            defualtName: 'hpcrun',
            items: [{
                id: 'page-portal-abaqus-mode-standard',
                value: 'standard',
                fieldLabel: 'standard',
                checked:true
            }, {
                id: 'page-portal-abaqus-mode-explicit',
                value: 'explicit',
                fieldLabel: 'explicit'
            }]
    	});
    	this.abaqus_mode = abaqus_mode;
    	// bindevent
    	$("#"+abaqus_mode.getId()+" input").bind('click',function(){
	        if(this.value=='standard'){
	            global_jobscheduler_portal_abaqus.abaqus_maximum.disabled(false);
	            global_jobscheduler_portal_abaqus.abaqus_maximum_t.disabled(false);
	            global_jobscheduler_portal_abaqus.abaqus_number_domain.disabled(true);
	            global_jobscheduler_portal_abaqus.abaqus_parallelization_method.disabled(true);
	            global_jobscheduler_portal_abaqus.abaqus_explicit_precision.disabled(true);

	        } else {
	            global_jobscheduler_portal_abaqus.abaqus_maximum.disabled(true);
	            global_jobscheduler_portal_abaqus.abaqus_maximum_t.disabled(true);
	            global_jobscheduler_portal_abaqus.abaqus_number_domain.disabled(false);
	            global_jobscheduler_portal_abaqus.abaqus_parallelization_method.disabled(false);
	            global_jobscheduler_portal_abaqus.abaqus_explicit_precision.disabled(false);
	        }
	    });

    	//gpu
    	abaqus_gpu = new Gv.form.Checkbox({
	      renderTo:'page-portal-abaqus-gpu',
	      fieldLabel:'GPU',
	      checked:false
	    });
        this.abaqus_gpu=abaqus_gpu;
	    //output precision
	    abaqus_output_precision = new Gv.form.RadioGroup({
            id:'page-portal-abaqus-output-precision-raido',
            renderTo: 'page-portal-abaqus-output-precision',
            defualtName: 'PRECISION',
            items: [{
                id: 'page-portal-abaqus-output-precision-single',
                value: 'single',
                fieldLabel: 'Single',
                checked:true
            }, {
                id: 'page-portal-abaqus-output-precision-full',
                value: 'full',
                fieldLabel: 'Full'
            }]
    	});
        this.abaqus_output_precision=abaqus_output_precision;
    	// Maximum preprocessor and analysis memory
    	abaqus_maximum = new Gv.form.TextField({
            renderTo: 'page-poral-abaqus-mpaam',
            fieldLabel: '<font color="#FF0000">*</font>Maximum preprocessor and analysis memory',
            allowBlank: false,
            labelWidth:300,
            regex:/^\d+$/,
            regexText:'请输入非负整数',
            value:preprocessor_memory
        });
        this.abaqus_maximum=abaqus_maximum;
        this.abaqus_components_standard.push(abaqus_maximum);

        //comb
        abaqus_maximum_t = new Gv.form.ComboBox({
            renderTo: 'page-poral-abaqus-mpaam-t',
            allowBlank:true,
            autoLoad:false,
            labelWidth:0,
            width:60,
            data:[{id:'%',text:'%'},{id:'MB',text:'MB'},{id:'GB',text:'GB'}],
            listeners:{
                change:function(d,v){
                    if(d=="%"){
                        abaqus_maximum.value(preprocessor_memory);
                    }else {
                        abaqus_maximum.value('');
                    }
                    abaqus_maximum.validate();
                }
            }
        });
        this.abaqus_maximum_t=abaqus_maximum_t;

        // job name
        abaqus_job_name = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-job-name',
            fieldLabel: '<font color="#FF0000">*</font>Job Name',
            allowBlank: false,
            emptyText:'默认和Input File文件名相同',
            value:''
        });
        this.abaqus_job_name=abaqus_job_name;
        this.abaqus_components_standard.push(abaqus_job_name);
        this.abaqus_components_explicit.push(abaqus_job_name);

        // number of domain
        abaqus_number_domain = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-number-of-domain',
            fieldLabel: '<font color="#FF0000">*</font>Number Of Domain',
            allowBlank: false,
            value:numppn*numnodes,
            regex:/^\d+$/,
            regexText:'请输入非负整数',
            labelWidth:155,
            disabled:true
        });
        this.abaqus_number_domain=abaqus_number_domain;
        this.abaqus_components_explicit.push(abaqus_number_domain);

        //Parallelization Method
        var o_d1 = [];
        for(var i in s_parallelization_method){
        	if(!Gv.isEmpty(s_parallelization_method[i])){
        		o_d1.push({id:s_parallelization_method[i],text:s_parallelization_method[i]});
        	}
        }
        this.abaqus_Parallelization_Method_data=o_d1;
        abaqus_parallelization_method = new Gv.form.ComboBox({
            renderTo: 'page-portal-abaqus-parallelization-method',
            fieldLabel:'<font color="#FF0000">*</font>Parallelization Method',
            allowBlank:false,
            autoLoad:false,
            disabled:true,
            value:parallelization_method_default,
            labelWidth:155,
            data:o_d1
        });
        this.abaqus_parallelization_method=abaqus_parallelization_method;
        this.abaqus_components_explicit.push(abaqus_parallelization_method);

        //Explicit Precision
        var o_d2 = [];
        for(var i in s_explicit_precision){
        	if(!Gv.isEmpty(s_explicit_precision[i])){
        		o_d2.push({id:s_explicit_precision[i],text:s_explicit_precision[i]});
        	}
        }
        this.abaqus_Explicit_Precision_data=o_d2;
        abaqus_explicit_precision = new Gv.form.ComboBox({
            renderTo: 'page-portal-abaqus-explicit-precision',
            fieldLabel:'<font color="#FF0000">*</font>Explicit Precision',
            allowBlank:false,
            autoLoad:false,
            disabled:true,
            labelWidth:155,
            value:explicit_precision_default,
            data:o_d2
        });
        this.abaqus_explicit_precision=abaqus_explicit_precision;
        this.abaqus_components_explicit.push(abaqus_explicit_precision);

        // input file
        
    	abaqus_input_file = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-input-file',
            fieldLabel: '<font color="#FF0000">*</font>Input File',
            allowBlank: false,
            regex:/.+.inp$/,
            regexText:'文件后缀只能为.inp',
            emptyText:'文件后缀为.inp'
   		});
   		this.abaqus_input_file=abaqus_input_file;
   		this.abaqus_components_explicit.push(abaqus_input_file);
        this.abaqus_components_standard.push(abaqus_input_file);
        // bindEvent
        $("#"+abaqus_input_file.getId()).bind('keyup',function(){
            var r = abaqus_input_file.validate();
            if(r){
                var val = abaqus_input_file.value();
                var n = val.substring(val.lastIndexOf("/")+1,val.lastIndexOf("."));
                global_jobscheduler_portal_abaqus.abaqus_job_name.value(global_jobscheduler_portal_abaqus.abaqus_job_name.value()+"_"+n);
                global_jobscheduler_portal_abaqus.abaqus_job_name.validate();
                            
            }
        });
        
   		// browse...
   		abaqus_input_btn = new Gv.Button({
            renderTo: 'page-portal-abaqus-input-file-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: abaqus_work_dir.value(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            abaqus_input_file.value(obj);
                            var r = abaqus_input_file.validate();
                            if(r){
                                
                                var n = obj.substring(obj.lastIndexOf("/")+1,obj.lastIndexOf("."));
                                if(Gv.isEmpty(global_jobscheduler_portal_abaqus.abaqus_job_name.value())){
                                    global_jobscheduler_portal_abaqus.abaqus_job_name.value(n);
                                    global_jobscheduler_portal_abaqus.abaqus_job_name.validate();
                                }
                                
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
        this.abaqus_input_btn=abaqus_input_btn;
	},
	bindEvents:function(){
		// submit
		$("#job-Submission-do").bind('click',function(){
			//basic validate
		    var submit_enable = true;
		    for(var i in global_portal.component_validate) {
		      if(! global_portal.component_validate[i]){
		        submit_enable = false;
		      }
		    }
		    //run parameters
            var validateParams = [];
            var isW = $("#"+global_jobscheduler_portal_abaqus.abaqus_run_mode.getId())[0].checked;
            if(isW){
                validateParams = global_jobscheduler_portal_abaqus.abaqus_run_components;
            } else {
                var mode = global_jobscheduler_portal_abaqus.abaqus_mode.value()[0].value;
                if(mode == "standard"){
                    validateParams=global_jobscheduler_portal_abaqus.abaqus_components_standard;
                } else {
                    validateParams=global_jobscheduler_portal_abaqus.abaqus_components_explicit;
                }
            }
		    $.each(validateParams,function(n,o){
                if(!o.validate())
                    submit_enable=false;
            });

		    if(!submit_enable){
		        Gv.msg.error({
		          html : "作业提交失败,请检查作业调度参数是否完全符合要求！"
		        });
		        return false;
      		}
      		var isWindow = $("#"+global_jobscheduler_portal_abaqus.abaqus_run_mode.getId())[0].checked;
      		//submit params
		      var patest = {
		        //Job Schedule Parameters
		        "GAP_NNODES": Gv.get("portal-pbs-params-nnodes").val(),
		        "GAP_PPN": Gv.get("portal-pbs-params-ppn").val(),
		        "GAP_WALL_TIME": Gv.get("portal-pbs-params-time").val(),
		        "GAP_QUEUE": Gv.get("portal-pbs-params-queue").val(),
		        "GAP_NAME": Gv.get("portal-pbs-params-name").val(),
		        
		        //run parameters
		        "GAP_PROGRAM"		   : global_jobscheduler_portal_abaqus.abaqus_bin.value(),
		        "GAP_PARALLEL_MODE"    : global_jobscheduler_portal_abaqus.abaqus_parallel_mode.value(),
		        "GAP_WORK_DIR"	       : global_jobscheduler_portal_abaqus.abaqus_work_dir.value(),
		        "GAP_PROGRAM_ARG"	   : global_jobscheduler_portal_abaqus.abaqus_arguments.value(),
		        "GAP_OUTPUT"		   : global_jobscheduler_portal_abaqus.abaqus_output_file.value(),
                
                // env parameters
                "GAP_MODE"			   : global_jobscheduler_portal_abaqus.abaqus_mode.value()[0].value,
                "GAP_GPU"			   : $("#"+global_jobscheduler_portal_abaqus.abaqus_gpu.getId())[0].checked?1:0,
                "GAP_OUTPUT_PRECISION" : global_jobscheduler_portal_abaqus.abaqus_output_precision.value()[0].value,
                "GAP_NUMBER_DOMAIN"	   : global_jobscheduler_portal_abaqus.abaqus_number_domain.value(),
                "GAP_PRALLEL_METHOD"   : global_jobscheduler_portal_abaqus.abaqus_parallelization_method.value(),
                "GAP_JOB_NAME"		   : global_jobscheduler_portal_abaqus.abaqus_job_name.value(),
                "GAP_MAX_MEMORY"	   : global_jobscheduler_portal_abaqus.abaqus_maximum.value(),
                "GAP_MAX_MEMORY_T"	   : global_jobscheduler_portal_abaqus.abaqus_maximum_t.value(),
                "GAP_EXPLICIT_PRECISION":global_jobscheduler_portal_abaqus.abaqus_explicit_precision.value(),
                "GAP_INPUT"		       : global_jobscheduler_portal_abaqus.abaqus_input_file.value(),

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
		          global_jobscheduler_portal_abaqus.abaqus_output_file.value(PORTALNAM + "_" + new_time_stamp + '.log');
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
	      	
            $("#"+global_jobscheduler_portal_abaqus.abaqus_run_mode.getId())[0].checked=false;

            global_jobscheduler_portal_abaqus.abaqus_bin.data(global_jobscheduler_portal_abaqus.abaqus_bin_data);
            global_jobscheduler_portal_abaqus.abaqus_bin.value(file);
            global_jobscheduler_portal_abaqus.abaqus_parallel_mode.data(global_jobscheduler_portal_abaqus.abaqus_Parallel_Mode_data);
            global_jobscheduler_portal_abaqus.abaqus_parallel_mode.value(parallel_mode_default);
            global_jobscheduler_portal_abaqus.abaqus_work_dir.data(workdir_list);
            global_jobscheduler_portal_abaqus.abaqus_work_dir.value(workdir);
            global_jobscheduler_portal_abaqus.abaqus_arguments.value('');
            global_jobscheduler_portal_abaqus.abaqus_output_file.value(PORTALNAM + "_" + portal_reset_timestamp + '.log');

            $("#page-portal-abaqus-mode-standard")[0].checked=true;
            $("#"+global_jobscheduler_portal_abaqus.abaqus_gpu.getId())[0].checked=false;
            $("#page-portal-abaqus-output-precision-single")[0].checked=true;
            global_jobscheduler_portal_abaqus.abaqus_job_name.value('');
            global_jobscheduler_portal_abaqus.abaqus_maximum.value(preprocessor_memory);
            global_jobscheduler_portal_abaqus.abaqus_maximum_t.value('%');
            global_jobscheduler_portal_abaqus.abaqus_number_domain.value(numppn*numnodes);
            global_jobscheduler_portal_abaqus.abaqus_explicit_precision.data(global_jobscheduler_portal_abaqus.abaqus_Explicit_Precision_data);
            global_jobscheduler_portal_abaqus.abaqus_explicit_precision.value(explicit_precision_default);
            global_jobscheduler_portal_abaqus.abaqus_parallelization_method.data(global_jobscheduler_portal_abaqus.abaqus_Parallelization_Method_data);
            global_jobscheduler_portal_abaqus.abaqus_parallelization_method.value(parallelization_method_default);
            global_jobscheduler_portal_abaqus.abaqus_input_file.value('');
            
            global_jobscheduler_portal_abaqus.abaqus_parallel_mode.disabled(false);
            global_jobscheduler_portal_abaqus.abaqus_mode.disabled(false);
            if(global_jobscheduler_portal_abaqus.abaqus_mode.value()[0].value=="standard"){
                global_jobscheduler_portal_abaqus.abaqus_maximum.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_maximum_t.disabled(false);
            }else {
                global_jobscheduler_portal_abaqus.abaqus_number_domain.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_explicit_precision.disabled(false);
                global_jobscheduler_portal_abaqus.abaqus_parallelization_method.disabled(false);
            }
                            
            global_jobscheduler_portal_abaqus.abaqus_gpu.disabled(false);
            global_jobscheduler_portal_abaqus.abaqus_output_precision.disabled(false);
            global_jobscheduler_portal_abaqus.abaqus_job_name.disabled(false);
            global_jobscheduler_portal_abaqus.abaqus_input_file.disabled(false);
            global_jobscheduler_portal_abaqus.abaqus_input_btn.disabled(false);

	      	//Checkpoint/Restart Parameters
	      	if($("#portal-pbs-params-checkpoint")[0]){
	        	$("#portal-pbs-params-checkpoint")[0].checked=false;
	      	}
            if($("#portal-pbs-params-interval")){
                $("#portal-pbs-params-interval").val("240");
            }
	      	
	      	//Advanced Parameters
	      	$("#portal-pbs-params-pbsAdvOpt").val('');
	      	$("#portal-pbs-params-preCommands").val('');
	      	$("#portal-pbs-params-postCommands").val('');

	      	//validate again
	      	for(var comp_id in global_portal.component_validate) {
	        	$("#"+comp_id).trigger("focusout");
	      	}
	      	$.each(global_jobscheduler_portal_abaqus.abaqus_run_components,function(n,o){
	      		o.validate();
	      	});
            $.each(global_jobscheduler_portal_abaqus.abaqus_components_standard,function(n,o){
                var r = o.validate();
                if(!r){
                    o.removeError();
                    o.removeErrorTips();
                }
            });
            $.each(global_jobscheduler_portal_abaqus.abaqus_components_explicit,function(n,o){
                var r = o.validate();
                if(!r){
                    o.removeError();
                    o.removeErrorTips();
                }
            });

		});

        //预设参数
        $("#job-Submission-predefine").bind('click',function(){
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
                height: 320,
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

	ready:function(){
		this.buildRunParameters();
		this.bindEvents();
	}
}
$(function(){
	global_jobscheduler_portal_abaqus.ready();
});