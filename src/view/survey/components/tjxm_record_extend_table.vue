<template>
  <Card>
    <Table :show-header="true" :data="data" :columns="columns"></Table>

  </Card>
</template>

<script>
import {queryTjxmRecord} from "@/api/table";

export default {
  name: "tjxm_record_extend_table",
  props: {
    selected_tree_code: Number
  },
  data: function (){
    return{
      data:[],
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
          title: '调查项目',
          align: 'center',
          render: function (h, params) {
            return (
              <span> { params.row.type } </span>
            )
          }
        },
        {
          title: '调查人',
          align: 'center',
          render: function (h, params) {
            return (
              <span> { params.row.username } </span>
            )
          }
        },
        {
          title: '调查时间',
          align: 'center',
          render: function (h, params) {
            return (
              <span> { params.row.time } </span>
            )
          }
        },
        {
          title: '完成状态',
          align: 'center',
          render: function (h, params) {
            return (
              <span> { params.row.status } </span>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          // width: '130px',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {

                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    console.log('修改',params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    console.log('删除',params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {

  },
  created() {
    queryTjxmRecord({'tree_code':this.selected_tree_code}).then((res=>{
      console.log('tjxm',res.data)
      this.data = res.data.tjxm_records
    }))
  }
}
</script>

<style scoped>

</style>
