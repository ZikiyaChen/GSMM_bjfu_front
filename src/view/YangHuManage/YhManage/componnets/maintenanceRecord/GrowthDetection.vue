<template>
  <basic-form
    :show="true"
    @basicCancel="handleBasicCancel">
    <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
       slot="header">
      古树生长指标检测</p>

    <FormItem label="检测指标类型" slot="qualityOrType">
      <Row>
        <Col span="24">
          <Select v-model="indicatorType.model" multiple>
            <Option v-for="item in indicatorType.types" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>

  </basic-form>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/layout/BasicForm";

export default {
  name: '',
  components: {
    BasicForm
  },
  data () {
    return {
      indicatorType: {
        modal: '',
        types: []
      }
    };
  },
  methods: {
    handleBasicCancel () {
      this.$emit('cancelOrConfirm')
    }
  },
  created () {
    const initializeIdicatorTypes = () => {
      let temp = '土壤含水量、新稍生长量、土样检测、树体标本检测'.split('、')
      this.indicatorType.types = temp.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeIdicatorTypes()
  }
}
</script>

<style scoped>

</style>
