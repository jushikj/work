var global_jobscheduler_general = {
    initrunparams: function() {
        program_id = 'portal-pbs-params-program';
        input_run_script = new Gv.form.TextArea({
            id: 'portal-pbs-params-program',
            renderTo: 'page-portal-Program',
            fieldLabel: 'Run Script:',
            readOnly: false,
            value: program,
            allowBlank: false,
            labelWidth: 125,
            width: 540
        });

        var cur_id = 'portal-pbs-params-workdir';
        input_workdir = new Gv.form.TextFieldSelect({
            renderTo: 'page-portal-WorkingDIR',
            fieldLabel: 'WorkingDIR:',
            id: 'portal-pbs-params-workdir',
            readOnly: false,
            width: 540,
            value: workdir,
            autoLoad:false,
            data:workdir_list.split(":")
        });
        workdir_button = new Gv.Button({
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
                            Gv.get('portal-pbs-params-workdir').val(obj);
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
            id: 'portal-pbs-params-output',
            renderTo: 'page-portal-OutputFile',
            fieldLabel: 'Output File:',
            allowBlank: true,
            value: PORTALNAM + "_" + portal_time_stamp + '.txt',
            bodyStyle: '',
            width: 6,
            width: 540,
            listeners: {
                focus: function(v) {},
                focusout: function(v) {}
            }

        });
    },
    onReady: function() {
        global_jobscheduler_general.initrunparams();
    }
};


$(function() {
    global_jobscheduler_general.onReady();
});
