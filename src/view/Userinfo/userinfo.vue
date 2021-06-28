<template>
  <div>
    <edit-user-info ref="editUserInfo" @modify="getNewData"></edit-user-info>
    <reset-modal @hideModal="hideModal" :showResetModal="showResetModal"></reset-modal>
    <Row type="flex" justify="center" class="code-row-bg">
      <Col span="9" push="1">
        <Button type="info" @click="showResetModal=!showResetModal">重置密码</Button>
      </Col>
      <Col span="9" push="7">
        <Button type="success" @click="confirmModify">确认修改</Button>
      </Col>
    </Row>

  </div>
</template>

<script>

import EditUserInfo from "@/view/Userinfo/components/changeUserInfo/EditUserInfo";
import ResetModal from "@/view/Userinfo/components/changeUserInfo/ResetModal";
import { updateUser } from "@/api/user";

export default {
  name: "userinfo",
  components: {
    EditUserInfo,
    ResetModal
  },
  data () {
    return {
      showResetModal: false,
      userInfo: {}
    }
  },
  methods: {
    getNewData (newData) {
      this.userInfo = newData
    },
    hideModal (boolValue) {
      this.showResetModal = boolValue
    },
    confirmModify () {
      this.$refs.editUserInfo.$refs.userInfo.validate(valid => {
        if (valid) {
          let data = {
            id: this.userInfo.id,
            username: this.userInfo.userName,
            name: this.userInfo.name,
            tele: this.userInfo.telephone,
            sex: this.userInfo.gender,
            unit: this.userInfo.unit,
            role_names: this.userInfo.identities
          }

          updateUser(this.userInfo.id, data).then(message => {
            if (message.data.code === 200) {
              this.$Message.success("信息修改成功！")
            } else {
              this.$Message.error("信息修改失败！")
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
