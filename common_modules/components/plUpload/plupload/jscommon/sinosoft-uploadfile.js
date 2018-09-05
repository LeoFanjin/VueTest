/**
 * Created by Administrator on 2016/8/30 0030.
 */
var sinosoft = function () {
};
sinosoft.uploadfile = {};

sinosoft.uploadfile.Init = function (param) {
  var self = this;
  self.fileList = new Array();
  self.options = $.extend({}, self.options, param);

  self.objectId = self.options.objectId;
  self.batchId = self.options.batchId ? self.options.batchId : new Date().getMilliseconds();
  var guid = new Date().getTime();
  self.browse_button_id = self.options.objectId + "_" + guid;

  //初始化附件
  var setting = self.getParams();

  self.uploader = new plupload.Uploader(setting);
  self.uploader.init();
  return self.uploader;
};

sinosoft.uploadfile.Init.prototype.objectId = null;
sinosoft.uploadfile.Init.prototype.uploader = null;
sinosoft.uploadfile.Init.prototype.batchId = null;
sinosoft.uploadfile.Init.prototype.browse_button_id = null;
sinosoft.uploadfile.Init.prototype.fileList = new Array();
/**
 * 构建附件初始化参数
 */
sinosoft.uploadfile.Init.prototype.getParams = function () {
  var self = this;
  var param = {
    runtimes: 'html5,flash,html4,silverlight',
    browse_button: self.options.buttonId,
    url: self.options.url,
    // url : base + "fileUploadController/plFile",
    file_data_name: 'file',
    rename: true,
    filters: {
      max_file_size: self.options.maxSize
    },
    multi_selection: true,//是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以。默认true，即可以选择多个文件。需要注意的是，在某些不支持多选文件的环境中，默认值是false。比如在ios7的safari浏览器中，由于存在bug，造成不能多选文件。当然，在html4上传方式中，也是无法多选文件的。
    chunk_size: '10mb', //分片上传文件时，每片文件被切割成的大小
    init: {
      FilesAdded: function (up, file) {
        if (file && file.length > 0) {
          if (self.options.extensions) {
            var extensionArray = self.options.extensions.split(",");
            if (extensionArray.indexOf(file[0].type) !== -1) {
              if (self.options.isAutoUpload)self.uploader.start();
            } else {
              if (self.options.onError)self.options.onError(up, "文件格式不正确,只能上传 " + JSON.stringify(extensionArray) + " 格式的文件");
              up.removeFile(file[0]);
            }
          }
        }
      },
      BeforeUpload: function (up, file) {
        //判断服务器是否已经存在该文件，如果存在直接返回，不需要继续往后台上传文件
        if (self.batchId) {
          self.uploader.setOption({"multipart_params": {'batchId': self.batchId, "tmpFileId": file.id}});
          // self.uploader.setOption({"headers":{"key":""}});
        }
        if (self.options.beforeUpload)self.options.beforeUpload();
      },
      FileUploaded: function (up, file, result) {
        self.fileList.push(file);

        if (self.options.onComplete)self.options.onComplete(up, file, result);
      },
      //上传进度
      UploadProgress: function (up, file) {
        if (self.options.onProgress) self.options.onProgress(up, file, file.percent);
      },
      Error: function (up, err) {
        if (self.options.onError)self.options.onError(up, err);
      }
    }
  };
  return param;
};

/**
 * 获取附件的批量Id
 */
sinosoft.uploadfile.Init.prototype.getBatchId = function () {
  var self = this;
  return self.batchId;
};
/**
 * 设置BatchId
 */
sinosoft.uploadfile.Init.prototype.setBatchId = function (batchId) {
  var self = this;
  self.batchId = batchId;
};

/**
 * 获取所有的附件信息
 */
sinosoft.uploadfile.Init.prototype.getFiles = function () {
  var self = this;
  return self.fileList;
};


/**
 * @type {{}}
 */
sinosoft.uploadfile.Init.prototype.options = {
  objectId: null,//附件控件ID
  maxSize: '500mb',
  batchId: null,//批量ID,默认为空，如填写了批量ID，则加载批量ID对应的文件列表
  editType: "edit",//编辑模式，'eidt':编辑状态，'view':浏览状态
  isDrag: true,//是否开启拖拽功能
  isAutoUpload: false,//是否自动上传
  filters: null,//文件过滤
  viewType: "list",//文件上传风格，list:经典表格模式，preview:文件预览风格，both:两者皆开启，通过切换按钮
  onComplete: null, //文件上传完成事件处理
  onError: null //文件上传失败事件处理
};

/**
 * 文件重命名
 * @param origName 源文件名
 */
sinosoft.uploadfile.Init.prototype.rename = function (origName) {
  var self = this;
  var total = 0;
  var suffix = self.subStrSuffix(origName);
  var newName = self.subStrName(origName);
  $(self.fileList).each(function (index, obj) {
    var fileName = self.subStrName(obj.name);
    if (fileName.indexOf(newName) !== -1) {
      total++;
    }
  });
  if (total > 0) {
    return newName + "(" + total + ")" + suffix;
  } else {
    return origName;
  }
};

/**
 * 截取文件名
 * @param fileName
 * @returns
 */
sinosoft.uploadfile.Init.prototype.subStrName = function (fileName) {
  var endIndex = fileName.lastIndexOf(".");
  return fileName.substring(0, endIndex);
};

/**
 * 截取文件名
 * @param fileName
 * @returns
 */
sinosoft.uploadfile.Init.prototype.subStrSuffix = function (fileName) {
  var endIndex = fileName.lastIndexOf(".");
  return fileName.substring(endIndex, fileName.length);
};
