<template>
  <div>
    <component
      :is="componentName"
      @cancelOrConfirm="handleCancelOrConfirm">
    </component>
  </div>

</template>

<script>
import DailyMaintenance from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/DailyMaintenance";
import EnvironmentProtection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/EnvironmentProtection";
import PestControl from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/PestControl";
import TreeInspection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TreeInspection";
import TreeProtection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TreeProtection";
import TrimWork from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TrimWork";
import { mapState, mapMutations } from "vuex";
import { getSpecificRecord, updateSpecificRecord } from "@/api/yh_manage";

export default {
  name: 'DisplayUpdateRecord',
  props: {
    id: Number,
    recordType: String,
    maintenanceId: Number
  },
  components: {
    DailyMaintenance,
    EnvironmentProtection,
    PestControl,
    TreeInspection,
    TreeProtection,
    TrimWork
  },
  computed: {
    ...mapState('maintenanceForm', ['basicFormData'])
  },
  data () {
    return {
      componentName: ''
    }
  },
  methods: {
    handleCancelOrConfirm (type, result) {
      if (type === 'cancel') {
        this.$emit('recordCancel')
      } else if (type === 'confirm') {
        result.state = '已完成'
        updateSpecificRecord(this.id, result).then(message => {
          console.log(message)
          if(message.data.code === 200){
            this.$Message.success('修改成功')
          }else {
            this.$Message.error('修改失败')
          }
          this.$emit('recordConfirm')
        })
      }
    },
    ...mapMutations('maintenanceForm', ['changeBasicFormData', 'changeShowFlag', 'changeOtherFormData'])
  },
  created () {
    const switchComponent = () => {
      const updateEnglishName = (newName) => {
        this.componentName = newName
      }
      switch (this.recordType) {
        case '日常养护管理':
          updateEnglishName('DailyMaintenance')
          break;
        case '修剪':
          updateEnglishName('TrimWork')
          break;
        case '树体保护措施':
          updateEnglishName('TreeProtection')
          break;
        case '生长环境保护与改善':
          updateEnglishName('EnvironmentProtection')
          break;
        case '病虫害防治':
          updateEnglishName('PestControl')
          break;
        case '巡查工作':
          updateEnglishName('TreeInspection')
          break;
        default:
          updateEnglishName('')
          break;
      }
    }

    const initializeFormData = () => {
      getSpecificRecord(this.recordType, this.maintenanceId).then(message => {
        let specificRecord = message.data.specific_record
        let tempWeatherInfoStr = `当前城市：北京，天气情况：${specificRecord.wea}，温度：${specificRecord.tem}，最高温度：${specificRecord.tem1}，最低温度：${specificRecord.tem2}，湿度：${specificRecord.humidity}，风力：${specificRecord.win_speed}，空气质量：${specificRecord.air_level}，预警：${specificRecord.alarm_type}`
        let tempWeatherInfo = {
          // city: specificRecord.growth_place,
          wea: specificRecord.wea,
          tem: specificRecord.tem,
          tem1: specificRecord.tem1,
          tem2: specificRecord.tem2,
          humidity: specificRecord.humidity,
          win: specificRecord.win,
          win_speed: specificRecord.win_speed,
          air_level: specificRecord.air_level,
          alarm_type: specificRecord.alarm_type,
          alarm_level: specificRecord.alarm_level,
        }
        let basicFormData = {
          weatherInfo: tempWeatherInfo,
          weatherInfoStr: tempWeatherInfoStr,
          date: specificRecord.actual_time,
          userName: specificRecord.yh_username,
          registerName: specificRecord.yh_user.name,
          treeNumber: specificRecord.tree_code,
          treeSpeciesInfo: specificRecord.tree.zw_name,
          location: specificRecord.growth_place,
          note: specificRecord.note
        }
        let otherFormData = {}
        switch (this.recordType) {
          case '日常养护管理':
            otherFormData.project = specificRecord.project
            break;
          case '修剪':
            otherFormData.reasons = specificRecord.project.split(',')
            otherFormData.methods = specificRecord.method.split(',')
            otherFormData.direction = specificRecord.orientation
            otherFormData.diameter = specificRecord.diameter
            otherFormData.length = specificRecord.length
            otherFormData.quantity = specificRecord.num
            break;
          case '树体保护措施':
            otherFormData.contentStr = specificRecord.property
            otherFormData.projects = specificRecord.project.split(',')
            otherFormData.methods = specificRecord.method.split(',')
            break;
          case '生长环境保护与改善':
            otherFormData.contentStr = specificRecord.property
            otherFormData.projects = specificRecord.project.split(',')
            otherFormData.methods = specificRecord.method.split(',')
            break;
          case '病虫害防治':
            otherFormData.contentType = specificRecord.project.split(',')
            otherFormData.methods = specificRecord.method.split(',')
            otherFormData.potionConcentration = specificRecord.concentration
            otherFormData.releasedCreaturesQuantity = specificRecord["bio_num "]
            otherFormData.trapper = specificRecord.trap_name.split(',')
            otherFormData.pestName = specificRecord.pest_name.split(',')
            otherFormData.effects = specificRecord.efficiency
            break;
          case '巡查工作':
            otherFormData.inspection = specificRecord.project
            otherFormData.growthPotential = specificRecord.g_vigor
            otherFormData.foldingBranches = specificRecord.is_massage ? ['是'] : ['否']
            otherFormData.direction = specificRecord.direction
            otherFormData.length = specificRecord.length // float类型的
            otherFormData.diameter = specificRecord.diameter // float类型的
            otherFormData.surroundings = specificRecord.surroundings
            otherFormData.growStatus = specificRecord.grow_status
            otherFormData.constructionImpact = specificRecord.impact_describe
            otherFormData.waitingPeriod = specificRecord.phenological_describe
            break;
          default:
            break;
        }
        this.changeShowFlag()
        this.changeBasicFormData(basicFormData)
        this.changeOtherFormData(otherFormData)
        switchComponent()
      }).catch(error => {
        this.handleCancelOrConfirm()
        console.log(error)
      })
    }
    initializeFormData()
  },

  destroyed () {
    this.changeShowFlag()
  }
}

</script>

<style scoped>

</style>
