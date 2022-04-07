<template>
  <div style="height: 100%; position: relative">
    <div id="mapContainer" class="container"></div>
<!--    <div class="info">-->
<!--      <span class="input-item-text" style="width: 8rem">请输入关键字</span>-->
<!--      <AutoComplete v-model="keyword" @on-search="Search">-->

<!--      </AutoComplete>-->
<!--    </div>-->
    <div class="info">
      <div class="input-item">
        <div class="input-item-prepend">
          <span class="input-item-text" style="width:8rem;">请输入关键字</span>
        </div>
<!--        <input id="keyword" name="keyword"  class="inputStyle">-->
        <AutoComplete v-model="keyword" @on-change="Search" style="width: 68%" @on-select="addMarks">
          <Option v-for="option in autocompleteData" :value="option.name" :key="option.id">
            <span class="demo-auto-complete-title">{{ option.name }}</span>
            <span class="demo-auto-complete-count; title"> {{ option.address }}</span>
          </Option>


        </AutoComplete>

      </div>

      <div class="but-card">
        <Button style="margin-bottom: 5px" @click="drawPlace">开始绘制</Button>
        <Button style="margin-bottom: 5px" @click="clearMap">清除折线</Button>
        <Button style="margin-bottom: 5px" @click="showAddModal = true">确定区域名称</Button>
      </div>
    </div>
    <Modal
      v-model="showAddModal"
      title="输入所绘制区域的名称"
      @on-ok="Submit"
      @on-cancel="Cancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="所绘区域名称:" prop="name">
          <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
      </Form>
    </Modal>


  </div>
</template>

<script>
import AMap from "AMap";
import {AddPolygonPath} from "@/api/mapApi";


export default {
  name: "index.vue",

  data(){
     return{
       showAddModal: false,
       formValidate: {
         name: '',
       },
       ruleValidate: {
         name: [
           {required: true, message: 'The name cannot be empty', trigger: 'blur'}
         ],
       },

       map: null,
       keyword: '',
       autocompleteData:[],
       markerList: [],

       drawPolyline: null,

       polyEditor: null,
       polygonPaths: [],
       polygons: [],


       mouseTool: null,

     }
  },
  created() {

  },
  mounted() {
    this.loadmap()
  },
  methods: {

    Submit(){
      this.$refs.formValidate.validate((valid) => {
        if(valid){
          console.log(this.formValidate.name)
          this.$Message.success('成功')
          AddPolygonPath({'name':this.formValidate.name, 'pathArr': this.polygonPaths}).then(res=>{
            console.log(res)
          })
          this.showAddModal = false
        }
      })
    },
    Cancel(){
      this.showAddModal = false
    },


    loadmap () {
      let that = this
      that.map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        zoom: 13,//地图显示的缩放级别
        center: [116.397428, 39.90923],//地图中心点
        keyboardEnable: false
      });
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView'], function () {
        var toolBar = new AMap.ToolBar()
        var scale = new AMap.Scale()
        const overView = new AMap.OverView()
        that.map.addControl(toolBar);
        that.map.addControl(scale)
        that.map.addControl(overView)
      });

       // this.drawPolygon()
       // this.initMarker()

    },

    Search(value) {
      let that=this
      AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
        var autoOptions = {
          city: "北京", //城市，默认全国
          input: value//使用联想输入的input的id
        };
        var autocomplete = new AMap.Autocomplete(autoOptions)
        autocomplete.search(value,function (status, result){
          console.log(result)
          that.autocompleteData = result.tips
        });


      });
    },

    addMarks(value){
      let that=this

      var placeSearch = new AMap.PlaceSearch({
        city: '北京',
        map: that.map
      })
      placeSearch.search(value,function (state,result){
        console.log(result)
        for (var i = 0, marker; i < result.poiList.pois; i++) { // 因为我需要展示多个 所以必须使用循环
          var marker = new AMap.Marker({
            position: result.poiList.pois[i].position, // 你自定义窗口所出现的位置
            resizeEnable: true, // 固定大小的窗口的大小
            map: that.map,
          });
          that.markerList.push(marker)

          // //生成行政区划polygon
          // var polygon = new AMap.Polygon({
          //   map: that.map,
          //   strokeWeight: 1,
          //   path: result.pois[i].position,
          //   fillOpacity: 0.7,
          //   fillColor: '#CCF3FF',
          //   strokeColor: '#CC66CC'
          // })
          // that.polygons.push(polygon)
        }
        that.map.add(that.markerList)
        // that.map.add(that.polygons)
      })
    },

    initPolygon(value){
      let that = this
      console.log('xxx',value)
      // 获取初始的边界信息
      var placeSearch1 = new AMap.PlaceSearch({
        city: '北京',
        map: that.map,
      })
      placeSearch1.search(value,function (state,result) {
        console.log(result)

      })
    },
    clearMap(){
      this.mouseTool.close(true) //清除编辑的覆盖物
    },


    drawPlace(){
      let that=this
      //通过插件方式引入 AMap.MouseTool 工具
      that.map.plugin(["AMap.MouseTool"],function(){
        //在地图中添加MouseTool插件
        that.mouseTool = new AMap.MouseTool(that.map);
        //监听draw事件可获取画好的覆盖物

        that.mouseTool.on('draw',function(e){
          console.log('$$$',e.obj.getPath())//折线数组
          that.polygonPaths = e.obj.getPath()
        })

        //用鼠标工具画多边形
        that.drawPolyline = that.mouseTool.polyline({
          strokeColor:'#FA8072',
          isOutline: true,
          outlineColor: '#ffeeff',
          borderWeight: 3,

          strokeOpacity: 1,
          strokeWeight: 6,
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
        })
})


  },

    continueDraw(){
      let that = this
      console.log('%%%',that.polygonPaths)

      that.map.remove(that.drawPolyline)
      //定义折线对象
      var polyline=new AMap.Polyline({
        path:that.polygonPaths,     //设置折线的节点数组
        strokeColor:"#F00",


        isOutline: true,
        outlineColor: '#ffeeff',
        borderWeight: 3,

        strokeOpacity: 1,
        strokeWeight: 6,
        // 折线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        strokeDasharray: [10, 5],
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50,
      });

      polyline.setMap(that.map);//地图上添加折线

      //构造折线编辑对象，并开启折线的编辑状态
      that.map.plugin(["AMap.PolyEditor"],function(){
        var polylineEditor = new AMap.PolyEditor(that.map,polyline);
        polylineEditor.open();

        polylineEditor.on('addnode', function(event) {
          log.info('触发事件：addnode')
        })

        polylineEditor.on('adjust', function(event) {
          log.info('触发事件：adjust')
        })

        polylineEditor.on('removenode', function(event) {
          log.info('触发事件：removenode')
        })

        polylineEditor.on('end', function(event) {
          log.info('触发事件： end')
          // event.target 即为编辑后的折线对象
        })
      });


      // 开启编辑模式


    }



  }
}
</script>

<style scoped>

.ivu-select-item{
  display: flex;
  flex-direction: column;
}

.title{
  width: 150px;
  overflow: hidden;
  whitewhite-space: nowrap;
  text-overflow: ellipsis;
}
.container{
  width: 100%;
  height: 100%;
  /*overflow: hidden;*/
}
.info {
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: .25rem;
  position: fixed;
  top: 8rem;
  background-color: white;
  width: auto;
  min-width: 22rem;
  border-width: 0;
  right: 2rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
}

.but-card {
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: .25rem;
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 2rem;
  background-color: white;

  min-width: 10rem;
  border-width: 0;
  right: 2rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
}


.input-item {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 2.5rem;
}
.input-item-prepend {
  margin-right: -1px;

}

.input-item-text {
  /*width: 3rem;*/
  text-align: justify;
  padding: 0.5rem 0.7rem;
  /*display: inline-block;*/
  text-justify: distribute-all-lines;
  text-align-last: justify;
  -moz-text-align-last: justify;
  -webkit-text-align-last: justify;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 0;
  font-size: 0.7rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.input-item>select:not(:first-child), .input-item>input[type=text]:not(:first-child), .input-item>input[type=date]:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

input[type=text], input[type=date] {
  background: #fff;
  padding: .375rem .75rem;
}

.input-item>select, .input-item>input[type=text], .input-item>input[type=date] {
  position: relative;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  width: 1%;
  margin-bottom: 0;
}
.inputStyle{
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  height: 2.4rem;
}
.demo-auto-complete-item{
  padding: 4px 0;
  /*border-bottom: 1px solid #F6F6F6;*/
  border-bottom: 1px solid #ced4da;


}
.demo-auto-complete-group{
  font-size: 12px;
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
}
.demo-auto-complete-group span{
  color: #495057;

}
.demo-auto-complete-group a{
  float: right;
}
.demo-auto-complete-count{
  float: right;
  color: #999;
}
.demo-auto-complete-more{
  display: block;
  margin: 0 auto;
  padding: 4px;
  text-align: center;
  font-size: 12px;
}

</style>
