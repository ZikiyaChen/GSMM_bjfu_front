<template>
<div>
  <Card>
    <Table stripe :columns="columns" :data="data" border></Table>
  </Card>
</div>
</template>

<script>
import {queryYhRecords} from "@/api/yh_manage";
import {getUserInfo} from "@/api/user";
import UserMixin from "@/mixin/UserMixin";


export default {
   name: "yh_work_manage",
  mixins: [UserMixin],
  data(){
     return{
       data: [],
       current_user:{},
       query:{
         group_name: undefined
       },

       columns: [

         {
           title: '古树编号',
           align: 'center',
           render: function (h, params) {
             return h('span', params.row.tree_code)
           }
         },
         {
           title: '树种',
           align: 'center',
           render: function (h, params) {
             return h('span', params.row.tree.zw_name)
           }
         },
         {
           title: '养护项目类型',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.yh_type)
           }
         },
         {
           title: '措施性质',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.property)
           }
         },
         {
           title: '具体养护项目',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.projects)
           }
         },

         {
           title: '养护人姓名',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.yh_user.name)
           }
         },
         {
           title: '养护小组',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.group_name)
           }
         },
         {
           title: '预计养护时间',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.predict_time)
           }
         },
         {
           title: '实际养护时间',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.actual_time)
           }
         },
         {
           title: '任务类型',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.work_type)
           }
         },
         {
           title: '完成状态',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.state)
           }
         },


         {
           title: '操作',
           align: 'center',
           render: (h, params) => {
             return h('div', [
               h('Button', {
                 props: {
                   type: 'success',
                   size: 'small'
                 },

                 style: {
                   marginRight: '2px',
                   display:( params.row.state !== '待养护' )?"none":"inline-block",
                 },
                 on: {
                   click: () => {

                   }
                 }
               }, '填写'),

               h('Button', {
                 props: {
                   type: 'primary',
                   size: 'small'
                 },

                 style: {
                   marginRight: '2px',
                   display:( params.row.state === '待养护' )?"none":"inline-block",
                 },
                 on: {
                   click: () => {

                   }
                 }
               }, '查看')


             ])
           }
         }
       ]
     }
  },
  methods:{
     // fetchData(){
     //   getUserInfo().then((res=>{
     //     this.current_user = res.data.current_user
     //
     //     if(this.current_user['role_names'].includes('养护组长')){
     //       this.query.group_name = this.current_user.group_info['group_name']
     //     }
     //     let args = { ...this.query, ...this.pages }
     //   queryYhRecords(args).then((res=>{
     //     this.data = res.data.yh_records
     //   }))
     // }))
     // }

    fetchData(){

        if(this.userInfo.userInfo['role_names'].includes('养护组长')){
          this.query.group_name = this.userInfo.userInfo.group_info['group_name']
        }
        let args = { ...this.query, ...this.pages }
        queryYhRecords(args).then((res=>{
          this.data = res.data.yh_records
        }))

    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
     // this.fetchData()
  }

}
</script>

<style scoped>

</style>
