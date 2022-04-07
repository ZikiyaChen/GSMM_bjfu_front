<template>
  <div>
    <Card>
    <h1>病虫害名称</h1>
    <br>
    <Button @click="showAddPestModal=true" type="primary" style="margin-bottom: 20px">添加病虫害名称</Button>
    <Table border stripe :columns="columns" :data="data" width="400" size="small">
      <template slot-scope="{ row, index }" slot="name">
        <Input type="text" v-model="editName" v-if="editIndex === index" />
        <span v-else>{{ row.name }}</span>
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
    </Card>
    <AddPestNameModal
      :show="showAddPestModal"
      @onOK="AddPestNameok"
      @onCancel="AddPestNamecancel">
    </AddPestNameModal>
  </div>
</template>

<script>


import {
  AddPestName,
  deletePestName,
  getPestName,
  updatePestNames,
} from "@/api/yh_manage";
import AddPestNameModal from "@/view/OptionManage/AddPestNameModal";

export default {
  name: "index",
  components: {AddPestNameModal},
  data(){
     return{
       showAddPestModal: false,
       data:[],
       total: 0,
       editIndex: -1,  // 当前聚焦的输入框的行数
       editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁

       columns: [
         {
           type: 'index',
           width: 60,
           align: 'center'
         },
         {
           title: '病虫害名称',
           align: 'center',
           slot: 'name'
         },

         {
           title: '操作',
           align: 'center',
           slot: 'action'
         }
       ],
    }
  },
  methods: {
    AddPestNameok(value){
      AddPestName(value).then(res=>{
        if(res.data.code === 200){
          this.$Message.success('添加成功')
          this.fetchData()
        }else {
          this.$Message.error('添加失败')
        }
      })
      this.showAddPestModal = false
    },
    AddPestNamecancel(){
      this.showAddPestModal = false
    },

    handleEdit (row, index) {
      this.editName = row.name;
      this.editIndex = index;
    },
    handleSave (row,index) {
      this.data[index].name = this.editName;
      updatePestNames(row.id, { 'name': this.editName }).then((Resp) => {
        if (Resp.data.code === 200) {
          this.$Message.success({ content: '修改成功' })
          this.fetchData()
        } else {
          this.$Message.error('修改失败')
        }
      })
      this.editIndex = -1;
    },

    handleDelete(row, index){
      deletePestName(row.id).then((res=>{
        if(res.data.code === 200){
          this.$Message.success('删除成功')
          this.fetchData()
        }else {
          this.$Message.error('删除失败')
        }
      }))
    },

    fetchData(){
      getPestName().then(res=>{
        this.data = res.data.names
        this.total = res.data.total
      })

    }
  },
  mounted() {
    this.fetchData()

  }
}
</script>

<style scoped>

</style>
