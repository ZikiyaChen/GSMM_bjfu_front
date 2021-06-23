<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">生长势分析</h2>
      <div class="timeLine" style="overflow: hidden;">

        <div class="ul_box">
          <ul class="my_timeline" ref="mytimeline" style="margin-left: 10px;">
            <li class="my_timeline_item" v-for="(item,index) in timeLineList" :key="index" @click="Show(item)">
              <!--圈圈节点-->
              <div class="my_timeline_node" :style = " {backgroundColor: item.bgcolor, width: item.size + 'px', height: item.size + 'px'}" @click="changeActive(index)" :class="{active: index == timeIndex}"></div>
              <!--线-->
              <div class="my_timeline_item_line" v-show="item.type!=='Diseases'"></div>
              <!--标注-->
              <div class="my_timeline_item_content" :style="{color: item.color, fontSize: item.fontsize + 'px'}">
                {{item.timestamp}}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Form :label-width="143" label-position="right" :model="TreeInformation" inline >
        <h4>古树基本信息</h4>
        <Row>
          <Col  span="5" offset="3">
            <FormItem label="古树编号">
              <Input disabled  v-model="tree_code" class="TextColor"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5" offset="3">
            <FormItem label="科" prop="Base.family">
              <Input v-model="TreeInformation.Base.family" disabled class="TextColor"></Input>
            </FormItem>
          </Col>
          <Col span="5" >
            <FormItem label="属" prop="Base.genus">
              <Input v-model="TreeInformation.Base.genus" disabled class="TextColor"></Input>
            </FormItem>
          </Col>
          <Col span="5" >
            <FormItem label="中文名" prop="Base.zw_name">
              <Input v-model="TreeInformation.Base.zw_name" disabled class="TextColor"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="5" offset="3">
            <FormItem label="拉丁名" prop="Base.ld_name">
              <Input v-model="TreeInformation.Base.ld_name" disabled class="TextColor" ></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="俗名" prop="Base.bm_name">
              <Input v-model="TreeInformation.Base.bm_name" disabled class="TextColor">
              </Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Divider></Divider>
      <h4>生长势分析</h4>
      <Form :label-width="198" label-position="right"  ref="GrowthVigor_form" :model="GrowthVigor" :rules="ruleValidate" inline>
        <Row>
          <Col span="9" offset="2">
            <FormItem label="调查人" prop="investigate_username">
              <Input v-model="GrowthVigor.investigate_username" placeholder="请输入调查人姓名"></Input>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="调查时间" prop="update_time">
              <DatePicker v-model="GrowthVigor.update_time"  type="datetime" placeholder="请选择日期"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="2">
            <FormItem prop="shoot_type">
              <span slot="label" style="font-size: 13px">
                <Tooltip placement="top" max-width="200" >
                <div slot="content">在树冠东南西北四个方向共随机选取20条标准枝，测量各个枝条的新梢年生长量，取其平均值。单位cm。 </div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>新梢生长量</span>
              <RadioGroup v-model="GrowthVigor.shoot_type">
                <Radio v-for="item in ShootTypeList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row v-if="GrowthVigor.shoot_type === '落叶树'">
          <Col offset="2">
            <FormItem label="落叶树" prop="shoot">
              <RadioGroup v-model="GrowthVigor.shoot">
                <Radio v-for="item in ShootList1" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <div  v-if="GrowthVigor.shoot_type === '常绿树'">
         <Row>
           <Col offset="2">
             <FormItem label="常绿树" prop="shoot">
               <RadioGroup v-model="GrowthVigor.shoot">
                 <Radio v-for="item in ShootList2" :label="item.value" :key="item.value"></Radio>
               </RadioGroup>
             </FormItem>
           </Col>
         </Row>
          <Row>
            <Col offset="2">
              <FormItem label="叶片宿存（常绿树）" prop="blade_persistent">
                <RadioGroup v-model="GrowthVigor.blade_persistent">
                  <Radio v-for="item in BladePersistentList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
       </div>
        <Row>
          <Col offset="2">
            <FormItem prop="normal_blade_rate">
              <span slot="label" style="font-size: 13px">
                <Tooltip placement="top" max-width="200" >
                <div slot="content">叶色正常、无病虫害、无干枯卷曲现象的叶片占全部叶片数量的比例。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>正常叶片率</span>
              <RadioGroup v-model="GrowthVigor.normal_blade_rate">
                <Radio v-for="item in NormalBladeRateList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem label="生长势总体评价" prop="growth_vigor">
              <RadioGroup v-model="GrowthVigor.growth_vigor" vertical>
                <Radio v-for="item in GrowthVigorList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem prop="chlorophyll">
              <span slot="label" style="font-size: 13px">
                <Tooltip placement="top" max-width="200" >
                <div slot="content">在树冠东南西北四个方向，每个方向随机选取5个正常枝条，采集枝条中部完全展开新生叶片，带回实验室测定；也可利用叶绿素仪测定。取平均值</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>叶片叶绿素含量</span>
              <Input v-model="GrowthVigor.chlorophyll" placeholder="请输入叶片叶绿素含量"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2" span="5">
            <FormItem prop="Fo">
              <span slot="label" style="font-size: 13px">
                <Tooltip placement="top" max-width="200" >
                <div slot="content">在树冠东南西北四个方向，每个方向随机选取5个正常枝条，选择枝条中部完全展开新生叶片进行测定，计算最大光合潜能。取平均值，使用叶绿素荧光仪测定。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>叶绿素荧光（光合潜能）：Fo</span>
              <InputNumber :step="0.01"
                           v-model="GrowthVigor.Fo"></InputNumber>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="Fm">
              <span slot="label" style="font-size: 13px">Fm</span>
              <InputNumber :step="0.01" v-model="GrowthVigor.Fm"></InputNumber>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem>
            <Button type="primary" shape="circle" icon="ios-calculator" @click="JiSuan"></Button>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem>
              <span slot="label" style="font-size: 13px">(Fm-Fo) / Fm=</span>
              <Input v-model="GrowthVigor.photosynthetic"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem prop="pic_path">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">新梢典型照片，叶片宿存情况照片，非正常叶片照片</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>特征照片</span>
              <div class="demo-upload-list" v-for="(item,index) in PicUrlList" :key="index">
                <img :src="'data:image/jpg;base64,'+item"  />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemoveList(index)"></Icon>
                </div>
              </div>
              <Upload
                :show-upload-list="false"
                name="filename"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleSuccessList"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                multiple
                type="drag"
                action="/api/uploadpic"
                style="display: inline-block;width:70px;">
                <div style="width: 70px;height:70px;line-height: 70px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="图片预览" v-model="visible">
                <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible" style="width: 100%" />
              </Modal>
            </FormItem>

          </Col>
        </Row>
      </Form>
      <float_bar  v-role="['管理员','调查组长','调查人员']">
      <div style="text-align: center" v-show="isShow">
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>
        <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>
        <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>

        <div style="text-align: center" v-show="isSubmit">
          <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
          <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>

          <Button  @click="SubmitUpdate" type="primary" style="margin-right: 30px">提交修改</Button>

          <router-link :to="{path: `/survey/base_survey`}">
            <Button type="primary" style="margin-right: 30px">返回</Button>
          </router-link>
        </div>
      </float_bar>
    </Card>

    <Modal
      v-model="showNextPageModal"
      title="提醒"
      @on-ok="okNext"
      @on-cancel="cancelNext">
      <p>下一页为《已采取复壮保护措施情况与分析》，
        该古树的《已采取复壮保护措施情况与分析》尚未填写，</p>
      <p>如果需要填写，请点击“确定”</p>
    </Modal>
    <Modal
      v-model="showPreviousPageModal"
      title="提醒"
      @on-ok="okPrevious"
      @on-cancel="cancelPrevious">
      <p>上一页为《生长环境评价分析》，
        该古树的《生长环境评价分析》尚未填写，</p>
      <p>如果需要填写，请点击“确定”</p>
    </Modal>

  </div>
</template>

<script>
import {
  shoot_typeList, shootList1, shootList2, normal_blade_rateList, blade_persistentList,
  growth_vigorList, PathToList
} from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddGeAnalysis,
  AddGpAnalysis, getGrowthVigorById,
  getNewGeAnalysis,
  getNewGrowthVigor,
  getOneTreeBaseInfo, getProtect_By_id,
  postTjxmRecord, queryTjxmRecord, updateGrowthVigor, updateProtect, updateTjxmRecord
} from "@/api/table"
import {ShowPic} from "@/api/upload";
import {checkDecimal} from "@/view/tools-methods/someValidateRule";
import Float_bar from "_c/FloatBar/float_bar";

export default {
  name: "GrowthVigor",
  components: {Float_bar},
  data () {
    return {
      timeIndex: 0,
      timeLineList: PathToList,

      isShow: false,
      isSubmit: false,
      showNextPageModal:false,
      showPreviousPageModal:false,
      tree_code: this.$route.params.tree_code,
      value: 0,
      PicUrlList: [],
      showImageUrl: '',
      visible: false,
      i: 0,

      TreeInformation:{
        Base:{
          family:'',
          genus:'',
          zw_name:'',
          ld_name:''
        }
      },

      tjxm_record:{
        t_id: 0,
        type: '生长势分析',
        username: '',
        status: '',
        type_yw: 'GrowthVigor',
        time: ''
      },
      ShootTypeList: shoot_typeList,
      ShootList1: shootList1,
      ShootList2: shootList2,
      NormalBladeRateList: normal_blade_rateList,
      BladePersistentList: blade_persistentList,
      GrowthVigorList: growth_vigorList,

      GrowthVigor: {
        id: 0,
        shoot_type: '', // 新梢生长量类型
        shoot: '', // 新梢生长量，选择类型后再选择
        normal_blade_rate: '', // 正常叶片率
        blade_persistent: '', // 叶片宿存（常绿树）
        growth_vigor: '', // 生长势总体评价
        chlorophyll: 0, // 叶片叶绿素含量
        Fo: 0,
        Fm: 0,
        photosynthetic:0,//Fo Fm计算
        pic_path: [],
        update_time: '',
        tree_code: '',
        investigate_username:''
      },

      ruleValidate: {
        normal_blade_rate: [{ required: true, trigger: 'change', message: '请选择' }],
        blade_persistent: [{ required: true, trigger: 'change', message: '请选择' }],
        growth_vigor: [{ required: true, trigger: 'change', message: '请选择' }],
        investigate_username: [{ required: true, trigger: 'blur', message: '请填写调查人姓名' }],
        update_time: [{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }],
        Fo: [{validator: checkDecimal, isNegative:false ,maxValue: 10000, decimal: 5, trigger: 'blur'}],
        chlorophyll: [{validator: checkDecimal, isNegative:false ,maxValue: 100, decimal: 3, trigger: 'blur'}],
        Fm: [{validator: checkDecimal, isNegative:false ,maxValue: 10000, decimal: 5, trigger: 'blur'}]
      }
    }
  },
  created() {
    this.fetchTreeBasicData()
    this.fetchData()
    this.InitIndex()
  },
  methods: {
    InitIndex(){
      this.timeLineList.forEach((item,index)=>{
        //执行代码
        if(item.type === this.tjxm_record.type_yw){
          console.log('index',index)
          this.timeIndex = index
        }
      })
    },

    Show(item){
      console.log('^^^',item)

      // /survey/update/BasicInformation/110131B03
      this.$router.push({ path: item.path_to+`${this.tree_code}` })
    },
    changeActive(index) {
      this.timeIndex = index;
    },

    fetchData(){
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'GrowthVigor'}).then((record=>{
        if(record.data.total!==0){
          this.isShow = false
          this.isSubmit = true
          this.tjxm_record = record.data.tjxm_records[0]

          getGrowthVigorById(this.tjxm_record.t_id).then((res=>{
            this.GrowthVigor = res.data.growth_vigor
            this.fetchPic()
          }))
        }else {
          this.isShow =true
          this.isSubmit = false
        }
      }))
    },
    fetchPic(){
      this.PicUrlList=[]
      if(this.GrowthVigor.pic_path.length!==0) {
        this.GrowthVigor.pic_path.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList.push(resp.data)
          }))
        })
      }
    },

    Update(){
      this.$refs.GrowthVigor_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.GrowthVigor.update_time = dateToString(this.GrowthVigor.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.GrowthVigor.investigate_username
          this.GrowthVigor.tree_code =this.tree_code
          if(this.GrowthVigor.shoot_type === ''){
            this.GrowthVigor.shoot=''
          }
          console.error(this.GrowthVigor)
          updateGrowthVigor(this.GrowthVigor.id,this.GrowthVigor).then((res=>{
            if(res.data.code === 200 ){
              updateTjxmRecord(this.GrowthVigor.id,this.tjxm_record).then((record=>{
                if(res.data.code === 200 ){
                  if(this.tjxm_record.status === '已完成') {
                    this.$Message.success('修改提交成功')
                    this.fetchData()
                  }else {
                    this.$Message.success('修改保存成功')
                    this.fetchData()
                  }
                }else {
                  if(this.tjxm_record.status === '已完成') {
                    this.$Message.error('修改提交失败')
                  }else {
                    this.$Message.error('修改保存失败')
                  }
                }
              }))
            }
          }))
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    SubmitUpdate(){
      this.tjxm_record.status = '已完成'
      this.Update()
    },

    okNext(){
      this.showNextPageModal = false
      this.$router.push({ path: `/survey/Protect/${this.tree_code}` })

    },
    cancelNext(){
      this.showNextPageModal = false
    },
    NextPage(){
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'Protect'}).then((res=>{
        console.log('%%%%',res)
        if(res.data.total !== 0){
          // this.$router.push({ path: `/survey/update/Protect/${this.tree_code}` })
           this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
        }else {
          this.showNextPageModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      }))
    },
    okPrevious(){
      this.showPreviousPageModal = false
      this.$router.push({ path: `/survey/environment/${this.tree_code}` })

    },
    cancelPrevious(){
      this.showPreviousPageModal = false
    },
    PreviousPage () {
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'environment'}).then((res=>{
        console.log('%%%%',res)
        if(res.data.total !== 0){
          // this.$router.push({ path: `/survey/update/environment/${this.tree_code}` })
          this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }else {
          this.showPreviousPageModal = true
        }
      }))
    },

    fetchTreeBasicData(){
      getOneTreeBaseInfo(this.tree_code).then((res => {
        this.TreeInformation.Base = res.data.tree_basic_info.basic
      }))
    },


    TiJiao(){
      this.$refs.GrowthVigor_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.GrowthVigor.update_time = dateToString(this.GrowthVigor.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.GrowthVigor.investigate_username
          this.GrowthVigor.tree_code =this.tree_code
          if(this.GrowthVigor.shoot_type === ''){
            this.GrowthVigor.shoot=''
          }
          console.error(this.GrowthVigor)
          AddGpAnalysis(this.GrowthVigor).then(res => {
            getNewGrowthVigor(this.tree_code).then((resp=>{
              this.tjxm_record.t_id =resp.data.new_growth_vigor.id
              postTjxmRecord(this.tjxm_record).then((record=>{
                if(record.data.code ===200){
                  if(this.tjxm_record.status === '已完成'){
                    this.$Message.success('提交成功')
                    this.fetchData()
                  }else {
                    this.$Message.success('保存成功')
                    this.fetchData()
                  }
                }else {
                  if(this.tjxm_record.status === '已完成'){
                    this.$Message.success('提交失败')
                  }else {
                    this.$Message.success('保存失败')
                  }
                }
              }))
            }))
            console.log('####',res)
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    Submit: function () {
      this.tjxm_record.status = '已完成'
      this.TiJiao()
    },
    Save: function () {
      this.tjxm_record.status = '待提交'
      this.TiJiao()
    },
    JiSuan () {
      this.GrowthVigor.photosynthetic = (this.GrowthVigor.Fm - this.GrowthVigor.Fo) / this.GrowthVigor.Fm
    },

    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    // 特征照片
    handleView (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible = true
    },
    handleRemoveList (index) {
      // 删除
      this.GrowthVigor.pic_path.splice(index, 1)
      this.PicUrlList.splice(index, 1)
    },
    handleSuccessList: function (res, file) {
      if (res.code === 500) {
        this.GrowthVigor.pic_path.push(res.path)
        this.i++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList.push(resp.data)
        }))
      }
    },
  }
}
</script>

<style scoped>
.ivu-radio-wrapper {
  margin-right: 20px;
}

.TextStyle >>> textarea.ivu-input {
  font-size: 12px;
}

.icon1Style >>> .ivu-tooltip-rel {
  display: inline-block;
  position: relative;
  width: inherit;
  margin-left: 3px;
  font-size: 18px;
}
.iconStyle >>> .ivu-form-item-content {
  margin-left: 0px !important;
  font-size: 18px !important
}

.TextColor >>> .ivu-input[disabled], fieldset[disabled] .ivu-input {
  color: #999999 !important;
}

.demo-upload-list {
  display: inline-block;width: 70px;height: 70px;text-align: center;line-height: 70px;
  border: 1px solid transparent;border-radius: 4px;overflow: hidden;background: #fff;
  position: relative;box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;height: 100%;
}
.demo-upload-list-cover {
  display: none;position: absolute;top: 0;bottom: 0;
  left: 0;right: 0;background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;font-size: 20px;cursor: pointer;margin: 0 2px;
}

.ul_box {
  width: 1340px;
  height: 60px;
  display: inline-block;
  float: left;
  margin-top: 2px;
  overflow: hidden;
}
/*节点间距*/
.my_timeline_item {
  display: inline-block;
  width: 170px;
}
.my_timeline_node {
  box-sizing: border-box;
  border-radius: 50%;
  cursor: pointer;
}
.my_timeline_node.active {
  background-color: #fff !important;
  border: 5px solid #f68720;
}
.my_timeline_item_line {
  width: 100%;
  height: 10px;
  margin: -10px 0 0 15px;
  border-top: 2px solid #E4E7ED;
  border-left: none;
}
.my_timeline_item_content {
  margin: 10px 0 0 -10px;
}
</style>
