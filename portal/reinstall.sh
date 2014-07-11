#!/bin/bash
TypeFile=portal.type
GridviewHome=`awk '/^GridviewHome/ {print $2}' $TypeFile`
PortalHome=${GridviewHome}/gridviewAppTemplate

uncommentfile()
(
awk '$1 !~ /^#/ ' $1 |grep -v "127.0.0.1" |grep -v "::1" |grep -v "^$"
exit 0
)

TYPE=(`uncommentfile $TypeFile|awk '(NF==3) {print $1}'`)
NAME=(`uncommentfile $TypeFile|awk '(NF==3) {print $2}' `)
VALUE=(`uncommentfile $TypeFile|awk '(NF==3) {print $3}' `)
num=${#TYPE[*]}
for((i=0;$i<$num;i++));do
if [ ${VALUE[$i]} == 1 ];then
   if ! [ -d ${PortalHome}/${TYPE[$i]} ];then
   mkdir -p ${PortalHome}/${TYPE[$i]}
   fi
   if [ -d ${PortalHome}/${TYPE[$i]}/${NAME[$i]} ];then
   echo "Delete old Portal  ${TYPE[$i]}(Type) ${NAME[$i]}(Name) ...."
   sleep 2
   rm -rf ${PortalHome}/${TYPE[$i]}/${NAME[$i]}
   fi
   cp  -r ${TYPE[$i]}/${NAME[$i]}-20* ${PortalHome}/${TYPE[$i]}/${NAME[$i]}
   if [ $? != 0 ] ;then
   printf "Error Portal Type : ${TYPE[$i]} or Name : ${NAME[$i]} \n\n\n\n"
   else
   chmod +x  ${PortalHome}/${TYPE[$i]}/${NAME[$i]}/${NAME[$i]}.run
   printf "Install Portal: ${TYPE[$i]}(Type) ${NAME[$i]}(Name) successfully!!\n\n"
   fi
   
fi
done
