<template>
  <Modal
    :value="show"
    title="查看"
    width="650"
    :loading="loading"
    @on-ok="handleSubmit"
    @on-cancel="handleCancel"
    @on-visible-change="onShowChange">
    <Form :model="user" ref="user_form" :rules="ruleValidate" >
      <Row :gutter="16">
        <Col span="12">
          <FormItem prop="username">
            <Input type="text" v-model="user.username" placeholder="用户名" disabled>
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem prop="name">
            <Input type="text" v-model="user.name" placeholder="名字">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row >
        <Col span="10" >
          <FormItem label="性别:" :label-width="50" prop="sex">
            <RadioGroup  v-model="user.sex">
              <Radio v-for="item in sexList " :label="item" :key="'key_'+item">{{ item }}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="13" offset="1">
          <!--<span >身份:</span>-->
          <FormItem label="身份:" prop="role_names">
            <CheckboxGroup v-model="user.role_names">
              <Checkbox v-for="role in roles" :label="role" :key="'key_'+role">
                <span>{{ role }}</span>
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
      </Row>





      <Row :gutter="16">
        <Col span="12">
          <FormItem prop="phone">
            <Input type="text" v-model="user.tele" placeholder="电话">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </Col>
        <Button @click="changepass_visible=true">重置密码</Button>
        <UpdatePassword :show="changepass_visible"@onOk="changepassword"@onCancel="()=>{this.changepass_visible=false}"></UpdatePassword>
      </Row>
    </Form>
  </Modal>
</template>

<script>
import UpdatePassword from "@/view/Userinfo/components/UpdatePassword";
import { GetUserByUsername ,changePassword} from "@/api/user";
import { updateWithinField } from "@/libs/tools";
import {getToken} from "@/libs/util";


export default {
  name: "UpdateUserInfo",
  components: { UpdatePassword},
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function,
    username: ''
  },
  data: function () {
    return {
      loading: true,
      changepass_visible: false,
      user: {
        id: undefined,
        username: undefined,
        name: undefined,
        tele: undefined,
        sex: '',
        start_time: '',
        end_time: '',
        role_names: []
      },
      roles: ['管理员', '养护管理员'],
      sexList: ['男', '女'],
      ruleValidate: {
        username: [{ required: true, message: 'the username can not be empty', trigger: 'blur' }],
        name: [{ required: true, message: 'the name can not be empty', trigger: 'blur' }],
        sex: [{ required: true, message: 'the sex can not be empty', trigger: 'change' }],
        role_names: [{
          required: true,
          type: 'array',
          min: 1,
          message: 'choose at least one role name',
          trigger: 'change'
        }],
        tele: [{ required: true, message: 'the phone can not be empty', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              if (!value) {
                return callback(new Error('the phone can not be empty'))
              } else if (!/^[1][34578][0-9]{9}$/.test(value)) {
                callback('手机号格式不正确')
              } else {
                callback()
              }
            }
          }
        ]
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
    changeLoading: function() {
      setTimeout(()=>{
        this.loading = false;
        this.$nextTick(()=>{
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
    onShowChange: function (show) {
      if (show) {
        // 显示的时候拉数据
        GetUserByUsername(this.username).then((resp) => {
          updateWithinField(this.user, resp.data.user)
        })
      }

    },
    changepassword: function (passwd) {
      changePassword(this.username, { 'password': passwd }).then((resp)=>{
        if (resp.data.code === 200 ){
          this.$Message.success('修改成功！')
        }
      })
      this.changepass_visible = false
    }
  }
}
</script>

<style scoped>

</style>
