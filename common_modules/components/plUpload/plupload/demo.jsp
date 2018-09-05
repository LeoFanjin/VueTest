<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>附件上传示例</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<!-- fonts -->
	<link rel="stylesheet" type="text/css" href="plug-in/ace/assets/css/font-awesome.min.css" />
	<!--[if IE 7]>
	<link rel="stylesheet" type="text/css" href="plug-in/ace/assets/css/font-awesome-ie7.min.css" />
	<![endif]-->
	<link rel="stylesheet" type="text/css" href="plug-in/ace/assets/css/ace-fonts.css" />
			<!-- ace styles -->
	<link rel="stylesheet" type="text/css" href="plug-in/ace/assets/css/ui.jqgrid.css"></link>
	
	<link rel="stylesheet" type="text/css" href="plug-in/ace/assets/css/ace.min.css" />
	<link rel="stylesheet" type="text/css" href="plug-in/ace/assets/css/ace-rtl.min.css" />
	<link rel="stylesheet" type="text/css" href="plug-in/ace/assets/css/ace-skins.min.css" />
  </head>
  <link href="./plug-in/plupload/ext/css/flat-ui.min.css" rel="stylesheet" type="text/css"/>
<link href='./plug-in/bootstrap/css/bootstrap.min.css' rel='stylesheet' type="text/css"/>
<link href="./plug-in/ace/assets/iconfont/icomoon/style.css" rel="stylesheet" type="text/css"/>
<link href="./plug-in/ace/assets/stylesheets/bootstrap/fileinput.css" media="all" rel="stylesheet" type="text/css"/>
<link href="./plug-in/plupload/ext/css/base.css" rel="stylesheet" type="text/css"/>

<script src="./plug-in/ace/assets/javascripts/operation/jquery-1.11.3.min.js" type="text/javascript"></script>
<script src="./plug-in/ace/assets/javascripts/bootstrap/bootstrap.min.js" type="text/javascript"></script>
<script type="text/javascript" src="./plug-in/plupload/js/moxie.min.js"></script>
<script type="text/javascript" src="./plug-in/plupload/js/plupload.dev.js"></script>
<script type="text/javascript" src="./plug-in/plupload/js/jquery.plupload.queue/jquery.plupload.queue.js"></script>
<script type="text/javascript" src="./plug-in/jscommon/sinosoft.js"></script>
<script type="text/javascript" src="./plug-in/jscommon/sinosoft-date.js"></script>
<script type="text/javascript" src="./plug-in/jscommon/sinosoft-uploadfile.js"></script>
<body>
<div id="uploadDemo" style="padding:10px 50px 10px 50px;width:70%;"></div>
<div style="margin-left:30%;">
	<a style="position:relative;" href="javascript:void(0);" onclick="saveFile();">
		<span class="btn btn-default fileinput-upload fileinput-upload-button" title="提交" tabindex="500">
		<i class="glyphicon glyphicon-upload"></i>
		<span>提交</span>
		</span>
	</a>
</div>
<div id="uploadDemo2" style="padding:10px 50px 10px 50px;width:70%;"></div>
</body>
<script>
var uploader = null;
var base = '<%=basePath%>';
$(function(){
    var setting = {
        objectId : "uploadDemo",
        batchId : "577",
        isDrag : true,
        viewType : "list",
        isAutoUpload : true,
        onComplete : function(up,file,info){
            console.log("这是第一个附件上传成功。");
        },
        onError : function(up,error){
            console.log("这是第一个附件上传失败。");
        }
    };
    uploader = new sinosoft.uploadfile.Init(setting);
});

function saveFile(){
	var batchId = uploader.getBatchId();
    var param = {"batchId":batchId};
    $.ajax({
    	type : "POST",
    	url : "<%=basePath%>fileUploadController/saveFile",
    	data : param,
    	dataType : "json",
    	success : function(data){
    		alert("上传成功！");
    	},
    	error : function(e){
    		console.log(e);
    	}
    });
}
</script>
</html>
