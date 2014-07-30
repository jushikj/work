
var Introduction= '<p><br/>LAMMPS（Large-scale Atomic/Molecular Massively Parallel Simulator）是一款大尺度原子分子大规模并\
    行模拟程序。LAMMPS包含各种势，可以用于模拟软物质（生物分子、多聚体）和固体(金属、半导体)，以及粗粒化算法和介关\
    系统的模拟。它可以在原子尺度、介观尺度、和连续介质尺度进行分子模拟。LAMMPS的并行处理能力很强，可以做到上万个\
    核心的大规模分子动力学模拟。</p><p>&nbsp;</p>';

var Resource_Tips= '<p><br/>Queue Status:<br/><br/>列出当前集群上的工作队列及其可用资源。</p><p><br/>ClusQuota CPU Time:<br/><br/>如果部署了ClusQuota集群资源配额计费系统，将显示您目前可用的机时配额，计量单位为“CPU*Hours”。<br/>例如，系统显示目前可用配额为120 CPU*Hours，表明最多可以用12个CPU并行运算10小时。本次计算任务结束之后，将按照“CPU并行数*实际运行时间”扣除相应的机时配额。<br/>队列状态的“Charge Rate”一栏表示它们在ClusQuota系统中的计费比率，例如，优先权高的工作队列其计费比率也相应要高一些。</p><p>&nbsp;</p>';

var Job_Schedule_Tips= '<p><br/>Nnodes:<br/>  <br />  本次计算任务需要使用多少个节点。<br/></p><p><br />  Cores/Node:<br />  <br />本次计算任务每个节点需要使用多少CPU核。</p><p><br />  Wall Time:<br />  <br />本次计算任务预计将运行多长时间。<br /> 根据系统的调度策略，WallTime较短的任务将有机会优先运行；不过须注意，一旦WallTime时间到了而程序尚未运行结束，本次任务将被强行终止。因此请合理预估WallTime的长短。<br />此外，如果部署了ClusQuota集群资源配额计费系统，本次任务申请的机时资源不允许超过您目前可用的机时配额。</p><p><br />Queue:<br />  <br />本次计算任务将使用的工作队列。</p><p><br />Name:<br />  <br />本次计算任务的名称。</p><p><br /> Manage Job File:<br />  <br />启动WinSCP程序上传/下载计算任务的输入输出文件。</p><p>&nbsp;</p>';

var Run_Tips = '<p><br />MPI Type:<br /><br />选择MPI并行环境，如Open MPI或Intel MPI。</p> \
    <p><br />Remote Shell:<br /><br />多节点并行任务，MPI初始化并行环境时，节点之间的访问模式。\
    建议采用默认的SSH模式。</p><p><br />Commucation:<br /><br />多节点并行任务，节点之间数据交换\
    采用何种网络。如果勾选“Share Memory”选项，表示同一节点内的MPI进程采用共享内存方式进行数据交换；\
    如果勾选“CPU Binding”选项，表示将MPI进程与固定的CPU核心绑定，防止进程漂移。\
    开启这两个选项通常可以提高MPI程序的运行速度。\
    </p><p><br />MPI Program:<br /><br />选择本次计算任务的NAMD可执行程序。\
    </p><p><br />Arguments:<br /><br />如果应用程序运行时需要提供自定义的参数，请在此输入。\
    </p><p><br />Working DIR:<br /><br />本次计算任务的工作目录。\
    </p><p><br />Input File:<br /><br />算例的输入文件。\
    </p><p><br />Output File:<br /><br />计算过程中的标准输出和标准错误输出信息，将被重定向保存为文件。</p>\
    <p>&nbsp;</p>';

var Remote_Visualization_Tips = '<p><br />VNC Connection:<br /><br /> 对于图形界面交互性较强的应用软件，比如三维建模、数据分析等前后处理环节，可在提交计算任务的同时，启用VNC方式打开服务器端的远程桌面，进行交互式作业。对于VASP应用而言，该选项默认关闭。<br /><br />如果集群中部署了Clusviz远程三维制图节点，该选项可将远程服务器的三维图像实时传递到本地客户端，有助于高端图形工作站的集中管理，保护涉密数据。</p><p>&nbsp;</p>';

var checkpoint_tips = '<p><br />Checkpoint:<br /><br />如果部署了ClusNap集群容错系统，对于关键任务可选择启用CheckPoint/Restart模式，将程序的内存状态定期保存为断点文件。万一节点故障导致本次任务失败，可以从上次保存断点的地方恢复继续运算，无需再次从头开始。</p><p><br />Internal:<br /><br />设定保存断点状态的时间间隔；ClusNap默认仅保留最新的两个断点状态。</p><p>&nbsp;</p>';

var advanced =  '<p><br />PBS Options:<br /><br />如果需要手动添加PBS作业的高级参数，可在此处设置。这类参数的行首必须包含“#PBS”关键字，将被加到PBS脚本文件的开始处。该选项默认无需设置。</p> \
    <p><br />Pre Commands:<br /><br />如果运行Fluent命令之前需要做前处理操作，可在此处设置相关命令参数，命令行格式必须遵循bash脚本规范。该选项默认无需设置。</p> \
    <p><br />Post Commands:<br /><br />如果在Fluent命令运行结束之后需要做后处理操作，可在此处设置相关命令参数，命令行格式必须遵循bash脚本规范。该选项默认无需设置。</p><p>&nbsp;</p>';

$("#page-portal-tips-introduction").append(Introduction);
$("#page-portal-tips-run").append(Run_Tips);
$("#page-portal-tips-resource").append(Resource_Tips);
$("#page-portal-tips-sched").append(Job_Schedule_Tips);
$("#page-portal-tips-vnc").append(Remote_Visualization_Tips);
$("#page-portal-tips-checkpoint").append(checkpoint_tips);
$("#page-portal-tips-adv").append(advanced);    

 
