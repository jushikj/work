/*!
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * 从/opt/gridview/software/下载指定名称的软件
 *
 * @param {}
 *            softwareName
 */
/*
check.sh define var
var dUserCqSec=86735;
var dUserCqHour=24;
var clusquota_available=1;
var aQueStat=[[1,'A_cb65-6136','2','0','2',' 32','1.0','true','16','32107','unlimit','unlimit','unlimit','unlimit','unlimit','unlimit'],[2,'A_a840','1','1','0','','1.5','true','48','1','unlimit','unlimit','unlimit','unlimit','unlimit','unlimit'],[3,'A_cb65-6174','8','1','6',' 144','1.2','true','24','48267','unlimit','unlimit','unlimit','unlimit','unlimit','unlimit'],[4,'I_cb60','10','4','6',' 108','1.0','true','12','24025','unlimit','unlimit','unlimit','unlimit','unlimit','unlimit'],[5,'A_opt6140','1','0','1',' 16','1.2','true','16','32110','unlimit','unlimit','unlimit','unlimit','unlimit','unlimit'],[6,'I_i840','1','0','1',' 24','1.8','true','24','128952','unlimit','unlimit','unlimit','unlimit','unlimit','unlimit']];
var aQueList=[["A_cb65-6136"],["A_a840"],["A_cb65-6174"],["I_cb60"],["A_opt6140"],["I_i840"]];
var UserHomePath="/root";
var diskfilesystem="node22:/home";
var diskused=135352;
var disklimits=10485760;
var disklimitsgb=10;
var diskquota_available=1;
#job batch
var queSelected="I_cb60";
var numnodes="4";
var numppn="1";
var name="ANSYS_job_20110920_1809";
var hours="1";
var minutes="0";
var seconds="0";
#run
var remoteshell="ssh";
var ib_available="1";
var network="ib";
var sharemem="0";
var cpubind="0";
var file="/public/software/vasp/vasp5-impi-em64t";
var mpiProgList="/public/software/vasp/vasp4-impi-amd64:/public/software/vasp/vasp4-impi-em64t:/public/software/vasp/vasp5-impi-amd64:/public/software/vasp/vasp5-impi-em64t:/public/software/vasp/vasp5-ompi-amd64:/public/software/vasp/vasp5-ompi-em64t";
var programarg=" ";
var workdir="/root";
var output="ANSYS_log_20110920_1809.txt";
var vnc_available="1";
var vnc="0";
var gpuacc_available="1";
var gpuacc="0";
var gputype="240";
var min_gputype="5";*/
            	    var maxNNodes;
                  var tmpNNodes;
                  var totQueNodes;
                  var maxQueNodes;
                  var maxQueCores;

                  var currDate = new Date();
                  var timeStamp = currDate.format('ymd_His');

function coreSoftwareDownload(softwareName) {

  var softwareWebRoot = "/commonsoft/";
  var rePath = "";

  Ext.Ajax.request({
    url : softwareWebRoot + "softwaremanagement/softwareDownload.action",
    callback : function(options, success, response) {
      if (Ext.decode(response.responseText)['success'] == true)
      {
        var softwareUrl = Ext.decode(response.responseText)["path"];
        window.open(softwareWebRoot + softwareUrl);
        } else {
          Ext.MessageBox.show({
            title : gvI18n('错误'),
            msg : gvI18n("您要下载的软件不存在"),
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.ERROR
            });
          }
      },
    params : {
        softwareName : softwareName
        },
    scope : this
    });

  return rePath;

}

/****************************WinSCP*******************************************/

/*
 * Gridview ParameterView 模块
 */

// Ext.namespace('gridview.core.pageintegration.webapp.commonsoftwaremanagement');
/**
 * 支持winscp、putty的启动
 *
 * @param softwareName,
 *            ipPath, initPath ipPath:访问IP地址 initPath：访问起始目录
 *            如："/opt/gridview/"
 * @return
 */
function coreSoftwareOpen(softwareName, ipPath, initPath) {

  // 1.获取用户信息
  var osUser = portal_strOsUser;
  var gvUser = portal_strGvUser;
  var userMode = portal_strUserMode;
  var userPasswd = portal_strUserPasswd;
  initPath = initPath + "/";

  // 2.操作系统判定,只支持Windows操作系统
  var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");

  if (!isWin) {
    Ext.MessageBox.show( {
      title : gvI18n("winscp_error"),
      msg : gvI18n("winscp_ossupport"),
      buttons : Ext.MessageBox.OK,
      icon : Ext.MessageBox.ERROR
    });
    return;
  }

  try {
    // 3.获取登录节点IP
    var sip = ipPath;
    var cmd = "";
    var arg = "";
    // 4判断浏览器类型IE
    if (MzBrowser.ie) {
      // 4.1 用户类型判定
      if (userMode == 'systemUser') {
        // 4.1.1判断软件类型
        if (softwareName == "winscp") {
          cmd = "winscp.exe sftp://" + osUser + ":"
              + userPasswd + "@" + sip + initPath;
        } else if (softwareName == "putty") {
          cmd = "putty.exe " + osUser + "@" + sip + " -pw "
              + userPasswd;
        }
      } else {
        if (softwareName == "winscp") {
          cmd = "winscp.exe sftp://" + osUser + "@" + sip
              + initPath;
        } else if (softwareName == "putty") {
          cmd = "putty.exe " + osUser + "@" + sip;
        }
      }

      // 4.2 启动Winscp
      var tmpObj = new ActiveXObject("wscript.shell").run(cmd);
    }

    // 4判断浏览器类型FF
    if (MzBrowser.firefox) {
      // 软件判断
      var cmd64 = "";

      if (softwareName == "winscp") {
        cmd = "C:\\Program\ Files\\Sugon\ WinSCP&Putty\\WinSCP.exe";
        cmd64 = "C:\\Program\ Files\ (x86)\\Sugon\ WinSCP&Putty\\WinSCP.exe";
      } else if (softwareName == "putty") {
        cmd = "C:\\Program\ Files\\Sugon\ WinSCP&Putty\\putty.exe";
        cmd64 = "C:\\Program\ Files\ (x86)\\Sugon\ WinSCP&Putty\\putty.exe";
      }
      // 4.1 用户类型判定
      var arguments = [ arg ];

      if (userMode == 'systemUser') {
        // 软件判断
        if (softwareName == "winscp") {
          arg = "sftp://" + osUser + ":" + userPasswd + "@"
              + sip + initPath;
          arguments = [ arg ];

        } else if (softwareName == "putty") {
          var arg0 = osUser + "@" + sip;
          var arg1 = "-pw";
          var arg2 = userPasswd;
          arguments = [ arg0, arg1, arg2 ];
        }
      } else {
        // 软件判断
        if (softwareName == "winscp") {
          arg = "sftp://" + osUser + "@" + sip + initPath;
        } else if (softwareName == "putty") {
          arg = osUser + "@" + sip;
        }
        arguments = [ arg ];
      }

      // 4.2 启动Winscp
      netscape.security.PrivilegeManager
          .enablePrivilege("UniversalXPConnect");
      var process = Components.classes['@mozilla.org/process/util;1']
          .createInstance(Components.interfaces.nsIProcess);
      var file = Components.classes['@mozilla.org/file/local;1']
          .createInstance(Components.interfaces.nsILocalFile);
      try {
        file.initWithPath(cmd);
        process.init(file);
        process.run(false, arguments, arguments.length, {});
      } catch (e) {
        // 64位系统判定
        file.initWithPath(cmd64);
        process.init(file);
        process.run(false, arguments, arguments.length, {});
      }
    }
  } catch (e) {
    // 5 启动失败提示
    var linkcannotopen = "";
    if (softwareName == "winscp") {
      var linkcannotopen = gvI18n("无法启动WinSCP，请确定以下操作是否均已完成：");
    } else if (softwareName == "putty") {
      var linkcannotopen = gvI18n("putty_cannotopen");
    }
    var linkdownloadconf = gvI18n("请下载并安装WinSCP程序。")
        + "<a href=\"#\" onclick=\"coreSoftwareDownload('winscp_puttysetup.exe');\">"
        + gvI18n("点击下载WinSCP") + "</a>";
    if (MzBrowser.ie) {
      // ie设置提示
      var winscpieset = gvI18n("安全设置中“ActiveX空间和插件”的“对未标记为可安全执行的脚本的ActiveX控件初始化并执行脚本”项已改为“启用”");
      Ext.MessageBox.show( {
        title : gvI18n("提示"),
        msg : linkcannotopen + "<br/><br/>1." + winscpieset
            + "<br/><br/>2." + linkdownloadconf,
        buttons : Ext.MessageBox.OK,
        icon : Ext.MessageBox.INFO
      });
    }
    if (MzBrowser.firefox) {
      // ff设置提示
      var winscpffset = gvI18n("请在浏览器地址栏输入“about:config”并回车，将[signed.applets.codebase_principal_support]设置为true");
      Ext.MessageBox.show( {
        title : gvI18n("提示"),
        msg : linkcannotopen + "<br/><br/>1." + winscpffset
            + "<br/><br/>2." + linkdownloadconf,
        buttons : Ext.MessageBox.OK,
        icon : Ext.MessageBox.INFO
      });
    }
  }

}

/**
 * 浏览器判定使用
 *
 * @type
 */
window["MzBrowser"] = {};
(function() {
  if (MzBrowser.platform)
    return;
  var ua = window.navigator.userAgent;
  MzBrowser.platform = window.navigator.platform;

  MzBrowser.firefox = ua.indexOf("Firefox") > 0;
  MzBrowser.opera = typeof (window.opera) == "object";
  MzBrowser.ie = !MzBrowser.opera && ua.indexOf("MSIE") > 0;
  MzBrowser.mozilla = window.navigator.product == "Gecko";
  MzBrowser.netscape = window.navigator.vendor == "Netscape";
  MzBrowser.safari = ua.indexOf("Safari") > -1;

  if (MzBrowser.firefox)
    var re = /Firefox(\s|\/)(\d+(\.\d+)?)/;
  else if (MzBrowser.ie)
    var re = /MSIE( )(\d+(\.\d+)?)/;
  else if (MzBrowser.opera)
    var re = /Opera(\s|\/)(\d+(\.\d+)?)/;
  else if (MzBrowser.netscape)
    var re = /Netscape(\s|\/)(\d+(\.\d+)?)/;
  else if (MzBrowser.safari)
    var re = /Version(\/)(\d+(\.\d+)?)/;
  else if (MzBrowser.mozilla)
    var re = /rv(\:)(\d+(\.\d+)?)/;

  if ("undefined" != typeof (re) && re.test(ua))
    MzBrowser.version = parseFloat(RegExp.$2);
})();


/*** ********************************openPath函数*************************************/

            function openPath() {
            	  var currentnode;
                var currentfile;
                var wpath;
                var showpath;
                var upPath;
                var pathsplit;
                var upfilePath;
                var filepathsplit;
                var pathUp_mark = 0;
              wpath = UserHomePath;

              if (document.getElementById("pathwin") == null) {
                window1.innerHTML = "";

                var id1 = '/';
                currentnode = '/';

                if (Ext.getCmp("path").getValue() != '') {
                  id1 = Ext.getCmp("path").getValue();
                  currentnode = Ext.getCmp("path").getValue();
                }

                if (currentnode == "HOME")
                  showpath = UserHomePath;
                else
                  showpath = currentnode;

                var pathtreeloader = new Ext.tree.TreeLoader(
                    {
                      url : "/jm_as/appsubmit/listUserDirectory.action"
                    });

                pathtreeloader.on('beforeload',function(ld, node) {
                  // 如果为work path的值为HOME
                  if (currentnode == "HOME")
                    currentnode = UserHomePath;
                  else if (pathUp_mark != 1)
                    currentnode = node.id;

                  pathUp_mark = 0;

                  ld.baseParams = {
                    strDirPath : currentnode,
                    strJobManagerID : portal_strJobManagerID,
                    strJobManagerAddr : portal_strJobManagerAddr,
                    strJobManagerPort : portal_strJobManagerPort,
                    strJobManagerType : portal_strJobManagerType
                    };
                  })

                var pathtree = new Ext.tree.TreePanel({
                  root : new Ext.tree.AsyncTreeNode({text : showpath,id : id1}),
                  autoScroll : true,
                  loader : pathtreeloader
                });

                new Ext.tree.TreeSorter(pathtree, {folderSort:true});

                var win = new Ext.Window(
                    {
                      renderTo : 'window1',
                      title : "选择路径",
                      id : "pathwin",
                      width : 200,
                      height : 375,
                      layout : 'fit',
                      closable : true,
                      draggable : true,
                      resizable : false,
                      buttons : [{
                        text : "确定",// iconCls:"browser",
                        width : 50,
                        handler : function() {
                          if (currentnode == "0" || leaf_node == true)
                            Ext.MessageBox.alert('提示','请选择路径',"");
                          else
                          {
                            Ext.getCmp("path").setValue(currentnode);
                            win.close();
                          }
                        }
                      },{
                        text : "关闭",// iconCls:"delete",
                        width : 50,
                        handler : function(){win.close()}
                      },{
                        text : "上级目录",
                        width : 50,// iconCls:"delete",
                        handler : function() {
                          pathsplit = currentnode.split("/");

                          upPath = "";
                          var num = 1;
                          while (pathsplit[num + 1] != null)
                            num++;
                          if (pathsplit[2] != null)
                          {
                            for (i = 1; i < num; i++)
                              upPath = upPath + '/' + pathsplit[i];
                          } else upPath = "/";

                          currentnode = upPath;
                          pathUp_mark = 1;
                          pathtree.root.reload();
                          pathtree.root.setText(upPath);
                        }
                      }],
                      items : pathtree
                    });

                var leaf_node = "0";
                win.setPosition(875, 340);
                win.show();

                pathtree.on("click", function(node) {
                  currentnode = node.id;
                  leaf_node = node.leaf;
                  });
                }

              }

/**************************openFile*******************************************/
            function openFile() {
            	  var currentnode;
                var currentfile;
                var wpath;
                var showpath;
                var upPath;
                var pathsplit;
                var upfilePath;
                var filepathsplit;
                var fileUp_mark = 0;
                
                
              if (document.getElementById("filewin") == null)
              {
                window2.innerHTML = "";

                var id2 = '/';
                currentfile = '/';

                if (Ext.getCmp("file").getValue() != '')
                {
                  currentfile = Ext.getCmp("file").getValue();

                  filepathsplit = currentfile.split("/");
                  upfilePath = "";
                  var num = 1;
                  while (filepathsplit[num + 1] != null)
                    num++;

                  if (filepathsplit[2] != null)
                  {
                    for (i = 1; i < num; i++)
                      upfilePath = upfilePath+ '/' + filepathsplit[i];
                  } else
                    upfilePath = "/";

                  currentfile = upfilePath;
                  id2 = currentfile;
                }

                var filetreeloader = new Ext.tree.TreeLoader({
                  url : "/jm_as/appsubmit/listUserDirectory.action"
                    });

                filetreeloader.on('beforeload',function(ld, node) {
                  if (fileUp_mark == 0)
                    currentfile = node.id;

                  fileUp_mark = 0;

                  ld.baseParams = {
                      strDirPath : currentfile,
                      strJobManagerID : portal_strJobManagerID,
                      strJobManagerAddr : portal_strJobManagerAddr,
                      strJobManagerPort : portal_strJobManagerPort,
                      strJobManagerType : portal_strJobManagerType
                      };
                  })

                var filetree = new Ext.tree.TreePanel({
                  root : new Ext.tree.AsyncTreeNode( {text : currentfile,id : id2}),
                  autoScroll : true,
                  loader : filetreeloader
                  });

                new Ext.tree.TreeSorter(filetree, {folderSort:true});

                var win = new Ext.Window({
                  renderTo : 'window2',
                  title : "选择文件",
                  id : "filewin",
                  width : 200,
                  height : 375,
                  layout : 'fit',
                  closable : true,
                  draggable : true,
                  resizable : false,
                  buttons : [{
                    text : "确定",// iconCls:"browser",
                    width : 50,
                    handler : function() {
                      if (leaf_node1 == false)
                        Ext.MessageBox.alert('提示','请选择文件',"");
                      else
                      {
                        Ext.getCmp("file").setValue(currentfile);
                        //jobScriptRefresh();
                        win.close();
                      }
                    }
                  },{
                    text : "关闭",
                    width : 50,// iconCls:"delete",
                    handler : function() {win.close()}
                  },{
                    text : "上级目录",
                    width : 50,// iconCls:"delete",
                    handler : function() {
                      filepathsplit = currentfile.split("/");
                      upfilePath = "";
                      var num = 1;
                      while (filepathsplit[num + 1] != null)
                        num++;

                      if (filepathsplit[2] != null)
                      {
                        for (i = 1; i < num; i++)
                          upfilePath = upfilePath+ '/' + filepathsplit[i];
                      } else
                        upfilePath = "/";
                      currentfile = upfilePath;
                      fileUp_mark = 1;
                      filetree.root.reload();
                      filetree.root.setText(upfilePath);
                      }
                  }],
                  items : filetree
                });

                var leaf_node1 = "0";
                win.setPosition(875, 340);
                win.show();

                filetree.on("click", function(node) {
                  currentfile = node.id;
                  leaf_node1 = node.leaf;
                  });
                }
              }
              function openInputFile() {
            	  var currentnode;
                var currentfile;
                var wpath;
                var showpath;
                var upPath;
                var pathsplit;
                var upfilePath;
                var filepathsplit;
                var fileUp_mark = 0;
                
                
               if (document.getElementById("filewin") == null)
              {
                window2.innerHTML = "";

                var id2 = UserHomePath;
                currentfile = UserHomePath;

                if (Ext.getCmp("path").getValue() != '')
                {
                  currentfile = Ext.getCmp("path").getValue();
                  id2 = Ext.getCmp("path").getValue();
                }

                var filetreeloader = new Ext.tree.TreeLoader({
                  url : "/jm_as/appsubmit/listUserDirectory.action"
                    });

                filetreeloader.on('beforeload',function(ld, node) {
                  if (fileUp_mark == 0)
                    currentfile = node.id;

                  fileUp_mark = 0;

                  ld.baseParams = {
                      strDirPath : currentfile,
                      strJobManagerID : portal_strJobManagerID,
                      strJobManagerAddr : portal_strJobManagerAddr,
                      strJobManagerPort : portal_strJobManagerPort,
                      strJobManagerType : portal_strJobManagerType
                      };
                  })

                var filetree = new Ext.tree.TreePanel({
                  root : new Ext.tree.AsyncTreeNode( {text : currentfile,id : id2}),
                  autoScroll : true,
                  loader : filetreeloader
                  });

                new Ext.tree.TreeSorter(filetree, {folderSort:true});

                var win = new Ext.Window({
                  renderTo : 'window2',
                  title : "选择文件",
                  id : "filewin",
                  width : 200,
                  height : 375,
                  layout : 'fit',
                  closable : true,
                  draggable : true,
                  resizable : false,
                  buttons : [{
                    text : "确定",// iconCls:"browser",
                    width : 50,
                    handler : function() {
                      if (leaf_node1 == false)
                        Ext.MessageBox.alert('提示','请选择文件',"");
                      else
                      {
                        Ext.getCmp("inputFile").setValue(currentfile);
                        //jobScriptRefresh();
                        win.close();
                      }
                    }
                  },{
                    text : "关闭",
                    width : 50,// iconCls:"delete",
                    handler : function() {win.close()}
                  },{
                    text : "上级目录",
                    width : 50,// iconCls:"delete",
                    handler : function() {
                      filepathsplit = currentfile.split("/");
                      upfilePath = "";
                      var num = 1;
                      while (filepathsplit[num + 1] != null)
                        num++;

                      if (filepathsplit[2] != null)
                      {
                        for (i = 1; i < num; i++)
                          upfilePath = upfilePath+ '/' + filepathsplit[i];
                      } else
                        upfilePath = "/";
                      currentfile = upfilePath;
                      fileUp_mark = 1;
                      filetree.root.reload();
                      filetree.root.setText(upfilePath);
                      }
                  }],
                  items : filetree
                });

                var leaf_node1 = "0";
                win.setPosition(875, 340);
                win.show();

                filetree.on("click", function(node) {
                  currentfile = node.id;
                  leaf_node1 = node.leaf;
                  });
                }
              }
              function opensubFile() {
            	  var currentnode;
                var currentfile;
                var wpath;
                var showpath;
                var upPath;
                var pathsplit;
                var upfilePath;
                var filepathsplit;
                var fileUp_mark = 0;
                
                
               if (document.getElementById("filewin") == null)
              {
                window2.innerHTML = "";

                var id2 = UserHomePath;
                currentfile = UserHomePath;

                if (Ext.getCmp("path").getValue() != '')
                {
                  currentfile = Ext.getCmp("path").getValue();
                  id2 = Ext.getCmp("path").getValue();
                }

                var filetreeloader = new Ext.tree.TreeLoader({
                  url : "/jm_as/appsubmit/listUserDirectory.action"
                    });

                filetreeloader.on('beforeload',function(ld, node) {
                  if (fileUp_mark == 0)
                    currentfile = node.id;

                  fileUp_mark = 0;

                  ld.baseParams = {
                      strDirPath : currentfile,
                      strJobManagerID : portal_strJobManagerID,
                      strJobManagerAddr : portal_strJobManagerAddr,
                      strJobManagerPort : portal_strJobManagerPort,
                      strJobManagerType : portal_strJobManagerType
                      };
                  })

                var filetree = new Ext.tree.TreePanel({
                  root : new Ext.tree.AsyncTreeNode( {text : currentfile,id : id2}),
                  autoScroll : true,
                  loader : filetreeloader
                  });

                new Ext.tree.TreeSorter(filetree, {folderSort:true});

                var win = new Ext.Window({
                  renderTo : 'window2',
                  title : "选择文件",
                  id : "filewin",
                  width : 200,
                  height : 375,
                  layout : 'fit',
                  closable : true,
                  draggable : true,
                  resizable : false,
                  buttons : [{
                    text : "确定",// iconCls:"browser",
                    width : 50,
                    handler : function() {
                      if (leaf_node1 == false)
                        Ext.MessageBox.alert('提示','请选择文件',"");
                      else
                      {
                        Ext.getCmp("subFile").setValue(currentfile);
                        //jobScriptRefresh();
                        win.close();
                      }
                    }
                  },{
                    text : "关闭",
                    width : 50,// iconCls:"delete",
                    handler : function() {win.close()}
                  },{
                    text : "上级目录",
                    width : 50,// iconCls:"delete",
                    handler : function() {
                      filepathsplit = currentfile.split("/");
                      upfilePath = "";
                      var num = 1;
                      while (filepathsplit[num + 1] != null)
                        num++;

                      if (filepathsplit[2] != null)
                      {
                        for (i = 1; i < num; i++)
                          upfilePath = upfilePath+ '/' + filepathsplit[i];
                      } else
                        upfilePath = "/";
                      currentfile = upfilePath;
                      fileUp_mark = 1;
                      filetree.root.reload();
                      filetree.root.setText(upfilePath);
                      }
                  }],
                  items : filetree
                });

                var leaf_node1 = "0";
                win.setPosition(875, 340);
                win.show();

                filetree.on("click", function(node) {
                  currentfile = node.id;
                  leaf_node1 = node.leaf;
                  });
                }
              }

/** ********************* jobScriptRefresh ********************************************* */
/*
            function jobScriptRefresh() {
                 nCpus = Ext.getCmp("nnodes").getValue() * Ext.getCmp("ppn").getValue();

                 if ( Ext.getDom("ib").checked )
                    connNet = "openib";
                 else connNet = "tcp";

                 if ( Ext.getDom("memory").checked )
                    shareMem = ",sm";
                 else shareMem = "";

                 mcaBtl = " --mca btl self," + connNet + shareMem;

                 if ( Ext.getDom("ssh").checked )
                    rmSH = "-r ssh ";
                 else rmSH = "-r rsh ";

                 jobscriptstxt = "mpirun " + rmSH + "-np " + nCpus  + mcaBtl + " " + Ext.getCmp("file").getValue() + " " +Ext.getCmp("programarg").getValue();
                 Ext.getCmp("jobscripts").setValue(jobscriptstxt);
                 Ext.getCmp("jobscripts").disable();
              }


            function editJobScript() {
                 Ext.getCmp("jobscripts").enable();
            }
*/
            function cquotaBarRefresh() {
                 totCPUTime = Ext.getCmp("nnodes").getValue() * Ext.getCmp("ppn").getValue() * Ext.getCmp("hours").getValue();
                 cqBarProgres =  totCPUTime / dUserCqHour;
                 if (cqBarProgres >1) cqBarProgres=1.0;
                 Ext.getCmp("cquotaBar").updateProgress(cqBarProgres);
            }
	    function gpuaccDisable()
	    {
            Ext.getCmp("gpuacc").disable();
            Ext.getCmp("gpuacc").checked = false;
            Ext.getCmp("nvidia").disable();
            Ext.getCmp("ati").disable();
	    }

//            function mpiRelateRefresh() {
//            	var network_status;
//            	var gpuacc_status;
//           //console.log("ma shao jie");
//            	if (( ib_available == '1' ) && (Ext.getCmp("ib").getValue() == true))
//            	network_status='ib';
//            	else
//            	network_status='tcp';
//            	if (( gpuacc_available == '1' ) && (Ext.getCmp("gpuacc").getValue() == true))
//            	gpuacc_status='1';
//            	
//            }
                   function queueRelateRefresh() {

            	  for( j=0; j< aQueStat.length; j++)
                {
                	if (Ext.getCmp("queue").getValue() == aQueStat[j][1])
                	{
                	  Ext.getCmp("ppn").setMaxValue(aQueStat[j][8]);
                	  Ext.getCmp("ppn").setValue(aQueStat[j][8]);

                	  if (aQueStat[j][13] != 'unlimit') //min nodes allowed
                	  {
                	  	Ext.getCmp("nnodes").setMinValue(aQueStat[j][13]);
                	  }

                	  totQueNodes=aQueStat[j][2];       //total nodes in queue
                	  maxNNodes=aQueStat[j][2];

                	  maxQueNodes=aQueStat[j][10];      //max nodes allowed
                	  if (aQueStat[j][10] != 'unlimit')
                	  {
                	  	tmpNNodes=aQueStat[j][10];
                	  	if (maxNNodes > tmpNNodes) maxNNodes=tmpNNodes;
                	  }

                	  maxQueCores=aQueStat[j][11];        //max cores allowed
                	  if (aQueStat[j][11] != 'unlimit')
                	  {
                	    tmpNNodes=aQueStat[j][11] / aQueStat[j][8];
                	    if (maxNNodes > tmpNNodes) maxNNodes=tmpNNodes;
                	  }

                	  Ext.getCmp("nnodes").setMaxValue(maxNNodes);
                	  if(Ext.getCmp("nnodes").getValue() > maxNNodes) Ext.getCmp("nnodes").setValue(maxNNodes);

                	  break;
                  }
                }

            }

            function formAllReset() {
            
            Ext.getCmp("nnodes").setValue(numnodes);
            Ext.getCmp("ppn").setValue(numppn);
            Ext.getCmp("hours").setValue(hours);
            Ext.getCmp("minutes").setValue(minutes);
            Ext.getCmp("seconds").setValue(seconds);
            Ext.getCmp("name").setValue(name + timeStamp);
            Ext.getCmp("queue").setValue(queSelected);

               currDate = new Date();
               timeStamp = currDate.format('ymd_His');
               Ext.getCmp("name").setValue(name + timeStamp);
               Ext.getCmp("output").setValue( output + timeStamp + '.txt' );


//            console.log(network,ib_available);
//            if (ib_available == "1")
//            {Ext.getCmp("ib").enable();
//            	console.log("ib"); }
//            else
//            {            console.log("tcp");
//            	Ext.getCmp("ib").disable(); }
//            if (network == "ib")
//            {
//            Ext.getDom("ib").checked = true;
//            Ext.getDom("tcp").checked = false;
//            }
//            else
//               {
//                 Ext.getDom("tcp").checked = true;
//                 Ext.getDom("ib").checked = true;
//               }
//            if (sharemem == "1" )
//            {Ext.getCmp("memory").checked = true;}
//            else
//            {Ext.getCmp("memory").checked = false;}            		                       
//            if (cpubind == "1" )
//            {Ext.getCmp("cpuBind").checked = true;}
//            else
//            {Ext.getCmp("cpuBind").checked = false;}
            Ext.getCmp("file").setValue(file); 
            Ext.getCmp("programarg").setValue(programarg);                
            Ext.getCmp("path").setValue(workdir);
            Ext.getCmp("inputFile").setValue("");
            Ext.getCmp("subFile").setValue("");
            //Ext.getCmp("output").setValue(output);
            
            Ext.getCmp("nvidia").disable();
            Ext.getCmp("ati").disable();
            if ( numnodes == 1 )
            {
            	Ext.getCmp("THREADS").disable();
            	Ext.getDom("MPI").checked = true
            	if (gpuacc_available == '1' )
            	Ext.getCmp("gpuacc").enable();
            }
            else
            {Ext.getCmp("gpuacc").disable(); }
            
            Ext.getCmp("mpiAdvOpt").setValue("");
            Ext.getCmp("pbsAdvOpt").setValue("");
            Ext.getCmp("preCommands").setValue("");
            Ext.getCmp("postCommands").setValue("");               
            //mpiRelateRefresh();
            queueRelateRefresh();
            if (clusquota_available == 1) cquotaBarRefresh();
            }

