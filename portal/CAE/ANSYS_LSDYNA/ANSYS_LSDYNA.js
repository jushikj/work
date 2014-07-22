

Ext.onReady(function() {

  // turn on validation errors beside the field globally
    Ext.form.Field.prototype.msgTarget = 'under';

/** ******************WinSCP地址传递(通过读取浏览器地址)************************** */

    // coreSoftwareOpen("winscp", 集群管理节点ip, UserHomePath)
    // 传递ip参数为：
    // 1.portal_strJobManagerAddr 通过gridview传递
    // 2.currentAddr 通过读取浏览器地址
    var currentAddr;
    var AddrSplit;
    currentAddr = location.host;
    AddrSplit = currentAddr.split(":");
    currentAddr = AddrSplit[0];



/** ******************************表单初始化****************************************** */

            var RunField= new Ext.form.FieldSet(
                      { title : "Run Parameters",
/*******************************Run Parameter*************************************/
                        layout : "form",
                        xtype : 'fieldset',
                        autoWidth : true,
                        hideCollapseTool: false,
                        titleCollapse: true,
                        collapsible: true,
                        labelWidth : 80,
                        items : [
                          { layout : "column",
                            width : 450,
                            autoWidth : true,
                            items : [
                                  { layout : "form",
                                    columnWidth : .5,
                                    labelWidth : 80,
                                    items : [
                                        { fieldLabel : 'Precision',
                                          xtype : 'radiogroup',
                                          items : [
                                              { boxLabel : 'Double',
                                                name : 'precision',
                                                id : 'double',
                                                inputValue : 'double'
                                              },
                                              { boxLabel : 'Single',
                                                name : 'precision',
                                                id : 'single',
                                                inputValue : 'single',
                                                checked : true
                                              }
                                            ]
                                        }
                                      ]
                                  },
                                  { layout : "form",
                                    columnWidth : .5,
                                    labelWidth : 80,
                                    items : [
                                        { fieldLabel : 'Remote Shell',
                                          xtype : 'radiogroup',
                                          items : [
                                              { boxLabel : 'RSH',
                                                name : 'sh',
                                                id : 'rsh',
                                                inputValue : 'RSH'
                                              },
                                              { boxLabel : 'SSH',
                                                name : 'sh',
                                                id : 'ssh',
                                                inputValue : 'SSH',
                                                checked : true
                                              }
                                            ]
                                        }
                                      ]
                                  }
                                  ]
                          },
                          { layout : 'column',
                              items : [
                                  { layout : 'form',
                                    columnWidth : .6,
                                    items : [
                                    { fieldLabel : 'ANSYS bin',
                                      xtype : 'combo',
                                      width : 340,
                                      mode : 'local',
                                      id : 'file',
                                      value : file,
                                      triggerAction : 'all',
                                      forceSelection : true,
                                      editable : false,
                                      name : 'file',
                                      displayField : 'MPIPROG',
                                      valueField : 'MPIPROG',
                                      store : s_mpiProg
                                    }]
                                  },
                                  { xtype : 'button',
                                    columnWidth : .1,
                                    text : "Browse...",
                                    handler : function() {
                                    	file=Ext.getCmp("file").getValue();
                                    	var filePath=fileDir(file);
                                    	openFile("file",filePath);
                                  }
                                  }
                                ]
                          },
                          { fieldLabel : 'Arguments',
                              width : 340,
                              xtype : 'textfield',
                              name : 'programarg',
                              id : "programarg",
                              allowBlank : true
                          },
                          { layout : 'column',
                            items : [
                               {  layout : 'form',
                                  columnWidth : .6,
                                  items : [{
                                    fieldLabel : 'Working DIR',
                                    width : 340,
                                    xtype : 'textfield',
                                    name : 'path',
                                    id : "path",
                                    allowBlank : false
                                  }]
                                },
                                { columnWidth : .1,
                                  xtype : 'button',
                                  text : "Browse...",
                                  id : "PathBtn",
                                  handler:function() {
                                    	var filePath=Ext.getCmp("path").getValue();
                                    	openPath("path",filePath);
                                    	}
                                }
                              ]
                          },
                          {layout : 'column',
                            items : [
                              {  layout : 'form',
                                  columnWidth : .6,
                                  items : [{
                                    fieldLabel : 'Input File',
                                    width : 340,
                                    xtype : 'textfield',
                                    name : 'inputFile',
                                    id : "inputFile",
                                    allowBlank : false
                                  }]
                                },
                                { columnWidth : .1,
                                  xtype : 'button',
                                  text : "Browse...",
                                  id : "InputFileBtn",
                                  handler:function() {
                                    	var filePath=Ext.getCmp("path").getValue();
                                    	openFile("inputFile",filePath);
                                    	}
                                }                              
                          	  ]
                          },
                          { fieldLabel : 'Output File',
                            xtype : 'textfield',
                            width : 340,
                            name : 'output',
                            id : "output",
                            allowBlank : false
                          }
                        ]
                      }
                      );
            var simple = new Ext.FormPanel(
                {
                  labelAlign : 'left',
                  frame : true,
                  title : portal_strAppName + " Portal v" + portal_version,
                  layout : "form",
                  id : "simple",
                  bodyStyle : 'padding:5px 5px 0',
                  width : 800,
                  buttonAlign : "center",
                  items : [{
                        xtype : 'panel',
                        border : false,
                        html : '<p align="center"><img src="' + imgName + '"/></p>'
                      },
                      AviResField,
                      JobSchField,
                       RunField,
                       VncField,
                       CRField,
                       AdvField2
                  ],

                  buttons : [
                      { text : 'Submit',
                      	id : 'submit',
                        handler : mySubmit
                      },
                      { text : 'Reset',
                        id : 'resetting',
                        // iconCls:'freshbutton',
                        handler : function()
                        {
                          simple.getForm().reset();
                          formAllReset();
                        }
                      }]
                });


            var tmpPanel = new Ext.Panel({
              renderTo:Ext.getBody(),
              autoScroll : true,
              layout : "column",
              width:1150,
              bodyStyle : 'padding-left:15px;padding-bottom:30px',
              frame:true,
              items:[{
                      layout : "form",
                      columnWidth : .73,
                      items:[simple]
                     },
                     {
                      layout : "form",
                      items:[introTips,resTips,jobTips,runTips,vncTips,crTips,advTips]
                     }
              ]
            });
            tmpPanel.show();


            formAllReset();
            formRefresh();
  });
