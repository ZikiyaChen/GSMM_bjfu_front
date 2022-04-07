<template>
  <Modal
    :value="show"
    title="查看"
    width="650"
    :loading="loading"
    @on-ok="handleSubmit"
    @on-cancel="handleCancel"
    @on-visible-change="onShowChange">
    <Form :model="user" ref="user_form" :rules="ruleValidate" :label-width="100">
      <Row :gutter="16">
        <Col span="11">
          <FormItem prop="username" label="用户名：">
            <Input type="text" v-model="user.username" placeholder="用户名" disabled class="TextColor">
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem prop="name" label="姓名：">
            <Input type="text" v-model="user.name" placeholder="名字">
            </Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="11">
          <FormItem prop="tele" label="电话：">
            <Input type="text" v-model="user.tele" placeholder="电话">
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem prop="unit" label="单位：">
            <Input type="text" v-model="user.unit" placeholder="单位">
            </Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16" v-if="user.is_dc === true">
        <Col span="11">
          <FormItem prop="validTime" label="账号有效期:">
            <DatePicker v-model="user.validTime" format="yyyy-MM-dd" type="daterange"
                        @on-change="TimeChange"
                        placement="bottom-end" placeholder="Select date" ></DatePicker>
          </FormItem>
        </Col>
        <Col span="11" >
          <FormItem label="性别："  prop="sex">
            <RadioGroup  v-model="user.sex">
              <Radio v-for="item in sexList " :label="item" :key="'key_'+item">{{ item }}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>


        <Row>
          <Col span="11"  v-if="user.is_yh === false">
            <FormItem prop="work_place_type" label="工作区域类型:">
              <RadioGroup v-model="user.work_place_type">
                <Radio v-for="item in workPlaceTypeList" :label="item.value" :key="item.value">{{ item.label }}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="身份:" prop="role_names">
              <span v-for="role in user.role_names" style="margin-left: 10px">{{ role }}</span>
            </FormItem>
          </Col>
        </Row>
      <div v-if="user.is_yh === false">
        <Row>
          <Col>
            <FormItem prop="districts" label="工作区域:" class="regionStyle">
              <v-region :town="true" @values="selectLogs" v-model="user.districts"></v-region>
            </FormItem>
          </Col>
        </Row>


        <Row v-if="user.work_place_type === '2'">
          <Col span="11">
            <FormItem prop="work_place.name" label="工作园区:">
              <Input v-model="user.work_place.name">
              </Input>
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row>
        <Button @click="changepass_visible=true">重置密码</Button>
        <UpdatePassword :show="changepass_visible" @onOk="changepassword" @onCancel="()=>{this.changepass_visible=false}"></UpdatePassword>
      </Row>
    </Form>
  </Modal>
</template>

<script>
import UpdatePassword from "@/view/Userinfo/components/UpdatePassword";
import { GetUserByUsername, changePassword } from "@/api/user";
import { updateWithinField } from "@/libs/tools";
// eslint-disable-next-line no-unused-vars
import { getToken } from "@/libs/util";
import UserMixin from "@/mixin/UserMixin";
import {placeTypeList} from "@/view/survey/right_base_options";

export default {
  name: "UpdateUserInfo",
  components: { UpdatePassword },
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function,
    selected_username: ''
  },
  mixins: [UserMixin],
  data: function () {
    return {
      workPlaceTypeList:placeTypeList,
      is_not_show: true,
      loading: true,
      changepass_visible: false,
      user: {
        districts:{},
        id: undefined,
        username: undefined,
        name: undefined,
        tele: undefined,
        sex: '',
        unit: '',
        role_names: [],
        is_dc: undefined,
        is_yh: undefined,
        validTime:[],
        start_time:'',
        end_time: '',
        work_place_type:'',

        work_place: {name:''},

        province:'',
        province_code:'',
        city:'',
        city_code: '',
        area:'',
        area_code:'',
        town:'',
        town_code: '',
      },
      // roles: ['管理员'],
      roles: [],
      sexList: ['男', '女'],
      ruleValidate: {
        username: [{ required: true, message: 'the username can not be empty', trigger: 'blur' }],
        name: [{ required: true, message: 'the name can not be empty', trigger: 'blur' }],
        // sex: [{ required: true, message: 'the sex can not be empty', trigger: 'change' }],
        unit: [{ required: true, message: 'the unit can not be empty', trigger: 'blur' }],

        // tele: [{ required: true, message: 'the phone can not be empty', trigger: 'blur' },
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

  methods: {
    /* handleOK: function () {
      this.$emit('onOK', {
        ...this.user,
        start_time: dateToString(this.user.start_time, 'yyyy-MM-dd hh:mm:ss'),
        end_time: dateToString(this.user.end_time, 'yyyy-MM-dd hh:mm:ss')
      })
    }, */
    changeLoading: function () {
      setTimeout(() => {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true
        })
      }, 500)
    },
    validate: function (f) {
      return this.$refs.user.validate(f)
    },
    handleCancel: function () {
      this.$emit('onCancel')
    },
    TimeChange(value){
      console.log('time',value)
      if(value[0]!==''){
        this.user.start_time = value[0]
        this.user.end_time = value[1]
      }
    },
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
    handleSubmit () {
      this.$refs.user_form.validate((valid) => {
        this.changeLoading()
        if (valid) {
          // alert("Success！");
          this.$emit('onOK', { ...this.user })
        } else {
          // alert("Fail!");
          this.$Message.error('信息填写错误请检查!')
        }
      })
    },
    // onShowChange: function (show) {
    //   if (show) {
    //     // 显示的时候拉数据
    //     GetUserByUsername(this.username).then((resp) => {
    //       updateWithinField(this.user, resp.data.user)
    //       if (resp.data.user.role_names.length === 0 || resp.data.user.role_names.includes('管理员')) {
    //         this.is_not_show = false
    //       } else {
    //         this.is_not_show = true
    //       }
    //     })
    //   }
    // },
    onShowChange: function (show) {
      if (show) {
        if(this.access.includes('超级管理员')){
          this.roles = ['超级管理员','单位管理员']
        }else {
          this.roles = ['养护人员','调查人员']
        }
        // 显示的时候拉数据
        GetUserByUsername(this.selected_username).then((resp) => {
          updateWithinField(this.user, resp.data.user)
        })
      }
    },
    changepassword: function (passwd) {
      changePassword(this.selected_username, { 'password': passwd }).then((resp) => {
        if (resp.data.code === 200) {
          this.$Message.success('修改成功！')
        }
      })
      this.changepass_visible = false
    }
  }
}
</script>

<style scoped>
.TextColor >>> .ivu-input[disabled], fieldset[disabled] .ivu-input {
  /*color: #999999 !important;*/
  color: #515a6e !important;
}

.regionStyle >>> div.rg-select div.rg-select__el div.rg-select__content  {
  font-size: 12px;
}
.regionStyle >>> .ivu-form-item-content {
  line-height: 16px;
}
</style>
