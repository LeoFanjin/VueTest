/**
 * Created by Administrator on 2016/8/30 0030.
 */
sinosoft.uploadfile = {};

sinosoft.uploadfile.Init = function(param){
    var self = this;
    self.fileList = new Array();
    self.options = $.extend({},self.options,param);
    self.batchId = self.options.batchId?self.options.batchId:new Date().getMilliseconds();
    self.batchId = self.batchId?self.batchId:new Date().getMilliseconds();
    self.objectId = self.options.objectId;
    var guid = new Date().getTime();
    self.browse_button_id = self.options.objectId+"_"+guid;
    //构建附件区域
    self.createUploadArea();
    //初始化附件
    var setting = self.getParams();
    self.uploader = new plupload.Uploader(setting);
    self.uploader.init();
    //构建拖拽区域
    if(self.options.isDrag){
        self.disableDocumentDrag();
        self.initDrag();
    }
};

sinosoft.uploadfile.Init.prototype.objectId = null;
sinosoft.uploadfile.Init.prototype.uploader = null;
sinosoft.uploadfile.Init.prototype.batchId = null;
sinosoft.uploadfile.Init.prototype.browse_button_id = null;
sinosoft.uploadfile.Init.prototype.fileList = new Array();
/**
 * 构建附件初始化参数
 */
sinosoft.uploadfile.Init.prototype.getParams = function(){
    var self = this;
    var param = {
        runtimes : 'html5,flash,html4,silverlight',
        browse_button : self.browse_button_id,
        url : base + "fileUploadController/plFile",
        file_data_name:'file',
        rename : true,//
        filters : {
        	max_file_size : self.options.maxSize
        },
        multi_selection : true,//是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以。默认true，即可以选择多个文件。需要注意的是，在某些不支持多选文件的环境中，默认值是false。比如在ios7的safari浏览器中，由于存在bug，造成不能多选文件。当然，在html4上传方式中，也是无法多选文件的。
        chunk_size : '10mb', //分片上传文件时，每片文件被切割成的大小
        flash_swf_url : '/dist/vendor/js/plupload/js/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
        silverlight_xap_url : '/dist/vendor/js/plupload/js/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
        init : {
            PostInit: function(uploader) {
                if(self.options.batchId)self.loadFiles(self.options.batchId);
            },
            FilesAdded : function(up,file){
            	$(file).each(function(index,obj){
            		obj.name = self.rename(obj.name);
            	});
                self.filesAdded(up,file);
            },
            BeforeUpload : function(up,file){
            	//判断服务器是否已经存在该文件，如果存在直接返回，不需要继续往后台上传文件
            	self.uploader.setOption({"multipart_params":{'batchId':self.batchId,"tmpFileId":file.id}});
            },
            //上传进度
            UploadProgress : function(up, file) {
                self.process(up,file);
            },
            FileUploaded : function(up, file, result) {
            	self.fileList.push(file);
            	var fileRowId = "uploadFile_"+file.id;
            	$("#"+self.objectId).find("#"+fileRowId).find("#fileId").val(result.response);
            	
            	var fileSize = self.fileList.length;
                $("#"+self.objectId).find("#file_total_id").html(fileSize);
                
                if(self.options.onComplete)self.options.onComplete(up,file,result);
            },
            Error : function(up, err) {
                if(self.options.onError)self.options.onError(up,err);
            }
        }
    };
    return param;
};

/**
 * 获取附件的批量Id
 */
sinosoft.uploadfile.Init.prototype.getBatchId = function(){
	var self = this;
	var batchId = self.batchId;
	$("#"+self.objectId).find("#file_list").find("input[name=fileId]").each(function(index,fileIdObj){
		batchId = batchId + "|"+$(fileIdObj).val();
	});
	return batchId;
};

/**
 * 获取所有的附件信息
 */
sinosoft.uploadfile.Init.prototype.getFiles = function(){
	var self = this;
	return self.fileList;
};

/**
 * 构建附件上传区域
 */
sinosoft.uploadfile.Init.prototype.createUploadArea = function(){
    var self = this;
    var listBody = self.staticOption.listBody;
    var head = self.staticOption.head.replace("@browseBtnId",self.browse_button_id);
    $("#"+self.objectId).append(head);
    
    if(self.options.editType=="edit"){
        listBody = listBody.replace("@checkbox",'<input type="checkbox" style="width: 30px;"/>');
    }else if(self.options.editType=="view"){
    	$("#"+self.browse_button_id).closest("#upload_head").hide();
    	listBody = listBody.replace("@checkbox","&nbsp;");
    }
    
    if(self.options.viewType && self.options.viewType=="both"){
        $("#"+self.objectId).find("div[id=upload_head]").append(self.staticOption.switchMeth);
        $("#"+self.objectId).append(listBody);
//        $("#"+self.objectId).append(self.staticOption.previewBody);
    }else if(self.options.viewType && self.options.viewType=="list"){
        $("#"+self.objectId).append(listBody);
    }else if(self.options.viewType && self.options.viewType=="preview"){
//        $("#"+self.objectId).append(self.staticOption.previewBody);
    }else{
        $("#"+self.objectId).append(listBody);
    }
    $("#"+self.objectId).find("div[id=upload_head]").append(self.staticOption.headEnd);

};

/**
 *
 * @type {{}}
 */
sinosoft.uploadfile.Init.prototype.options = {
    objectId : null,//附件控件ID
    maxSize : '500mb',
    batchId : null,//批量ID,默认为空，如填写了批量ID，则加载批量ID对应的文件列表
    editType : "edit",//编辑模式，'eidt':编辑状态，'view':浏览状态
    isDrag : true,//是否开启拖拽功能
    isAutoUpload : false,//是否自动上传
    filters : null,//文件过滤
    viewType : "list",//文件上传风格，list:经典表格模式，preview:文件预览风格，both:两者皆开启，通过切换按钮
    onComplete : null, //文件上传完成事件处理
    onError : null //文件上传失败事件处理
};

/**
 * 文件添加到队列回调函数
 * @param up
 * @param files
 * @constructor
 */
sinosoft.uploadfile.Init.prototype.filesAdded = function(up, files){
	var self = this;
	self.renderListFile(files);
    if(self.options.isAutoUpload)self.uploader.start();
};

sinosoft.uploadfile.Init.prototype.loadFiles = function(batchId){
	var param = {"batchId":batchId};
	var self = this;
    $.ajax({
    	type : "POST",
    	url : base + "/fileUploadController/allFiles",
    	data : param,
    	dataType : "json",
    	success : function(data){
    		var fileList = new Array();
    		$(data).each(function(index,file){
    			var fileTmp = {};
    			fileTmp.id = file.fileId;
    			fileTmp.size = file.fileSize;
    			fileTmp.name = file.name;
    			fileTmp.progress = 100;
    			fileTmp.createFileDate = file.uploadTime;
    			fileList.push(fileTmp);
    			self.fileList.push(fileTmp);
    		});
    		self.renderListFile(fileList);
    	},
    	error : function(e){
    		alert("没有文件！");
    	}
    });
};

/**
 * 渲染上传文件列表
 * @param files
 */
sinosoft.uploadfile.Init.prototype.renderListFile = function(files){
	var self = this;
	var batchId = self.batchId;
    $(files).each(function(index,file){
    	var fileId = file.id;
    	var progress = file.progress?file.progress:0;
    	var fileRowId = "uploadFile_"+fileId;
    	var fileItem = self.staticOption.fileItemTemp.replace("@filerow",fileRowId);
    	fileItem = fileItem.replace("@fileId",fileId);
        fileItem = fileItem.replace("@filename",file.name).replace("@filename",file.name);
        fileItem = fileItem.replace("@filesize",self.tool.formatSize(file.size));
        fileItem = fileItem.replace("@modifydate",new Date(file.createFileDate).format("yyyy-MM-dd hh:mm"));
        fileItem = fileItem.replace("@progress",progress).replace("@progress",progress);
        
        if(self.options.editType=="edit"){
        	fileItem = fileItem.replace("@checkbox",'<input type="checkbox"/>');
        }else if(self.options.editType=="view"){
        	fileItem = fileItem.replace("@checkbox",'&nbsp;');
        }
        
        $("#"+self.objectId).find("div[id=file_list]").append(fileItem);
        //绑定下载按钮事件==================
        //1、通过下载按钮实现
        $("#"+self.objectId).find("#"+fileRowId).find("#downloadBtn").click(function(){
        	$(this).attr("href","./fileUploadController/dlFile?batchId="+batchId+"&fileId="+fileId);
        	$(this).attr("target","_blank");
        });
        //2、通过点击文件名实现下载
        $("#"+self.objectId).find("#"+fileRowId).find(".filename").click(function(){
        	$(this).attr("href","./fileUploadController/dlFile?batchId="+batchId+"&fileId="+fileId);
        	$(this).attr("target","_blank");
        });
        
        if(self.options.editType=="edit"){
        	$("#"+self.objectId).find("#"+fileRowId).find("#removeBtn").show();
        	 //绑定删除按钮事件
            $("#"+self.objectId).find("#"+fileRowId).find("#removeBtn").click(function(){
            	$(this).closest("#"+fileRowId).remove();
            	$(self.fileList).each(function(index,file){
            		if(file.id==fileId){
            			self.fileList.remove(index);
            		}
            	});
            	$("#"+self.objectId).find("#file_total_id").html(self.fileList.length);
            });
        }else if(self.options.editType=="view"){
        	$("#"+self.objectId).find("#"+fileRowId).find("#removeBtn").remove();
        }
    });
    //更改显示的总数量
    $("#"+self.objectId).find("#file_total_id").html(files.length);
};

/**
 * 上传进度监控
 * @param up
 * @param file
 */
sinosoft.uploadfile.Init.prototype.process = function(up,file){
	var processBar = $("#uploadFile_"+file.id).find("#processBar");
	var process = file.percent + "%";
    $(processBar).width(process);
    var processBarView = $("#uploadFile_"+file.id).find("#processBarView");
    $(processBarView).html(process);
};

/**
 * 上传进度监控
 * @param up
 * @param file
 */
sinosoft.uploadfile.Init.prototype.processComplete = function(file){
	var processBar = $("#uploadFile_"+file.id).find("#processBar");
	var process = "100%";
    $(processBar).width(process);
    var processBarView = $("#uploadFile_"+file.id).find("#processBarView");
    $(processBarView).html(process);
};

/**
 * 禁止页面默认的拖拽
 */
sinosoft.uploadfile.Init.prototype.disableDocumentDrag = function(){
    //阻止浏览器默认行为
    document.addEventListener( "dragleave", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener( "drop", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener( "dragenter", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener( "dragover", function(e) {
        e.preventDefault();
    }, false);
};

/**
 *初始化拖拽区域
 * @constructor
 */
sinosoft.uploadfile.Init.prototype.initDrag = function(){
    var self = this;
    $("#"+self.objectId).css("position","relative");
    $("#"+self.objectId).append(self.staticOption.dragArea);
    var dragArea1 = $("#"+self.objectId).find("#dragAreaHide");
    var dragArea = $("#"+self.objectId);
    var box1 = dragArea?dragArea[0]:null;
    var box = dragArea1?dragArea1[0]:null;
    if(!box1)return;
    if(!box)return;
    var existLine = false;
    box1.addEventListener("dragenter", function(e) {
        if(!existLine){
        	existLine = true;
        	$("#"+self.objectId).addClass("bor");
        	$("#"+self.objectId).find("#dragAreaHide").show();
        }
    });
    box.addEventListener("dragleave",function(e){
    	if(existLine){
    		existLine = false;
    		$("#"+self.objectId).removeClass("bor");
    		$("#"+self.objectId).find("#dragAreaHide").hide();
    	}
    });
    box.addEventListener("drop", function (e) {
    	if(existLine){
    		existLine = false;
    		$("#"+self.objectId).find("#dragAreaHide").hide();
    		$("#"+self.objectId).removeClass("bor");
    	}
        e.stopPropagation();
        e.preventDefault();
        //plupload的实例对象
        var up = self.uploader;
        //获取文件对象
        var fileList = e.dataTransfer.files;
        //检测是否是拖拽文件到页面的操作
        if (fileList.length == 0) {
            return false;
        }
        
        for(var i = 0; i < fileList.length; i++){
            var reader = new FileReader();
            var file = fileList[i];
            reader.onload = function(e) {
                up.addFile(file);
            };
            
            reader.onerror = function(e){
                alert('目前只能上传文件');
            };
            reader.readAsDataURL(file);
        }
    }, false);
};

/**
 * 文件重命名
 * @param origName 源文件名
 */
sinosoft.uploadfile.Init.prototype.rename = function(origName){
	var self = this;
	var total = 0;
	var suffix = self.subStrSuffix(origName);
	var newName = self.subStrName(origName);
	$(self.fileList).each(function(index,obj){
		var fileName = self.subStrName(obj.name);
		if(fileName.indexOf(newName)!==-1){
			total ++;
		}
	});
	if(total>0){
		return newName + "("+total+")"+suffix;
	}else{
		return origName;
	}
};

/**
 * 截取文件名
 * @param fileName
 * @returns
 */
sinosoft.uploadfile.Init.prototype.subStrName = function(fileName){
	var endIndex = fileName.lastIndexOf(".");
	return fileName.substring(0,endIndex);
};

/**
 * 截取文件名
 * @param fileName
 * @returns
 */
sinosoft.uploadfile.Init.prototype.subStrSuffix = function(fileName){
	var endIndex = fileName.lastIndexOf(".");
	return fileName.substring(endIndex,fileName.length);
};

/**
 * 上传控件的工具方法
 */
sinosoft.uploadfile.Init.prototype.tool = {
		formatSize : function(size) {
			if (size === undefined || /\D/.test(size)) {
				return '0KB';
			}

			function round(num, precision) {
				return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
			}

			var boundary = Math.pow(1024, 4);

			// GB
			if (size > (boundary/=1024)) {
				return round(size / boundary, 1) + " " + 'gb';
			}

			// MB
			if (size > (boundary/=1024)) {
				return round(size / boundary, 1) + " " + 'mb';
			}

			// KB
			if (size > 1024) {
				return Math.round(size / 1024) + " " + 'kb';
			}

			return size + " " + 'b';
		}
};

/**
 * 构造附件控件的区域静态模板
 */
sinosoft.uploadfile.Init.prototype.staticOption = {
    head : '<div id="upload_head" class="plupload">'+
            '<div class="plupload_header">'+
            '<a class="grey plupload_select">'+
            '<span tabindex="500" title="请选择上传文件" class="btn btn-default fileinput-upload fileinput-upload-button"><i class="icon-cloud-upload "></i> <span >选择</span></span>'+
            '<form action="javascript:void(0);">'+
            '<input type="file" name="html5uploader" accept="*/*" multiple="true" id="@browseBtnId"'+
            '>'+
            '</form>'+
            '</a>'+
            '</div>'+
            '</div>',
    switchMeth : '<div style="float: right;">'+
            '<span class="fui-list-columned" style="color:red;"></span>'+
            '<span class="fui-list-large-thumbnails"></span>'+
            '</div>',
    dragArea : '<div id="dragAreaHide" style="position: absolute; display:none;top: 0%; left: 0%; width: 100%; height: 100%; background-color: black; z-index: 1001; opacity: 0.3;">'+
    			'<div style="position: relative; color: black; top: 40%; font-size: 30px; left: 35%;">此处为拖拽区域</div>'+
    			'</div>',
    headEnd:'<div style="clear: both;"></div>',
    listBody : '<div id="list_view_drag">'+
            '<div style="padding:20px 0px 0px 30px;height:50px;">'+
            '<div style="float: left;">全部文件</div>'+
            '<div style="float: right;">已全部加载，共<span id="file_total_id">0</span>个</div>'+
            '<div style="clear: both"></div>'+
            '</div>'+
            '<div class="list-header">'+
            '<div style="display:none;">'+
            '<span><input type="checkbox"/>已选中1个文件&nbsp;&nbsp;</span>'+
            '<span tabindex="500" title="下载选中文件" class="btn btn-default fileinput-upload fileinput-upload-button"><span >下载</span></span>'+
            '<span tabindex="500" title="删除选中文件" class="btn btn-default fileinput-upload fileinput-upload-button"><span >删除</span></span>'+
            '</div>'+
            '<ul style="padding:0;">'+
            '<li class="col" style="width: 30%;">@checkbox文件名</li>'+
            '<li class="col" style="width: 25%;">状态</li>'+
            '<li class="col" style="width: 10%;">大小</li>'+
            '<li class="col" style="width: 20%;">修改日期</li>'+
            '<li class="col" style="width: 15%;">操作</li>'+
            '</ul>'+
            '</div>'+
            '<div id="file_list"></div>',
    previewBody : '<div class=" file-drop-zone" style="display: none;">'+
            '<div class="file-preview-thumbnails">'+
            '<div class="file-preview-frame"  data-fileindex="0" title="oracle检查报告.docx">'+
            '<div class="file-preview-other-frame">'+
            '<div class="file-preview-other">'+
            '<span class="file-icon-4x"><i class="icomoon-file-excel"></i></span>'+
            '</div></div>'+
            '<div class="file-preview-other-footer">'+
            '<div class="file-thumbnail-footer">'+
            '<div class="file-footer-caption" title="oracle检查报告.docx">oracle检查报告.docx</div>'+
            '<div class="file-thumb-progress">'+
            '<div class="progress">'+
            '<div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:100%;">100%</div></div></div>'+
            '<div class="file-actions">'+
            '<div class="file-footer-buttons">'+
            '<button type="button" class="kv-file-upload btn btn-xs btn-default" title="上传文件">'+
            '</button>'+
            '<button type="button" class="kv-file-remove btn btn-xs btn-default" title="删除文件">'+
            '</div>'+
            '<div class="file-upload-indicator" title="没有上传"></div>'+
            '<div class="clearfix"></div>'+
            '</div></div></div></div></div></div>',
    fileItemTemp : '<div class="list-view-item" id="@filerow" style="line-height:40px;height:40px;overflow: hidden;">'+
            '<div class="fileicon default-small"><input type="hidden" name="fileId" value="@fileId"/></div>'+
            '<div style="width:30%;float:left;position:relative;">'+
            '<div style="float:left;width:8%;margin-left:20px;">@checkbox</div>'+
            '<div style="float:left;width:80%;">'+
            '<a class="filename" href="javascript:void(0);" title="@filename">@filename</a>'+
            '</div>'+
            '</div>'+
            '<div style="width:25%;float:left;line-height: 30px;padding-top: 5px;" class="file-size"><div class="progress progress-mini" style="float:left;width:60%;margin-left:5%;margin-top:10px;">'+
            '<div id="processBar" style="width: @progress%;" class="progress-bar progress-danger"></div>'+
            '</div><div id="processBarView" style="float:left;margin-left:1px;">@progress%</div></div>'+
            '<div style="width:10%;float:left;padding-left:1px;" class="file-size">@filesize</div>'+
            '<div style="width:20%;float:left;padding-left:1px;" class="ctime">@modifydate</div>'+
            '<div style="width:15%;float:left;">'+
            '<a style="position:relative;margin-left:10px;" id="downloadBtn" href="javascript:void(0);" class="blue">'+
            '<i class="icon-cloud-download bigger-130"></i></a>'+
            '<a style="position:relative;margin-left:10px;display:none;" id="removeBtn" href="javascript:void(0);" class="red">'+
            '<i class="icon-remove bigger-130"></i></a>'+
            '</div>'+
            '<div style="clear: both;"></div>'+
            '</div>',
     processBar : '<div id="processBar" class="progress progress-mini">'+
		     '<div style="width: 0%;" class="progress-bar progress-danger"></div>'+
		     '</div>'
};