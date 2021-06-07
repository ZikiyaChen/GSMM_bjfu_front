<template>
<div>
  <Card>
    <h2 slot="title">日常养护管理</h2>
    <Form :label-width="80" :model="query" inline>
      <FormItem label="养护项目:" :label-width="80">
        <Select style="width:180px" v-model="query.measure" clearable>
          <Option v-for="item in MeasuresList" :value="item.measure" :key="item.measure">{{ item.measure }}</Option>
        </Select>
      </FormItem>
    </Form>
  </Card>
</div>
</template>

<script>
import {queryMeasures} from "@/api/yh_manage";

export default {
  name: "admin_xiujian",
  data(){
     return{
       MeasuresList:[],
       query:{
         measure: undefined,
       }
     }
  },
  mounted() {
    this.fetchMeasures()
  },
  methods:{
    fetchMeasures(){
      queryMeasures({'yh_type':'修剪'}).then((res=>{
        this.MeasuresList=res.data.yh_measures
      }))
    }
  }
}
</script>

<style scoped>

</style>
