<template>
  <div>
    <Modal
      :value="show"
      title="修改"
      :loading="loading"
      :mask-closable="false"
      @on-visible-change="onShowChange"
      @on-ok="handleSubmit"
      @on-cancel="handleCancel">
      <div>
        <Form :model="trunkDetection" ref="trunk_form" :rules="ruleValidate" :label-width="160" style="margin: auto">
          <Row>
            <Col span="19">
              <FormItem prop="tree_code" label="树木编号:" >
                <Input type="text" v-model="trunkDetection.tree_code" placeholder="请输入树木编号" readonly></Input>
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span="20">
              <FormItem label="检测时间：" prop="test_time" class="error-tip">
                <DatePicker v-model="trunkDetection.test_time"  type="datetime" placeholder="请选择日期" ></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="height" label="检测高度:" >
                <Input v-model="trunkDetection.height"><span slot="append">cm</span></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="perimeter" label="检测面主干周长:" >
                <Input v-model="trunkDetection.perimeter"><span slot="append">cm</span></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="empty_rot_rate" label="检测面空腐率:" >
                <Input v-model="trunkDetection.empty_rot_rate"><span slot="append"> % </span></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="probes_num" label="检测方法:" >
                <AutoComplete
                  v-model="trunkDetection.probes_num"
                  placeholder="请选择或输入检测名称"
                  :data="detectionMethod"
                  clearable>
                </AutoComplete>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="trunk_section_pic" label="检测图像:" >
                <UploadImage :max-count="9"  :readonly="false" :url1="'/health_detection/trunk/'"
                             :img-url-list="trunkDetection.trunk_section_pic_urlList"
                             :img-name-list="trunkDetection.trunk_section_pic" :img-base-url="imgBaseUrl"
                             :tree-code="trunkDetection.tree_code" type-img="trunk"
                             @delete="deleteImg" @onUpload="uploadImg">
                </UploadImage>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="19">
              <FormItem prop="test_conclusion" label="检测结论:" >
                <Input v-model="trunkDetection.test_conclusion" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="Enter something..."
                       maxlength="500" show-word-limit />
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
import {getTrunkDetection} from "@/api/health_detection";
export default {
  name: "UpdateTrunkDetectionModal",
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
      imgBaseUrl: this.GLOBAL.getTrunkImg,
      loading: false,
      detectionMethod: ['应力波','探地雷达'],

      trunkDetection:{
        id: null,
        tree_code: '',
        height: null,
        perimeter: null,
        empty_rot_rate: null,
        probes_num: '',
        test_conclusion: '',
        test_time: '',
        trunk_section_pic:[],
        trunk_section_pic_urlList:[],
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
    // this.trunkDetection.trunk_section_pic = ['11CSDS_1690739653742965061.jpg','222_1690786128240577647.jpeg','A_20230731003402.png']
    // this.trunkDetection.trunk_section_pic_urlList = ['http://49.232.244.63:5005/trunk_img/11CSDS_1690739653742965061.jpg',
    //   'http://49.232.244.63:5005/trunk_img/222_1690786128240577647.jpeg','http://49.232.244.63:5005/trunk_img/A_20230731003402.png']

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
        this.trunkDetection.dc_unit = this.userInfo.userInfo.username
      }else {
        this.trunkDetection.dc_unit = this.userInfo.userInfo.create_by
      }
    },
    async handleSubmit () {
      if(this.trunkDetection.test_time !==''&& this.trunkDetection.test_time.constructor === Date){
        this.trunkDetection.test_time = dateToString(this.trunkDetection.test_time, 'yyyy-MM-dd hh:mm:ss')
      }
      // this.changeLoading()
      await this.$emit('onOK', { ...this.trunkDetection })
    },

    handleCancel () {
      this.$emit('onCancel')
    },

    deleteImg(name,url){
      this.trunkDetection.trunk_section_pic = name
      this.trunkDetection.trunk_section_pic_urlList = url
    },
    uploadImg(name,url){
      this.trunkDetection.trunk_section_pic  = name
      this.trunkDetection.trunk_section_pic_urlList = url
    },
    // setClearData(){
    //   this.trunkDetection = {
    //     tree_code: '',
    //     height: null,
    //     perimeter: null,
    //     empty_rot_rate: null,
    //     probes_num: null,
    //     test_conclusion: '',
    //     test_time: null,
    //     trunk_section_pic:[],
    //     trunk_section_pic_urlList:[],
    //     dc_unit: '',
    //   }
    // }

    onShowChange: function (show) {
      if (show) {
        // 显示的时候拉数据
        getTrunkDetection(this.selected_id).then((resp) => {
          updateWithinField(this.trunkDetection, resp.data.trunk)
        })
      }
    },

  }
}
</script>

<style scoped>

</style>




