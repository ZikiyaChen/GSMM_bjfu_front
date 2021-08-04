<template>
  <div>
    <basic-form
      :show="show"
      @basicConfirm="handleBasicConfirm"
      @basicCancel="handleBasicCancel">
      <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
         slot="header">
        生长环境保护与改善</p>
      <FormItem label="措施性质" slot="qualityOrType">
        <Row>
          <Col span="24">
            <Select
              :default-label="measureQuality.model"
              v-model="measureQuality.model">
              <Option v-for="item in measureQuality.content" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="生境保护与改善项目名称" slot="other">
        <Row>
          <Col span="24">
            <Select
              multiple
              :default-label="projectName.model"
              v-model="projectName.model"
              @on-change="handleProjectNameChange">
              <Option v-for="item in projectName.projects" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="处理方法" slot="other">
        <Row>
          <Col span="24">
            <Select
              multiple
              :default-label="handleMethod.model"
              v-model="handleMethod.model"
              @on-change="handleMethodChange">
              <Option v-for="item in handleMethod.methods" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/layout/BasicForm";
import { getMaintenanceProjects, queryYhOptions } from "@/api/yh_manage";
import { mapState } from "vuex";

export default {
  name: 'EnvironmentProtection',
  components: { BasicForm },
  computed: {
    ...mapState('maintenanceForm', {
      showFlag: state => state.showFlag,
      otherFormData: state => state.otherFormData
    })
  },
  data () {
    return {
      show: true,
      measureQuality: {
        model: '',
        content: ['日常维护', '单项工程'],
        contentStr: ''
      },
      projectName: {
        model: [],
        projects: [],
        projectsStr: ''
      },
      handleMethod: {
        model: [],
        methods: [],
        methodsStr: ''
      }
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('cancelOrConfirm', 'cancel', null)
    },
    handleMeasureQualityChange (value) {
      this.measureQuality.contentStr = value
    },
    handleProjectNameChange (option) {
      this.projectName.projectsStr = option.join(',')
    },
    handleMethodChange (option) {
      this.handleMethod.methodsStr = option.join(',')
    },
    handleBasicConfirm (data) {
      const temp = {
        property: this.measureQuality.contentStr,
        project: this.projectName.projectsStr,
        method: this.handleMethod.methodsStr
      }
      let result = Object.assign({}, temp, data)
      this.$emit('cancelOrConfirm', 'confirm', result)
    }
  },
  created () {
    const initializeMeasureQuality = () => {
      this.measureQuality.content = this.measureQuality.content.map(item => {
        return {
          value: item,
          label: item
        }
      })
    }
    initializeMeasureQuality()

    const initializeProjectName = () => {
      getMaintenanceProjects('生长环境保护与改善').then(message => {
        for (let item of message.data.projects) {
          this.projectName.projects.push({
            label: item.project,
            value: item.project
          })
        }
      })
    }
    initializeProjectName()

    const initializeHandleMethod = () => {
      queryYhOptions().then(message => {
        let classify = message.data.yh_classify
        for (let item of classify) {
          if (item.yh_type === '生长环境保护与改善') {
            this.handleMethod.methods.push({
              label: item.method,
              value: item.method
            })
          }
        }
      })
    }
    initializeHandleMethod()

    const initializeTypicalData = () => {
      if (this.showFlag) {
        this.measureQuality.model = this.otherFormData.contentStr
        this.projectName.model = this.otherFormData.projects
        this.handleMethod.model = this.otherFormData.methods
      }
    }
    initializeTypicalData()
  }

}
</script>

<style scoped>

</style>
