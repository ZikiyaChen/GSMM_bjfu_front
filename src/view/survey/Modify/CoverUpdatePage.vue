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
      <h2 slot="title" style="text-align: center">封面信息</h2>
      <Form :label-width="120" label-position="right" ref="cover_form" :model="CoverInfo" :rules="ruleValidate" inline>
        <Row>
          <Col span="10" offset="2">
            <FormItem label="古树编号：" prop="tree_code" class="error-tip">
              <Input v-model="CoverInfo.tree_code" placeholder="请输入古树编号" disabled class="TextColor"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="2">
            <FormItem label="委托单位（甲方）：" prop="CompanyA" class="error-tip">
              <Input v-model="CoverInfo.CompanyA" placeholder="请输入" ></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="调查单位（乙方）：" prop="CompanyB" class="error-tip">
              <Input v-model="CoverInfo.CompanyB" placeholder="请输入" ></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="10" offset="2">
            <FormItem label="现场调查人：" prop="investigator" class="error-tip">
              <Input v-model="CoverInfo.investigator" placeholder="请输入" ></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="报告编制人：" prop="recorder" class="error-tip">
              <Input v-model="CoverInfo.recorder" placeholder="请输入" ></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="10" offset="2">
            <FormItem label="审核人：" prop="checker" class="error-tip">
              <Input v-model="CoverInfo.checker" placeholder="请输入" ></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="报告签发时间：" prop="signedTime" class="error-tip">
              <DatePicker v-model="CoverInfo.signedTime"  type="datetime" placeholder="请选择日期" ></DatePicker>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="10" offset="2">
            <FormItem label="调查开始时间：" prop="accessStartTime" class="error-tip">
              <DatePicker v-model="CoverInfo.accessStartTime"  type="datetime" placeholder="请选择日期" ></DatePicker>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="调查结束时间：" prop="accessEndTime" class="error-tip">
              <DatePicker v-model="CoverInfo.accessEndTime"  type="datetime" placeholder="请选择日期" ></DatePicker>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="10" offset="2">
            <FormItem label="健康评估状况：" prop="healthCondition" class="error-tip">
              <RadioGroup v-model="CoverInfo.healthCondition" >
                <Radio v-for="item in healthList" :label="item" :key="item"  ></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="16" offset="2">
            <FormItem label="主要结果分析：" prop="zyjgfx" class="error-tip">
              <Input v-model="CoverInfo.zyjgfx" placeholder="请输入" ></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="10" offset="2">
            <FormItem label="单位审核状态：" prop="dw_CheckState" class="error-tip">
              <RadioGroup v-model="CoverInfo.dw_CheckState">
                <Radio v-for="item in CheckStateList" :label="item" :key="item" :disabled="IsDisabled"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="单位审核人：" prop="dw_Checker" class="error-tip">
              <Input v-model="CoverInfo.dw_Checker" placeholder="请输入单位审核人姓名" :disabled="IsDisabled"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="2">
            <FormItem label="单位审核结果：" prop="dw_CheckResult" class="error-tip">
              <RadioGroup v-model="CoverInfo.dw_CheckResult">
                <Radio v-for="item in CheckResultList" :label="item" :key="item" :disabled="IsDisabled"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="CoverInfo.dw_CheckResult === '审核不通过'">
          <Col span="16" offset="2">
            <FormItem label="不通过理由：" prop="dw_Reason" class="error-tip; TextColor" >
              <Input v-model="CoverInfo.dw_Reason" placeholder="请输入审核不通过理由" :disabled="IsDisabled"></Input>
            </FormItem>
          </Col>
        </Row>

      </Form>
      <float_bar>
        <div style="text-align: center">
          <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
          <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>
          <router-link :to="{path: `/survey/base_survey`}">
            <Button type="primary" style="margin-right: 30px">返回</Button>
          </router-link>
        </div>
      </float_bar>

      <Modal
        v-model="showModal"
        title="提醒"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>请填写古树编号，并填写保存封面信息</p>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Float_bar from "_c/FloatBar/float_bar";
import {AddCoverPage, getBasic, postTjxmRecord, queryTjxmRecord, updateCover} from "@/api/table";
import {dateToString} from "@/libs/tools";
import {PathToList} from "@/view/survey/options";
import UserMixin from "@/mixin/UserMixin";
export default {
  name: "CoverUpdatePage",
  components: {Float_bar},
  mixins: [UserMixin],
  data(){
    return{
      is_add: false, //判断当前cover是否有
      nowDate: new Date(),
      timeIndex: 0,
      timeLineList: PathToList,

      CheckStateList:['已审核','未审核'],
      CheckResultList:['审核通过','审核不通过'],
      healthList: ['基础','详细'],
      showModal: false,

      tree_code: this.$route.params.tree_code,

      res1:undefined,
      res2: undefined,
      res3: undefined,

      IsDisabled: false,

      CoverInfo:{
        tree_code: '',
        CompanyA:'',
        CompanyB:'',
        checker:'',

        investigator: '',
        accessStartTime:'',//评估开始时间
        accessEndTime: null, //评估结束时间

        recorder: '', //报告编制人
        signedTime: null, //报告签发日期

        zyjgfx:'', //主要结果分析


        healthCondition:'',//健康评估状况


        dw_CheckState:'',
        dw_CheckResult:'',
        dw_Checker: '',
        dw_Reason: '',
        dw_CheckTime: null,

        dc_status:'未完成',
      },
      tjxm_record:{
        tree_code: '',
        type:'封面',
        type_yw:'Cover',
        t_id:0,
        investigator: '',
        time:'',
        status: '已完成'
      },

      ruleValidate:{

      }

    }
  },
  methods:{
    NextPage () {
      if(this.CoverInfo.tree_code){
        this.$router.push({ path: `/survey/update/BasicInformation/${this.CoverInfo.tree_code}` })
      }else {
        this.showModal = true
      }
    },
    Show (item) {
      this.$router.push({ path: item.path_to + `${this.tree_code}` })
    },
    changeActive (index) {
      this.timeIndex = index;
    },
    async add(){
      this.CoverInfo.signedTime = null
      await AddCoverPage(this.CoverInfo).then(res1=>{
        if(res1.data.code === 200){
          this.res1 = res1
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
      if(this.res1.data.code === 200){
        await getBasic({tree_code:this.CoverInfo.tree_code}).then(res2=>{
          if(res2.data.code === 200){
            this.res2 = res2
          }
        }).catch(error=>{
          this.$Message.error('失败')
        })
      }
      if(this.res2.data.code === 200){
        this.tjxm_record.t_id = this.res2.data.basic.id
        await postTjxmRecord(this.tjxm_record).then(res3=>{
          if(res3.data.code === 200){
            this.$Message.success('成功')
          }else {
            this.$Message.error('失败')
          }
        }).catch(error=>{
          this.$Message.error('失败')
        })
      }
    },
    async ShenHe(){
      this.CoverInfo.dw_CheckTime = dateToString(this.nowDate,"yyyy-MM-dd hh:mm:ss")
      let check = {
        dw_CheckState: this.CoverInfo.dw_CheckState,
        dw_CheckTime: this.CoverInfo.dw_CheckTime,
        dw_CheckResult: this.CoverInfo.dw_CheckResult,
        dw_Reason: this.CoverInfo.dw_Reason,
        dw_Checker: this.CoverInfo.dw_Checker,

        CompanyA: this.CoverInfo.CompanyA,
        CompanyB: this.CoverInfo.CompanyB,
        checker: this.CoverInfo.checker,
        investigator: this.CoverInfo.investigator,
        accessStartTime: this.CoverInfo.accessStartTime,//评估开始时间
        accessEndTime: this.CoverInfo.accessEndTime, //评估结束时间
        recorder: this.CoverInfo.recorder, //报告编制人
        signedTime: this.CoverInfo.signedTime, //报告签发日期
        zyjgfx: this.CoverInfo.zyjgfx, //主要结果分析
        healthCondition: this.CoverInfo.healthCondition,//健康评估状况

      }

      updateCover(this.tree_code, check).then(res=>{
        if(res.data.code === 200){
          this.$Message.success('成功')
        }else {
          this.$Message.error('失败')
        }
      })
    },

    Submit(){
      let timelist = ['accessStartTime','accessEndTime','signedTime']
      for (let i = 0; i < timelist.length; i++) {
        if(this.CoverInfo[timelist[i]]){ //判断是time是否为null或''
          //time不为空
          this.CoverInfo[timelist[i]] = dateToString(this.CoverInfo[timelist[i]],"yyyy-MM-dd hh:mm:ss")
        }else {
          //time为空
          this.CoverInfo[timelist[i]] = null
        }
      }
      this.$refs.cover_form.validate((valid) => {
        if(valid){
          this.tjxm_record.tree_code = this.CoverInfo.tree_code
          if(this.is_add){ //有，则只需更新
            this.ShenHe()
          }else { //没有，需要加入
            this.add()
          }
        }
      })
    },
    ok(){
      this.showModal = false
    },
    cancel(){
      this.showModal = false
    },
    async initData(){
      await  queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'Cover' }).then(record => {
        if (record.data.total !== 0) {
          this.tjxm_record = record.data.tjxm_records[0]
          this.is_add = true
        } else {
          this.is_add = false
        }
      })
      if(this.tjxm_record.tree_code){
        console.log('tjxm_record', this.tjxm_record)
        await getBasic({'tree_code':this.tree_code}).then(res=>{
          if(res.data.code === 200){
            this.CoverInfo = res.data.basic
          }
        })
      }

    },

    initDisabledValue(){
      if(this.access.includes('单位管理员')||this.access.includes('超级管理员')){
        this.IsDisabled = false
      }else {
        this.IsDisabled = true
      }
    }
  },
  created() {
    this.initData()
    this.initDisabledValue()
  }
}
</script>

<style scoped>
.TextColor >>> .ivu-input[disabled], fieldset[disabled] .ivu-input {
  color: grey !important;
}
/*margin-bottom控制formItem上下间隔距离
  width控制formItem输入框的长度*/
.ivu-form-item {
  margin-bottom: 15px;
  width: 80%;
}

.error-tip >>> div.ivu-form-item-error-tip {
  padding-top: 0.5mm!important;
}
.ivu-date-picker {
  width: 100%;
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
