<template>
  <basic-form
    :show="showTreeInspection"
    @basicCancel="handleBasicCancel">
    <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
       slot="header">
      古树巡查</p>
    <FormItem label="巡查性质" slot="qualityOrType">
      <Row>
        <Col span="24">
          <Select v-model="inspection.model">
            <Option v-for="item in inspection.qualities" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>

    <FormItem label="生长势" slot="other1">
      <Row>
        <Col span="24">
          <Select v-model="growthPotential.model">
            <Option v-for="item in growthPotential.status" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>

    <FormItem label="生长状态描述" slot="other">
      <Input v-model="growthStatus"></Input>
    </FormItem>

    <FormItem label="施工影响描述" slot="other">
      <Input v-model="constructionImpact"></Input>
    </FormItem>

    <FormItem label="物候期描述" slot="other">
      <Input v-model="waitingPeriod"></Input>
    </FormItem>
  </basic-form>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/layout/BasicForm";

export default {
  name: 'TreeInspection',
  components: {
    BasicForm
  },
  props: {
    showTreeInspection: Boolean
  },
  data () {
    return {
      inspection: {
        modal: '',
        qualities: ['日常巡查', '施工影响', '物候期巡视']
      },
      growthPotential: {
        modal: '',
        status: ['正常', '衰弱', '濒危']
      },
      growthStatus: '',
      constructionImpact: '',
      waitingPeriod: ''
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('treeInspectionCancel')
    }
  },

  beforeMount () {
    const initializeInspectionQualities = () => {
      this.inspection.qualities = this.inspection.qualities.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeInspectionQualities()

    const initializeGrowthPotential = () => {
      this.growthPotential.status = this.growthPotential.status.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeGrowthPotential()
  }

}
</script>

<style scoped>

</style>
