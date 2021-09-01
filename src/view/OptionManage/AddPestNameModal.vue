<template>
  <Modal
    :value="show"
    title="新增病虫害名称"
    @on-ok="handleOK"
    @on-cancel="handleCancel"
    width="400"
    :loading="loading">

    <Form ref="pest_name_form" :model="pest_name" :rules="ruleValidate" :label-width="100">
      <!--      注意加prop,不然验证不生效-->
      <FormItem label="病虫害名称" prop="name">
        <Input v-model="pest_name.name" style="width: 200px;"></Input>
      </FormItem>
    </Form>

  </Modal>
</template>

<script>
export default {
  name: "AddPestNameModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    onCancel: Function,
    onOK: Function,
  },
  data () {
    return {
      loading: true,
      AddYhMeasure: {},
      pest_name: {
        name: ''
      },
      ruleValidate: {
        name: [{ required: true, trigger: 'blur', message: '请填写需要添加的病虫害名称' }],
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
      this.$refs.pest_name_form.validate((valid) => {
        if (valid) {
          this.AddPestName = {
            name: this.pest_name.name
          }
          this.changeLoading()
          this.$emit('onOK', this.AddPestName)
          this.pest_name.name = ''
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
