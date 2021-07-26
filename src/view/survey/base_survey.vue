<template>
<div>
  <Card>
    <h2 slot="title">名木古树信息</h2>
    <Form :label-width="80" :model="query" inline>
      <FormItem label="古树编号:" :label-width="80">
        <Input v-model="query.tree_code_like" style="width: 150px" clearable></Input>
      </FormItem>
      <FormItem label="古树等级:" :label-width="80">
        <Select style="width:100px" v-model="query.level" clearable>
          <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="科:" :label-width="80">
        <Select style="width:120px" v-model="query.family" clearable>
          <Option v-for="item in KeList" :value="item.fname" :key="item.fname">{{ item.fname }}</Option>
        </Select>
      </FormItem>
      <FormItem label="属:" :label-width="80">
        <Select style="width:120px" v-model="query.genus" clearable>
          <Option v-for="item in ShuList" :value="item.gname" :key="item.gname">{{ item.gname }}</Option>
        </Select>
      </FormItem>

      <FormItem label="种:" :label-width="80">
        <Select style="width:120px" v-model="query.zw_name" clearable>
          <Option v-for="item in NameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="权属:" :label-width="80">
        <Select style="width:120px" v-model="query.owner" clearable>
          <Option v-for="item in OwnerList" :value="item.value" :key="item.value">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem >
        <Button type="primary" @click=" onSearch">查询</Button>
      </FormItem>
      <FormItem>
      <router-link :to="{path: `/survey/right`}" v-role="['超级管理员','单位管理员','调查人员']" >
        <Button type="success" style="margin-right: 30px">新增古树</Button>
      </router-link>
      </FormItem>
    </Form>
<!--    <Steps :current="2" size="small">-->
<!--      <Step title ="已完成"></Step>-->
<!--      <Step title ="进行中"></Step>-->
<!--      <Step title ="待进行"></Step>-->
<!--      <Step title ="待进行"></Step>-->
<!--    </Steps>-->
<!--    <router-link to=right><button>点我到第二个页面</button></router-link> // 通过按钮进行页面跳转-->
    <Table :columns="columns" :data="tableData" border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total :page-size="pages._per_page" :current="pages._page" @on-change="onPageChange"></Page>
      </div>
    </div>

    <RightDeleteTree
      :show="showDeleteModal"
      :tree_code="this.selected_tree_code"
      title="提醒"
      @onOK="ok"
      @onCancel="cancel">
    </RightDeleteTree>
  </Card>
</div>
</template>

<script>
import {deleteOneTree, queryFamilyTypes, queryTreeBasicProperty} from '@/api/table'
import {queryUsers} from "@/api/user";
import {getToken, showByAccess} from "@/libs/util";
import tjxm_record_extend_table from "@/view/survey/components/tjxm_record_extend_table";
import RightDeleteTree from "@/view/survey/NoticeModal/RightDeleteTree";
import name from "@/view/tools-methods/name.json"
import {ownerList} from "@/view/survey/right_base_options";

export default {
  name: "base_survey",
  components:{RightDeleteTree, tjxm_record_extend_table},
  data () {
    return {
      selected_tree_code: undefined,
      showDeleteModal: false,
      query: {
        level: undefined,
        tree_code_like: undefined,
        family: undefined,
        genus: undefined,
        zw_name: undefined,
        owner: undefined
      },
      KeList: [],
      ShuList: [],
      NameList: [],
      OwnerList: ownerList,
      total: 0,
      pages: {
        _page: 1,
        _per_page: 10
      }, // 分页
      trees_basic_property:{
        tree_code: undefined,
        family: undefined,
        genus: undefined,
        zw_name: undefined,
        ld_name: undefined,

        dynamic_property:{
          real_age: undefined,
          investigate_time: undefined
        },
        geo_property:{
          longitude: undefined,
          latitude: undefined
        },
        level: undefined,
        username: undefined,
        gh_unit: undefined,
        owner: undefined
      },

      columns: [
        {
          type: 'expand',
          title: '古树信息',
          width: 70,
          render: (h, params) => {
            return h(tjxm_record_extend_table, {
              props: {
                selected_tree_code: params.row.tree_code
              }
            })
          }
        },
        {
          title: '古树编号',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.tree_code)
          }
        },
        {
          title: '科',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.family)
          }
        },
        {
          title: '属',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.genus)
          }
        },
        {
          title: '中文名',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.zw_name)
          }
        },
        {
          title: '拉丁名',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.ld_name)
          }
        },
        {
          title: '古树等级',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.level)
          }
        },
        {
          title: '真实树龄（年）',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.dynamic_property.real_age)
          }
        },
        {
          title: '树高（米）',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.dynamic_property.height)
          }
        },
        {
          title: '经度',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.geo_property.longitude)
          }
        },
        {
          title: '纬度',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.geo_property.latitude)
          }
        },
        {
          title: '权属',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.owner)
          }
        },
        {
          title: '管护人',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.gh_user.name)
          }
        },
        {
          title: '管护单位',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.gh_unit)
          }
        },

        {
          title: '调查时间',
          align: 'center',
          width: '150px',
          render: function (h, params) {
            return h('span', params.row.investigate_time)
          }
        },
        {
          title: '调查单位',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.dc_unit)
          }
        },
        {
          title: '调查人',
          align: 'center',
          render: function (h, params) {
            return h('span', params.row.dc_user.name)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: '130px',
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
                    console.log('pp',params.row)
                    this.$router.push({ path: `/survey/update/BasicInformation/${params.row.tree_code}` })
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                directives: [{
                  name: 'role',
                  value: ['超级管理员','单位管理员']
                }],
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.selected_tree_code = params.row.tree_code
                    this.showDeleteModal=true
                  }
                }
              }, '删除')
            ])
          }
        }
      ],

     tableData: [],

      codeList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        }
      ],
      model1: '',
      levelList: [
        {
          value: '一级',
          label: '一级'
        },
        {
          value: '二级',
          label: '二级'
        },
        {
          value: '三级',
          label: '三级'
        },
        {
          value: '名木',
          label: '名木'
        }
      ]
    }
  },
  methods :{
    ok(tree_code){
      console.log('###',tree_code)
      deleteOneTree(tree_code).then((res=>{
        if(res.data.code === 200){
          this.$Message.success('该古树删除成功')
          this.fetchData()
        }else {
          this.$Message.error('该古树删除失败')
        }
      }))
      this.showDeleteModal=false
    },
    cancel(){
      this.showDeleteModal =false
    },
    fetchData: function () {
      // 数据表发生变化请求数据

      let args = {...this.query, ...this.pages}

      return queryTreeBasicProperty(args).then((resp) => {
        this.tableData = resp.data.trees_basic_property
        this.total = resp.data.total
      })
    },
    onSearch() {
      this.pages._page=1
      this.fetchData()
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },

    JsonChangeToOptions(){
      let options=name.contents
      let keArr=[]
      let shuArr=[]
      let nameArr=[]
      for(let [index, elem] of options.entries()){
       if(!keArr.includes(elem.ke)){
         keArr.push(elem.ke)
         this.KeList.push({ fname: elem.ke})
       }
       if(!shuArr.includes(elem.shu)){
         shuArr.push(elem.shu)
         this.ShuList.push({ gname: elem.shu})
       }
       if(!nameArr.includes(elem.name)){
         nameArr.push(elem.name)
         this.NameList.push({ name: elem.name})
       }
     }
      console.log('###KeList',this.KeList)
      console.log('###ShuList',this.ShuList)
      console.log('###NameList',this.NameList)
    }
  },
  created() {
    queryTreeBasicProperty({ ...this.pages, ...this.query }).then((resp) => {
      this.tableData = resp.data.trees_basic_property
      this.total = resp.data.total
    })
    // queryFamilyTypes().then((res) => {
    //   this.FamilyList = res.data.species_types
    // })
    this.JsonChangeToOptions()




  }

}
</script>

<style scoped>

</style>
