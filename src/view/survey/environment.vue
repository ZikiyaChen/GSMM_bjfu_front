<template>
<div>
  <Card>
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

    <h2 slot="title" style="text-align: center">生长环境评价分析</h2>
    <Form :label-width="180" label-position="right" :model="TreeInformation" inline>

    <Row>
      <Col  span="11" offset="1">
        <FormItem label="古树编号：" >
          <Input disabled  v-model="tree_code" class="TextColor"></Input>
        </FormItem>
      </Col>
    </Row>
    </Form>

    <Form :label-width="180" label-position="right"  ref="environment_form" :model="environment" :rules="ruleValidate" inline >
<!--      记住一定要加prop，不然验证不起作用-->
<!--      <Row>-->
<!--        <Col span="11" offset="1">-->
<!--          <FormItem label="调查单位：" prop="dc_unit" class="error-tip">-->
<!--            <Select v-model="environment.dc_unit" placeholder="选择调查单位名称" filterable @on-clear="GetUnits"-->
<!--                    @on-query-change="onDcUnitSelectQueryChange" clearable  >-->
<!--              <Option v-for="item in dcUnits" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--        <Col span="11">-->
<!--          <FormItem label="调查时间：" prop="update_time" class="error-tip">-->
<!--            <DatePicker v-model="environment.update_time"  type="datetime" placeholder="请选择日期" ></DatePicker>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->
<!--      <Row>-->
<!--        <Col span="11" offset="1">-->
<!--          <FormItem label="调查人：" prop="investigate_username" class="error-tip">-->
<!--            <Select v-model="environment.investigate_username" placeholder="名字" filterable-->
<!--                    @on-query-change="onDcUserSelectQueryChange" clearable>-->
<!--              <Option v-for="item in dcUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->
      <div style="color: mediumseagreen;  margin-left: 140px; margin-bottom: 5px; font-weight: bold" >
        <span>生长环境:</span>
      </div>
      <Row>
        <Col offset="1" span="11">
          <FormItem label="生长环境类型：" prop="habitat_type">
            <RadioGroup v-model="environment.habitat_type">
              <Radio v-for="item in HabitatTypeList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="海拔：" prop="elevation">
            <Input v-model="environment.elevation" placeholder="请输入海拔（单位：米）" >
              <span slot="append"> 米 </span>
            </Input>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="environment.habitat_type==='平原'">
        <Col offset="1" >
          <FormItem label="平原类型：" prop="plain_type"  style="width: 100%;">
            <CheckboxGroup v-model="environment.plain_type">
              <Checkbox v-for="item in PlainList" :label="item.value" :key="item.value"></Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Col>
      </Row>
      <div v-if="environment.habitat_type==='山地'">
        <Row>
          <Col  span="11" offset="1">
            <FormItem label="山坡类型：" prop="highland_type" :key="environment.highland_type" :rules="[{ required: true, trigger: 'change',message: '请选择山地类型'}]" style="width: 100%">
              <RadioGroup v-model="environment.highland_type">
                <Radio v-for="item in HighLandList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="11" >
            <FormItem label="山区坡向：" prop="aspect">
              <Input v-model="environment.aspect" placeholder="请填写山区坡向信息"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11" offset="1">
            <FormItem label="山区坡度：" prop="slope">
              <Input v-model="environment.slope" placeholder="请填写山区坡度信息">
                <span slot="append"> 度 </span>
              </Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="山区坡位：" prop="slope_position">
              <Input v-model="environment.slope_position" placeholder="请填写山区坡位信息"></Input>
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row>
        <Col offset="1">
          <FormItem label="土壤污染：" prop="is_pollution">
            <RadioGroup v-model="environment.is_pollution">
              <Radio v-for="item in IsPollutionList" :label="item" :key="item" >{{item}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="土壤是否含有杂物：" prop="varia">
            <RadioGroup v-model="environment.varia">
              <Radio v-for="item in VariaList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="土壤质地：" prop="soil_texture">
            <RadioGroup v-model="environment.soil_texture">
              <Radio v-for="item in SoilTextureList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="11" offset="1">
          <FormItem label="土壤容重：" prop="soil_capacity">
            <Input v-model="environment.soil_capacity" placeholder="请输入土壤容重">
              <span slot="append"> g/cm<sup>3</sup></span>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="有机质含量：" prop="organic_content" style="width: 100%;">
            <RadioGroup v-model="environment.organic_content">
              <Radio v-for="item in OrganicContentList" :label="item.value" :key="item.value" style="width: auto; margin-right: 60px"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="11" offset="1">
          <FormItem label="采样测定结果：" prop="sample_result">
            <Input v-model="environment.sample_result" placeholder="请输入采样测定结果">
            </Input>
          </FormItem>
        </Col>
      </Row>
      <div style="color: mediumseagreen;  margin-left: 95px; margin-bottom: 5px; font-weight: bold" >
        <span>土壤营养元素含量：</span>
      </div>
      <Row>
        <Col span="11" offset="1" >
          <FormItem label="水解N：" prop="hydrolyze_N">
            <Input v-model="environment.hydrolyze_N" placeholder="请输入数据(>=60)" >
              <span slot="append">mg/kg</span>
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="有效P：" prop="valid_P">
            <Input v-model="environment.valid_P" placeholder="请输入数据(>=10)" >
              <span slot="append">mg/kg</span>
            </Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="11" offset="1">
          <FormItem label="速效K：" prop="rapid_K">
            <Input v-model="environment.rapid_K" placeholder="请输入数据(>=100)" ><span slot="append">mg/kg</span>
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="含盐量：" prop="saltness">
            <Input v-model="environment.saltness" placeholder="请输入数据" ></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="11" offset="1">
          <FormItem label="EC值：" prop="ec_value">
            <Input v-model="environment.ec_value" placeholder="请输入数据">
              <span slot="append">m</span>
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="pH值：" prop="ph_value">
            <Input v-model="environment.ph_value" placeholder="请输入数据" ></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col  span="11" offset="1">
          <FormItem label="是否埋干：" prop="is_buried" style="width: 100%;">
            <RadioGroup v-model="environment.is_buried">
              <Radio v-for="item in IsBuriedList" :key="item" :label="item">{{item}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="11" v-if="environment.is_buried === '是'">
          <FormItem label="埋干深度：" prop="buried_depth">
            <Input v-model="environment.buried_depth" placeholder="请输入数据"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="11" offset="1">
          <FormItem label="根系土壤含水量：" prop="root_water">
            <Input v-model="environment.root_water" placeholder="请输入数据">
              <span slot="append">%</span>
            </Input>
          </FormItem>
        </Col>
      </Row>
      <div style="color: mediumseagreen;  margin-left: 110px; margin-bottom: 5px; font-weight: bold" >
        <Tooltip placement="right" max-width="200" >
          <div slot="content" style="font-size: 12px; font-family: 宋体">按照《古树名木评价标准》（DB11_T478）的规定测定，满足规定要求的填5m，不满足的按实际填写，并反映在示意图中。</div>
          <Icon type="md-alert" size="14" color="#808695"/>
        </Tooltip>
        <span>保护范围四至:</span>
      </div>

      <Row>
        <Col span="11" offset="1">
          <FormItem prop="protect_E" label="东向："  class="error-tip">
            <Input v-model="environment.protect_E">
              <span slot="append">米</span>
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="西向：" prop="protect_W" class="error-tip">
            <Input v-model="environment.protect_W"><span slot="append">米</span></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="11" offset="1">
          <FormItem label="南向：" prop="protect_S" class="error-tip">
            <Input v-model="environment.protect_S"><span slot="append">米</span></Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="北向：" prop="protect_N" class="error-tip">
            <Input v-model="environment.protect_N"><span slot="append">米</span></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="现状保护示意图：" prop="protect_pic">
            <UploadPicCom :img-name-list="environment.protect_pic" @delete="deletePicProtect" @onUpload="uploadPicProtect">
            </UploadPicCom>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="保护范围内其他植物：" prop="other_plants" style="width: 100%;">
            <RadioGroup v-model="environment.other_plants">
              <Radio v-for="item in OtherPlantsList" :label="item.value" :key="item.value" style="width:auto; margin-right: 60px"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="生长环境总体评价：" prop="evaluation" style="width: 100%">
            <RadioGroup v-model="environment.evaluation">
              <Radio v-for="item in EvaluationList"  :key="item" :label="item">{{item}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row v-if="environment.evaluation === '差'">
        <Col offset="1">
          <FormItem label="生长环境问题：" prop="envoriment_problem" style="width: 500px;">
            <Input type="textarea" v-model="environment.envoriment_problem"  :autosize="true" placeholder="请输入生长环境问题" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="1">
          <FormItem label="保护范围内筑构物情况：" prop="has_structures">
            <RadioGroup v-model="environment.has_structures">
              <Radio v-for="item in HasStructuresList"  :key="item" :label="item">{{item}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <div v-if="environment.has_structures === '有'">
      <Row>
        <Col offset="1">
          <FormItem label="筑构物类型：" prop="structures_type" class="error-tip">
            <Input v-model="environment.structures_type" placeholder="请输入筑构物类型" style="width: 300px"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="environment.has_structures === '有'">
        <Col offset="1">
          <FormItem label="筑构物影响：" prop="structures_affect" class="error-tip">
            <Input v-model="environment.structures_affect" type="textarea" :autosize="true" placeholder="请填写筑构物对树体的影响（包括潜在影响）" style="width: 400px" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>
      </div>

      <Row>
        <Col offset="1">
          <FormItem label="土壤营养状况分析：" prop="nutrient_status">
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
            </Tooltip>特征照片：</span>
            <UploadPicCom :img-name-list="environment.pic_path" @delete="deletePic" @onUpload="uploadPic">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>
    </Form>
    <float_bar  v-role="['超级管理员','单位管理员','调查人员']">
      <div style="text-align: center">
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
        <Button  @click="SubmitTable" type="primary" style="margin-right: 30px">提交</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>
<!--    <div style="text-align: center" v-show="isShow">-->
<!--      <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->
<!--      <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>-->
<!--      <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>-->
<!--      <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>-->
<!--      <router-link :to="{path: `/survey/base_survey`}">-->
<!--        <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--      </router-link>-->
<!--    </div>-->
<!--      <div style="text-align: center" v-show="isSubmit">-->
<!--        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->
<!--        <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>-->
<!--        <Button  @click="SubmitUpdate" type="primary" style="margin-right: 30px">提交修改</Button>-->
<!--        <router-link :to="{path: `/survey/base_survey`}">-->
<!--          <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--        </router-link>-->
<!--      </div>-->
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
  is_buriedList, other_plantsList, evaluationList, has_structuresList, PathToList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddEnvironment,
  AddGeAnalysis, getEnvironmentById,
  getNewGeAnalysis,
  getOneTreeBaseInfo,
  postTjxmRecord,
  queryTjxmRecord, updateEnvironment, updateTjxmRecord
} from "@/api/table";
import {getPicApi, ShowPic, UploadPicApi} from "@/api/upload";
import Float_bar from "_c/FloatBar/float_bar";
import { queryUnits, queryUsers } from "@/api/user";
import UploadPicCom from "_c/Upload/UploadPicCom";

export default {
  name: "environment",
  components: {UploadPicCom, Float_bar },
  data () {
    return {


      timeIndex: 0,
      timeLineList: PathToList,

      isShow: false,
      isSubmit: false,
      loading: false,
      showNextPageModal: false,






      dcUsers: [],
      dcUnits: [],

      tjxm_record: {
        t_id: 0,
        type: '生长环境评价分析',
        username: '',
        status: '已完成',
        type_yw: 'environment',
        tree_code: ''
      },

      TreeInformation: {
        Base: {
          family: '',
          genus: '',
          zw_name: '',
          ld_name: ''
        }
      },

      environment: {
        id: 0,
        elevation: null, // 海拔
        habitat_type: '', // 生长环境类型
        plain_type: [], // 平原类型
        highland_type: '', // 山地类型
        aspect: '', // 坡向
        slope: null, // 坡度
        slope_position: '', // 坡位
        is_pollution: null, // 土壤污染有无
        varia: '', // 土壤是否有杂物
        soil_texture: '', // 土壤质地
        soil_capacity: null, // 土壤容量
        organic_content: '', // 有机质含量
        sample_result: '', // 采样测定结果

        hydrolyze_N: null, // 水解N
        valid_P: null, // 有效P
        rapid_K: null, // 速效K
        saltness: null, // 含盐量
        ec_value: null, // EC值
        ph_value: null, // PC值

        is_buried: null, // 是否埋干
        buried_depth: null, // 埋干深度
        root_water: null, // 土壤含水量

        protect_E: null, // 保护范围四至 东向
        protect_W: null, // 西向
        protect_S: null, // 南向
        protect_N: null, // 北向
        protect_pic: [], // 保护范围示意图
        other_plants: '', // 保护范围内其他植物
        evaluation: '', // 生长环境总体评价
        envoriment_problem: '', // 生长环境问题

        has_structures: null, // 保护范围内构筑物有无
        structures_type: '', // 筑构物类型
        structures_affect: '', // 筑构物影响
        nutrient_status: '', // 土壤营养状况分析
        pic_path: [], // 特征照片
        tree_code: ''
      },
      tree_code: this.$route.params.tree_code,

      HabitatTypeList: habitat_typeList,
      PlainList: plainList,
      HighLandList: highlandList,
      IsPollutionList: ['有','无'],
      VariaList: variaList,
      SoilTextureList: soil_textureList,
      OrganicContentList: organic_contentList,
      IsBuriedList: ['是','否'],
      OtherPlantsList: other_plantsList,
      EvaluationList: ['良好','差'],
      HasStructuresList: ['有','无'],

      ruleValidate: {
        elevation: [{ required: true, message: '请填写海拔' }],
        habitat_type: [{ required: true, trigger: 'change', message: '请选择生长环境类型' }],
        plain_type: [{ required: true, type: 'array', min: 1, trigger: 'change', message: '请选择平原类型' }],
        aspect: [{ required: true, trigger: 'blur', message: '请填写坡向' }],
        slope: [{ required: true, message: '请填写坡度' }],
        slope_position: [{ required: true, trigger: 'blur', message: '请填写坡位' }],
        // protect_E: [{ required: true, message: '请填写数据' }],
        // protect_W: [{ required: true, message: '请填写数据' }],
        // protect_N: [{ required: true, message: '请填写数据' }],
        // protect_S: [{ required: true, message: '请填写数据' }],
        other_plants: [{ required: true, trigger: 'change', message: '请选择' }],
        evaluation: [{ required: true, trigger: 'change', message: '请选择' }],
        envoriment_problem: [{ required: true, trigger: 'blur', message: '请填写' }],
        has_structures: [{ required: true, message: '请选择' }],
        structures_type: [{ required: true, trigger: 'blur', message: '请填写' }],
        structures_affect: [{ required: true, trigger: 'blur', message: '请填写' }]
      }
    }
  },
  created () {
    this.fetchTreeBasicData()
    this.fetchData()
    this.InitIndex()
  },
  mounted () {
    // this.fetchOptions()

  },
  methods: {
    GetUnits () {
      queryUnits().then(res => {
        this.dcUnits = res.data.units
      })
    },
    onDcUnitSelectQueryChange (value) {
      queryUsers({ unit: value, is_dc: true }).then(res => {
        this.dcUsers = res.data.users
      })
    },
    onDcUserSelectQueryChange (value) {
      queryUsers({ name_like: value, is_dc: true, unit: this.environment.dc_unit }).then(res => {
        this.dcUsers = res.data.users
      })
    },
    InitIndex () {
      this.timeLineList.forEach((item, index) => {
        // 执行代码
        if (item.type === this.tjxm_record.type_yw) {
          console.log('index', index)
          this.timeIndex = index
        }
      })
    },

    Show (item) {
      console.log('^^^', item)

      // /survey/update/BasicInformation/110131B03
      this.$router.push({ path: item.path_to + `${this.tree_code}` })
    },
    changeActive (index) {
      this.timeIndex = index;
    },
    checkData(){
      if (this.environment.habitat_type === '平原') {
        this.environment.highland_type = ''
      } else {
        this.environment.plain_type = []
      }
      if (this.environment.is_buried === '无') {
        this.environment.buried_depth = null
      }
      if (this.environment.evaluation === '良好') {
        this.environment.envoriment_problem = ''
      }
      if (this.environment.has_structures === '无') {
        this.environment.structures_affect = ''
        this.environment.structures_type = ''
      }
    },
    add(){
      AddEnvironment(this.environment).then(res => {
        getNewGeAnalysis(this.tree_code).then(resp => {
          this.tjxm_record.t_id = resp.data.new_ge_analysis.id
          postTjxmRecord(this.tjxm_record).then(record => {
            if (record.data.code === 200) {
              this.$Message.success('提交成功')
              this.fetchData()
            } else {
              this.$Message.error('失败')
            }
          })
        })
      }).catch(err => {
        console.log(err)
      })

    },
    update(){
      updateEnvironment(this.environment.id,this.environment).then(res=>{
        if(res.data.code === 200){
          this.$Message.success('成功')
        }else {
          this.$Message.error('失败')
        }
      })
    },
    //isShow=true post
    //isShow=false put
    async SubmitTable(){
      this.environment.tree_code = this.tree_code
      this.tjxm_record.tree_code = this.tree_code
      await this.checkData()
      this.$refs.environment_form.validate((valid) => {
        if (valid) {
          if(this.isShow){
            this.add()
          }else {
            this.update()
          }
        }else {
          this.$Message.error('请填写完整')
        }
      })
    },

    fetchData () {
      this.dcUnits = []
      this.dcUsers = []
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'environment' }).then(record => {
        if (record.data.total !== 0) {
          this.tjxm_record = record.data.tjxm_records[0]
          this.isShow = false
          this.isSubmit = true
          getEnvironmentById(this.tjxm_record.t_id).then(res => {
            this.environment = res.data.environment_by_id
            this.dcUnits.push({ 'unit': this.environment.dc_unit })
            this.dcUsers.push(this.environment.dc_user)

          })
        } else {
          queryUnits().then(res => {
            this.dcUnits = res.data.units
          })
          this.isShow = true
          this.isSubmit = false
        }
      })
    },


    ok () {
      this.showNextPageModal = false
      this.$router.push({ path: `/survey/GrowthVigor/${this.tree_code}` })
    },
    cancel () {
      this.showNextPageModal = false
    },
    NextPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'GrowthVigor' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/GrowthVigor/${this.tree_code}` })
          this.$router.push({ path: `/survey/GrowthVigor/${this.tree_code}` })
        } else {
          this.showNextPageModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      })
    },

    TiJiao () {
      this.$refs.environment_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.environment.update_time = dateToString(this.environment.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.environment.tree_code = this.tree_code
          this.tjxm_record.username = this.environment.investigate_username

          if (this.environment.habitat_type === '平原') {
            this.environment.highland_type = ''
          } else {
            this.environment.plain_type = []
          }
          if (this.environment.is_buried === '无') {
            this.environment.buried_depth = null
          }
          if (this.environment.evaluation === '良好') {
            this.environment.envoriment_problem = ''
          }
          if (this.environment.has_structures === '无') {
            this.environment.structures_affect = ''
            this.environment.structures_type = ''
          }

          console.error('!!!!', this.environment)
          AddGeAnalysis(this.environment).then(res => {
            getNewGeAnalysis(this.tree_code).then(resp => {
              this.tjxm_record.t_id = resp.data.new_ge_analysis.id
              postTjxmRecord(this.tjxm_record).then(record => {
                if (record.data.code === 200) {
                  if (this.tjxm_record.status === '已完成') {
                    this.$Message.success('提交成功')
                    this.fetchData()
                  } else {
                    this.$Message.success('保存成功')
                    this.fetchData()
                  }
                } else {
                  if (this.tjxm_record.status === '已完成') {
                    this.$Message.success('提交失败')
                  } else {
                    this.$Message.success('保存失败')
                  }
                }
              })
            })
            console.log('####', res)
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    Update () {
      this.$refs.environment_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.environment.update_time = dateToString(this.environment.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.environment.tree_code = this.tree_code
          this.tjxm_record.username = this.environment.investigate_username

          if (this.environment.habitat_type === '平原') {
            this.environment.highland_type = ''
          } else {
            this.environment.plain_type = []
          }
          if (this.environment.is_buried === 0) {
            this.environment.buried_depth = 0
          }
          if (this.environment.evaluation === '良好') {
            this.environment.envoriment_problem = ''
          }
          if (this.environment.has_structures === 0) {
            this.environment.structures_affect = ''
            this.environment.structures_type = ''
          }

          console.error('!!!!', this.environment.id)
          updateEnvironment(this.environment.id, this.environment).then(res => {
            if (res.data.code === 200) {
              updateTjxmRecord(this.environment.id, this.tjxm_record).then(record => {
                if (res.data.code === 200) {
                  if (this.tjxm_record.status === '已完成') {
                    this.$Message.success('修改提交成功')
                    this.fetchData()
                  } else {
                    this.$Message.success('修改保存成功')
                    this.fetchData()
                  }
                } else {
                  if (this.tjxm_record.status === '已完成') {
                    this.$Message.error('修改提交失败')
                  } else {
                    this.$Message.error('修改保存失败')
                  }
                }
              })
            }
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    SubmitUpdate () {
      this.tjxm_record.status = '已完成'
      this.Update()
    },

    Submit () {
      this.tjxm_record.status = '已完成'
      this.TiJiao()
    },
    Save () {
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

    fetchTreeBasicData () {
      getOneTreeBaseInfo(this.tree_code).then(res => {
        this.TreeInformation.Base = res.data.tree_basic_info.basic
      })
    },


    // 保护范围示意图
    deletePicProtect(value){
      this.environment.protect_pic = value
    },
    uploadPicProtect(value){
      this.environment.protect_pic = value
    },
    // 特征照片
    deletePic(value){
      this.environment.pic_path = value
    },
    uploadPic(value){
      this.environment.pic_path = value
    },
  }
}
</script>

<style scoped>
/*margin-bottom控制formItem上下间隔距离
  width控制formItem输入框的长度*/
.ivu-form-item {
  margin-bottom: 14px;
  width: 80%;
}

.error-tip >>> div.ivu-form-item-error-tip {
  padding-top: 0.5mm!important;
}

  /*控制单选选项之间距离*/
.ivu-radio-wrapper {
  width: 100px;
  margin-right: 15px;
}
/*复选框选项间隔*/
.ivu-checkbox-wrapper {
  width: 100px;
  margin-right: 15px;
}
.ivu-date-picker {
  width: 100%;
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
  color: grey!important;
}
/*控制上传图片框大小*/
.camera-style {
  width: 100px;
  height:100px;
  line-height: 100px;
}
.pic-upload-list {
  display: inline-block;
  width:100px;
}
.demo-upload-list {
  display: inline-block;width: 100px;height: 100px;text-align: center;line-height: 100px;
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
  width: 130px;
  /*padding-right: 15px;*/
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
