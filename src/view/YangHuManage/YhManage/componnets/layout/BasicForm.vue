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
          <slot name="header"></slot>
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
      <!--
          性质或类型的插槽
      -->
      <slot name="qualityOrType"></slot>

      <FormItem label="古树树号" prop="treeNumber">
        <Row>
          <Col span="4">
            <Input v-model="treeNumber.prefix" style="text-align: center" disabled></Input>
          </Col>
          <Col span="20">
            <Select
              v-model="treeNumber.model"
              multiple
              filterable
              @on-change="treeNumberOptionChange"
              :remote-method="treeNumberRemoteMethod"
              :loading="treeNumber.loading">
              <Option v-for="(option, index) in treeNumber.options" :value="option.value" :key="index">
                {{ option.label }}
              </Option>
            </Select>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="树种">
        <Input readonly v-model="treeSpeciesInfo"></Input>
      </FormItem>

      <FormItem label="生长地点">
        <Input v-model="maintenanceInfo.location"></Input>
      </FormItem>

      <!--
          其他选项的插槽
      -->
      <slot name="other"></slot>

      <FormItem label="备注">
        <Input v-model="maintenanceInfo.note"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { getCurrentWeather } from "@/api/yh_manage";
import { queryTreeBasicProperty } from "@/api/table";

export default {
  name: 'BasicForm',
  props: {
    show: Boolean
  },
  data () {
    return {
      weatherInfo: '',
      treesBasicProperty: [],

      treeNumber: {
        model: '',
        loading: false,
        list: [],
        options: [],
        prefix: '110131'
      },

      treeSpeciesInfo: '',

      maintenanceInfo: {
        date: '',
        registerName: '',
        location: '',
        note: ''
      }
    }
  },
  methods: {
    treeNumberRemoteMethod (query) {
      if (query !== '') {
        this.treeNumber.loading = true
        setTimeout(() => {
          this.treeNumber.loading = false
          const list = this.treeNumber.list.map(item => {
            return {
              value: item,
              label: item
            }
          })
          this.treeNumber.options = list.filter(item => item.label.indexOf(query) > -1)
        }, 200)
      } else {
        this.treeNumber.options = []
      }
    },

    treeNumberOptionChange (option) {
      let treeSpeciesArray = []
      for (let item of option) {
        for (let property of this.treesBasicProperty) {
          if (property.tree_code.indexOf(item) > -1) {
            treeSpeciesArray.push(property.zw_name)
          }
        }
      }
      this.treeSpeciesInfo = treeSpeciesArray.join(', ')
    },

    handleConfirm () {

    },
    handleCancel () {
      this.$emit('basicCancel')
    }
  },
  beforeMount () {
    const initializeWeatherInfo = () => {
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
    }
    initializeWeatherInfo()

    const initializeDateInfo = () => {
      let dateInfo = new Date()
      this.maintenanceInfo.date = `${dateInfo.getFullYear()}年${dateInfo.getMonth() + 1}月${dateInfo.getDate()}日`
    }
    initializeDateInfo()

    const initializeTreeNumberList = () => {
      queryTreeBasicProperty().then(message => {
        this.treesBasicProperty = message.data.trees_basic_property
        this.treeNumber.list = this.treesBasicProperty.map((item) => {
          return item.tree_code.substr(6)
        })
      })
    }
    initializeTreeNumberList()
  }

}
</script>

<style scoped>

</style>
