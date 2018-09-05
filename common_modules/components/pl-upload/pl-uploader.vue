<script>
  import uuid from 'uuid';

  /**
   * 上传组件(plupload)
   * name: sinosoft_file_uploader
   * props:
   *  extensions        上传文件类型限制   默认无限制
   *  buttonId          上传按钮ID       默认使用组件内按钮
   *  isAutoUpload      是否自动上传      默认值: true
   *  action            上传请求地址      必填项
   *  multi_selection   是否支持多选文件上传  默认值:true
   *  maxSize           最大文件大小      默认值: 500mb
   *  multipart_params  post参数        默认无参数
   *  fileName          上传文件名       默认值: file
   *  headers           请求头参数       默认为{}
   *
   * events:
   *  success({up, file, result}, response)   上传成功
   *  error({up, err}, message)     上传失败
   *  beforeUpload({up, file}, file.percent)    上传前调用
   *
   * methods:
   *  start()             开始上传
   *  cleanAll            清空所有文件
   *  removeFile(file)    清除指定文件
   *  setOption(options)  设置参数
   *  setOption(options)  设置参数
   *
   * demo:
   *  <plupload ref="up" :multi_selection="pl.multi_selection" :multipart_params="pl.multipart_params" fileName="files" :isAutoUpload="pl.isAutoUpload" :buttonId="pl.buttonId" :action="pl.action" :extensions="pl.extensions" @error="plError" :maxSize="pl.maxSize"></plupload>
   *  data: {
   *    pl: {
   *      action: G.base_api + "/ap-system/uploadUserHead",
   *      buttonId: "aaa",
   *      isAutoUpload: true,
   *      multi_selection: false,
   *      multipart_params: {
   *        userIds: "123456"
   *      },
   *      maxSize: '10mb',
   *      extensions: [
   *        {title : "Image files", extensions: "jpg,gif,png,jpeg"},
   *        {title : "Zip files", extensions: "zip"}
   *      ]
   *    }
   *  }
   */
  export default {
    name: "sinosoft_file_uploader",
    props: {
      /*
       * 上传文件类型限制
       * [  //只允许上传图片和zip文件
       *    { title : "Image files", extensions : "jpg,gif,png" },
       *    { title : "Zip files", extensions : "zip" }
       * ],
       */
      extensions: {
        type: Array,
        default: []
      },
      /* 上传按钮ID */
      buttonId: {
        type: String,
        default: ""
      },
      /* 是否自动上传 */
      isAutoUpload: {
        type: Boolean,
        default: true
      },
      /* 上传请求地址 */
      action: {
        type: String,
        default: ""
      },
      /* 是否支持多选文件上传 */
      multi_selection: {
        type: Boolean,
        default: true
      },
      /* 最大文件大小 */
      maxSize: {
        type: String,
        default: '500mb'
      },
      /* post参数 */
      multipart_params: {
        type: Object,
        default: {}
      },
      /* 上传文件名 */
      fileName: {
        type: String,
        default: 'file'
      },
      /* 请求头参数 */
      headers: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        id: "sinosoft_uploader_",
        up: null,
        files: [],
        state: {
          STOPPED: plupload.STOPPED,                            //值为1，代表上传队列还未开始上传或者上传队列中的文件已经上传完毕时plupload实例的state属性值
          STARTED: plupload.STARTED,                            //值为2，代表队列中的文件正在上传时plupload实例的state属性值
          //文件队列状态码
          QUEUED: plupload.QUEUED,                              //值为1，代表某个文件已经被添加进队列等待上传时该文件对象的status属性值
          UPLOADING: plupload.UPLOADING,                        //值为2，代表某个文件正在上传时该文件对象的status属性值
          FAILED: plupload.FAILED,                              //值为4，代表某个文件上传失败后该文件对象的status属性值
          DONE: plupload.DONE,                                  //值为5，代表某个文件上传成功后该文件对象的status属性值
          // 错误状态码
          GENERIC_ERROR: plupload.GENERIC_ERROR,                //值为-100，发生通用错误时的错误代码
          HTTP_ERROR: plupload.HTTP_ERROR,                      //值为-200，发生http网络错误时的错误代码，例如服务气端返回的状态码不是200
          IO_ERROR: plupload.IO_ERROR,                          //值为-300，发生磁盘读写错误时的错误代码，例如本地上某个文件不可读
          SECURITY_ERROR: plupload.SECURITY_ERROR,              //值为-400，发生因为安全问题而产生的错误时的错误代码
          INIT_ERROR: plupload.INIT_ERROR,                      //值为-500，初始化时发生错误的错误代码
          FILE_SIZE_ERROR: plupload.FILE_SIZE_ERROR,            //值为-600，当选择的文件太大时的错误代码
          FILE_EXTENSION_ERROR: plupload.FILE_EXTENSION_ERROR,  //值为-601，当选择的文件类型不符合要求时的错误代码
          FILE_DUPLICATE_ERROR: plupload.FILE_DUPLICATE_ERROR,  //值为-602，当选取了重复的文件而配置中又不允许有重复文件时的错误代码
          IMAGE_FORMAT_ERROR: plupload.IMAGE_FORMAT_ERROR,      //值为-700，发生图片格式错误时的错误代码
          IMAGE_MEMORY_ERROR: plupload.IMAGE_MEMORY_ERROR,      //当发生内存错误时的错误代码
          IMAGE_DIMENSIONS_ERROR: plupload.IMAGE_DIMENSIONS_ERROR //值为-702，当文件大小超过了plupload所能处理的最大值时的错误代码
        }
      }
    },
    created() {
      this.id += uuid.v1();
    },
    mounted() {
      this.createdUploader();
    },
    methods: {
      /**
       *  判断token,设置headers
       */
      setHeader(){
        var self=this;
        const token = G.token || null;
        if (token) {
          self.headers["authorization"] = token;
        }
      },
      /**
       * 初始化上传组件
       */
      createdUploader() {
        var self = this;
        if (!G.autonomously) {
          self.setHeader();
        }
        var setting = {
          browse_button: self.buttonId || self.id + '_button',
          url: self.action,  //上传API地址
          filters: {
            mime_types: self.extensions,
            max_file_size: self.maxSize,
            prevent_duplicates: true
          },
          headers: self.headers,
          multipart: true,
          multipart_params: self.multipart_params,
          max_retries: 0,
          chunk_size: 0,
          multi_selection: self.multi_selection,            //是否支持批量选择文件
          file_data_name: self.fileName,                    //文件参数名字
          flash_swf_url: '/dist/vendor/plupload/js/Moxie.swf',       //flash地址
          silverlight_xap_url: '/dist/vendor/plupload/js/Moxie.xap',
          init: {
            // 添加文件
            FilesAdded: function (up, files) {
              var hasError = false;

              for (var fileItem of files) {
                if (!fileItem.size) {
                  hasError = true;
                  self.Error(up, fileItem, 'File null error.');
                  break;
                }
              }

              if (!hasError) {
                if (files && files.length > 0) {
                  self.files = _.union(self.files, files);
                  if (self.isAutoUpload) {
                    self.start();
                  } else {
                    for (var file of files) {
                      self.previewImage(file, function (file, imgSrc) {
                        self.$emit('addPreview',file , imgSrc);
                      });
                    }
                  }
                }
              } else {
                up.splice(0);
              }
            },
            // 上传前调用
            BeforeUpload: function (up, file) {
              self.$emit("beforeUpload", file);
            },
            // 上传完成时调用(成功)
            FileUploaded: function (up, file, result) {
              self.$emit("success", {up, file, result}, result.response);
            },
            // 上传进度
            UploadProgress: function (up, file) {
              self.$emit("progress", {up, file}, file.percent);
            },
            // 上传结束时调用(失败)
            Error: self.Error
          }
        };

        self.up = new plupload.Uploader(setting);
        self.up.init();
      },
      // 上传结束时调用(失败)
      Error(up, err) {
        var self = this;
        var message = "";

        if (err) {
          if (err.code === -601) {
            message = "上传文件只支持: " + _.pluck(self.extensions, 'extensions').join(',') + ", 请检查上传文件。";
          } else if (err.code === -600) {
            message = "上传文件最大支持" + self.maxSize;
          } else if (err.code === -602) {
            message = "无法重复上传";
          } else {
            message = "上传失败";
          }
        }
        self.$emit("error", {up, err}, message);
      },
      /**
       * 开始上传(当isAutoUpload等于false时使用)
       */
      start() {
        if (this.up) {
          this.up.start();
        }
      },
      /**
       * 清空所有文件
       */
      cleanAll() {
        var self = this;

        _.each(self.files, function (file) {
          self.removeFile(file);
        });
      },
      /**
       * 删除指定文件
       */
      removeFile(file) {
        if (file) {
          this.up.removeFile(file);
          this.files = _.filter(this.files, function (item) {
            return !(item.id === file.id);
          });
        }
      },
      /**
       * 设置参数
       */
      setOption(params) {
        this.up.setOption(params);
      },
      /**
       * 计算大小
       */
      calculateSize(size) {
        //保留两位小数
        //功能：将浮点数四舍五入，取小数点后2位
        function toDecimal(x) {
          var f = parseFloat(x);
          if (isNaN(f)) {
            return;
          }
          f = Math.round(x * 100) / 100;
          return f;
        }

        var str = "";
        if (size < 1024) {
          str = size + 'B';
        } else if (size < (1024 * 1024)) {
          str = toDecimal(size / 1024) + 'KB';
        } else if (size < (1024 * 1024 * 1024)) {
          str = toDecimal(size / (1024 * 1024)) + 'MB';
        } else if (size < (1024 * 1024 * 1024 * 1024)) {
          str = toDecimal(size / (1024 * 1024 * 1024)) + 'GB';
        }
        return str;
      },

      /**
       * plupload中为我们提供了mOxie对象
       * 有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
       * 如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
       * file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
       */
      previewImage(file, callback) {
        //确保文件是图片
        if (!file || !/image\//.test(file.type)) return;
        //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        if (file.type == 'image/gif') {
          var fr = new mOxie.FileReader();
          fr.onload = function () {
            callback(fr.result);
            fr.destroy();
            fr = null;
          };
          fr.readAsDataURL(file.getSource());
        } else {
          var preloader = new mOxie.Image();
          preloader.onload = function () {
            //preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            //callback传入的参数为预览图片的url
            callback && callback(file, imgsrc);
            preloader.destroy();
            preloader = null;
          };
          preloader.load(file.getSource());
        }
      }
    }
  }
</script>
<style scoped lang="less" src="./pl-uploader.less"></style>

<template>
  <div class="sinosoft_uploader" :id="id" v-if="!buttonId">
    <div :id="id + '_button'" class="btn btn-primary btn-ms">上传附件</div>
    <ul>
      <li v-for="item in files">
        <div class="pl_content">
          <div class="name">{{item.name}}</div>
          <div class="size">{{calculateSize(item.origSize)}}</div>
          <div class="opt">
            <i class="icon iconfont remove" @click="removeFile(item)">&#xe43;</i>
          </div>
        </div>
        <div class="pl_progress" v-if="item.status !== 1">
          <el-progress :percentage="item.percent"
                       :status="item.status === 5 ? 'success': item.status === 4 ? 'error' : ''"></el-progress>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
</style>
