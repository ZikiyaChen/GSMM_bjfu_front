<template>
<div>
  <Button @click="show">显示</Button>
    <img :src="'data:image/jpg;base64,'+this.img_stream">
</div>
</template>

<script>
import {ShowPic} from "@/api/upload";

export default {
  name: "pic",
  data (){
    return {
      img_stream: ''
    }
  },
  methods: {
    show (){
      ShowPic('ceshi.jpg').then((res=>{
        console.log(res)
        this.img_stream = res.data
      }))
    }
  }
}
</script>

<style scoped>

</style>
