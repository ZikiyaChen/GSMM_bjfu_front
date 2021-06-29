<template>
  <Card>
    <Table :show-header="true" :data="data" :columns="columns"></Table>
  </Card>
</template>

<script>
import {deleteTjxmRecord} from "@/api/table";
import {queryYhRecords} from "@/api/yh_manage";

export default {
name: "yh_record_extend_table",
  props: {
    selected_allot_order: String
  },
  data(){
     return{
       data: [],
       columns: [
         {
           title: '古树编号',
           align: 'center',
           render: function (h, params) {
             return (
               <span> { params.row.tree_code } </span>
             )
           }
         },
         {
           title: '养护项目类型',
           align: 'center',
           render: function (h, params) {
             return (
               <span> { params.row.yh_type } </span>
             )
           }
         },
         {
           title: '措施性质',
           align: 'center',
           render: function (h, params) {
             return (
               <span> { params.row.property } </span>
             )
           }
         },
         {
           title: '具体养护项目',
           align: 'center',
           render: function (h, params) {
             return (
               <span> { params.row.projects } </span>
             )
           }
         },
         {
           title: '实际养护时间',
           align: 'center',
           render: function (h, params) {
             return (
               <span> { params.row.actual_time } </span>
             )
           }
         },
         {
           title: '完成状态',
           align: 'center',
           render: function (h, params) {

             if(params.row.state === '待养护'){
               return h('Tag', { props: { color: 'red' } }, '待养护')
             }else if(params.row.state === '草稿'){
               return h('Tag', { props: { color: 'default' } }, '草稿')
             }else {
               return h('Tag', { props: { color: 'blue' } }, '已完成')
             }
           }
         },
         {
           title: '操作',

           // width: '130px',
           render: (h, params) => {
             return h('div', [
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
     fetchData(){
       queryYhRecords({'allot_order': this.selected_allot_order}).then((res=>{
         this.data = res.data.yh_records
       }))
     }
  },
  mounted() {
     this.fetchData()
  }
}
</script>

<style scoped>

</style>
