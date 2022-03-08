<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">封面信息</h2>
      <Form :label-width="120" label-position="right" ref="cover_form" :model="CoverInfo" :rules="ruleValidate" inline>
        <Row>
          <Col span="10" offset="2">
            <FormItem label="古树编号：" prop="tree_code" class="error-tip">
              <Input v-model="CoverInfo.tree_code" placeholder="请输入古树编号" ></Input>
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
              <RadioGroup v-model="CoverInfo.healthCondition">
                <Radio v-for="item in healthList" :label="item" :key="item"></Radio>
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
                <Radio v-for="item in CheckStateList" :label="item" :key="item"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="单位审核人：" prop="dw_Checker" class="error-tip">
              <Input v-model="CoverInfo.dw_Checker" placeholder="请输入单位审核人姓名" ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="2">
            <FormItem label="单位审核结果：" prop="dw_CheckResult" class="error-tip">
              <RadioGroup v-model="CoverInfo.dw_CheckResult">
                <Radio v-for="item in CheckResultList" :label="item" :key="item"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      <Row v-if="CoverInfo.dw_CheckResult === '审核不通过'">
        <Col span="16" offset="2">
          <FormItem label="不通过理由：" prop="dw_Reason" class="error-tip">
            <Input v-model="CoverInfo.dw_Reason" placeholder="请输入审核不通过理由"></Input>
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
import {AddCoverPage, getBasic, getOneTreeBaseInfo, postTjxmRecord} from "@/api/table";
import {dateToString} from "@/libs/tools";
import UserMixin from "@/mixin/UserMixin";
export default {
  name: "CoverPage",
  components: {Float_bar},
  mixins:[UserMixin],
  data(){
    return{
      CheckStateList:['已审核','未审核'],
      CheckResultList:['审核通过','审核不通过'],
      healthList: ['基本','详细'],
      showModal: false,

      res1:undefined,
      res2: undefined,
      res3: undefined,

      CoverInfo:{
        tree_code: '',
        CompanyA:'',
        CompanyB:'',
        checker:'',

        investigator: '',
        accessStartTime:null,//评估开始时间
        accessEndTime: null, //评估结束时间

        recorder: '', //报告编制人
        signedTime: null, //报告签发日期

        zyjgfx:'', //主要结果分析


        healthCondition:'',//健康评估状况

        admin_CheckState:'',
        admin_CheckResult:'',
        admin_Checker: '',
        admin_Reason: '',
        admin_CheckTime: null,


        dw_CheckState:'',
        dw_CheckResult:'',
        dw_Checker: '',
        dw_Reason: '',
        dw_CheckTime: null,
        dc_username: '',

        dc_status:'未完成',
      },
      tjxm_record:{
        tree_code: '',
        type:'封面',
        type_yw:'Cover',
        t_id:0,
        investigator: '',
        status: '已完成',
        dc_username: '',
      },

      ruleValidate:{
        tree_code: [{ required: true, trigger:'blur',message: '请输入古树编号' }],
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
    addcover(){
      AddCoverPage(this.CoverInfo).then((res1=>{
        if(res1.data.code===200){
         return res1
        }
      }))
    },
    getbasic(){
      getBasic({tree_code:this.CoverInfo.tree_code}).then(res2=>{
        return res2
      })
    },

    async add(){
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


    Submit(){
      console.log(this.CoverInfo)
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

      this.CoverInfo.dc_username = this.userInfo.userInfo.username
      this.tjxm_record.dc_username = this.userInfo.userInfo.username
      this.$refs.cover_form.validate((valid) => {
        if(valid){
          console.log('2',this.CoverInfo)
          this.tjxm_record.tree_code = this.CoverInfo.tree_code
          this.add()
        }
      })
    },
    ok(){
      this.showModal = false
    },
    cancel(){
      this.showModal = false
    }
  }
}
</script>

<style scoped>
/*margin-bottom控制formItem上下间隔距离
  width控制formItem输入框的长度*/
.ivu-form-item {
  margin-bottom: 15px;
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
</style>
