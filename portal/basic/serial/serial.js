var global_jobscheduler_serial = {
    url: {

    },
    initrunparams: function() {
        program_id = 'portal-pbs-params-program';
        input_program = new Gv.form.TextFieldSelect({
            renderTo: 'page-portal-Program',
            fieldLabel: 'Program:',
            id: 'portal-pbs-params-program',
            readOnly: false,
            width: 540,
            value: program,
	    autoLoad:false,
            data:program_list.split(":")
        });
        program_button = new Gv.Button({
            renderTo: 'page-portal-Program-Select',
            cls:'button',
            text:'Browse...',
            handler: function() {
                var programRunFilePanel = new Gv.SelectFileWindow({
                    defaultPath: Gv.get('portal-pbs-params-program').val(),
                    isDir: false,
                    tbar: [{
                        text: '确定',
                        handler: function(obj) {
                            Gv.get('portal-pbs-params-program').val(obj);
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
        var text = new Gv.form.TextField({
            id: 'portal-pbs-params-programarg',
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

        var cur_id = 'portal-pbs-params-workdir';
        input_workdir = new Gv.form.TextFieldSelect({
            id: cur_id,
            renderTo: 'page-portal-WorkingDIR',
            fieldLabel: 'WorkingDIR',
            readOnly: false,
            width:540,
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
            width:540,
            listeners: {
                focus: function(v) {},
                focusout: function(v) {}
            }

        });
    },
    onReady: function() {
        global_jobscheduler_serial.initrunparams();

    }
};


$(function() {
    global_jobscheduler_serial.onReady();
});
