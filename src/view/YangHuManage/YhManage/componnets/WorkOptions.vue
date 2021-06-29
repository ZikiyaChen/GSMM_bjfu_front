<template>
  <Modal
    width="44"
    :value="show"
    title="日常养护管理"
    @on-ok="handleConfirm"
    @on-cancel="handleCancel">
    <Form :model="maintenanceInfo" :label-width="80">

      <Row type="flex" align="middle" justify="center" class="code-row-bg">
        <Col span="24">
          <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px">日常养护管理工作</p>
        </Col>
      </Row>

      <FormItem label="天气">
        <Input readonly v-model="weatherInfo"></Input>
      </FormItem>

      <FormItem label="日期" prop="date">
        <Input v-model="maintenanceInfo.date"></Input>
      </FormItem>

      <FormItem label="登记人" prop="registerName">
        <Input v-model="maintenanceInfo.registerName"></Input>
      </FormItem>

      <FormItem label="古树树号" prop="treeNumber">
        <Input v-model="maintenanceInfo.treeNumber"></Input>
      </FormItem>

      <FormItem label="树种" prop="treeNumber">

        <Dropdown style="margin-left: 20px">
          <Button type="primary">
            下拉菜单
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="油松">油松</DropdownItem>

          </DropdownMenu>
        </Dropdown>

<!--        <Input v-model="maintenanceInfo.treeSpecies"></Input>-->
      </FormItem>

    </Form>
  </Modal>
</template>

<script>
import { getCurrentWeather } from "@/api/yh_manage";

export default {
  name: 'WorkOptions',
  props: {
    show: Boolean
  },
  data () {
    return {
      weatherInfo: '',
      maintenanceInfo: {
        date: '',
        registerName: '',
        treeNumber: '',
        treeSpecies: ''
      }
    }
  },
  methods: {
    handleConfirm () {

    },
    handleCancel () {
      this.$emit('cancel')
    }
  },
  beforeMount () {
    getCurrentWeather('北京').then(message => {
      let cityName = message.data.city
      let weather = message.data.wea
      let temperature = message.data.tem
      let humidity = message.data.humidity
      let windSpeed = message.data.win_speed
      let airQuality = message.data.air_level
      let alarmType = message.data.alarm.alarm_type === '' ? '无预警' : message.data.alarm.alarm_type

      this.weatherInfo = `当前城市：${cityName}，天气情况：${weather}，温度：${temperature}，湿度：${humidity}，风力：${windSpeed}，空气质量：${airQuality}，预警：${alarmType}`
    })

    let dateInfo = new Date()
    this.maintenanceInfo.date = `${dateInfo.getFullYear()}年${dateInfo.getMonth() + 1}月${dateInfo.getDay()}日`
  }

}
</script>

<style scoped>

</style>
