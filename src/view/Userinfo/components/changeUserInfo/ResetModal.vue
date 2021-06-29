<template>
  <Modal
    v-model="show"
    title="重置密码"
    @on-ok="handleConfirmClick"
    @on-cancel="handleCancel">
    <Form ref="resetForm" :model="passwordInfo" :rules="ruleResetModal" :label-width="80">
      <FormItem label="新的密码:" prop="newPassword">
        <Input type="password" v-model="passwordInfo.newPassword"></Input>
      </FormItem>
      <FormItem label="确认输入:" prop="confirmPassword">
        <Input type="password" v-model="passwordInfo.confirmPassword"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { changePassword } from "@/api/user";
export default {
  name: "ResetModal",
  props: {
    showResetModal: Boolean
  },
  data () {
    // 判断密码格式，需要英文加中文
    const validatePasswordFormat = (rule, value, callback) => {
      if (!/^[a-zA-Z][0-9a-zA-Z]{5,}$/.test(value)) {
        callback(new Error("密码开头需要包含英文字母, 且长度至少为6位"))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码！"))
      } else if (value !== this.passwordInfo.newPassword) {
        callback(new Error("两次输入的密码不一致！"))
      } else {
        callback()
      }
    }
    return {
      userName: this.$route.params.username,
      passwordInfo: {
        newPassword: '',
        confirmPassword: '',
      },
      ruleResetModal: {
        newPassword: [
          { required: true, validator: validatePasswordFormat, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    show: {
      get () { return this.showResetModal },
      set () {}
    }
  },
  methods: {
    handleConfirmClick () {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          changePassword(this.userName, { 'password': this.passwordInfo.confirmPassword }).then(message => {
            if (message.data.code === 200) {
              this.passwordInfo.newPassword = ''
              this.passwordInfo.confirmPassword = ''
              this.$Message.success('密码修改成功！');
            } else {
              this.$Message.error('密码修改失败！');
            }
          })
          this.$emit('hideModal', false) // 传值给父组件，将对话框设置为隐藏
        } else {
          this.$Message.error('密码修改失败');
          this.$emit('hideModal', false)
        }
      })
    },
    handleCancel () {
      this.passwordInfo.newPassword = ''
      this.passwordInfo.confirmPassword = ''
      this.$emit('hideModal', false)
    }
  }
}
</script>

<style scoped>
</style>
