<template>
  <div class="block">
    <span class="demonstration">默认显示所有Tag</span>
    <el-cascader
      v-model="value"
      :options="options"
      :props="props"
      clearable
      @change="Change">
    </el-cascader>


    <Select v-model="model" style="width:200px" multiple @on-change="showValue">
      <OptionGroup v-for="project in projects" :label="project.value" :key="project.value">
        <Option v-for="item in methods[project.value]" :value="item.value" :key="item.value">{{ project.value}}({{item.label}})</Option>
      </OptionGroup>

    </Select>
  </div>
</template>

<script>


import {queryYhOptionCascader} from "@/api/yh_manage";

export default {
  name: "Cascader-multi-text",

  data () {
    return {
      value:[],
      model: [],
      projects: [{value:'支撑',label: '支撑'},{value:'拉纤',label: '拉纤'}],
      //methods中的value值可以为classfiy的id
      methods:{
        '支撑':[{value:1,label: '调整'},{value:2,label: '新增'}],
        '拉纤':[{value:3,label: '修复'},{value:4,label: '新增'}]
      },

      props: { multiple: true, value:'value',label:'label', children: 'children' },
      options: [],

    };
    },
  methods: {
    showValue(value){
      console.log('select value',value)
    },
    Change(value){
      console.log('#',value)
      var methods = new Array()
      var projects = new Array()
      value.map(item=>{
        if(projects.includes(item[0])){
          methods[item[0]].push(item[1])
        }else {
          projects.push(item[0])
          methods[item[0]] = new Array()
          methods[item[0]].push(item[1])
        }
      })

      console.log('projects',projects)
      console.log('methods',methods)
    }


  },
  created() {

    queryYhOptionCascader({yh_type: '树体保护措施', unit: '颐和园'}).then(res=>{
      this.options = res.data.yh_options
      console.log(this.options)
    })
  }

}
</script>

<style scoped>

</style>
