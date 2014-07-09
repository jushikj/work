var introduction_desc = "Fluent为业界最通用计算流体力学(CFD)软件包，用来模拟从不可压缩到高度可压缩范围内的复杂流动。 由于采用了多种求解方法和多重网格加速收敛技术，因而FLUENT能达到最佳的收敛速度和求解精度。灵活的非结构化网格 和基于解的自适应网格技术及成熟的物理模型，使FLUENT在转捩与湍流、传热与相变、化学反应与燃烧、多相流、旋转机械、 动/变形网格、噪声、材料加工、燃料电池等方面有广泛应用。目前Fluent被Ansys公司收购，加入了Ansys软件的大家庭。";

var resource_tips_desc = "\
<p>\
    <br />Queue Status:<br />\
    <br />列出当前集群上的工作队列及其可用资源。 \
</p>\
<p>\
    <br />ClusQuota CPU Time:<br />\
    <br />如果部署了ClusQuota集群资源配额计费系统，将显示您目前可用的机时配额， 计量单位为“CPU*Hour\
    例如，系统显示目前可用配额为120\
    CPU*Hours，表明最多可以用12个CPU并行运算10小时。\
    本次计算任务结束之后，将按照“CPU并行数*实际运行时间”扣除相应的机时配额。 <br />\
    队列状态的“Charge\
    Rate”一栏表示它们在ClusQuota系统中的计费比率，例如，优先权高的工作队列其计费比率也相应要\
</p>\
<p>&nbsp;</p>";

var run_tips_desc = "\
<p>\
    <br />Version:<br />\
    <br />选择Fluent计算算例的类型，分为2d,3d,2ddp,3ddp 等等。 \
</p>\
<p>\
    <br />MPI Type:<br />\
    <br />并行计算时，选择使用的MPI类型，分为HP mpi，Intel mpi或openmpi，建议使用效率最高的默认的HP mpi。  \
</p>\
<p>\
    <br />Remote Shell:<br />\
    <br />多节点并行任务，节点之间的访问模式。建议采用默认的SSH模式。 \
</p>\
<p>\
    <br />Arguments:<br />\
    <br />Fluent的其它选项，默认为空。 \
</p>\
<p>\
    <br />Working DIR:<br />\
    <br />本次计算任务的工作目录。\
</p>\
<p>\
    <br />Input File:<br />\
    <br />Fluent的输入控制文件。\
</p>\
<p>\
    <br />Output File:<br />\
    <br />计算过程中的标准输出和标准错误输出信息，将被重定向保存为文件。\
    <p>&nbsp;</p>\
</p>";

var job_sched_tips_desc = "\
<p>\
    <br />Nnodes:<br />\
    <br />本次计算任务需要使用多少个节点。<br />\
</p>\
<p>\
    <br />Cores/Node:<br />\
    <br />本次计算任务每个节点需要使用多少CPU核。 \
</p>\
<p>\
    <br />Wall Time:<br />\
    <br />本次计算任务预计将运行多长时间。 <br />\
    根据系统的调度策略，WallTime较短的任务将有机会优先运行；不过须注意，\
    一旦WallTime时间到了而程序尚未运行结束，本次任务将被强行终止。因此请合理预估WallTime的长\
    此外，如果部署了ClusQuota集群资源配额计费系统，本次任务申请的机时资源不允许超过您目前可用\
</p>\
<p>\
    <br />Queue:<br />\
    <br />本次计算任务将使用的工作队列。 \
</p>\
<p>\
    <br />Name:<br />\
    <br />本次计算任务的名称。\
</p>\
<p>\
    <br />Manage Job File:<br />\
    <br />启动WinSCP程序上传/下载计算任务的输入输出文件。\
</p>\
<p>&nbsp;</p>";

var vnc_tips_desc = "\
<p>\
    <br />VNC Connection:<br />\
    <br />对于图形界面交互性较强的应用软件，比如三维建模、\
    数据分析等前后处理环节，可在提交计算任务的同时，启用VNC方式打开服务器端的远程桌面，进行交\
    <br />如果集群中部署了Clusviz远程三维制图节点，该选项可将远程服务器的三维图像实时传递到本地客户\
    有助于高端图形工作站的集中管理，保护涉密数据。\
</p>\
<p>&nbsp;</p>";

var checkpoint_tips_desc = "\
<p>\
<br />Checkpoint:<br />\
<br />如果部署了ClusNap集群容错系统，对于关键任务可选择启用CheckPoint/Restart模式，\
将程序的内存状态定期保存为断点文件。万一节点故障导致本次任务失败，可以从上次保存断点的地方恢复继\
</p>\
<p>\
<br />Internal:<br />\
<br />设定保存断点状态的时间间隔； ClusNap默认仅保留最新的两个断点状态。\
</p>\
<p>&nbsp;</p>";

var adv_tips_desc = "\
<p>\
    <br />MPI Options:<br />\
    <br />如果需要手动添加MPI并行时的高级参数，可在此处设置，\
    这些参数将被传递成为mpirun命令行参数的一部分。该选项默认无需设置。\
</p>\
<p>\
    <br />PBS Options:<br />\
    <br />如果需要手动添加PBS作业的高级参数，可在此处设置。\
    这类参数的行首必须包含“#PBS”关键字，将被加到PBS脚本文件的开始处。该选项默认无需设置。\
</p>\
<p>\
    <br />Pre Commands:<br />\
    <br />如果运行mpirun命令之前需要做前处理操作，可在此处设置相关命令参数，\
    命令行格式必须遵循bash脚本规范。该选项默认无需设置。\
</p>\
<p>\
    <br />Post Commands:<br />\
    <br />如果在mpirun命令运行结束之后需要做后处理操作，可在此处设置相关命令参数，\
    命令行格式必须遵循bash脚本规范。该选项默认无需设置。\
</p>\
<p>&nbsp;</p>\
";

//$("#page-portal-tips").append(all_tips);
$("#page-portal-tips-introduction").append(introduction_desc);
$("#page-portal-tips-run").append(run_tips_desc);
$("#page-portal-tips-resource").append(resource_tips_desc);
$("#page-portal-tips-sched").append(job_sched_tips_desc);
$("#page-portal-tips-vnc").append(vnc_tips_desc);
$("#page-portal-tips-checkpoint").append(checkpoint_tips_desc);
$("#page-portal-tips-adv").append(adv_tips_desc);