<template>
  <div>
    <Button type="info" @click="handleDailyClick">日常养护管理</Button>
    <daily-maintenance :showDailyMaintenance="showDailyMaintenance"  @dailyCancel="handleDailyClick"></daily-maintenance>

    <Button type="info" @click="handleTrimClick">修剪工作</Button>
    <trim-work :showTrimWork="showTrimWork"  @trimCancel="handleTrimClick"></trim-work>

    <Button type="info" @click="handleTreeProtectionClick">树体保护措施</Button>
    <tree-protection :showTreeProtection="showTreeProtection" @treeProtectionCancel="handleTreeProtectionClick"></tree-protection>

    <Button type="info" @click="handlePestControlClick">病虫害防护</Button>
    <pest-control :showPestControl="showPestControl" @pestControlCancel="handlePestControlClick"></pest-control>

    <Button type="info" @click="handleTreeInspectionClick">古树巡查</Button>
    <tree-inspection :showTreeInspection="showTreeInspection" @treeInspectionCancel="handleTreeInspectionClick"></tree-inspection>

    <Button type="info" @click="handleGrowthDetectionClick">古树生长指标检测</Button>
    <growth-detection :showGrowthDetection="showGrowthDetection" @treeInspectionCancel="handleGrowthDetectionClick"></growth-detection>
    <Card>

      <Table stripe :columns="columns" :data="data" border></Table>
      <TreeYhHistory
        :show="showTreeYhHistory"
        :tree_code="selected_tree_code"
        @onOK="onShowTreeYhHistoryModalOK"
        @onCancel="onShowTreeYhHistoryModalCancel">
      </TreeYhHistory>
    </Card>
  </div>

</template>

<script>
import DailyMaintenance from "@/view/YangHuManage/YhManage/componnets/DailyMaintenance";
import TrimWork from "@/view/YangHuManage/YhManage/componnets/TrimWork";
import TreeProtection from "@/view/YangHuManage/YhManage/componnets/TreeProtection";
import PestControl from "@/view/YangHuManage/YhManage/componnets/PestControl";
import TreeInspection from "@/view/YangHuManage/YhManage/componnets/TreeInspection";
import GrowthDetection from "@/view/YangHuManage/YhManage/componnets/GrowthDetection";
import TreeYhHistory from "@/view/YangHuManage/YhManage/componnets/TreeYhHistory";
import UserMixin from "@/mixin/UserMixin";
import {queryYhRecords} from "@/api/yh_manage";

export default {
  name: "yh_own_record",
  components: {
    DailyMaintenance,
    TrimWork,
    TreeProtection,
    PestControl,
    TreeInspection,
    GrowthDetection,
    TreeYhHistory
  },
  mixins: [UserMixin],
  data () {
    let that = this
    return {
      showDailyMaintenance: false,
      showTrimWork: false,
      showTreeProtection: false,
      showPestControl: false,
      showTreeInspection: false,
      showGrowthDetection: false,

      showTreeYhHistory: false,
      data: [],
      selected_tree_code: undefined,
      query: {
        state: undefined,
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
            if (params.row.work_type === '分配') {
              return h('Tag', { props: { color: 'red' } }, '分配')
            }  else {
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
          filterRemote: function (value,row) {
            console.log(value)//  value是数组类型
            if(value.length ===0){ // 选择“全部”时， value数组为空
              that.query.state = undefined
              that.fetchData()
            }else {
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
  mounted() {
    this.fetchData()
  },
  methods: {
    handleDailyClick () {
      this.showDailyMaintenance = !this.showDailyMaintenance
    },
    handleTrimClick () {
      this.showTrimWork = !this.showTrimWork
    },
    handleTreeProtectionClick () {
      this.showTreeProtection = !this.showTreeProtection
    },
    handlePestControlClick () {
      this.showPestControl = !this.showPestControl
    },
    handleTreeInspectionClick () {
      this.showTreeInspection = !this.showTreeInspection
    },
    handleGrowthDetectionClick () {
      this.showGrowthDetection = !this.showGrowthDetection
    },

    fetchData(){
      console.log('@@@',this.username)
      this.query['yh_username'] = this.username
      let args = { ...this.query, ...this.pages }
      queryYhRecords(args).then(res => {
        this.data = res.data.yh_records
      })
    },
    onShowTreeYhHistoryModalOK(){
      this.showTreeYhHistory = false
    },
    onShowTreeYhHistoryModalCancel(){
      this.showTreeYhHistory = false
    },
  }
}
</script>

<style scoped>

</style>
