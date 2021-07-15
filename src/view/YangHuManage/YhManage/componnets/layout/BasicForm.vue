<template>
  <Modal
    width="44"
    :value="show"
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
        <Input ref="registerInput" v-model="maintenanceInfo.registerName"></Input>
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
              v-model="maintenanceInfo.treeNumber.treeNumber"
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
</template>

<script>
import { getCurrentWeather } from "@/api/yh_manage";
import { queryTreeBasicProperty } from "@/api/table";

export default {
  name: 'BasicForm',
  props: {
    show: Boolean,
    judge: Object
  },
  data () {
    // const validateTreeNumber = (rule, value, callback) => {
    //   if (typeof (value) !== 'undefined') {
    //     if (typeof (this.formJudge) === 'undefined') {
    //       callback();
    //     } else if (!this.formJudge.judge) {
    //       callback(new Error('请先选择' + this.formJudge.quality));
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    //
    // const validateNote = (rule, value, callback) => {
    //   if (value !== '') {
    //     if (typeof (this.formJudge) === 'undefined') {
    //       callback();
    //     } else if (!this.formJudge.judge) {
    //       callback(new Error('请先选择' + this.formJudge.quality));
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     callback();
    //   }
    // }

    return {
      formJudge: this.judge,
      treesBasicProperty: [],
      maintenanceInfo: {
        weatherInfo: '',
        date: '',
        registerName: '',
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
      // ruleMaintenanceInfo: {
      //   treeNumber: [
      //     { validator: validateTreeNumber, trigger: 'blur' }
      //   ],
      //   location: [
      //     { validator: validateNote, trigger: 'blur' }
      //   ],
      //   note: [
      //     { validator: validateAge, trigger: 'blur' }
      //   ]
      // }
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

    treeNumberOptionChange (option) {
      let treeSpeciesArray = []
      for (let item of option) {
        for (let property of this.treesBasicProperty) {
          if (property.tree_code.indexOf(item) > -1) {
            treeSpeciesArray.push(property.zw_name)
          }
        }
      }
      this.maintenanceInfo.treeSpeciesInfo = treeSpeciesArray.join(', ')
    },

    handleConfirm () {

    },
    handleCancel () {
      this.$emit('basicCancel')
    },

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
        this.maintenanceInfo.weatherInfo = `当前城市：${cityName}，天气情况：${weather}，温度：${temperature}，湿度：${humidity}，风力：${windSpeed}，空气质量：${airQuality}，预警：${alarmType}`
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
          return item.tree_code.substr(6)
        })
      })
    }
    initializeTreeNumberList()
  },
  mounted () {
    window.onresize = () => {
      this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
    }
  },
  updated () {
    this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
  }
}
</script>

<style scoped>

</style>
