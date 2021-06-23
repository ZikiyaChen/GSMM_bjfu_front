<template>
  <div style="position: absolute; width: 100%; height: 100%">
    <el-amap vid="amapDemo" :center="center" :zoom="zoom"
             expand-zoom-range="true"
             class="amap-demo" ref="map">

      <el-amap-polygon
        strokeColor="#4ea8f8"
        strokeOpacity="0.8"
        fillColor="#c9ebf7"
        fillOpacity="0.5"
        v-for="(polygon, index) in polygons"
        :key="index"
        strokeWeight="1"
        :path="polygon.Ce.path">
      </el-amap-polygon>

      <el-amap-marker
        v-for="marker in tree_markers"
        :position="marker.position"
        :key="marker.id"
        :events="marker.events"
        :icon="marker.icon">
      </el-amap-marker>
      <el-amap-info-window
        v-if="tree_window"
        :position="tree_window.position"
        :visible="tree_window.visible"
        :isCustom="true"
        :content="tree_window.content"
        :offset="tree_window.offset"
        :autoMove="true"
        :closeWhenClickMap="true"
      ></el-amap-info-window>

    </el-amap>

    <Form class="select" inline :model="query">
      <FormItem label="古树等级:" :label-width="80" style="background-color: white">
        <Select style="width:100px" v-model="query.level" clearable>
          <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <Button type="primary" @click="onSearch">查询</Button>

    </Form>

  </div>
</template>

<script>
import Vue from 'vue'
import {mapGetters} from 'vuex'
import router from '@/router/index'
import {queryTreeBasic, queryTreeBasicProperty} from "@/api/table";
import second from '../../../public/second.png'
export default {
  name: "homeTest",
  data(){
     return{
       map: null,
       zoom: 9, //地图缩放倍数，【3，18】，18放大最高级
       center: [116.44923, 40.207714], //地图初始化中心点
       polygons: [],
       query:{
         level: undefined,
       },
       pages: {
         _page: 1,
         _per_page: 50
       }, // 分页

       trees: [],
       tree_markers: [],
       tree_windows: [],
       tree_window: '',


       //自适应
       screenHeight: document.body.clientHeight,

       levelList: [
         {
           value: '一级',
           label: '一级'
         },
         {
           value: '二级',
           label: '二级'
         },
         {
           value: '三级',
           label: '三级'
         },
         {
           value: '名木',
           label: '名木'
         }
       ]
     }
  },
  mounted() {
    // this.fetchData()
    this.init_trees()
  },
  methods:{
    onSearch(){
      // this.fetchData()
      this.init_trees()
    },
    fetchData(){
      console.log('111',this.query)
      queryTreeBasicProperty({...this.query,...this.pages}).then((res=>{
        console.log('##',res)
        this.trees = res.data.trees_basic_property
      }))
    },

    init_trees(){


      let markers = [];
      let windows=[];
      let that=this;

      let pointMarker=[]
      console.log('&&&&',that.query)
      queryTreeBasicProperty({...that.query,...that.pages}).then(resp=>{
        console.log('##',resp.data)
        pointMarker = resp.data.trees_basic_property
        console.log(pointMarker)
        that.trees = resp.data['trees_basic_property']
        pointMarker.forEach((item,index)=>{
          markers.push({
            position: [item.geo_property.longitude,item.geo_property.latitude],
            icon:second, //不设置默认蓝色水滴

            events: {
              click() {
                that.tree_windows.forEach(window => {
                  window.visible = false; //关闭窗体
                });
                that.tree_window = that.tree_windows[index];
                that.$nextTick(() => {
                  that.tree_window.visible = true;//点击点坐标，出现信息窗体
                });
              }
            }
          })
          var MyComponent = Vue.extend({
            template: `<Card style="opacity: 0.85;width: 300px;height: fit-content">
                <div slot="header" style="text-align: center">
                  <span>古树简介</span>
                </div>
                 <div>
                    {{'古树编号：' + item.tree_code}}
                    {{'古树名称：' + item.zw_name }}
                    {{'古树位置：'+ '纬度'+item.geo_property.latitude+',经度'+item.geo_property.longitude}}
                    {{'古树等级：' + item.level}}

                    <div style="margin: 8px;" align="center">
<!--                    <router-link :to="{path:'/site/chart/'+item.id, query:{site_id:item.id}}">-->
<!--                        <el-button type="primary" >查看详情</el-button>-->
<!--                     </router-link>-->
                    </div>
                 </div>

                </Card>`,
            name: 'site_tip',
            router:router,
            data(){
              return {
                item: item
              }
            }
          });
          var component= new MyComponent().$mount();
          windows.push({
            position: [item.geo_property.longitude,item.geo_property.latitude],
            content : component.$el,
            offset:[5,-15],//窗体偏移
            visible: false//初始是否显示
          })
        })
        //添加点标注
        this.tree_markers = markers;
        //生成弹窗
        this.tree_windows=windows
      })
    }
  }
}
</script>

<style scoped>
.select{
  position: absolute;
  top:3vh;
  left:3vh;
  overflow: auto;
  z-index: 999;
  height: 200px;

}
/deep/ .amap-icon img {
  position: absolute;
  z-index: -1;
  width: 24px;
}
</style>
