<template>
<Button @click="showUsername">username</Button>
</template>

<script>
export default {
name: "userinfo",
  data(){
     return{
       username: this.$route.params.username,
     }
  },
  methods:{
    showUsername(){
      console.log('!!!!个人信息username',this.username)
    }
  }
}
</script>

<style scoped>

</style>
