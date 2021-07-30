<template>
  <div>
    <Button type="primary" @click="handleAddClick">个人养护记录添加</Button>
    <Modal
      :value="radioModal"
      title="选择表单种类"
      @on-ok="handleRadioClick"
      @on-cancel="handleRadioCancel"
      width="62"
      class-name="vertical-center-modal">
      <RadioGroup v-model="formType">
        <Radio label="日常养护管理" border></Radio>
        <Radio label="修剪工作" border></Radio>
        <Radio label="树体保护措施" border></Radio>
        <Radio label="生长环境保护与改善" border></Radio>
        <Radio label="病虫害防护" border></Radio>
        <Radio label="古树巡查" border></Radio>
        <Radio label="古树生长指标检测" border></Radio>
      </RadioGroup>
    </Modal>

    <component
      :is="componentName"
      @cancelOrConfirm="handleCancelOrConfirm">
    </component>

    <Modal
      v-model="noticeModal"
      title="提示"
      footer-hide
      class-name="vertical-center-modal"
      :closable="false"
      :mask-closable="false">
      <Row>
        <Col span="10" offset="7">
          <Checkbox
            v-model="saveFlag">
            添加完后保留本窗口，继续添加
          </Checkbox>
        </Col>
      </Row>
      <Row>
        <Col offset="9" span="1">
          <Button @click="handleSaveClick">
            保存
          </Button>
        </Col>
        <Col span="1" offset="2">
          <Button @click="handleCloseClick">关闭</Button>
        </Col>
      </Row>
    </Modal>
  </div>

</template>

<script>
import DailyMaintenance from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/DailyMaintenance";
import TrimWork from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TrimWork";
import TreeProtection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TreeProtection";
import EnvironmentProtection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/EnvironmentProtection";
import PestControl from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/PestControl";
import TreeInspection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/TreeInspection";
import GrowthDetection from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/GrowthDetection";
import { insertRecordByTypeSelf } from "@/api/yh_manage";
import { mapMutations } from "vuex";
export default {
  name: "RecordAdd",
  components: {
    DailyMaintenance,
    TrimWork,
    TreeProtection,
    EnvironmentProtection,
    PestControl,
    TreeInspection,
    GrowthDetection
  },
  data () {
    return {
      componentName: '',
      projectName: '',
      result: {},
      saveFlag: false,
      noticeModal: false,
      radioModal: false,
      formType: '日常养护管理',
    }
  },
  methods: {
    ...mapMutations('maintenanceForm', {
      changeLoading: 'changeLoading',
    }),
    handleAddClick () {
      this.radioModal = !this.radioModal
    },
    initializeRadioOption () {
      this.formType = '日常养护管理'
      this.radioModal = !this.radioModal
    },
    handleRadioCancel () {
      this.initializeRadioOption()
    },
    handleRadioClick () {
      switch (this.formType) {
        case '日常养护管理':
          this.componentName = 'DailyMaintenance'
          this.projectName = '日常养护管理'
          break;
        case '修剪工作':
          this.componentName = 'TrimWork'
          this.projectName = '修剪'
          break;
        case '树体保护措施':
          this.componentName = 'TreeProtection'
          this.projectName = '树体保护措施'
          break;
        case '生长环境保护与改善':
          this.componentName = 'EnvironmentProtection'
          this.projectName = '生长环境保护与改善'
          break;
        case '病虫害防护':
          this.componentName = 'PestControl'
          this.projectName = '病虫害防治'
          break;
        case '古树巡查':
          this.componentName = 'TreeInspection'
          this.projectName = '巡查工作'
          break;
        case '古树生长指标检测':
          this.componentName = 'GrowthDetection'
          this.projectName = '古树生长指标检测'
          break;
      }
      this.initializeRadioOption()
    },
    handleCancelOrConfirm (type, result) {
      if (type === 'cancel') {
        this.componentName = ''
      } else if (type === 'confirm') {
        this.noticeModal = !this.noticeModal
        this.result = result
      }
    },
    handleSaveClick () {
      if (!this.saveFlag) {
        this.componentName = ''
      }
      this.result.state = '已完成'
      insertRecordByTypeSelf(this.projectName, this.result).then(message => {
        if (message.status === 200) {
          this.$Message.success('提交成功')
        } else {
          this.$Message.error('提交失败')
        }
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.$Message.warning('请勿同一时间提交相同记录')
      })
      this.handleCloseClick()
    },
    handleCloseClick () {
      this.noticeModal = !this.noticeModal
      this.changeLoading()
      // 异步更改，保持窗口loading永远为true，让窗口不会因为点击确定而关闭，这样下一个弹窗出现，该表单窗口仍然存在
      this.$nextTick(() => {
        this.changeLoading()
      })
    }
  }
}
</script>

<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
</style>
