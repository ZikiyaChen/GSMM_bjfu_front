<template>
  <div>

    <div class="demo-upload-list"  v-for="(item,index) in PicNameList"  :key="index">
<!--      <img  :src="getPicAPI+item">-->
      <el-image  :src="getPicAPI+item" :preview-src-list="PicUrlList" style="width: 100%; height: 100%"/>
<!--      <div class="demo-upload-list-cover">-->
<!--        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>-->
<!--        <Icon type="ios-trash-outline" @click.native="handleRemove(index)" v-if="!readonly"></Icon>-->
<!--      </div>-->
      <div class="delete-icon-box" @click="handleRemove(index)" v-if="!readonly">
        <Icon type="md-close" class="delete-icon" color="white" size="13"></Icon>
      </div>
    </div>

    <div v-if="readonly&&PicNameList.length===0" class="no-pic">
      <div class="no-pic-style">
        <Icon type="ios-image"  size="40" ></Icon>
      </div>
    </div>
    <Upload
      :show-upload-list="false"
      v-if="!readonly"
      name="filename"
      :on-success="handleSuccess"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :format="['jpg','jpeg','png']"
      :max-size="4096"
      multiple
      paste
      type="drag"
      :action="UploadImgAPI"
      class="pic-upload-list">
      <div class="camera-style">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
<!--    <Modal title="图片预览" v-model="visible">-->
<!--      <img :src="getPicAPI+showImageUrl" v-if="visible" style="width: 100%" />-->
<!--    </Modal>-->

  </div>
</template>

<script>


import {getPicApi, UploadPicApi} from "@/api/upload";
import * as imageConversion from "image-conversion";

export default {
  name: 'UploadPicCom',
  props:{
    readonly:{
      type: Boolean,
      default: false,
    },
    imgNameList:{
      type: Array,
      default: ()=>[]
    },

    maxCount:{
      type: Number,
      default: 10
    },


  },
  computed:{

  },
  data() {
    return {
      UploadImgAPI: UploadPicApi,
      getPicAPI: getPicApi,
      PicNameList:[],
      // showImageUrl: '',
      // visible: false,
      PicUrlList:[],
    };
  },
  methods: {
    handleView(item){
      this.showImageUrl = item
      this.visible = true
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 4M.'
      })
    },
    //图片上传前压缩
    handleBeforeUpload(file){
      console.log('before',file)
      return new Promise((resolve, reject)=>{
        if(  file.size > 1024*1024 && file.size < 2*1024*1024){
          // 当图片为1M~2M时,压缩到450KB
          // 450为压缩后的大小  450kb左右，等比例压缩， 还有一种按图片质量压缩效果很差
          imageConversion.compressAccurately(file, 500).then(res=>{
            res = new File([res],file.name, {type:res.type, lastModified:Date.now()})
            console.log('after ', res)
            resolve(res)
          })
        }else if(file.size >= 2*1024*1024){
          // 当图片大于2M时,压缩到600KB
          imageConversion.compressAccurately(file, 700).then(res=> {
            res = new File([res], file.name, {type: res.type, lastModified: Date.now()})
            console.log('after ', res)
            resolve(res)
          })
        }else {
          resolve(file)
        }
      })
    },

    handleRemove(index,item) {
      this.PicNameList.splice(index,1)
      this.$emit('delete',this.PicNameList)
    },

    handleSuccess(res,file,fileList){
      if(res.code === 500){
        this.PicNameList.push(res.path)
      }
      this.$emit('onUpload', this.PicNameList)
    },

  },
  watch:{
    imgNameList:{
      handler(n,o){
        console.log('imgName',n,o)
        this.PicNameList = n
        this.PicUrlList = n.map(item=> this.getPicAPI+item)
      },
      immediate: true,
    }
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
  /*border: 1px solid transparent;*/
  border-radius: 4px;overflow: hidden;background: #fff;
  position: relative;box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);margin-right: 13px;
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
/*图片的右上角删除的小图标的样式*/
.delete-icon-box{
  position: absolute;
  top: 0;
  right: 0;
  width: 18px;
  height: 18px;
  /*background-color: rgba(0,0,0,.7);*/
  background-color: rgba(255,69,0,.9);
  border-radius: 0 0 0 18px
}
.delete-icon {
  position: absolute;
  display: block;
  top: 1px;
  right: -2px;
  width: 18px;
  height: 18px;
  /*font-size: 0.42667rem;*/
}
.no-pic {
  display: inline-block;
  width:50px;
}
.no-pic-style {
  width: 50px;
  height:50px;
  /*line-height: 70px;*/
}
</style>
