<template>
  <div>
    <Button type="info" @click="handleDailyClick">日常养护管理</Button>
    <daily-maintenance :showDailyMaintenance="showDailyMaintenance"  @dailyCancel="handleDailyClick"></daily-maintenance>

    <Button type="info" @click="handleTrimClick">修剪工作</Button>
    <trim-work :showTrimWork="showTrimWork"  @trimCancel="handleTrimClick"></trim-work>

    <Button type="info" @click="handleTreeProtectionClick">树体保护措施</Button>
    <tree-protection :showTreeProtection="showTreeProtection" @treeProtectionCancel="handleTreeProtectionClick"></tree-protection>

    <Button type="info" @click="handlePestControlClick">病虫害防护</Button>
    <pest-control :showPestControl="showPestControl" @pestControlCancel="handlePestControlClick"></pest-control>

    <Button type="info" @click="handleTreeInspectionClick">古树巡查</Button>
    <tree-inspection :showTreeInspection="showTreeInspection" @treeInspectionCancel="handleTreeInspectionClick"></tree-inspection>

    <Button type="info" @click="handleGrowthDetectionClick">古树生长指标检测</Button>
    <growth-detection :showGrowthDetection="showGrowthDetection" @treeInspectionCancel="handleGrowthDetectionClick"></growth-detection>
  </div>

</template>

<script>
import DailyMaintenance from "@/view/YangHuManage/YhManage/componnets/DailyMaintenance";
import TrimWork from "@/view/YangHuManage/YhManage/componnets/TrimWork";
import TreeProtection from "@/view/YangHuManage/YhManage/componnets/TreeProtection";
import PestControl from "@/view/YangHuManage/YhManage/componnets/PestControl";
import TreeInspection from "@/view/YangHuManage/YhManage/componnets/TreeInspection";
import GrowthDetection from "@/view/YangHuManage/YhManage/componnets/GrowthDetection";

export default {
  name: "yh_own_record",
  components: {
    DailyMaintenance,
    TrimWork,
    TreeProtection,
    PestControl,
    TreeInspection,
    GrowthDetection
  },
  data () {
    return {
      showDailyMaintenance: false,
      showTrimWork: false,
      showTreeProtection: false,
      showPestControl: false,
      showTreeInspection: false,
      showGrowthDetection: false
    }
  },
  methods: {
    handleDailyClick () {
      this.showDailyMaintenance = !this.showDailyMaintenance
    },
    handleTrimClick () {
      this.showTrimWork = !this.showTrimWork
    },
    handleTreeProtectionClick () {
      this.showTreeProtection = !this.showTreeProtection
    },
    handlePestControlClick () {
      this.showPestControl = !this.showPestControl
    },
    handleTreeInspectionClick () {
      this.showTreeInspection = !this.showTreeInspection
    },
    handleGrowthDetectionClick () {
      this.showGrowthDetection = !this.showGrowthDetection
    }
  }
}
</script>

<style scoped>

</style>
