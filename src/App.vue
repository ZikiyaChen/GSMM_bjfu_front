<template>
  <div id="app">
    <router-view :key="$route.path" v-if="isRouterAlive">
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload: this.reload
    }
  },
  data(){
    return{
      isRouterAlive: true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function (){
        this.isRouterAlive = true
      })
    }
  },
  created() {
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }

}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
