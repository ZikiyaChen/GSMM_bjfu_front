<template>
  <div>
    <basic-form
      :show="showDailyMaintenance"
      @basicCancel="handleBasicCancel">
      <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
         slot="header">
        日常养护管理工作</p>
      <FormItem label="养护管理项目名称" slot="other">
        <Row>
          <Col span="24">
            <Select v-model="model" multiple>
              <Option v-for="item in projects" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/layout/BasicForm";
import { getMaintenanceProjects } from "@/api/yh_manage";

export default {
  name: 'DailyMaintenance',
  props: {
    showDailyMaintenance: Boolean
  },
  components: {
    BasicForm
  },
  data () {
    return {
      model: '',
      projects: []
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('dailyCancel')
    }
  },
  beforeMount () {
    const initializeDailyMaintenanceProjects = () => {
      getMaintenanceProjects('日常养护管理').then(message => {
        for (let item of message.data.projects) {
          this.projects.push(item.project)
        }
        this.projects = this.projects.map(item => {
          return {
            label: item,
            value: item
          }
        })
      })
    }
    initializeDailyMaintenanceProjects()
  }

}
</script>

<style scoped>

</style>
