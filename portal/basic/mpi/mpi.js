var global_mpi_utils = {
    make_mpi_list_json: function() {
        mpiListJsonData = [];
        var mpiarray = mpi_list.split(":");
        for (var i = 0; i < mpiarray.length; i++) {
            mpiListJsonData.push({
                'id': mpiarray[i],
                'text': mpiarray[i]
            });
        }
    },
};
var global_jobscheduler_mpi = {
    initrunparams: function() {
        program_id = 'portal_pbs_params_program';
        global_mpi_utils.make_mpi_list_json();
        var mpi_type_select = new Gv.form.ComboBox({
            renderTo: 'page-portal-mpitype',
            id: 'portal_pbs_params_mpitype',
            name: 'portal-MPIType',
            fieldLabel: 'MPI Type',
            data: mpiListJsonData,
            blankText: mpi_default,
            autoLoad:false,
            width:540,
            listeners: {
                change: function(id, text) {
                    if (text == 'mpich2') {
                        global_portal_utils.set_checkbox_radiogroup_status("portal_pbs_params_communication_tcp", true);
                        $("#portal_pbs_params_communication_infiniband").attr("disabled", true);
                    } else if (text == 'cr_mpi') {
                        global_portal_utils.set_checkbox_radiogroup_status("portal-pbs-params-checkpoint", true);
                        $("#portal_pbs_params_communication_infiniband").attr("disabled", false);
                    } else {
                        $("#portal-pbs-params-checkpoint").attr("disabled", false);
                        $("#portal_pbs_params_communication_infiniband").attr("disabled", false);
                        global_portal_utils.set_checkbox_radiogroup_status("portal_pbs_params_communication_infiniband", true);
                    }
                }
            }
        });
        remoteShell_select = new Gv.form.RadioGroup({
            renderTo: 'page-portal-shell',
            id: 'portal_pbs_params_remote_shell',
            defualtName: 'remote_shell',
            items: [{
                id: 'portal_pbs_params_remote_shell_ssh',
                value: 'SSH',
                fieldLabel: 'SSH',
                checked: true
            }, {
                id: 'portal_pbs_params_remote_shell_rsh',
                value: 'RSH',
                fieldLabel: 'RSH'
            }]
        });
        communication_type_select = new Gv.form.RadioGroup({
            renderTo: 'page-portal-communication',
            id: 'portal_pbs_params_communication',
            defualtName: 'Communication',
            items: [{
                id: 'portal_pbs_params_communication_infiniband',
                value: 'InfiniBand',
                fieldLabel: 'InfiniBand',
                checked: true
            }, {
                id: 'portal_pbs_params_communication_tcp',
                value: 'TCP',
                fieldLabel: 'TCP'
            }]
        });
        mem_cpu_check = new Gv.form.CheckboxGroup({
            id: 'portal_pbs_params_mem_cpu',
            renderTo: 'page-portal-other',
            items: [{
                id: 'portal_pbs_params_share_memory',
                value: 'shareMem',
                name: '',
                fieldLabel: 'Share Memory',
                checked: true
            }, {
                id: 'portal_pbs_params_cpu_binding',
                value: 'cpuBinding',
                name: '',
                fieldLabel: 'CPU Binding',
                checked: true
            }]
        });

        var mpi_type_envfile_select = new Gv.form.TextFieldSelect({
            renderTo: 'page-portal-mpi-envfile',
            fieldLabel: 'MPI Envfile',
            id: 'portal_pbs_params_mpi_envfile',
            readOnly:false,
            width:540,
            autoLoad:false,
            value: mpi_envfile,
            data: mpi_envfile_list.split(":"),
        });
        envfile_button = new Gv.Button({
            renderTo: 'page-portal-mpi-envfile-Select',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var programRunFilePanel = new Gv.SelectFileWindow({
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            Gv.get('portal_pbs_params_mpi_envfile').val(obj);
                            programRunFilePanel.close();
                        }
                    }, {
                        text: '关闭',
                        handler: function() {
                            programRunFilePanel.close();
                        }
                    }]
                });
            }
        });

        program_input = new Gv.form.TextFieldSelect({
            renderTo: 'page-portal-Program',
            fieldLabel: 'MPI Program:',
            id: 'portal_pbs_params_program',
            readOnly: false,
            value: program,
            width:540,
            autoLoad:false,
            data:program_list.split(":")
        });
        program_button = new Gv.Button({
            renderTo: 'page-portal-Program-Select',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var programRunFilePanel = new Gv.SelectFileWindow({
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            Gv.get('portal_pbs_params_program').val(obj);
                            programRunFilePanel.close();
                        }
                    }, {
                        text: '关闭',
                        handler: function() {
                            programRunFilePanel.close();
                        }
                    }]
                });
            }
        });
        var program_argument = new Gv.form.TextField({
            id: 'portal_pbs_params_programarg',
            renderTo: 'page-portal-Arguments',
            name: 'portal-Arguments',
            fieldLabel: 'Arguments',
            allowBlank: true,
            bodyStyle: '',
            width:540,
            value: program_argument,
            listeners: {
                focus: function(v) {},
                focusout: function(v) {}
            }
        });

        var cur_id = 'portal_pbs_params_workdir';
        workingDir = new Gv.form.TextFieldSelect({
            id: cur_id,
            renderTo: 'page-portal-WorkingDIR',
            fieldLabel: 'WorkingDIR',
            readOnly: false,
            value: workdir,
            width:540,
            data: workdir_list.split(":")
        });
        workdir_button = new Gv.Button({
            renderTo: 'page-portal-WorkingDIR-Select',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var workdirRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal_pbs_params_workdir').val(),
                    isDir: true,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            Gv.get('portal_pbs_params_workdir').val(obj);
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

        var outputFile = new Gv.form.TextField({
            id: 'portal_pbs_params_output',
            renderTo: 'page-portal-OutputFile',
            fieldLabel: 'Output File:',
            allowBlank: true,
            value: PORTALNAM + "_" + portal_time_stamp + ".txt",
            bodyStyle: '',
            width:540,
            listeners: {
                focus: function(v) {},
                focusout: function(v) {}
            }
        });
        var mpi_options = new Gv.form.TextArea({
            id: 'portal-pbs-params-mpi-options',
            renderTo: 'page-portal-PBSOptions',
            name: 'portal-MPIOptions',
            fieldLabel: 'MPI Options',
            allowBlank: true,
            value: portal_mpioptions,
            maxLength: 12,
            labelWidth: 125,
            width: 540
        });
    },
    onReady: function() {
        global_jobscheduler_mpi.initrunparams();
    }
};


$(function() {
    global_jobscheduler_mpi.onReady();
});
