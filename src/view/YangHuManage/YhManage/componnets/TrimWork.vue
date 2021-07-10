<template>
  <div>
    <basic-form
      :show="show"
      @basicCancel="handleBasicCancel">
      <FormItem label="措施或性质" slot="qualityOrType">
        <Input v-model="test"></Input>
      </FormItem>

      <FormItem label="修剪原因" slot="other">
        <Input v-model="test"></Input>
      </FormItem>
      <FormItem label="修剪对象说明" slot="other">
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
