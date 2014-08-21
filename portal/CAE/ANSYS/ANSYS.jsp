<%@ page pageEncoding="UTF-8"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" import="java.io.*"%>
<%@ page import="com.dawning.gridview.common.session.application.sessionmanagement.export.util.SessionUtil"%>
<%@ page import="com.dawning.gridview.common.session.application.sessionmanagement.export.util.SessionUser"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>作业提交</title>
<style>
  .ov {
    overflow:auto !important;
  }
</style>
<script type="text/javascript">
$(function(){
    $(".form-group").each(function(index, element) {
        $(this).find(".title-float").click(function(){
            if($(this).parents(".form-group").attr("class")=="form-group active"){
                $(this).find("i").attr("class","icon-chevron-sign-down");
                $(this).parents(".form-group").removeClass("active");
            }else{
                $(this).find("i").attr("class","icon-chevron-sign-up");
                $(this).parents(".form-group").addClass("active");
            };
        });
    });
    var winW = $(window).width();
    if(winW<1240){
        $(".newjob-info-tool li a").find("span").hide();
    }else{
        $(".newjob-info-tool li a").find("span").show();
    }
    if(winW>1600){
        $(".page-portal-main").animate({"marginRight":300},200);
    $(".page-portal-side").animate({"width":299},200);
    $(".portal-side-switch").find("i").attr("class","icon-caret-right");
    $(".portal-side-switch").click(function(){
      if($(this).find("i").attr("class")=="icon-caret-left"){
        $(this).find("i").attr("class","icon-caret-right");
        $(".page-portal-main").animate({"marginRight":300},200);
        $(".page-portal-side").animate({"width":299},200).addClass("ov");
      }else{
        $(this).find("i").attr("class","icon-caret-left");
        $(".page-portal-main").animate({"marginRight":10},200);
        $(".page-portal-side").animate({"width":9},200).removeClass("ov");
      };
    });
    }else{
        $(".page-portal-main").animate({"marginRight":10},200);
    $(".page-portal-side").animate({"width":9},200);
    $(".portal-side-switch").click(function(){
      if($(this).find("i").attr("class")=="icon-caret-left"){
        $(this).find("i").attr("class","icon-caret-right");
        $(".page-portal-main").animate({"marginRight":300},200);
        $(".page-portal-side").animate({"width":299},200).addClass("ov");
      }else{
        $(this).find("i").attr("class","icon-caret-left");
        $(".page-portal-main").animate({"marginRight":10},200);
        $(".page-portal-side").animate({"width":9},200).removeClass("ov");
      };
    });
    };
    $(".page-jobupdate-floatdiv").show();

    $(".back-btn").click(function(){
        $(".page-jobupdate-floatdiv").hide();
    });
    new Gv.Button({
        renderTo:'job-Submission-do',
        cls:'button bg-color-blueDark border-color-blueDark fg-color-white',
        text:'提交'
    });
    new Gv.Button({
        renderTo:'job-Submission-preset',
        cls:'button',
        text:'重置'
    });
    new Gv.Button({
         renderTo:'job-Submission-predifine',
          cls:'button',
          text:'预设参数'
    });
});
jQuery(".portal-sideMenu").slide({titCell:"h3", targetCell:".portal-sideMenu-help",defaultIndex:1,effect:"slideDown",delayTime:300,trigger:"click"});
</script>
<script type="text/javascript">
<%
Runtime runtime = Runtime.getRuntime();
Process process =null;
String line=null;
InputStream is =null;
InputStreamReader isr=null;
BufferedReader br =null;
String type = request.getParameter("strAppType");
String name = request.getParameter("strAppName");
try {
    process =runtime.exec("sh /opt/gridview/gridviewAppTemplate/" + type + "/" + name + "/" 
            + name + ".check " + request.getParameter("strOSUser"));
    is = process.getInputStream();
    isr=new InputStreamReader(is);
    br =new BufferedReader(isr);
    while( (line = br.readLine()) != null ) {
        out.println(line);
        out.flush();
    }
    is.close();
    isr.close();
    br.close();
} catch(IOException e ) {
    out.println(e);
    runtime.exit(1);
}
%>

var portal_strAppType="<% out.print(request.getParameter("strAppType")); %>";
var portal_strAppName="<% out.print(request.getParameter("strAppName")); %>";
var portal_strJobManagerID="<% out.print(request.getParameter("strJobManagerID")); %>";
var portal_strJobManagerAddr="<% out.print(request.getParameter("strJobManagerAddr")); %>";
var portal_strJobManagerPort="<% out.print(request.getParameter("strJobManagerPort")); %>";
var portal_strJobManagerType="<% out.print(request.getParameter("strJobManagerType")); %>";

var portal_strOsUser="<% out.print(request.getParameter("strOSUser")); %>";
var portal_strGvUser="<% out.print(request.getParameter("strGVUser")); %>";
var portal_strUserMode="<% out.print(request.getParameter("strUserMode")); %>";
var portal_strUserPasswd="<% out.print(request.getParameter("strUserPasswd")); %>";
var queueJsonData = [];
for(var i = 0;i<aQueList.length;i++){
    queueJsonData.push({'id':aQueList[i][0],'text':aQueList[i][0]})
}
gen_time_identify_string = function() {
    Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    return (new Date()).Format("MMdd_hhmmss");
};
</script>
</head>

<body>
<div style="position:absolute; top:0; bottom:60px; left:0; right:0; overflow:auto;">
    <div class="page-portal-main">
        <div class="page-portal-banner" id="page-portal-banner"></div>
        <form>
            <div class="form-group">
                <div class="form-group-title">
                    <div class="title-float cl">
                        <div class="title-front"><i class="icon-chevron-sign-down"></i></div>
                        <div class="title-text">Available Resource</div>
                    </div>
                </div>
                <div class="form-group-content">
                    <h5>Cluster Queue Information</h5>
                    <div id="queue-grid" style="overflow:auto; height:240px;"> </div>
                    <h5>ClusQuota Disk Usage :</h5>
                    <div class="page-portal-progressbar" id="page-portal-diskquota">
                        <div class="progressbar" style="width:80%"></div>
                        <div class="progressnum">80%</div>
                    </div>
                    <h5>ClusQuota CPU Time :</h5>
                    <div class="page-portal-progressbar" id="page-portal-clusquota">
                        <div class="progressbar" style="width:30%"></div>
                        <div class="progressnum">30%</div>
                    </div>
                </div>
            </div>
            <div class="form-group active">
                <div class="form-group-title">
                    <div class="title-float cl">
                        <div class="title-front">
                            <i class="icon-chevron-sign-up"></i>
                        </div>
                        <div class="title-text">Job Schedule Parameters</div>
                    </div>
                </div>
                <div class="form-group-content">
                    <div class="cl">
                        <div class="fl" style="display:inline; margin-right:20px;">
                            <span id='page-portal-Nnodes'></span>
                            <span id='page-portal-Cores'></span>
                            <span id='page-portal-Time'></span>
                        </div>
                        <div class="fl">
                            <span id='page-portal-Queue'></span>
                            <span id='page-portal-Name'></span>
                            <a id="page-portal-Manage" href="#"></a>
                            <a id="page-portal-Manage-Web" href="#"></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group active">
                <div class="form-group-title">
                    <div class="title-float cl">
                        <div class="title-front">
                            <i class="icon-chevron-sign-down"></i>
                        </div>
                        <div class="title-text">Environment Parameters</div>
                    </div>
                </div>
                <div class="form-group-content">
                    <div class="cl">
                      <div class="fl" style="display:inline; margin-right:20px;">
                        <span>Run Mode:</span><span id='page-portal-ansys-run-mode'/>
                        <span>Parallel Mode:</span><span id="page-portal-ansys-hpc-run"/>
                        <div>
                          <span id='page-portal-ansys-bin' style="display: inline-block;"></span>
                          <a id='page-portal-ansys-bin-select-btn' style="display: inline-block; vertical-align: middle;"></a>
                        </div>
                        <span id='page-portal-ansys-arguments'></span>
                      </div>
                      <div class="fl">
                        <span>Remote Shell:</span><span id='page-portal-ansys-remote-shell'/>
                        <div>
                          <span id='page-portal-ansys-work-dir' style="display: inline-block;"></span>
                          <a id='page-portal-ansys-workdir-btn' style="display: inline-block; vertical-align: middle;"></a>
                        </div>
                        <span id="page-portal-ansys-mpi-type"/>                 
                      </div>
                    </div>
              </div> 
            </div>
            <div class="form-group" id="page-portal-ansys-run-parameters-group">
                <div class="form-group-title">
                    <div class="title-float cl">
                        <div class="title-front">
                            <i class="icon-chevron-sign-down"></i>
                        </div>
                        <div class="title-text">Run Parameters</div>
                    </div>
                </div>
                <div class="form-group-content">
                    <div class="cl">
                      <div class="fl" style="display:inline; margin-right:20px;">
                        <span>File Type:</span><span id="page-portal-ansys-input-type"/>
                        <div>
                          <span id='page-portal-ansys-input' style="display: inline-block;"></span>
                          <a id='page-portal-ansys-input-btn' style="display: inline-block; vertical-align: middle;"></a>
                        </div>
                        <!--
                        <span id='page-portal-ansys-inp-file'/>
                        -->
                        <span id='page-portal-ansys-log-file'></span> 
                      </div>
                      <div class="fl">
                        <span id='page-portal-ansys-use-custom-memory-setting'/><br/>
                        <span id='page-portal-ansys-database'></span>
                        <span id='page-portal-ansys-total-workspace'></span>
                      </div>
                    </div>
              </div> 
            </div>
            <div id="page-portal-vnc" class="form-group">
                <div class="form-group-title">
                    <div class="title-float cl">
                        <div class="title-front">
                            <i class="icon-chevron-sign-down"></i>
                        </div>
                        <div class="title-text">Remote Visualization Parameters</div>
                    </div>
                </div>
                <div class="form-group-content">
                    <div> <span id='page-portal-VNCConnection'></span> </div>
                </div>
            </div>
            <div id="page-portal-chkpoint" class="form-group">
                <div class="form-group-title">
                    <div class="title-float cl">
                        <div class="title-front">
                            <i class="icon-chevron-sign-down"></i>
                        </div>
                        <div class="title-text">Checkpoint/Restart Parameters</div>
                    </div>
                </div>
                <div class="form-group-content">
                    <div class="cl">
                        <div class="fl" style="display:inline; margin-right:20px;">
                            <span id='page-portal-AutoCheckpoint'></span>
                        </div>
                        <div class="fl">
                            <span id='page-portal-Interval'></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group" id="page-portal-advanced">
                <div class="form-group-title">
                    <div class="title-float cl">
                        <div class="title-front">
                            <i class="icon-chevron-sign-down"></i>
                        </div>
                        <div class="title-text">Advanced Parameters</div>
                    </div>
                </div>
                <div class="form-group-content">
                    <div>
                        <span id='page-portal-PBSOptions'> </span>
                        <span id='page-portal-PreCommands'> </span>
                        <span id='page-portal-PostCommands'> </span>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div class="page-portal-side">
        <div class="pd10">
            <div class="portal-sideMenu">
                <h3 class="on">Introduction</h3>
                <div class="portal-sideMenu-help" id="page-portal-tips-introduction"> </div>
                <h3>Resource Tips</h3>
                <div class="portal-sideMenu-help" id="page-portal-tips-resource"> </div>
                <h3>Job Schedule Tips</h3>
                <div class="portal-sideMenu-help" id="page-portal-tips-sched"> </div>
                <h3>Run Tips</h3>
                <div class="portal-sideMenu-help" id="page-portal-tips-run"> </div>
                <h3>Remote Visualiztion Tips</h3>
                <div class="portal-sideMenu-help" id="page-portal-tips-vnc"> </div>
                <h3>Checkpoint Start/Restart Tips</h3>
                <div class="portal-sideMenu-help" id="page-portal-tips-checkpoint"> </div>
                <h3>Advanced Parameter Tips</h3>
                <div class="portal-sideMenu-help" id="page-portal-tips-adv"> </div>
            </div>
        </div>
        <div class="portal-side-switch"><i class="icon-caret-left"></i></div>
    </div>
</div>
<script type="text/javascript" src="/jm_as/CommonComp.js"></script>
<script type="text/javascript" src="/jm_as/CAE/ANSYS/ANSYS.help.js"></script>
<script type="text/javascript" src="/jm_as/CAE/ANSYS/ANSYS.js"></script>
<div class="jobupdate-floatdiv-bottom">
<span id="job-Submission-predifine"></span>
<span id="job-Submission-do"></span>
<span id="job-Submission-preset"></span>
</div>
</body>
</html>
