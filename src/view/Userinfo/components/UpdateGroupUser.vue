<template>
  <Modal
    :value="show"
    title="修改"
    :loading="loading"
    @on-ok="handleSubmit"
    @on-cancel="handleCancel"
    @on-visible-change="getGroupUserInfo"
    width="350px">
    <Form :model="new_group_user" ref="group_user_form" :rules="ruleValidate" :label-width="70" >

      <FormItem prop="username" label="用户名:" class="TextColor">
        <Input v-model="new_group_user.username" disabled style="width: 150px"></Input>
      </FormItem>
      <FormItem prop="name" label="姓名:"  class="TextColor">
        <Input v-model="new_group_user.name" disabled style="width: 150px"></Input>
      </FormItem>
      <FormItem label="组别:"  prop="group_name">
        <Select v-model="new_group_user.group_name"  style="width: 150px" clearable >
          <Option v-for="item in groups" :value="item.group_name" :key="item.group_name" >{{ item.group_name }}</Option>
        </Select>
      </FormItem>

      <FormItem label="身份:">
        <Checkbox  v-model="new_group_user.is_group_leader">
          <span>组长</span>
        </Checkbox>
      </FormItem>

    </Form>
  </Modal>
</template>

<script>
import UserMixin from "@/mixin/UserMixin";
import store from "@/store";
import {queryGroups, queryGroupUsers, queryUsers} from "@/api/user";

export default {
  name: "UpdateGroupUser",
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function,
    group_type: String,
    id: Number
  },
  mixins: [UserMixin],
  data(){
    return{
      user_access: store.getters && store.getters.access,
      current_user: {},
      loading: false,

      new_group_user: {},
      groups: [],
      users: [],
      ruleValidate:{
        group_name: [{required: true, message: '请选择', trigger: 'change'}],
      }
    }
  },
  methods:{

    getGroupUserInfo(){
      queryGroupUsers({'id':this.id}).then((res=>{
        this.new_group_user = res.data.group_users[0]
      }))
      queryGroups({'group_type':this.group_type}).then((res=>{
        this.groups = res.data.groups
      }))
    },


    handleSubmit(){
      this.$refs.group_user_form.validate((valid) => {
        this.changeLoading()
        if (valid) {
          let update_info = {
            'group_name':this.new_group_user.group_name,
            'is_group_leader':this.new_group_user.is_group_leader,
            'group_type':this.group_type}
          this.$emit('onOK', this.id, update_info)
        } else {
          this.$Message.error('请完整填写信息!')
        }
      })
    },
    handleCancel(){
      this.$emit('onCancel')
    },



    changeLoading: function() {
      setTimeout(()=>{
        this.loading = false;
        this.$nextTick(()=>{
          this.loading = true
        })
      }, 500)
    }
  },
  created() {

  },
  mounted() {



  }
}
</script>

<style scoped>
.TextColor >>> .ivu-input[disabled], fieldset[disabled] .ivu-input {
  color: #5c6b77 !important;
}
</style>
