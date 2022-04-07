<template>
  <Modal
    :value="show"
    :title="titleText"
    :loading="loading"
    @on-ok="handleSubmit"
    @on-cancel="handleCancel"
    width="620">
    <Form :model="user" ref="user_form" :rules="ruleValidate" :label-width="110">
      <Row>
        <Col span="20">
          <FormItem prop="username" label="用户名:" >
            <Input type="text" v-model="user.username" placeholder="请输入用户名"></Input>
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="20">
          <FormItem prop="name" label="姓名:">
            <Input type="text" v-model="user.name" placeholder="请输入姓名"></Input>
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col span="20">
          <FormItem prop="tele" label="电话:">
            <Input type="text" v-model="user.tele" placeholder="电话">
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row v-if="user_type === 'dc'">
        <Col span="20">
          <FormItem prop="validTime" label="账号有效期:">
          <DatePicker v-model="user.validTime" format="yyyy-MM-dd" type="daterange" :start-date="nowDate1"
                      @on-change="TimeChange" style="width: 380px"
                      placement="bottom-end" placeholder="Select date" ></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <div v-if="user_type !== 'yh'">
      <Row>
        <Col span="20">
          <FormItem prop="work_place_type" label="工作区域类型:">
            <RadioGroup v-model="user.work_place_type">
            <Radio v-for="item in workPlaceTypeList" :label="item.value" :key="item.value">{{ item.label }}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormItem prop="districts" label="工作区域:" class="regionStyle">
            <v-region :town="true" @values="selectLogs" v-model="user.districts"></v-region>
          </FormItem>
        </Col>
      </Row>


      <Row v-if="user.work_place_type === '2'">
        <Col span="20">
          <FormItem prop="work_place_unit" label="工作园区:">
<!--            <Input v-model="user.work_place_unit"></Input>-->
            <Select v-model="user.work_place_unit" style="width:200px">
              <Option v-for="item in NameList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      </div>

      <Row>
        <Col span="20">
          <FormItem prop="unit" label="单位" v-role="['超级管理员']">
            <AutoComplete
              v-model="user.unit"
              placeholder="输入或选择">
              <Option v-for="item in units" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
            </AutoComplete>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col v-role="['超级管理员']">
          <FormItem label="管理员:" prop="admin_roles">
            <CheckboxGroup v-model="user.admin_roles">
              <Checkbox v-for="role in adminroles" :label="role" :key="'key_'+role">
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
      </Row>

          <FormItem label="性别:"  prop="sex">
            <RadioGroup  v-model="user.sex">
              <Radio v-for="item in sexList " :label="item.value" :key="item.value ">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>



    </Form>
  </Modal>
</template>

<script>
import UserMixin from "@/mixin/UserMixin";
import { queryUnits } from "@/api/user";
import { placeTypeList} from "@/view/survey/right_base_options";
import {queryPolygonName} from "@/api/mapApi";
import {dateToString} from "@/libs/tools";

export default {
  name: "AddNewUserModal",
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function,
    titleText: String,
    user_type: String,
  },
  mixins: [UserMixin],
  data () {
    return {
      provinceList:[],
      cityList:[],
      areaList:[],
      townList:[],

      NameList: [],


      nowDate1: new Date(),
      nowDate2: new Date(),

      units: [],
      workPlaceTypeList:placeTypeList,
      is_not_change: false,
      user: {
        districts:{},
        username: '',
        name: '',
        tele: '',
        sex: '',
        unit: '',
        role_names: [],
        admin_roles: [],
        validTime: [],
        province:'',
        province_code:'',
        city:'',
        city_code: '',
        area:'',
        area_code:'',
        town:'',
        town_code: '',
        work_place_unit:0,
        work_place_type:'',
        district_type: '',
        create_by: '',
      },
      loading: true,
      users: [],
      adminroles: ['超级管理员', '单位管理员'],
      roles: ['养护人员', '调查人员'],
      // roles: ['管理员'], // 调查人员和养护人员身份由是否加入表中来确认
      sexList: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
        }
      ],
      ruleValidate: {
        username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        name: [{ required: true, message: '请填写用户名称', trigger: 'blur' }],
        work_place_type: [{ required: true, message: '请选择', trigger: 'change'}],

        validTime: [{ required: true, message: '请选择' ,type: 'array', min: 2, trigger: 'change'},
          { type: 'array', max: 2, message: '最多选择两个', trigger: 'change' }],

        // districts: [{ required: true, message: '请选择' ,type: 'array', min: 1, trigger: 'change'},
        //   { type: 'array', max: 4, message: '最多选择四个', trigger: 'change' }]


        // unit: [{ required: true, message: 'the unit can not be empty', trigger: 'blur' }],

        // role_names: [ { required: true, type: 'array', min: 1, message: '至少选择一个身份', trigger: 'change' },
        //   { type: 'array', max: 2, message: '最多选择两个身份', trigger: 'change' }],
        // tele: [{ required: true, message: '请填写联系方式', trigger: 'blur' },
        //   {
        //     validator (rule, value, callback) {
        //       if (!value) {
        //         return callback(new Error('the phone can not be empty'))
        //       } else if (!/^[1][34578][0-9]{9}$/.test(value)) {
        //         // eslint-disable-next-line standard/no-callback-literal
        //         callback('手机号格式不正确')
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // ]
      }
    }
  },
  created () {
    queryUnits().then(res => {
      this.units = res.data.units
    })

  },
  mounted() {
    queryPolygonName().then(res=>{
      this.NameList = res.data.polygon_names
    })

  },
  methods: {


    selectLogs(value){
      console.log(value)
      let i=0
      if(value.province){
        i++
        this.user.province = value.province.value
        this.user.province_code = value.province.key
      }
      if(value.city){
        i++
        this.user.city = value.city.value
        this.user.city_code = value.city.key
      }
      if(value.area){
        i++
        this.user.area = value.area.value
        this.user.area_code = value.area.key
      }
      if(value.town){
        i++
        this.user.town = value.town.value
        this.user.town_code = value.town.key
      }
      console.log('i',i)
      this.user.district_type = i
    },
    TimeChange(value){
      console.log('time',value)
      if(value[0]!==''){
        this.user.start_time = value[0]
        this.user.end_time = value[1]
      }
    },


    changeLoading: function () {
      setTimeout(() => {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true
        })
      }, 500)
    },
    handleSubmit () {
      if (this.userInfo.userInfo.is_unitAdmin === true) {
        this.user.unit = this.unit
      }
      this.user.create_by = this.username
      if(this.user.validTime.length === 0){
        this.user.start_time = dateToString(this.nowDate1,'yyyy-MM-dd')
        this.nowDate2.setFullYear(this.nowDate2.getFullYear() + 10);
        this.user.end_time = dateToString(this.nowDate2,'yyyy-MM-dd')
      }
      if(this.user_type === 'yh'){
        this.user.work_place_unit = this.userInfo.userInfo.work_place_unit
        this.user.work_place_type = this.userInfo.userInfo.work_place_type
        this.user.province_code = this.userInfo.userInfo.province_code
        this.user.province = this.userInfo.userInfo.province
        this.user.city_code = this.userInfo.userInfo.city_code
        this.user.city = this.userInfo.userInfo.city
        this.user.area_code = this.userInfo.userInfo.area_code
        this.user.area = this.userInfo.userInfo.area
        this.user.town_code = this.userInfo.userInfo.town_code
        this.user.town = this.userInfo.userInfo.town
      }

      this.$refs.user_form.validate((valid) => {
        this.changeLoading()
        console.log('valid', valid)
        if (valid) {
          console.log(valid, this.user)


          this.$emit('onOK', { ...this.user }, valid)
        } else {
          this.$Message.error('信息填写错误请检查!')
        }
      })
    },
    handleCancel () {
      this.$emit('onCancel')
    }
  }
}
</script>

<style scoped>
.regionStyle >>> div.rg-select div.rg-select__el div.rg-select__content  {
  font-size: 12px;
}
.regionStyle >>> .ivu-form-item-content {
  line-height: 16px;
}
</style>
