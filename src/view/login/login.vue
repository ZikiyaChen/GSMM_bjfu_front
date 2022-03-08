<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
<!--          <p class="login-tip">-->
<!--            <Alert type="error" v-show="flag" show-icon>用户名或密码错误</Alert>-->
<!--          </p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { setToken, getToken } from "@/libs/util";

export default {
  components: {
    LoginForm
  },
  data () {
    return {
      flag: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ username, password }) {
      this.handleLogin({ username, password }).then(res => {
        console.log('handleLogin',getToken())
        if(getToken()!==''){
          // this.flag = false
          this.getUserInfo().then(resp => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
        }
      }).catch((e)=>{
        // this.flag = true
        console.log('e', e)
        this.$Message.error({
          content: '用户名或密码错误',
          duration: 10,
          closable: true
        });
      })
    }
  }
}
</script>

<style>

</style>
