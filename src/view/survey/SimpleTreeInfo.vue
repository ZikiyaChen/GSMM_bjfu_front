<template>
<div>
  <div>
    <Carousel v-model="now_index" loop  @on-change="PicChange" style="height: 300px">
      <CarouselItem v-for="(item, i) in pic_path" :key="i">
        <img :src="'data:image/jpg;base64,'+item"   style="height: 300px"/>
      </CarouselItem>
    </Carousel>
  </div>
  <div style="line-height: 30px">
  <h2>古树编号：{{tree_code}}</h2>
  <h2>科属种：{{data.basic.family}}--{{data.basic.genus}}--{{data.basic.zw_name}}</h2>
  <h2>拉丁名：{{data.basic.ld_name}}</h2>
  <h2>古树树龄：{{data.dynamic.real_age}}年</h2>
  <h2>古树树高：{{data.dynamic.height}}米</h2>
  <h2>地理位置：{{data.basic.palce}}</h2>
  <h2>古树历史故事：{{data.dynamic.history}}</h2>
  </div>


</div>
</template>

<script>
import {getOneTreeBaseInfo} from "@/api/table";
import {ShowPic} from "@/api/upload";

export default {
  name: "SimpleTreeInfo",
  data(){
     return{
       now_index: 0,
       pic_path: [],
       value1: 0,
       tree_code: this.$route.params.tree_code,
       data:{
         basic: {
           area: undefined,
           bm_name: undefined,
           city: undefined,
           zw_name: undefined,
           family: undefined,
           genus: undefined,
           ld_name: undefined,
           level: undefined,
           owner: undefined,
           palce: undefined,
           place_name: undefined,
           placing_character: undefined,
           province: undefined,
           town: undefined,
           tree_code: undefined,
       },
         dynamic: {
           history: undefined,
           height: undefined,
           real_age: undefined,
         },
         pic: {
           path: []
         }
       }
     }
  },
  methods:{
    //跳到下一个时触发oldValue原来的，value目前要激活的
    PicChange(oldValue, value){
      console.log('@@',oldValue,value)
      let len=this.pic_path.length
      if(value === len){
        this.now_index = 0
      }
    },

    changePicPathToBase64(){
      if (this.data.pic.path.length !== 0) {
        this.data.pic.path.forEach((pic_name) => {
          ShowPic(pic_name).then(resp => {
            this.pic_path.push(resp.data)
          })
        })
      }
    }

  },
  created() {
    getOneTreeBaseInfo(this.tree_code).then((res=>{
      this.data = res.data.tree_basic_info
      this.changePicPathToBase64()
    }))

  }
}
</script>

<style scoped>

</style>
