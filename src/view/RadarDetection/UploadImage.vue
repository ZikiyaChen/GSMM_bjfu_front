<!--<template>-->
<!--  <div v-model="imgList">-->
<!--      <div class="demo-upload-list" v-for="(item,index) in imgList" :key="index">-->
<!--        <img :src="imgBaseUrl + item" />-->
<!--        <div class="demo-upload-list-cover">-->
<!--          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>-->
<!--          <Icon type="ios-trash-outline" @click.native="handleRemove(index,item)"></Icon>-->
<!--        </div>-->
<!--      </div>-->

<!--      <Upload-->
<!--        :show-upload-list="false"-->
<!--        v-if="!readonly"-->
<!--        name="filename"-->
<!--        :data="uploadData"-->
<!--        :on-progress="handleProgress"-->
<!--        :on-success="handleSuccess"-->
<!--        :before-upload="handleBeforeUpload"-->
<!--        :format="['jpg','jpeg','png']"-->
<!--        :max-size="4096"-->
<!--        multiple-->
<!--        paste-->
<!--        type="drag"-->
<!--        :action="UploadImgAPI"-->
<!--        class="pic-upload-list">-->
<!--        <div class="camera-style">-->
<!--          <Icon type="ios-camera" size="20"></Icon>-->
<!--        </div>-->
<!--      </Upload>-->
<!--      <Modal title="图片预览" v-model="visible">-->
<!--        <img :src="showImageUrl" v-if="visible" style="width: 100%" />-->
<!--      </Modal>-->

<!--  </div>-->
<!--</template>-->

<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in PicUrlList" :key="index">
      <el-image  :src="item" :preview-src-list="PicUrlList" style="width: 100%; height: 100%"/>
      <div class="delete-icon-box" @click="handleRemove(index)" v-if="!readonly">
        <Icon type="md-close" class="delete-icon" color="white" size="20"></Icon>
      </div>
    </div>
    <div v-if="readonly&&PicUrlList.length===0" class="no-pic">
      <div class="no-pic-style">
        <Icon type="ios-image"  size="40" ></Icon>
      </div>
    </div>
<!--      <div class="demo-upload-list-cover">-->
<!--        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>-->
<!--        <Icon type="ios-trash-outline" @click.native="handleRemove(index,item)"></Icon>-->
<!--      </div>-->
    <Upload
      :show-upload-list="false"
      v-if="!readonly"
      name="filename"
      :data="uploadData"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :format="['jpg','jpeg','png']"
      :max-size="4096"
      multiple
      paste
      type="drag"
      :action="UploadImgAPI"
      class="pic-upload-list">
      <div class="camera-style">
        <Icon type="ios-add" size="45"></Icon>
      </div>
    </Upload>

    </div>
</template>

<script>



import {UploadImg} from "@/api/upload";

export default {
  name: 'UploadImage',
  props:{
    readonly:{
      type: Boolean,
      default: false,
    },
    imgNameList:{
      type: Array,
      default: ()=>[]
    },
    imgUrlList:{
      type:Array,
      default: ()=>[]
    },

    maxCount:{
      type: Number,
      default: 10
    },
    url1:{
      type: String,
      default: '/'
    },
    imgBaseUrl: {
      type: String,
      default: ''
    },
    treeCode:{
      type: String,
      default: 'A'
    },
    typeImg:{
      type: String,
      default: 'static'
    }


  },
  computed:{
    uploadData(){
      return{
        url_path1: this.url1,
        tree_code: this.treeCode,
        type_img: this.typeImg
      }
    }
  },
  data() {
    return {
      visible: false,
      showImageUrl: '',
      UploadImgAPI: UploadImg,
      imgList: [],
      imgList11:['http://49.232.244.63:5005/trunk_img/11CSDS_1690739653742965061.jpg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
         'http://49.232.244.63:5005/trunk_img/11CSDS_1690739653742965061.jpg'],

      PicUrlList:[],
      PicNameList:[],
    };
  },
  methods: {
    handleProgress(event,file,fileList){
      console.log('--progress--:',event,file,fileList)
    },
    //
    handleBeforeUpload(){
      console.log('--before_upload--', this.imgList.length)
    },
    // handleView(item){
    //   this.showImageUrl = this.imgBaseUrl + item
    //   this.visible = true
    // },
    // beforeUpload(file){
    //   console.log('before_upload,file:',file)
    // },
    handleRemove(index,item) {
      console.log('remove--index--,item:',index,'xx',item);
      this.PicUrlList.splice(index,1)
      this.PicNameList.splice(index,1)
      this.$emit('delete',this.PicNameList,this.PicUrlList)
    },

    handleSuccess(res,file,fileList){
      if(res.code === 500){
        this.PicNameList.push(res.img_name)
        this.PicUrlList.push(res.img_url)
      }
      this.$emit('onUpload', this.PicNameList,this.PicUrlList)
    },



  },
  watch:{
    imgUrlList:{
      handler(n,o){
        console.log('imgUrl',n,o)
        this.PicUrlList = n
      },
      immediate: true,
    },
    imgNameList:{
      handler(n,o){
        console.log('imgName',n,o)
        this.PicNameList = n
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
  border: 1px solid transparent;border-radius: 4px;overflow: hidden;background: #fff;
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
  width: 20px;
  height: 20px;
  /*background-color: rgba(0,0,0,.7);*/
  background-color: rgba(255,69,0,.9);
  border-radius: 0 0 0 20px
}
.delete-icon {
  position: absolute;
  display: block;
  top: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
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
