<template>
  <div>
    <basic-form
      :show="showTreeProtection"
      @basicCancel="handleBasicCancel">
      <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
         slot="header">
        树体保护措施</p>
      <FormItem label="措施性质" slot="qualityOrType">
        <Row>
          <Col span="24">
            <Select v-model="measureQuality.model">
              <Option v-for="item in measureQuality.content" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="保护措施项目名称" slot="other">
        <Row>
          <Col span="24">
            <Select v-model="protectionMeasure.model" multiple>
              <Option v-for="item in protectionMeasure.projects" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="处理方法" slot="other">
        <Row>
          <Col span="24">
            <Select v-model="handleMethod.model" multiple>
              <Option v-for="item in handleMethod.methods" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/layout/BasicForm";
import { getMaintenanceProjects, queryYhOptions } from "@/api/yh_manage";

export default {
  name: 'TreeProtection',
  props: {
    showTreeProtection: Boolean
  },
  components: {
    BasicForm
  },
  data () {
    return {
      // protectionJudge: {
      //   judge: false,
      //   quality: '措施性质'
      // },
      measureQuality: {
        modal: '',
        content: ['日常维护', '单项工程'],
        selected: false
      },
      protectionMeasure: {
        model: '',
        projects: []
      },
      handleMethod: {
        model: '',
        methods: []
      }
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('treeProtectionCancel')
    },
    // MeasureQualitySelected () {
    //   this.protectionJudge.judge = true
    // },
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
