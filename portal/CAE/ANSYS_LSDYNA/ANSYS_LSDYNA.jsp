<%@ page pageEncoding="UTF-8"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" import="java.io.*"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" type="text/css" href="/common/js/extjs/3_1_1/resources/css/ext-all.css" />
<script type="text/javascript" src="/common/js/extjs/3_1_1/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/common/js/extjs/3_1_1/ext-all.js"></script>

<script type="text/javascript" src="/common/js/gridview/2.5.0/common/widgets/app/GridviewCommonFunction.js"></script>

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
 
    try
    {
      process =runtime.exec("sh /opt/gridview/gridviewAppTemplate/" + type + "/" + name + "/"
			+ name + ".check " + request.getParameter("strOSUser"));
      is = process.getInputStream();
      isr=new InputStreamReader(is);
      br =new BufferedReader(isr);
      while( (line = br.readLine()) != null )
      {
        out.println(line);
        out.flush();
      }
      is.close();
      isr.close();
      br.close();
    }
    catch(IOException e )
    {
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

	
</script>
<!--	
<table width="600" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td height="40">&nbsp;</td>
  </tr>
  <tr>
    <td><div id="form"></div></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
  </tr>   
</table>
-->
<script type="text/javascript" src="../../CommonFunction.js"></script>
<script type="text/javascript" src="../../CommonComp.js"></script>
<script type="text/javascript" src="../../CommonHelp.js"></script>
<script type="text/javascript" src="ANSYS_LSDYNA.func.js"></script>
<script type="text/javascript" src="ANSYS_LSDYNA.help.js"></script>
<script type="text/javascript" src="ANSYS_LSDYNA.js"></script>

</head>
<body>

<div id="window1"></div>
<div id="window2"></div>
	
</body>
</html>
