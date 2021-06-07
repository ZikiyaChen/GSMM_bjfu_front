<template>
  <div>
    <Row>
      <Col span="11">
        <Button @click="showAddMeasure=true" type="primary" style="margin-bottom: 20px">添加养护项目</Button>
        <Table border stripe :columns="columns" :data="Measuresdata"  size="small"  >
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
      </Col>

      <Col span="11" offset="2">
        <Button @click="showAddMethod=true" type="primary" style="margin-bottom: 20px">添加处理方法</Button>
        <Table border stripe :columns="Methodcolumns" :data="Methodsdata"  size="small">
          <template slot-scope="{ row, index }" slot="method">
            <Input type="text" v-model="editMethod" v-if="editIndexM === index" />
            <span v-else>{{ row.method }}</span>
          </template>

          <template slot-scope="{ row, index }" slot="action">
            <div v-if="editIndexM === index">
              <Button @click="handleSave1(row,index)" type="primary" size="small" style="margin-right: 15px">保存</Button>
              <Button @click="editIndexM = -1" type="warning" size="small">取消</Button>
            </div>
            <div v-else>
              <Button @click="handleEdit1(row, index)" type="primary" size="small">修改</Button>
              <Button @click="handleDelete1(row, index)" type="error" size="small" style="margin-left: 15px">删除</Button>
            </div>

          </template>
        </Table>
      </Col>
    </Row>


    <AddMeasureModal
      :show="showAddMeasure"
      :yh_type="selected_yh_type"
      @onOK="AddMeasureok"
      @onCancel="AddMeasurecancel">
    </AddMeasureModal>

    <AddMethodModal
      :show="showAddMethod"
      :yh_type="selected_yh_type"
      @onOK="AddMethodok"
      @onCancel="AddMethodcancel">
    </AddMethodModal>
  </div>
</template>

<script>
import AddMeasureModal from "@/view/YangHuManage/Yh_options/AddMeasuresModal/AddMeasureModal";
import AddMethodModal from "@/view/YangHuManage/Yh_options/AddMethodsModal/AddMethodModal";
import {
  AddMeasures,
  AddMethods,
  deleteYhMeasure,
  deleteYhMethod, queryMeasures, queryMethods,
  updateYhMeasure,
  updateYhMethod
} from "@/api/yh_manage";

export default {
  name: "EnvironmentProtect",
  components: {AddMeasureModal,AddMethodModal},
  data(){
    return{

      showAddMeasure: false,
      showAddMethod: false,
      Measuresdata:[],
      editIndex: -1,  // 当前聚焦的输入框的行数
      editMeasure: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
      selected_yh_type: '生长环境保护与改善',


      Methodsdata: [],
      editIndexM: -1,
      editMethod: '',

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

      Methodcolumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '处理方法',
          align: 'center',
          slot: 'method'
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
    this.fetchMethods()
  },
  methods:{

    handleEdit (row, index) {
      this.editMeasure = row.measure;
      this.editIndex = index;
    },
    handleSave (row,index) {
      this.Measuresdata[index].measure = this.editMeasure;
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

    handleEdit1 (row, index) {
      this.editMethod = row.method;
      this.editIndexM = index;
    },
    handleSave1 (row,index) {
      this.Methodsdata[index].method = this.editMethod;
      updateYhMethod(row.id, { 'method': this.editMethod }).then((Resp) => {
        if (Resp.data.code === 200) {
          this.$Message.success({ content: '修改成功' })
          this.fetchMethods()
        } else {
          this.$Message.error('修改失败')
        }
      })
      this.editIndexM = -1;
    },

    handleDelete1(row, index){
      deleteYhMethod(row.id).then((res=>{
        if(res.data.code === 200){
          this.$Message.success('删除成功')
          this.fetchMethods()
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

    AddMeasureok(yh_measure){
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
    AddMeasurecancel(){
      this.showAddMeasure=false
    },

    AddMethodok(yh_method){
      console.log('###',yh_method)
      AddMethods(yh_method).then((res=>{
        if(res.data.code === 200){
          this.$Message.success('添加成功')
          this.fetchMethods()
        }else {
          this.$Message.error('添加失败')
        }
      }))
      this.showAddMethod=false
    },
    AddMethodcancel(){
      this.showAddMethod=false
    },

    fetchMeasures(){
      queryMeasures({'yh_type':'生长环境保护与改善'}).then((measures=>{
        this.Measuresdata = measures.data.yh_measures
      }))
    },
    fetchMethods(){
      queryMethods({'yh_type':'生长环境保护与改善'}).then((res=>{
        this.Methodsdata = res.data.yh_methods
      }))
    }

  }
}
</script>

<style scoped>

</style>
