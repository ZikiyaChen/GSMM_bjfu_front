<template>
  <div>
    <basic-form
      :show="true"
      @basicConfirm="handleBasicConfirm"
      @basicCancel="handleBasicCancel">
      <template v-slot:header>
        <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px">
          树体保护措施</p>
      </template>
      <template  v-slot:qualityOrType>
        <FormItem label="措施性质">
          <Row>
            <Col span="24">
              <Select v-model="measureQuality.model"
                      @on-change="handleMeasureQualityChange">
                <Option v-for="item in measureQuality.content"
                        :value="item.value"
                        :key="item.value">
                  {{ item.label }}
                </Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
      </template>

      <FormItem label="保护措施项目名称" slot="other">
        <Row>
          <Col span="24">
            <Select v-model="protectionMeasure.model"
                    multiple
                    @on-change="handleProtectionMeasureChange">
              <Option v-for="item in protectionMeasure.projects"
                      :value="item.value"
                      :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="处理方法" slot="other">
        <Row>
          <Col span="24">
            <Select v-model="handleMethod.model"
                    multiple
                    @on-change="handleMethodChange">
              <Option v-for="item in handleMethod.methods"
                      :value="item.value"
                      :key="item.value">
                {{ item.label }}
              </Option>
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

export default {
  name: 'TreeProtection',
  components: {
    BasicForm
  },
  data () {
    return {
      measureQuality: {
        modal: '',
        content: ['日常维护', '单项工程'],
        contentStr: ''
      },
      protectionMeasure: {
        model: '',
        projects: [],
        projectsStr: ''
      },
      handleMethod: {
        model: '',
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
    handleProtectionMeasureChange (option) {
      this.protectionMeasure.projectsStr = option.join(',')
    },
    handleMethodChange (option) {
      this.handleMethod.methodsStr = option.join(',')
    },
    handleBasicConfirm (data) {
      const temp = {
        property: this.measureQuality.contentStr,
        project: this.protectionMeasure.projectsStr,
        method: this.handleMethod.methodsStr
      }
      const result = Object.assign({}, temp, data)
      this.$emit('cancelOrConfirm', 'confirm', result)
    }

  },
  beforeMount () {
    const initializeMeasureQuality = () => {
      this.measureQuality.content = this.measureQuality.content.map(item => {
        return {
          value: item,
          label: item
        }
      })
    }
    initializeMeasureQuality()

    const initializeProtectionMeasureProjects = () => {
      getMaintenanceProjects('树体保护措施').then(message => {
        for (let item of message.data.projects) {
          this.protectionMeasure.projects.push({
            label: item.project,
            value: item.project
          })
        }
      })
    }
    initializeProtectionMeasureProjects()

    const initializeHandleMethod = () => {
      queryYhOptions().then(message => {
        let classify = message.data.yh_classify
        for (let item of classify) {
          if (item.yh_type === '树体保护措施') {
            this.handleMethod.methods.push({
              label: item.method,
              value: item.method
            })
          }
        }
      })
    }
    initializeHandleMethod()
  }
}

</script>

<style scoped>

</style>
