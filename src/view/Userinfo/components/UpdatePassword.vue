<template>
  <Modal
    :value="show"
    title="重置密码"
    @on-ok="handleOK"
    @on-cancel="handleCancel"
  >
    <Form :label-width="60" style="width: 400px" ref="formCustom" :model="formCustom" :rules="ruleCustom">
      <FormItem prop="passwd">
        <Row>
          <Col span="4">新密码: </Col>
          <Col span="18">
            <Input type="password" v-model="formCustom.passwd" placeholder="输入新密码">新密码</Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem prop="passwdCheck">
        <Row>
          <Col span="4">确认密码: </Col>
          <Col span="18">
            <Input type="password" v-model="formCustom.passwdCheck" placeholder="确认新密码">确认密码</Input>
          </Col>
        </Row>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
export default {
  name: "UpdatePassword",
  props: {
    show: Boolean
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      selected: '',
      props: {
        onOk: Function,
        onCancel: Function
      },
      formCustom: {
        passwd: '',
        passwdCheck: ''
      },
      ruleCustom: {
        passwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    handleOK: function () {
      this.selected = ''
      this.$emit('onOk', this.formCustom.passwd)
    },
    handleCancel: function () {
      this.selected = ''
      this.$emit('onCancel')
      this.formCustom.passwd = ''
      this.formCustom.passwdCheck = ''
    },
    select: function (value) {
      this.selected = value
    }
  }
}
</script>

<style scoped>

</style>
