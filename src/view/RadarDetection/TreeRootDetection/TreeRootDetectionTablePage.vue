<template>
  <div>
    <Card>
      <h2 slot="title">树根检测</h2>

      <Form :label-width="75" :model="query" inline>
        <FormItem label="古树编号">
          <Input v-model="query.tree_code_like" style="width: 120px" clearable placeholder="古树编号"></Input>
        </FormItem>

        <FormItem label="检测时间" >
          <DatePicker :value="detection_time_range"  type="datetimerange" format="yyyy-MM-dd HH:mm"
                      placement="bottom-start" placeholder="Select date"
                      @on-change="DateTimeChange"
                      clearable style="width: 250px"></DatePicker>
        </FormItem>



        <FormItem >
          <Button type="primary" @click=" onSearch">查询</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="()=>{this.showAddRootModal=true}">新增</Button>
        </FormItem>

      </Form>



      <Table :columns="columns" :data="tableData" border  :loading="loadingTable" :stripe="true" highlight-row
             @on-selection-change="SelectTreesChange"></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: right;">
          <Page :total="total"  :current="pages._page" :page-size="pages._per_page" show-total
                @on-change="onPageChange"
                show-elevator show-sizer :page-size-opts="[50,100,150]" @on-page-size-change="onPageSizeChange"></Page>
        </div>
      </div>
      <AddRootDetectionModal
        :show="showAddRootModal"
        @onOK="onAddModalOK"
        @onCancel="onAddModalCancel"
        ref="add"
      ></AddRootDetectionModal>
      <UpdateRootDetectionModal
        :show="showUpdateRootModal"
        @onOK="onUpdateRootModalOK"
        @onCancel="onUpdateRootModalCancel"
        :selected_id="this.selected_id"
      ></UpdateRootDetectionModal>
      <show-root-detection-modal
        :show="showRootModal"
        @onOK="onShowRootModalOK"
        @onCancel="onShowRootModalCancel"
        :selected_id="this.selected_id"
      ></show-root-detection-modal>
      <Modal
        v-model="deleteConfirmModal"
        :selected_id="delete_id">
        <p slot="header" style="color:#ff9900;text-align:center; font-size: 16px">
          <Icon type="ios-information-circle"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align:center; font-size: 16px">
          <p>会删除该树干检测信息，删除后不可取消，请确认是否删除？</p>
          <P>确认删除请点击“删除”，否则点击“取消”按钮。</P>
          <p></p>
        </div>
        <div slot="footer" style="text-align: center">
          <Button type="error" size="large"  @click="ConfirmDelete">删除</Button>
          <Button size="large" @click="CancelDelete">取消</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import AddRootDetectionModal from "@/view/RadarDetection/TreeRootDetection/components/AddRootDetectionModal";
import UpdateRootDetectionModal from "@/view/RadarDetection/TreeRootDetection/components/UpdateRootDetectionModal";
import {deleteRoot, insertRoot, queryRootDetections, updateRoot} from "@/api/health_detection";
import ShowRootDetectionModal from "@/view/RadarDetection/TreeRootDetection/components/showRootDetectionModal";
import params from "@/view/argu-page/params";


export default {
  name: "TreeRootDetectionTablePage",
  components: {ShowRootDetectionModal, AddRootDetectionModal, UpdateRootDetectionModal},
  data(){
    return{
      showAddRootModal: false,
      showUpdateRootModal: false,
      showRootModal: false,
      selected_id: undefined,

      deleteConfirmModal: false,
      delete_id: undefined,

      detection_time_range: undefined,


      loadingTable: false, // 表格加载状态
      loading: false,

      query: {
        tree_code_like: undefined,
      },

      total: 0,
      pages: {
        _page: 1,
        _per_page: 50
      }, // 分页

      columns: [
        {
          title: '古树编号',
          align: 'center',
          key: 'tree_code',
          resizable: true,
          // width: 120,
          sortable: true,
          sortType: 'asc',
          fixed: 'left',
          render: function (h, params) {
            return h('span', params.row.tree_code)
          }
        },
        {
          title: '根系水平分布及分布密度',
          align: 'center',
          resizable: true,
          // width: 100,
          // render: function (h, params) {
          //   return h('span', params.row.pic1_urlList)
          // }
          render: (h, params) => {
            let imgs = params.row.pic1_urlList.length >0 ? params.row.pic1_urlList : ''
            if(imgs){
              return h('viewer', {
                props: {  images: imgs  },
                style: { height: "80px", margin: "10px", overflow: 'hidden', position:'relative'}

              }, imgs.map(img=>{
                return h('img', {
                  attrs: {  src: img },
                  style: { maxWidth: '100%', maxHeight: '100%', verticalAlign: 'middle',
                    position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}
                },);
              })
              )
            }else {
              return h('span','');
            }
          }
        },
        {
          title: '根系深度分层水平分布及分布密度',
          align: 'center',
          resizable: true,
          // width: 90,
          // render: function (h, params) {
          //   return h('span', params.row.pic2_urlList)
          // }
          render: (h, params) => {
            let imgs = params.row.pic2_urlList.length >0 ? params.row.pic2_urlList : ''
            if(imgs){
              return h('viewer', {
                props: { images: imgs },
                style: { height: "80px", margin: "10px", overflow: 'hidden', position:'relative'}
                }, imgs.map(img=>{
                  return h('img', {
                    attrs: {
                      src: img,
                    },
                    style: { maxWidth: '100%', maxHeight: '100%', verticalAlign: 'middle',
                      position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}

                  },);
                })
              )
            }else {
              return h('span','');
            }
          }
        },
        {
          title: '侧柏根系三维拓扑结构图',
          align: 'center',
          resizable: true,
          // width: 115,
          // render: function (h, params) {
          //   return h('span', params.row.pic3_urlList)
          // }
          render: (h, params) => {
            let imgs = params.row.pic3_urlList.length >0 ? params.row.pic3_urlList : ''
            if(imgs){
              return h('viewer', {
                props: { images: imgs },
                style: { height: "80px", margin: "10px", overflow: 'hidden', position:'relative'}
                }, imgs.map(img=>{
                  return h('img', {
                    attrs: {
                      src: img,
                    },
                    style: { maxWidth: '100%', maxHeight: '100%', verticalAlign: 'middle',
                      position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}
                  },);
                })
              )
            }else {
              return h('span','');
            }
          }
        },

        {
          title: '检测结论',
          align: 'center',
          key: 'test_conclusion',
          resizable: true,

          width: 120,
          render: function (h, params) {
            return h('Tooltip', {
              props:{ placement:'left-start' }
            },[
              h('div',{
                style:{
                  width: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              },params.row.test_conclusion),
                h('span', {
                  slot: 'content',
                  style:{
                    whiteSpace: 'normal',
                    wordBreak: 'break-all'
                  }
                }, params.row.test_conclusion)
            ])
          }
        },

        {
          title: '检测时间',
          align: 'center',
          // width: '150px',
          resizable: true,
          render: function (h, params) {
            return h('span', params.row.test_time)
          }
        },

        {
          title: '操作',
          align: 'center',
          width: '165px',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    this.selected_id = params.row.id
                    this.showRootModal = true
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                // directives: [{
                //   name: 'role',
                //   value: ['超级管理员', '单位管理员']
                // }],
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    // this.delete_tree_code = params.row.tree_code
                    // this.deleteConfirmModal = true
                    this.selected_id = params.row.id
                    this.showUpdateRootModal = true
                  }
                }
              }, '修改'),

              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  // icon: "md-download"
                },
                // attrs:{
                //   href: 'http://8.140.170.84:35000/export_report/' + params.row.tree_code
                //   // href: 'http://localhost:5000/export_report/' + params.row.tree_code
                // },
                // directives: [{
                //   name: 'role',
                //   value: ['超级管理员', '单位管理员']
                // }],
                style: {
                  marginRight: '2px'
                },
                on: {
                  click: () => {
                    // this.onExportReport(params.row.tree_code)
                    this.delete_id = params.row.id
                    this.deleteConfirmModal = true

                  }
                }
              }, '删除')
            ])
          }
        }
      ],

      tableData: [],
    }
  },
  created() {
    this.fetchData()

  },
  methods:{
    fetchData: function () {
      // 数据表发生变化请求数据

      let args = { ...this.query, ...this.pages }

      return queryRootDetections(args).then((resp) => {
        this.tableData = resp.data.roots
        this.total = resp.data.total
        this.loadingTable = false
      })
    },

    //时间范围查询，时间范围发生变化时
    DateTimeChange(value){
      if(value[0]!==''&&value[1]!=='') {
        this.query.test_time_gte = value[0]
        this.query.test_time_lte = value[1]
      }else {
        this.query.test_time_gte = undefined
        this.query.test_time_lte = undefined
      }
    },
    SelectTreesChange(selection){
      console.log('select',selection)
      this.selected_trees = selection.map((item) => {
        return item.tree_code
      })
    },
    onSearch () {
      this.pages._page = 1
      this.fetchData()
    },
    onPageSizeChange(page_size){
      this.pages._per_page = page_size
      this.loadingTable = true
      this.fetchData()
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    //增加
    onAddModalOK (root) {
      insertRoot(root).then((res) => {
        if(res.data.code === 200){
          this.$Message.success('添加成功')
          this.fetchData()
        }else if(res.data.code === 501){
          this.$Message.error('添加失败，请先填写该树木基本信息！')
        }else {
          this.$Message.error('添加失败!')
        }
      })
      // this.$refs.add.setClearData()

      this.showAddRootModal = !this.showAddRootModal
    },
    onAddModalCancel () {
      this.showAddRootModal = false
    },

    //修改，编辑
    onUpdateRootModalOK (root) {
      console.log('---update111--root---',root)
      updateRoot(root.id, root).then(res=>{
        if(res.data.code === 200){
          this.$Message.success({
            content:'修改成功',
            duration:5,
            closable: true
          })
          this.fetchData()
        }else {
          this.$Message.error({
            content: '修改失败',
            duration: 5,
            closable: true
          })
        }
      })
      this.showUpdateRootModal = false
    },
    onUpdateRootModalCancel () {
      this.showUpdateRootModal = false
    },

    //删除确认------
    ConfirmDelete(){
      deleteRoot(this.delete_id).then(msg=>{
        if(msg.data.code === 200){
          this.$Message.success('删除成功')
          this.deleteConfirmModal = false
          this.delete_id = undefined
          this.fetchData()
        }else {
          this.$Message.error('删除失败')
        }
      })
    },
    CancelDelete(){
      this.deleteConfirmModal = false
    },
    onShowRootModalOK(){
      this.showRootModal = false
    },
    onShowRootModalCancel(){
      this.showRootModal = false
    }
  }
}
</script>

<style scoped>

</style>
