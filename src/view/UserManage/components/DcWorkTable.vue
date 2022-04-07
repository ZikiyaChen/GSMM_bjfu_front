<template>
 <div>
   <Button type="primary" @click="showAddDcWork = true" style="margin-bottom: 5px">新增调查任务</Button>
   <Table border stripe :columns="columns" :data="data" max-height="500"></Table>
   <div style="margin: 10px;overflow: hidden">
     <div style="float: right;">
       <Page :total="total"  :current="pages._page" :page-size="pages._per_page" show-total
             @on-change="onPageChange"
             show-elevator show-sizer :page-size-opts="[10,20,30]" @on-page-size-change="onPageSizeChange"></Page>
     </div>
   </div>
 </div>
</template>
<script>
import {queryDcWorks} from "@/api/user";
import UserMixin from "@/mixin/UserMixin";
import DcUsersTable from "@/view/UserManage/components/DcUsersTable";

export default {
  name: "DcWorkTable",
  mixins: [UserMixin],
  components: {DcUsersTable},
  data(){
    return{
      showAddDcWork: false,
      total: 0,
      data: [], // 数据
      query:{
        create_by: undefined
      },
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      columns: [
        {
          type: 'expand',
          title: '调查参与者',
          width: 100,
          // fixed: 'left',
          render: (h, params) => {
            return h(DcUsersTable, {
              props: {
                id: params.row.id
              }
            })
          }
        },
        {
          title: 'id',
          width: 80,
          align: "center",
          key: 'id',
        },
        {
          title: '工作区域',
          align: 'center',
          // resizable: true,
          // width: 260,
          render: function (h, params) {
            return h('span', params.row.city + params.row.area)
          }
        },
        {
          title: '工作区域类型',
          align: 'center',
          // resizable: true,
          // width: 200,
          render: function (h, params) {
            if(params.row.work_place_type === 'province'){
              return h('Tag', { props: { color: 'blue' } }, '省级')
            }else if(params.row.work_place_type === 'city'){
              return h('Tag', { props: { color: 'blue' } }, '市级')
            }else if(params.row.work_place_type === 'area'){
              return h('Tag', { props: { color: 'blue' } }, '区级')
            }else if(params.row.work_place_type === 'unit'){
              return h('Tag', { props: { color: 'blue' } }, '园区')
            }
          }
        },
        {
          title: '开始时间',
          key: 'start_time',
          // width: 250,
          align: 'center',
          // resizable: true,
        },
        {
          title: '结束时间',
          key: 'end_time',
          // width: 250,
          align: 'center',
          // resizable: true,
        },
        {
          title: '调查任务状态',
          align: 'center',
          // resizable: true,
          // width: 200,
          render: function (h, params) {
            if(params.row.state === '进行中'){
              return h('Tag', { props: { color: 'blue' } }, params.row.state)
            }else if(params.row.state === '已结束'){
              return h('Tag', { props: { color: 'red' } }, params.row.state)
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          // fixed: 'right',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'md-create'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {

                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash',
                  // disabled: (params.row.is_unitAdmin === true && this.access.includes('单位管理员')),
                },
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    // this.delete_username = params.row.username
                    // this.deleteConfirmModal = true
                  }
                }
              }, '删除')
            ])
          }
        },
      ]
    }
  },
  methods:{
    fetchData(){
      this.query.create_by = this.userInfo.userInfo.username
      queryDcWorks({...this.query,...this.pages}).then(res=>{
        if(res.data.code === 200){
          this.data = res.data.dc_works
          this.total =res.data.total
        }
      })
    },
    onPageSizeChange(page_size){
      this.pages._per_page = page_size
      this.fetchData()
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
  },
  mounted() {
    this.fetchData()
  },
  created() {

  }

}
</script>
