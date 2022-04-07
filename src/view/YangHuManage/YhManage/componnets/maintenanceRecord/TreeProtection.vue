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
              <Select
                :default-label="measureQuality.model"
                v-model="measureQuality.model"
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
            <Select
              multiple
              v-model="protectionMeasure.model"
              :default-label="protectionMeasure.model"
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
            <Select
              multiple
              :max-tag-count="8"
              v-model="handleMethod.model"
              :default-label="handleMethod.model"
              @on-change="handleMethodChange">
              <OptionGroup v-for="project in handleMethod.projects" :label="project" :key="project">
              <Option v-for="item in handleMethod.methods[project]"
                      :value="item.id"
                      :key="item.id">
                {{item.method }} ({{ project}})
              </Option>
              </OptionGroup>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/layout/BasicForm";
import {getUnitMaintenanceProjects, queryUnitYhMethods, queryYhOptions} from "@/api/yh_manage";
import { mapState } from "vuex";
import UserMixin from "@/mixin/UserMixin";

export default {
  name: 'TreeProtection',
  mixins: [UserMixin],
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

      measureQuality: {
        model: '',
        content: ['日常维护', '单项工程'],
        contentStr: ''
      },
      protectionMeasure: {
        model: [],
        projects: [],
        projectsStr: ''
      },
      handleMethod: {
        model: [],
        methods: {},
        methodsStr: '',
        projects: []
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
      console.log(option)
      if(option.length !== 0) {
        queryUnitYhMethods({yh_type: '树体保护措施', projects: option, unit: this.unit}).then(res => {
          this.handleMethod.methods = res.data.methods
          this.handleMethod.projects = res.data.projects
        })
      }
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
      console.log()
      const result = Object.assign({}, temp, data)
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

    const initializeProtectionMeasureProjects = () => {
      getUnitMaintenanceProjects({yh_type:'树体保护措施',unit:this.unit}).then(message => {
        for (let item of message.data.projects) {
          this.protectionMeasure.projects.push({
            label: item.project,
            value: item.project
          })
        }
      })
    }
    initializeProtectionMeasureProjects()

    // const initializeHandleMethod = () => {
    //   queryYhOptions().then(message => {
    //     let classify = message.data.yh_classify
    //     for (let item of classify) {
    //       if (item.yh_type === '树体保护措施') {
    //         this.handleMethod.methods.push({
    //           label: item.method,
    //           value: item.method
    //         })
    //       }
    //     }
    //   })
    // }
    // initializeHandleMethod()

    const initializeHandleMethod = () => {
      console.log('@',this.otherFormData.projects)
      console.log('#',this.otherFormData)
      if(this.otherFormData.projects !== undefined) {
        queryUnitYhMethods({yh_type: '树体保护措施', projects: this.otherFormData.projects,
          unit: this.unit}).then(message => {
          this.handleMethod.methods = message.data.methods
          this.handleMethod.projects = message.data.projects

          // let classify = message.data.yh_classify
          // for (let item of classify) {
          //   if (item.yh_type === '树体保护措施') {
          //     this.handleMethod.methods.push({
          //       label: item.method,
          //       value: item.method
          //     })
          //   }
          // }
        })
      }
    }
    initializeHandleMethod()




    const initializeTypicalData = () => {
      if (this.showFlag) {
        this.measureQuality.model = this.otherFormData.contentStr
        this.protectionMeasure.model = this.otherFormData.projects
        this.handleMethod.model = this.otherFormData.methods
      }
    }
    initializeTypicalData()
  }
}

</script>

<style scoped>

</style>
