<template>
  <Form id="form" ref="userInfo" :model="userInfo" :rules="ruleValidate" :label-width="80">
    <Row type="flex" justify="center" class="code-row-bg">
      <Col span="9">
        <FormItem label="用户名" prop="userName">
          <Input v-model="userInfo.userName" disabled> {{ userInfo.userName }}</Input>
        </FormItem>
      </Col>
      <Col span="9">
        <FormItem label="姓名" prop="name">
          <Input v-model="userInfo.name"> {{ userInfo.name }}</Input>
        </FormItem>
      </Col>
    </Row>

    <Row type="flex" justify="center" class="code-row-bg">
      <Col span="9">
        <FormItem label="电话" prop="telephone">
          <Input v-model="userInfo.telephone"> {{ userInfo.telephone }}</Input>
        </FormItem>
      </Col>
      <Col span="9">
        <FormItem label="单位" prop="unit">
          <Input v-model="userInfo.unit"> {{ userInfo.unit }}</Input>
        </FormItem>
      </Col>
    </Row>

    <Row type="flex" justify="center" class="code-row-bg">
      <Col span="9">
        <FormItem label="性别" prop="gender">
          <RadioGroup v-model="userInfo.gender">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
      <Col span="9">
        <FormItem label="身份" prop="identity">
          <CheckboxGroup v-model="userInfo.identities">
            <!--
              有其他身份的话，则继续加在这里，不可用 v-for 直接展示出来
            -->
            <Checkbox label="管理员">
              <span>管理员</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import { GetUserByUsername } from "@/api/user";
export default {
  name: "EditUserInfo",
  props: {
    confirmModify: Boolean
  },
  data () {
    const validateTelephone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("电话号码不能为空！"))
      } else if (!/^1[34578][0-9]{9}$/.test(value)) {
        callback(new Error("请输入正确的电话号码！"))
      } else {
        callback()
      }
    }
    return {
      username: this.$route.params.username,
      userInfo: {
        id: -1,
        userName: '', // 用户名，不可更改
        name: '', // 姓名，可更改
        telephone: '',
        unit: '',
        gender: '',
        identities: []
      },
      ruleValidate: {
        userName: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空！', trigger: 'blur' }
        ],
        telephone: [
          { required: true, validator: validateTelephone, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单位不能为空！', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别不能为空！', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
  },
  beforeMount () {
    GetUserByUsername(this.username).then(message => {
      let userInfo = message.data.user
      this.userInfo.id = userInfo.id
      this.userInfo.userName = userInfo.username
      this.userInfo.name = userInfo.name
      this.userInfo.telephone = userInfo.tele
      this.userInfo.unit = userInfo.unit
      this.userInfo.gender = userInfo.sex
      this.userInfo.identities = userInfo.role_names
    })
  },
  beforeUpdate () {
    this.$emit('modify', this.userInfo)
  }
}
</script>

<style scoped>
</style>
