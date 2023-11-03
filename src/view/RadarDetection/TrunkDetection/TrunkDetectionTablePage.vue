<template>
<div>
  <Card>
    <h2 slot="title">树干检测</h2>

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
        <Button type="primary" @click="()=>{this.showAddTrunkModal=true}">新增</Button>
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
    <AddTrunkDetectionModal
      :show="showAddTrunkModal"
      @onOK="onAddModalOK"
      @onCancel="onAddModalCancel"
      ref="add"
    ></AddTrunkDetectionModal>
    <UpdateTrunkDetectionModal
      :show="showUpdateTrunkModal"
      @onOK="onUpdateTrunkModalOK"
      @onCancel="onUpdateTrunkModalCancel"
      :selected_id="this.selected_id"
    ></UpdateTrunkDetectionModal>
    <show-trunk-detection-modal
      :show="showTrunkModal"
      @onOK="onShowTrunkModalOK"
      @onCancel="onShowTrunkModalCancel"
      :selected_id="this.selected_id"
    ></show-trunk-detection-modal>
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
import AddTrunkDetectionModal from "@/view/RadarDetection/TrunkDetection/components/AddTrunkDetectionModal";
import UpdateTrunkDetectionModal from "@/view/RadarDetection/TrunkDetection/components/UpdateTrunkDetectionModal";
import {deleteTrunk, insertTrunk, queryTrunkDetections, updateTrunk} from "@/api/health_detection";
import ShowTrunkDetectionModal from "@/view/RadarDetection/TrunkDetection/components/showTrunkDetectionModal";




export default {
  name: "TrunkDetectionTablePage",
  components: {ShowTrunkDetectionModal, AddTrunkDetectionModal, UpdateTrunkDetectionModal},
  data(){
    return{
      showAddTrunkModal: false,
      showUpdateTrunkModal: false,
      showTrunkModal: false,
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

      tableData: [],

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
          title: '检测高度',
          align: 'center',
          resizable: true,
          // width: 100,
          render: function (h, params) {
            return h('span', params.row.height)
          }
        },
        {
          title: '检测面主干周长',
          align: 'center',
          resizable: true,
          // width: 90,
          render: function (h, params) {
            return h('span', params.row.perimeter)
          }
        },
        {
          title: '检测面空腐率',
          align: 'center',
          resizable: true,
          // width: 115,
          render: function (h, params) {
            return h('span', params.row.empty_rot_rate)
          }
        },
        {
          title: '树干检测图像',
          align: 'center',
          resizable: true,
          width: 150,

          // width: 115,
          // render: function (h, params) {
          //   return h('span', params.row.pic3_urlList)
          // }
          render: (h, params) => {
            let imgs = params.row.trunk_section_pic_urlList.length >0 ? params.row.trunk_section_pic_urlList : ''
            if(imgs){
              return h('viewer', {
                props: { images: imgs },
                style: { height: "38px", margin: "1px", overflow: 'hidden', display: 'flex', position:'relative'}

                  // style: { height: "80px", margin: "10px", overflow: 'hidden', position:'relative'}
                }, imgs.map(img=>{
                  return h('img',{
                    attrs: {
                      src: img,

                    },
                    style:{with: '38px', height: '38px', maxHeight: '100%', margin: '0 1px 0 0'
                      }
                    // style: { maxWidth: '100%', maxHeight: '100%',verticalAlign: 'middle',
                    //   position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}

                  } )


              })



              )

            }else {
              return h('span','');
            }
          }


        },
        {
          title: '检测方法',
          align: 'center',
          resizable: true,
          // width: 100,
          render: function (h, params) {
            return h('span', params.row.probes_num)
          }
        },
        {
          title: '检测结论',
          align: 'center',
          resizable: true,
          width: 110,

          tooltip: true,
          render: function (h, params) {
            // return h('span', params.row.test_conclusion)
            return h('Tooltip', {
              props:{ placement:'bottom-start' }
            },[
              h('div',{
                style:{
                  width: '95px',
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
                    this.showTrunkModal = true
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
                    this.showUpdateTrunkModal = true
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


    }
  },
  created() {
    this.fetchData()

  },
  methods:{
    fetchData: function () {
      // 数据表发生变化请求数据

      let args = { ...this.query, ...this.pages }

      return queryTrunkDetections(args).then((resp) => {
        this.tableData = resp.data.trunks
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
    onAddModalOK (trunk) {
      insertTrunk(trunk).then((res) => {
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

      this.showAddTrunkModal = !this.showAddTrunkModal
    },
    onAddModalCancel () {
      this.showAddTrunkModal = false
    },

    //修改，编辑
    onUpdateTrunkModalOK (trunk) {
      console.log('---update111--trunk---',trunk)
      updateTrunk(trunk.id, trunk).then(res=>{
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
      this.showUpdateTrunkModal = false
    },
    onUpdateTrunkModalCancel () {
      this.showUpdateTrunkModal = false
    },

    //删除确认------
    ConfirmDelete(){
      deleteTrunk(this.delete_id).then(msg=>{
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
    onShowTrunkModalOK(){
      this.showTrunkModal = false
    },
    onShowTrunkModalCancel(){
      this.showTrunkModal = false
    }
  }
}
</script>

<style scoped>

</style>
