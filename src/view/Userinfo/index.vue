<template>
<div>
  <Card>
    <h1>用户管理</h1>
    <br>
      <Form :label-width="80" :model="query" inline>
        <FormItem label="用户名字：" prop="name">
          <Input style="width: 180px" v-model="query.name_like" placeholder="请输入用户名字"  clearable>
          </Input>
        </FormItem>

        <FormItem >
          <Button type="primary" @click=" onSearch">查询</Button>
        </FormItem>

      </Form>

    <Table border stripe :columns="columns" :data="data"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
      </div>
    </div>
    <Button type="primary" @click="()=>{this.showAddUserModal=true}">新增</Button>
  </Card>
  <UpdateUserInfo
    :show="showUserUpdateModal"
    @onOK="onUpdateUserModalOK"
    @onCancel="onUpdateUserModalCancel"
    :username="this.selected_username"
  ></UpdateUserInfo>
  <AddUserModal
    :show="showAddUserModal"
    @onOK="onAddModalOK"
    @onCancel="onAddModalCancel"
  ></AddUserModal>
</div>
</template>

<script>
import {AddUser, queryUsers, updateUser} from "@/api/user";
import AddUserModal from "@/view/Userinfo/components/AddUserModal";
import {getToken} from "@/libs/util";
import UpdateUserInfo from "@/view/Userinfo/components/UpdateUserInfo";
export default {
  name: "index",
  components: {UpdateUserInfo, AddUserModal },
  data () {
    return {
      showAddUserModal: false,
      showUserUpdateModal: false,
      query: {
        name_like: undefined,
      },
      selected_username: undefined,
      total: 0, // 总数量
      data: [], // 数据
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页

      columns: [
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '名字',
          key: 'name'
        },
        {
          title: '性别',
          key: 'sex'
        },
        {
          title: '单位',
          key: 'unit'
        },
        {
          title: '身份',
          minWidth: 80,
          render: function (h, params) {
            let tags = params.row.role_names.map((item) => {
              return h('Tag', item)
            })
            return h('span', tags)
          }
        },
        {
          title: '电话',
          key: 'tele'
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
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.selected_username = params.row.username
                    this.showUserUpdateModal = true
                  }
                }
              }, '修改')
            ])
          }
        }
      ]
    }
  },
  methods :{
    fetchData: function () {
      // 数据表发生变化请求数据
      let args = { ...this.query, ...this.pages }
      return queryUsers(args).then((resp) => {
        this.data = resp.data.users
        this.total = resp.data.total
      })
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    onSearch() {
      this.pages._page=1
      this.fetchData()
    },

    onAddModalOK (user) {
      console.log('adduser',user)
      AddUser(user).then((res) => {
        if(res.data.code === 200){
          this.$Message.success('添加用户成功')
          this.fetchData()
        }else {
          this.$Message.error('添加失败')
        }
      })
      this.showAddUserModal = false
    },
    onAddModalCancel () {
      this.showAddUserModal = false
    },
    onUpdateUserModalOK (user) {
      updateUser(user.id, user).then((res=>{
        if(res.data.code === 200){
          this.$Message.success({
            content: '修改成功',
            duration: 5,
            closable: true
          })
          this.fetchData()
        }else {
          this.$Message.error({
            content: '修改失败',
            duration: 5,
            closable: true
          })
        }
      }))

      this.showUserUpdateModal = false
    },
    onUpdateUserModalCancel () {
      this.showUserUpdateModal = false
    }


  },
  mounted() {
    queryUsers({ ...this.pages, ...this.query }).then((resp) => {
      this.data = resp.data.users
      this.total = resp.data.total
    })
    console.log('userindex',getToken())// token===admin
  }
}
</script>

<style scoped>

</style>
