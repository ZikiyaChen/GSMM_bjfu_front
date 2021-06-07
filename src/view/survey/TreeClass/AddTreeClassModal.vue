<template>
<Modal
  :value="show"
  title="新增树种信息"
  @on-ok="handleOK"
  @on-cancel="handleCancel">

<!--  <Form ref="tree_class_form" :model="tree_class" :rules="ruleValidate">-->
<!--    <FormItem label="科" prop="fname" >-->
<!--      <AutoComplete v-model="nowLabel" style="width: 150px"-->
<!--                    @on-change="changeSel"  @on-select="selectSel">-->
<!--        <Option v-for="item in SelArr" :value="item.fname" :key="item.fid">{{item.fname}}</Option>-->
<!--      </AutoComplete>-->
<!--    </FormItem>-->
<!--  </Form>-->
<Form ref="tree_class_form" :model="tree_class" :rules="ruleValidate" :label-width="150">
  <FormItem label="科">
    <AutoComplete v-model="tree_class.fname" style="width: 150px"
                @on-select="findGenus">
      <Option v-for="item in prevArr " :value="item.fname" :key="item.fid">{{item.fname}}</Option>
    </AutoComplete>
  </FormItem>

  <FormItem label="属">
    <AutoComplete v-model="tree_class.genus" style="width: 150px">
      <Option v-for="item in genusArr " :value="item.genus" :key="item.gid">{{item.genus}}</Option>
    </AutoComplete>
  </FormItem>

  <FormItem label="种/中文名">
    <Input v-model="tree_class.zw_name" style="width: 150px"></Input>
  </FormItem>

  <FormItem label="拉丁名">
    <Input v-model="tree_class.ld_name" style="width: 150px"></Input>
  </FormItem>
</Form>
</Modal>
</template>

<script>
import {queryFamilyTypes, queryGenusTypes} from "@/api/table";

export default {
  name: "AddTreeClassModal",
  props: {
    show: {
      type:Boolean,
      default:false
    },
    onCancel: Function,
    onOK: Function,
  },
  data(){
    return{
      prevArr:[],
      isSel:false,
      genusArr:[],

      nowLabel:'',

      tree_class:{
        fname: '',
        genus: '',
        zw_name: '',
        ld_name: ''
      },

      ruleValidate:{}
    }
  },
  mounted() {
    queryFamilyTypes().then((res=>{
      this.prevArr = res.data.species_types

    }))
  },
  methods:{
    findGenus(value){
      console.log('select___',value)
      queryFamilyTypes({'fname':value}).then((res=>{
        console.log(res)
        queryGenusTypes({'fid':res.data.species_types[0].fid}).then((resp=>{
          console.log('genus',resp.data)
          this.genusArr=resp.data.genus_types
        }))
      }))
    },


    handleOK(){
      console.log('****',this.tree_class)
      this.$emit('onOK',this.tree_class)
    },
    handleCancel(){
      this.$emit('onCancel')
    }
  }
}
</script>

<style scoped>

</style>
