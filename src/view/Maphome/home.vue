<template>
    <div style="height: 100%">
      <div id="container" class="container"></div>
      <InfoWindowComponent ref="infowindow" :treeInfo="treeInfo"></InfoWindowComponent>
    </div>
</template>

<script>
import second from '../../../public/second.png'
import first from '../../../public/first.png'
import third from '../../../public/third.png'
import famous from '../../../public/famous.png'
import {queryTreeBasicProperty} from "@/api/table";
import { forEach } from "@/libs/tools";
import Vue from 'vue'
import InfoWindowComponent from "@/view/Maphome/components/InfoWindow";
import AMap from 'AMap';
export default {
  name: "home",
  components:{InfoWindowComponent},
  data () {
    return{
      treeicon:undefined,
      tree:[],
      treeInfo:{},
      city:'北京市',
      map_district: null,
      polygons: [],
      map: null,
    }
  },
  created() {

      // queryTreeBasicProperty().then(res=>{
      //   if(res.data.code === 200){
      //     this.tree = res.data.trees_basic_property
      //     console.log(this.tree)
      //   }
      // })

  },
  mounted () {
    this.getTree()
    setTimeout(()=>{
      this.loadmap(); // 加载地图和相关
      // this.CityCover(this.city)
      this.drawBackGround()

    },500)

  },
  methods: {
    loadmap () {
        let that=this
        console.log('11',this.tree)
        this.map = new AMap.Map('container', { // eslint-disable-line no-unused-vars
          resizeEnable: true,
          zoom: 9,
        });
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView','AMap.DistrictSearch'], function () {
          var toolBar = new AMap.ToolBar()
          var scale = new AMap.Scale()
          const overView = new AMap.OverView()
          map.addControl(toolBar);
          map.addControl(scale)
          map.addControl(overView)
        })
        if (that.tree && that.tree.length > 0) {
          that.tree.map(item => {
            if(item.level === '一级'){
              that.treeicon = first
            }else if(item.level === '二级'){
              that.treeicon = second
            }else  if(item.level === '三级'){
              that.treeicon = third
            }else {
              that.treeicon = famous
            }
            //创建一个Marker实例
            let marker = new AMap.Marker({
              position: [item.geo_property.longitude, item.geo_property.latitude],
              title: item.zw_name,
              // icon: treeicon
              icon: new AMap.Icon({
              image: that.treeicon,
              size: new AMap.Size(128, 128),  //图标大小
              imageSize: new AMap.Size(25,25)
            })
          });
            // console.log(marker)
            //将创建的点标记添加到已有的地图实例中
            that.map.add(marker);
            marker.on('click', (e) => {
              console.log('e',e)
              that.markerWindow(e, that.map, item)
            })
          })
        }

    },

    drawBackGround() {
      let that=this
      new AMap.DistrictSearch({
        extensions: 'all',
        subdistrict: 0
      }).search('北京市', function (status, result) {
        // 外多边形坐标数组和内多边形坐标数组
        var outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true),
        ];
        var holes = result.districtList[0].boundaries
        var pathArray = [
          outer
        ];
        pathArray.push.apply(pathArray, holes)
        var polygon = new AMap.Polygon({
          pathL: pathArray,
          strokeColor: 'rgb(20,164,173)',//边框线颜色
          strokeWeight: 4,
          strokeOpacity: 0,
          fillColor: '#d80e18',//遮罩图层颜色
          fillOpacity: 0.1,
          strokeStyle: 'dashed',
          strokeDasharray: [10, 2, 10]
        });
        polygon.setPath(pathArray);
        that.map.add(polygon)
      })
    },

    markerWindow(e,map,item){
      let that=this
      that.treeInfo=item
      let infoWidow = new AMap.InfoWindow({
        autoMove: true,
        isCustom: false,
        anchor: 'bottom-center',
        content: that.$refs.infowindow.$el,
        offset: new AMap.Pixel(0,-2),
        closeWhenClickMap: true
      })
      infoWidow.open(map,e.lnglat)
    },
    getTree(){
      queryTreeBasicProperty().then(res=>{
        if(res.data.code === 200){
          this.tree = res.data.trees_basic_property
          console.log(this.tree)
        }
      })
    },



  }
}
</script>

<style scoped>
.container{
  width: 100%;
  height: 100%;
  /*overflow: hidden;*/
}
</style>
