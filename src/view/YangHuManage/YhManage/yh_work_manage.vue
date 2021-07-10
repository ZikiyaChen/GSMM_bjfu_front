<template>
  <div>
    <Button type="info" @click="changeShowDaily">养护管理</Button>
    <daily-maintenance :show="showDaily" @dailyCancel="handleDailyCancel"></daily-maintenance>
  </div>

</template>

<script>
import DailyMaintenance from "@/view/YangHuManage/YhManage/componnets/DailyMaintenance";

export default {
  name: "yh_work_manage",
  components: {
    DailyMaintenance
  },
  data () {
    return {
      showDaily: false
    }
  },
  methods: {
    changeShowDaily () {
      this.showDaily = !this.showDaily
    },
    handleDailyCancel () {
      this.changeShowDaily()
    }
  }
}
</script>

<style scoped>

</style>
