<template>
  <div>
    <Button type="info" @click="show=!show">养护管理</Button>
    <work-options :show="show"  @cancel="handleCancel"></work-options>
  </div>

</template>

<script>
import WorkOptions from "@/view/YangHuManage/YhManage/componnets/WorkOptions";

export default {
  name: "yh_work_manage",
  components: {
    WorkOptions
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    handleCancel () {
      this.show = !this.show
    }
  }
}
</script>

<style scoped>

</style>
