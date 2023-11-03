<template>
  <div>
    <Modal
      :value="show"
      title="查看"
      :loading="loading"
      :mask-closable="false"
      @on-visible-change="onShowChange"
      @on-ok="handleSubmit"
      @on-cancel="handleCancel">
      <div>
        <Form :model="rootDetection" ref="root_form" :rules="ruleValidate" :label-width="160" style="margin: auto" >
          <Row>
            <Col span="19">
              <FormItem prop="tree_code" label="树木编号:" >
                <Input type="text" v-model="rootDetection.tree_code" placeholder="请输入树木编号" readonly></Input>
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span="20">
              <FormItem label="检测时间：" prop="test_time" class="error-tip">
                <DatePicker v-model="rootDetection.test_time"  type="datetime" placeholder="请选择日期" readonly></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="pic1" label="根系水平分布及分布密度:" >
                <UploadImage :max-count="9"  :readonly="true" :url1="'/health_detection/root/'"
                             :img-url-list="rootDetection.pic1_urlList"
                             :img-name-list="rootDetection.pic1" :img-base-url="imgBaseUrl"
                             :tree-code="rootDetection.tree_code" type-img="root"
                             @delete="deleteImg1" @onUpload="uploadImg1"  >
                </UploadImage>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="pic2" label="根系深度分层水平分布及分布密度:" >
                <UploadImage :max-count="9"  :readonly="true" :url1="'/health_detection/root/'"
                             :img-url-list="rootDetection.pic2_urlList"
                             :img-name-list="rootDetection.pic2" :img-base-url="imgBaseUrl"
                             :tree-code="rootDetection.tree_code" type-img="root"
                             @delete="deleteImg2" @onUpload="uploadImg2"  >
                </UploadImage>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="pic3" label="侧柏根系三维拓扑结构图:" >
                <UploadImage :max-count="9"  :readonly="true" :url1="'/health_detection/root/'"
                             :img-url-list="rootDetection.pic3_urlList"
                             :img-name-list="rootDetection.pic3" :img-base-url="imgBaseUrl"
                             :tree-code="rootDetection.tree_code" type-img="root"
                             @delete="deleteImg3" @onUpload="uploadImg3"  >
                </UploadImage>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="test_conclusion" label="检测结论:" >
                <Input v-model="rootDetection.test_conclusion" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="Enter something..."
                       maxlength="500" show-word-limit  readonly/>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import UploadImage from "@/view/RadarDetection/UploadImage";
import UserMixin from "@/mixin/UserMixin";
import {dateToString, updateWithinField} from "@/libs/tools";
import {getRootDetection} from "@/api/health_detection";
export default {
  name: "showRootDetectionModal",
  components:{UploadImage},
  mixins: [UserMixin],
  props: {
    show: Boolean,
    onCancel: Function,
    onOK: Function,
    selected_id: '',
  },

  data(){
    return{
      imgBaseUrl: this.GLOBAL.getRootImg,
      loading: false,

      rootDetection:{
        id: null,
        tree_code: '',
        test_conclusion: '',
        test_time: '',
        pic2:[],
        pic2_urlList:[],
        pic1:[],
        pic1_urlList:[],
        pic3:[],
        pic3_urlList:[],
        dc_unit: '',
      },
      ruleValidate: {
        // tree_code: [{required: true, message: '请输入树木编号', trigger: 'blur'}],
      }


    }
  },
  created() {
    this.initDcUnitDATA()
  },
  mounted() {

  },
  methods:{
    changeLoading: function () {
      setTimeout(() => {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true
        })
      }, 200)
    },
    initDcUnitDATA(){
      if(this.userInfo.userInfo.is_unitAdmin){
        this.rootDetection.dc_unit = this.userInfo.userInfo.username
      }else {
        this.rootDetection.dc_unit = this.userInfo.userInfo.create_by
      }
    },
    handleSubmit () {
      console.log('--submit---',this.rootDetection.test_time)
      if(this.rootDetection.test_time !==''){
        this.rootDetection.test_time = dateToString(this.rootDetection.test_time, 'yyyy-MM-dd hh:mm:ss')
      }
      this.changeLoading()
      this.$emit('onOK', { ...this.rootDetection })
    },

    handleCancel () {
      this.$emit('onCancel')
    },

    deleteImg1(name,url){
      this.rootDetection.pic1 = name
      this.rootDetection.pic1_urlList = url
    },
    uploadImg1(name,url){
      this.rootDetection.pic1  = name
      this.rootDetection.pic1_urlList = url
    },
    deleteImg2(name,url){
      this.rootDetection.pic2 = name
      this.rootDetection.pic2_urlList = url
    },
    uploadImg2(name,url){
      this.rootDetection.pic2  = name
      this.rootDetection.pic2_urlList = url
    },
    deleteImg3(name,url){
      this.rootDetection.pic3  = name
      this.rootDetection.pic3_urlList = url
    },
    uploadImg3(name,url){
      this.rootDetection.pic3  = name
      this.rootDetection.pic3_urlList = url
    },

    onShowChange: function (show) {
      if (show) {
        // 显示的时候拉数据
        getRootDetection(this.selected_id).then((resp) => {
          updateWithinField(this.rootDetection, resp.data.root)
        })
      }
    },

  }
}
</script>

<style scoped>

</style>




