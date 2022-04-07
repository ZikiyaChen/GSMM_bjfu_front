<template>
  <div>
    <basic-form
      :show="true"
      @basicConfirm="handleBasicConfirm"
      @basicCancel="handleBasicCancel">
      <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
         slot="header">
        修剪工作</p>
      <FormItem label="修剪原因" slot="other">
        <Row>
          <Col span="24">
            <Select
              filterable
              multiple
              v-model="reason.modal"
              :default-label="reason.modal"
              @on-change="handleReasonChange">
              <Option v-for="item in reason.projects" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="修剪对象说明" slot="other">
        <Row>
          <Col span="9" style="padding-right:5px">
            <Select v-model="explain.modal"
                    filterable
                    allow-create
                    placeholder="请选择或输入方向"
                    :default-label="explain.modal"
                    @on-change="handleDirectionChange"
                    @on-create="handleExplainCreate">
              <Option v-for="item in explain.direction" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="5">
            <Input
              style="padding-right:5px"
              v-model="explain.length"
              placeholder="长度(m)"></Input>
          </Col>
          <Col span="5">
            <Input
              style="padding-right:5px"
              v-model="explain.diameter"
              placeholder="直径(cm)"></Input>
          </Col>
          <Col span="5">
            <Input
              style="padding-right:5px"
              v-model="explain.quantity"
              placeholder="数量"></Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="保护方法" slot="other">
        <Select
          filterable
          multiple
          v-model="protection.modal"
          placeholder="请选择保护方法"
          :deault-label="protection.modal"
          @on-change="handleProtectionChange">
          <OptionGroup v-for="project in protection.projects" :label="project" :key="project">
          <Option v-for="item in protection.methods[project]" :value="item.id" :key="item.id">{{ item.method }}</Option>
          </OptionGroup>
        </Select>
      </FormItem>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/layout/BasicForm";
import { getUnitMaintenanceProjects, queryUnitYhMethods } from "@/api/yh_manage";
import { mapState } from "vuex";
import UserMixin from "@/mixin/UserMixin";

export default {
  name: 'TrimWork',
  mixins: [UserMixin],
  components: {
    BasicForm
  },
  computed: {
    ...mapState('maintenanceForm', {
      otherFormData: state => state.otherFormData,
      showFlag: state => state.showFlag
    })
  },
  data () {
    return {
      reason: {
        modal: [],
        projects: [],
        projectsStr: ''
      },
      explain: {
        modal: [],
        direction: [],
        directionStr: '',
        length: '',
        diameter: '',
        quantity: ''
      },
      protection: {
        modal: [],
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
    handleExplainCreate (value) {
      this.explain.direction.push({
        value: value,
        label: value
      })
      this.explain.directionStr = value
    },
    handleReasonChange (option) {
      console.log(option)
      if(option.length !== 0) {
        queryUnitYhMethods({yh_type: '修剪', projects: option, unit: this.unit}).then(res => {
          this.protection.methods = res.data.methods
          this.protection.projects = res.data.projects
        })
      }
      this.reason.projectsStr = option.join(',')
    },
    handleDirectionChange (option) {
      this.explain.directionStr = option
    },
    handleProtectionChange (option) {
      this.protection.methodsStr = option.join(',')
    },
    handleBasicConfirm (data) {
      const temp = {
        project: this.reason.projectsStr,
        orientation: this.explain.directionStr,
        diameter: this.explain.diameter,
        length: this.explain.length,
        num: this.explain.quantity,
        method: this.protection.methodsStr
      }
      const result = Object.assign({}, temp, data)
      this.$emit('cancelOrConfirm', 'confirm', result)
    }
  },
  created () {
    const initializeTrimWorkProjects = () => {
      getUnitMaintenanceProjects({yh_type:'修剪',unit: this.unit}).then(message => {
        for (let item of message.data.projects) {
          this.reason.projects.push(item.project)
        }
        this.reason.projects = this.reason.projects.map(item => {
          return {
            label: item,
            value: item
          }
        })
      })
    }
    initializeTrimWorkProjects()

    const initializeExplainDirection = () => {
      let direction = '东，南，西，北，东南，东北，西南，西北'
      this.explain.direction = direction.split('，')
      this.explain.direction = this.explain.direction.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeExplainDirection()

    const initializeProtectionMethods = () => {
      queryUnitYhMethods({yh_type:'修剪',projects: this.otherFormData.reasons, unit: this.unit}).then(message => {
        this.protection.methods = message.data.methods
        this.protection.projects = message.data.projects
        // let classify = message.data.yh_classify
        // for (let item of classify) {
        //   if (item.yh_type === '修剪') {
        //     this.protection.methods.push({
        //       label: item.method,
        //       value: item.method
        //     })
        //   }
        // }
      })
    }
    initializeProtectionMethods()

    const initializeTypicalData = () => {
      if (this.showFlag) {
        this.reason.modal = this.otherFormData.reasons
        this.explain.modal = this.otherFormData.direction
        this.explain.length = this.otherFormData.length
        this.protection.modal = this.otherFormData.methods
        this.explain.diameter = this.otherFormData.diameter
        this.explain.quantity = this.otherFormData.quantity
      }
    }
    initializeTypicalData()
  }
}
</script>

<style scoped>

</style>
