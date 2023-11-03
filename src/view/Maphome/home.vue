<!--<template>-->
<!--    <div style="height: 100%">-->
<!--      <div id="container" class="container">-->

<!--        <Form class="select" inline :model="query" >-->
<!--          <FormItem label="古树等级:" :label-width="80" style="background-color: white">-->
<!--            <Select style="width:100px" v-model="query.level" clearable>-->
<!--              <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
<!--            </Select>-->

<!--          </FormItem>-->
<!--          <FormItem><Alert style="padding-right: 12px;padding-left: 12px">共有：{{total}}棵</Alert></FormItem>-->

<!--          <Button type="primary" @click="onSearch">查询</Button>-->

<!--        </Form>-->
<!--        <InfoWindowComponent ref="infowindow" :treeInfo="treeInfo"></InfoWindowComponent>-->
<!--      </div>-->


<!--    </div>-->

<!--</template>-->

<template>
  <div style="height: 100%; position: relative">
    <div id="container" class="container">
      <InfoWindowComponent ref="infowindow" :treeInfo="treeInfo"></InfoWindowComponent>
    </div>
    <div class="select" >
      <Form inline :model="query" >
        <FormItem label="古树等级:" :label-width="80" style="background-color: white">
          <Select style="width:100px" v-model="query.level" clearable>
            <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

        </FormItem>
        <FormItem label="树种:" :label-width="80" >
          <Select style="width:100px" v-model="query.zw_name" clearable>
            <Option v-for="item in NameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem><Alert style="padding-right: 12px;padding-left: 12px">共有：{{total}}棵</Alert></FormItem>

        <Button type="primary" @click="onSearch">查询</Button>

      </Form>
    </div>
  </div>

</template>



<script>
import second from '../../../public/second.png'
import first from '../../../public/first.png'
import third from '../../../public/third.png'
import famous from '../../../public/famous.png'
import {queryTreeBasicProperty} from "@/api/table";
import name from '../tools-methods/name.json'
import Vue from 'vue'
import InfoWindowComponent from "@/view/Maphome/components/InfoWindow";
import AMap from 'AMap';
export default {
  name: "home",
  components:{InfoWindowComponent},
  data () {
    return{
      tree_markers: [],
      treeicon:undefined,
      tree:[],
      treeInfo:{},
      city:'北京市',
      map_district: null,
      polygons: [],
      // map: null,
      pages: {
        _page: 1,
        _per_page: 50
      }, // 分页
      total: 0,
      query:{
        level: undefined,
        zw_name: undefined,
        dc_status: '已完成',
      },

      NameList: [],

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
  created() {
    // this.initNameList()
    // GetDistrict().then(res=>{
    //   console.log('map',res)
    // })
  },
  mounted () {
    this.getTree()
    setTimeout(()=>{
      this.loadmap(); // 加载地图和相关
      // this.CityCover(this.city)
      this.initMarkers()
      // this.drawBackGround()
      // let place={dis:'平谷区',level:'district'}
      // this.drawPolygon(place)

    },800)

  },
  methods: {
    initNameList(){
      this.NameList = name.contents
    },
    onSearch(){
      this.getTree()
      setTimeout(()=>{
        this.initMarkers()
      },500)

    },
    // loadmap () {
    //     let that=this
    //     console.log('11',this.tree)
    //     this.map = new AMap.Map('container', { // eslint-disable-line no-unused-vars
    //       resizeEnable: true,
    //       zoom: 9,
    //     });
    //     AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView','AMap.DistrictSearch'], function () {
    //       var toolBar = new AMap.ToolBar()
    //       var scale = new AMap.Scale()
    //       const overView = new AMap.OverView()
    //       map.addControl(toolBar);
    //       map.addControl(scale)
    //       map.addControl(overView)
    //     })
    //     if (that.tree && that.tree.length > 0) {
    //       that.tree.map(item => {
    //         if(item.level === '一级'){
    //           that.treeicon = first
    //         }else if(item.level === '二级'){
    //           that.treeicon = second
    //         }else  if(item.level === '三级'){
    //           that.treeicon = third
    //         }else {
    //           that.treeicon = famous
    //         }
    //         //创建一个Marker实例
    //         let marker = new AMap.Marker({
    //           position: [item.geo_property.longitude, item.geo_property.latitude],
    //           title: item.zw_name,
    //           // icon: treeicon
    //           icon: new AMap.Icon({
    //           image: that.treeicon,
    //           size: new AMap.Size(128, 128),  //图标大小
    //           imageSize: new AMap.Size(25,25)
    //         })
    //       });
    //         // console.log(marker)
    //         //将创建的点标记添加到已有的地图实例中
    //         that.map.add(marker);
    //         marker.on('click', (e) => {
    //           console.log('e',e)
    //           that.markerWindow(e, that.map, item)
    //         })
    //       })
    //     }
    //
    // },

    initMarkers(){
      let that=this
      console.log('####',that.map)
      that.map.remove(that.tree_markers)
      that.tree_markers= []
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
              size: new AMap.Size(150, 150),  //图标大小
              imageSize: new AMap.Size(30,30)
            })
          });
          // console.log(marker)
          //将创建的点标记添加到已有的地图实例中
          that.tree_markers.push(marker)
          that.map.add(marker);
          marker.on('click', (e) => {
            console.log('e',e)
            that.markerWindow(e, that.map, item)
          })
        })
      }
    },

    loadmap () {

      console.log('11',this.tree)
      // let map = new AMap.Map('container', {
      let that = this
      that.map = new AMap.Map('container', { // eslint-disable-line no-unused-vars
        resizeEnable: true,
        zoom: 9
      });
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView','AMap.DistrictSearch'], function () {
        var toolBar = new AMap.ToolBar()
        var scale = new AMap.Scale()
        const overView = new AMap.OverView()
        map.addControl(toolBar);
        map.addControl(scale)
        map.addControl(overView)
      })


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



    drawPolygon(place) {
      let that = this
      AMap.plugin('AMap.DistrictSearch', function () {
        // 创建行政区查询对象
        var district = new AMap.DistrictSearch({
          // 返回行政区边界坐标等具体信息
          extensions: 'all',
          // 设置查询行政区级别为 区
          level: place.level,
          showbiz:true,
        })

        district.search(place.dis, function (status, result) {
          // 获取朝阳区的边界信息
          var bounds = result.districtList[0].boundaries
          var polygons = []
          if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
              //生成行政区划polygon
              var polygon = new AMap.Polygon({
                map: that.map,
                strokeWeight: 1,
                path: bounds[i],
                fillOpacity: 0.7,
                fillColor: '#CCF3FF',
                strokeColor: '#CC66CC'
              })
              polygons.push(polygon)
            }
            // 地图自适应
            // that.map.setCity(place.dis)
            that.map.setFitView(polygons)
            that.map.setZoom(11)

          }
        })
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
    getTree(){// 不知道为什么不加pages，后面两条得不到
      queryTreeBasicProperty({...this.query,...this.pages}).then(res=>{
        if(res.data.code === 200){
          this.tree = res.data.trees_basic_property
          this.total = res.data.total
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

.select{
  position: absolute;
  top:3vh;
  left:3vh;
  overflow: auto;
  z-index: 999;
  height: 300px;
  width: 900px;
  /*background: rgba(60,179,113, .3);*/

}
</style>
