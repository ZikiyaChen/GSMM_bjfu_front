<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">已采取复壮保护措施情况与分析</h2>

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

      <Form :label-width="180" label-position="right" :model="TreeInformation" inline >
        <h4>古树基本信息:</h4>
        <Row>
          <Col  span="11" offset="1">
            <FormItem label="古树编号：">
              <Input disabled  v-model="tree_code" class="TextColor"></Input>
            </FormItem>
          </Col>
          <Col span="11" >
            <FormItem label="中文名：" prop="Base.zw_name">
              <Input v-model="TreeInformation.Base.zw_name" disabled class="TextColor"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Form :label-width="180" label-position="right"  ref="protect_form" :model="Protect" :rules="ruleValidate" inline>
        <Row>
          <Col span="11" offset="1">
            <FormItem label="调查单位：" prop="dc_unit" class="error-tip">
              <Select v-model="Protect.dc_unit" placeholder="选择调查单位名称" filterable @on-clear="GetUnits"
                      @on-query-change="onDcUnitSelectQueryChange" clearable  >
                <Option v-for="item in dcUnits" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="调查时间：" prop="update_time" class="error-tip">
              <DatePicker v-model="Protect.update_time"  type="datetime" placeholder="请选择日期"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11" offset="1">
            <FormItem label="调查人：" prop="investigate_username" class="error-tip">
              <Select v-model="Protect.investigate_username" placeholder="名字" filterable
                      @on-query-change="onDcUserSelectQueryChange" clearable >
                <Option v-for="item in dcUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <h4>已采取复壮保护措施情况与分析:</h4>
        <Row>
          <Col offset="1">
            <FormItem prop="protect" style="width: 100%">
              <span slot="label" >地上保护措施：</span>
              <CheckboxGroup v-model="Protect.protect">
                <Checkbox v-for="item in ProtectList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem prop="soil_improve" style="width: 100%;">
              <span slot="label" >地下土壤改良措施：</span>
              <CheckboxGroup v-model="Protect.soil_improve">
                <Checkbox v-for="item in SoilImproveList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem prop="is_block">
              <span slot="label" >是否封堵树洞：</span>
              <RadioGroup v-model="Protect.is_block">
                <Radio v-for="item in IsBlockList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
<!--        封堵、未封堵需要填的-->
        <div v-if="Protect.is_block === 1">
          <h4>封堵树洞：</h4>
          <Row>
            <Col offset="1">
              <FormItem prop="fit_status"  :key="Protect.fit_status" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" >与树体贴合情况：</span>
                <RadioGroup v-model="Protect.fit_status">
                  <Radio v-for="item in FitStatusList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="1">
              <FormItem prop="drain_hole" :key="Protect.drain_hole" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" >排水孔和排湿孔：</span>
                <RadioGroup v-model="Protect.drain_hole">
                  <Radio v-for="item in DrainHolesList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="tech_level">
                <span slot="label" >工艺水平：</span>
                <RadioGroup v-model="Protect.tech_level">
                  <Radio v-for="item in TechLevelList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="outer">
                <span slot="label">外层处理：</span>
                <RadioGroup v-model="Protect.outer">
                  <Radio v-for="item in OuterList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div v-else>
          <h4>未封堵树洞：</h4>
          <Row>
            <Col offset="1">
              <FormItem prop="clean_status" :key="Protect.clean_status" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" >内壁清理程度：</span>
                <RadioGroup v-model="Protect.clean_status">
                  <Radio v-for="item in CleanStatusList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="antiseptic" >
                <span slot="label" >内壁防腐处理：</span>
                <RadioGroup v-model="Protect.antiseptic">
                  <Radio v-for="item in AntisepticList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row>
          <Col offset="1">
            <FormItem prop="is_support">
              <span slot="label" style="font-size: 13px">有无支撑：</span>
              <RadioGroup v-model="Protect.is_support">
                <Radio v-for="item in IsSupportList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <div v-if="Protect.is_support === 1">

          <h4>支撑情况：</h4>
          <Row>
            <Col offset="1" span="11">
              <FormItem prop="hard_support" :key="Protect.hard_support" :rules="[{required: true,  message: '请输入' }]">
                <span slot="label" >硬支撑：</span>
                <Input v-model="Protect.hard_support">
                  <span slot="append">处</span>
                </Input>
              </FormItem>
            </Col>
            <Col span="11">
              <FormItem prop="protaging" :key="Protect.protaging" :rules="[{required: true,  message: '请输入' }]">
                <span slot="label" >拉纤：</span>
                <Input v-model="Protect.protaging">
                  <span slot="append">处</span>
                </Input>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="1">
              <FormItem prop="steady">
                <span slot="label" >支撑稳固情况：</span>
                <RadioGroup v-model="Protect.steady">
                  <Radio v-for="item in SteadyList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="support_type" :key="Protect.support_type" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" >支撑类型：</span>
                <RadioGroup v-model="Protect.support_type">
                  <Radio v-for="item in SupportTypeList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="support_isrea">
                <span slot="label" >支撑部位：</span>
                <RadioGroup v-model="Protect.support_isrea">
                  <Radio v-for="item in SupportIsreaList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="hoop_status" :key="Protect.hoop_status" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" >抱箍：</span>
                <RadioGroup v-model="Protect.hoop_status">
                  <Radio v-for="item in HoopStatusList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="1">
              <FormItem prop="rubber_is">
                <span slot="label" >支撑工艺-橡胶垫设置：</span>
                <RadioGroup v-model="Protect.rubber_is">
                  <Radio v-for="item in RubberIsList" :label="item.value" :key="item.value">{{item.label}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="hoop_is">
                <span slot="label">支撑工艺-抱箍设置：</span>
                <RadioGroup v-model="Protect.hoop_is">
                  <Radio v-for="item in HoopIsList" :label="item.value" :key="item.value">{{item.label}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row>
          <Col offset="1">
            <FormItem prop="has_ditch">
              <span slot="label" >有无复壮沟：</span>
              <RadioGroup v-model="Protect.has_ditch">
                <Radio v-for="item in HasDitchList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <div v-if="Protect.has_ditch === 1">

          <h4>复壮沟：</h4>
          <Row>
            <Col offset="1">
              <FormItem prop="ditch_type" :key="Protect.ditch_type" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" >复壮沟类型：</span>
                <RadioGroup v-model="Protect.ditch_type">
                  <Radio v-for="item in DitchTypeList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1" span="11">
              <FormItem prop="ditch_num" :key="Protect.ditch_num" :rules="[{required: true,  message: '请输入' }]">
                <span slot="label" >数量：</span>
                <Input v-model="Protect.ditch_num"><span slot="append">处</span></Input>
              </FormItem>
            </Col>
            <Col span="11">
              <FormItem prop="ditch_width" label="宽度：">
                <Input v-model="Protect.ditch_width"><span slot="append">米</span></Input>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="11" offset="1">
              <FormItem prop="ditch_length" label="总长度：">
                <span slot="label" >总长度：</span>
                <Input v-model="Protect.ditch_length"><span slot="append">米</span></Input>
              </FormItem>
            </Col>
            <Col span="11">
              <FormItem prop="pipe_num" label="通气管：" :key="Protect.pipe_num" :rules="[{required: true, message: '请输入' }]">
                <Input v-model="Protect.pipe_num"><span slot="append">处</span></Input>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="1">
              <FormItem prop="matrix_constitute" label="基质组成：" style="width: 100%;">
                <RadioGroup v-model="Protect.matrix_constitute">
                  <Radio v-for="item in MatrixConstituteList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="position_is" label="位置设置：">
                <RadioGroup v-model="Protect.position_is">
                  <Radio v-for="item in PositionIsList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="1" span="11">
              <FormItem prop="well_num" label="渗井：" :key="Protect.well_num" :rules="[{required: true,  message: '请输入' }]">
                <Input v-model="Protect.well_num"><span slot="append">处</span></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="1">
              <FormItem prop="capillary_roots">
                <span slot="label" >
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">根据探根情况判断</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>毛细根生长情况：</span>
                <RadioGroup v-model="Protect.capillary_roots">
                  <Radio v-for="item in CapillaryRootsList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row>
          <Col offset="1" span="18">
            <FormItem prop="protect_eval">
              <span slot="label">现有复壮保护措施评价：</span>
              <Input v-model="Protect.protect_eval" type="textarea" :autosize="true"
                     placeholder="（对现有复壮措施合理性给出评价和改进建议）" class="TextStyle"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem prop="pic">
            <span slot="label" >
              <Tooltip placement="top" max-width="200" >
                <div slot="content">反映现有复壮保护措施的典型照片3-9张</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>特征照片(3-9张)：</span>
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
                :action="UploadPicAPI"
                class="pic-upload-list">
                <div class="camera-style">
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
      <float_bar  v-role="['超级管理员','单位管理员','调查人员']">
      <div style="text-align: center" v-show="isShow">
        <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
        <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>
        <div style="text-align: center" v-show="isSubmit">
          <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
          <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
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
      <p>下一页为《树体损伤评估》，
        该古树的《树体损伤评估》尚未填写，</p>
      <p>如果需要填写，请点击“确定”</p>
    </Modal>
    <Modal
      v-model="showPreviousPageModal"
      title="提醒"
      @on-ok="okPrevious"
      @on-cancel="cancelPrevious">
      <p>上一页为《生长势分析》，
        该古树的《生长势分析》尚未填写，</p>
      <p>如果需要填写，请点击“确定”</p>
    </Modal>
  </div>
</template>

<script>
import {
  protectList, soil_improveList, is_blockList, fit_statusList, drain_holeList, tech_levelList,
  outerList, clean_statusList, antisepticList, is_supportList, steadyList, support_typeList,
  support_isreaList, hoop_statusList, rubber_isList, hoop_isList, has_ditchList,
  ditch_typeList, matrix_constituteList, position_isList, capillary_rootsList, PathToList
} from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddFzbhAnalysis, getNewProtect,
  getOneTreeBaseInfo, getProtect_By_id,
  postTjxmRecord,
  queryTjxmRecord,  updateProtect, updateTjxmRecord
} from "@/api/table";
import Float_bar from "_c/FloatBar/float_bar";
import { ShowPic, UploadPicApi } from "@/api/upload";
import { queryUnits, queryUsers } from "@/api/user";

export default {
  name: "Protect",
  components: { Float_bar },
  data () {
    return {
      UploadPicAPI: UploadPicApi,
      timeIndex: 0,
      timeLineList: PathToList,

      isShow: false,
      isSubmit: false,
      TreeInformation: {
        Base: {
          family: '',
          genus: '',
          zw_name: '',
          ld_name: ''
        }
      },
      dcUnits: [],
      dcUsers: [],

      tjxm_record: {
        t_id: 0,
        type: '已采取复壮保护措施情况与分析',
        username: '',
        status: '',
        type_yw: 'Protect',
        time: ''
      },
      showNextPageModal: false,
      showPreviousPageModal: false,
      tree_code: this.$route.params.tree_code,
      ProtectList: protectList,
      SoilImproveList: soil_improveList,
      IsBlockList: is_blockList,
      FitStatusList: fit_statusList,
      DrainHolesList: drain_holeList,
      TechLevelList: tech_levelList,
      OuterList: outerList,
      CleanStatusList: clean_statusList,
      AntisepticList: antisepticList,
      IsSupportList: is_supportList,
      SteadyList: steadyList,
      SupportTypeList: support_typeList,
      SupportIsreaList: support_isreaList,
      HoopStatusList: hoop_statusList,
      RubberIsList: rubber_isList,
      HoopIsList: hoop_isList,
      HasDitchList: has_ditchList,
      DitchTypeList: ditch_typeList,
      MatrixConstituteList: matrix_constituteList,
      PositionIsList: position_isList,
      CapillaryRootsList: capillary_rootsList,

      PicUrlList: [],
      showImageUrl: '',
      visible: false,
      i: 0,

      Protect: {
        id: 0,
        protect: [], // 地上保护措施
        soil_improve: [], // 地下土壤改良措施
        is_block: 0, // 是否封堵树洞

        fit_status: '', // （封堵）与树体贴合情况
        drain_hole: '', // （封堵）排水孔和排湿孔
        tech_level: '', // *（封堵）工艺水平
        outer: '', // *（封堵）外层处理

        clean_status: '', // *（未封堵）内壁清理程度
        antiseptic: '', // *（未封堵）内壁防腐处理

        is_support: 0, // *是否存在支撑
        hard_support: 0, // *（有支撑）硬支撑几处
        protaging: 0, // *（有支撑）拉纤几处
        steady: '', // （有支撑）稳固情况
        support_type: '', // *（有支撑）支撑类型
        support_isrea: '', // （有支撑）支撑部位是否合理
        hoop_status: '', // *（有支撑）抱箍情况
        rubber_is: 0, // （有支撑）橡胶垫设置是否合理
        hoop_is: 0, // （有支撑）抱箍设置是否合理

        has_ditch: 0, // 复壮沟有无
        ditch_type: '', // *（有）复壮沟类型
        ditch_num: 0, // *（有）复壮沟数量
        ditch_width: 0, // 复壮沟宽度
        ditch_length: 0, // 复壮沟总长度
        pipe_num: 0, // *（有）通气管数量
        matrix_constitute: '', // 复壮沟基质组成
        position_is: '', // 复壮沟位置设置是否合理
        well_num: 0, // *（有）渗井数量
        capillary_roots: '', // 复壮沟毛细根生长情况

        protect_eval: '', // 现有复壮保护措施评价
        pic: [], // 特征照片
        update_time: '',
        tree_code: '',
        investigate_username: '',
        dc_unit: ''
      },
      ruleValidate: {
        protect: [{ required: true, message: '请选择' }],
        soil_improve: [{ required: true, message: '请选择' }],
        is_block: [{ required: true, message: '请选择' }],
        is_support: [{ required: true, message: '请选择' }],
        has_ditch: [{ required: true, message: '请选择' }],
        investigate_username: [{ required: true, trigger: 'change', message: '请选择调查人姓名' }],
        dc_unit: [{ required: true, trigger: 'change', message: '请选择调查单位' }],
        update_time: [{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }],
      }
    }
  },
  created () {
    this.fetchTreeBasicData()
    this.fetchData()
    this.InitIndex()
  },
  methods: {
    InitIndex () {
      this.timeLineList.forEach((item, index) => {
        // 执行代码
        if (item.type === this.tjxm_record.type_yw) {
          console.log('index', index)
          this.timeIndex = index
        }
      })
    },
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
      queryUsers({ name_like: value, is_dc: true, unit: this.Protect.dc_unit }).then(res => {
        this.dcUsers = res.data.users
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

    fetchData () {
      this.dcUnits = []
      this.dcUsers = []
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Protect' }).then(record => {
        if (record.data.total !== 0) {
          this.isShow = false
          this.isSubmit = true
          this.tjxm_record = record.data.tjxm_records[0]
          getProtect_By_id(this.tjxm_record.t_id).then(res => {
            this.Protect = res.data.new_Fzbh
            this.dcUnits.push({ 'unit': res.data.new_Fzbh.dc_unit })
            this.dcUsers.push(res.data.new_Fzbh.dc_user)
            this.fetchPic()
          })
        } else {
          this.isShow = true
          this.isSubmit = false
          queryUnits().then(res => {
            this.dcUnits = res.data.units
          })
        }
      })
    },
    fetchPic () {
      this.PicUrlList = []
      if (this.Protect.pic.length !== 0) {
        this.Protect.pic.forEach((pic_name) => {
          ShowPic(pic_name).then(resp => {
            this.PicUrlList.push(resp.data)
          })
        })
      }
    },

    okNext () {
      this.showNextPageModal = false
      this.$router.push({ path: `/survey/damage/${this.tree_code}` })
    },
    cancelNext () {
      this.showNextPageModal = false
    },
    NextPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'damage' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/damage/${this.tree_code}` })
          this.$router.push({ path: `/survey/damage/${this.tree_code}` })
        } else {
          this.showNextPageModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      })
    },
    okPrevious () {
      this.showPreviousPageModal = false
      this.$router.push({ path: `/survey/GrowthVigor/${this.tree_code}` })
    },
    cancelPrevious () {
      this.showPreviousPageModal = false
    },
    PreviousPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'GrowthVigor' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/GrowthVigor/${this.tree_code}` })
          this.$router.push({ path: `/survey/GrowthVigor/${this.tree_code}` })
        } else {
          this.showPreviousPageModal = true
        }
      })
    },
    fetchTreeBasicData () {
      getOneTreeBaseInfo(this.tree_code).then(res => {
        this.TreeInformation.Base = res.data.tree_basic_info.basic
      })
    },
    Tree () {
      console.log(11, this.tree_code)
      console.log(typeof (this.tree_code))
    },
    TiJiao () {
      this.$refs.protect_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Protect.update_time = dateToString(this.Protect.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Protect.investigate_username
          this.Protect.tree_code = this.tree_code
          // if(this.GrowthVigor.shoot_type === ''){
          //   this.GrowthVigor.shoot=''
          // }
          console.error(this.Protect)
          AddFzbhAnalysis(this.Protect).then(res => {
            getNewProtect(this.tree_code).then(resp => {
              this.tjxm_record.t_id = resp.data.new_Fzbh.id
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
    Submit () {
      this.tjxm_record.status = '已完成'
      this.TiJiao()
      // this.Protect.tree_code = this.tree_code
      // AddFzbhAnalysis(this.Protect).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    Save () {
      this.tjxm_record.status = '待提交'
      this.TiJiao()
      // this.changeLoading()
      // this.$refs.protect_form.validate((valid) => {
      //   console.log(valid)
      //   if (valid) {
      //     this.Protect.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
      //     console.error(this.Protect)
      //     this.$Message.success('保存成功')
      //   } else {
      //     this.$Message.error('请填写完整信息')
      //   }
      // })
    },
    Update () {
      this.$refs.protect_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Protect.update_time = dateToString(this.Protect.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Protect.investigate_username
          this.Protect.tree_code = this.tree_code
          updateProtect(this.Protect.id, this.Protect).then(res => {
            if (res.data.code === 200) {
              updateTjxmRecord(this.Protect.id, this.tjxm_record).then(record => {
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
    // 特征照片
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    // 特征照片
    handleView (imageUrl) {
      this.showImageUrl = imageUrl
      this.visible = true
    },
    handleRemoveList (index) {
      // 删除
      this.Protect.pic.splice(index, 1)
      this.PicUrlList.splice(index, 1)
    },
    handleSuccessList: function (res, file) {
      if (res.code === 500) {
        this.Protect.pic.push(res.path)
        this.i++
        ShowPic(res.path).then(resp => {
          this.PicUrlList.push(resp.data)
        })
      }
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
  margin-right: 25px;
}
/*复选框选项间隔*/
.ivu-checkbox-wrapper {
  width: 100px;
  margin-right: 25px;
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
  color: #999999 !important;
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
