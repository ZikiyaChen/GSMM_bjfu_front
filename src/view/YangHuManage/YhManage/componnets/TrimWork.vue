<template>
  <div>
    <basic-form
      :show="showTrimWork"
      @basicCancel="handleBasicCancel">
      <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
         slot="header">
        修剪工作</p>
      <FormItem label="修剪原因" slot="other">
        <Row>
          <Col span="24">
            <Select v-model="reason.modal" filterable multiple>
              <Option v-for="item in reason.projects" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="修剪对象说明" slot="other">
        <Row>
          <Col span="9" style="padding-right:5px">
            <Select v-model="explain.modal"
                    placeholder="请选择或输入方向"
                    filterable
                    allow-create
                    @on-create="handleExplainCreate">
              <Option v-for="item in explain.direction" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="5">
            <Input
              style="padding-right:5px"
              v-model="explain.length"
              placeholder="长度(单位m)"></Input>
          </Col>
          <Col span="5">
            <Input
              style="padding-right:5px"
              v-model="explain.diameter"
              placeholder="直径(单位cm)"></Input>
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
                v-model="protection.modal"
                placeholder="请选择保护方法"
                filterable
                multiple>
          <Option v-for="item in protection.methods" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/layout/BasicForm";
import { getMaintenanceProjects, queryYhOptions } from "@/api/yh_manage";
export default {
  name: 'TrimWork',
  props: {
    showTrimWork: Boolean
  },
  components: {
    BasicForm
  },
  data () {
    return {
      reason: {
        modal: '',
        projects: []
      },
      explain: {
        modal: '',
        direction: [],
        length: '',
        diameter: '',
        quantity: ''
      },
      protection: {
        modal: '',
        methods: []
      }
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('trimCancel')
    },
    handleExplainCreate (value) {
      this.explain.direction.push({
        value: value,
        label: value
      })
    }
  },
  beforeMount () {
    const initializeTrimWorkProjects = () => {
      getMaintenanceProjects('修剪').then(message => {
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
      queryYhOptions().then(message => {
        let classify = message.data.yh_classify
        for (let item of classify) {
          if (item.yh_type === '修剪') {
            this.protection.methods.push({
              label: item.method,
              value: item.method
            })
          }
        }
      })
    }
    initializeProtectionMethods()
  }
}
</script>

<style scoped>

</style>
