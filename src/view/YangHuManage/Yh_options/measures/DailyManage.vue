<template>
  <div>
    <Button @click="showAddMeasure=true" type="primary" style="margin-bottom: 20px">添加养护项目</Button>
    <Table border stripe :columns="columns" :data="data" width="400" size="small">
      <template slot-scope="{ row, index }" slot="measure">
        <Input type="text" v-model="editMeasure" v-if="editIndex === index" />
        <span v-else>{{ row.measure }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button @click="handleSave(row,index)" type="primary" size="small" style="margin-right: 15px">保存</Button>
          <Button @click="editIndex = -1" type="warning" size="small">取消</Button>
        </div>
        <div v-else>
          <Button @click="handleEdit(row, index)" type="primary" size="small">修改</Button>
          <Button @click="handleDelete(row, index)" type="error" size="small" style="margin-left: 15px">删除</Button>
        </div>

      </template>
    </Table>
    <AddMeasureModal
      :show="showAddMeasure"
      :yh_type="selected_yh_type"
      @onOK="Addok"
      @onCancel="Addcancel">
    </AddMeasureModal>
  </div>

</template>

<script>
import {AddMeasures, deleteYhMeasure, queryMeasures, updateYhMeasure} from "@/api/yh_manage";
import AddMeasureModal from "@/view/YangHuManage/Yh_options/AddMeasuresModal/AddMeasureModal";

export default {
  name: "DailyManage",
  components: {AddMeasureModal},
  data(){
    return{
      showAddMeasure: false,
      data:[],
      editIndex: -1,  // 当前聚焦的输入框的行数
      editMeasure: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
      selected_yh_type: '日常养护管理',

      // columns: [
      //   {
      //     title: '养护管理项目名称',
      //     align: 'center',
      //     render: function (h, params) {
      //       if (params.row.$isEdit) {
      //         return h('Input', {
      //           props: {
      //             value: params.row.measure
      //           },
      //           on: {
      //             input: function (event) {
      //               params.row.measure = event
      //             }
      //           }
      //         })
      //       } else {
      //         return h('span', params.row.measure)
      //       }
      //     }
      //   },
      //
      //
      //   {
      //     title: '操作',
      //     align: 'center',
      //     width: '170px',
      //     render: (h, params) => {
      //       return h('div', [
      //         h('Button', {
      //           props: {
      //             type: params.row.$isEdit ? 'warning' : 'info',
      //             size: 'small',
      //             icon: ''
      //           },
      //           style: {
      //             marginRight: '2px'
      //           },
      //           on: {
      //             click: () => {
      //               if (params.row.$isEdit) {
      //                 this.handleSave(params.row)
      //               } else {
      //                 this.handleEdit(params.row)
      //               }
      //             }
      //           }
      //         }, params.row.$isEdit ? '保存' : '修改'),
      //
      //
      //         h('Button', {
      //           props: {
      //             type: 'error',
      //             size: 'small',
      //
      //           },
      //           style: {
      //             marginRight: '2px'
      //           },
      //           on: {
      //             click: () => {
      //
      //             }
      //           }
      //         }, '删除'),
      //
      //
      //
      //       ])
      //     }
      //   }
      // ]

      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '养护项目名称',
          align: 'center',
          slot: 'measure'
        },

        {
          title: '操作',
          align: 'center',
          slot: 'action'
        }
      ],


    }
  },
  mounted() {
    this.fetchMeasures()
  },
  methods:{
    handleEdit (row, index) {
      this.editMeasure = row.measure;
      this.editIndex = index;
    },
    handleSave (row,index) {
      this.data[index].measure = this.editMeasure;
      updateYhMeasure(row.id, { 'measure': this.editMeasure }).then((Resp) => {
        if (Resp.data.code === 200) {
          this.$Message.success({ content: '修改成功' })
          this.fetchMeasures()
        } else {
          this.$Message.error('修改失败')
        }
      })
      this.editIndex = -1;
    },

    handleDelete(row, index){
      deleteYhMeasure(row.id).then((res=>{
        if(res.data.code === 200){
          this.$Message.success('删除成功')
          this.fetchMeasures()
        }else {
          this.$Message.error('删除失败')
        }
      }))
    },

    // // 点击了修改按钮
    // handleEdit (row) {
    //   this.$set(row, '$isEdit', true)
    // },
    // //点击了保存按钮
    // handleSave (row) {
    //   updateYhMeasure(row.id, { 'measure': row.measure }).then((Resp) => {
    //     if (Resp.data.code === 200) {
    //       this.$Message.success({ content: '修改成功' })
    //       this.fetchMeasures()
    //     } else {
    //       this.$Message.error('修改失败')
    //     }
    //   })
    //   this.$set(row, '$isEdit', false)
    // },

    Addok(yh_measure){
      console.log('###',yh_measure)
      AddMeasures(yh_measure).then((res=>{
        if(res.data.code === 200){
          this.$Message.success('添加成功')
          this.fetchMeasures()
        }else {
          this.$Message.error('添加失败')
        }
      }))
      this.showAddMeasure=false
    },
    Addcancel(){
      this.showAddMeasure=false
    },
    fetchMeasures(){
      queryMeasures({'yh_type':'日常养护管理'}).then((measures=>{
        this.data = measures.data.yh_measures

      }))
    }

  }
}
</script>

<style scoped>

</style>
