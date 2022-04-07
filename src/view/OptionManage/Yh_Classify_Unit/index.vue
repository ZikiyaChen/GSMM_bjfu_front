<template>
  <div id="root">
    <Card>
      <h1>古树养护工作项目分类</h1>
      <br>
      <Button @click="modalAdd = true" type="primary" style="margin-bottom: 5px">添加</Button>
      <br>
      <Table v-if="isRouterAlive" :columns="columns" :data="orderedData" border :span-method="handleSpan" disabled-hover>
        <template slot-scope="{ row, index }" slot="yh_type">
          <Input type="text" v-model="editType" v-if="editIndex === index"/>
          <span v-else>{{ row.yh_type }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="project">
          <Input type="text" v-model="editProject" v-if="editIndex === index"/>
          <span v-else>{{ row.project }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="method">
          <Input type="text" v-model="editMethod" v-if="editIndex === index"/>
          <span v-else>{{ row.method }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button @click="handleEdit(row, index)" size="small" type="primary">修改</Button>
            <Button @click="handleDelete(row)" type="error" size="small" style="margin-left: 10px">删除</Button>
          </div>
        </template>
      </Table>
    </Card>

    <Modal
      v-model="modalAdd"
      title="请输入要添加的信息"
      @on-ok="handleAdd"
      @on-cancel="handleCancel">
      <Form :label-width="90" >
        <FormItem label="养护类型">
          <AutoComplete v-model="inputType" :data="TypeList" placeholder="请输入养护类型"
                        clearable icon="ios-arrow-dropdown-circle"  @on-change="TypeChange">
          </AutoComplete>
        </FormItem>
        <FormItem label="具体养护项目">
          <AutoComplete v-model="inputProject" placeholder="请输入具体养护项目" clearable :data="ProjectArr"
                        icon="ios-arrow-dropdown-circle"  @on-change="ProjectChange"></AutoComplete>
          <!--          <Input v-model="inputProject" placeholder="请输入具体养护项目" style="margin:5px">-->
          <!--          </Input>-->
        </FormItem>
        <FormItem label="处理方法">
          <Input v-model="inputMethod" placeholder="请输入处理方法" />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="editModal"
      title="请修改信息"
      @on-ok="handleChange"
      @on-cancel="handleCancel">
      <Form :label-width="90">
        <FormItem label="养护类型">
          <Input v-model="editType" />
        </FormItem>
        <FormItem label="具体养护项目">
          <Input v-model="editProject" />
        </FormItem>
        <FormItem label="处理方法">
          <Input v-model="editMethod" />
        </FormItem>
      </Form>
    </Modal>
    <br>



  </div>

</template>

<script>
import {
  AddUnitYhOptions,
  deleteUnitYhOptions,
  updateUnitYhOptions,
  getUnitMaintenanceProjects,
  queryUnitYhClassify
} from '@/api/yh_manage'
import UserMixin from "@/mixin/UserMixin";

export default {
  name: "index",
  mixins: [UserMixin],
  data () {
    return {
      TypeList: ['日常养护管理','修剪','树体保护措施','病虫害防治', '生长环境保护与改善','巡查工作'],
      ProjectArr: [],

      // 表头
      columns: [
        {
          title: '养护类型',
          slot: 'yh_type'
        },
        {
          title: '具体养护项目',
          slot: 'project'
        },
        {
          title: '处理方法',
          slot: 'method'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],

      content: [],

      isRouterAlive: true,

      modalAdd: false, // 控制增加输入框是否出现

      sameTypeIndexArray: [], // 相同类型的数组下标
      sameProjectIndexArray: [], // 相同项目的数组下标

      inputType: '', // 第一列输入框
      inputProject: '', // 第二列输入框
      inputMethod: '', // 第三列输入框

      editRowId: -1,
      editModal: false,
      editIndex: -1, // 当前聚焦的输入框行数
      editType: '', // 第一列输入框 yh_type
      editProject: '', // 第二列输入框 project
      editMethod: '', // 第三列输入框 method
    }
  },
  computed: {
    orderedData () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.content.sort(
        (data1, data2) => {
          let type1 = data1.yh_type.toLowerCase()
          let type2 = data2.yh_type.toLowerCase()
          if (type1 < type2) {
            return -1
          } else if (type1 > type2) {
            return 1
          } else {
            let project1 = data1.project.toLowerCase()
            let project2 = data2.project.toLowerCase()
            return project1 < project2 ? -1 : project1 > project2 ? 1 : 0
          }
        }
      )
    }
  },
  methods: {
    // yh_type改变时，project下拉框选项改变
    TypeChange(value){
      if(this.TypeList.includes(value)){
        getUnitMaintenanceProjects({yh_type:value, unit:this.unit}).then(res=>{
          let ProjectList= res.data.projects
          this.ProjectArr = []
          ProjectList.forEach((item, index, array) => {
            console.log(item)
            this.ProjectArr.push(item['project'])
          })
        })
      }
    },

    ProjectChange(){

    },
    getYhClassifyData () {
      queryUnitYhClassify({unit:this.unit}).then(result => {
        this.content = result.data.yh_classify
      })
    },

    reload () { // 使用v-if，重新调用获取表格数据接口，刷新表格
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.getYhClassifyData()
        this.getSameTypeAndSameProjectIndex()
        this.isRouterAlive = true
      })
    },

    handleChange () {
      let data = {}
      data['yh_type'] = this.editType
      data['project'] = this.editProject
      data['method'] = this.editMethod
      data['unit'] = this.unit
      updateUnitYhOptions(this.editRowId, data).then((result) => {
        if (result.data.code === 200) {
          this.$Message.success('信息修改成功')
          this.editIndex = -1
          this.reload()
        } else {
          this.$Message.error('信息修改失败')
        }
      })
    },

    handleDelete (row) {
      deleteUnitYhOptions(row.id).then((result) => {
        if (result.data.code === 200) {
          this.$Message.success('信息删除成功')
          this.reload()
        } else {
          this.$Message.error('信息删除失败')
        }
      })
    },

    handleEdit (row, index) {
      this.editType = row.yh_type;
      this.editProject = row.project;
      this.editMethod = row.method;
      this.editModal = true;
      this.editRowId = row.id
    },

    // 将添加输入框清空
    inputDataClean () {
      this.inputType = ''
      this.inputProject = ''
      this.inputMethod = ''
    },

    handleAdd () {
      // eslint-disable-next-line no-new-object
      let yhClassify = new Object()
      yhClassify.yh_type = this.inputType
      yhClassify.project = this.inputProject
      yhClassify.method = this.inputMethod
      yhClassify.unit = this.unit
      console.log(yhClassify)
      AddUnitYhOptions(yhClassify).then(
        (result) => {
          if (result.data.code === 200) {
            this.$Message.success('信息添加成功')
            this.reload()
            this.inputDataClean()
          } else {
            if(result.data.code === 501){
              this.$Message.error('已存在，添加失败')
              this.inputDataClean()
            }else {
              this.$Message.error('信息添加失败')
              this.inputDataClean()
            }

          }
        }
      )
    },

    handleCancel () {
      this.inputDataClean()
    },

    // 获取养护类型和养护项目相同的数据的数组下标
    getSameTypeAndSameProjectIndex () {
      // 获取相同养护类型的数据的数组下标
      let typeObject = {}
      this.orderedData.forEach((element, index) => {
        element.rowIndex = index
        if (typeObject[element.yh_type]) {
          typeObject[element.yh_type].push(index)
        } else {
          typeObject[element.yh_type] = []
          typeObject[element.yh_type].push(index)
        }
      })

      // 获取相同项目的数据的数组下标
      let projectObject = {}
      this.orderedData.forEach((element, index) => {
        element.rowIndex = index
        if (projectObject[element.project]) {
          projectObject[element.project].push(index)
        } else {
          projectObject[element.project] = []
          projectObject[element.project].push(index)
        }
      })

      // 存入
      this.sameTypeIndexArray = []
      for (let key in typeObject) {
        if (typeObject[key].length > 1) {
          this.sameTypeIndexArray.push(typeObject[key])
        }
      }
      this.sameProjectIndexArray = []
      for (let key in projectObject) {
        if (projectObject[key].length > 1) {
          this.sameProjectIndexArray.push(projectObject[key])
        }
      }
    },

    // 合并行和列
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      // 合并行和列的主要逻辑
      function mergeSpanHelper (indexArray, rowIndex) {
        for (let i = 0; i < indexArray.length; ++i) {
          let sameIndexArray = indexArray[i]
          for (let j = 0; j < sameIndexArray.length; ++j) {
            let index = sameIndexArray[j]
            if (rowIndex === index) {
              if (j === 0) { // 这里 j 等于 0 表示，需要向下扩充的第一行
                return {
                  rowspan: sameIndexArray.length,
                  colspan: 1
                }
              } else { // 其他行隐藏
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }

      // 需要合并的 yh_type
      if (columnIndex === 0) {
        return mergeSpanHelper(this.sameTypeIndexArray, rowIndex)
      }
      // 需要合并的 project
      if (columnIndex === 1) {
        return mergeSpanHelper(this.sameProjectIndexArray, rowIndex)
      }
    },

  },

  mounted () {
    this.getYhClassifyData()
  },
  beforeUpdate () {
    this.getSameTypeAndSameProjectIndex()
  }

}
</script>

<style scoped>

</style>

