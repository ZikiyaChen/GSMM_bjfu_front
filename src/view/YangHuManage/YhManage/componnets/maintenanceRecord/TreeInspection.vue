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
              :default-label="inspection.model"
              v-model="inspection.model"
              @on-change="handleInspectionChange">
              <Option
                v-for="item in inspection.qualities"
                :value="item.value"
                :key="item.value">
                {{ item.label }}
              </Option>
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
              :default-label="growthPotential.model"
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
      <Row>
        <Col span="9">
          <FormItem label="生长状态描述">折枝
          <Select
            :default-label="growthStatus.model"
            v-model="growthStatus.model"
            @on-change="handleFoldingBranchesChange" style="width: 150px">
            <Option v-for="item in growthStatus.foldingBranches"
                    :value="item.value"
                    :key="item.value">{{ item.label }}
            </Option>
          </Select>
          </FormItem>
        </Col>
        <Col span="7">
          <FormItem label="方向">
          <Input
            v-model="growthStatus.direction"
            placeholder="方向"></Input>
          </FormItem>
        </Col>


        <Col span="8">
          <FormItem label="长度">
          <Input

            v-model="growthStatus.length"
            placeholder="长度"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem>直径
          <Input
            style="width: 150px"
            v-model="growthStatus.diameter"
            placeholder="直径"></Input>
          </FormItem>
        </Col>

        <Col span="7">
          <FormItem label="周边环境">
<!--          <Input-->
<!--            style="padding-right:2px"-->
<!--            v-model="growthStatus.surroundings"-->
<!--            placeholder="周边环境"></Input>-->
            <Select
              :default-label="growthStatus.surroundings"
              v-model="growthStatus.surroundings"
              @on-change="handleGrowthSurroundingsChange">
              <Option v-for="item in growthStatus.surroundingsList"
                      :value="item.value"
                      :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="生长现状">
<!--          <Input-->
<!--            style="padding-right:2px"-->
<!--            v-model="growthStatus.growStatus"-->
<!--            placeholder="生长状态"></Input>-->

            <Select
              :default-label="growthStatus.growStatus"
              v-model="growthStatus.growStatus"
              @on-change="handleGrowthStatusChange">
              <Option v-for="item in growthStatus.growStatusList"
                      :value="item.value"
                      :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>


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
import { mapState } from "vuex";

export default {
  name: 'TreeInspection',
  components: {
    BasicForm
  },
  computed: {
    ...mapState('maintenanceForm', {
      showFlag: state => state.showFlag,
      otherFormData: state => state.otherFormData
    })
  },
  data () {
    return {
      inspection: {
        model: '',
        qualities: ['日常巡查', '施工影响', '物候期巡视'],
        qualitiesStr: ''
      },
      growthPotential: {
        model: '',
        status: ['正常', '衰弱', '濒危'],
        statusStr: ''
      },
      growthStatus: {
        model: [],
        foldingBranches: ['是', '否'], // 折枝
        foldingBranchesInt: 0,
        direction: '',
        length: '',
        diameter: '',
        surroundings: '',
        surroundingsList: ['杂树影响','陡坡','板结','铺装地面'],
        growStatus: '',
        growStatusList: ['无明显变化','好转','呈继续衰弱趋势']
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
      // this.inspection.qualitiesStr = value
      this.inspection.model = value
    },
    handleGrowthPotentialChange (value) {
      // this.growthPotential.statusStr = value
      this.growthPotential.model = value
    },
    handleFoldingBranchesChange (value) {
      this.growthStatus.foldingBranchesInt = value === '是' ? 1 : 0
    },
    handleGrowthSurroundingsChange(value){
      this.growthStatus.surroundings = value
    },
    handleGrowthStatusChange(value){
      this.growthStatus.growStatus = value
    },
    handleBasicConfirm (data) {
      let lengthTemp = parseFloat(this.growthStatus.length)
      let diameterTemp = parseFloat(this.growthStatus.diameter)
      const temp = {
        // project: this.inspection.qualitiesStr,
        project: this.inspection.model,
        // g_vigor: this.growthPotential.statusStr,
        g_vigor: this.growthPotential.model,
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

  created () {
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

    const initializeSurroundings = () => {
      this.growthStatus.surroundingsList = this.growthStatus.surroundingsList.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeSurroundings()

    const initializeGrowStatusList = () => {
      this.growthStatus.growStatusList = this.growthStatus.growStatusList.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeGrowStatusList()

    const initializeFoldingBranches = () => {
      this.growthStatus.foldingBranches = this.growthStatus.foldingBranches.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeFoldingBranches()

    const initializeTypicalData = () => {
      if (this.showFlag) {
        this.inspection.model = this.otherFormData.inspection
        this.growthPotential.model = this.otherFormData.growthPotential
        this.growthStatus.model = this.otherFormData.foldingBranches
        this.growthStatus.direction = this.otherFormData.direction
        this.growthStatus.length = this.otherFormData.length
        this.growthStatus.diameter = this.otherFormData.diameter
        this.growthStatus.surroundings = this.otherFormData.surroundings
        this.growthStatus.growStatus = this.otherFormData.growStatus
        this.constructionImpact = this.otherFormData.constructionImpact
        this.waitingPeriod = this.otherFormData.waitingPeriod
      }
    }
    initializeTypicalData()
  }

}
</script>

<style scoped>

</style>
