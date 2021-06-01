<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">生长环境评价分析</h2>
    <Form :label-width="100" label-position="right" :model="TreeInformation" inline >
    <h4>古树基本信息</h4>
    <Row>
      <Col  span="5" offset="2">
        <FormItem label="古树编号">
          <Input disabled  v-model="tree_code" class="TextColor"></Input>
        </FormItem>
      </Col>
    </Row>
      <Row>
      <Col span="5" offset="2">
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
        <Col span="5" offset="2">
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

    <Form :label-width="150" label-position="right"  ref="environment_form" :model="environment" :rules="ruleValidate" inline>
<!--      记住一定要加prop，不然验证不起作用-->
      <Divider></Divider>
        <h4>生长环境：</h4>

      <Row>
        <Col span="9" offset="1">
          <FormItem label="调查人" prop="investigate_username">
            <Input v-model="environment.investigate_username" placeholder="请输入调查人姓名"></Input>
          </FormItem>
        </Col>
        <Col span="9">
          <FormItem label="调查时间" prop="update_time">
            <DatePicker v-model="environment.update_time"  type="datetime" placeholder="请选择日期"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9" offset="1">
          <FormItem label="海拔" prop="elevation">
            <Input v-model="environment.elevation" placeholder="请输入海拔（单位：米）">
              <span slot="append"> m </span>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="生长环境类型" prop="habitat_type">
            <RadioGroup v-model="environment.habitat_type">
              <Radio v-for="item in HabitatTypeList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="environment.habitat_type==='平原'">
        <Col  offset="1">
          <FormItem label="平原类型" prop="plain_type">
            <CheckboxGroup v-model="environment.plain_type">
              <Checkbox v-for="item in PlainList" :label="item.value" :key="item.value"></Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="environment.habitat_type==='山地'">
        <Col offset="1">
          <FormItem label="山坡类型" prop="highland_type" :key="environment.highland_type" :rules="[{ required: true, trigger: 'change',message: '请选择山地类型'}]">
            <RadioGroup v-model="environment.highland_type">
              <Radio v-for="item in HighLandList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="7" offset="1">
          <FormItem label="山区坡向" prop="aspect">
            <Input v-model="environment.aspect" placeholder="请填写山区坡向信息"></Input>
          </FormItem>
        </Col>
        <Col span="7">
          <FormItem label="山区坡度" prop="slope">
            <Input v-model="environment.slope" placeholder="请填写山区坡度信息"></Input>
          </FormItem>
        </Col>
        <Col span="7">
          <FormItem label="山区坡位" prop="slope_position">
            <Input v-model="environment.slope_position" placeholder="请填写山区坡位信息"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="土壤污染" prop="is_pollution">
            <RadioGroup v-model="environment.is_pollution">
              <Radio v-for="item in IsPollutionList" :label="item.value" :key="item.value">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="土壤是否含有杂物" prop="varia">
            <RadioGroup v-model="environment.varia">
              <Radio v-for="item in VariaList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="土壤质地" prop="soil_texture">
            <RadioGroup v-model="environment.soil_texture">
              <Radio v-for="item in SoilTextureList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="土壤容量" prop="soil_capacity">
            <Input v-model="environment.soil_capacity" placeholder="请输入土壤容量">
              <span slot="append"> g/cm<sup>2</sup></span>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="有机质含量" prop="organic_content">
            <RadioGroup v-model="environment.organic_content">
              <Radio v-for="item in OrganicContentList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="采样测定结果" prop="sample_result">
            <Input v-model="environment.sample_result" placeholder="请输入采样测定结果">
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Divider />
      <h4>土壤营养含量：</h4>
      <Row>
        <Col span="8" offset="1" >
          <FormItem label="水解N" prop="hydrolyze_N">
            <Input v-model="environment.hydrolyze_N" placeholder="请输入数据(>=60)" style="width: 170px">
              <span slot="append">mg/kg</span>
            </Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="有效P" prop="valid_P">
            <Input v-model="environment.valid_P" placeholder="请输入数据(>=10)" style="width: 170px">
              <span slot="append">mg/kg</span>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8" offset="1">
          <FormItem label="速效K" prop="rapid_K">
            <Input v-model="environment.rapid_K" placeholder="请输入数据(>=100)" style="width: 170px"><span slot="append">mg/kg</span>
            </Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="含盐量" prop="saltness">
            <Input v-model="environment.saltness" placeholder="请输入数据" style="width: 170px"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8" offset="1">
          <FormItem label="EC值" prop="ec_value">
            <Input v-model="environment.ec_value" placeholder="请输入数据" style="width: 170px">
              <span slot="append">m</span>
            </Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="pH值" prop="ph_value">
            <Input v-model="environment.ph_value" placeholder="请输入数据" style="width: 170px"></Input>
          </FormItem>
        </Col>
      </Row>

      <Divider />
      <h4>其他信息：</h4>
      <Row>
        <Col span="8" offset="1">
          <FormItem label="是否埋干" prop="is_buried">
            <RadioGroup v-model="environment.is_buried">
              <Radio v-for="item in IsBuriedList" :label="item.value" :key="item.value">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col v-if="environment.is_buried === 1">
          <FormItem label="埋干深度" prop="buried_depth">
            <Input v-model="environment.buried_depth" placeholder="请输入数据"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8" offset="1">
          <FormItem label="根系土壤含水量" prop="root_water">
            <Input v-model="environment.root_water" placeholder="请输入数据">
              <span slot="append">%</span>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="5" offset="1">
          <FormItem prop="protect_E">
            <span slot="label">
            <Tooltip placement="top" max-width="200" >
                <div slot="content">按照《古树名木评价标准》（DB11_T478）的规定测定，满足规定要求的填5m，不满足的按实际填写，并反映在示意图中。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>保护范围四至：东向</span>
            <InputNumber :step="0.01"
                         :formatter="value => `${value}  m`"
                         :parser="value => value.replace('  m', '')" v-model="environment.protect_E"></InputNumber>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="西向" prop="protect_W">
            <InputNumber :step="0.01"
                         :formatter="value => `${value}  m`"
                         :parser="value => value.replace('  m', '')" v-model="environment.protect_W"></InputNumber>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="5" offset="1">
          <FormItem label="南向" prop="protect_S">
            <InputNumber :step="0.01"
                         :formatter="value => `${value}  m`"
                         :parser="value => value.replace('  m', '')" v-model="environment.protect_S"></InputNumber>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="北向" prop="protect_N">
            <InputNumber :step="0.01"
                         :formatter="value => `${value}  m`"
                         :parser="value => value.replace('  m', '')" v-model="environment.protect_N"></InputNumber>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="现状保护示意图" prop="protect_pic">
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList1" :key="index">
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView1(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList1(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList1"
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
            <Modal title="图片预览" v-model="visible1">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible1" style="width: 100%" />
            </Modal>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="保护范围内其他植物" prop="other_plants">
            <RadioGroup v-model="environment.other_plants">
              <Radio v-for="item in OtherPlantsList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="生长环境总体评价" prop="evaluation">
            <RadioGroup v-model="environment.evaluation">
              <Radio v-for="item in EvaluationList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row v-if="environment.evaluation === '差'">
        <Col offset="1">
          <FormItem label="生长环境问题" prop="envoriment_problem" style="width: 500px;">
            <Input type="textarea" v-model="environment.envoriment_problem"  :autosize="true" placeholder="请输入生长环境问题" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8" offset="1">
          <FormItem label="保护范围内筑构物情况" prop="has_structures">
            <RadioGroup v-model="environment.has_structures">
              <Radio v-for="item in HasStructuresList" :label="item.value" :key="item.value">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <div v-if="environment.has_structures === 1">
      <Row>
        <Col offset="1">
          <FormItem label="筑构物类型" prop="structures_type">
            <Input v-model="environment.structures_type" placeholder="请输入筑构物类型" style="width: 300px"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="environment.has_structures === 1">
        <Col offset="1">
          <FormItem label="筑构物影响" prop="structures_affect">
            <Input v-model="environment.structures_affect" type="textarea" :autosize="true" placeholder="请填写筑构物对树体的影响（包括潜在影响）" style="width: 400px" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>
      </div>

      <Row>
        <Col offset="1">
          <FormItem label="土壤营养状况分析" prop="nutrient_status">
            <Input v-model="environment.nutrient_status" type="textarea" :autosize="true"
                   placeholder="（根据检测结果对土壤营养状况和理化性质进行分析并给出管理措施建议）" style="width: 500px" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">

          <FormItem prop="pic_path">
            <span slot="label">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">提供古树保护范围实景照片，土壤特征照片，保护范围内设施、构筑物及其他植物照片3-6张</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList2" :key="index">
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView2(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList2(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList2"
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
            <Modal title="图片预览" v-model="visible2">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible2" style="width: 100%" />
            </Modal>
          </FormItem>

        </Col>
      </Row>
    </Form>
    <float_bar>
    <div style="text-align: center" v-show="isShow">
      <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
      <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
      <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
      <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>
      <router-link :to="{path: `/survey/base_survey`}">
        <Button type="primary" style="margin-right: 30px">返回</Button>
      </router-link>
    </div>
      <div style="text-align: center" v-show="isSubmit">
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
        <Button  @click="SubmitUpdate" type="primary" style="margin-right: 30px">提交修改</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>
    </float_bar>

    <Modal
      v-model="showNextPageModal"
      title="提醒"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>下一页为《生长势分析》，
        该古树的《生长势分析》尚未填写，</p>
      <p>如果需要填写，请点击“确定”</p>
    </Modal>
  </Card>


</div>
</template>

<script>
import { habitat_typeList, plainList, highlandList, is_pollutionList, variaList, soil_textureList, organic_contentList,
  is_buriedList, other_plantsList, evaluationList, has_structuresList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddBasicProperty,
  AddGeAnalysis, getEnvironmentById, getGrowthVigorById,
  getNewGeAnalysis,
  getOneTreeBaseInfo,
  postTjxmRecord, queryClassTypes,
  queryFamilyTypes, queryGenusTypes, queryTjxmRecord, updateEnvironment, updateGrowthVigor, updateTjxmRecord
} from "@/api/table";
import {ShowPic} from "@/api/upload";
import Float_bar from "_c/FloatBar/float_bar";

export default {
  name: "environment",
  components: {Float_bar},
  data () {
    return {
      isShow:false,
      isSubmit: false,
      loading: false,
      showNextPageModal: false,
      showImageUrl: '',

      PicUrlList1: [],
      visible1: false,
      i1: 0,

      PicUrlList2: [],
      visible2: false,
      i2: 0,


      tjxm_record:{
        t_id: 0,
        type: '生长环境评价分析',
        username: '',
        status: '',
        type_yw: 'environment',
        time: ''
      },

      TreeInformation:{
        Base:{
          family:'',
          genus:'',
          zw_name:'',
          ld_name:''
        }
      },

      environment: {
        id: 0,
        investigate_username: '',
        elevation: 0, // 海拔
        habitat_type: '', // 生长环境类型
        plain_type: [], // 平原类型
        highland_type: '', // 山地类型
        aspect: '', // 坡向
        slope: 0, // 坡度
        slope_position: '', // 坡位
        is_pollution: 0, // 土壤污染有无
        varia: '', // 土壤是否有杂物
        soil_texture: '', // 土壤质地
        soil_capacity: 0, // 土壤容量
        organic_content: '', // 有机质含量
        sample_result: '', // 采样测定结果

        hydrolyze_N: 0, // 水解N
        valid_P: 0, // 有效P
        rapid_K: 0, // 速效K
        saltness: 0, // 含盐量
        ec_value: 0, // EC值
        ph_value: 0, // PC值

        is_buried: 0, // 是否埋干
        buried_depth: 0, // 埋干深度
        root_water: 0, // 土壤含水量

        protect_E: 0, // 保护范围四至 东向
        protect_W: 0, // 西向
        protect_S: 0, // 南向
        protect_N: 0, // 北向
        protect_pic: [], // 保护范围示意图
        other_plants: '', // 保护范围内其他植物
        evaluation: '', // 生长环境总体评价
        envoriment_problem: '', // 生长环境问题

        has_structures: 0, // 保护范围内构筑物有无
        structures_type: '', // 筑构物类型
        structures_affect: '', // 筑构物影响
        nutrient_status: '', // 土壤营养状况分析
        pic_path: [], // 特征照片
        update_time: '',
        tree_code: ''
      },
      tree_code: Number(this.$route.params.tree_code),

      HabitatTypeList: habitat_typeList,
      PlainList: plainList,
      HighLandList: highlandList,
      IsPollutionList: is_pollutionList,
      VariaList: variaList,
      SoilTextureList: soil_textureList,
      OrganicContentList: organic_contentList,
      IsBuriedList: is_buriedList,
      OtherPlantsList: other_plantsList,
      EvaluationList: evaluationList,
      HasStructuresList: has_structuresList,

      ruleValidate: {
        update_time: [{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }],
        investigate_username: [{ required: true, message: '请填写调查人姓名'}],
        elevation: [{ required: true,  message: '请填写海拔' }],
        habitat_type: [{ required: true, trigger: 'change', message: '请选择生长环境类型' }],
        plain_type: [{ required: true, type: 'array', min: 1, trigger: 'change', message: '请选择平原类型' }],
        aspect: [{ required: true, trigger: 'blur', message: '请填写坡向' }],
        slope: [{ required: true, message: '请填写坡度' }],
        slope_position: [{ required: true, trigger: 'blur', message: '请填写坡位' }],
        protect_E: [{ required: true, message: '请填写数据' }],
        protect_W: [{ required: true,  message: '请填写数据' }],
        protect_N: [{ required: true,  message: '请填写数据' }],
        protect_S: [{ required: true,  message: '请填写数据' }],
        other_plants: [{ required: true, trigger: 'change', message: '请选择' }],
        evaluation: [{ required: true, trigger: 'change', message: '请选择' }],
        envoriment_problem: [{ required: true, trigger: 'blur', message: '请填写' }],
        has_structures: [{ required: true, message: '请选择' }],
        structures_type: [{ required: true, trigger: 'blur', message: '请填写' }],
        structures_affect: [{ required: true, trigger: 'blur', message: '请填写' }]
      }
    }
  },
  created() {
    this.fetchTreeBasicData()
    this.fetchData()
  },
  mounted() {
    // this.fetchOptions()
  },
  methods: {
    fetchData(){
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'environment'}).then((record=>{
        if(record.data.total!==0){
          this.tjxm_record = record.data.tjxm_records[0]
          this.isShow = false
          this.isSubmit= true
          getEnvironmentById(this.tjxm_record.t_id).then((res=>{
            this.environment= res.data.environment_by_id
            this.fetchPic()
          }))
        }else {
          this.isShow = true
          this.isSubmit= false
        }
      }))
    },
    fetchPic(){
      this.PicUrlList1=[]
      this.PicUrlList2=[]
      if(this.environment.protect_pic.length!==0) {
        this.environment.protect_pic.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList1.push(resp.data)
          }))
        })
      }

      if(this.environment.pic_path.length!==0) {
        this.environment.pic_path.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList2.push(resp.data)
          }))
        })
      }
    },

    ok(){
      this.showNextPageModal = false
      this.$router.push({ path: `/survey/GrowthVigor/${this.tree_code}` })

    },
    cancel(){
      this.showNextPageModal = false
    },
    NextPage(){
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'GrowthVigor'}).then((res=>{
        console.log('%%%%',res)
        if(res.data.total !== 0){
          // this.$router.push({ path: `/survey/update/GrowthVigor/${this.tree_code}` })
          this.$router.push({ path: `/survey/GrowthVigor/${this.tree_code}` })
        }else {
          this.showNextPageModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      }))
    },

    TiJiao(){
      this.$refs.environment_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.environment.update_time = dateToString(this.environment.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.environment.tree_code = this.tree_code
          this.tjxm_record.username = this.environment.investigate_username

          if( this.environment.habitat_type === '平原' ){
            this.environment.highland_type=''
          }else {
            this.environment.plain_type=[]
          }
          if(this.environment.is_buried === 0){
            this.environment.buried_depth = 0
          }
          if(this.environment.evaluation === '良好'){
            this.environment.envoriment_problem =''
          }
          if(this.environment.has_structures === 0){
            this.environment.structures_affect=''
            this.environment.structures_type=''
          }

          console.error('!!!!',this.environment)
          AddGeAnalysis(this.environment).then(res => {
            getNewGeAnalysis(this.tree_code).then((resp=>{
              this.tjxm_record.t_id =resp.data.new_ge_analysis.id
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
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    Update(){
      this.$refs.environment_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.environment.update_time = dateToString(this.environment.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.environment.tree_code = this.tree_code
          this.tjxm_record.username = this.environment.investigate_username

          if( this.environment.habitat_type === '平原' ){
            this.environment.highland_type=''
          }else {
            this.environment.plain_type=[]
          }
          if(this.environment.is_buried === 0){
            this.environment.buried_depth = 0
          }
          if(this.environment.evaluation === '良好'){
            this.environment.envoriment_problem =''
          }
          if(this.environment.has_structures === 0){
            this.environment.structures_affect=''
            this.environment.structures_type=''
          }

          console.error('!!!!',this.environment.id)
          updateEnvironment(this.environment.id,this.environment).then((res=>{
            if(res.data.code === 200 ){
              updateTjxmRecord(this.environment.id,this.tjxm_record).then((record=>{
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

    Submit() {
      this.tjxm_record.status ='已完成'
      this.TiJiao()
      // this.$refs.environment_form.validate((valid) => {
      //   console.log(valid)
      //   this.tjxm_record.status='已完成'
      //   if (valid) {
      //     this.environment.update_time = dateToString(this.environment.update_time, 'yyyy-MM-dd hh:mm:ss')
      //     this.environment.tree_code = this.tree_code
      //     this.tjxm_record.username = this.environment.investigate_username
      //
      //     if( this.environment.habitat_type === '平原' ){
      //       this.environment.highland_type=''
      //     }else {
      //       this.environment.plain_type=[]
      //     }
      //     if(this.environment.is_buried === 0){
      //       this.environment.buried_depth = 0
      //     }
      //     if(this.environment.evaluation === '良好'){
      //       this.environment.envoriment_problem =''
      //     }
      //     if(this.environment.has_structures === 0){
      //       this.environment.structures_affect=''
      //       this.environment.structures_type=''
      //     }
      //
      //     console.error('!!!!',this.environment)
      //     AddGeAnalysis(this.environment).then(res => {
      //       getNewGeAnalysis(this.tree_code).then((resp=>{
      //         this.tjxm_record.t_id =resp.data.new_ge_analysis.id
      //         postTjxmRecord(this.tjxm_record).then((record=>{
      //           if(record.data.code ===200){
      //             if(this.tjxm_record.status === '已完成'){
      //               this.$Message.success('提交成功')
      //             }else {
      //               this.$Message.success('保存成功')
      //             }
      //           }else {
      //             if(this.tjxm_record.status === '已完成'){
      //               this.$Message.success('提交失败')
      //             }else {
      //               this.$Message.success('保存失败')
      //             }
      //           }
      //         }))
      //       }))
      //       console.log('####',res)
      //     }).catch(err => {
      //       console.log(err)
      //     })
      //   } else {
      //     this.$Message.error('请填写完整信息')
      //   }
      // })
      // this.$router.push({path:'/survey/base_survey'})
    },
    Save(){
      this.tjxm_record.status = '待提交'
      this.TiJiao()
    },

    PreviousPage () {
      this.$router.push({ path: `/survey/update/BasicInformation/${this.tree_code}` })
    },
    Tree () {
      console.log(11, this.tree_code)
      console.log(typeof (this.tree_code))
    },

    fetchTreeBasicData(){
      getOneTreeBaseInfo(this.tree_code).then((res => {
        this.TreeInformation.Base = res.data.tree_basic_info.basic
      }))
    },

    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },


    // 保护范围示意图
    handleView1 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible1 = true
    },
    handleRemoveList1 (index) {
      // 删除
      this.environment.protect_pic.splice(index, 1)
      this.PicUrlList1.splice(index, 1)
    },
    handleSuccessList1: function (res, file) {
      if (res.code === 500) {
        this.environment.protect_pic.push(res.path)
        this.i1++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList1.push(resp.data)
        }))
      }
    },
    // 特征照片
    handleView2 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible2 = true
    },
    handleRemoveList2 (index) {
      // 删除
      this.environment.pic_path.splice(index, 1)
      this.PicUrlList2.splice(index, 1)
    },
    handleSuccessList2: function (res, file) {
      if (res.code === 500) {
        this.environment.pic_path.push(res.path)
        this.i2++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList2.push(resp.data)
        }))
      }
    },

    // changeLoading: function () {
    //   setTimeout(() => {
    //     this.loading = false;
    //     this.$nextTick(() => {
    //       this.loading = true
    //     })
    //   }, 5)
    // },

    // Save: function () {
    //   // this.changeLoading()
    //   this.$refs.environment_form.validate((valid) => {
    //     console.log(valid)
    //     if (valid) {
    //       this.environment.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
    //       console.error(this.environment)
    //       this.$Message.success('保存成功')
    //     } else {
    //       this.$Message.error('请填写完整信息')
    //     }
    //   })
    // },



  }
}
</script>

<style scoped>

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

.ivu-radio-wrapper {
  margin-right: 20px;
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

</style>
