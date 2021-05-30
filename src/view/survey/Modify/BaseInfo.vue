<template>
  <div >
    <keep-alive>
    <Card>
      <h2 slot="title" style="text-align: center">名木古树基本信息---修改</h2>
      <Form :label-width="120" label-position="right" ref="Tree_form" v-model="TreeInformation" inline>
        <h4>基本信息：</h4>
        <Row>
          <Col span="9" offset="1">
            <FormItem label="古树编号" prop="Basic.tree_code">
              <Input v-model="TreeInformation.Basic.tree_code" placeholder="请输入古树编号" style="width: 200px"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="文化历史照片" prop="Dong.history_pic">
              <div class="demo-upload-list" v-for="(item,index) in historyPicUrlList" :key="index">
                <img :src="'data:image/jpg;base64,'+item"  />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView_history(item)"></Icon>
                </div>
                <Modal title="图片预览" v-model="visible_h">
                  <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_h" style="width: 100%" />
                </Modal>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Button @click="NowTree_code">tree_code</Button>
      </Form>
    </Card>
    </keep-alive>
  </div>
</template>

<script>
import { getOneTreeBaseInfo } from "@/api/table";
import {ShowPic} from "@/api/upload";
import {forEach} from "@/libs/tools";

export default {
  name: "BaseInfo",
  data :function () {
    return {
      tree_code: parseInt(this.$route.params.tree_code),
      TreeInformation: {
        Basic: {
          tree_code: 0,
        },
        Dong: {
          history_pic: []
        }
      },
      historyPicUrlList: [],
      visible_h: false,
      showImageUrl: ''

    }
  },
  methods : {
    //文化历史照片
    handleView_history (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_h = true
    },
    NowTree_code() {
      console.error(this.tree_code)
    },
    fetchData(){
      getOneTreeBaseInfo(this.tree_code).then((res => {
        console.error(this.tree_code)
        this.historyPicUrlList= []
        console.log('one_tree',res.data)
        this.TreeInformation.Basic = res.data.tree_basic_info.basic
        this.TreeInformation.Dong.history_pic = res.data.tree_basic_info.dynamic.history_pic
        console.log('NN',this.TreeInformation.Dong.history_pic)
        this.TreeInformation.Dong.history_pic.forEach((pic_name)=>{
          console.log('pic_name',pic_name)
          if(pic_name!== ''){
            ShowPic(pic_name).then((resp=>{
              console.log('pic',resp)
              this.historyPicUrlList.push(resp.data)
            }))}
        })
        console.log('final_pic',this.historyPicUrlList)
      }))
    }
  },
  // created() {
  //   this.fetchData()
  // },
  mounted:function (){
    getOneTreeBaseInfo(this.tree_code).then((res => {
      console.error(this.tree_code)
      console.log('one_tree',res.data)
      this.TreeInformation.Basic = res.data.tree_basic_info.basic
      this.TreeInformation.Dong.history_pic = res.data.tree_basic_info.dynamic.history_pic
      console.log('NN',this.TreeInformation.Dong.history_pic)
      this.TreeInformation.Dong.history_pic.forEach((pic_name)=>{
        console.log('pic_name',pic_name)
        if(pic_name!== ''){
          ShowPic(pic_name).then((resp=>{
            console.log('pic',resp)
            this.historyPicUrlList.push(resp.data)
          }))}
      })
      console.log('final_pic',this.historyPicUrlList)
    }))
  },

  // watch: {
  //   '$route' (to, from) {
  //     this.$router.go(0)
  //
  //   }
  //
  // },
}
</script>

<style scoped>
.demo-upload-list {
  display: inline-block;width: 70px;height: 70px;text-align: center;line-height: 70px;
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
