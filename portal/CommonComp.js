var global_portal_utils = {
    parse_time_to_seconds: function(time_str) {
        time_detail = time_str.split(":");
        var ret_sec = 0;
        for (var i = 0; i < time_detail.length; i++) {
            ret_sec = ret_sec * 60 + parseInt(time_detail[i]);
        }
        return ret_sec;

    },
    set_checkbox_radiogroup_status: function(component_id, is_checked) {
        //is_checkd: true or false, not string
        checkbox_component = $("#" + component_id);
        checkbox_component.prop("checked", is_checked);
        if (is_checked)
            checkbox_component.val("checked");
        else
            checkbox_component.val("");
    },
};
var global_portal = {
    dispaly_portal_name: function() {
        var portal_name_version = portal_strAppName.toUpperCase() + " Portal v" + portal_version;
        $("#page-portal-version").first().html(portal_name_version);
    },
    display_banner: function() {
        var png_path = "/jm_as/" + portal_strAppType + "/" + portal_strAppName + "/" + portal_strAppName + ".png";
        var portal_banner = Gv.createElement({
            tag: 'img'
        });
        portal_banner.src = png_path;
        portal_banner.width = "740";
        $("#page-portal-banner").append(portal_banner);
    },
    display_queue_status: function() {
        var portal_queue_status = Gv.get("queue-grid");
        var portal_queue_info_table = $('<table></table>');
        var queue_info_param = ["id", "QueueName", "TotNodes", "BusyNodes", "FreeNodes",
            "FreeCores", "ChargeRate", "IsQueAcce", "MaxPPN", "MaxMem",
            "MaxNodes", "MaxCores", "MaxWalltime", "MinNodes", "MinCores", "MinWalltime"
        ];
        var body_table = "<thead><tr>";
        for (var i = 1; i < queue_info_param.length; i++) {
            body_table = body_table + "<th class=\"left\">" + queue_info_param[i] + "</th>";
        }
        body_table = body_table + "</tr></thead><tbody id=\"table-tr\">";
        portal_queue_info_table.html(body_table);
        portal_queue_status.append(portal_queue_info_table);
    },
    initqueueGrid: function() {
        for (var i = 0; i < aQueStat.length; i++) {
            //Gv.log(aQueStat[0]);
            var starttr = ' <tr>';
            var bodytr = "";
            for (var k = 1; k < aQueStat[i].length; k++) {
                bodytr = bodytr + '<td>' + aQueStat[i][k] + '</td>';
            }
            var endtr = '</tr>';
            $("#table-tr").append(starttr + bodytr + endtr);
        }
    },
    clusquota_config: function() {
        var strDiskQuota;
        var fDiskQuota;
        if (diskquota_available == 1) {
            strDiskQuota = diskfilesystem + "   " + disklimitsgb + "GB";
            fDiskQuota = diskused / disklimits;
        } else {
            strDiskQuota = "unlimit";
            fDiskQuota = 0.0;
        }
        var diskquota_info = $("#page-portal-diskquota");
        diskquota_info.children()[0].style.width = "" + (fDiskQuota * 100) + "%"; //change to % stype
        diskquota_info.children()[1].innerHTML = strDiskQuota;

        var strUserCqHour;
        if (clusquota_available == 1) {
            strUserCqHour = dUserCqHour + " CPU*Hours";
            if(dUserCqTotalHour === 0){
                fClusQuota=0.0;
            } else{
                fClusQuota = 1.0 - dUserCqHour / dUserCqTotalHour;
            }
        } else {
            strUserCqHour = "unlimit";
            fClusQuota = 0.0;
        }

        var clusquota_info = $("#page-portal-clusquota");
        clusquota_info.children()[0].style.width = "" + (fClusQuota * 100 ) +"%";
        clusquota_info.children()[1].innerHTML = strUserCqHour;
    },
    init_job_parameters: function() {
        portal_component_validate_success =  function(target) {
           global_portal.component_validate[target.getId()] = 1;
        };
        portal_component_validate_failure =  function(target) {
           global_portal.component_validate[target.getId()] = 0;
        };
        job_params_show_error_tips = function(target, msg) {
            target.setTipsContent(msg);
            target.addError();
            portal_component_validate_failure(target);
        };
        var nnodesText = new Gv.form.TextField({
            id: 'portal-pbs-params-nnodes',
            type: 'text',
            renderTo: 'page-portal-Nnodes',
            name: 'portal-Nnodes',
            fieldLabel: '<font color="#FF0000">*</font>Nnodes',
            allowBlank: false,
            value: numnodes,
            maxLength: 6,
            listeners: {
                focusout: function() {
                    var pbs_nnodes = nnodesText.value();
                    var pbs_ppn = $("#portal-pbs-params-ppn").val();
                    var pbs_queue = $("#portal-pbs-params-queue").val();
                    var pbs_queue_detail;
                    for (var i = 0; i < aQueStat.length; i++) {
                        if (aQueStat[i][1] == pbs_queue) {
                            pbs_queue_detail = aQueStat[i];
                            break;
                        }
                    }
                    var max_nodes = parseInt(pbs_queue_detail[10]); //max nodes allowed
                    var min_nodes = parseInt(pbs_queue_detail[13]);
                    var max_cores = parseInt(pbs_queue_detail[11]); //max cores allowed
                    var min_cores = parseInt(pbs_queue_detail[14]); //max cores allowed
                    var err_tips = ["请输入",min_nodes, "-",max_nodes,"之间的正整数"].join("");
                    if (!pbs_nnodes.length) {
                        job_params_show_error_tips(nnodesText, err_tips);
                        return;
                    }
                    if (!pbs_nnodes.match(/^[-+]{0,1}\d+$/)) {
                        job_params_show_error_tips(nnodesText, err_tips);
                        return;
                    }
                    pbs_nnodes = parseInt(pbs_nnodes);
                    if (!pbs_nnodes) {
                        job_params_show_error_tips(nnodesText, err_tips);
                        return;
                    }
                    if (pbs_nnodes < 0) {
                        job_params_show_error_tips(nnodesText, err_tips);
                        return;
                    }
                    if (pbs_nnodes > max_nodes) {
                        job_params_show_error_tips(nnodesText, err_tips);
                        return;
                    }
                    if (pbs_nnodes < min_nodes) {
                        job_params_show_error_tips(nnodesText, err_tips);
                        return;
                    }
                    if(! pbs_ppn.length || ! pbs_ppn.match(/^[-+]{0,1}\d+$/)){
                        portal_component_validate_success(nnodesText);
                        return;
                    }
                    pbs_ppn = parseInt(pbs_ppn);
                    tot_cores_require = pbs_ppn * pbs_nnodes;
                    if(tot_cores_require > max_cores){
                        job_params_show_error_tips(nnodesText, "请求的总核数大于队列中或Maui中的限定值" + max_cores);
                        return;
                    }
                    if(tot_cores_require < min_cores){
                        job_params_show_error_tips(nnodesText, "请求的总核数小于队列中的限定值" + min_cores);
                        return;
                    }
                    portal_component_validate_success(nnodesText);
                }
            }
        });

        var coresText = new Gv.form.TextField({
            id: 'portal-pbs-params-ppn',
            renderTo: 'page-portal-Cores',
            name: 'portal-Cores',
            value: numppn,
            fieldLabel: '<font color="#FF0000">*</font>Cores/Node',
            allowBlank: false,
            regex: /^[\d]+$/,
            maxLength: 6,
            regexText: '请输入程序需要的核数',
            listeners: {
                focusout: function() {
                    var pbs_ppn = coresText.value();
                    var pbs_nnodes = $('#portal-pbs-params-nnodes').val();
                    var pbs_queue = $("#portal-pbs-params-queue").val();
                    var pbs_queue_detail;
                    for (var i = 0; i < aQueStat.length; i++) {
                        if (aQueStat[i][1] == pbs_queue) {
                            pbs_queue_detail = aQueStat[i];
                            break;
                        }
                    }
                    var max_ppn = parseInt(pbs_queue_detail[8]); // max ppn
                    var max_cores = parseInt(pbs_queue_detail[11]); //max cores allowed
                    var min_cores = parseInt(pbs_queue_detail[14]); //max cores allowed
                    var err_tips = ["请输入",min_cores, "-",max_ppn,"之间的正整数"].join("");
                    if (!pbs_ppn.length) {
                        job_params_show_error_tips(coresText, err_tips);
                        return;
                    }
                    if (!pbs_ppn.match(/^[+-]{0,1}\d+$/)) {
                        job_params_show_error_tips(coresText, err_tips);
                        return;
                    }
                    pbs_ppn = parseInt(pbs_ppn);
                    if (!pbs_ppn) {
                        job_params_show_error_tips(coresText, err_tips);
                        return;
                    }
                    if (pbs_ppn < 0) {
                        job_params_show_error_tips(coresText, err_tips);
                    }
                    if (pbs_ppn > max_ppn) {
                        job_params_show_error_tips(coresText, err_tips);
                        return;
                    }
                    if (! pbs_nnodes.length || ! pbs_nnodes.match(/^[+-]{0,1}\d+$/)) {
                        portal_component_validate_success(coresText);
                        return;
                    }
                    pbs_nnodes = parseInt(pbs_nnodes);
                    var tot_cores_require = pbs_nnodes * pbs_ppn;
                    if (tot_cores_require > max_cores) {
                        job_params_show_error_tips(coresText, "请求的总核数大于队列限定值" + max_cores);
                        return;
                    }
                    if (tot_cores_require < min_cores) {
                        job_params_show_error_tips(coresText, "请求的总核数小于队列限定值" + min_cores);
                        return;
                    }
                    portal_component_validate_success(coresText);
                }
            }
        });

        var timeText = new Gv.form.TextField({
            id: 'portal-pbs-params-time',
            renderTo: 'page-portal-Time',
            fieldLabel: '<font color="#FF0000">*</font>Wall Time:',
            allowBlank: true,
            //width:180,
            value: hours + ":" + minutes + ":" + seconds,
            //maxLength:6,
            listeners: {
                focusout: function() {
                    var pbs_walltime = timeText.value();
                    if (!pbs_walltime.length) {
                        job_params_show_error_tips(timeText, "不能为空");
                        return;
                    }
                    if (!pbs_walltime.match(/^(\d+):(\d{1,2}):(\d{1,2})$/)) {
                        job_params_show_error_tips(timeText, "输入格式为：hh:mm:ss");
                        return;
                    }
                    var pbs_queue = $("#portal-pbs-params-queue").val();
                    var pbs_queue_detail;
                    for (var i = 0; i < aQueStat.length; i++) {
                        if (aQueStat[i][1] == pbs_queue) {
                            pbs_queue_detail = aQueStat[i];
                            break;
                        }
                    }
                    var walltime_max = pbs_queue_detail[12];
                    var walltime_min = pbs_queue_detail[15];
                    if ( walltime_max == "unlimit" && walltime_min == "unlimit") {
                        return;
                    }
                    if (walltime_max == "unlimit") {
                        walltime_max = Math.min();
                    } else {
                        walltime_max = global_portal_utils.parse_time_to_seconds(walltime_max);
                    }
                    if (walltime_min == "unlimit") {
                        walltime_min = 0;
                    } else {
                        walltime_min = global_portal_utils.parse_time_to_seconds(walltime_min);
                    }
                    walltime_input = global_portal_utils.parse_time_to_seconds(pbs_walltime);
                    if (walltime_input > walltime_max) {
                        job_params_show_error_tips(timeText, "请求的时间大于队列限定的最大时间" + walltime_max);
                        return;
                    }
                    if (walltime_input < walltime_min) {
                        job_params_show_error_tips(timeText, "请求的时间小于队列限定的最小时间" + walltime_min);
                        return;
                    }
                    portal_component_validate_success(timeText);
                }

            }
        });

        var queueCombox = new Gv.form.ComboBox({
            id: 'portal-pbs-params-queue',
            renderTo: 'page-portal-Queue',
            name: 'portal-Queue',
            fieldLabel: '<font color="#FF0000">*</font>Queue',
            data: queueJsonData,
            autoLoad: false,
            //设置参数
            listeners: {
                //change: function (value, text) {
                //    alert(' 实际值  ' + value + ' 显示值  ' + text)
                //}
            }
        });

        var Name = new Gv.form.TextField({
            id: 'portal-pbs-params-name',
            renderTo: 'page-portal-Name',
            fieldLabel: '<font color="#FF0000">*</font>Name',
            allowBlank: false,
            value: PORTALNAM + "_" + portal_time_stamp,
            listeners: {
                focusout: function() {
                    name_str  = Name.value();
                    if (! name_str.length){
                        job_params_show_error_tips(Name, "不能为空");
                        return;
                    }
                    if (!name_str.match(/^(\w+)$/)) {
                        job_params_show_error_tips(Name, "作业名只能为英文字母、数字和下划线");
                        return;
                    }
                    portal_component_validate_success(Name);
                }
            }
        });

        var manager_button = new Gv.Button({
            renderTo: 'page-portal-Manage',
            cls: 'button',
            text: 'WinScp File Manager',
            handler: function(obj) {
                winscp_browser_plugin({
                    ip: location.host.split(':')[0],
                    user: portal_strOsUser
                });
            }
        });
        var manager_button_web = new Gv.Button({
            renderTo: 'page-portal-Manage-Web',
            cls: 'button',
            text: 'Web File Manager',
            handler: function(obj) {
	        cfg = {
	            'id':'iccfm',
	            'text':Gv.gvI18n('page_iccfm'),
	            'closed':true,
	            'load':'/cm_filemanagement/filemanagement/index.action?targetPath='+userhome
	        };
	        Gv.frameTabPanel.addTab(cfg);
            }
        });
    },
    init_vnc_params: function() {
        var vnc_checkbox = new Gv.form.Checkbox({
            id: 'portal-pbs-params-vnc',
            renderTo: 'page-portal-VNCConnection',
            name: 'portal-VNCConnection',
            fieldLabel: 'yes',
            checked: false,
            handler: function(id, input_value) {
                vnc_checkbox.value(Gv.get(id).attr('checked'));
            },
        });
    },
    init_checkpoint_params: function() {
        checkpoint_box = new Gv.form.Checkbox({
            id: 'portal-pbs-params-checkpoint',
            renderTo: 'page-portal-AutoCheckpoint',
            name: 'portal-AutoCheckpoint',
            fieldLabel: 'yes',
            handler: function(id, input_value) {
                checkpoint_box.value(Gv.get(id).attr('checked'));
            },
            checked: false
            // 默认是false
        });
        interval_text = new Gv.form.TextField({
            id: 'portal-pbs-params-interval',
            renderTo: 'page-portal-Interval',
            name: 'portal-Interval',
            fieldLabel: '<font color="#FF0000">*</font>Interval(minutes)',
            value: interval,
            labelWidth: '125', //不写就是用默认值
            width: '250', //不写就是用默认值
            allowBlank: false,
            maxLength: 6,
            bodyStyle: '',
            listeners: {
                //焦点事件
                focus: function(v) {

                },
                //失去焦点事件
                focusout: function(v) {

                    var interval_val = interval_text.value();
                    if (!interval_val.length) {
                        job_params_show_error_tips(interval_text, "不能为空");
                        return;
                    }
                    if (!interval_val.match(/^\d+$/)) {
                        job_params_show_error_tips(interval_text, "请输入数字");
                        return;
                    }
                    portal_component_validate_success(interval_text);
                }
            }

        });
    },
    init_advanced_params: function() {
        var PBSOptions = new Gv.form.TextArea({
            id: 'portal-pbs-params-pbsAdvOpt',
            renderTo: 'page-portal-PBSOptions',
            name: 'portal-PBSOptions',
            fieldLabel: 'PBS Options',
            allowBlank: true,
            labelWidth: 125, //不写就是用默认值
            width: 540 //不写就是用默认值
        });
        var PreCommands = new Gv.form.TextArea({
            id: 'portal-pbs-params-preCommands',
            renderTo: 'page-portal-PreCommands',
            //name: 'portal-PBSOptions',
            fieldLabel: 'Pre Commands:',
            allowBlank: true,
            labelWidth: 125, //不写就是用默认值
            width: 540 //不写就是用默认值
        });

        var PostCommands = new Gv.form.TextArea({
            id: 'portal-pbs-params-postCommands',
            renderTo: 'page-portal-PostCommands',
            //name: 'portal-PBSOptions',
            fieldLabel: 'Post Commands:',
            allowBlank: true,
            labelWidth: 125, //不写就是用默认值
            width: 540, //不写就是用默认值
	    emptyText:'t <br/>'+

			' is the example!'
        });

    },
    onReady: function() {
        global_portal.dispaly_portal_name();
        global_portal.display_banner();
        global_portal.display_queue_status();
        global_portal.initqueueGrid();
        global_portal.clusquota_config();
        global_portal.init_job_parameters();
        if (vnc_available == 1) {
            global_portal.init_vnc_params();
        } else {
            $("#page-portal-vnc").addClass("none")
        }
        if (checkpoint_available == 1) {
            global_portal.init_checkpoint_params();
        } else {
            $("#page-portal-chkpoint").addClass("none")
        }
        global_portal.init_advanced_params();
        global_portal.component_validate = {};
    }
};

$(function() {
    portal_time_stamp = gen_time_identify_string();
    global_portal.onReady();
});
