<template>
  <Modal
    :value="show"
    title="新增"
    :loading="loading"
    @on-ok="handleSubmit"
    @on-cancel="handleCancel">
    <Form :model="user" ref="user_form" :rules="ruleValidate" :label-width="70">
      <Row :gutter="16">
        <Col span="11">
          <FormItem prop="username" label="用户名:" >
            <Input type="text" v-model="user.username" placeholder="请输入用户名"></Input>
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem prop="name" label="姓名:">
            <Input type="text" v-model="user.name" placeholder="请输入姓名"></Input>
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col span="11">
          <FormItem prop="tele" label="电话:">
            <Input type="text" v-model="user.tele" placeholder="电话">
            </Input>
          </FormItem>
        </Col>

        <Col span="11" >
          <FormItem prop="unit" label="单位:">
            <Input type="text" v-model="user.unit" placeholder="单位">
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col>
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
        <Col span="10" >
          <FormItem label="性别:"  prop="sex">
            <RadioGroup  v-model="user.sex">
              <Radio v-for="item in sexList " :label="item.value" :key="item.value ">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>

      </Row>
    </Form>
  </Modal>
</template>

<script>
export default {
  name: "AddUserModal",
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function
  },
  data () {
    return {
      user: {
        username: '',
        name: '',
        tele: '',
        sex: '',
        unit: '',
        role_names: []
      },
      loading: true,
      users: [],
      // roles: ['管理员', '养护人员', '调查人员'],
      roles: ['管理员'], //调查人员和养护人员身份由是否加入表中来确认
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
        username: [{required: true, message: 'the username can not be empty', trigger: 'blur'}],
        name: [{required: true, message: 'the name can not be empty', trigger: 'blur'}],
        sex: [{required: true, message: 'the sex can not be empty', trigger: 'change'}],
        unit: [{required: true, message: 'the unit can not be empty', trigger: 'blur'}],
        // role_names: [ { required: true, type: 'array', min: 1, message: '至少选择一个身份', trigger: 'change' },
        //   { type: 'array', max: 3, message: '最多选择三个身份', trigger: 'change' }],
        tele: [{ required: true, message: 'the telephone number can not be empty', trigger: 'blur' },
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
    changeLoading: function() {
      setTimeout(()=>{
        this.loading = false;
        this.$nextTick(()=>{
          this.loading = true
        })
      }, 500)
    },
    handleSubmit () {
      this.$refs.user_form.validate((valid) => {
        this.changeLoading()
        console.log('valid',valid)
        if (valid) {
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

</style>
