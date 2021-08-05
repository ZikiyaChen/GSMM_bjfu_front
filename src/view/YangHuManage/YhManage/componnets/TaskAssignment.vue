<template>
  <div>
    <Button
      type="info"
      @click="handleTaskAssignmentClick">
      任务分配
    </Button>
    <Modal
      v-model="taskModal"
      title="任务分配"
      @on-ok="handleTaskConfirm"
      @on-cancel="handleTaskCancel">
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

        <FormItem label="养护类型">
          <Select
            clearable
            @on-select="maintenanceTypeSelect"
            v-model="taskInfo.maintenanceType.modal">
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
            v-model="taskInfo.maintenancePeople.modal">
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
                format="yyyy年MM月dd日"
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
import { queryTreeBasicProperty } from "@/api/table";
import { insertMaintenanceAllot, queryYhOptions } from "@/api/yh_manage";
import { queryGroupUsers, queryUnitUsers } from "@/api/user";

export default {
  name: 'TaskAssignment',
  data () {
    return {
      taskModal: false,
      treesCode: [],
      leaderName: '',
      taskInfo: {
        treeNumber: {
          list: [],
          codes: [],
          loading: false,
          modal: ''
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
  methods: {
    handleTaskAssignmentClick () {
      this.taskModal = true
    },
    handleTaskCancel () {
      this.taskModal = false
    },
    handleTaskConfirm () {
      const findUserName = (currentName) => {
        const nameMap = this.taskInfo.maintenancePeople.nameMap
        for (let key in nameMap) {
          if (nameMap[key] === currentName) {
            return key
          }
        }
      }
      let yh_username = findUserName(this.taskInfo.maintenancePeople.currentName)
      console.log(yh_username)
      let result = {
        trees: this.treesCode,
        yh_username: yh_username,
        yh_type: this.taskInfo.maintenanceType.currentType,
        predict_time: this.taskInfo.maintenanceDate,
        create_by: this.leaderName
      }
      insertMaintenanceAllot(result).then(message => {
        if (message.status === 200) {
          this.$Message.success('提交成功')
        } else {
          this.$Message.error('提交失败')
        }
      }).catch(error => {
        console.log(error)
        this.$Message.warning('请勿同一时间提交相同记录')
      })
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
    maintenanceTypeSelect (option) {
      this.taskInfo.maintenanceType.currentType = option.value
    },
    maintenancePeopleSelect (option) {
      this.taskInfo.maintenancePeople.currentName = option.value
    },
    handleDateChange (date) {
      date = date.replace('年', '-').replace('月', '-').replace('日', '')
      this.taskInfo.maintenanceDate = date
    },
    monitorWindowChange () {
      this.$refs.datePicker.$el.style.width = this.$refs.registerInput.$el.offsetWidth + 'px'
    }
  },
  created () {
    const initializeTreeNumberList = () => {
      queryTreeBasicProperty().then(message => {
        this.taskInfo.treeNumber.list = message.data.trees_basic_property.map((item) => {
          return item.tree_code
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
        console.log(message)
        for (let item of message.data.users) {
          this.taskInfo.maintenancePeople.list.push(item.name)
          this.taskInfo.maintenancePeople.nameMap[item.username] = item.name
          if (item.is_group_leader) {
            this.leaderName = item.username
          }
        }
        this.taskInfo.maintenancePeople.options = this.taskInfo.maintenancePeople.list.map(item => {
          return {
            label: item,
            value: item
          }
        })
      })
    }
    initializeMaintenancePeople()

    const initializeDateInfo = () => {
      let dateInfo = new Date()
      this.taskInfo.maintenanceDate = `${dateInfo.getFullYear()}-${dateInfo.getMonth() + 1}-${dateInfo.getDate()}`
    }
    initializeDateInfo()
  },

  updated () {
    this.$refs.datePicker.$el.style.width = this.$refs.maintenancePeopleSelect.$el.offsetWidth + 'px'
    window.addEventListener('resize', this.monitorWindowChange)
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.monitorWindowChange)
  }
}
</script>

<style scoped>

</style>
