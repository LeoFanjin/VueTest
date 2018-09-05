<script>
  import uuid from 'uuid';

  export default {
    name: "sinosoft_file_uploader",
    props: {
      /* 按钮ID */
      buttonId: {
        type: String,
        default: ""
      },
      screenBatchId: {
        type: String,
        default: ""
      },
      // http://192.168.1.127:4080//fileUploadController/allFiles
      /* 上传请求地址 */
      action: {
        type: String,
        default: ""
      },
      /*允许的拓展名
       extensions不能有空格
       [
       {title: 'Video files', extensions: 'mp4,avi,wma,rmvb,mkv,flv'},
       {title: 'Audio files', extensions: 'mp3,wma,wav'},
       {title: 'Image files', extensions: 'jpg,jpeg,png,bmp'},
       {title: 'Application files', extensions: 'doc,docx,pdf,txt,xlsx,xls,ppt,pptx'}
       ]*/
      extensions: {
        type: Array,
        default: []
      },
      multi_selection: {
        type: Boolean,
        default: true
      },
      isDrag: {
        type: Boolean,
        default: false
      },
      isAutoUpload: {
        type: Boolean,
        default: true
      },
      viewType: {
        type: Boolean,
        default: false
      },
      maxSize: {
        type: String,
        default: '500mb'
      },
      multipart_params: {
        type: Object,
        default: {}
      },
      resize: {
        type: Object,
        default: {}
      },
      fileName: {
        type: String,
        default: 'files'
      }
    },
    data() {
      return {
        id: "sinosoft_uploader_",
        uploader: null
      }
    },
    created() {
      this.id += uuid.v1();
    },
    mounted() {
      this.createdUploader();
    },
    watch: {
      "screenBatchId": "setBatchId"
    },
    methods: {
      createdUploader() {
        var self = this;

        var setting = {
          objectId: self.id,
          buttonId: self.buttonId,
          isDrag: self.isDrag,
          multi_selection: self.multi_selection,
          viewType: "list",
          chunk_size: "10mb",
          extensions: self.extensions,
          isAutoUpload: self.isAutoUpload,
          multipart_params: self.multipart_params,
          maxSize: self.maxSize,
          resize: self.resize,
          file_data_name: self.fileName,
          url: self.action,
          onError(up, error) {
            self.$message.error(typeof error === "string" ? error : "上传失败");
            self.$emit("error", error);
          },
          beforeUpload() {                            //某个文件上传前
            self.$emit("beforeUpload");
          },
          onUploadFile(up, file) {                    //当某个文件开始上传时候
            self.$emit('startUpload', {up, file});
          },
          onProgress(up, file, percent) {             //当某个文件正在上传
            self.$emit("progress", percent);
          },
          onFileUploaded(up, file, info) {            //当某个文件上传成功
            self.$emit("success", {up, file, info}, info.response);
          },
          onUploadComplete: function (up, files) {    //当所有的文件上传成功
            self.$emit('complete', {up, files});
          },
          onFilePreview(up, files, file, imgSrc) {
            self.$emit('preview', file, imgSrc);
          }
        };

        self.uploader = new sinosoft.uploadfile.Init(setting);
      },
      //设置batchId
      setBatchId (){
        this.uploader.setBatchId(this.screenBatchId);
      },
      /**
       * 开始上传(当isAutoUpload等于false时使用)
       */
      startUpload() {
        this.uploader.start();
      },
      /**
       * 设置参数
       */
      setOption(params) {
        this.uploader.setOption(params);
      }
    }
  }
</script>

<template>
  <div :id="id">
  </div>
</template>

<style>
</style>
