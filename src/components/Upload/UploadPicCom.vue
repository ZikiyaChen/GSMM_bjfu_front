<template>
  <div class="demo-upload-list" v-for="(item,index) in PicUrlList" :key="index">
    <img :src="'data:image/jpg;base64,'+item"  />
    <div class="demo-upload-list-cover">
      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
      <Icon type="ios-trash-outline" @click.native="handleRemoveList(index)"></Icon>
    </div>
  </div>
  <Upload
    :show-upload-list="false"
    name="filename"
    :on-exceeded-size="handleMaxSize"
    :on-success="handleSuccessList"
    :format="['jpg','jpeg','png']"
    :max-size="2048"
    multiple
    type="drag"
    :action="UploadPicAPI"
    class="pic-upload-list">
    <div class="camera-style">
      <Icon type="ios-camera" size="20"></Icon>
    </div>
  </Upload>
  <Modal title="图片预览" v-model="visible">
    <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible" style="width: 100%" />
  </Modal>
</template>

<script>
import {ShowPic, UploadPicApi} from "@/api/upload";

export default {
  name: "UploadPicCom",
  props: {
    PicUrlList: {
      type: Array,
      default: () => []
    },
    PicPath: {
      type: Array,
      default: () => []
    },
    i: {
      type: Number,
      default: 0
    }
  },
  data(){
     return{
       UploadPicAPI: UploadPicApi,
       showImageUrl: '',
       visible: false,
     }
  },
  methods: {
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    // 保护范围示意图
    handleView (imageUrl) {
      this.showImageUrl = imageUrl
      this.visible = true
    },
    handleRemoveList (index) {
      // 删除
      this.PicPath.splice(index, 1)
      this.PicUrlList.splice(index, 1)
    },
    handleSuccessList: function (res, file) {
      if (res.code === 500) {
        this.environment.protect_pic.push(res.path)
        this.i++
        ShowPic(res.path).then(resp => {
          this.PicUrlList.push(resp.data)
        })
      }
    },
  }
}
</script>

<style scoped>
/*控制上传图片框大小*/
.camera-style {
  width: 100px;
  height:100px;
  line-height: 100px;
}
.pic-upload-list {
  display: inline-block;
  width:100px;
}
.demo-upload-list {
  display: inline-block;width: 100px;height: 100px;text-align: center;line-height: 100px;
  border: 1px solid transparent;border-radius: 4px;overflow: hidden;background: #fff;
  position: relative;box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;height: 100%;
}
.demo-upload-list-cover {
  display: none;position: absolute;top: 0;bottom: 0;
  left: 0;right: 0;background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;font-size: 20px;cursor: pointer;margin: 0 2px;
}

</style>
