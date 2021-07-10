<template>
  <div>
    <basic-form
      :show="show"
      @basicCancel="handleBasicCancel">
      <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
         slot="header">
        日常养护管理工作</p>
      <FormItem label="措施或性质" slot="qualityOrType">
        <Input v-model="test"></Input>
      </FormItem>

      <FormItem label="养护管理项目名称" slot="other">
        <Input v-model="test"></Input>
      </FormItem>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/layout/BasicForm";

export default {
  name: 'DailyMaintenance',
  props: {
    show: Boolean
  },
  components: {
    BasicForm
  },
  data () {
    return {
      test: ''
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('dailyCancel')
    }
  }

}
</script>

<style scoped>

</style>
