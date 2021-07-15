<template>
  <Modal
    width="44"
    :value="show"
    title="名木古树养护历史"
    @on-ok="handleOK"
    @on-cancel="handleCancel"
    @on-visible-change="fetchData">
    <Card style="margin-bottom: 20px">
      <p>古树编号: {{tree_code}}</p>
      <p>树种: {{tree.family }}\{{ tree.genus }}\{{tree.zw_name}}</p>
      <p>等级: {{tree.level}}</p>
      <p>生长地点: {{tree.city + tree.area + tree.town}}</p>
    </Card>
    <Timeline>
      <TimelineItem v-for="(item, index) in data" :key="item.id">
        <p class="time">{{item.actual_time}}</p>
        <p class="content">{{item.yh_type}}&nbsp;&nbsp;{{item.property}}&nbsp;&nbsp;
          {{item.projects.toString()}}&nbsp;&nbsp; 养护人：{{item.yh_user.name}}
<!--          <Button type="primary" size="small" style="margin-left: 15px;" @click="ShowRecord(item)">查看</Button>-->
        </p>
      </TimelineItem>
    </Timeline>
  </Modal>
</template>

<script>
import {queryYhRecords} from "@/api/yh_manage";
import {queryTreeBasicProperty} from "@/api/table";

export default {
  name: "TreeYhHistory",
  props:{
    show: Boolean,
    tree_code: String,
    onCancel: Function,
    onOK: Function,
  },
  data(){
    return{
      data: [],
      tree:{}
    }
  },
  methods:{
    handleOK(){
      this.$emit('onOK')
    },
    handleCancel(){
      this.$emit('onCancel')
    },
   fetchData(){
     queryYhRecords({'tree_code': this.tree_code, 'state': '已完成'}).then((res=>{
       this.data = res.data.yh_records
     }))
     queryTreeBasicProperty({'tree_code': this.tree_code}).then((treeRes=>{
       this.tree = treeRes.data.trees_basic_property[0]
     }))
   },
    ShowRecord(record){
      console.log('record##',record)
    }
  },
  mounted() {

  }

}
</script>

<style scoped>
.time{
  font-size: 14px;
  font-weight: bold;
}
.content{
  padding-left: 5px;
  font-size: 13px;
}
</style>
