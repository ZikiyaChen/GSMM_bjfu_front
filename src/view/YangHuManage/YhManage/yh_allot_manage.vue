<template>
  <div>
    <Card>
      <h1>养护任务分配---只显示分配的工单</h1>
      <Table stripe :columns="columns" :data="data" border></Table>
      <br>
    </Card>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
import { queryYhAllots } from "@/api/yh_manage";
import yh_record_extend_table from "@/view/YangHuManage/components/yh_record_extend_table";

export default {
  name: "yh_allot_manage",
  data () {
    return {
      query: {
        group_name: undefined
      },
      selected_allot_order: undefined,
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      data: [],
      total: 0,
      current_user: {},

      columns: [
        {
          type: 'expand',
          title: '',
          width: 50,
          render: (h, params) => {
            return h(yh_record_extend_table, {
              props: {
                selected_allot_order: params.row.allot_order
              }
            })
          }
        },
        {
          title: '工单编号',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.allot_order)
          }
        },
        {
          title: '古树编号',
          align: 'center',
          width: 200,
          render: function (h, params) {
            let tags = params.row.trees.map((item) => {
              return h('Tag', item)
            })
            return h('span', tags)
          }
        },
        {
          title: '养护项目类型',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.yh_type)
          }
        },

        {
          title: '养护人姓名',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.yh_user.name)
          }
        },
        {
          title: '养护小组',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.group_name)
          }
        },
        {
          title: '预计养护时间',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.predict_time)
          }
        },
        {
          title: '总任务数',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.trees.length)
          }
        },
        {
          title: '已完成数',
          align: "center",
          render: function (h, params) {
            return h('span', params.row.finished_num)
          }
        },

        {
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },

                style: {
                  marginRight: '2px',
                  // 只有当该工单没有人完成时，才可以修改
                  display: (params.row.finished_num !== 0) ? "none" : "inline-block",
                },
                on: {
                  click: () => {

                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },

                style: {
                  marginRight: '2px',
                  // 在工单中增加一棵树的任务
                  // 只有当该工单没有人完成时，才可以修改
                  display: (params.row.finished_num !== 0) ? "none" : "inline-block",
                },
                on: {
                  click: () => {

                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },

                style: {
                  marginRight: '2px',
                  // 在工单中增加一棵树的任务
                },
                on: {
                  click: () => {

                  }
                }
              }, '添加树')

            ])
          }
        }
      ]
    }
  },
  methods: {
    fetchData () {
      getUserInfo().then(res => {
        this.current_user = res.data.current_user

        if (this.current_user['role_names'].includes('养护组长')) {
          this.query.group_name = this.current_user.group_info['group_name']
        }

        let args = { ...this.query, ...this.pages }
        queryYhAllots(args).then(resp => {
          this.data = resp.data.yh_allots
          this.total = resp.data.total
        })
      })
    }
  },
  mounted () {
    this.fetchData()
  }

}
</script>

<style scoped>

</style>
