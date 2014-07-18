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

/** *****************************提交表单****************************************** */
            mySubmit = function() {
              
                var gap_remote_sh = null;
                var gap_mpiruntype = null;
                var gap_paramode = null;
                var gap_inputtype = null;
                var gap_vnc = null;

/** *****************************获取单选框参数值****************************************** */

              if (Ext.getCmp("rsh").getValue() == true)
                gap_remote_sh = 'rsh';
              else
                gap_remote_sh = 'ssh';
              if (Ext.getCmp("hpmpi").getValue() == true)
                gap_mpiruntype = 'hpmpi';
              else
                gap_mpiruntype = 'intelmpi';
              if (Ext.getCmp("dmp").getValue() == true)
                gap_paramode = 'dmp';
              else
                gap_paramode = 'smp';
              if (Ext.getCmp("db").getValue() == true)
                gap_inputtype = 'db';
              else
                gap_inputtype = 'inp';
//              if (Ext.getCmp("ib").getValue() == true)
//                gap_network = 'ib';
//              else if  (Ext.getCmp("tcp").getValue() == true)
//                gap_network = 'tcp';
//
//              if (Ext.getCmp("memory").getValue() == true)
//                gap_share_mem = '1';
//              else
//              	gap_share_mem = null;
//
//              if ((Ext.getCmp("cpuBind").getValue() == true))
//                gap_cpu_binding = '1';
//              else
//                gap_cpu_binding = null;

              if ((Ext.getCmp("IsVNC").getValue() == true))
                gap_vnc = '1';
              else
              	gap_vnc = null;

              // gap_gputype = Ext.getCmp("gputype").getValue();

              gap_pbsAdvOpt=Ext.getCmp("pbsAdvOpt").getValue();
              gap_pbsAdvOpt=gap_pbsAdvOpt.replace(/\n/ig,':');

              gap_preCMD=Ext.getCmp("preCommands").getValue();
              gap_preCMD=gap_preCMD.replace(/\n/ig,':');

              gap_postCMD=Ext.getCmp("postCommands").getValue();
              gap_postCMD=gap_postCMD.replace(/\n/ig,':');
/** ************************************************************************************ */

//              if (!simple.getForm().isValid())
//              if (!Ext.getCmp("simple").getForm().isValid())
//                Ext.MessageBox.alert('提醒', '对不起，您提交的信息有误！', "");
//              else if (Ext.getCmp("nnodes").getValue() * Ext.getCmp("ppn").getValue() * (Ext.getCmp("hours").getValue()*3600 + Ext.getCmp("minutes").getValue()*60 + Ext.getCmp("seconds").getValue()) > dUserCqSec)
              if (Ext.getCmp("nnodes").getValue() * Ext.getCmp("ppn").getValue() * (Ext.getCmp("hours").getValue()*3600 + Ext.getCmp("minutes").getValue()*60 + Ext.getCmp("seconds").getValue()) > dUserCqSec)
              	Ext.MessageBox.alert('提醒', '对不起，您申请的机时资源超过配额，请减少Walltime的值！', "");
              else
                Ext.Ajax.request( {
                      url : "/jm_as/appsubmit/submitAppJob.action",
                      // method:"post",
                      scope : this,
                      // waitMsg:"查询中,请稍后！",
                      params : {
                        strJobManagerID : portal_strJobManagerID,
                        strJobManagerAddr : portal_strJobManagerAddr,
                        strJobManagerPort : portal_strJobManagerPort,
                        strJobManagerType : portal_strJobManagerType,
                        strAppType : portal_strAppType,
                        strAppName : portal_strAppName,
                        strOSUser : portal_strOsUser,
                        strKeyWord : "k1;k2;;;;",
                        strRemark : "remarktest",
                        mapAppJobInfo : Ext.util.JSON.encode( {
                              "GAP_MPI_NNODES"       : Ext.getCmp("nnodes").getValue(),
                              "GAP_MPI_PPN"          : Ext.getCmp("ppn").getValue(),
                              "GAP_MPI_WALL_TIME"    : Ext.getCmp("hours").getValue()+ ":" + Ext.getCmp("minutes").getValue()+ ":" + Ext.getCmp("seconds").getValue(),
                              "GAP_MPI_QUEUE"        : Ext.getCmp("queue").getValue(),
                              "GAP_MPI_NAME"         : Ext.getCmp("name").getValue(),

                              "GAP_MPI_LIC_TYPE"     : Ext.getCmp("lictype").getValue(),
                              "GAP_MPI_REMOTE_SHELL" : gap_remote_sh,
                              "GAP_MPI_MPIRUNTYPE"   : gap_mpiruntype,
                              "GAP_MPI_PARAMODE"     : gap_paramode,
                              "GAP_MPI_INPUTTYPE"    : gap_inputtype,
                              "GAP_MPI_PROGRAM"      : "\'"+Ext.getCmp("file").getValue()+"\'",
                              "GAP_MPI_PROGRAM_ARG"  : Ext.getCmp("programarg").getValue(),
                              "GAP_MPI_WORK_DIR"     : "\'"+Ext.getCmp("path").getValue()+"\'",
                              "GAP_MPI_INPUT"        : "\'"+Ext.getCmp("inputFile").getValue()+"\'",
                              "GAP_MPI_OUTPUT"       : Ext.getCmp("output").getValue(),

                              "GAP_VNC"		     : Ext.getCmp('IsVNC').getValue(),

                              "GAP_MPI_MPI_OPT"      : "\'" + Ext.getCmp("mpiAdvOpt").getValue() + "\'",
                              "GAP_MPI_PBS_OPT"      : "\'" + gap_pbsAdvOpt + "\'",
                              "GAP_MPI_PRE_CMD"      : "\'" + gap_preCMD + "\'",
                              "GAP_MPI_POST_CMD"     : "\'" + gap_postCMD + "\'"
                              })
                            },

                      success : function(response,options) {
                        try {
                          var result = Ext.util.JSON.decode(response.responseText);
						if (result.exitVal == 0)
						{
							var resultStr = "Job submitted successfully！<br/><br/>Job ID："+ result.stdOut;
						    Ext.MessageBox.show
							({
                              title : "Success",
                              msg : resultStr,
                              buttons : Ext.MessageBox.OK,
                              icon : Ext.MessageBox.INFO
                            });

                            var currDate = new Date();
                            var timeStamp = currDate.format('md_His');
                            Ext.getCmp("name").setValue(name + '_' + timeStamp);
                            Ext.getCmp("output").setValue( output + '_' + timeStamp + '.txt' );

                          } else
                          {
                            var resultStr = "Job submitting failed！<br/><br/>"+ result.stdOut + "<br/><br/>"+ result.stdErr;
                            Ext.MessageBox.show({
                              title : "Error",
                              msg : resultStr,
                              buttons : Ext.MessageBox.OK,
                              icon : Ext.MessageBox.ERROR
                              });
                            }
                          }
                        catch (e) {}
                        },

                      failure : function(response,options){
                          var resultStr = "表单提交失败！";
                          Ext.MessageBox.show({
                            title : "Error",
                            msg : resultStr,
                            buttons : Ext.MessageBox.OK,
                            icon : Ext.MessageBox.ERROR
                            });
                          }
                      });
              }

            function formAllReset() {
            
            Ext.getCmp("nnodes").setValue(numnodes);
            Ext.getCmp("ppn").setValue(numppn);
            Ext.getCmp("hours").setValue(hours);
            Ext.getCmp("minutes").setValue(minutes);
            Ext.getCmp("seconds").setValue(seconds);
            Ext.getCmp("queue").setValue(queSelected);
            
            currDate = new Date();
            timeStamp = currDate.format('md_His');
            Ext.getCmp("name").setValue(name + '_' + timeStamp);
            Ext.getCmp("output").setValue( output + '_' + timeStamp + '.txt' );
                            
            Ext.getCmp("lictype").setValue(lictype); 
            if (remoteshell == "ssh")
            {Ext.getDom("ssh").checked = true;}
            else
            Ext.getDom("rsh").checked = true;
            
            if (paramode == "smp")
            {Ext.getDom("smp").checked = true;}
            else
            Ext.getDom("dmp").checked = true;

          
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
            //Ext.getCmp("output").setValue(output);
                       
            if (vnc_available == '1' )
            { Ext.getCmp("IsVNC").enable(); }
            else
            { Ext.getCmp("IsVNC").disable(); }
            if (vnc == '1')
            { Ext.getCmp("IsVNC").checked = true; 
            }
            else
            { Ext.getCmp("IsVNC").checked = false; 
            }
            	
            Ext.getCmp("mpiAdvOpt").setValue("");
            Ext.getCmp("pbsAdvOpt").setValue("");
            Ext.getCmp("preCommands").setValue("");
            Ext.getCmp("postCommands").setValue("");               
            //mpiRelateRefresh();
            queueRelateRefresh();
            if (clusquota_available == 1) cquotaBarRefresh();
            }
            
            function formRefresh() {
            Ext.getCmp("nnodes").on("change", function() {
              //jobScriptRefresh();
              if (clusquota_available == 1) cquotaBarRefresh();
              numnodes=Ext.getCmp("nnodes").getValue();
              console.log(numnodes);
	            if ( numnodes == 1) 
	            	Ext.getCmp("smp").enable();
	            else 
	            	Ext.getCmp("smp").disable();
            });
           
//            Ext.getCmp("smp").on("change", function() {
//            Ext.getCmp("smp").on('check', function() {
//              if (Ext.getCmp("smp").getValue() == true)
//	            {
//	            	gap_paramode = 'smp';
//	            }
//	            else
//	            {
//	            	gap_paramode = 'dmp';
//	            };
//	            console.log(gap_paramode);
 //           });

            Ext.getCmp("ppn").on("change", function() {
              //jobScriptRefresh();

              maxNNodes=totQueNodes;        //total nodes in queue, value defined by last queueRelateRefresh()

              if (maxQueNodes != 'unlimit') //max nodes allowed
              {
              	if (maxNNodes > maxQueNodes) maxNNodes=maxQueNodes;
              }

              if (maxQueCores != 'unlimit') //max cores allowed
              {
                tmpNNodes=maxQueCores / Ext.getCmp("ppn").getValue();
                if (maxNNodes > tmpNNodes) maxNNodes=tmpNNodes;
              }

              Ext.getCmp("nnodes").setMaxValue(maxNNodes);

              if (clusquota_available == 1) cquotaBarRefresh();
            });

            Ext.getCmp("hours").on("change", function() {
              if (clusquota_available == 1) cquotaBarRefresh();
            });


            Ext.getCmp("lictype").on('select', function() {
              //mpiRelateRefresh();
            });

            Ext.getCmp("queue").on('select', function() {
              queueRelateRefresh();
              if (clusquota_available == 1) cquotaBarRefresh();
            });
            }
