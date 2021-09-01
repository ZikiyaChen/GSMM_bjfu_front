<template>
  <div>
    <Modal
      :value="updateAssignmentModal"
      title="任务分配修改"
      @on-ok="handleTaskConfirm"
      @on-cancel="handleTaskCancel">
      <Form :model="taskInfo" label-position="left" :label-width="100">
        <FormItem label="古树编号" >
          <Select
            multiple
            filterable
            v-model="taskInfo.treeNumber.modal"
            @on-change="treeNumberOptionChange"
            :remote-method="treeNumberRemoteMethod"
            :default-label="taskInfo.treeNumber.modal"
            :loading="this.taskInfo.treeNumber.loading"
            @on-set-default-options="setDefaultOptions">
            <Option v-for="(option, index) in this.taskInfo.treeNumber.codes" :value="option.value" :key="index">
              {{ option.label }}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="养护类型">
          <Select
            clearable
            @on-select="maintenanceTypeSelect"
            v-model="taskInfo.maintenanceType.modal"
            :default-label="taskInfo.maintenanceType.modal">
            <Option v-for="(option, index) in this.taskInfo.maintenanceType.options"
                    :value="option.value"
                    :key="index">
              {{ option.label }}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="养护人">
          <Select
            clearable
            ref="maintenancePeopleSelect"
            @on-select="maintenancePeopleSelect"
            v-model="taskInfo.maintenancePeople.modal"
            :default-label="taskInfo.maintenancePeople.modal">
            <Option v-for="(option, index) in this.taskInfo.maintenancePeople.options"
                    :value="option.value"
                    :key="index">
              {{ option.label }}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="预计养护时间">
          <Row>
            <Col span="24">
              <DatePicker
                ref="datePicker"
                @on-change="handleDateChange"
                :value="taskInfo.maintenanceDate"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请输入日期">
              </DatePicker>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>

import {queryTreeBasic} from "@/api/table";
import {getYhAllot, queryYhOptions, updateYhAllot} from "@/api/yh_manage";
import {queryUnitUsers} from "@/api/user";
import UserMixin from "@/mixin/UserMixin";

export default {
  name: "UpdateTaskAssignment",
  props:{
    showUpdateAssignment: Boolean,
    default: false,
    update_id: Number
  },
  mixins: [UserMixin],
  data(){
     return{
       updateAssignmentModal: this.showUpdateAssignment,
       treesCode: [],
       leaderName: '',
       taskInfo: {
         treeNumber: {
           list: [],
           codes: [],
           loading: false,
           modal: []
         },
         maintenanceType: {
           list: [],
           options: [],
           modal: '',
           currentType: ''
         },
         maintenancePeople: {
           list: [],
           options: [],
           nameMap: {},
           modal: '',
           currentName: ''
         },
         maintenanceDate: ''
       }
     }
  },
  methods:{
    handleTaskConfirm(){
      this.updateAssignmentModal = false
      let updateData = {
        trees: this.taskInfo.treeNumber.modal,
        yh_type: this.taskInfo.maintenanceType.modal,
        predict_time: this.taskInfo.maintenanceDate,
        yh_username: this.taskInfo.maintenancePeople.modal,
        create_by: this.username
      }
      updateYhAllot(this.update_id, updateData).then(message => {
        if (message.data.code === 200) {
          this.$Message.success('提交成功')
        } else {
          this.$Message.error('提交失败')
        }
        this.$emit('UpdateAssignmentConfirm')
      }).catch(error => {
        console.log(error)
        this.$Message.warning('请勿同一时间提交相同记录')
      })
    },
    handleTaskCancel(){
      this.updateAssignmentModal = false
      this.$emit('UpdateAssignmentCancel')
    },
    treeNumberOptionChange(){},
    treeNumberRemoteMethod(){},
    maintenanceTypeSelect(){},
    maintenancePeopleSelect(){},
    handleDateChange(value){
      console.log(value)
      this.taskInfo.maintenanceDate = value
    },
    setDefaultOptions(options){
      this.taskInfo.treeNumber.codes = options
    }


  },

  created () {
    const initializeData =() => {
      if(this.updateAssignmentModal) {
        getYhAllot(this.update_id).then(res => {
          let yh_allot = res.data.yh_allot

          this.taskInfo.maintenanceType.modal = yh_allot.yh_type
          this.taskInfo.treeNumber.modal = yh_allot.trees.split(',')
          this.taskInfo.maintenancePeople.modal = yh_allot.yh_username
          this.taskInfo.maintenanceDate = yh_allot.predict_time
        })
      }
    }
    initializeData()

    const initializeTreeNumberList = () => {
      queryTreeBasic().then(message => {
        this.taskInfo.treeNumber.codes = message.data.basic.map(item => {
          return {
            label:item.tree_code,
            value:item.tree_code
          }
        })
      })
    }
    initializeTreeNumberList()

    const initializeMaintenanceType = () => {
      queryYhOptions().then(message => {
        let classify = message.data.yh_classify
        for (let item of classify) {
          if (this.taskInfo.maintenanceType.list.indexOf(item.yh_type) < 0) {
            this.taskInfo.maintenanceType.list.push(item.yh_type)
          }
        }
        this.taskInfo.maintenanceType.options = this.taskInfo.maintenanceType.list.map(item => {
          return {
            label: item,
            value: item
          }
        })
      })
    }
    initializeMaintenanceType()

    const initializeMaintenancePeople = () => {
      queryUnitUsers({ is_yh: true }).then(message => {
        for (let item of message.data.users) {
          this.taskInfo.maintenancePeople.options.push({
            label: item.name,
            value: item.username
          })
        }
      })
    }
    initializeMaintenancePeople()
  },

}
</script>

<style scoped>

</style>
