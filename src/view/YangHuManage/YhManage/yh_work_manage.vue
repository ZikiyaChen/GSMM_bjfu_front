<template>
  <div>
    <Card>
      <h1>养护任务结果管理</h1>
      <br>
      <br>
      <Form :label-width="100" :model="query" inline>
<!--        <FormItem label="古树编号：" prop="tree_code_like">-->
<!--          <Input style="width: 180px" v-model="query.tree_code_like" placeholder="请输入古树编号"  clearable>-->
<!--          </Input>-->
<!--        </FormItem>-->

        <FormItem label="古树编号" prop="tree_code_likemohu">
          <Select
            filterable
            v-model="treeNumber.modal"
            @on-change="treeNumberOptionChange"
            :remote-method="treeNumberRemoteMethod"
            :loading="this.treeNumber.loading"
            style="width: 180px" clearable>
            <Option v-for="(option, index) in this.treeNumber.codes" :value="option.value" :key="index">{{option.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="养护项目类型:" prop="yh_type">
          <Select style="width:180px" v-model="query.yh_type" clearable >
            <Option v-for="item in YhTypeList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="单位:" prop="unit" v-role="['超级管理员']">
          <AutoComplete
            v-model="query.unit"
            placeholder="输入或选择"
            @on-change="ChangeUnitUsers"
            style="width: 180px"
            clearable>
            <Option v-for="item in units" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="养护人姓名:" prop="yh_username" v-role="['超级管理员']">
          <Select v-model="query.yh_username" placeholder="养护人姓名" filterable
                  @on-query-change="onYhUserSuperAdminQueryChange" clearable style="width: 180px">
            <Option v-for="item in yhUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="养护人姓名:" prop="yh_username" v-role="['单位管理员']">
          <Select v-model="query.yh_username" placeholder="养护人姓名" filterable
                  @on-query-change="onYhUserUnitQueryChange" clearable style="width: 180px">
            <Option v-for="item in ghUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="实际养护时间:" >
          <DatePicker :value="actual_time_range"  type="daterange" format="yyyy-MM-dd"
                      placement="bottom-end" placeholder="Select date"
                      @on-change="DateChange"
                      clearable style="width: 180px"></DatePicker>
        </FormItem>
        <FormItem >
          <Button type="primary" @click="onSearch">查询</Button>
        </FormItem>

      </Form>
      <Table stripe :columns="columns" :data="data" border></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
        </div>
      </div>
<!--      古树养护历史查看 -->
      <TreeYhHistory
        :show="showTreeYhHistory"
        :tree_code="selected_tree_code"
        @onOK="onShowTreeYhHistoryModalOK"
        @onCancel="onShowTreeYhHistoryModalCancel">
      </TreeYhHistory>
<!--      查看详细的养护记录信息， 以及修改-->
      <display-update-record
        v-if="showRecord"
        :id="id"
        :recordType="recordType"
        :maintenanceId="maintenanceId"
        @recordCancel="handleRecordCancel"
        @recordConfirm="handleRecordConfirm">
      </display-update-record>
<!--      待养护的填写-->
      <task-insert
        v-if="taskInsert.show"
        @insertCancel="handleInsertCancel"
        @insertConfirm="handleInsertConfirm"
        :content="taskInsert"></task-insert>
<!--删除确认-->
      <Modal
        v-model="deleteConfirmModal"
        :selected_id="delete_id">
        <p slot="header" style="color:#ff9900;text-align:center; font-size: 16px">
          <Icon type="ios-information-circle"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align:center; font-size: 16px">
          <p>删除后不可取消，请确认是否删除？</p>
          <P>确认删除请点击“删除”，否则点击“取消”按钮。</P>
          <p></p>
        </div>
        <div slot="footer" style="text-align: center">
          <Button type="error" size="large"  @click="ConfirmDelete">删除</Button>
          <Button size="large" @click="CancelDelete">取消</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>

import {deleteTreeInYhAllot, queryYhRecords} from "@/api/yh_manage";

import UserMixin from "@/mixin/UserMixin";
import TreeYhHistory from "@/view/YangHuManage/YhManage/componnets/TreeYhHistory";
import DisplayUpdateRecord from "@/view/YangHuManage/YhManage/componnets/DisplayUpdateRecord";
import TaskInsert from "@/view/YangHuManage/YhManage/componnets/TaskInsert";
import {queryTreeBasic, queryTreeBasicProperty} from "@/api/table";
import {queryUnits, queryUnitUsers, queryUsers} from "@/api/user";
import {yhTypeList} from "@/view/YangHuManage/YhManage/componnets/someoptions";
export default {
  name: "yh_work_manage",
  components: { DisplayUpdateRecord, TreeYhHistory, TaskInsert},
  mixins: [UserMixin],

  data () {
    let that = this
    return {
      delete_id: undefined,
      deleteConfirmModal: false,

      treeNumber: {
        list: [],
        codes: [],
        loading: false,
        modal: ''
      },
      units: [],
      ghUsers: [],
      yhUsers: [],
      actual_time_range: [],
      YhTypeList: yhTypeList,
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
        work_type: undefined,
        tree_code_likemohu: undefined,
        yh_type: undefined,
        unit: undefined
      },
      total: 0,
      pages: {
        _page: 1,
        _per_page: 3
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
          },
          filters: [
            {
              label: '分配',
              value: '分配'
            },
            {
              label: '自主',
              value: '自主'
            }
          ],
          filterMultiple: false,
          filterRemote: function (value, row) {
            console.log(value)//  value是数组类型
            if (value.length === 0) { // 选择“全部”时， value数组为空
              that.query.work_type = undefined
              that.fetchData()
            } else {
              that.query.work_type = value.toString()
              console.log(that.query)
              that.fetchData()
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
          width: 150,
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
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '2px',
                  display: (params.row.state !== '待养护') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    console.log(params.row)
                    this.delete_id = params.row.id
                    this.deleteConfirmModal = true
                  }
                }
              }, '删除'),
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

    //移除确认
    ConfirmDelete(){
      deleteTreeInYhAllot(this.delete_id).then(msg=>{
        if(msg.data.code === 200){
          this.$Message.success('删除成功')
          this.deleteConfirmModal = false
          this.delete_id = undefined
          this.fetchData()
        }else {
          this.$Message.error('删除失败')
        }
      })
    },
    CancelDelete(){
      this.deleteConfirmModal = false
    },

    treeNumberOptionChange (options) {
      console.log(options)
      this.query.tree_code_likemohu = options
    },

    treeNumberRemoteMethod (query) {
      if (query !== '') {
        this.treeNumber.loading = true;
        setTimeout(() => {
          this.treeNumber.loading = false;
          const list = this.treeNumber.list.map(item => {
            return {
              value: item,
              label: item
            };
          });
          this.treeNumber.codes = list.filter(item => item.label.indexOf(query) > -1);
        });
      } else {
        this.treeNumber.codes = [];
      }
    },
    ChangeUnitUsers(value){
      if(value!==''){
        queryUsers({unit: value, is_yh: true}).then(res=>{
          this.yhUsers = res.data.users
        })
      }
    },
    onYhUserSuperAdminQueryChange(value){
      queryUsers({name_like: value, is_yh: true, unit:this.query.unit}).then(res=>{
        this.yhUsers = res.data.users
      })
    },
    onYhUserUnitQueryChange(value){
      queryUnitUsers({name_like: value, is_yh:true}).then(res => {
        this.ghUsers = res.data.users
      })
    },
    //时间发生变化时
    DateChange(value){
      if(value[0]!==''&&value[1]!=='') {
        this.query.actual_time_gte = value[0]
        this.query.actual_time_lte = value[1]
      }else {
        this.query.actual_time_gte = undefined
        this.query.actual_time_lte = undefined
      }
    },
    onSearch() {
      this.pages._page=1
      this.fetchData()
    },

    onShowTreeYhHistoryModalOK () {
      this.showTreeYhHistory = false
    },
    onShowTreeYhHistoryModalCancel () {
      this.showTreeYhHistory = false
    },

    fetchData () {
      if(this.query.unit === ''){
        this.query.unit = undefined
      }
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
    const initializeTreeNumberList = () => {
      queryTreeBasic().then(message => {
        this.treeNumber.list = message.data.basic.map(item => {
          return item.tree_code
        })
      })
    }
    initializeTreeNumberList()
  },
  mounted () {
    // this.fetchData()
    queryUnitUsers({is_yh:true}).then(res => {
      this.ghUsers = res.data.users
    })
    queryUnits().then(res => {
      this.units = res.data.units
    })
  }
}
</script>

<style scoped>
</style>
