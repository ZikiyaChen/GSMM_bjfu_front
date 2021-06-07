<template>
  <Modal
    :value="show"
    title="新增处理方法"
    @on-ok="handleOK"
    @on-cancel="handleCancel"
    width="400"
    :loading="loading">

    <Form ref="yh_method_form" :model="yh_method" :rules="ruleValidate" :label-width="100">
      <!--      注意加prop,不然验证不生效-->
      <FormItem label="处理方法" prop="method">
        <Input v-model="yh_method.method" style="width: 200px;"></Input>
      </FormItem>
    </Form>

  </Modal>
</template>

<script>
export default {
  name: "AddMethodModal",
  props: {
    show: {
      type:Boolean,
      default:false
    },
    yh_type: String,
    onCancel: Function,
    onOK: Function,
  },
  data(){
    return{
      loading: true,
      AddYhMethod: {},
      yh_method:{
        yh_type: '',
        method: ''
      },
      ruleValidate:{
        method: [{ required: true, trigger: 'blur', message: '请填写需要添加的处理方法名称' }],
      }
    }
  },
  methods:{

    handleOK(){

      this.$refs.yh_method_form.validate((valid) => {
        if(valid){
          this.AddYhMethod = {
            yh_type: this.yh_type,
            method: this.yh_method.method
          }
          console.log('****', this.AddYhMethod)

          this.$emit('onOK', this.AddYhMethod)
          this.yh_method.method=''

        }else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    handleCancel(){
      this.$emit('onCancel')
    }
  }
}
</script>

<style scoped>

</style>
