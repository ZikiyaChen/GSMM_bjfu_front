<template>
<div>
  <Modal :value="show"
         title="添加树"
         @on-ok="handleOK"
         @on-cancel="handleCancel" @on-visible-change="initTreesList">
    <Form :model="taskInfo" label-position="left" :label-width="100">
      <FormItem label="古树编号">
        <Select
          multiple
          filterable
          v-model="taskInfo.treeNumber.modal"
          @on-change="treeNumberOptionChange"
          :remote-method="treeNumberRemoteMethod"
          :loading="this.taskInfo.treeNumber.loading">
          <Option v-for="(option, index) in this.taskInfo.treeNumber.codes" :value="option.value" :key="index">
            {{ option.label }}
          </Option>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
import {queryTreeBasic, queryTreeBasicProperty} from "@/api/table";
import {addTreeToAllot} from "@/api/yh_manage";

export default {
  name: "AddTreeToAllotModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: Number,
    trees: String,
    onCancel: Function,
    onOK: Function,
  },
  data(){
    return{
      treesCode: [],
      taskInfo: {
        treeNumber: {
          list: [],
          codes: [],
          loading: false,
          modal: ''
        }
      }
    }
  },
  methods:{
    handleOK(){
      console.log('add',this.treesCode)
      let data={
        treesCode: this.treesCode
      }
      addTreeToAllot(this.id, data).then(res=>{
        if(res.data.code === 200){
          this.$Message.success('成功')
        }else {
          this.$Message.error('失败')
        }
        this.$emit('handleOK')
      })
    },
    handleCancel(){
      this.$emit('handleCancel')
    },
    initTreesList(){
      if(this.show) {
        let treesCode = this.trees.split(',')
        console.log('treesCode', treesCode)
        queryTreeBasicProperty().then(message => {
          this.taskInfo.treeNumber.list = message.data.trees_basic_property.map(item => {
            if (!treesCode.includes(item.tree_code)) {
              return item.tree_code
            } else {
              return ''
            }
          })
        })
      }
    },

    treeNumberOptionChange (options) {
      this.treesCode = options
      console.log(this.treesCode)
    },

    treeNumberRemoteMethod (query) {
      if (query !== '') {
        this.taskInfo.treeNumber.loading = true;
        setTimeout(() => {
          this.taskInfo.treeNumber.loading = false;
          console.log('list',this.taskInfo.treeNumber.list)
          const list = this.taskInfo.treeNumber.list.map(item => {
            return {
              value: item,
              label: item
            };
          });
          this.taskInfo.treeNumber.codes = list.filter(item => item.label.indexOf(query) > -1);
        });
      } else {
        this.taskInfo.treeNumber.codes = [];
      }
    },
  },

  // created() {
  //   const initializeTreeNumberList = () => {
  //
  //     console.log(this.trees)
  //     queryTreeBasic().then(message => {
  //       this.taskInfo.treeNumber.list = message.data.basic.map(item => {
  //         return item.tree_code
  //       })
  //     })
  //   }
  //   initializeTreeNumberList()
  // }

}
</script>

<style scoped>

</style>
