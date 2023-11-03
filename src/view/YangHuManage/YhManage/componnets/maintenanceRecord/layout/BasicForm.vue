<template>
  <div>
    <Modal
      width="44"
      :mask-closable="false"
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
                @on-change="handleDateChange"
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
              <Input v-if="this.userInfo.userInfo.area==='白水县'" value="61052700" style="text-align: center" readonly>61052700</Input>
              <Input v-else value="110131" style="text-align: center" readonly>110131</Input>
            </Col>
            <Col span="20">
              <Select
                v-if="!showFlag"
                multiple
                filterable
                v-model="maintenanceInfo.treeNumber.model"
                :default-label="maintenanceInfo.treeNumber.model"
                @on-change="treeNumberOptionChange"
                :remote-method="treeNumberRemoteMethod"
                :loading="maintenanceInfo.treeNumber.loading">
                <Option
                  v-for="(option, index) in maintenanceInfo.treeNumber.options"
                  :value="option.value"
                  :key="index">
                  {{option.label}}
                </Option>
              </Select>
              <Select
                v-else
                filterable
                v-model="maintenanceInfo.treeNumber.model1"
                :default-label="maintenanceInfo.treeNumber.model1"
                @on-change="treeNumberOptionChangeSingle"
                :remote-method="treeNumberRemoteMethod"
                :loading="maintenanceInfo.treeNumber.loading">
                <Option
                  v-for="(option, index) in maintenanceInfo.treeNumber.options"
                  :value="option.value"
                  :label="option.label"
                  :key="index">
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
import {queryTreeBasic, queryTreeBasicProperty} from "@/api/table";
import { getUserInfo } from "@/api/user";
import { mapState } from "vuex";
import UserMixin from "@/mixin/UserMixin";
export default {
  name: 'BasicForm',
  mixins: [UserMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('maintenanceForm', {
      loading: state => state.loading,
      basicFormData: state => state.basicFormData,
      otherFormData: state => state.otherFormData,
      showFlag: state => state.showFlag
    }),
  },
  data () {
    return {
      flag: 1,
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
          model1: '',
          model: [],
          loading: false,
          list: [],
          options: [],
          // prefix: '110131'
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
        })
      } else {
        this.maintenanceInfo.treeNumber.options = []
      }
    },
    treeNumberOptionChange (options) {
      let treeSpeciesArray = []
      for (let item of options) {
        for (let property of this.treesBasicProperty) {
          if (property.tree_code.indexOf(item) > -1) {
            treeSpeciesArray.push(property.zw_name)
          }
        }
      }
      this.maintenanceInfo.treeSpeciesInfo = treeSpeciesArray.join(', ')
    },
    treeNumberOptionChangeSingle (option) {
      for (let property of this.treesBasicProperty) {
        if (property.tree_code.indexOf(option) > -1) {
          this.maintenanceInfo.treeSpeciesInfo = property.zw_name
        }
      }
    },
    handleConfirm () {
      const temp = {
        // trees: tempTrees,
        actual_time: this.maintenanceInfo.date,
        yh_username: this.maintenanceInfo.userName,
        growth_place: this.maintenanceInfo.location,
        note: this.maintenanceInfo.note,
        state: ''
      }
      if (this.showFlag) {
        temp.tree_code = this.maintenanceInfo.treeNumber.model1
      } else {
        temp.trees = this.maintenanceInfo.treeNumber.model
      }

      let data = Object.assign({}, temp, this.weatherInfo)
      this.$emit('basicConfirm', data)
    },
    handleCancel () {
      this.$emit('basicCancel')
    },
    handleDateChange (date) {
      date = date.replace('年', '-').replace('月', '-').replace('日', '')
      this.maintenanceInfo.date = date
    },
    monitorWindowChange () {
      this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
    }
  },
  created () {
    const initializeWeatherInfo = () => {
      if (this.showFlag) {
        this.maintenanceInfo.weatherInfo = this.basicFormData.weatherInfoStr
        this.weatherInfo = this.basicFormData.weatherInfo
      } else {
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
    }
    initializeWeatherInfo()

    const initializeDateInfo = () => {
      if (this.showFlag) {
        this.maintenanceInfo.date = this.basicFormData.date
      } else {
        let dateInfo = new Date()
        this.maintenanceInfo.date = `${dateInfo.getFullYear()}-${dateInfo.getMonth() + 1}-${dateInfo.getDate()}`
      }
    }
    initializeDateInfo()

    const initializeTreeNumberList = () => {
      if (this.showFlag) {
        this.maintenanceInfo.treeNumber.model1 = this.basicFormData.treeNumber
      }
      queryTreeBasicProperty().then(message => {
        this.treesBasicProperty = message.data.trees_basic_property
        this.maintenanceInfo.treeNumber.list = this.treesBasicProperty.map(item => {
          return item.tree_code
        })
        if (this.showFlag) {
          this.maintenanceInfo.treeNumber.options = this.maintenanceInfo.treeNumber.list.map(item => {
            return {
              label: item,
              value: item
            }
          })
        }
        if(this.showFlag && !this.basicFormData.treeSpeciesInfo){
          this.treeNumberOptionChangeSingle(this.basicFormData.treeNumber)
        }
      })
    }
    initializeTreeNumberList()
    const getUserName = () => {
      if (!this.showFlag) {
        getUserInfo().then(message => {
          this.maintenanceInfo.userName = message.data.current_user.username
          this.maintenanceInfo.registerName = message.data.current_user.name
        })
      }
    }
    getUserName()

    const initializeOtherInfo = () => {
      if (this.showFlag) {
        this.maintenanceInfo.userName = this.basicFormData.userName
        this.maintenanceInfo.registerName = this.basicFormData.registerName
        this.maintenanceInfo.treeSpeciesInfo = this.basicFormData.treeSpeciesInfo
        this.maintenanceInfo.location = this.basicFormData.location
        this.maintenanceInfo.note = this.basicFormData.note
      }
    }
    initializeOtherInfo()
  },
  beforeMount() {

  },
  mounted(){
    window.addEventListener('resize', this.monitorWindowChange)
  },
  updated () {
    this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.monitorWindowChange)
  }
}
</script>

<style scoped>
</style>
