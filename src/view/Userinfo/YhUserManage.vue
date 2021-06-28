<template>
<div>
  <Card>
    <h1>养护人员列表</h1>
    <br>
    <Form :label-width="80" :model="query" inline>
      <FormItem label="用户名字：" prop="name" >
        <Input style="width: 180px" v-model="query.name_like" placeholder="请输入用户名字"  clearable>
        </Input>
      </FormItem>
      <FormItem label="组名："  prop="group_name"  v-role="['管理员']">
        <Select v-model="query.group_name"  style="width: 100px" clearable >
          <Option v-for="item in groups" :value="item.group_name" :key="item.group_name">{{ item.group_name }}</Option>
        </Select>
      </FormItem>
      <FormItem >
        <Button type="primary" @click=" onSearch">查询</Button>
      </FormItem>
      <FormItem >
        <Button type="primary" @click="showAddYhUserModal=true">新增</Button>
      </FormItem>
    </Form>
    <Table stripe :columns="columns" :data="data" border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
      </div>
    </div>

    <AddYhGroupUser
      :show="showAddYhUserModal"
      :group_type = "selected_group_type"
      @onOK="onAddModalOK"
      @onCancel="onAddModalCancel"
    ></AddYhGroupUser>

    <UpdateGroupUser
      :show="showUpdateGroupUserModal"
      :id= "selected_update_id"
      :group_type="selected_group_type"
      @onOK="onUpdateModalOK"
      @onCancel="onUpdateModalCancel"
    ></UpdateGroupUser>
  </Card>
</div>
</template>

<script>
import {getUserInfo, queryGroupUsers, queryGroups, addGroupUsers, deleteGroupUser, updateGroupUser} from "@/api/user";
import AddYhGroupUser from "@/view/Userinfo/components/AddYhGroupUser";
import UpdateGroupUser from "@/view/Userinfo/components/UpdateGroupUser";

export default {
  name: "YhUserManage",
  components: {UpdateGroupUser, AddYhGroupUser},
  data(){
     return{
       showAddYhUserModal: false,
       selected_group_type: '养护',
       showUpdateGroupUserModal: false,
       selected_update_id: 0,

       query:{
         name_like: undefined,
         group_name: undefined
       },
       pages: {
         _page: 1,
         _per_page: 10
       }, // 分页
       data: [],
       total: 0,
       current_user:{},
       groups: [],
       columns: [
         {
           title: '用户名',
           align: "center",
           key: 'username'
         },
         {
           title: '名字',
           align: "center",
           key: 'name'
         },
         {
           title: '性别',
           align: 'center',
           render: function (h, params) {
             return h('span', params.row.user.sex)
           }
         },
         {
           title: '单位',
           align: 'center',
           render: function (h, params) {
             return h('span', params.row.user.unit)
           }
         },

         {
           title: '电话',
           align: "center",
           render: function (h, params) {
             return h('span', params.row.user.tele)
           }
         },
         {
           title: '所属小组',
           align: "center",
           key: 'group_name'
         },
         {
           title: '组长',
           align: "center",

           render: function (h, params) {
             if (params.row.is_group_leader) {
               return h('Icon', { props: {
                   type: 'md-checkmark-circle'
                 },
                 style: {
                   color: '#19be6b',
                   fontSize: '30px',
                   textAlign: 'center'
                 }
               })
             } else {
               return h('span')
             }
           }
         },

         {
           title: '操作',
           align: 'center',
           render: (h, params) => {
             return h('div', [
               h('Button', {
                 props: {
                   type: 'primary',
                   size: 'small'
                 },
                 //注：只有管理员 可以修改 养护人或调查人的 分组组别
                 directives: [{
                   name: 'role',
                   value: ['管理员']
                 }],
                 style: {
                   marginRight: '2px'
                 },
                 on: {
                   click: () => {
                     this.selected_update_id = params.row.id
                     this.showUpdateGroupUserModal = true
                   }
                 }
               }, '修改'),

               h('Button', {
                 props: {
                   type: 'error',
                   size: 'small'
                 },
                 style: {
                   marginRight: '2px'
                 },
                 on: {
                   click: () => {
                     deleteGroupUser(params.row.id).then((res=>{
                       if(res.data.code === 200){
                         this.$Message.success({
                           content: '删除成功',
                           duration: 5,
                           closable: true
                         })
                       }else {
                         this.$Message.error({
                           content: '删除失败',
                           duration: 5,
                           closable: true
                         })
                       }
                     }))
                     this.fetchData()
                   }
                 }
               }, '删除'),
             ])
           }
         }
       ]
     }
  },
  methods:{
    //增加
    onAddModalOK(group_user){
      console.log('@@@',group_user)
      addGroupUsers(group_user).then((res=>{
        if(res.data.code === 200){
          this.$Message.success('成功')
        }else {
          if(res.data.msg === "this group leader has been existed"){
            this.$Message.error({
              content: '失败！该组组长已存在，注意每组组长只能有一个！',
              duration: 5,
              closable: true
            })
          }else if(res.data.msg==='user has been group_user'){
            this.$Message.error({
              content: '失败！该用户已加入某组中！',
              duration: 5,
              closable: true
            })
          }else {
            this.$Message.error({
              content: '失败！',
              duration: 5,
              closable: true
            })
          }
        }
      }))
      this.fetchData()
      this.showAddYhUserModal = false
    },
    onAddModalCancel(){
      this.showAddYhUserModal = false
    },
    onSearch() {
      this.pages._page=1
      this.fetchData()
    },

    //修改
    onUpdateModalOK(id,update_info){
      console.log('~~~~',id,update_info)
      updateGroupUser(id,update_info).then((res=>{
        if(res.data.code === 200){
          this.$Message.success({
            content: '修改成功',
            duration: 5,
            closable: true
          })
          this.fetchData()
        }else if(res.data.msg === 'this group leader has been existed'){
            this.$Message.error({
              content: '修改失败！该组组长已存在，注意每组组长只能有一个！',
              duration: 5,
              closable: true
            })
        }else {
          this.$Message.error({
            content: '修改失败！',
            duration: 5,
            closable: true
          })
        }
      }))

      this.showUpdateGroupUserModal = false
    },
    onUpdateModalCancel(){
      this.showUpdateGroupUserModal = false
    },

    // 获取按组查找的下拉框中的groups数据
    getGroups(){
      queryGroups({'group_type':'养护'}).then((res=>{
        this.groups = res.data.groups
      }))
    },

    //获取表中的数据
    fetchData(){
      getUserInfo().then((res=>{
        this.current_user = res.data.current_user

        if(this.current_user['role_names'].includes('养护组长')){
          this.query.group_name = this.current_user.group_info['group_name']

        }

        let args = { ...this.query, ...this.pages }
        queryGroupUsers(args).then((resp=>{
          this.data = resp.data.group_users
          this.total = resp.data.total
        }))
      }))
    },

    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
  },
  created() {

  },
  mounted() {
    this.fetchData()
    this.getGroups()
  }

}
</script>

<style scoped>

</style>
