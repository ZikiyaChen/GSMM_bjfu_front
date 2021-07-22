<template>
  <div>
    <Modal
      width="44"
      :value="show"
      :loading="loading"
      @on-ok="handleConfirm"
      @on-cancel="handleCancel">
      <Form :model="maintenanceInfo" :label-width="80">

        <Row type="flex" align="middle" justify="center" class="code-row-bg">
          <Col span="24">
            <slot name="header"></slot>
          </Col>
        </Row>

        <FormItem label="天气" prop="weatherInfo">
          <Input readonly v-model="maintenanceInfo.weatherInfo"></Input>
        </FormItem>

        <FormItem label="日期" prop="date">
          <Row>
            <Col span="24">
              <DatePicker
                ref="datePicker"
                :value="maintenanceInfo.date"
                format="yyyy年MM月dd日"
                type="date"
                placeholder="请输入日期">
              </DatePicker>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="登记人" prop="registerName">
          <Input ref="registerInput" readonly v-model="maintenanceInfo.registerName"></Input>
        </FormItem>
        <!--
            性质或类型的插槽
        -->
        <slot name="qualityOrType"></slot>

        <FormItem label="古树树号" prop="treeNumber">
          <Row>
            <Col span="4">
              <Input v-model="maintenanceInfo.treeNumber.prefix" style="text-align: center" disabled></Input>
            </Col>
            <Col span="20">
              <Select
                v-model="maintenanceInfo.treeNumber.model"
                multiple
                filterable
                @on-change="treeNumberOptionChange"
                :remote-method="treeNumberRemoteMethod"
                :loading="maintenanceInfo.treeNumber.loading">
                <Option v-for="(option, index) in maintenanceInfo.treeNumber.options"
                        :value="option.value"
                        :key="index">
                  {{ option.label }}
                </Option>
              </Select>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="树种" prop="treeSpecies">
          <Input readonly v-model="maintenanceInfo.treeSpeciesInfo"></Input>
        </FormItem>

        <slot name="other1"></slot>

        <FormItem label="生长地点" prop="location">
          <Input v-model="maintenanceInfo.location"></Input>
        </FormItem>

        <!--
            其他选项的插槽
        -->
        <slot name="other"></slot>

        <FormItem label="备注" prop="note">
          <Input v-model="maintenanceInfo.note"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>

</template>

<script>
import { getCurrentWeather } from "@/api/yh_manage";
import { queryTreeBasicProperty } from "@/api/table";
import { getUserInfo } from "@/api/user";
import { mapState } from "vuex";

export default {
  name: 'BasicForm',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('maintenanceForm', {
      loading: state => state.loading,
    })
  },
  data () {
    return {
      treesCode: [],
      weatherInfo: {
        city: '',
        wea: '',
        tem: '',
        tem1: '',
        tem2: '',
        humidity: '',
        win: '',
        win_speed: '',
        air_level: '',
        alarm_type: '',
        alarm_level: ''
      },
      treesBasicProperty: [],
      maintenanceInfo: {
        weatherInfo: '',
        date: '',
        registerName: '',
        userName: '',
        location: '',
        note: '',
        treeSpeciesInfo: '',
        treeNumber: {
          model: '',
          loading: false,
          list: [],
          options: [],
          prefix: '110131'
        },
      },
    }
  },

  methods: {
    treeNumberRemoteMethod (query) {
      if (query !== '') {
        this.maintenanceInfo.treeNumber.loading = true
        setTimeout(() => {
          this.maintenanceInfo.treeNumber.loading = false
          const list = this.maintenanceInfo.treeNumber.list.map(item => {
            return {
              value: item,
              label: item
            }
          })
          this.maintenanceInfo.treeNumber.options = list.filter(item => item.label.indexOf(query) > -1)
        }, 200)
      } else {
        this.maintenanceInfo.treeNumber.options = []
      }
    },

    treeNumberOptionChange (options) {
      let treeSpeciesArray = []
      this.treesCode.length = 0
      for (let item of options) {
        for (let property of this.treesBasicProperty) {
          if (property.tree_code.indexOf(item) > -1) {
            treeSpeciesArray.push(property.zw_name)
            this.treesCode.push(property.tree_code)
          }
        }
      }
      this.maintenanceInfo.treeSpeciesInfo = treeSpeciesArray.join(', ')
    },
    handleConfirm () {
      const temp = {
        trees: this.treesCode,
        actual_time: this.maintenanceInfo.date,
        yh_username: this.maintenanceInfo.userName,
        growth_place: this.maintenanceInfo.location,
        note: this.maintenanceInfo.note,
        state: ''
      }
      // 传给上一个组件后，记得清空
      let data = Object.assign({}, temp, this.weatherInfo)
      this.$emit('basicConfirm', data)
    },
    handleCancel () {
      this.$emit('basicCancel')
    },
  },
  beforeMount () {
    const initializeWeatherInfo = () => {
      getCurrentWeather('北京').then(message => {
        this.weatherInfo.city = message.data.city
        this.weatherInfo.wea = message.data.wea
        this.weatherInfo.tem = message.data.tem
        this.weatherInfo.tem1 = message.data.tem1
        this.weatherInfo.tem2 = message.data.tem2
        this.weatherInfo.humidity = message.data.humidity
        this.weatherInfo.win = message.data.win
        this.weatherInfo.win_speed = message.data.win_speed
        this.weatherInfo.air_level = message.data.air_level
        this.weatherInfo.alarm_type = message.data.alarm.alarm_type === '' ? '无预警' : message.data.alarm.alarm_type
        this.weatherInfo.alarm_level = message.data.alarm.alarm_level === '' ? '无预警等级' : message.data.alarm.alarm_level
        this.maintenanceInfo.weatherInfo = `当前城市：${this.weatherInfo.city}，天气情况：${this.weatherInfo.wea}，温度：${this.weatherInfo.tem}，最高温度：${this.weatherInfo.tem1}，最低温度：${this.weatherInfo.tem2}，湿度：${this.weatherInfo.humidity}，风力：${this.weatherInfo.win_speed}，空气质量：${this.weatherInfo.air_level}，预警：${this.weatherInfo.alarm_type}`
      })
    }
    initializeWeatherInfo()

    const initializeDateInfo = () => {
      let dateInfo = new Date()
      this.maintenanceInfo.date = `${dateInfo.getFullYear()}-${dateInfo.getMonth() + 1}-${dateInfo.getDate()}`
    }
    initializeDateInfo()

    const initializeTreeNumberList = () => {
      queryTreeBasicProperty().then(message => {
        this.treesBasicProperty = message.data.trees_basic_property
        this.maintenanceInfo.treeNumber.list = this.treesBasicProperty.map((item) => {
          return item.tree_code
        })
      })
    }
    initializeTreeNumberList()

    const getUserName = () => {
      getUserInfo().then(message => {
        this.maintenanceInfo.userName = message.data.current_user.username
        this.maintenanceInfo.registerName = message.data.current_user.name
      })
    }
    getUserName()
  },
  mounted () {
    window.onresize = () => {
      this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
    }
  },
  updated () {
    this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
    window.onresize = () => {
      this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
    }
  }
}
</script>

<style scoped>

</style>
