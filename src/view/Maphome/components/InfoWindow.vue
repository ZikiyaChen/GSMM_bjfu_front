<template>
  <div  style="width: 260px;height: 180px">
    <div>
      <h3 style="text-align: center">古树信息</h3>

      <Row type="flex" align="top">
        <Col span="12" style="height: 103px">
          <h4>古树编号：{{this.treeInfo.tree_code}}</h4>
          <h4>古树等级：{{this.treeInfo.level}}</h4>
          <h4>树种：{{this.treeInfo.zw_name}}</h4>
<!--          <h4>经度：{{this.treeInfo.geo_property.longitude}}</h4>-->
<!--          <h4>纬度：{{this.treeInfo.geo_property.latitude}}</h4>-->
          <h4>管护单位：{{this.treeInfo.gh_unit}}</h4>
        </Col>
        <Col span="10" offset="2">
          <img src="#" style="height: 90px;width: 80px"/>
        </Col>
      </Row>
      <Button type="primary" size="small">查看详情</Button>
      <Button type="primary" size="small" style="margin-left: 20px">养护历史</Button>

<!--      <Button type="primary" @click="showTree">树</Button>-->
    </div>

    </div>

</template>

<script>
export default {
name: "InfoWindow",
  props: {
    treeInfo: {
      type: Object,
      default: {}
    },
  },
    data () {
      return {
        overlay: null,
        infoWindow: null,
      }
    },
    methods: {
      // initialize (e) {
      //   this.overlay = e.overlay;
      //   this.infoWindow = e.infoWindow;
      // },

      showTree(){
        console.log('tree',this.treeInfo)
      }
    }

}
</script>


<style scoped>

</style>
