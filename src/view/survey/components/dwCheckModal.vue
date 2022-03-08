<template>
  <Modal
    :value="show"
    title="批量审核"
    @on-ok="handleSubmit"
    @on-cancel="handleCancel">
    <Form :model="Check" ref="Check_form" :rules="ruleValidate" :label-width="140" style="width: 80%">
      <FormItem label="单位审核人：" prop="dw_Checker">
        <Input v-model="Check.dw_Checker" placeholder="请输入单位审核人姓名"></Input>
      </FormItem>
      <FormItem prop="dw_CheckState" label="单位审核状态：" >
        <RadioGroup v-model="Check.dw_CheckState">
          <Radio v-for="item in CheckStateList" :label="item" :key="item" ></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop="dw_CheckResult" label="单位审核结果：">
        <RadioGroup v-model="Check.dw_CheckResult">
          <Radio v-for="item in CheckResultList" :label="item" :key="item" ></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="不通过理由：" prop="dw_Reason" v-if="Check.dw_CheckResult === '审核不通过'">
        <Input v-model="Check.dw_Reason" placeholder="请输入审核不通过理由" ></Input>
      </FormItem>

    </Form>
  </Modal>
</template>

<script>
import {dateToString} from "@/libs/tools";

export default {
  name: "dwCheckModal",
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function
  },
  data(){
    return{
      NowDate: new Date(),
      CheckStateList:['已审核','未审核'],
      CheckResultList:['审核通过','审核不通过'],
      Check:{
        dw_CheckState:'',
        dw_CheckResult:'',
        dw_Checker: '',
        dw_Reason: '',
        dw_CheckTime: null,
      },

      ruleValidate: {
        dw_Checker: [{required: true, message: '请填写单位审核人', trigger: 'blur'}],
        dw_CheckState: [{required: true, message: '请选择单位审核状态'}],
      }
    }
  },
  methods:{
    handleSubmit(){
      this.Check.dw_CheckTime = dateToString(this.NowDate, 'yyyy-MM-dd hh:mm:ss')
      this.$refs.Check_form.validate((valid) => {
        if (valid) {
          this.$emit('onOK',this.Check)
        }else {
          this.$Message.error('请按要求填写')
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
/*控制单选选项之间距离*/
.ivu-radio-wrapper {
  width: 85px;
  margin-right: 15px;
}
</style>
