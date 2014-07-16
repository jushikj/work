var global_jobscheduler_portal_abaqus = {

	abaqus_run_components:[], //run parameters components
	abaqus_bin_data:[],

	buildRunParameters:function(){
		// build run parameters components
		// run mode
		abaqus_run_mode = new Gv.form.Checkbox({
	      renderTo:'page-portal-abaqus-run-mode',
	      fieldLabel:'Window',
	      checked:true,
	      handler:function(d,v){
	        
	      }
	    });
	    this.abaqus_run_mode=abaqus_run_mode;

	    // mp mode
	    abaqus_mp_mode = new Gv.form.RadioGroup({
            id:'page-portal-abaqus-mp-mode-radio',
            renderTo: 'page-portal-abaqus-mp-mode',
            defualtName: 'mp-mode',
            items: [{
                id: 'page-portal-abaqus-mp-mode-mpi',
                value: 'MPI',
                fieldLabel: 'MPI'
            }, {
                id: 'page-portal-abaqus-mp-mode-threads',
                value: 'THREADS',
                fieldLabel: 'THREADS',
                checked:true
            }]
    	});
    	this.abaqus_mp_mode=abaqus_mp_mode;

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
            labelWidth:125,
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
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
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
		abaqus_work_dir = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-work-dir',
            fieldLabel: '<font color="#FF0000">*</font>Working DIR',
            allowBlank: false,
            value:workdir
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
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
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

    	// subroutine file
    	abaqus_subroutine_file = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-subroutine-file',
            fieldLabel: 'Subroutine File',
            labelWidth:125,
            allowBlank: true
   		});
    	this.abaqus_subroutine_file=abaqus_subroutine_file;
    	this.abaqus_run_components.push(abaqus_subroutine_file);
    	
    	// browse...
    	new Gv.Button({
            renderTo: 'page-portal-abaqus-subroutine-file-select-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            abaqus_subroutine_file.value(obj);
                            abaqus_subroutine_file.validate();
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
    	abaqus_input_file = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-input-file',
            fieldLabel: '<font color="#FF0000">*</font>Input File',
            allowBlank: false
   		});
   		this.abaqus_input_file=abaqus_input_file;
   		this.abaqus_run_components.push(abaqus_input_file);

   		// browse...
   		new Gv.Button({
            renderTo: 'page-portal-abaqus-input-file-btn',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-workdir').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            abaqus_input_file.value(obj);
                            abaqus_input_file.validate();
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
            labelWidth:125,
            allowBlank: true
    	});
    	this.abaqus_arguments=abaqus_arguments;

    	// output file
    	abaqus_output_file = new Gv.form.TextField({
            renderTo: 'page-portal-abaqus-output-file',
            fieldLabel: '<font color="#FF0000">*</font>Output File',
            allowBlank: false,
            value: PORTALNAM + "_" + portal_time_stamp + '.txt'
        });
        this.abaqus_output_file = abaqus_output_file;
        this.abaqus_run_components.push(abaqus_output_file);
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
		    $.each(global_jobscheduler_portal_abaqus.abaqus_run_components,function(n,o){
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
		        "GAP_MPI_NNODES": Gv.get("portal-pbs-params-nnodes").val(),
		        "GAP_MPI_PPN": Gv.get("portal-pbs-params-ppn").val(),
		        "GAP_MPI_WALL_TIME": Gv.get("portal-pbs-params-time").val(),
		        "GAP_MPI_QUEUE": Gv.get("portal-pbs-params-queue").val(),
		        "GAP_MPI_NAME": Gv.get("portal-pbs-params-name").val(),
		        
		        //run parameters
		        "GAP_MPI_REMOTE_SHELL" : "",
                "GAP_MPI_MPIRUNTYPE"   : "",
                "GAP_MPI_PARAMODE"     : global_jobscheduler_portal_abaqus.abaqus_mp_mode.value()[0].value,
                "GAP_MPI_INPUTTYPE"    : "",
                "GAP_MPI_PROGRAM"      : global_jobscheduler_portal_abaqus.abaqus_bin.value(),
                "GAP_MPI_PROGRAM_ARG"  : global_jobscheduler_portal_abaqus.abaqus_arguments.value(),
                "GAP_MPI_WORK_DIR"     : global_jobscheduler_portal_abaqus.abaqus_work_dir.value(),
                "GAP_MPI_INPUT"        : global_jobscheduler_portal_abaqus.abaqus_input_file.value(),
                "GAP_MPI_SUB"          : global_jobscheduler_portal_abaqus.abaqus_subroutine_file.value(),
                "GAP_MPI_OUTPUT"       : global_jobscheduler_portal_abaqus.abaqus_output_file.value(),
		        
		        //Remote Visualization Parameters
		        //"GAP_VNC": "\'" + Gv.get("portal-pbs-params-vnc").val()+"\'",
		        "GAP_MPI_VNC":isWindow?1:0,
		        //Checkpoint/Restart Parameters
		        "GAP_CHECK_POINT": "\'" + Gv.get("portal-pbs-params-checkpoint").val()+"\'",
		        "GAP_INTERVAL": "\'" + Gv.get("portal-pbs-params-interval").val() + "\'",
		        //Advanced Parameters
		        "GAP_MPI_PBS_OPT": "\'" + Gv.get("portal-pbs-params-pbsAdvOpt").val().replace(/\n/ig, '...') + "\'",
		        "GAP_MPI_PRE_CMD": "\'" + Gv.get("portal-pbs-params-preCommands").val().replace(/\n/ig, '...') + "\'",
		        "GAP_MPI_POST_CMD": "\'" + Gv.get("portal-pbs-params-postCommands").val().replace(/\n/ig, '...') + "\'"
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
		          global_jobscheduler_portal_abaqus.abaqus_output_file.value(PORTALNAM + "_" + new_time_stamp + '.txt');
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
	      	if(!$("#"+global_jobscheduler_portal_abaqus.abaqus_run_mode.getId())[0].checked){
				$("#"+global_jobscheduler_portal_abaqus.abaqus_run_mode.getId())[0].checked=true;
	      	}
	      	$("#page-portal-abaqus-mp-mode-threads")[0].checked=true;
	      	global_jobscheduler_portal_abaqus.abaqus_bin.data(global_jobscheduler_portal_abaqus.abaqus_bin_data);
	      	global_jobscheduler_portal_abaqus.abaqus_bin.value(file);
	      	global_jobscheduler_portal_abaqus.abaqus_work_dir.value(workdir);
	      	global_jobscheduler_portal_abaqus.abaqus_subroutine_file.value('');
	      	global_jobscheduler_portal_abaqus.abaqus_input_file.value('');
	      	global_jobscheduler_portal_abaqus.abaqus_arguments.value('');
	      	global_jobscheduler_portal_abaqus.abaqus_output_file.value(PORTALNAM + "_" + portal_reset_timestamp + '.txt');


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
	      	$.each(global_jobscheduler_portal_abaqus.abaqus_run_components,function(n,o){
	      		o.validate();
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