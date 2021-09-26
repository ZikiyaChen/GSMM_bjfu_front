<template>
  <div  style="width: 500px;height: 370px">
    <div style="font-family: Microsoft YaHei; font-size: 17px; line-height: 25px">
      <h3 style="text-align: center;margin-bottom: 15px" >古树信息简介</h3>

      <Row type="flex" align="top">
        <Col span="11" >
          <p>古树编号：{{this.treeInfo.tree_code}}</p>
          <p>中文名：{{this.treeInfo.zw_name}}</p>
          <p>拉丁名：{{this.treeInfo.ld_name}}</p>
          <p>科：{{this.treeInfo.family}}</p>
          <p>属：{{this.treeInfo.genus}}</p>
          <p>古树等级：{{this.treeInfo.level}}</p>
          <p>树龄：{{this.treeInfo.dynamic_property.real_age}}年</p>
          <p>经度：{{this.treeInfo.geo_property.longitude}}</p>
          <p>纬度：{{this.treeInfo.geo_property.latitude}}</p>
          <p>地址：{{this.treeInfo.place_name}}</p>
          <p>管护单位：{{this.treeInfo.gh_unit}}</p>
        </Col>
        <Col span="12" >
<!--          <img src="#" style="height: 90px;width: 80px"/>-->
          <img :src="'data:image/jpg;base64,'+ pic"   style="width: 250px"/>
        </Col>
      </Row>
      <div style="text-align: center">
      <router-link :to="{name: 'BaseInfo', params: {tree_code: this.treeInfo.tree_code}}">
        <Button type="primary">查看详情</Button>
      </router-link>
        <Button type="primary"  style="margin-left: 20px" @click="showTreeYhHistory = true">养护历史</Button>

      </div>
      <TreeYhHistory
        :show="showTreeYhHistory"
        :tree_code="this.treeInfo.tree_code"
        @onOK="onShowTreeYhHistoryModalOK"
        @onCancel="onShowTreeYhHistoryModalCancel">
      </TreeYhHistory>

<!--      <Button type="primary" @click="showTree">树</Button>-->
    </div>

    </div>

</template>

<script>
import {ShowPic} from "@/api/upload";
import TreeYhHistory from "@/view/YangHuManage/YhManage/componnets/TreeYhHistory";

export default {
name: "InfoWindow",
  props: {
    treeInfo: {
      type: Object,
      default: {}
    },
  },
  components:{TreeYhHistory},
    data () {
      return {
        showTreeYhHistory: false,
        pic: '',
        overlay: null,
        infoWindow: null,
      }
    },
  mounted() {
  // this.getPic()
  },
  methods: {
      initialize (e) {
        this.overlay = e.overlay;
        this.infoWindow = e.infoWindow;
      },
    onShowTreeYhHistoryModalOK(){
        this.showTreeYhHistory =false
    },
    onShowTreeYhHistoryModalCancel(){
        this.showTreeYhHistory =false
    },
      getPic(path){
        console.log('000',path)
        ShowPic(path).then(res=>{
          this.pic = res.data
        })

      },

      showTree(){
        console.log('tree',this.treeInfo)
      }
    },
  watch:{
     treeInfo:{
       handler:function (newv, old) {
         console.log('222222',newv, old)
         if(newv!==old){
           let path = newv.pic_record['path']
           if(path.length!==0){
             this.getPic(path[0])
           }

         }
       }
     }
  }

}
</script>


<style scoped>

</style>
