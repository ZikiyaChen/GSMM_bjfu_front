<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">病虫害情况分析</h2>
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
      <Row>
        <Col  span="10" offset="2">
          <FormItem label="古树编号：">
            <Input disabled  v-model="tree_code" class="TextColor"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Form :label-width="180" label-position="right"  ref="Diseases_form" :model="Diseases" :rules="ruleValidate" inline>
      <div style="color: mediumseagreen;  margin-left: 200px; margin-bottom: 5px; font-weight: bold" >
        <span>树干基部：</span>
      </div>
      <Row>
        <Col offset="2">
          <FormItem prop="bmoth_status">
                <span slot="label">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">记录树体活组织中虫害类型、虫孔数量、虫孔直径，并计算最大受害部位宽度与树干周长比，&le;1/3判定为”轻度“，1/3-1/2 为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>蛀干害虫：</span>
            <RadioGroup v-model="Diseases.bmoth_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.bmoth_status !== '无'">
        <Col offset="2" span="18">
          <FormItem prop="bmoth_name">
            <span slot="label" >蛀干害虫名称：</span>
            <Input v-model="Diseases.bmoth_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="bdisease_status">
            <span slot="label">
               <Tooltip placement="top" max-width="200" >
                <div slot="content">记录病害名称，并计算最大受害部位宽度与树干周长比，&le;1/3判定为”轻度“，1/3-1/2 为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>病害：</span>
            <RadioGroup v-model="Diseases.bdisease_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.bdisease_status !== '无'">
        <Col offset="2" span="18">
          <FormItem prop="bdisease_name">
            <span slot="label" >病害名称：</span>
            <Input v-model="Diseases.bdisease_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="base_pic">
            <span slot="label">特征照片：</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_base" :key="index">
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_base(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_base(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_base"
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
            <Modal title="图片预览" v-model="visible_base">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_base" style="width: 100%" />
            </Modal>
          </FormItem>

        </Col>
      </Row>
      <div style="color: mediumseagreen;  margin-left: 220px; margin-bottom: 5px; font-weight: bold" >
        <span>树干：</span>
      </div>
      <Row>
        <Col offset="2">
          <FormItem prop="tmoth_status">
            <span slot="label">蛀干害虫：</span>
            <RadioGroup v-model="Diseases.tmoth_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.tmoth_status !== '无'">
        <Col offset="2" span="18">
          <FormItem prop="tmoth_name">
            <span slot="label">蛀干害虫名称：</span>
            <Input v-model="Diseases.tmoth_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="tdisease_status">
            <span slot="label">病害：</span>
            <RadioGroup v-model="Diseases.tdisease_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.tdisease_status !== '无'">
        <Col offset="2" span="18">
          <FormItem prop="tdisease_name">
            <span slot="label">病害名称：</span>
            <Input v-model="Diseases.tdisease_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="trunk_pic">
            <span slot="label">特征照片：</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_trunk" :key="index">
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_trunk(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_trunk(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_trunk"
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
            <Modal title="图片预览" v-model="visible_trunk">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_trunk" style="width: 100%" />
            </Modal>
          </FormItem>

        </Col>
      </Row>
      <div style="color: mediumseagreen;  margin-left: 170px; margin-bottom: 5px; font-weight: bold" >
        <span>构成骨架大枝：</span>
      </div>
      <Row>
        <Col offset="2">
          <FormItem prop="smoth_status">
            <span slot="label">蛀干害虫：</span>
            <RadioGroup v-model="Diseases.smoth_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.smoth_status !== '无'">
        <Col offset="2" span="18">
          <FormItem prop="smoth_name">
            <span slot="label">蛀干害虫名称：</span>
            <Input v-model="Diseases.smoth_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="sdisease_status">
            <span slot="label">病害：</span>
            <RadioGroup v-model="Diseases.sdisease_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.sdisease_status !== '无'">
        <Col offset="2" span="18">
          <FormItem prop="sdisease_name">
            <span slot="label">病害名称：</span>
            <Input v-model="Diseases.sdisease_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="ske_pic">
            <span slot="label" >特征照片：</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_ske" :key="index">
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_ske(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_ske(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_ske"
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
            <Modal title="图片预览" v-model="visible_ske">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_ske" style="width: 100%" />
            </Modal>
          </FormItem>

        </Col>
      </Row>

      <div style="color: mediumseagreen;  margin-left: 220px; margin-bottom: 5px; font-weight: bold" >
        <span>叶片：</span>
      </div>
      <Row>
        <Col offset="2">
          <FormItem prop="blade_status">
            <span slot="label">
              <Tooltip placement="top" max-width="200" >
                <div slot="content"></div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>病害：</span>
            <RadioGroup v-model="Diseases.blade_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.blade_status !== '无'">
        <Col offset="2">
          <FormItem prop="blade_name">
            <span slot="label">病害名称：</span>
            <Input v-model="Diseases.blade_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="blade_pic">
            <span slot="label">特征照片：</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_blade" :key="index">
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_blade(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_blade(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_blade"
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
            <Modal title="图片预览" v-model="visible_blade">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_blade" style="width: 100%" />
            </Modal>
          </FormItem>

        </Col>
      </Row>

      <div style="color: mediumseagreen;  margin-left: 220px; margin-bottom: 5px; font-weight: bold" >
        <span>枝梢：</span>
      </div>
      <Row>
        <Col offset="2">
          <FormItem prop="branch_status">
            <span slot="label" >
              <Tooltip placement="top" max-width="200" >
                <div slot="content"></div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>蛀干害虫：</span>
            <RadioGroup v-model="Diseases.branch_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.branch_status !== '无'">
        <Col offset="2" span="18">
          <FormItem prop="branch_name">
            <span slot="label">蛀干害虫名称：</span>
            <Input v-model="Diseases.branch_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="branch_pic">
            <span slot="label">特征照片：</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_branch" :key="index">
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_branch(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_branch(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_branch"
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
            <Modal title="图片预览" v-model="visible_branch">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_branch" style="width: 100%" />
            </Modal>
          </FormItem>

        </Col>
      </Row>
      <div style="color: mediumseagreen;  margin-left: 220px; margin-bottom: 5px; font-weight: bold" >
        <span>评价：</span>
      </div>
      <Row>
        <Col offset="2" span="18">
          <FormItem prop="total_eval">
            <span slot="label" >总体评价：</span>
            <Input v-model="Diseases.total_eval" type="textarea" :autosize="true"
                   placeholder="（评价树体遭受病虫害侵袭程度，给出管护建议，
   仅发生在腐朽组织或部位的虫害需要在本部分说明）" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>

<!--      <Row>-->
<!--        <Col span="10" offset="2">-->
<!--          <FormItem label="调查单位" prop="dc_unit" class="error-tip">-->
<!--            <Select v-model="Diseases.dc_unit" placeholder="选择调查单位名称" filterable @on-clear="GetUnits"-->
<!--                    @on-query-change="onDcUnitSelectQueryChange" clearable  >-->
<!--              <Option v-for="item in dcUnits" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--        <Col span="10">-->
<!--          <FormItem label="调查时间" prop="update_time" class="error-tip">-->
<!--            <DatePicker v-model="Diseases.update_time"  type="datetime" placeholder="请选择日期"></DatePicker>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->
<!--      <Row>-->
<!--        <Col span="10" offset="2">-->
<!--          <FormItem label="调查人" prop="investigate_username" class="error-tip">-->
<!--            <Select v-model="Diseases.investigate_username" placeholder="名字" filterable-->
<!--                    @on-query-change="onDcUserSelectQueryChange" clearable >-->
<!--              <Option v-for="item in dcUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->

    </Form>
<!--float_bar margin-top控制页面下端到float-bar的距离-->
    <float_bar  v-role="['超级管理员','单位管理员','调查人员']" style="margin-top: 30px">
      <div style="text-align: center" >
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>

        <Button  @click="SubmitTable" type="primary" style="margin-right: 30px">提交</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>
<!--      <div style="text-align: center" v-show="isShow">-->
<!--        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->

<!--        <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>-->
<!--        <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>-->
<!--        <router-link :to="{path: `/survey/base_survey`}">-->
<!--          <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--        </router-link>-->
<!--      </div>-->

<!--      <div style="text-align: center" v-show="isSubmit">-->
<!--        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->
<!--        <Button  @click="SubmitUpdate" type="primary" style="margin-right: 30px">提交修改</Button>-->

<!--        <router-link :to="{path: `/survey/base_survey`}">-->
<!--          <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--        </router-link>-->
<!--      </div>-->
    </float_bar>
  </Card>

  <Modal
    v-model="showPreviousPageModal"
    title="提醒"
    @on-ok="okPrevious"
    @on-cancel="cancelPrevious">
    <p>上一页为《树体倾斜、空腐情况检测》，
      该古树的《树体倾斜、空腐情况检测》尚未填写，</p>
    <p>如果需要填写，请点击“确定”</p>
  </Modal>
</div>
</template>

<script>
import { damageList, PathToList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddBchAnalysis, AddBchFx, AddEnvironment,
  getDiseases, getNewGeAnalysis,
  getOneTreeBaseInfo,
  postTjxmRecord,
  queryTjxmRecord, updateDiseases, updateEnvironment, updateTjxmRecord
} from "@/api/table"
import { ShowPic , UploadPicApi} from "@/api/upload";
import Float_bar from "_c/FloatBar/float_bar";
import { queryUnits, queryUsers } from "@/api/user";

export default {
  name: "Diseases",
  components: { Float_bar },
  data () {
    return {
      UploadPicAPI: UploadPicApi,
      timeIndex: 0,
      timeLineList: PathToList,
      dcUsers: [],
      dcUnits: [],

      showPreviousPageModal: false,

      isShow: false,
      isSubmit: false,

      tree_code: this.$route.params.tree_code,
      OptionList: damageList,

      showImageUrl: '',

      visible_base: false,
      i_base: 0,
      PicUrlList_base: [],

      visible_trunk: false,
      i_trunk: 0,
      PicUrlList_trunk: [],

      visible_ske: false,
      i_ske: 0,
      PicUrlList_ske: [],

      visible_blade: false,
      i_blade: 0,
      PicUrlList_blade: [],

      visible_branch: false,
      i_branch: 0,
      PicUrlList_branch: [],

      TreeInformation: {
        Base: {
          family: '',
          genus: '',
          zw_name: '',
          ld_name: ''
        }
      },

      tjxm_record: {
        t_id: 0,
        type: '病虫害情况分析',
        tree_code: '',
        status: '已完成',
        type_yw: 'Diseases',
      },

      Diseases: {
        id: 0,
        bmoth_status: '', // 树干基部-蛀干害虫情况
        bmoth_name: '', // 树干基部-害虫名称
        bdisease_status: '', // 树干基部-病害情况
        bdisease_name: '', // 树干基部-病害名称
        base_pic: [], // 树干基部-特征照片

        tmoth_status: '', // 树干-蛀干害虫情况
        tmoth_name: '', // 树干-蛀干害虫名称
        tdisease_status: '', // 树干-病害情况
        tdisease_name: '', // 树干-病害名称
        trunk_pic: [], // 树干-特征照片

        smoth_status: '', // 构成骨架大枝-蛀干害虫情况
        smoth_name: '', // 构成骨架大枝-蛀干害虫名称
        sdisease_status: '', // 构成骨架大枝-病害情况
        sdisease_name: '', // 构成骨架大枝-病害名称
        ske_pic: [], // 构成骨架大枝-特征照片

        blade_status: '', // 叶片-病害情况
        blade_name: '', // 叶片-病害名称
        blade_pic: [], // 叶片-特征照片

        branch_status: '', // 枝梢-蛀干害虫情况
        branch_name: '', // 枝梢-蛀干害虫名称
        branch_pic: [], // 枝梢-特征照片

        total_eval: '', // 总体评价
        tree_code: ''
      },
      ruleValidate: {
        bmoth_status: [{ required: true, trigger: 'change', message: '请选择' }],
        bdisease_status: [{ required: true, trigger: 'change', message: '请选择' }],
        tmoth_status: [{ required: true, trigger: 'change', message: '请选择' }],
        tdisease_status: [{ required: true, trigger: 'change', message: '请选择' }],
        smoth_status: [{ required: true, trigger: 'change', message: '请选择' }],
        sdisease_status: [{ required: true, trigger: 'change', message: '请选择' }],
        blade_status: [{ required: true, trigger: 'change', message: '请选择' }],
        branch_status: [{ required: true, trigger: 'change', message: '请选择' }],
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
    Show (item) {
      console.log('^^^', item)

      // /survey/update/BasicInformation/110131B03
      this.$router.push({ path: item.path_to + `${this.tree_code}` })
    },
    changeActive (index) {
      this.timeIndex = index;
    },

    okPrevious () {
      this.showPreviousPageModal = false
      this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
    },
    cancelPrevious () {
      this.showPreviousPageModal = false
    },
    PreviousPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Incline' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/environment/${this.tree_code}` })
          this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
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
      queryUsers({ name_like: value, is_dc: true, unit: this.Diseases.dc_unit }).then(res => {
        this.dcUsers = res.data.users
      })
    },
    fetchData () {
      this.dcUnits = []
      this.dcUsers = []
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Diseases' }).then(record => {
        if (record.data.total !== 0) {
          this.isShow = false
          this.isSubmit = true
          this.tjxm_record = record.data.tjxm_records[0]
          getDiseases({ 'id': this.tjxm_record.t_id }).then(res => {
            this.Diseases = res.data.tree_Bch
            this.dcUsers.push(res.data.tree_Bch.dc_user)
            this.dcUnits.push({ 'unit': res.data.tree_Bch.dc_unit })
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
      this.PicUrlList_base = []
      this.PicUrlList_trunk = []
      this.PicUrlList_ske = []
      this.PicUrlList_blade = []
      this.PicUrlList_branch = []

      if (this.Diseases.base_pic.length !== 0) {
        this.Diseases.base_pic.forEach((pic_name) => {
          ShowPic(pic_name).then(resp => {
            this.PicUrlList_base.push(resp.data)
          })
        })
      }
      if (this.Diseases.trunk_pic.length !== 0) {
        this.Diseases.trunk_pic.forEach((pic_name) => {
          ShowPic(pic_name).then(resp => {
            this.PicUrlList_trunk.push(resp.data)
          })
        })
      }
      if (this.Diseases.ske_pic.length !== 0) {
        this.Diseases.ske_pic.forEach((pic_name) => {
          ShowPic(pic_name).then(resp => {
            this.PicUrlList_ske.push(resp.data)
          })
        })
      }
      if (this.Diseases.blade_pic.length !== 0) {
        this.Diseases.blade_pic.forEach((pic_name) => {
          ShowPic(pic_name).then(resp => {
            this.PicUrlList_blade.push(resp.data)
          })
        })
      }
      if (this.Diseases.branch_pic.length !== 0) {
        this.Diseases.branch_pic.forEach((pic_name) => {
          ShowPic(pic_name).then(resp => {
            this.PicUrlList_branch.push(resp.data)
          })
        })
      }
    }, //* ****
    add(){
      AddBchFx(this.Diseases).then(res => {
        getDiseases({'tree_code':this.tree_code}).then(resp => {
          this.tjxm_record.t_id = resp.data.tree_Bch.id
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
      updateDiseases(this.Diseases.id,this.Diseases).then(res=>{
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
      this.Diseases.tree_code = this.tree_code
      this.tjxm_record.tree_code = this.tree_code
      this.$refs.Diseases_form.validate((valid) => {
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
    TiJiao () {
      this.Diseases.tree_code = this.tree_code
      this.$refs.Diseases_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Diseases.update_time = dateToString(this.Diseases.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Diseases.investigate_username
          AddBchAnalysis(this.Diseases).then(res => {
            getDiseases({ 'tree_code': this.tree_code }).then(resp => {
              this.tjxm_record.t_id = resp.data.tree_Bch.id
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

    Submit: function () {
      this.tjxm_record.status = '已完成'
      this.TiJiao()
    },
    Save: function () {
      // this.changeLoading()
      this.tjxm_record.status = '待提交'
      this.TiJiao()
    },

    Update () {
      this.Diseases.tree_code = this.tree_code
      this.$refs.Diseases_form.validate((valid) => {
        if (valid) {
          this.Diseases.update_time = dateToString(this.Diseases.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Diseases.investigate_username
          updateDiseases(this.Diseases.id, this.Diseases).then(res => {
            if (res.data.code === 200) {
              updateTjxmRecord(this.Diseases.id, this.tjxm_record).then(record => {
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

    // 特征照片base
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    handleView_base (imageUrl) {
      this.showImageUrl = imageUrl
      this.visible_base = true
    },
    handleRemoveList_base (index) {
      // 删除
      this.PicUrlList_base.splice(index, 1)
      this.Diseases.base_pic.splice(index, 1)
    },
    handleSuccessList_base: function (res, file) {
      if (res.code === 500) {
        this.Diseases.base_pic.push(res.path)
        this.i_base++
        ShowPic(res.path).then(resp => {
          this.PicUrlList_base.push(resp.data)
        })
      }
    },

    // 特征照片trunk
    handleView_trunk (imageUrl) {
      this.showImageUrl = imageUrl
      this.visible_trunk = true
    },
    handleRemoveList_trunk (index) {
      // 删除
      this.PicUrlList_trunk.splice(index, 1)
      this.Diseases.trunk_pic.splice(index, 1)
    },
    handleSuccessList_trunk: function (res, file) {
      if (res.code === 500) {
        this.Diseases.trunk_pic.push(res.path)
        this.i_trunk++
        ShowPic(res.path).then(resp => {
          this.PicUrlList_trunk.push(resp.data)
        })
      }
    },

    // 特征照片ske
    handleView_ske (imageUrl) {
      this.showImageUrl = imageUrl
      this.visible_ske = true
    },
    handleRemoveList_ske (index) {
      // 删除
      this.PicUrlList_ske.splice(index, 1)
      this.Diseases.ske_pic.splice(index, 1)
    },
    handleSuccessList_ske: function (res, file) {
      if (res.code === 500) {
        this.Diseases.ske_pic.push(res.path)
        this.i_ske++
        ShowPic(res.path).then(resp => {
          this.PicUrlList_ske.push(resp.data)
        })
      }
    },

    // 特征照片blade
    handleView_blade (imageUrl) {
      this.showImageUrl = imageUrl
      this.visible_blade = true
    },
    handleRemoveList_blade (index) {
      // 删除
      this.PicUrlList_blade.splice(index, 1)
      this.Diseases.blade_pic.splice(index, 1)
    },
    handleSuccessList_blade: function (res, file) {
      if (res.code === 500) {
        this.Diseases.blade_pic.push(res.path)
        this.i_blade++
        ShowPic(res.path).then(resp => {
          this.PicUrlList_blade.push(resp.data)
        })
      }
    },

    // 特征照片branch
    handleView_branch (imageUrl) {
      this.showImageUrl = imageUrl
      this.visible_branch = true
    },
    handleRemoveList_branch (index) {
      // 删除
      this.PicUrlList_branch.splice(index, 1)
      this.Diseases.branch_pic.splice(index, 1)
    },
    handleSuccessList_branch: function (res, file) {
      if (res.code === 500) {
        this.Diseases.branch_pic.push(res.path)
        this.i_branch++
        ShowPic(res.path).then(resp => {
          this.PicUrlList_branch.push(resp.data)
        })
      }
    }
  }
}
</script>

<style scoped>
.TextStyle >>> textarea.ivu-input {
  font-size: 12px;
}
/*margin-bottom控制formItem上下间隔距离
  width控制formItem输入框的长度*/
.ivu-form-item {
  margin-bottom: 14px;
  width: 90%;
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
