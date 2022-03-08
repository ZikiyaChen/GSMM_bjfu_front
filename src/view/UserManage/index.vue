<template>
  <div>
    <Card>
      <h1>用户管理</h1>
      <br>
      <Form :label-width="80" :model="query" inline>
        <FormItem label="用户姓名：" prop="name">
          <Input style="width: 180px" v-model="query.name_like" placeholder="请输入用户名字"  clearable>
          </Input>
        </FormItem>

        <FormItem label="单位：" prop="unit" v-role="['超级管理员']">
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

      <Table border stripe :columns="columns" :data="data" max-height="500"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total"  :current="pages._page" :page-size="pages._per_page" show-total
                @on-change="onPageChange"
                show-elevator show-sizer :page-size-opts="[10,20,30]" @on-page-size-change="onPageSizeChange"></Page>
        </div>
      </div>

    </Card>
    <UpdateUserInfo
      :show="showUserUpdateModal"
      @onOK="onUpdateUserModalOK"
      @onCancel="onUpdateUserModalCancel"
      :selected_username="this.selected_username"
    ></UpdateUserInfo>
    <AddNewUserModal
      :show="showAddNewUserModal"
      @onOK="onAddModalOK"
      @onCancel="onAddModalCancel"
    ></AddNewUserModal>
    <!--      删除确认  -->
    <Modal
      v-model="deleteConfirmModal"
      :selected_username="delete_username">
      <p slot="header" style="color:#ff9900;text-align:center; font-size: 16px">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center; font-size: 16px">
        <p>会删除该用户信息，删除后不可取消，请确认是否删除？</p>
        <P>确认删除请点击“删除”，否则点击“取消”按钮。</P>
        <p></p>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="error" size="large"  @click="ConfirmDelete">删除</Button>
        <Button size="large" @click="CancelDelete">取消</Button>
      </div>
    </Modal>

<!--    重置密码，修改密码-->
    <UpdatePassword
      :show="changepass_visible"
      @onOk="ChangePassword"
      @onCancel="()=>{this.changepass_visible=false}">
    </UpdatePassword>
  </div>
</template>

<script>
import {AddUser, changePassword, deleteUser, queryUnits, queryUnitUsers, updateUser} from "@/api/user";
import AddNewUserModal from "@/view/UserManage/components/AddNewUserModal";
import UpdateUserInfo from "@/view/Userinfo/components/UpdateUserInfo";
import RightDeleteTree from "@/view/survey/NoticeModal/RightDeleteTree";
import UserMixin from "@/mixin/UserMixin";
import UpdatePassword from "@/view/Userinfo/components/UpdatePassword";
export default {
  name: "index",
  components: { UpdateUserInfo, AddNewUserModal, RightDeleteTree,UpdatePassword },
  mixins: [UserMixin],
  data () {
    let that = this
    return {
      changepass_visible: false,

      units: [],
      showAddNewUserModal: false,
      showUserUpdateModal: false,
      deleteConfirmModal: false,
      query: {
        name_like: undefined,
        unit: undefined
      },
      selected_username: undefined,
      delete_username: undefined,
      total: 0, // 总数量
      data: [], // 数据
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页

      columns: [
        {
          type: 'index',
          title: '#',
          width: 50,
          key: 'index',
          fixed: 'left'
        },
        {
          title: '用户名',
          key: 'username',
          width: 170,
          align: 'center',
          resizable: true,
          fixed: 'left'
        },
        {
          title: '名字',
          key: 'name',
          width: 170,
          align: 'center',
          resizable: true
        },
        {
          title: '性别',
          key: 'sex',
          width: 70,
          align: 'center',
          resizable: true,
        },
        {
          title: '单位',
          key: 'unit',
          width: 170,
          align: 'center',
          resizable: true,
        },
        {
          title: '身份',
          width: 170,
          aligen: 'center',
          resizable: true,
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
          filterRemote: function (value, row) {
            //  value是数组类型  每次都先把query中的除了unit和name_like之外的字段删除掉，不然会记住上一次筛选时的字段
            for (var key in that.query) {
              if (key !== 'name_like' || key !== 'unit') {
                delete that.query[key]
              }
            }
            if (value.length === 0) { // 选择“全部”时， value数组为空
              console.log('query', that.query)
              that.fetchData()
            } else {
              for (const elem of value) {
                that.query[elem] = true
              }
              that.fetchData()
            }
          }
        },
        {
          title: '电话',
          key: 'tele',
          width: 150,
          align: 'center',
          resizable: true
        },
        // {
        //   title: '单位管理员',
        //   align: "center",
        //   width: 120,
        //   resizable: true,
        //
        //   render: function (h, params) {
        //     if (params.row.is_unitAdmin) {
        //       return h('Icon', { props: {
        //         type: 'md-checkmark-circle'
        //       },
        //       style: {
        //         color: '#19be6b',
        //         fontSize: '30px',
        //         textAlign: 'center'
        //       }
        //       })
        //     } else {
        //       return h('span')
        //     }
        //   }
        // },

        {
          title: '密码',
          align: 'center',
          fixed: 'right',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  icon: "md-key"
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.selected_username = params.row.username
                    this.changepass_visible = true
                  }
                }
              }, '重置')
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          width: 190,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'md-create'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.selected_username = params.row.username
                    this.showUserUpdateModal = true
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash',
                  disabled: (params.row.is_unitAdmin === true && this.access.includes('单位管理员')),
                },
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.delete_username = params.row.username
                    this.deleteConfirmModal = true
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    //修改密码
    ChangePassword: function (passwd) {
      changePassword(this.selected_username, { 'password': passwd }).then((resp) => {
        if (resp.data.code === 200) {
          this.$Message.success('修改成功！')
        }
      })
      this.changepass_visible = false
    },

    //删除确认------
    ConfirmDelete(){
      deleteUser(this.delete_username).then(msg=>{
        if(msg.data.code === 200){
          this.$Message.success('该用户删除成功')
          this.deleteConfirmModal = false
          this.delete_username = undefined
          this.fetchData()
        }else {
          this.$Message.error('该用户删除失败')
        }
      })
    },
    CancelDelete(){
      this.deleteConfirmModal = false
    },
    onPageSizeChange(page_size){
      this.pages._per_page = page_size
      this.fetchData()
    },
    fetchData: function () {
      // 数据表发生变化请求数据
      // query.unit清空后，会变成'',查到的是空
      if (this.query.unit === '') {
        this.query.unit = undefined
      }

      let args = { ...this.query, ...this.pages }
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
    queryUnits().then(res => {
      this.units = res.data.units
    })
  }
}
</script>

<style scoped>

</style>
