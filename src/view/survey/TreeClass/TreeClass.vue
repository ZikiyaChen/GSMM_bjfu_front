<!--<template>-->
<!--  <Card>-->
<!--    <Table :columns="columns" :data="tableData" border></Table>-->
<!--  </Card>-->
<!--</template>-->

<!--<script>-->
<!--import {getClassTableData} from "@/api/table";-->



<!--export default {-->
<!--  name: "TreeClass",-->
<!--  data: function () {-->
<!--    return {-->
<!--      tableData: [],-->
<!--      class_datas: {},-->
<!--      columns: [-->
<!--        {-->
<!--          title: '科',-->
<!--          key: 'fname',-->
<!--          align: 'center',-->
<!--          width: 150-->
<!--          // render: function (h, params) {-->
<!--          //   return h('span', params.row.genus_type.family_type.fname)-->
<!--          // }-->
<!--        },-->

<!--        {-->
<!--          title: '属',-->
<!--          align: 'center',-->
<!--          key: 'genus_list',-->
<!--          width: 240,-->
<!--          render: (h, params) => {-->
<!--            return h('div', {-->
<!--                attrs: {-->
<!--                  class: 'subCol'-->
<!--                }-->
<!--              },-->
<!--              [-->
<!--                h('ul', this.tableData[params.index].genus_list.map(item => {-->
<!--                  return h('li', {-->
<!--                  }, item.genus)-->
<!--                }))-->
<!--              ])-->
<!--          }-->
<!--        }-->
<!--      ]-->

<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    getClassTableData().then((res=>{-->
<!--      // this.assembleData(res.data.class_datas)-->
<!--      this.tableData =res.data.class_datas-->
<!--    }))-->
<!--  },-->
<!--  methods: {-->

<!--  }-->

<!--}-->
<!--</script>-->



<!--&lt;!&ndash;<style scoped>&ndash;&gt;-->
<!--<style>-->
<!--.subCol > ul > li{-->
<!--  margin:0 -18px;-->
<!--  list-style:none;-->
<!--  text-Align: center;-->
<!--  padding-top: 9px;-->
<!--  border-bottom:1px solid #ccc;-->
<!--  overflow-x: hidden;-->
<!--  min-height: 42px;-->
<!--}-->
<!--.subCol > ul>li:last-child{-->
<!--  border-bottom: none-->
<!--}-->

<!--</style>-->



<template>
  <Card>
<!--    <Form inline>-->
<!--      <FormItem>-->
<!--        <Button type="primary" @click="showAddClassModal=true">新增树种信息</Button>-->
<!--      </FormItem>-->
<!--    </Form>-->
<!--    <Table :columns="columns" :data="tableData" border width="602"></Table>-->

<!--    <AddTreeClassModal-->
<!--    :show="showAddClassModal"-->
<!--    @onOK="ok"-->
<!--    @onCancel="cancel">-->
<!--    </AddTreeClassModal>-->
    <Form inline>
      <FormItem style="width: 500px;">
        <Cascader v-model="treetype" :data="options" clearable	>
        </Cascader>
      </FormItem>
    </Form>
  </Card>


</template>
<script>
import {getClassTable} from "@/api/table";
import AddTreeClassModal from "@/view/survey/TreeClass/AddTreeClassModal";
import name from "@/view/tools-methods/name.json"
export default {
  name:"TreeClass",
  components: {AddTreeClassModal},
  data(){
    return{
      treetype:[],
      options:[],
      Data:[],
      showAddClassModal: false,
      tableData: [],
      columns:[
        {
          title: '科',
          align: 'center',
          width: 150,
          render: function (h, params) {
            return h('span', params.row.genus_type.family_type.fname)
          }
        },
        {
          title: '属',
          align: 'center',
          width: 150,
          render: function (h, params) {
            return h('span', params.row.genus_type.genus)
          }
        },
        {
          title: '种 / 中文名',
          align: 'center',
          width: 150,
          render: function (h, params) {
            return h('span', params.row.zw_name)
          }
        },

        {
          title: '拉丁名',
          align: 'center',
          width: 150,
          render: function (h, params) {
            return h('span', params.row.ld_name)
          }
        },
      ]
    }
  },
  created() {
    this.Data= name.contents
    console.log('******',this.Data)
    this.DataTurn(this.Data)
  },
  // mounted() {
  //   getClassTable().then((res=>{
  //      this.tableData =res.data.class_datas
  //      }))
  // },
  methods:{
    //将json数据转成级联选择器种的data形式
    DataTurn(data){
      var option=[]
      var keArr=[]
      var shuArr=[]
      var nameArr=[]
      var shuIndex={}
      for (let [index, elem] of data.entries()) {

        if(!keArr.includes(elem.ke)){//如果该科第一次被遍历到，那么直接将科属种全部加入
          keArr.push(elem.ke)
          shuArr.push(elem.shu)

          option.push({
            value: elem.ke,
            label: elem.ke,
            children: [{
              value: elem.shu,
              label: elem.shu,
              children: [{
                value: elem.name,
                label: elem.name,
                children: [{ value:elem.lading, label: elem.lading}]
              }]
            }]
          })

          shuIndex[elem.shu]=option[option.length-1].children.length -1

        }else {//该科不是第一次被遍历到, 即已被加入
          let i=keArr.indexOf(elem.ke);// 找到该科第一次被加入时的索引位置


          if(!shuArr.includes(elem.shu)){//该科的属没有被加入,把该属及种加入
            shuArr.push(elem.shu)
           option[i].children.push({
             value: elem.shu,
             label: elem.shu,
             children:[{
               value: elem.name,
               label: elem.name,
               children: [{ value: elem.lading, label: elem.lading }]
             }]
           })

            shuIndex[elem.shu]=option[i].children.length -1

          }else {//如果该属被加入了。
            option[i].children[shuIndex[elem.shu]].children.push({
              value: elem.name,
              label: elem.name,
              children: [{ value: elem.lading, label: elem.lading}]
            })

          }

        }
      }
      this.options=option


    },

    ok(){
      this.showAddClassModal = false
    },
    cancel(){
      this.showAddClassModal = false
    }
  }
}
</script>

