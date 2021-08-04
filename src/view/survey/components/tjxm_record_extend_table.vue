<template>
  <Card>
    <Table :show-header="true" :data="data" :columns="columns"></Table>

  </Card>
</template>

<script>
import { deleteTjxmRecord, queryTjxmRecord } from "@/api/table";

export default {
  name: "tjxm_record_extend_table",
  props: {
    selected_tree_code: String
  },
  data: function () {
    return {
      data: [],
      columns: [
        {
          title: '古树编号',
          align: 'center',
          render: function (h, params) {
            return (
              <span>{ params.row.tree_code }</span>
            )
          }
        },
        {
          title: '调查项目',
          align: 'center',
          render: function (h, params) {
            return (
              <span>{ params.row.type }</span>
            )
          }
        },
        {
          title: '调查人',
          align: 'center',
          render: function (h, params) {
            return (
              <span>{ params.row.dc_user.name } </span>
            )
          }
        },
        {
          title: '调查时间',
          align: 'center',
          render: function (h, params) {
            return (
              <span>{ params.row.time }</span>
            )
          }
        },
        {
          title: '完成状态',
          align: 'center',
          render: function (h, params) {
            if (params.row.status === '已完成') {
              return h('Tag', { props: { color: 'blue' } }, '已完成')
            } else if (params.row.status === '待提交') {
              return h('Tag', { props: { color: 'green' } }, '待提交')
            } else {
              return h('Tag', { props: { color: 'red' } }, '未完成')
            }
          }
        },
        {
          title: '操作',

          // width: '130px',
          render: (h, params) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'primary',
              //     size: 'small'
              //   },
              //   style: {
              //     marginRight: '2px',
              //     display:( params.row.status === '未完成' )?"none":"inline-block",
              //   },
              //   on: {
              //     click: () => {
              //       console.log(params.row)
              //       this.$router.push({path:'/survey/update/'+params.row.type_yw+'/'+params.row.tree_code})
              //     }
              //   }
              // }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                directives: [{
                  name: 'role',
                  value: ['超级管理员', '调查人员', '单位管理员']
                }],
                style: {
                  marginRight: '2px',
                  display: (params.row.status === '未完成') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    console.log('编辑', params)
                    if (params.row.type_yw === 'BasicInformation') {
                      this.$router.push({ path: `/survey/update/` + params.row.type_yw + `/${params.row.tree_code}` })
                    } else {
                      this.$router.push({ path: `/survey/` + params.row.type_yw + `/${params.row.tree_code}` })
                    }
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                directives: [{
                  name: 'role',
                  value: ['超级管理员', '调查人员', '单位管理员']
                }],
                style: {
                  marginRight: '2px',
                  display: (params.row.status === '已完成' || params.row.status === '待提交') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    console.log('填写', params)

                    this.$router.push({ path: '/survey/' + params.row.type_yw + '/' + params.row.tree_code })
                  }
                }
              }, '填写'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                directives: [{
                  name: 'role',
                  value: ['超级管理员', '单位管理员']
                }],
                style: {
                  marginRight: '2px',
                  display: (params.row.type_yw === 'BasicInformation' || params.row.status === '未完成') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    console.log('删除', params)
                    deleteTjxmRecord(params.row).then(res => {
                      if (res.data.code === 200) {
                        this.$Message.success('删除成功')
                        this.fetchTjxmRecord()
                      } else {
                        this.$Message.error('删除失败')
                      }
                    })
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
    getArrDifference (arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    // insertUnFinished(tree_code,data) {
    //   var type=[]
    //   var alltypes=['基本信息','生长环境评价分析','生长势分析']
    //   data.forEach((tjxm=>{
    //     type.push(tjxm.type)
    //   }))
    //   console.log('type',type)
    //   var notype= this.getArrDifference(type,alltypes)
    //   console.log('notype',notype)
    //
    //   notype.forEach((item =>{
    //     data.push({'tree_code':tree_code,'type':item,'status':'未完成'})
    //   }))
    //
    // }

    insertUnFinished (tree_code, data) {
      var alltypes = { 'BasicInformation': '基本信息',
        'environment': '生长环境评价分析',
        'GrowthVigor': '生长势分析',
        'Protect': '已采取复壮保护措施情况与分析',
        'damage': '树体损伤情况评估',
        'Incline': '树体倾斜、空腐情况检测',
        'Diseases': '病虫害发生情况分析' }
      var Type_key = []
      console.log('Type_key', Type_key)
      data.forEach(tjxm => {
        Type_key.push(tjxm.type_yw)
      })

      for (let key in alltypes) {
        if (!Type_key.includes(key)) {
          data.push({ 'tree_code': tree_code, 'type': alltypes[key], 'type_yw': key, 'status': '未完成', 'dc_user': { 'name': '' } })
        }
      }
      console.log('enddata:', data)
    },

    // insertUnFinished(tree_code,data){
    //   var alltypes={'BasicInformation':'基本信息','environment':'生长环境评价分析','GrowthVigor':'生长势分析',
    //     'Protect':'已采取复壮保护措施情况与分析', 'damage':'树体损伤情况评估','Incline':'树体倾斜、空腐情况检测',
    //     'Diseases':'病虫害发生情况分析'}
    //   var arr=['BasicInformation','environment','GrowthVigor','Protect','damage','Incline','Diseases']
    //   var Type_key=[]
    //   var new_data=[]
    //   for(let j = 0,len=arr.length; j < len; j++) {
    //     console.log('j',j,'data[j]',data[j])
    //     if(data[j] === undefined){
    //       new_data.push({
    //       'tree_code':tree_code,
    //         'type':alltypes[arr[j]],
    //         'type_yw':arr[j],
    //         'status':'未完成'
    //       })
    //     }else {
    //       if(arr[j] !== data[j]['type_yw'])
    //       new_data.push(data[j])
    //     }
    //
    //   }
    //   this.data=new_data
    //   console.error('####',new_data)
    //   console.log('enddata:',data)
    // },

    fetchTjxmRecord () {
      console.log('###', this.selected_tree_code, typeof (this.selected_tree_code))
      queryTjxmRecord({ 'tree_code': this.selected_tree_code }).then(res => {
        console.log('tjxm', res.data)
        this.data = res.data.tjxm_records
        this.insertUnFinished(this.selected_tree_code, this.data)
      })
    }

  },
  created () {
    this.fetchTjxmRecord()
  }
}
</script>

<style scoped>

</style>
