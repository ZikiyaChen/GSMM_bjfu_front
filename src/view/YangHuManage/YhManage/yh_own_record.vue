<template>
  <div>
    <Card>
      <h1>个人养护记录</h1>
      <br>
      <Form  :label-width="100" inline>
        <FormItem label="古树编号">
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
      <record-add @confirmSuccess="handleConfirmSuccess" style="margin-bottom: 10px"></record-add>
      <Table  :columns="columns" :data="data" border max-height="500"></Table>
      <div style="margin:   10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total"  :current="pages._page" :page-size="pages._per_page" show-total
                @on-change="onPageChange"
                show-elevator show-sizer :page-size-opts="[10,20,30]" @on-page-size-change="onPageSizeChange"></Page>
        </div>
      </div>
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

<!--      <Modal-->
<!--        v-model="deleteConfirmModal"-->
<!--        title="警告提示"-->
<!--        :seletcted_id="delete_id"-->
<!--        :loading="loading"-->
<!--        @on-ok="ConfirmDelete"-->
<!--        @on-cancel="CancelDelete">-->
<!--        <Alert type="warning" show-icon>-->
<!--          确认是否需要删除？删除后不可取消-->
<!--          <template slot="desc">-->
<!--            确认删除请点击“确认”-->
<!--          </template>-->
<!--        </Alert>-->
<!--      </Modal>-->

      <Modal
        v-model="deleteConfirmModal"
        :selected_id="delete_id"
        :loading="loading">
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
import RecordAdd from "@/view/YangHuManage/YhManage/componnets/RecordAdd";
import TreeYhHistory from "@/view/YangHuManage/YhManage/componnets/TreeYhHistory";
import UserMixin from "@/mixin/UserMixin";
import {deleteYhRecord, queryYhRecords} from "@/api/yh_manage";
import TaskInsert from "@/view/YangHuManage/YhManage/componnets/TaskInsert";
import DisplayUpdateRecord from "@/view/YangHuManage/YhManage/componnets/DisplayUpdateRecord";
import {queryTreeBasic} from "@/api/table";
import {yhTypeList} from "@/view/YangHuManage/YhManage/componnets/someoptions";
export default {
  name: "yh_own_record",
  components: {
    TreeYhHistory,
    RecordAdd,
    TaskInsert,
    DisplayUpdateRecord
  },
  mixins: [UserMixin],
  data () {
    let that = this
    return {
      YhTypeList: yhTypeList,
      actual_time_range: undefined,
      deleteConfirmModal: false, //做一个删除再次确认的Modal，防治误删除
      delete_id: undefined,
      loading: false,

      showRecord: false,
      recordType: '',
      id: -1, // yh_record中的id
      maintenanceId: -1, // specific中的id

      treeNumber: {
        list: [],
        codes: [],
        loading: false,
        modal: ''
      },

      taskInsert: {
        show: false,
        treeNumber: '',
        type: '',
        allotOrder: '',
        userName: '',
        registerName: ''
      },
      showTreeYhHistory: false,
      data: [],
      selected_tree_code: undefined,
      query: {
        state: undefined,
        work_type: undefined
      },
      total: 0,
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      columns: [
        {
          title: '古树编号',
          align: 'center',
          fixed: 'left',
          resizable: true,
          width: 100,
          render: function (h, params) {
            return h('span', params.row.tree_code)
          }
        },
        {
          title: '树种',
          align: 'center',
          fixed: 'left',
          resizable: true,
          width: 80,
          render: function (h, params) {
            return h('span', params.row.tree.zw_name)
          }
        },
        {
          title: '养护项目类型',
          align: "center",
          resizable: true,
          width: 110,
          render: function (h, params) {
            return h('span', params.row.yh_type)
          }
        },
        {
          title: '措施性质',
          align: "center",

          resizable: true,
          width: 100,
          render: function (h, params) {
            return h('span', params.row.property)
          }
        },
        {
          title: '具体养护项目',
          align: "center",

          resizable: true,
          width: 110,
          render: function (h, params) {
            return h('span', params.row.projects)
          }
        },
        {
          title: '养护人姓名',
          align: "center",

          resizable: true,
          width: 110,
          render: function (h, params) {
            return h('span', params.row.yh_user.name)
          }
        },
        {
          title: '养护单位',
          align: "center",

          resizable: true,
          width: 100,
          render: function (h, params) {
            return h('span', params.row.unit)
          }
        },
        {
          title: '预计养护时间',
          align: "center",
          resizable: true,
          width: 110,
          render: function (h, params) {
            return h('span', params.row.predict_time)
          }
        },
        {
          title: '实际养护时间',
          align: "center",
          resizable: true,
          width: 110,
          render: function (h, params) {
            return h('span', params.row.actual_time)
          }
        },
        {
          title: '任务类型',
          align: "center",
          resizable: true,
          width: 110,
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
          resizable: true,
          width: 110,
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
          fixed: 'right',
          resizable: true,
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
              }, '编辑'),

              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '2px',
                  display: (params.row.state === '待养护') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    this.deleteConfirmModal = true
                    this.delete_id = params.row.id

                  }
                }
              }, '删除')
            ])
          }
        },
        {
          title: '古树养护历史',
          align: 'center',
          fixed: 'right',
          resizable: true,
          width: 120,
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
  mounted () {
    this.fetchData()
  },
  methods: {
    onPageSizeChange(page_size){
      this.pages._per_page = page_size
      this.fetchData()
    },
    ConfirmDelete(){
      deleteYhRecord(this.delete_id).then(msg=>{
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
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    fetchData () {
      this.query['yh_username'] = this.username
      let args = { ...this.query, ...this.pages }
      queryYhRecords(args).then(res => {
        this.data = res.data.yh_records
        this.total = res.data.total
      })
    },
    handleConfirmSuccess() {
      this.fetchData()
    },
    onShowTreeYhHistoryModalOK () {
      this.showTreeYhHistory = false
    },
    onShowTreeYhHistoryModalCancel () {
      this.showTreeYhHistory = false
    },
    //待养护填写的Modal框 取消，确认
    handleInsertConfirm() {
      this.taskInsert.show = false
      this.fetchData()
    },
    handleInsertCancel() {
      this.taskInsert.show = false
    },

    //查看
    handleRecordCancel () {
      this.showRecord = false
    },
    handleRecordConfirm () {
      this.showRecord = false
      this.fetchData()
    },


    treeNumberOptionChange (options) {
      this.query.tree_code = options
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
  },
  created() {
    const initializeTreeNumberList = () => {
      queryTreeBasic().then(message => {
        this.treeNumber.list = message.data.basic.map(item => {
          return item.tree_code
        })
      })
    }
    initializeTreeNumberList()
  }
}
</script>

<style scoped>
</style>
