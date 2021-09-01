<template>
  <Card>
    <h1>养护项目及处理方法管理</h1>
    <br>
  <Tabs @on-click="onTypeTabClick">
    <TabPane label="日常养护管理" name="日常养护管理"></TabPane>
    <TabPane label="修剪" name="修剪"></TabPane>
    <TabPane label="树体保护措施" name="树体保护措施"></TabPane>
    <TabPane label="生长环境保护与改善" name="生长环境保护与改善"></TabPane>
    <TabPane label="病虫害防治" name="病虫害防治"></TabPane>
  </Tabs>

    <template v-if="select_tag==='日常养护管理'">
      <index></index>
    </template>
    <template v-else-if="select_tag==='修剪'">
      <xiujian></xiujian>
    </template>
    <template v-else-if="select_tag==='树体保护措施'">
      <ShutiProtect></ShutiProtect>
    </template>
    <template v-else-if="select_tag==='生长环境保护与改善'">
      <EnvironmentProtect></EnvironmentProtect>
    </template>
    <template v-else-if="select_tag==='病虫害防治'">

    </template>
  </Card>
</template>

<script>
import DailyManage from "@/view/YangHuManage/Yh_options/measures/DailyManage";
import Xiujian from "@/view/YangHuManage/Yh_options/measures/xiujian";
import ShutiProtect from "@/view/YangHuManage/Yh_options/measures/ShutiProtect";
import EnvironmentProtect from "@/view/YangHuManage/Yh_options/measures/EnvironmentProtect";
import index from "@/view/OptionManage/yh_classify_options/index";
export default {
  name: "index",
  components: {EnvironmentProtect, ShutiProtect, Xiujian, DailyManage, index},
  data(){
    return{
      select_tag: '日常养护管理'
    }
  },
  methods:{
    onTypeTabClick: function (name) {
      // 切换标签触发
      this.select_tag=name

    }
  }

}
</script>

<style scoped>

</style>
