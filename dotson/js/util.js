function getparastr(strname)
	  {
	   var hrefstr,pos,parastr,para,tempstr;
	   hrefstr = window.location.href;
	   pos = hrefstr.indexOf("?")
	   parastr = hrefstr.substring(pos+1);
	   para = parastr.split("&");
	   tempstr="";
	   for(i=0;i<para.length;i++)
	   {
		tempstr = para[i];
		pos = tempstr.indexOf("=");
		if(tempstr.substring(0,pos) == strname)
		{
		 return tempstr.substring(pos+1);
		 }
	   }
	   return null;
	}