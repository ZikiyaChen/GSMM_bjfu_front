<template>
  <Card>
    <Table :show-header="true" :data="data" :columns="columns"></Table>
    <!--      查看详细的养护记录信息， 以及修改-->
    <display-update-record
      v-if="showRecord"
      :id="id"
      :recordType="recordType"
      :maintenanceId="maintenanceId"
      @recordCancel="handleRecordCancel"
      @recordConfirm="handleRecordConfirm">
    </display-update-record>

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
</template>

<script>
import {deleteTreeInYhAllot, queryYhRecords} from "@/api/yh_manage";
import DisplayUpdateRecord from "@/view/YangHuManage/YhManage/componnets/DisplayUpdateRecord";

export default {
  name: "yh_record_extend_table",
  props: {
    selected_allot_order: String
  },
  components: { DisplayUpdateRecord },
  data () {
    return {
      data: [],
      showRecord: false,
      recordType: '',
      id: -1, // yh_record中的id
      maintenanceId: -1, // specific中的id

      deleteConfirmModal: false,
      delete_id: undefined,
      loading: true,

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
            if (params.row.state === '待养护') {
              return h('Tag', { props: { color: 'red' } }, '待养护')
            } else if (params.row.state === '草稿') {
              return h('Tag', { props: { color: 'default' } }, '草稿')
            } else {
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
                  // 可以将工单中尚未完成，即在待养护状态下的树 移除掉 ，即删除对应的yh_record
                  display: (params.row.state !== '待养护') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    console.log('删除', params.row)
                    this.delete_id = params.row.id
                    this.deleteConfirmModal = true
                  }
                }
              }, '移除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    fetchData () {
      queryYhRecords({ 'allot_order': this.selected_allot_order }).then(res => {
        this.data = res.data.yh_records
      })
    },
    //查看
    handleRecordCancel () {
      this.showRecord = false
    },
    handleRecordConfirm () {
      this.showRecord = false
      this.fetchData()
    },

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
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
