<template>
  <div>
    <Button type="primary" style="margin-bottom: 5px" @click="()=>{this.showAddNewUserModal=true}">
      新增调查账号</Button>
    <Table border stripe :columns="columns" :data="data" max-height="500"></Table>


    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total"  :current="pages._page" :page-size="pages._per_page" show-total
              @on-change="onPageChange"
              show-elevator show-sizer :page-size-opts="[10,20,30]" @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </div>


    <UpdateUserInfo
      :show="showUserUpdateModal"
      @onOK="onUpdateUserModalOK"
      @onCancel="onUpdateUserModalCancel"
      :selected_username="this.selected_username"
    ></UpdateUserInfo>
    <AddNewUserModal
      :show="showAddNewUserModal"
      :title-text="addTitle"
      :user_type="userType"
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

import UpdateUserInfo from "@/view/Userinfo/components/UpdateUserInfo";
import AddNewUserModal from "@/view/UserManage/components/AddNewUserModal";
import RightDeleteTree from "@/view/survey/NoticeModal/RightDeleteTree";
import UpdatePassword from "@/view/Userinfo/components/UpdatePassword";
import UserMixin from "@/mixin/UserMixin";
import {AddUser, changePassword, deleteUser,  queryUnitUsers, updateUser} from "@/api/user";


export default {
  components: { UpdateUserInfo, AddNewUserModal, RightDeleteTree,UpdatePassword },
  mixins: [UserMixin],
  name: 'DcUsersTables',
  data(){
    let that = this

    return {
      userType: 'dc',
      addTitle: '新增调查账号',
      changepass_visible: false,

      units: [],
      showAddNewUserModal: false,
      showUserUpdateModal: false,
      deleteConfirmModal: false,
      query: {
        name_like: undefined,
        create_by: undefined,
        is_dc: true
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
          title: '账号使用有效时间',
          align: 'center',
          resizable: true,
          width: 260,
          render: function (h, params) {
            return h('span', params.row.start_time + ' 至 '+ params.row.end_time)
          }
        },

        {
          title: '工作区域',
          align: 'center',
          resizable: true,
          width: 260,
          render: function (h, params) {
            if(params.row.work_place_type === '1'){
              return h('span', params.row.city + params.row.area + params.row.town)
            }else {
              return h('span', params.row.work_place.name)
            }

          }
        },
        {
          title: '单位',
          key: 'unit',
          width: 170,
          align: 'center',
          resizable: true,
        },

        {
          title: '电话',
          key: 'tele',
          width: 180,
          align: 'center',
          resizable: true
        },
        {
          title: '密码',
          align: 'center',
          fixed: 'right',
          width: 120,
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
          width: 200,
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
        },
        {
          title: '账号状态',
          key: "available",
          fixed: 'right',
          width: 120,
          render: (h, params) => {
            return h('i-switch', {
                props: {
                  size: 'large',
                  value: params.row.available,//通过value值控制swtich开关
                },
                scopedSlots: {
                  open: () => h('span','可用'),
                  close: () => h('span','禁用'),
                },
                on:{
                  'on-change':(value)=>{
                    console.log('switch value',value);//获取switch的value值
                    console.log('available',params.row.available)
                    if(value !== params.row.available){
                      updateUser(params.row.id, {available: value}).then(res=>{
                        if(res.data.code === 200){
                          this.fetchData()
                          if(value === false){
                            this.$Message.success('账号禁用成功')
                          }else {
                            this.$Message.success('账号开启成功')
                          }
                        }else {
                          this.$Message.error('失败')
                        }
                      })
                    }

                  }
                }
              },
              // [h('span',{slot:"open",domProps:{innerHTML:'可用'}}),
              //   h('span',{slot:"close",domProps:{innerHTML:'禁用'}}),]
            );
          }
        }
      ]
    }
  },
  methods:{
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
      user['is_dc'] = true
      console.log('adduser1', user)
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
  mounted() {
    this.query.create_by = this.userInfo.userInfo.username
    queryUnitUsers({ ...this.pages, ...this.query }).then((resp) => {
      this.data = resp.data.users
      this.total = resp.data.total
    })

  },
  created() {

  }

}
</script>
