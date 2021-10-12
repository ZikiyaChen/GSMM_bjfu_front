<template>
  <div>
<!--    <Cascader v-model="value1" :data="options" clearable style="width: 400px"></Cascader>-->
    <Card>
    <h2 slot="title">树种管理</h2>
    <Form :label-width="60" :model="query" inline>
      <FormItem label="科:" >
        <Select style="width:140px" v-model="query.family" clearable>
          <Option v-for="item in KeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="属:" >
        <Select style="width:140px" v-model="query.genus" clearable>
          <Option v-for="item in ShuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="种:" >
        <Select style="width:140px" v-model="query.zw_name" clearable>
          <Option v-for="item in NameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem >
        <Button type="primary" @click=" onSearch">查询</Button>
      </FormItem>
      <FormItem>
        <Button @click="showAddSpeciesModal = true" type="primary">添加</Button>
      </FormItem>
    </Form>

    <Table :columns="columns" :data="tableData" border max-height="400" :loading="loadingTable"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="float: right;">
        <Page :total="total"  :current="pages._page" :page-size="pages._per_page" show-total
              @on-change="onPageChange"
              show-elevator show-sizer :page-size-opts="[10,20,30]" @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </div>

      <AddSpeciesModal
        :show="showAddSpeciesModal"
        @onOK="AddSpeciesOK"
        @onCancel="AddSpeciesCancel">
      </AddSpeciesModal>

      <UpdateSpeciesModal
        :show="showUpdateSpeciesModal"
        :id = "selected_id"
        @onOK="UpdateSpeciesOK"
        @onCancel="UpdateSpeciesCancel">
      </UpdateSpeciesModal>
    </Card>
  </div>

</template>

<script>
import {DeleteSpecies, GetKe, GetShu, GetZhong, QuerySpecies} from "@/api/tree_species";
import AddSpeciesModal from "@/view/OptionManage/SpeciesManage/AddSpeciesModal";
import UpdateSpeciesModal from "@/view/OptionManage/SpeciesManage/UpdateSpeciesModal";


export default {
  name: "index",
  components: {UpdateSpeciesModal, AddSpeciesModal},
  data(){
     return{
       options: [],
       value1:[],

       showAddSpeciesModal: false,
       showUpdateSpeciesModal: false,

       selected_id: 0,
       loadingTable: false,
       tableData: [],
       query:{
         family: undefined,
         genus: undefined,
         zw_name: undefined
       },
       KeList: [],
       ShuList: [],
       NameList: [],

       total: 0,
       pages: {
         _page: 1,
         _per_page: 10
       }, // 分页


       columns: [
         {
           type: 'index',
           width: 60,
           align: 'center',
           indexMethod: (row) => {
             // row._index打印出了0到9，通过数学计算可以算出每一个对应的序号，再返回出对应的序号
             return (row._index + 1) + ((this.pages._page-1) * this.pages._per_page) ;
           }
         },
         {
           title: '科',
           align: 'center',


           key: 'family'
         },
         {
           title: '属',
           align: 'center',

           key: 'genus'
         },
         {
           title: '种',
           align: 'center',
           resizable: true,
           width: 150,
           key: 'zw_name'
         },
         {
           title: '拉丁名',
           align: 'center',
           resizable: true,
           width: 200,
           key: 'ld_name'
         },


         {
           title: '操作',
           align: 'center',
           width: '150px',

           render: (h, params) => {
             return h('div', [
               h('Button', {
                 props: {
                   type: 'primary',
                   size: 'small'
                 },
                 style: {
                   marginRight: '5px'
                 },
                 on: {
                   click: () => {
                     this.selected_id = params.row.id
                     this.showUpdateSpeciesModal = true
                   }
                 }
               }, '修改'),
               h('Button', {
                 props: {
                   type: 'error',
                   size: 'small'
                 },
                 // directives: [{
                 //   name: 'role',
                 //   value: ['超级管理员', '单位管理员']
                 // }],
                 style: {
                   marginRight: '5px'
                 },
                 on: {
                   click: () => {
                     DeleteSpecies(params.row.id).then(res=>{
                       if(res.data.code === 200){
                         this.$Message.success('删除成功')
                         this.fetchData()
                       }else {
                         this.$Message.error('删除失败')
                       }
                     })
                   }
                 }
               }, '删除')
             ])
           }
         }
       ],
     }
  },
  created() {
    // this.DataTurn()
    this.fetchOptions()

  },
  mounted() {
    this.fetchData()

  },
  methods:{
    AddSpeciesOK(){
      this.fetchData()
      this.showAddSpeciesModal = false
    },

    AddSpeciesCancel(){
      this.showAddSpeciesModal = false
    },

    UpdateSpeciesOK(){
      this.fetchData()
      this.showUpdateSpeciesModal = false
    },

    UpdateSpeciesCancel(){
      this.showUpdateSpeciesModal = false
    },

    fetchData(){
      QuerySpecies({...this.query, ...this.pages}).then(res=>{
        this.tableData = res.data.specieses
        this.total = res.data.total
        this.loadingTable = false
      })
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



    onSearch () {
      this.pages._page = 1
      this.fetchData()
    },
    onPageChange (page) {
      // 分页变化
      this.loadingTable = true
      this.pages._page = page
      this.fetchData()
    },
    onPageSizeChange(page_size){
      this.pages._per_page = page_size
      this.loadingTable = true
      this.fetchData()
    },

    // 将数据库数据转成级联选择器的data格式
    DataTurn () {
      var option = []
      var shuArr = []

      GetKe().then(ke=>{
        option = ke.data.families
        for(let [index, elem] of option.entries()){
          GetShu({'family':elem.value}).then(shu=>{
            shuArr = shu.data.genuses
            option[index]['children'] = shuArr
            for(let [j, item] of option[index]['children'].entries()){ // 对children遍历
              GetZhong({'genus':item.value}).then(name=>{
                option[index]['children'][j]['children']=name.data.names
              })
            }
          })
        }
        console.log(option)
        this.options = option
      })

    }
  }
}
</script>

<style scoped>

</style>
