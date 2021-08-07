<template>
  <div>
    <Card>
      <h1>养护任务结果管理</h1>
      <Divider />
      <Table stripe :columns="columns" :data="data" border></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
        </div>
      </div>
      <TreeYhHistory
        :show="showTreeYhHistory"
        :tree_code="selected_tree_code"
        @onOK="onShowTreeYhHistoryModalOK"
        @onCancel="onShowTreeYhHistoryModalCancel">
      </TreeYhHistory>
      <display-update-record
        v-if="showRecord"
        :id="id"
        :recordType="recordType"
        :maintenanceId="maintenanceId"
        @recordCancel="handleRecordCancel"
        @recordConfirm="handleRecordConfirm">
      </display-update-record>
      <task-insert
        v-if="taskInsert.show"
        @insertCancel="handleInsertCancel"
        @insertConfirm="handleInsertConfirm"
        :content="taskInsert"></task-insert>
    </Card>
  </div>
</template>

<script>

import { queryYhRecords } from "@/api/yh_manage";

import UserMixin from "@/mixin/UserMixin";
import TreeYhHistory from "@/view/YangHuManage/YhManage/componnets/TreeYhHistory";
import DisplayUpdateRecord from "@/view/YangHuManage/YhManage/componnets/DisplayUpdateRecord";
import TaskInsert from "@/view/YangHuManage/YhManage/componnets/TaskInsert";
import {queryTreeBasicProperty} from "@/api/table";
export default {
  name: "yh_work_manage",
  components: { DisplayUpdateRecord, TreeYhHistory, TaskInsert},
  mixins: [UserMixin],

  data () {
    let that = this
    return {
      taskInsert: {
        show: false,
        treeNumber: '',
        type: '',
        allotOrder: '',
        userName: '',
        registerName: ''
      },
      showRecord: false,
      recordType: '',
      id: -1, // yh_record中的id
      maintenanceId: -1, // specific中的id
      data: [],
      showTreeYhHistory: false,
      current_user: {},
      selected_tree_code: undefined,
      query: {
        state: undefined,
      },
      total: 0,
      pages: {
        _page: 1,
        _per_page: 5
      }, // 分页
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
          title: '养护单位',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.unit)
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
            if (params.row.work_type === '分配') {
              return h('Tag', { props: { color: 'red' } }, '分配')
            } else {
              return h('Tag', { props: { color: 'blue' } }, '自主')
            }
          }
        },
        {
          title: '完成状态',
          align: "center",
          render: function (h, params) {
            if (params.row.state === '待养护') {
              return h('Tag', { props: { color: 'red' } }, '待养护')
            } else if (params.row.state === '草稿') {
              return h('Tag', { props: { color: 'default' } }, '草稿')
            } else {
              return h('Tag', { props: { color: 'blue' } }, '已完成')
            }
          },
          filters: [
            {
              label: '待养护',
              value: '待养护'
            },
            {
              label: '已完成',
              value: '已完成'
            },
            {
              label: '草稿',
              value: '草稿'
            }
          ],
          filterMultiple: false,
          filterRemote: function (value, row) {
            console.log(value)//  value是数组类型
            if (value.length === 0) { // 选择“全部”时， value数组为空
              that.query.state = undefined
              that.fetchData()
            } else {
              that.query.state = value.toString()
              console.log(that.query)
              that.fetchData()
            }
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
                  display: (params.row.state !== '待养护') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    console.log(params.row)
                    this.taskInsert.show = true
                    this.taskInsert.type = params.row.yh_type
                    this.taskInsert.allotOrder = params.row.allot_order
                    this.taskInsert.treeNumber = params.row.tree_code
                    this.taskInsert.userName = params.row.yh_user.username
                    this.taskInsert.registerName = params.row.yh_user.name
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
                  display: (params.row.state === '待养护') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    this.showRecord = true
                    this.id = params.row.id
                    this.recordType = params.row.yh_type
                    this.maintenanceId = params.row.yh_id
                  }
                }
              }, '查看')
            ])
          }
        },
        {
          title: '古树养护历史',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.selected_tree_code = params.row.tree_code
                    this.showTreeYhHistory = true
                  }
                }
              }, '养护历史')
            ])
          }
        },

      ]
    }
  },
  methods: {
    onShowTreeYhHistoryModalOK () {
      this.showTreeYhHistory = false
    },
    onShowTreeYhHistoryModalCancel () {
      this.showTreeYhHistory = false
    },
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

    fetchData () {
      let args = { ...this.query, ...this.pages }
      queryYhRecords(args).then(res => {
        console.log(res.data.yh_records)
        this.data = res.data.yh_records
        this.total = res.data.total
      })
    },
    handleRecordCancel () {
      this.showRecord = false
    },
    handleRecordConfirm () {
      this.showRecord = false
      this.fetchData()
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    handleInsertConfirm() {
      this.taskInsert.show = false
      this.fetchData()
    },
    handleInsertCancel() {
      this.taskInsert.show = false
    }
  },
  created () {
    this.fetchData()
  },
  mounted () {
    // this.fetchData()
  }
}
</script>

<style scoped>
</style>
