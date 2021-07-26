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

        <FormItem label="单位：" prop="unit">
          <AutoComplete
            v-model="query.unit"
            placeholder="输入或选择"
            style="width: 180px"
            clearable>
            <Option v-for="item in units" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
          </AutoComplete>
        </FormItem>

        <FormItem >
          <Button type="primary" @click=" onSearch">查询</Button>
        </FormItem>
        <FormItem>
        <Button type="primary" @click="()=>{this.showAddNewUserModal=true}">新增</Button>
        </FormItem>

      </Form>

      <Table border stripe :columns="columns" :data="data"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
        </div>
      </div>

    </Card>
    <UpdateUserInfo
      :show="showUserUpdateModal"
      @onOK="onUpdateUserModalOK"
      @onCancel="onUpdateUserModalCancel"
      :username="this.selected_username"
    ></UpdateUserInfo>
    <AddNewUserModal
      :show="showAddNewUserModal"
      @onOK="onAddModalOK"
      @onCancel="onAddModalCancel"
    ></AddNewUserModal>
  </div>
</template>

<script>
import {AddUser, queryUnits, queryUnitUsers, updateUser} from "@/api/user";
import AddNewUserModal from "@/view/UserManage/components/AddNewUserModal";
import { getToken } from "@/libs/util";
import UpdateUserInfo from "@/view/Userinfo/components/UpdateUserInfo";
export default {
  name: "index",
  components: { UpdateUserInfo, AddNewUserModal },
  data () {
    let that = this
    return {
      units: [],
      showAddNewUserModal: false,
      showUserUpdateModal: false,
      query: {
        name_like: undefined,
        unit: undefined
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
          },

          filters: [
            {
              label: '超级管理员',
              value: 'is_admin'
            },
            {
              label: '单位管理员',
              value: 'is_unitAdmin'
            },
            {
              label: '养护人员',
              value: 'is_yh'
            },
            {
              label: '调查人员',
              value: 'is_dc'
            }
          ],
          filterMultiple: true, // 使用多选
          filterRemote: function (value,row) {
            //  value是数组类型  每次都先把query中的除了unit和name_like之外的字段删除掉，不然会记住上一次筛选时的字段
            for(var key in that.query){
              if(key !== 'name_like' || key !== 'unit'){
                delete that.query[key]
              }
            }
            if(value.length ===0){ // 选择“全部”时， value数组为空
              console.log('query',that.query)
              that.fetchData()
            }else {
              for (const elem of value) {
                that.query[elem] = true
              }
              that.fetchData()
            }
          }
        },
        {
          title: '电话',
          key: 'tele'
        },
        {
          title: '单位管理员',
          align: "center",

          render: function (h, params) {
            if (params.row.is_unitAdmin) {
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
  methods: {
    fetchData: function () {
      // 数据表发生变化请求数据
      // query.unit清空后，会变成'',查到的是空
      if (this.query.unit === ''){
        this.query.unit = undefined
      }

      let args = { ...this.query, ...this.pages}
      return queryUnitUsers(args).then((resp) => {
        this.data = resp.data.users
        this.total = resp.data.total
      })
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    onSearch () {
      this.pages._page = 1
      this.fetchData()
    },

    onAddModalOK (user) {
      console.log('adduser', user)
      AddUser(user).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('添加用户成功')
          this.fetchData()
        } else {
          this.$Message.error('添加失败')
        }
      })
      this.showAddNewUserModal = false
    },
    onAddModalCancel () {
      this.showAddNewUserModal = false
    },
    onUpdateUserModalOK (user) {
      updateUser(user.id, user).then(res => {
        if (res.data.code === 200) {
          this.$Message.success({
            content: '修改成功',
            duration: 5,
            closable: true
          })
          this.fetchData()
        } else {
          this.$Message.error({
            content: '修改失败',
            duration: 5,
            closable: true
          })
        }
      })

      this.showUserUpdateModal = false
    },
    onUpdateUserModalCancel () {
      this.showUserUpdateModal = false
    }

  },
  mounted () {
    queryUnitUsers({ ...this.pages, ...this.query }).then((resp) => {
      this.data = resp.data.users
      this.total = resp.data.total
    })
    queryUnits().then(res=>{
      this.units= res.data.units
    })
  }
}
</script>

<style scoped>

</style>
