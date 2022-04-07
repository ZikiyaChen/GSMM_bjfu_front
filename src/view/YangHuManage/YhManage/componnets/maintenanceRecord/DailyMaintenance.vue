<template>
  <div>
    <basic-form
      :show="true"
      @basicConfirm="handleBasicConfirm"
      @basicCancel="handleBasicCancel">
      <template v-slot:header>
        <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px">
          日常养护管理工作
        </p>
      </template>

      <template v-slot:other>
        <FormItem label="养护管理项目名称">
          <Row>
            <Col span="24">
              <Select
                v-model="model"
                multiple
                :default-label="model"
                @on-set-default-options="setDefaultOptions"
                @on-change="handleProjectsChange">
                <Option v-for="item in projects" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
      </template>
    </basic-form>
  </div>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/layout/BasicForm";
import { getUnitMaintenanceProjects } from "@/api/yh_manage";
import { mapState } from 'vuex'
import UserMixin from "@/mixin/UserMixin";

export default {
  name: 'DailyMaintenance',
  mixins: [UserMixin],
  components: {
    BasicForm
  },
  computed: {
    ...mapState('maintenanceForm', {
      dailyMaintenanceData: state => state.otherFormData,
      showFlag: state => state.showFlag
    }),
  },
  data () {
    return {
      model: [],
      projects: [],
      projectsStr: ''
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('cancelOrConfirm', 'cancel', null)
    },
    handleBasicConfirm (data) {
      const temp = {
        project: this.projectsStr,
      }
      let result = Object.assign({}, temp, data)
      console.log(result)
      this.$emit('cancelOrConfirm', 'confirm', result)
    },
    handleProjectsChange (options) {
      this.projectsStr = options.join(',')
    },
    setDefaultOptions (options) {
      this.projects = options
    }
  },
  created () {
    const initializeDailyMaintenanceProjects = () => {
      if (this.showFlag) {
        this.model = this.dailyMaintenanceData.project
      }

      getUnitMaintenanceProjects({yh_type:'日常养护管理',unit:this.unit}).then(message => {
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
