<template>
<div>
  <Card>
    <h2 slot="title">古树名木信息</h2>
    <Form :label-width="75" :model="query" inline>
      <FormItem label="古树编号">
        <Input v-model="query.tree_code_like" style="width: 120px" clearable placeholder="古树编号"></Input>
      </FormItem>
      <FormItem label="古树等级" >
        <Select style="width:120px" v-model="query.level" clearable>
          <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="科" >
        <Select style="width:120px" v-model="query.family" clearable>
          <Option v-for="item in KeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="属" >
        <Select style="width:120px" v-model="query.genus" clearable>
          <Option v-for="item in ShuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <FormItem label="种" >
        <Select style="width:120px" v-model="query.zw_name" clearable>
          <Option v-for="item in NameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="权属" >
        <Select style="width:120px" v-model="query.owner" clearable>
          <Option v-for="item in OwnerList" :value="item.value" :key="item.value">{{ item.value }}</Option>
        </Select>
      </FormItem>

      <FormItem label="调查人" >
        <Input v-model="query.investigator" style="width:120px" clearable></Input>
<!--        <Select v-model="query.dc_username" placeholder="调查人姓名" filterable-->
<!--                @on-query-change="ondcUserUnitQueryChange" clearable style="width: 120px">-->
<!--          <Option v-for="item in dcUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>-->
<!--        </Select>-->
      </FormItem>

      <FormItem label="调查单位" v-role="['超级管理员']">
        <Select v-model="query.CompanyB" placeholder="请选择" clearable style="width: 120px">
          <Option v-for="item  in Unit" :value="item.unit" :key="item.unit">{{item.unit}}</Option>
        </Select>
      </FormItem>
      <FormItem label="管护单位" v-role="['超级管理员']">
        <Select v-model="query.gh_unit" placeholder="请选择" clearable style="width: 120px">
          <Option v-for="item  in Unit" :value="item.unit" :key="item.unit">{{item.unit}}</Option>
        </Select>
      </FormItem>
      <FormItem label="签订责任书" >
        <Select v-model="query.is_signed" placeholder="是否签订" clearable style="width: 120px">
        <Option v-for="item  in signList" :value="item" :key="item">{{item}}</Option>
        </Select>
      </FormItem>
      <FormItem label="审核状态" >
        <Select v-model="query.dw_CheckState"  clearable style="width: 120px">
          <Option v-for="item  in CheckStateList" :value="item" :key="item">{{item}}</Option>
        </Select>
      </FormItem>

      <FormItem label="调查时间" >
        <DatePicker :value="investigate_time_range"  type="datetimerange" format="yyyy-MM-dd HH:mm"
                    placement="bottom-start" placeholder="Select date"
                    @on-change="DateTimeChange"
                    clearable style="width: 250px"></DatePicker>
      </FormItem>



      <FormItem >
        <Button type="primary" @click=" onSearch">查询</Button>
      </FormItem>

      <FormItem>
      <router-link :to="{path: `/survey/cover`}" v-role="['单位管理员','调查人员']" >
        <Button type="success" style="margin-right: 30px">新增古树</Button>
      </router-link>
      </FormItem>
      <FormItem v-role="['单位管理员']">
        <Button type="primary" style="margin-right: 30px" @click="()=>{this.ShowDwCheckModal=true}">批量审核</Button>
      </FormItem>
    </Form>



    <Table :columns="columns" :data="tableData" :stripe="true" highlight-row
           border max-height="800" :loading="loadingTable" @on-selection-change="SelectTreesChange"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="float: right;">
        <Page :total="total"  :current="pages._page" :page-size="pages._per_page" show-total
              @on-change="onPageChange"
              show-elevator show-sizer :page-size-opts="[50,60,70]" @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </div>


    <!--      删除确认  -->
    <Modal
      v-model="deleteConfirmModal"
      :selected_tree_code="delete_tree_code"
      :loading="loading">
      <p slot="header" style="color:#ff9900;text-align:center; font-size: 16px">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center; font-size: 16px">
        <p>会删除该古树的全部信息，删除后不可取消，请确认是否删除？</p>
        <P>确认删除请点击“删除”，否则点击“取消”按钮。</P>
        <p></p>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="error" size="large"  @click="ConfirmDelete">删除</Button>
        <Button size="large" @click="CancelDelete">取消</Button>
      </div>
    </Modal>

  </Card>
  <dw-check-modal
    :show="ShowDwCheckModal"
    @onOK="onDwCheckModalOK"
    @onCancel="onDwCheckModalCancel">

  </dw-check-modal>
</div>
</template>

<script>

import {BatchCheckTrees, deleteOneTree, queryTreeBasicProperty} from '@/api/table'
import tjxm_record_extend_table from "@/view/survey/components/tjxm_record_extend_table";

import name from "@/view/tools-methods/name.json"
import { ownerList, SignList } from "@/view/survey/right_base_options";
import {queryUnits, queryUnitUsers} from "@/api/user";
import {GetKe, GetShu, GetZhong} from "@/api/tree_species";
import DwCheckModal from "@/view/survey/components/dwCheckModal";


export default {
  name: "base_survey",
  components: {DwCheckModal,  tjxm_record_extend_table },
  data () {
    return {
      selected_trees:[],
      ShowDwCheckModal: false,
      dcUsers: [],
      CheckStateList:['已审核','未审核'],
      investigate_time_range: undefined,

      deleteConfirmModal: false,
      delete_tree_code: undefined,
      loadingTable: false, // 表格加载状态，默认初始时加载
      loading: false,

      query: {
        level: undefined,
        tree_code_like: undefined,
        family: undefined,
        genus: undefined,
        investigator: undefined,
        zw_name: undefined,
        owner: undefined,
        CompanyB: undefined,
        gh_unit: undefined,
        // dc_status: '已完成',
        dw_CheckState: undefined,
      },
      Unit: [],

      KeList: [],
      ShuList: [],
      NameList: [],
      OwnerList: ownerList,
      signList: ['是','否'],
      total: 0,
      pages: {
        _page: 1,
        _per_page: 50
      }, // 分页
      trees_basic_property: {
        tree_code: undefined,
        family: undefined,
        genus: undefined,
        zw_name: undefined,
        ld_name: undefined,

        dw_CheckState: '',
        dw_CheckResult: '',

        dynamic_property: {
          real_age: undefined,
          investigate_time: undefined
        },
        geo_property: {
          longitude: undefined,
          latitude: undefined
        },
        level: undefined,
        username: undefined,
        gh_unit: undefined,
        owner: undefined
      },

      columns: [
        // {
        //   type: 'expand',
        //   title: '古树信息',
        //   width: 70,
        //   fixed: 'left',
        //   render: (h, params) => {
        //     return h(tjxm_record_extend_table, {
        //       props: {
        //         selected_tree_code: params.row.tree_code
        //       }
        //     })
        //   }
        // },
        {
          type: 'selection',
          width: 60,
          fixed:'left',
          align: 'center'
        },
        {
          title: '古树编号',
          align: 'center',
          key: 'tree_code',
          resizable: true,
          sortable: true,
          sortType: 'asc',
          width: 120,
          fixed: 'left',
          render: function (h, params) {
            return h('span', params.row.tree_code)
          }
        },
        // {
        //   title: '科',
        //   align: 'center',
        //   resizable: true,
        //   width: 90,
        //   render: function (h, params) {
        //     return h('span', params.row.family)
        //   }
        // },
        // {
        //   title: '属',
        //   align: 'center',
        //   resizable: true,
        //   width: 90,
        //   render: function (h, params) {
        //     return h('span', params.row.genus)
        //   }
        // },
        {
          title: '中文名',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.zw_name)
          }
        },
        // {
        //   title: '拉丁名',
        //   align: 'center',
        //   resizable: true,
        //   width: 170,
        //   render: function (h, params) {
        //     return h('span', params.row.ld_name)
        //   }
        // },
        {
          title: '古树等级',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.level)
          }
        },
        {
          title: '预估树龄（年）',
          align: 'center',
          key: 'estimate_age',
          resizable: true,
          sortable: true,

          width: 115,
          render: function (h, params) {
            return h('span', params.row.estimate_age)
          }
        },
        {
          title: '树高（米）',
          align: 'center',
          key: 'height',
          resizable: true,
          sortable: true,
          width: 100,
          render: function (h, params) {
            return h('span', params.row.height)
          }
        },
        {
          title: '经度',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.longitude)
          }
        },
        {
          title: '纬度',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.latitude)
          }
        },
        {
          title: '权属',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.owner)
          }
        },
        {
          title: '管护单位',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.gh_unit)
          }
        },
        // {
        //   title: '管护人',
        //   align: 'center',
        //   resizable: true,
        //   width: 90,
        //   render: function (h, params) {
        //     return h('span', params.row.ghr_name)
        //   }
        // },


        {
          title: '调查时间',
          align: 'center',
          width: '150px',
          resizable: true,
          render: function (h, params) {
            return h('span', params.row.accessStartTime)
          }
        },
        {
          title: '调查账号',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.dc_username)
          }
        },
        {
          title: '调查单位',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.CompanyB)
          }
        },
        {
          title: '调查人',
          align: 'center',
          resizable: true,
          width: 90,
          render: function (h, params) {
            return h('span', params.row.investigator)
          }
        },
        {
          title: '单位审核状态',
          align: 'center',
          resizable: true,
          fixed: 'right',
          width: 110,
          render: function (h, params) {
            if(params.row.dw_CheckState === '未审核'){
              return h('Tag', { props: { color: 'red' } }, params.row.dw_CheckState)
            }else {
              return h('Tag', { props: { color: 'blue' } }, params.row.dw_CheckState)
            }

          }
        },
        {
          title: '单位审核结果',
          align: 'center',
          resizable: true,
          width: 120,
          render: function (h, params) {
            if(params.row.dw_CheckResult === '审核通过'){
              return h('Tag', { props: { color: 'blue' } }, '通过')
            }else if(params.row.dw_CheckResult === '审核不通过'){
              return h('Tag', { props: { color: 'red' } }, '不通过')
            }else {
              return h('span','')
            }

          }
        },
        {
          title: '操作',
          align: 'center',
          width: '220px',
          fixed: 'right',
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
                    this.$router.push({ path: `/survey/coverPage/${params.row.tree_code}` })
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
                  value: ['超级管理员', '单位管理员','调查人员']
                }],
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.delete_tree_code = params.row.tree_code
                    this.deleteConfirmModal = true
                  }
                }
              }, '删除'),

              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: "md-download"
                },
                // attrs:{
                //   href: 'http://8.140.170.84:35000/export_report/' + params.row.tree_code
                //   // href: 'http://localhost:5000/export_report/' + params.row.tree_code
                // },
                directives: [{
                  name: 'role',
                  value: ['超级管理员', '单位管理员']
                }],
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.onExportReport(params.row.tree_code)
                  }
                }
              }, '导出报告')
            ])
          }
        }
      ],

      tableData: [],
      model1: '',
      levelList: [
        {
          value: '特级',
          label: '特级'
        },
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

  methods: {
    onDwCheckModalOK(data){
      let new_data = {
        trees_code: this.selected_trees,
        check: data
      }
      BatchCheckTrees(new_data).then(res=>{
        if(res.data.code === 200){
          this.$Message.success('批量审核成功')
          this.fetchData()
        }else {
          this.$Message.error('批量审核失败')
        }
      })
      this.ShowDwCheckModal = false
    },
    onDwCheckModalCancel(){
      this.ShowDwCheckModal = false
    },

    //导出古树调查报告--下载
    //window.location.href 告诉您浏览器当前URL位置的属性。更改属性的值将重定向页面。
    //window.open 打开一个新的窗口并跳转到URL
    onExportReport(tree_code){
      // window.location.href='http://8.140.170.84:35000/export_report/'+tree_code
      window.location.href=`http://49.232.244.63:8086/docx/${tree_code}.docx`
  // /*    window.location.href='http://localhost:5000/export_report/'+tree_code*/
    },
    SelectTreesChange(selection){
      console.log('select',selection)
      this.selected_trees = selection.map((item) => {
        return item.tree_code
      })
    },

    onPageSizeChange(page_size){
      console.log('page_size',page_size)
      this.pages._per_page = page_size
      this.loadingTable = true
      this.fetchData()

    },
    //调查人查询
    ondcUserUnitQueryChange(value){
      queryUnitUsers({name_like: value, is_dc:true}).then(res => {
        this.dcUsers = res.data.users
      })
    },

    //时间范围查询，时间范围发生变化时
    DateTimeChange(value){
      if(value[0]!==''&&value[1]!=='') {
        this.query.accessStartTime_gte = value[0]
        this.query.accessStartTime_lte = value[1]
      }else {
        this.query.accessStartTime_gte = undefined
        this.query.accessStartTime_lte = undefined
      }
    },
    //删除确认------
    ConfirmDelete(){
      deleteOneTree(this.delete_tree_code).then(msg=>{
        if(msg.data.code === 200){
          this.$Message.success('该古树删除成功')
          this.deleteConfirmModal = false
          this.delete_tree_code = undefined
          this.fetchData()
        }else {
          this.$Message.error('该古树删除失败')
        }
      })
    },
    CancelDelete(){
      this.deleteConfirmModal = false
    },


    fetchData: function () {
      // 数据表发生变化请求数据

      let args = { ...this.query, ...this.pages }
      console.log(typeof (this.query.tree_code_like))

      return queryTreeBasicProperty(args).then((resp) => {
        this.tableData = resp.data.trees_basic_property
        this.total = resp.data.total
        this.loadingTable = false
      })
    },
    onSearch () {
      this.pages._page = 1
      this.fetchData()
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },

    fetchOptions(){
      GetKe().then(ke=>{
        this.KeList = ke.data.families
      })
      GetShu().then(shu=>{
        this.ShuList = shu.data.genuses
      })
      GetZhong().then(name=>{
        this.NameList = name.data.names
      })
    },

    // JsonChangeToOptions () {
    //   let options = name.contents
    //   let keArr = []
    //   let shuArr = []
    //   let nameArr = []
    //   for (let [index, elem] of options.entries()) {
    //     if (!keArr.includes(elem.ke)) {
    //       keArr.push(elem.ke)
    //       this.KeList.push({ fname: elem.ke })
    //     }
    //     if (!shuArr.includes(elem.shu)) {
    //       shuArr.push(elem.shu)
    //       this.ShuList.push({ gname: elem.shu })
    //     }
    //     if (!nameArr.includes(elem.name)) {
    //       nameArr.push(elem.name)
    //       this.NameList.push({ name: elem.name })
    //     }
    //   }
    //   console.log('###KeList', this.KeList)
    //   console.log('###ShuList', this.ShuList)
    //   console.log('###NameList', this.NameList)
    // }
  },
  mounted() {

  },
  created () {
    queryTreeBasicProperty({ ...this.pages, ...this.query }).then((resp) => {
      this.tableData = resp.data.trees_basic_property
      this.total = resp.data.total
    })

    this.fetchOptions()

    queryUnits().then(res=>{
      this.Unit = res.data.units
    })

  }

}
</script>

<style scoped>
/*控制formItem上下间隔距离*/
.ivu-form-item {
  margin-bottom: 10px;
}
</style>
