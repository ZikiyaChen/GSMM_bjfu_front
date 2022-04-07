<template>
  <div>
  <Card>
    <Table :show-header="true" :data="data" :columns="columns"></Table>
  </Card>
  </div>
</template>
<script>


import {queryUsers, updateUser} from "@/api/user";
import UserMixin from "@/mixin/UserMixin";

export default {
  name: "DcUsersTable",
  props: {
    id: Number,

  },
  mixins:[UserMixin],
  data(){
    return{
      value: 'dc',
      data: [],

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
                  value: params.row.available//通过value值控制swtich开关
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
    fetchData(){
      console.log('&&&',this.id)
      queryUsers({create_by:this.userInfo.userInfo.username, is_dc: true, dc_id: this.id}).then(res=>{
        if(res.data.code === 200 ){
          this.data = res.data.users
        }
      })
    }

  },
  mounted() {
    this.fetchData()
  },
  created() {

  }

}
</script>
