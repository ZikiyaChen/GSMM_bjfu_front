<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">树体损伤情况评估</h2>

    <div class="timeLine" style="overflow: hidden" >

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

    <Form :label-width="400" label-position="right" :model="TreeInformation" inline >

      <Row>
          <FormItem label="古树编号：" style="width: 60%">
            <Input disabled  v-model="tree_code" class="TextColor"></Input>
          </FormItem>
      </Row>
    </Form>

    <Form :label-width="400" label-position="right"  ref="damage_form" :model="Damage" :rules="ruleValidate" inline >
      <div style="color: mediumseagreen;  margin-left: 320px; margin-bottom: 5px; font-weight: bold" >
        <span>树干基部:</span>
      </div>
      <Row>
        <Col >
          <FormItem prop="base1" class="error-tip">
            <span slot="label" >
              <Tooltip placement="right" max-width="200" >
                <div slot="content">仅树皮有缺陷、腐朽等受害，计算最大受害部位与树干周长比，&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>树皮损伤比例：</span>
            <RadioGroup v-model="Damage.base1">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col>
          <FormItem prop="base2" class="error-tip">
            <span slot="label">
              <Tooltip placement="right" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &#60; 开裂部位处树干半径，则判断为木质部开裂未达心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（未达心材）比例：</span>
            <RadioGroup v-model="Damage.base2">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col>
          <FormItem prop="base3" class="error-tip">
            <span slot="label">
              <Tooltip placement="right" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &ge; 开裂部位处树干半径，则判断为木质部开裂达到心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（达到心材）比例：</span>
            <RadioGroup v-model="Damage.base3">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem prop="pic_base">
            <span slot="label" >特征照片：</span>
            <UploadPicCom :img-name-list="Damage.pic_base" @delete="deletePicBase" @onUpload="uploadPicBase">
            </UploadPicCom>
          </FormItem>
        </Col>
      </Row>


      <div style="color: mediumseagreen;  margin-left: 350px; margin-bottom: 5px; font-weight: bold" >
        <span>树干:</span>
      </div>
      <Row>
        <Col >
          <FormItem prop="trunk1" class="error-tip">
            <span slot="label" >
              <Tooltip placement="right" max-width="200" >
                <div slot="content">仅树皮有缺陷、腐朽等受害，计算最大受害部位与树干周长比，&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>树皮损伤比例：</span>
            <RadioGroup v-model="Damage.trunk1">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col>
          <FormItem prop="trunk2" class="error-tip">
            <span slot="label" >
              <Tooltip placement="right" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &#60; 开裂部位处树干半径，则判断为木质部开裂未达心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（未达心材）比例：</span>
            <RadioGroup v-model="Damage.trunk2">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col>
          <FormItem prop="trunk3" class="error-tip">
            <span slot="label">
              <Tooltip placement="right" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &ge; 开裂部位处树干半径，则判断为木质部开裂达到心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（达到心材）比例：</span>
            <RadioGroup v-model="Damage.trunk3">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem prop="pic_trunk">
            <span slot="label" >特征照片：</span>
            <UploadPicCom :img-name-list="Damage.pic_trunk" @delete="deletePicTrunk" @onUpload="uploadPicTrunk">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>

      <div style="color: mediumseagreen;  margin-left: 290px; margin-bottom: 5px; font-weight: bold" >
        <span>构成骨架大枝：</span>
      </div>
      <Row>
        <Col>
          <FormItem prop="skeleton1" class="error-tip">
            <span slot="label">
              <Tooltip placement="right" max-width="200" >
                <div slot="content">仅树皮有缺陷、腐朽等受害，计算最大受害部位与树干周长比，&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>树皮损伤比例：</span>
            <RadioGroup v-model="Damage.skeleton1">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col>
          <FormItem prop="skeleton2" class="error-tip">
            <span slot="label" >
              <Tooltip placement="right" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &#60; 开裂部位处树干半径，则判断为木质部开裂未达心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（未达心材）比例：</span>
            <RadioGroup v-model="Damage.skeleton2">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>


      <Row>
        <Col>
          <FormItem prop="skeleton3" class="error-tip">
            <span slot="label">
              <Tooltip placement="right" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &ge; 开裂部位处树干半径，则判断为木质部开裂达到心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（达到心材）比例：</span>
            <RadioGroup v-model="Damage.skeleton3">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem prop="pic_ske">
            <span slot="label">特征照片：</span>
            <UploadPicCom :img-name-list="Damage.pic_ske" @delete="deletePicSke" @onUpload="uploadPicSke">
            </UploadPicCom>
          </FormItem>

        </Col>
      </Row>

      <div style="color: mediumseagreen;  margin-left: 350px; margin-bottom: 5px; font-weight: bold" >
        <span>树洞：</span>
      </div>
      <Row>
        <Col>
          <FormItem prop="has_hole" class="error-tip">
            <span slot="label" >
              <Tooltip placement="right" max-width="200" >
                <div slot="content">存在树洞，则记为“有”；否则记为“无”</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>有无树洞：</span>
            <RadioGroup v-model="Damage.has_hole">
              <Radio v-for="item in hasHoleList" :label="item" :key="item"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormItem prop="pic_hole">
            <span slot="label">树洞特征照片：</span>
            <UploadPicCom :img-name-list="Damage.pic_hole" @delete="deletePicHole" @onUpload="uploadPicHole">
            </UploadPicCom>
          </FormItem>
        </Col>
      </Row>

      <div style="color: mediumseagreen;  margin-left: 350px; margin-bottom: 5px; font-weight: bold" >
        <span>树冠：</span>
      </div>

      <Row>
        <Col>
          <FormItem prop="pic_crown">
            <span slot="label">树冠特征照片：</span>
            <UploadPicCom :img-name-list="Damage.pic_crown" @delete="deletePicCrown" @onUpload="uploadPicCrown">
            </UploadPicCom>
          </FormItem>
        </Col>
      </Row>

      <div style="color: mediumseagreen;  margin-left: 320px; margin-bottom: 5px; font-weight: bold" >
        <span>树体劈裂：</span>
      </div>
      <Row>
        <Col>
          <FormItem prop="has_splitting" class="error-tip">
            <span slot="label" >
              <Tooltip placement="right" max-width="200" >
                <div slot="content">存在则记为“有”；否则记为“无”</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>有无树体劈裂：</span>
            <RadioGroup v-model="Damage.has_splitting">
              <Radio v-for="item in hasHoleList" :label="item" :key="item"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormItem prop="pic_splitting">
            <span slot="label">树体劈裂特征照片：</span>
            <UploadPicCom :img-name-list="Damage.pic_splitting" @delete="deletePicSplitting" @onUpload="uploadPicSplitting">
            </UploadPicCom>
          </FormItem>
        </Col>
      </Row>

      <div style="color: mediumseagreen;  margin-left: 260px; margin-bottom: 5px; font-weight: bold" >
        <span>枝条存在掉落危险：</span>
      </div>
      <Row>
        <Col>
          <FormItem prop="pic_falling">
            <span slot="label">枝条存在掉落危险特征照片：</span>
            <UploadPicCom :img-name-list="Damage.pic_falling" @delete="deletePicFalling" @onUpload="uploadPicFalling">
            </UploadPicCom>
          </FormItem>
        </Col>
      </Row>


      <div style="color: mediumseagreen;  margin-left: 350px; margin-bottom: 5px; font-weight: bold" >
        <span>评价：</span>
      </div>
      <Row>
        <Col span="18">
          <FormItem prop="protect_eval">
            <span slot="label">损伤情况评价：</span>
            <Input v-model="Damage.damage_status" type="textarea" :autosize="true" style="width: 350px"
                   placeholder="（对整体损伤程度进行评价，并给出管护建议）" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>
<!--      <Row>-->
<!--        <Col span="11" >-->
<!--          <FormItem label="调查单位：" prop="dc_unit" style="margin-bottom: 17px" class="error-tip">-->
<!--            <Select v-model="Damage.dc_unit" placeholder="选择调查单位名称" filterable @on-clear="GetUnits"-->
<!--                    @on-query-change="onDcUnitSelectQueryChange" clearable style="width: 200px" >-->
<!--              <Option v-for="item in dcUnits" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--        <Col span="11">-->
<!--          <FormItem label="调查时间：" prop="update_time">-->
<!--            <DatePicker v-model="Damage.update_time"  type="datetime" placeholder="请选择日期"></DatePicker>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->
<!--      <Row>-->
<!--        <Col span="11" >-->
<!--          <FormItem label="调查人：" prop="investigate_username" >-->
<!--            <Select v-model="Damage.investigate_username" placeholder="名字" filterable-->
<!--                    @on-query-change="onDcUserSelectQueryChange" clearable style="width: 200px">-->
<!--              <Option v-for="item in dcUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
<!--        </Col>-->
<!--      </Row>-->
    </Form>
    <float_bar v-role="['超级管理员','单位管理员','调查人员']">
      <div style="text-align: center" >
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>
        <Button  @click="SubmitTable" type="primary" style="margin-right: 30px">提交</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>
<!--      <div style="text-align: center" v-show="isShow">-->
<!--        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->
<!--        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>-->
<!--        <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>-->
<!--        <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>-->
<!--        <router-link :to="{path: `/survey/base_survey`}">-->
<!--          <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--        </router-link>-->
<!--      </div>-->

<!--      <div style="text-align: center" v-show="isSubmit" >-->
<!--        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>-->
<!--        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>-->

<!--        <Button  @click="SubmitUpdate" type="primary" style="margin-right: 30px">提交修改</Button>-->

<!--        <router-link :to="{path: `/survey/base_survey`}">-->
<!--          <Button type="primary" style="margin-right: 30px">返回</Button>-->
<!--        </router-link>-->
<!--      </div>-->
    </float_bar>

  </Card>

  <Modal
    v-model="showNextPageModal"
    title="提醒"
    @on-ok="okNext"
    @on-cancel="cancelNext">
    <p>下一页为《树体倾斜、空腐情况检测》，
      该古树的《树体倾斜、空腐情况检测》尚未填写，</p>
    <p>如果需要填写，请点击“确定”</p>
  </Modal>
  <Modal
    v-model="showPreviousPageModal"
    title="提醒"
    @on-ok="okPrevious"
    @on-cancel="cancelPrevious">
    <p>上一页为《已采取复壮保护措施情况与分析》，
      该古树的《已采取复壮保护措施情况与分析》尚未填写，</p>
    <p>如果需要填写，请点击“确定”</p>
  </Modal>
</div>
</template>

<script>
import { damageList, PathToList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddStss,
  AddStssAnalysis,
  getDamage,
  getOneTreeBaseInfo, postTjxmRecord,
  queryTjxmRecord, updateDamage,
} from "@/api/table";
import Float_bar from "_c/FloatBar/float_bar";
import { queryUnits, queryUsers } from "@/api/user";
import UploadPicCom from "_c/Upload/UploadPicCom";

export default {
  name: "damage",
  components: {UploadPicCom, Float_bar },
  data () {
    return {


      timeIndex: 0,
      timeLineList: PathToList,

      showNextPageModal: false,
      showPreviousPageModal: false,
      isShow: false,
      isSubmit: false,
      tree_code: this.$route.params.tree_code,
      DamageList: damageList,

      showImageUrl: '',
      hasHoleList: ['有','无'],

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
        type: '树体损伤情况评估',
        tree_code: '',
        status: '已完成',
        type_yw: 'damage',
      },

      Damage: {
        id: 0,
        base1: '', // 树干基部-树皮损伤比例
        pic_base: [], // (照片)树干基部-
        base2: '', // 树干基部-木质部损伤（未达心材）比例

        base3: '', // 树干基部-木质部损伤（达到心材）比例


        trunk1: '', // 树干-树皮损伤比例
        pic_trunk: [], // (照片)树干-
        trunk2: '', // 树干-木质部（未达心材）比例

        trunk3: '', // 树干-木质部（达到心材）损伤比例


        skeleton1: '', // 构成骨架大枝-树皮损伤比例
        pic_ske: [], // (照片)构成骨架大枝
        skeleton2: '', // 构成骨架大枝-木质部（未达心材）比例

        skeleton3: '', // 构成骨架大枝-木质部（达到心材）比例

        has_hole: '', // 有无树洞
        pic_hole: [], //树洞图片
        pic_crown: [], //树冠图片
        has_splitting: '', //有无树体劈裂
        pic_splitting: [], // 树体劈裂图片
        pic_falling: [], //枝条掉落危险图片


        damage_status: '', // 损伤情况评价
        tree_code: ''
      },
      ruleValidate: {
        // base1: [{ required: true, trigger: 'change', message: '请选择' }],
        // base2: [{ required: true, trigger: 'change', message: '请选择' }],
        // base3: [{ required: true, trigger: 'change', message: '请选择' }],
        //
        // trunk1: [{ required: true, trigger: 'change', message: '请选择' }],
        // trunk2: [{ required: true, trigger: 'change', message: '请选择' }],
        // trunk3: [{ required: true, trigger: 'change', message: '请选择' }],
        //
        // skeleton1: [{ required: true, trigger: 'change', message: '请选择' }],
        // skeleton2: [{ required: true, trigger: 'change', message: '请选择' }],
        // skeleton3: [{ required: true, trigger: 'change', message: '请选择' }],

        investigate_username: [{ required: true, trigger: 'change', message: '请填写调查人姓名' }],
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
    Show (item) {
      console.log('^^^', item)

      // /survey/update/BasicInformation/110131B03
      this.$router.push({ path: item.path_to + `${this.tree_code}` })
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
      queryUsers({ name_like: value, is_dc: true, unit: this.Damage.dc_unit }).then(res => {
        this.dcUsers = res.data.users
      })
    },
    changeActive (index) {
      this.timeIndex = index;
    },

    fetchTreeBasicData () {
      getOneTreeBaseInfo(this.tree_code).then(res => {
        this.TreeInformation.Base = res.data.tree_basic_info.basic
      })
    },

    async add(){
      let res1 = await AddStss(this.Damage)
      if(res1.data.code === 200){
        getDamage({'tree_code':this.tree_code}).then(resp => {
          this.tjxm_record.t_id = resp.data.tree_damage.id
          postTjxmRecord(this.tjxm_record).then(record => {
            if (record.data.code === 200) {
              this.$Message.success('提交成功')
              this.fetchData()
            } else {
              this.$Message.error('失败')
            }
          })
        })
      }

    },
    update(){
      updateDamage(this.Damage.id,this.Damage).then(res=>{
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
      this.Damage.tree_code = this.tree_code
      this.tjxm_record.tree_code = this.tree_code
      this.$refs.damage_form.validate((valid) => {
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
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'damage' }).then(record => {
        if (record.data.total !== 0) {
          this.isShow = false
          this.isSubmit = true
          this.tjxm_record = record.data.tjxm_records[0]
          getDamage({ 'id': this.tjxm_record.t_id }).then(res => {
            this.Damage = res.data.tree_damage
            this.dcUnits.push({ 'unit': res.data.tree_damage.dc_unit })
            this.dcUsers.push(res.data.tree_damage.dc_user)

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

    Update () {
      this.$refs.damage_form.validate((valid) => {
        console.log(valid)
        this.Damage.tree_code = this.tree_code
        if (valid) {
          this.Damage.update_time = dateToString(this.Damage.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Damage.investigate_username
          updateDamage(this.Damage.id, this.Damage).then(res => {
            if (res.data.code === 200) {
              updateTjxmRecord(this.Damage.id, this.tjxm_record).then(record => {
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
      this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
    },
    cancelNext () {
      this.showNextPageModal = false
    },
    NextPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Incline' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/Protect/${this.tree_code}` })
          this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
        } else {
          this.showNextPageModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      })
    },
    okPrevious () {
      this.showPreviousPageModal = false
      this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
    },
    cancelPrevious () {
      this.showPreviousPageModal = false
    },
    PreviousPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Protect' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          // this.$router.push({ path: `/survey/update/environment/${this.tree_code}` })
          this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
        } else {
          this.showPreviousPageModal = true
        }
      })
    },
    // NextPage () {
    //   this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
    // },
    // PreviousPage () {
    //   this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
    // },

    TiJiao () {
      this.Damage.tree_code = this.tree_code
      this.$refs.damage_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Damage.update_time = dateToString(this.Damage.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Damage.investigate_username
          AddStssAnalysis(this.Damage).then(res => {
            getDamage({ 'tree_code': this.tree_code }).then(resp => {
              this.tjxm_record.t_id = resp.data.tree_damage.id
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

    // 树干基部
    deletePicBase(value){
      this.Damage.pic_base = value
    },
    uploadPicBase(value){
      this.Damage.pic_base = value
    },

    // 树干
    deletePicTrunk(value){
      this.Damage.pic_trunk = value
    },
    uploadPicTrunk(value){
      this.Damage.pic_trunk = value
    },
    // 构成骨架大枝
    deletePicSke(value){
      this.Damage.pic_ske = value
    },
    uploadPicSke(value){
      this.Damage.pic_ske = value
    },
    // 树洞
    deletePicHole(value){
      this.Damage.pic_hole = value
    },
    uploadPicHole(value){
      this.Damage.pic_hole = value
    },

    // 树冠
    deletePicCrown(value){
      this.Damage.pic_crown = value
    },
    uploadPicCrown(value){
      this.Damage.pic_crown = value
    },

    // 树体劈裂特征照片splitting
    deletePicSplitting(value){
      this.Damage.pic_splitting = value
    },
    uploadPicSplitting(value){
      this.Damage.pic_splitting = value
    },

    // 枝条掉落危险特征照片falling
    deletePicFalling(value){
      this.Damage.pic_falling = value
    },
    uploadPicFalling(value){
      this.Damage.pic_falling = value
    },

  }
}
</script>

<style scoped>
/*margin-bottom控制formItem上下间隔距离
  width控制formItem输入框的长度*/
.ivu-form-item {
  margin-bottom: 7px;
  width: 90%;
}

.error-tip >>> div.ivu-form-item-error-tip {
  padding-top: 0.1mm !important;
  padding-left: 45% !important;
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
  /*width: 170px;*/
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
