<template>
  <div>

    <task-assignment
      v-if="showTaskModal"
      :showTaskModal="showTaskModal"
      @taskAssignmentCancel="handleTaskAssignmentClick"
      @taskAssignmentConfirm="ConfirmTaskAssignmentClick"></task-assignment>
    <Card>
      <h1>养护任务分配</h1>
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
        <FormItem label="养护人姓名:" prop="yh_username" v-role="['单位管理员']">
          <Select v-model="query.yh_username" placeholder="养护人姓名" filterable
                  @on-query-change="onYhUserUnitQueryChange" clearable style="width: 180px">
            <Option v-for="item in yhUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="预计养护时间:" >
          <DatePicker :value="predict_time_range"  type="daterange" format="yyyy-MM-dd"
                      placement="bottom-end" placeholder="Select date"
                      @on-change="DateChange"
                      clearable style="width: 180px"></DatePicker>
        </FormItem>

        <FormItem >
          <Button type="primary" @click="onSearch">查询</Button>
          <Button
            type="info"
            @click="handleTaskAssignmentClick"
            style="margin-left: 15px">
            任务分配
          </Button>
        </FormItem>

      </Form>

      <Table stripe :columns="columns" :data="data" border></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
        </div>
      </div>
<!--      删除确认  -->
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

      <UpdateTaskAssignment
        v-if="showUpdateAssignmentModal"
        :showUpdateAssignment="showUpdateAssignmentModal"
        :update_id="update_id"
        @UpdateAssignmentConfirm="UpdateAssignmentConfirm"
        @UpdateAssignmentCancel="UpdateAssignmentCancel"></UpdateTaskAssignment>

      <AddTreeToAllotModal
        :show="showAddTreeToAllot"
        :id="select_id"
        :trees="select_trees"
        @handleOK="AddTreeConfirm"
        @handleCancel="AddTreeCancel">

      </AddTreeToAllotModal>

    </Card>
  </div>
</template>

<script>
import {getUserInfo, queryUnitUsers} from "@/api/user";
import {deleteYhAllot, deleteYhRecord, queryYhAllots} from "@/api/yh_manage";
import yh_record_extend_table from "@/view/YangHuManage/components/yh_record_extend_table";
import TaskAssignment from "@/view/YangHuManage/YhManage/componnets/TaskAssignment";
import UserMixin from "@/mixin/UserMixin";
import {yhTypeList} from "@/view/YangHuManage/YhManage/componnets/someoptions";
import {queryTreeBasic} from "@/api/table";
import UpdateTaskAssignment from "@/view/YangHuManage/YhManage/componnets/UpdateTaskAssignment";
import AddTreeToAllotModal from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/AddTreeToAllotModal";

export default {
  name: "yh_allot_manage",
  components: {
    AddTreeToAllotModal,
    UpdateTaskAssignment,
    TaskAssignment
  },
  mixins: [UserMixin],
  data () {
    return {
      showAddTreeToAllot: false,
      select_id: undefined,
      select_trees: undefined,

      predict_time_range: undefined,

      showUpdateAssignmentModal: false,
      update_id: undefined,

      deleteConfirmModal: false,
      delete_id: undefined,
      loading: true,

      yhUsers: [],

      YhTypeList: yhTypeList,
      treeNumber: {
        list: [],
        codes: [],
        loading: false,
        modal: ''
      },

      showTaskModal: false,
      query: {
        group_name: undefined
      },
      selected_allot_order: undefined,
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      data: [],
      total: 0,

      columns: [
        {
          type: 'expand',
          title: '',
          width: 50,
          render: (h, params) => {
            return h(yh_record_extend_table, {
              props: {
                selected_allot_order: params.row.allot_order
              }
            })
          }
        },
        {
          title: '工单编号',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.allot_order)
          }
        },
        {
          title: '古树编号',
          align: 'center',
          width: 200,
          render: function (h, params) {
            let trees = params.row.trees.split(',')
            let tags = trees.map((item) => {
              return h('Tag', item)
            })
            return h('span', tags)
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
          title: '总任务数',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.trees.split(',').length)
          }
        },
        {
          title: '已完成数',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.finished_num)
          }
        },

        {
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },

                style: {
                  marginRight: '2px',
                  // 只有当该工单没有人完成时，才可以修改
                  display: (params.row.finished_num !== 0) ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    this.update_id = params.row.id
                    this.showUpdateAssignmentModal = true
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },

                style: {
                  marginRight: '2px',
                  // 在工单中增加一棵树的任务
                  // 只有当该工单没有人完成时，才可以修改
                  display: (params.row.finished_num !== 0) ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    this.delete_id = params.row.id
                    this.deleteConfirmModal = true
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },

                style: {
                  marginRight: '2px',
                  // 在工单中增加一棵树的任务
                },
                on: {
                  click: () => {
                    this.select_id = params.row.id
                    this.select_trees = params.row.trees
                    this.showAddTreeToAllot = true
                  }
                }
              }, '添加树')

            ])
          }
        }
      ]
    }
  },
  methods: {
    AddTreeConfirm(){
      this.showAddTreeToAllot = false
      this.fetchData()
    },
    AddTreeCancel(){
      this.showAddTreeToAllot = false
    },
    //时间发生变化时
    DateChange(value){
      if(value[0]!==''&&value[1]!=='') {
        this.query.predict_time_gte = value[0]
        this.query.predict_time_lte = value[1]
      }else {
        this.query.predict_time_gte = undefined
        this.query.predict_time_lte = undefined
      }
    },
    treeNumberOptionChange (options) {
      this.query.trees_likemohu = options
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
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    onSearch() {
      this.pages._page=1
      this.fetchData()
    },
    fetchData () {
      let args = { ...this.query, ...this.pages }
      queryYhAllots(args).then(resp => {
        this.data = resp.data.yh_allots
        this.total = resp.data.total
      })
    },
    onYhUserUnitQueryChange(value){
      queryUnitUsers({name_like: value, is_yh:true}).then(res => {
        this.yhUsers = res.data.users
      })
    },
    handleTaskAssignmentClick() {
      this.showTaskModal = !this.showTaskModal
      this.fetchData()
    },
    ConfirmTaskAssignmentClick(){
      this.showTaskModal = !this.showTaskModal
      this.fetchData()
    },

    //删除确认------
    ConfirmDelete(){
      deleteYhAllot(this.delete_id).then(msg=>{
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
    UpdateAssignmentConfirm(){
      this.showUpdateAssignmentModal = false
      this.fetchData()
    },
    UpdateAssignmentCancel(){
      this.showUpdateAssignmentModal = false
      this.fetchData()
    },
  },
  mounted () {
    this.fetchData()
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

    queryUnitUsers({is_yh:true}).then(res => {
      this.yhUsers = res.data.users
    })
  }

}
</script>

<style scoped>

</style>
