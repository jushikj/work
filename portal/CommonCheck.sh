#!/bin/sh

## find the min/max from a column of numbers
find_min(){
    awk '{if(min==""){min=$1}; if($1!="" && $1<min) {min=$1};} END {print min}'
}

find_max()
{
    awk '{if(max==""){max=$1}; if($1!="" && $1>max) {max=$1};} END {print max}'
}

cal_total()
{
    awk 'BEGIN{sum=0}{sum+=$1}END{print sum}'
}

## define the temp files
define_temp_file()
{
    QTMPDIR=/tmp/que$CHECKUSER$QTIMESTAMP
    mkdir -p $QTMPDIR
    chmod 777 $QTMPDIR
    QUEDIAGN=$QTMPDIR/queueDiagN$QTIMESTAMP
    QUEDIAGT=$QTMPDIR/queueDiagT$QTIMESTAMP
    QUERATE=$QTMPDIR/queueRate$QTIMESTAMP
}

## Read config file
get_check_config()
{
    #source ${DIRNAM}/../../CommonConf.setting
    #source ${DIRNAM}/${PORTALNAM}.setting
    user_home=$(finger -mlp ${CHECKUSER}|head -n2| tail -n1|awk '{print $2}')
}

get_diskquota_info()
{
    ## print the disk quota info
    DSKQUOTAF=$QTMPDIR/diskquotaf$QTIMESTAMP
    DSKUSER=$CHECKUSER
    if [ "$DSKUSER" == "root" ];then
        if [ "$nfs_root_squash" == "0" ];then
            DSKUSER='nobody'
        fi
    fi
    quota -uv $DSKUSER 2>/dev/null | grep "${user_home}" > $DSKQUOTAF
    if [ "$nfs_quota_available" == "1" ] && [  $(cat ${DSKQUOTAF} |wc -l) -ne 0 ];then
        diskUsed=$(awk '{print $2}' $DSKQUOTAF)
        diskLimits=$(awk '{print $3}' $DSKQUOTAF)
        let diskLimitsGb=diskLimits/1048576
        echo "var diskfilesystem=\"$user_home\";"
        echo "var diskused=$diskUsed;"
        echo "var disklimits=$diskLimits;"
        echo "var disklimitsgb=$diskLimitsGb;"
        echo "var diskquota_available=1;"
    else 
        echo "var diskfilesystem=null;"
        echo "var diskused=\"0\";"
        echo "var disklimits=\"0\";"
        echo "var disklimitsgb=\"0\";"
        echo "var diskquota_available=0;"
    fi
}

## print the ClusQuota info
get_clusquota_info()
{
    touch $QUERATE
    ## clusqota process does not start
    if [ $(ps aux|grep '\<clusquota\>'|wc -l) -lt 2 ];then
        clusquota_available=0;
        echo "var clusquota_available=0;"
        return;
    fi
    # maui does not use clusquota
    if [ $(/opt/gridview/pbs/dispatcher-sched/bin/showconfig|grep '\<GOLD\>'|wc -l) -eq 0 ];then
        clusquota_available=0;
        echo "var clusquota_available=0;"
        return;
    fi
    /opt/gridview/clusquota/bin/goldsh ChargeRate Query |grep 'NBM  Queue' > $QUERATE 2>&1
    user_cq_info=$(/opt/gridview/clusquota/bin/gbalance -u $CHECKUSER|grep '\<'$CHECKUSER'\>')
    # user doest not exist
    if [ $(echo $user_cq_info|grep "does not exist"|wc -l) -ne 0 ] || [ "${user_cq_info}" == "" ];then
        echo "var clusquota_available=0;"
        return;
    fi
    cq_user_sec=$(echo ${user_cq_info}|awk '{print $7}')
    cq_user_total_sec=$(echo ${user_cq_info}|awk '{print $3}')
    let varUserCqHour=$cq_user_sec/3600
    let varUserCqTotalHour=$cq_user_total_sec/3600
    echo "var dUserCqSec=$cq_user_sec;"
    echo "var dUserCqHour=$varUserCqHour;"
    echo "var dUserCqTotalSec=$cq_user_total_sec;"
    echo "var dUserCqTotalHour=$varUserCqTotalHour;"
    echo "var clusquota_available=1;"
    clusquota_available=1;
}

#input:
#1: user name
maui_get_user_limits()
{
    maui_user_maxnode=$(/opt/gridview/pbs/dispatcher-sched/bin/mdiag -u $1 \
        | tail -n2 | head -n1 \
        | grep -E -o 'MAXNODE=[0-9]+'\
        | awk -F"=" '{print $2}')
    maui_user_maxproc=$(/opt/gridview/pbs/dispatcher-sched/bin/mdiag -u $1 \
        | tail -n2 | head -n1 \
        | grep -E -o 'MAXPROC=[0-9]+'\
        | awk -F"=" '{print $2}')
}

## Check the PBS queue status
all_queue_stat()
{
    i=0
    j=0
    /opt/gridview/pbs/dispatcher-sched/bin/diagnose -n -v > $QUEDIAGN 2>&1
    /opt/gridview/pbs/dispatcher-sched/bin/diagnose -t > $QUEDIAGT 2>&1
    echo -n "var aQueStat=["
    for queName in $queList; do
        let i=$i+1
        queNodes=`grep '\<'$queName'_' $QUEDIAGN|wc -l`
        queBusyNodes=`grep '\<'$queName'_' $QUEDIAGN|grep -v Drained|awk '{print $3}'|grep ^0:|wc -l`
        queFreeNodes=`grep '\<'$queName'_' $QUEDIAGN|grep Idle|wc -l`
        queFreeCore=$(tail -n2 $QUEDIAGT \
            | head -n1 \
            | grep -o -E '\<'$queName'\> [0-9:]+' \
            | awk '{print $2}'\
            | cut -d':' -f1)
        queMaxPPN=`grep '\<'$queName'_' $QUEDIAGN|awk '{print $3}' |awk -F':' '{print $2}' |find_max`
        queMaxMem=`grep '\<'$queName'_' $QUEDIAGN|awk '{print $4}' |awk -F':' '{print $2}' |find_max`

        queChargeRate=`grep -w $queName $QUERATE |awk '{print $4}'`
        if [ -z $queChargeRate ];then
            queChargeRate='1'
        fi

        /opt/gridview/pbs/dispatcher/bin/qstat -Qf1 $queName > $QTMPDIR/$queName.conf 2>&1

        queMaxNodect=`grep 'resources_max.nodect' $QTMPDIR/$queName.conf | awk '{print $3}'`
        if [ -z "$queMaxNodect" ]; then
            queMaxNodect=${queNodes}
        fi
        if [ ! -z ${maui_user_maxnode} ] && [ ${maui_user_maxnode} -lt ${queMaxNodect} ];then
            queMaxNodect=${maui_user_maxnode}
        fi
        queMinNodect=`grep 'resources_min.nodect' $QTMPDIR/$queName.conf | awk '{print $3}'`
        if [ -z "$queMinNodect" ]; then
            queMinNodect=1
        fi
        queMaxNcpus=`grep 'resources_max.ncpus'  $QTMPDIR/$queName.conf | awk '{print $3}'`
        if [ -z "$queMaxNcpus" ]; then
            queMaxNcpus=$(grep '\<'$queName'_' $QUEDIAGN \
                | awk '{print $3}'\
                | awk -F":" '{print $2}' \
                | cal_total)
        fi
        if [ ! -z ${maui_user_maxproc} ] && [ ${maui_user_maxproc} -lt ${queMaxNcpus} ];then
            queMaxNcpus=${maui_user_maxproc}
        fi
        queMinNcpus=`grep 'resources_min.ncpus'  $QTMPDIR/$queName.conf | awk '{print $3}'`
        if [ -z "$queMinNcpus" ]; then
            queMinNcpus=1
        fi
        queMaxWalltime=`grep 'resources_max.walltime' $QTMPDIR/$queName.conf | awk '{print $3}'`
        if [ -z "$queMaxWalltime" ]; then
            if [ "${clusquota_available}" == "1" ];then
                queMaxWalltime=${cq_user_sec}
            else
                queMaxWalltime=unlimit
            fi
        else
            max_wall_sec=$(echo ${queMaxWalltime}|awk -F":" '{t=0; for (i=1;i<= NF;i++){t=(t*60)+$i};print t}')
            if [ "${clusquota_available}" == "1" ] && [ ${max_wall_sec} -gt ${cq_user_sec} ];then
                queMaxWalltime=${cq_user_sec}
            fi
        fi
        queMinWalltime=`grep 'resources_min.walltime' $QTMPDIR/$queName.conf | awk '{print $3}'`
        if [ -z "$queMinWalltime" ]; then
            queMinWalltime=unlimit
        fi

        if [ -z "`grep "acl_user_enable = True" $QTMPDIR/$queName.conf`" ];then
            queAcceIs=true
        else
            if [ -z "`grep "acl_users" $QTMPDIR/$queName.conf |grep $CHECKUSER`" ]; then
                queAcceIs=false
            else
                queAcceIs=true
            fi
        fi

        if [ "$queAcceIs" == true ];then
            if [ $j -gt 0 ];then
                queAcceList="$queAcceList,[\"$queName\"]"
            else
                queAcceList="$queAcceList[\"$queName\"]"
                let j=$j+1
            fi
        fi

        if [ $i -gt 1 ];then
            echo -n ,
        fi
        echo -n "[$i,'$queName','$queNodes','$queBusyNodes','$queFreeNodes','$queFreeCore','$queChargeRate','$queAcceIs','$queMaxPPN','$queMaxMem','$queMaxNodect','$queMaxNcpus','$queMaxWalltime','$queMinNodect','$queMinNcpus','$queMinWalltime']"
    done
    echo ]\;
}


#get all queue detail status, and accessable queues
get_all_queue_info()
{
    queList=`qmgr -c 'p s'|grep 'create queue' |awk '{print $3}'`

    #make default queue as the first queue
    default_que=$(qmgr -c 'p s'|grep 'default_queue'|awk '{print $5}')
    queList=$(echo $queList | sed 's/'$default_que'//')
    queList="$default_que $queList"

    # print the Accessible Queue list
    queAcceList="["

    # get all queue detail status
    maui_get_user_limits $CHECKUSER;
    all_queue_stat;

    queAcceList=$queAcceList"]"
    echo "var aQueList=$queAcceList;"

    ppn_default=$(grep '\<'$default_que'_' $QUEDIAGN|awk '{print $3}' |awk -F':' '{print $2}' |find_max)
}





main()
{

    if [  -f /etc/profile.d/dawning.sh ];then
        source /etc/profile.d/dawning.sh
    fi
    export QTIMESTAMP=`date +%Y%m%d_%H%M%S`
    export DOLLAR=$
    if [ "$1" !=  "" ];then
        CHECKUSER=$1
    fi
    if [ "$CHECKUSER" == "" ];then
        exit 1;
    fi

    define_temp_file
    get_check_config
    get_diskquota_info
    get_clusquota_info
    get_all_queue_info
    rm -rf $QTMPDIR
}

main $@
