<template>
  <Modal
    :value="show"
    title="新增日常养护管理的养护项目"
    @on-ok="handleOK"
    @on-cancel="handleCancel"
    width="400"
    :loading="loading">

    <Form ref="yh_measure_form" :model="yh_measure" :rules="ruleValidate" :label-width="100">
<!--      注意加prop,不然验证不生效-->
      <FormItem label="养护项目" prop="measure">
        <Input v-model="yh_measure.measure" style="width: 200px;"></Input>
      </FormItem>
    </Form>

  </Modal>
</template>

<script>
export default {
  name: "AddMeasureModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    yh_type: String,
    onCancel: Function,
    onOK: Function,
  },
  data () {
    return {
      loading: true,
      AddYhMeasure: {},
      yh_measure: {
        yh_type: '',
        measure: '',
        fz_type: ''
      },
      ruleValidate: {
        measure: [{ required: true, trigger: 'blur', message: '请填写需要添加的养护项目名称' }],
      }
    }
  },
  methods: {
    changeLoading: function () {
      setTimeout(() => {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true
        })
      }, 2000)
    },
    handleOK () {
      this.$refs.yh_measure_form.validate((valid) => {
        if (valid) {
          this.AddYhMeasure = {
            yh_type: this.yh_type,
            measure: this.yh_measure.measure,
            fz_type: this.yh_measure.fz_type
          }
          console.log('****', this.AddYhMeasure)
          this.changeLoading()
          this.$emit('onOK', this.AddYhMeasure)
          this.yh_measure.measure = ''
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    handleCancel () {
      this.$emit('onCancel')
    }
  }
}
</script>

<style scoped>

</style>
