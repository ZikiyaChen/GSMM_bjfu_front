<template>
  <Card>
    <h1>用户管理</h1>
    <br>
  <Tabs type="card" v-model="value" @on-click="GetTabName">
    <TabPane name="dc" label="调查人员">
<!--      <DcWorkTable></DcWorkTable>-->
      <DcUsersTables></DcUsersTables>
    </TabPane>
    <TabPane name="yh" label="养护人员">
      <YhUsersTable></YhUsersTable>
    </TabPane>
  </Tabs>
  </Card>
</template>
<script>
import DcWorkTable from "@/view/UserManage/components/DcWorkTable";
import YhUsersTable from "@/view/UserManage/components/YhUsersTable";
import DcUsersTables from "@/view/UserManage/components/DcUsersTables";
export default {
  components: {DcUsersTables, YhUsersTable, DcWorkTable},
  data(){
    return{
      value: 'dc',
    }
  },
  methods:{
    GetTabName(name){
      console.log('tab',name)

    }
  },
  mounted() {

  },
  created() {

  }

}
</script>
