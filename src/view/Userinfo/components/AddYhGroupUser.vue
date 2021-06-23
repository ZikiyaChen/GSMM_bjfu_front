<template>
  <Modal
    :value="show"
    title="新增小组成员"
    :loading="loading"
    @on-ok="handleSubmit"
    @on-cancel="handleCancel" width="350px">
    <Form :model="group_user" ref="group_user_form" :rules="ruleValidate" :label-width="70" >

        <FormItem prop="username" label="名字:" >
          <Select v-model="group_user.username" placeholder="名字" filterable
                  @on-query-change="onUserSelectQueryChange" clearable style="width: 150px" >
            <Option v-for="item in users" :value="item.username" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>

      <FormItem label="组别:"  prop="group_name">
        <Select v-model="group_user.group_name"  style="width: 150px; color: #000c17" clearable  :disabled="is_not_show" >
          <Option v-for="item in groups" :value="item.group_name" :key="item.group_name" >{{ item.group_name }}</Option>
        </Select>
      </FormItem>
<!--只有管理员  可以指定每组组长  ，而每组组长只能指定组员-->
      <FormItem label="身份:" v-role="['管理员']">
        <Checkbox  v-model="group_user.is_group_leader">
          <span>组长</span>
        </Checkbox>

      </FormItem>

    </Form>
  </Modal>
</template>

<script>
import { queryGroups, queryUsers} from "@/api/user";
import store from "@/store";
import UserMixin from "@/mixin/UserMixin";

export default {
  name: "AddYhGroupUser",
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function,
    group_type: String
  },
  mixins: [UserMixin],
  data(){
    return{
      user_access: store.getters && store.getters.access,
      current_user: {},
      loading: false,
      is_not_show: false,

      group_user:{
        username: undefined,
        group_name: undefined,
        is_group_leader: false
      },
      groups: [],
      users: [],
      ruleValidate:{
        username: [{required: true, message: '请选择', trigger: 'change'}],
        group_name: [{required: true, message: '请选择', trigger: 'change'}],
      }
    }
  },
  methods:{
    // 根据组的类型来获取人被分配的组，如养护和调查
    getGroups(){

      // 如果当前用户是 组长 身份，组别设置成默认的本组组名
      if(this.user_access.includes('养护组长')||this.user_access.includes('调查组长')){
        this.is_not_show = true
        this.group_user.group_name = this.userInfo.userInfo.group_info.group_name
        console.log('c',this.group_user.group_name )
      }
      queryGroups({'group_type':this.group_type}).then((res=>{
        this.groups = res.data.groups
      }))
    },
    // 加载 可以被分配的用户姓名， 根据 prop中的group_type来判断是给“调查人”还是“养护人”分组,  调查人只能进入调查组，养护人只能进入养护组
    onUserSelectQueryChange (value) {
      let args={}
      // if (this.group_type === '养护'){
      //   args ={name_like: value, is_yh: false}
      // }
      // if(this.group_type === '调查'){
      //   args = { name_like: value, is_dc: true}
      // }

      // ############未被分配过组的人名才会出现在下拉框中
      args = { name_like: value, is_admin: false, is_yh: false, is_dc: false}
      queryUsers(args).then((resp) => {
        this.users = resp.data.users
      })
    },
    handleSubmit(){
      this.$refs.group_user_form.validate((valid) => {
        this.changeLoading()
        if (valid) {
          this.$emit('onOK', this.group_user)
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
    },
  },
  mounted() {
    this.getGroups()



  }
}
</script>

<style scoped>

</style>
