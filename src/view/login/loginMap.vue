<template>
  <div style="height: 100%; position: relative">
    <div id="container" class="container">
    </div>
  </div>
</template>

<script>
import second from '../../../public/second.png'
import first from '../../../public/first.png'
import third from '../../../public/third.png'
import famous from '../../../public/famous.png'
import teji from '../../../public/teji.png'
import {queryBasicCeshiTrees,queryBasicLoginCeshiTrees,queryMapTrees, queryTreeBasicProperty} from "@/api/table";
import name from '../tools-methods/name.json'
// import InfoWindowComponent from "@/view/Maphome/components/InfoWindow";
import AMap from 'AMap';
import UserMixin from "@/mixin/UserMixin";
import {ShowPic,getPicApi} from "@/api/upload";
// 导入多边形区域数据
import { multiplePolygons } from './polygons.js'


export default {
  name: "loginMap",
  // components:{InfoWindowComponent},
  inject: ['reload'],
  data () {
    return{
      getPicApi:getPicApi,
      pic: '',
      userInfo:{
        username: 'bjfu-admin',
        access: 'bjfu123456',
        is_dc: false,
        unit: '北京林业大学',
        is_yh: false,
        current_role: '单位管理员',
        work_place_type:'2',
        district_type:'2',
        work_place_unit:'4',
        polygon_paths: [
          {Q: 40.000774, R: 116.34011499999997, lng: 116.340115,lat: 40.000774},
          { Q: 40.000814, R: 116.34018, lng: 116.34018, lat: 40.000814 },
          { Q: 40.001028, R: 116.348999, lng: 116.348999, lat: 40.001028 },
          { Q: 40.002605, R: 116.348913, lng: 116.348913, lat: 40.002605 },
          { Q: 40.003329, R: 116.349063, lng: 116.349063, lat: 40.003329 },
          { Q: 40.0066, R: 116.34876300000002, lng: 116.348763, lat: 40.0066 },
          { Q: 40.006665, R: 116.34824800000001, lng: 116.348248, lat: 40.006665 },
          { Q: 40.006386, R: 116.34822600000001, lng: 116.348226, lat: 40.006386 },
          { Q: 40.006337, R: 116.346789, lng: 116.346789, lat: 40.006337 },
          { Q: 40.0066, R: 116.34655299999997, lng: 116.346553, lat: 40.0066 },
          { Q: 40.0066, R: 116.34603800000002, lng: 116.346038, lat: 40.0066 },
          { Q: 40.003312, R: 116.34618799999998, lng: 116.346188, lat: 40.003312 },
          { Q: 40.003312, R: 116.343098, lng: 116.343098, lat: 40.003312 },
          { Q: 40.004446, R: 116.34301199999999, lng: 116.343012, lat: 40.004446 },
          { Q: 40.004298, R: 116.34007300000002, lng: 116.340073, lat: 40.004298 }

        ]
      },
      districtTypeList: {'1':'province','2':'city','3':'district'},
      place:{dis:'',level:''},
      tree_markers: [],
      treeicon:undefined,
      cluster: undefined,//点汇聚对象
      tree:[],
      treeInfo:{},
      city:'北京市',
      district:'北京林业大学',
      map_district: null,
      polygons: [],
      map: null,
      pages: {
        // _page: 1,
        // _per_page: 50
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
          value: '特级',
          label: '特级'
        },
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
      ],
      multiplePolygons: multiplePolygons,
    }
  },

  created () {
    this.getTree()
  },
  mounted () {
    this.loadmap()
    // 调用添加多边形区域函数
    this.addMultiplePolygons();
    setTimeout(()=>{
      this.initMarker()
      this.addCluster()   // 点聚合加载
    },1000)
    
    window.SeeDetails = this.SeeDetails;
  },
  methods: {
    // 添加多个多边形自定义区域
    addMultiplePolygons() {
      for (let i = 0; i < this.multiplePolygons.length; i++) {
        let region = this.multiplePolygons[i];
        this.addPolygon(region);
      }
    },
    // 添加一个多边形区域
    addPolygon(region) {
      let polygon = new AMap.Polygon({
        path: region.path,
        fillColor: region.color,
        strokeOpacity: 1,
        fillOpacity: 0.4,
        strokeColor: 'rgb(20,164,173)',
        strokeWeight: 1,
      });
      this.map.add(polygon);
      this.map.setZoom(17)
      this.map.setCenter( { Q: 40.003710, R: 116.344387, lng: 116.344387, lat: 40.003710 },)
      // 鼠标点击
      polygon.on('click', () => {
        polygon.setOptions({
          fillOpacity: 0.4,
        })
        let bounds = polygon.getBounds();
        let center = bounds.getCenter();
        let infoWindow = new AMap.InfoWindow({
          content:`<div style="width: 460px">
                    <h2 style="text-align: center; margin-bottom: 10px">${region.name}</h2>
                    ${region.treeList.map((tree, index) => `
                      <div style="display: flex; flex-direction: row; justify-content: space-evenly; align-items: center;
                                  margin-left: 10px; margin-right: 10px; margin-bottom: ${index !== region.treeList.length - 1 ? '20px' : '0'};
                                  border-bottom: ${index !== region.treeList.length - 1 ? '1px solid #ccc' : 'none'}; padding-bottom: 10px;">
                        <img src='${tree.pic_url}' style="height: 60px"/>
                        <div style="display: flex; flex-direction: column; font-family: Microsoft YaHei; font-size: 14px; line-height: 20px;">
                          <div style="display:flex; justify-content: space-between;">
                            <p style="margin-right: 10px; width: 220px;">中文名：${tree.zw_name}</p>
                            <p style="width: 120px;">科：${tree.family}</p>
                          </div>
                          <div style="display:flex; justify-content: space-between;">
                            <p style="margin-right: 10px; width: 220px;">拉丁名：${tree.ld_name}</p>
                            <p style="width: 120px;">属：${tree.genus}</p>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                    <p style="text-align: right; color: #666; font-size: 12px; margin-top: 10px;">
                      现已统计${region.totalNum} 棵古树
                    </p>
                  </div>`,
          offset: new AMap.Pixel(0, -30), // 设置信息窗体的偏移量，使其显示在多边形上方
          autoMove:true,
          closeWhenClickMap:true
          
        });
        infoWindow.open(this.map, center); 
      })
      // 鼠标移入
      // polygon.on('mouseover', () => {
      //   polygon.setOptions({
      //     fillOpacity: 0.9,
      //   })
      // });
      // 鼠标移出
      // polygon.on('mouseout', () => {
      //   polygon.setOptions({
      //     fillOpacity: 0.4,
      //   })
      // });
      },


    initNameList(){
      this.NameList = name.contents
    },
    onSearch(){
      this.getTree()
      setTimeout(()=>{
        this.initMarkers()
      },500)
    },
    getPic(tree){

      if(tree.pic_record.path.length!==0){
        ShowPic(tree.pic_record.path[0]).then(res=>{
          return res.data
        })
      }
    },
    async initMarker(){
      let that = this
      console.log('tree',this.tree)
      that.tree_markers = []
      for (var i = 0, marker; i < this.tree.length; i++) { // 因为我需要展示多个 所以必须使用循环
        var infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(5, -20),
          autoMove: true,
          closeWhenClickMap: true,
        });
        // let lnglat = [this.tree[i].longitude, this.tree[i].latitude]
        let lnglat = this.tree[i].convert_lnglat

        var marker = new AMap.Marker({
          position: lnglat, // 你自定义窗口所出现的位置
          resizeEnable: true, // 固定大小的窗口的大小
          map: that.map,
          icon: new AMap.Icon({
            image://w这里用来显示你需要自定义的图标 这里使用三目运算就比较方便了
              that.tree[i].level === "一级"
                ? first
                : this.tree[i].level === "二级"
                  ? second
                  : that.tree[i].level === '三级'
                    ? third
                    :that.tree[i].level === '特级'
                      ? teji
                      : famous,
            size: new AMap.Size(27, 27),  //图标大小
            imageSize: new AMap.Size(27,27)
          })

        });
        marker.content = `<div style="width: 460px">
                           <h2 style="text-align: center; margin-bottom: 10px">古树简介</h2>
                           <div style="display: flex; flex-direction: row; justify-content: space-evenly;align-items: flex-start;
                           margin-left: 10px; margin-right: 10px">
                           <div style="display: flex ; flex-direction: column; font-family: Microsoft YaHei; font-size: 14px; line-height: 20px">
                           <p>古树编号：${this.tree[i].tree_code}</p>
                           <p>中文名：${this.tree[i].zw_name}</p>
                           <p>拉丁名：${this.tree[i].ld_name}</p>
                           <p>科：${this.tree[i].family}</p>
                           <p>属：${this.tree[i].genus}</p>
                           <p>古树等级：${this.tree[i].level}</p>
                           <p>预估树龄：${this.tree[i].estimate_age}年</p>
                           <p>生长势：${this.tree[i].growth_vigor}</p>
                           <p>树高：${this.tree[i].height}米</p>
                           <p>经纬度：${this.tree[i].longitude}&#176，${this.tree[i].latitude}&#176</p>
                           <p>管护单位：${this.tree[i].gh_unit}</p>
                           </div>
                           <img src='${this.getPicApi}${this.tree[i].pic_path[0]}' style="height: 240px"/>
                           </div>
                          </div>`;
        //将创建的点标记添加到已有的地图实例中
        that.tree_markers.push(marker)
        marker.on("click", markerClick);
      }
      function markerClick(e) {
        console.log('e', e)
        infoWindow.setContent(e.target.content);  // 自定义窗口添加一个盒子去展示对应Marker(地图上的图标)所要展示的信息
        infoWindow.open(that.map, e.target.getPosition()); // Marker(地图上的图标)  打开自定义窗口的事件
      }
      // that.map.setFitView([marker]);
    },

    SeeDetails(value){
      this.$router.push({name: 'BaseInfo', params:{tree_code:value}})
    },

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
          }else  if(item.level === '特级'){
            that.treeicon = teji
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
              imageSize: new AMap.Size(15,15)
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

    async loadmap () {
      let that = this
      that.map = new AMap.Map('container', {
        resizeEnable: true,
        // zoom: 12,
        zooms:[3,20],
        expandZoomRange: true

      });
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView','AMap.DistrictSearch'], function () {
        var toolBar = new AMap.ToolBar({
          position: 'RT' 
        });
        var scale = new AMap.Scale()
        const overView = new AMap.OverView()
        that.map.addControl(toolBar);
        that.map.addControl(scale)
        that.map.addControl(overView)
      });

      await this.initPolygon()
    },

    addCluster(){
      let that = this

      if(that.cluster){
        that.cluster.setMap(null)
      }
      that.map.plugin(["AMap.MarkerClusterer"],function() {
        that.cluster = new AMap.MarkerClusterer(that.map, that.tree_markers, {
          gridSize:50, //默认点汇聚样式
          maxZoom:18
        });
      });



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
        console.log(result)
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
        that.map.add(polygon);

      })
    },


    initPlace() {

      this.place.level = this.districtTypeList[this.userInfo.district_type]
      if(this.userInfo.district_type === '1'){
        this.place.dis = this.userInfo.province
      }else if(this.userInfo.district_type === '2'){
        this.place.dis = this.userInfo.city
      }else if(this.userInfo.district_type === '3'){
        this.place.dis = this.userInfo.area

      }
    },

    async initPolygon(){
      let that = this
      if(this.userInfo.work_place_type === '1'){
        await that.drawDistrictPolygon()
      }else {
        await that.drawUnitPolygon()
      }
    },
    async drawDistrictPolygon() {
      let that = this
      await that.initPlace()
      AMap.plugin('AMap.DistrictSearch', function () {
        // 创建行政区查询对象
        var district = new AMap.DistrictSearch({
          // 返回行政区边界坐标等具体信息
          extensions: 'all',
          // 设置查询行政区级别为 区
          level:that.place.level ,
          showbiz: true,
        })


        district.search(that.place.dis, function (status, result) {
          console.log('****',that.userInfo,'*********')
          console.log(result)
          // 获取 区的边界信息
          var holes = result.districtList[0].boundaries // 注意此格式，[ [   [],[],[]   ] ]
          // 外多边形坐标数组和内多边形坐标数组
          var outer = [
            new AMap.LngLat(-360, 90, true),
            new AMap.LngLat(-360, -90, true),
            new AMap.LngLat(360, -90, true),
            new AMap.LngLat(360, 90, true),
          ];

          var pathArray = [
            outer
          ];
          pathArray.push.apply(pathArray, holes)

          //生成行政区划polygon
          var polygon = new AMap.Polygon({
            map: that.map,
            strokeWeight: 1,
            path: pathArray,
            fillOpacity: 0.5,
            // fillColor: '#CCF3FF',
            // strokeColor: '#CC66CC'
            strokeColor: 'rgb(20,164,173)',//边框线颜色
            fillColor: "#3CB371",//遮罩图层颜色
          })


          // 地图自适应
          if(that.place.dis === '白水县' && that.userInfo.is_admin!==true){
            that.map.setZoom(18)
            that.map.setCenter([109.6979687,35.371238])

          }else{
            // that.map.setCenter(result.districtList[0].center)
            that.map.setCenter([109.622471,35.251808])

            that.map.setZoom(11)
          }
        })
      })
    },

    drawUnitPolygon(){
      // let that = this

      // var bounds = this.userInfo.polygon_paths

      // // 外多边形坐标数组和内多边形坐标数组
      // var outer = [
      //   new AMap.LngLat(-360, 90, true),
      //   new AMap.LngLat(-360, -90, true),
      //   new AMap.LngLat(360, -90, true),
      //   new AMap.LngLat(360, 90, true),
      // ];
      // var holes = [bounds] // 注意此格式，[ [   [],[],[]   ] ]
      // console.log(holes)
      // var pathArray = [
      //   outer
      // ];
      // pathArray.push.apply(pathArray, holes)
      // var polygon = new AMap.Polygon({
      //   path: pathArray,
      //   bubble: true,
      //   strokeColor: 'rgb(20,164,173)',//边框线颜色
      //   strokeWeight: 2,
      //   fillColor: "#3CB371",//遮罩图层颜色
      //   fillOpacity: 0.4,
      //   map: that.map
      // });
      // that.map.setZoom(17)
      // that.map.setCenter( { Q: 40.003710, R: 116.344387, lng: 116.344387, lat: 40.003710 },)






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
    initPic(){
      for(var j=0;j<this.tree.length;j++){
        if(this.tree[j].pic_record.path.length!==0){
          ShowPic(this.tree[j].pic_record.path[0]).then(res=>{
            this.tree[j]['pic'] = res.data
            console.log(res.data)
          })
        }
      }
    },
    getBasic(){
      queryBasicCeshiTrees({...this.query,...this.pages}).then(res=>{
        if(res.data.code === 200){
          console.log(res.data)
        }
      })
    },
    getTree(){// 不知道为什么不加pages，后面两条得不到
      queryBasicLoginCeshiTrees({...this.query,...this.pages}).then(res=>{
        if(res.data.code === 200){
          this.tree = res.data.trees_basic_property
          this.total = res.data.total
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
