<template>
  <component
    :is="componentName"
    @cancelOrConfirm="handleCancelOrConfirm">
  </component>
</template>

<script>
import DailyMaintenance from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/DailyMaintenance";
import EnvironmentProtection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/EnvironmentProtection";
import PestControl from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/PestControl";
import TreeInspection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TreeInspection";
import TreeProtection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TreeProtection";
import TrimWork from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TrimWork";
import {getCurrentWeather, insertRecordByTypeAssignment} from "@/api/yh_manage";
import { mapMutations } from "vuex";

export default {
  name: 'TaskInsert',
  components: {
    DailyMaintenance,
    EnvironmentProtection,
    PestControl,
    TreeInspection,
    TreeProtection,
    TrimWork
  },
  props: {
    content: Object
  },
  data(){
    return {
      componentName: ''
    }
  },
  methods:{
    ...mapMutations('maintenanceForm', {
      changeShowFlag: 'changeShowFlag',
      changeBasicFormData:'changeBasicFormData'
    }),
    handleCancelOrConfirm (type, result) {
      if (type === 'cancel') {
        this.$emit('insertCancel')
      } else if (type === 'confirm') {
        result.state = '已完成'
        const tempArray = new Array(result.tree_code)
        delete result.tree_code
        result.trees = tempArray
        insertRecordByTypeAssignment(this.content.type, this.content.allotOrder, result).then(message => {
          if(message.data.code === 200) {

            this.$Message.success('提交成功')

          }else {
            this.$Message.error('提交失败')
          }
          this.$emit('insertConfirm')
        })
      }
    },
  },
  created () {
    const switchComponent = () => {
      const updateEnglishName = (newName) => {
        this.componentName = newName
      }
      switch (this.content.type) {
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
    const initialMaintenanceForm = () => {
      getCurrentWeather('北京').then(message => {
        let weatherInfo = {}
        let weatherInfoStr = ''
        weatherInfo.city = message.data.city
        weatherInfo.wea = message.data.wea
        weatherInfo.tem = message.data.tem
        weatherInfo.tem1 = message.data.tem1
        weatherInfo.tem2 = message.data.tem2
        weatherInfo.humidity = message.data.humidity
        weatherInfo.win = message.data.win
        weatherInfo.win_speed = message.data.win_speed
        weatherInfo.air_level = message.data.air_level
        weatherInfo.alarm_type = message.data.alarm.alarm_type === '' ? '无预警' : message.data.alarm.alarm_type
        weatherInfo.alarm_level = message.data.alarm.alarm_level === '' ? '无预警等级' : message.data.alarm.alarm_level
        weatherInfoStr = `当前城市：${weatherInfo.city}，天气情况：${weatherInfo.wea}，温度：${weatherInfo.tem}，最高温度：${weatherInfo.tem1}，最低温度：${weatherInfo.tem2}，湿度：${weatherInfo.humidity}，风力：${weatherInfo.win_speed}，空气质量：${weatherInfo.air_level}，预警：${weatherInfo.alarm_type}`

        let dateInfo = new Date()
        let dateStr = `${dateInfo.getFullYear()}-${dateInfo.getMonth() + 1}-${dateInfo.getDate()}`
        const basicFormData = {
          weatherInfo: weatherInfo,
          weatherInfoStr: weatherInfoStr,
          userName: this.content.userName,
          registerName: this.content.registerName,
          date: dateStr,
          treeNumber: this.content.treeNumber
        }
        this.changeShowFlag()
        this.changeBasicFormData(basicFormData)

        switchComponent()
      })
    }
    initialMaintenanceForm()

  },
  destroyed () {
    this.changeShowFlag()
  }

}
</script>

<style scoped>

</style>
