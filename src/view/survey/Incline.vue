<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">树体倾斜、空腐情况检测</h2>
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

    <Form :label-width="200" label-position="right" :model="TreeInformation" inline >

      <Row>
        <Col  span="10"  offset="2">
          <FormItem label="古树编号：">
            <Input disabled  v-model="tree_code" class="TextColor"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Form :label-width="200" label-position="right"  ref="Incline_form" :model="Incline" :rules="ruleValidate" inline>
      <Row>
        <Col offset="2">
          <FormItem prop="base_loose" class="error-tip">
                <span slot="label">
                  <Tooltip placement="right-start" max-width="200" >
                <div slot="content">用力推树干，若树干根基部出现晃动现象，则判断为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>树基松动：</span>
            <RadioGroup v-model="Incline.base_loose">
              <Radio v-for="item in BaseLooseList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_1">
            <span slot="label">树基松动特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_1" @delete="deletePic1" @onUpload="uploadPic1">
            </UploadPicCom>

          </FormItem>

        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="root_rot" class="error-tip">
                <span slot="label">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">用钢棒斜向下45&#176;戳探树干根基部一周至少4个点，若可深入其表层或心材，测量钢棒插入的长度，&le;5cm判定为”轻度“，5-20cm为”中度“，>20cm为”重度“，否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>根部腐朽：</span>
            <RadioGroup v-model="Incline.root_rot">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="pic_2">
            <span slot="label">根部腐朽特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_2" @delete="deletePic2" @onUpload="uploadPic2">
            </UploadPicCom>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="root_bare" class="error-tip">
                <span slot="label">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">根部裸露或隆起时，则测量裸露根系占树埯面积的比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；若超出树埯，则判定为”重度“；否则记为”无“；无树埯时，记录裸露总长度。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>根部裸露：</span>
            <RadioGroup v-model="Incline.root_bare">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
<!--      <Row v-if="Incline.root_bare !== '无'">-->
        <Row>
        <Col offset="2" span="10">
          <FormItem prop="bare_length">
            <span slot="label">根部裸露总长度：</span>
            <Input v-model="Incline.bare_length"><span slot="append">cm</span></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_3">
            <span slot="label">根部裸露特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_3" @delete="deletePic3" @onUpload="uploadPic3">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="has_absound" class="error-tip">
                <span slot="label">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">用木槌敲击，若有异常音，记为”有“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>主干音异常：</span>
            <RadioGroup v-model="Incline.has_absound">
              <Radio v-for="item in HasAbsoundList" :label="item" :key="item">{{item}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="trunk_inclined" class="error-tip">
                <span slot="label">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">测量倾斜程度，&le;5为”轻度“，5&deg;-15&deg;为"中度"，>15&deg;为"重度"；否则记为"无"。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>主干倾斜：</span>
            <RadioGroup v-model="Incline.trunk_inclined">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="pic_4">
            <span slot="label">主干倾斜特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_4" @delete="deletePic4" @onUpload="uploadPic4">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="has_abbranch" class="error-tip">
                <span slot="label">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">观察树干分枝点部位处，仅存在龟裂或卷皮现象为”轻度“，出现腐烂现象但未形成明显空洞为”中度“，可见明显空洞为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>分枝点部位异常：</span>
            <RadioGroup v-model="Incline.has_abbranch">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="pic_5">
            <UploadPicCom :img-name-list="Incline.pic_5" @delete="deletePic5" @onUpload="uploadPic5">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="lopsided" class="error-tip">
                <span slot="label">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">偏冠度&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>偏冠：</span>
            <RadioGroup v-model="Incline.lopsided">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_6">
            <span slot="label">偏冠特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_6" @delete="deletePic6" @onUpload="uploadPic6">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="deadwood" class="error-tip">
                <span slot="label" >
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">枯枝率&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>枯枝：</span>
            <RadioGroup v-model="Incline.deadwood">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_7">
            <span slot="label">枯枝特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_7" @delete="deletePic7" @onUpload="uploadPic7">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="twig" class="error-tip">
                <span slot="label" >
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">1个判定为”轻度“，2或3个为”中度“，>3个为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>枝条整理留茬：</span>
            <RadioGroup v-model="Incline.twig">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_8">
            <span slot="label" >枝条整理留茬特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_8" @delete="deletePic8" @onUpload="uploadPic8">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>
      <Row>
        <Col offset="2" span="10" >
          <FormItem prop="empty_rot_rate">
            <span slot="label">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">用应力波木材检测仪进行测定。百分数表示</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>主干空腐率：</span>
            <Input v-model="Incline.empty_rot_rate"><span slot="append">%</span></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_9">
            <span slot="label" >主干空腐特征照片：</span>
            <UploadPicCom :img-name-list="Incline.pic_9" @delete="deletePic9" @onUpload="uploadPic9">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>
      <Row>
        <Col offset="2" span="18">
          <FormItem prop="qxkf_eval">
            <span slot="label">倾斜、空腐情况总体评价：</span>
            <Input v-model="Incline.qxkf_eval" type="textarea" :autosize="true"
                   placeholder="（对安全风险和空腐程度进行整体评价，并给出管护建议）" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>

<!--      <Row>-->
<!--        <Col span="10" offset="2">-->
<!--          <FormItem label="调查单位" prop="dc_unit" class="error-tip">-->
<!--            <Select v-model="Incline.dc_unit" placeholder="选择调查单位名称" filterable @on-clear="GetUnits"-->
<!--                    @on-query-change="onDcUnitSelectQueryChange" clearable  >-->
<!--              <Option v-for="item in dcUnits" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--        <Col span="10">-->
<!--          <FormItem label="调查时间" prop="update_time">-->
<!--            <DatePicker v-model="Incline.update_time"  type="datetime" placeholder="请选择日期"></DatePicker>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->
<!--      <Row>-->
<!--        <Col span="10" offset="2">-->
<!--          <FormItem label="调查人" prop="investigate_username">-->
<!--            <Select v-model="Incline.investigate_username" placeholder="名字" filterable-->
<!--                    @on-query-change="onDcUserSelectQueryChange" clearable >-->
<!--              <Option v-for="item in dcUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->

    </Form>
    <float_bar  v-role="['超级管理员','单位管理员','调查人员']">
      <div style="text-align: center" >
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>
        <Button  @click="SubmitTable" type="primary" style="margin-right: 30px">提交</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>
<!--    <div style="text-align: center" v-show="isShow">-->
<!--      <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->
<!--      <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>-->
<!--      <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>-->
<!--      <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>-->
<!--      <router-link :to="{path: `/survey/base_survey`}">-->
<!--        <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--      </router-link>-->
<!--    </div>-->

<!--    <div style="text-align: center" v-show="isSubmit">-->
<!--      <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->
<!--      <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>-->
<!--      <Button  @click="SubmitUpdate" type="primary" style="margin-right: 30px">提交修改</Button>-->

<!--      <router-link :to="{path: `/survey/base_survey`}">-->
<!--        <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--      </router-link>-->
<!--    </div>-->
    </float_bar>
  </Card>

  <Modal
    v-model="showNextPageModal"
    title="提醒"
    @on-ok="okNext"
    @on-cancel="cancelNext">
    <p>下一页为《病虫害发生情况分析》，
      该古树的《病虫害发生情况分析》尚未填写，</p>
    <p>如果需要填写，请点击“确定”</p>
  </Modal>
  <Modal
    v-model="showPreviousPageModal"
    title="提醒"
    @on-ok="okPrevious"
    @on-cancel="cancelPrevious">
    <p>上一页为《树体损伤情况评估》，
      该古树的《树体损伤情况评估》尚未填写，</p>
    <p>如果需要填写，请点击“确定”</p>
  </Modal>
</div>
</template>

<script>
import { base_looseList, damageList, has_absoundList, PathToList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddEnvironment, AddQxkf,
  AddqxkfDetect,
  getIncline, getNewGeAnalysis,
  getOneTreeBaseInfo, postTjxmRecord,
  queryTjxmRecord, updateEnvironment, updateIncline, updateTjxmRecord
} from "@/api/table";
import {getPicApi, ShowPic, UploadPicApi} from "@/api/upload";
import Float_bar from "_c/FloatBar/float_bar";
import { queryUnits, queryUsers } from "@/api/user";
import UploadPicCom from "_c/Upload/UploadPicCom";

export default {
  name: "Incline",
  components: {UploadPicCom, Float_bar },
  data () {
    return {
      timeIndex: 0,
      timeLineList: PathToList,

      isShow: false,
      isSubmit: false,
      showNextPageModal: false,
      showPreviousPageModal: false,
      tree_code: this.$route.params.tree_code,
      BaseLooseList: base_looseList,
      OptionList: damageList,
      HasAbsoundList: ['有','无'],

      showImageUrl: '',
      dcUnits: [],
      dcUsers: [],

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
        type: '树体倾斜、空腐情况检测',
        status: '已完成',
        type_yw: 'Incline',
        tree_code: ''
      },

      Incline: {
        id: 0,
        base_loose: '', // *树基松动结果
        pic_1: [], // *树基松动照片
        root_rot: '', // *根部腐朽结果
        pic_2: [], // *根部腐朽照片
        root_bare: '', // *根部裸露结果
        bare_length: 0, // *根部裸露总长度
        pic_3: [], // *根部裸露照片
        has_absound: '', // *主干异常音
        trunk_inclined: '', // 主干倾斜结果
        pic_4: [], // 主干倾斜照片
        has_abbranch: '', // 分枝点部位异常结果
        pic_5: [], // 分枝点部位异常照片
        lopsided: '', // 偏冠结果
        pic_6: [], // 偏冠照片
        deadwood: '', // 枯枝结果
        pic_7: [], // 枯枝照片
        twig: '', // 枝条整理留茬结果
        pic_8: [], // 枝条整理留茬照片
        empty_rot_rate: null, // 主干空腐率
        pic_9: [], //空腐照片
        qxkf_eval: '', // 倾斜空腐情况评价
        tree_code: ''
      },
      ruleValidate: {
        base_loose: [{ required: true, trigger: 'change', message: '请选择' }],
        // root_rot: [{ required: true, trigger: 'change', message: '请选择' }],
        root_bare: [{ required: true, trigger: 'change', message: '请选择' }],
        // has_absound: [{ required: true, message: '请选择' }],
        trunk_inclined: [{ required: true, trigger: 'change', message: '请选择' }],
        // has_abbranch: [{ required: true, trigger: 'change', message: '请选择' }],
        lopsided: [{ required: true, trigger: 'change', message: '请选择' }],
        deadwood: [{ required: true, trigger: 'change', message: '请选择' }],
        twig: [{ required: true, trigger: 'change', message: '请选择' }],
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
      queryUsers({ name_like: value, is_dc: true, unit: this.Incline.dc_unit }).then(res => {
        this.dcUsers = res.data.users
      })
    },
    fetchData () {
      this.dcUnits = []
      this.dcUsers = []
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Incline' }).then(record => {
        if (record.data.total !== 0) {
          this.isShow = false
          this.isSubmit = true
          this.tjxm_record = record.data.tjxm_records[0]

          getIncline({ 'id': this.tjxm_record.t_id }).then(res => {
            this.Incline = res.data.tree_Incline
            this.dcUsers.push(res.data.tree_Incline.dc_user)
            this.dcUnits.push({ 'unit': res.data.tree_Incline.dc_unit })

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

    fetchTreeBasicData () {
      getOneTreeBaseInfo(this.tree_code).then(res => {
        this.TreeInformation.Base = res.data.tree_basic_info.basic
      })
    },

    add(){
      AddQxkf(this.Incline).then(res => {
        getIncline({'tree_code':this.tree_code}).then(resp => {
          this.tjxm_record.t_id = resp.data.tree_Incline.id
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
      updateIncline(this.Incline.id,this.Incline).then(res=>{
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
      this.Incline.tree_code = this.tree_code
      this.tjxm_record.tree_code = this.tree_code
      this.$refs.Incline_form.validate((valid) => {
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
      this.Incline.tree_code = this.tree_code
      this.$refs.Incline_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Incline.update_time = dateToString(this.Incline.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Incline.investigate_username
          AddqxkfDetect(this.Incline).then(res => {
            getIncline({ 'tree_code': this.tree_code }).then(resp => {
              console.error(resp.data)
              this.tjxm_record.t_id = resp.data.tree_Incline.id
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
            console.error(err)
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    Submit () {
      this.tjxm_record.status = '已完成'
      this.TiJiao()
    },
    Save () {
      // this.changeLoading()
      this.tjxm_record.status = '待提交'
      this.TiJiao()
    },

    Update () {
      this.Incline.tree_code = this.tree_code
      this.$refs.Incline_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Incline.update_time = dateToString(this.Incline.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Incline.investigate_username
          updateIncline(this.Incline.id, this.Incline).then(res => {
            if (res.data.code === 200) {
              updateTjxmRecord(this.Incline.id, this.tjxm_record).then(record => {
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

    okNext () {
      this.showNextPageModal = false
      this.$router.push({ path: `/survey/Diseases/${this.tree_code}` })
    },
    cancelNext () {
      this.showNextPageModal = false
    },
    NextPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Diseases' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/Protect/${this.tree_code}` })
          this.$router.push({ path: `/survey/Diseases/${this.tree_code}` })
        } else {
          this.showNextPageModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      })
    },
    okPrevious () {
      this.showPreviousPageModal = false
      this.$router.push({ path: `/survey/damage/${this.tree_code}` })
    },
    cancelPrevious () {
      this.showPreviousPageModal = false
    },
    PreviousPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'damage' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/environment/${this.tree_code}` })
          this.$router.push({ path: `/survey/damage/${this.tree_code}` })
        } else {
          this.showPreviousPageModal = true
        }
      })
    },

    // 树基松动图片
    deletePic1(value){
      this.Incline.pic_1 = value
    },
    uploadPic1(value){
      this.Incline.pic_1 = value
    },

    // 根部腐朽特征照片
    deletePic2(value){
      this.Incline.pic_2 = value
    },
    uploadPic2(value){
      this.Incline.pic_2 = value
    },

    // 根部裸露特征照片
    deletePic3(value){
      this.Incline.pic_3 = value
    },
    uploadPic3(value){
      this.Incline.pic_3 = value
    },

    // 主干倾斜特征照片
    deletePic4(value){
      this.Incline.pic_4 = value
    },
    uploadPic4(value){
      this.Incline.pic_4 = value
    },

    // 分枝点部位异常特征照片
    deletePic5(value){
      this.Incline.pic_5 = value
    },
    uploadPic5(value){
      this.Incline.pic_5 = value
    },

    // 偏冠特征照片
    deletePic6(value){
      this.Incline.pic_6 = value
    },
    uploadPic6(value){
      this.Incline.pic_6 = value
    },
    // 枯枝特征照片
    deletePic7(value){
      this.Incline.pic_7 = value
    },
    uploadPic7(value){
      this.Incline.pic_7 = value
    },

    // 枝条整理留茬特征照片
    deletePic8(value){
      this.Incline.pic_8 = value
    },
    uploadPic8(value){
      this.Incline.pic_8 = value
    },

    // 空腐 特征照片
    deletePic9(value){
      this.Incline.pic_9 = value
    },
    uploadPic9(value){
      this.Incline.pic_9 = value
    },
  }
}
</script>

<style scoped>
/*margin-bottom控制formItem上下间隔距离
  width控制formItem输入框的长度*/
.ivu-form-item {
  margin-bottom: 14px;
  width: 90%;
}

.error-tip >>> div.ivu-form-item-error-tip {
  padding-top: 0.1mm!important;
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
