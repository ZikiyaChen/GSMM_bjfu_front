<template>
    <div style="height: 100%">
      <div id="container" class="container"></div>
    </div>
</template>

<script>
import AMap from 'AMap';
export default {
  name: "home",
  mounted () {
    this.loadmap(); // 加载地图和相关组件
  },
  methods: {
    loadmap () {
      const map = new AMap.Map('container', { // eslint-disable-line no-unused-vars
        zoom: 9
      });
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
        var toolBar = new AMap.ToolBar();
        var scale = new AMap.Scale();
        map.addControl(toolBar);
        map.addControl(scale)
      })
    }
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
