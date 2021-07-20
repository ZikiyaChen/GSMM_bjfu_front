<template>
  <basic-form
    :show="true"
    @basicConfirm="handleBasicConfirm"
    @basicCancel="handleBasicCancel">
    <template v-slot:header>
      <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
         slot="header">
        古树巡查</p>
    </template>
    <template v-slot:qualityOrType>
      <FormItem label="巡查性质">
        <Row>
          <Col span="24">
            <Select
              v-model="inspection.model"
              @on-change="handleInspectionChange">
              <Option v-for="item in inspection.qualities" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </template>
    <template v-slot:other1>
      <FormItem label="生长势">
        <Row>
          <Col span="24">
            <Select
              v-model="growthPotential.model"
              @on-change="handleGrowthPotentialChange">
              <Option v-for="item in growthPotential.status"
                      :value="item.value"
                      :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </template>

    <template v-slot:other>
      <FormItem label="生长状态描述">
        <Col span="4">
          <Select
            v-model="growthStatus.model"
            @on-change="handleFoldingBranchesChange">
            <Option v-for="item in growthStatus.foldingBranches"
                    :value="item.value"
                    :key="item.value">{{ item.label }}
            </Option>
          </Select>
        </Col>
        <Col span="4">
          <Input
            style="padding-right:2px"
            v-model="growthStatus.direction"
            placeholder="方向"></Input>
        </Col>
        <Col span="4">
          <Input
            style="padding-right:2px"
            v-model="growthStatus.length"
            placeholder="长度"></Input>
        </Col>
        <Col span="4">
          <Input
            style="padding-right:2px"
            v-model="growthStatus.diameter"
            placeholder="直径"></Input>
        </Col>
        <Col span="4">
          <Input
            style="padding-right:2px"
            v-model="growthStatus.surroundings"
            placeholder="周边环境"></Input>
        </Col>
        <Col span="4">
          <Input
            style="padding-right:2px"
            v-model="growthStatus.growStatus"
            placeholder="生长状态"></Input>
        </Col>
      </FormItem>

      <FormItem label="施工影响描述">
        <Input v-model="constructionImpact"></Input>
      </FormItem>

      <FormItem label="物候期描述">
        <Input v-model="waitingPeriod"></Input>
      </FormItem>
    </template>

  </basic-form>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/layout/BasicForm";

export default {
  name: 'TreeInspection',
  components: {
    BasicForm
  },
  data () {
    return {
      inspection: {
        modal: '',
        qualities: ['日常巡查', '施工影响', '物候期巡视'],
        qualitiesStr: ''
      },
      growthPotential: {
        modal: '',
        status: ['正常', '衰弱', '濒危'],
        statusStr: ''
      },
      growthStatus: {
        model: '',
        foldingBranches: ['是', '否'], // 折枝
        foldingBranchesInt: 0,
        direction: '',
        length: '',
        diameter: '',
        surroundings: '',
        growStatus: ''
      },
      constructionImpact: '',
      waitingPeriod: ''
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('cancelOrConfirm', 'cancel', null)
    },
    handleInspectionChange (value) {
      this.inspection.qualitiesStr = value
    },
    handleGrowthPotentialChange (value) {
      this.growthPotential.statusStr = value
    },
    handleFoldingBranchesChange (value) {
      this.growthStatus.foldingBranchesInt = value === '是' ? 1 : 0
    },
    handleBasicConfirm (data) {
      let lengthTemp = parseFloat(this.growthStatus.length)
      let diameterTemp = parseFloat(this.growthStatus.diameter)
      const temp = {
        project: this.inspection.qualitiesStr,
        g_vigor: this.growthPotential.statusStr,
        is_massage: this.growthStatus.foldingBranchesInt,
        direction: this.growthStatus.direction,
        length: lengthTemp,
        diameter: diameterTemp,
        surroundings: this.growthStatus.surroundings,
        grow_status: this.growthStatus.growStatus,
        impact_describe: this.constructionImpact,
        phenological_describe: this.waitingPeriod
      }
      const result = Object.assign({}, temp, data)
      this.$emit('cancelOrConfirm', 'confirm', result)
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

    const initializeFoldingBranches = () => {
      this.growthStatus.foldingBranches = this.growthStatus.foldingBranches.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeFoldingBranches()
  }

}
</script>

<style scoped>

</style>
