<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">已采取复壮保护措施情况与分析</h2>
      <Form :label-width="198" label-position="right"  ref="protect_form" :model="Protect" :rules="ruleValidate" inline>
        <Row>
          <Col offset="2" span="16">
            <FormItem prop="protect">
              <span slot="label" style="font-size: 13px">地上保护措施</span>
              <CheckboxGroup v-model="Protect.protect">
                <Checkbox v-for="item in ProtectList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="2" span="16">
            <FormItem prop="soil_improve">
              <span slot="label" style="font-size: 13px">地下土壤改良措施</span>
              <CheckboxGroup v-model="Protect.soil_improve">
                <Checkbox v-for="item in SoilImproveList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem prop="is_block">
              <span slot="label" style="font-size: 13px">是否封堵树洞</span>
              <RadioGroup v-model="Protect.is_block">
                <Radio v-for="item in IsBlockList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem prop="is_support">
              <span slot="label" style="font-size: 13px">有无支撑</span>
              <RadioGroup v-model="Protect.is_support">
                <Radio v-for="item in IsSupportList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem prop="has_ditch">
              <span slot="label" style="font-size: 13px">有无复壮沟</span>
              <RadioGroup v-model="Protect.has_ditch">
                <Radio v-for="item in HasDitchList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2" span="18">
            <FormItem prop="protect_eval">
              <span slot="label" style="font-size: 13px">现有复壮保护措施评价</span>
              <Input v-model="Protect.protect_eval" type="textarea" :autosize="true" style="width: 350px"
                     placeholder="（对现有复壮措施合理性给出评价和改进建议）" class="TextStyle"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="2">
            <FormItem prop="pic">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">反映现有复壮保护措施的典型照片3-9张</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>特征照片</span>
              <div class="demo-upload-list" v-for="(item,index) in PicUrlList" :key="index">
                <img :src="'/api'+item"  />
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
                action="/api/upload"
                style="display: inline-block;width:70px;">
                <div style="width: 70px;height:70px;line-height: 70px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="图片预览" v-model="visible">
                <img :src="showImageUrl" v-if="visible" style="width: 100%" />
              </Modal>
            </FormItem>

          </Col>
        </Row>
        <div v-if="Protect.is_block === 1">
        <Divider />
        <h4>封堵树洞：</h4>
          <Row>
            <Col offset="2">
              <FormItem prop="fit_status"  :key="Protect.fit_status" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" style="font-size: 13px">与树体贴合情况</span>
                <RadioGroup v-model="Protect.fit_status">
                  <Radio v-for="item in FitStatusList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2">
              <FormItem prop="drain_hole" :key="Protect.drain_hole" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" style="font-size: 13px">排水孔和排湿孔</span>
                <RadioGroup v-model="Protect.drain_hole">
                  <Radio v-for="item in DrainHolesList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="tech_level">
                <span slot="label" style="font-size: 13px">工艺水平</span>
                <RadioGroup v-model="Protect.tech_level">
                  <Radio v-for="item in TechLevelList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="outer">
                <span slot="label" style="font-size: 13px">外层处理</span>
                <RadioGroup v-model="Protect.outer">
                  <Radio v-for="item in OuterList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div v-else>
          <Divider />
          <h4>未封堵树洞：</h4>
          <Row>
            <Col offset="2">
              <FormItem prop="clean_status" :key="Protect.clean_status" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" style="font-size: 13px">内壁清理程度</span>
                <RadioGroup v-model="Protect.clean_status">
                  <Radio v-for="item in CleanStatusList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2">
              <FormItem prop="antiseptic" >
                <span slot="label" style="font-size: 13px">内壁防腐处理</span>
                <RadioGroup v-model="Protect.antiseptic">
                  <Radio v-for="item in AntisepticList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div v-if="Protect.is_support === 1">
          <Divider />
          <h4>支撑情况：</h4>
          <Row>
            <Col offset="2" span="6">
              <FormItem prop="hard_support" :key="Protect.hard_support" :rules="[{required: true,  message: '请输入' }]">
                <span slot="label" style="font-size: 13px">硬支撑</span>
                <InputNumber v-model="Protect.hard_support"
                             :formatter="value => `${value}  处`"
                             :parser="value => value.replace('  处', '')"></InputNumber>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem prop="protaging" :key="Protect.protaging" :rules="[{required: true,  message: '请输入' }]">
                <span slot="label" style="font-size: 13px">拉纤</span>
                <InputNumber v-model="Protect.protaging"
                             :formatter="value => `${value}  处`"
                             :parser="value => value.replace('  处', '')"></InputNumber>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2">
              <FormItem prop="steady">
                <span slot="label" style="font-size: 13px">支撑稳固情况</span>
                <RadioGroup v-model="Protect.steady">
                  <Radio v-for="item in SteadyList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="support_type" :key="Protect.support_type" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" style="font-size: 13px">支撑类型</span>
                <RadioGroup v-model="Protect.support_type">
                  <Radio v-for="item in SupportTypeList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="support_isrea">
                <span slot="label" style="font-size: 13px">支撑部位</span>
                <RadioGroup v-model="Protect.support_isrea">
                  <Radio v-for="item in SupportIsreaList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="hoop_status" :key="Protect.hoop_status" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" style="font-size: 13px">抱箍</span>
                <RadioGroup v-model="Protect.hoop_status">
                  <Radio v-for="item in HoopStatusList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2">
              <FormItem prop="rubber_is">
                <span slot="label" style="font-size: 13px">支撑工艺：橡胶垫设置</span>
                <RadioGroup v-model="Protect.rubber_is">
                  <Radio v-for="item in RubberIsList" :label="item.value" :key="item.value">{{item.label}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="hoop_is">
                <span slot="label" style="font-size: 13px">支撑工艺：抱箍设置</span>
                <RadioGroup v-model="Protect.hoop_is">
                  <Radio v-for="item in HoopIsList" :label="item.value" :key="item.value">{{item.label}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div v-if="Protect.has_ditch === 1">
          <Divider />
          <h4>复壮沟：</h4>
          <Row>
            <Col offset="2">
              <FormItem prop="ditch_type" :key="Protect.ditch_type" :rules="[{required: true, trigger: 'change', message: '请选择' }]">
                <span slot="label" style="font-size: 13px">类型</span>
                <RadioGroup v-model="Protect.ditch_type">
                  <Radio v-for="item in DitchTypeList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2" span="6">
              <FormItem prop="ditch_num" :key="Protect.ditch_num" :rules="[{required: true,  message: '请输入' }]">
                <span slot="label" style="font-size: 13px">数量</span>
                <InputNumber v-model="Protect.ditch_num"
                             :formatter="value => `${value}  处`"
                             :parser="value => value.replace('  处', '')"></InputNumber>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2" span="6">
              <FormItem prop="ditch_width">
                <span slot="label" style="font-size: 13px">宽度</span>
                <InputNumber v-model="Protect.ditch_width"
                             :step="0.01"
                             :formatter="value => `${value}  m`"
                             :parser="value => value.replace('  m', '')"></InputNumber>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem prop="ditch_length">
                <span slot="label" style="font-size: 13px">总长度</span>
                <InputNumber v-model="Protect.ditch_length"
                             :step="0.01"
                             :formatter="value => `${value}  m`"
                             :parser="value => value.replace('  m', '')"></InputNumber>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2" span="6">
              <FormItem prop="pipe_num" :key="Protect.pipe_num" :rules="[{required: true, message: '请输入' }]">
                <span slot="label" style="font-size: 13px">通气管</span>
                <InputNumber v-model="Protect.pipe_num"
                             :formatter="value => `${value}  处`"
                             :parser="value => value.replace('  处', '')"></InputNumber>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2">
              <FormItem prop="matrix_constitute">
                <span slot="label" style="font-size: 13px">基质组成</span>
                <RadioGroup v-model="Protect.matrix_constitute">
                  <Radio v-for="item in MatrixConstituteList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="position_is">
                <span slot="label" style="font-size: 13px">位置设置</span>
                <RadioGroup v-model="Protect.position_is">
                  <Radio v-for="item in PositionIsList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col offset="2" span="6">
              <FormItem prop="well_num" :key="Protect.well_num" :rules="[{required: true,  message: '请输入' }]">
                <span slot="label" style="font-size: 13px">渗井</span>
                <InputNumber v-model="Protect.well_num"
                             :formatter="value => `${value}  处`"
                             :parser="value => value.replace('  处', '')"></InputNumber>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset="2">
              <FormItem prop="capillary_roots">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">根据探根情况判断</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>毛细根生长情况</span>
                <RadioGroup v-model="Protect.capillary_roots">
                  <Radio v-for="item in CapillaryRootsList" :label="item.value" :key="item.value"></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>

      <div style="text-align: center">
        <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
        <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
        <Button @click="PreviousPage" type="primary">上一页</Button>
      </div>
      <Button @click="Tree">古树编号</Button>
    </Card>
  </div>
</template>

<script>
import { protectList, soil_improveList, is_blockList, fit_statusList, drain_holeList, tech_levelList,
  outerList, clean_statusList, antisepticList, is_supportList, steadyList, support_typeList,
  support_isreaList, hoop_statusList, rubber_isList, hoop_isList, has_ditchList,
  ditch_typeList, matrix_constituteList, position_isList, capillary_rootsList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
export default {
  name: "Protect",
  data () {
    return {
      tree_code: Number(this.$route.params.tree_code),
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
        pic: '', // 特征照片
        update_time: ''
      },
      ruleValidate: {
        protect: [{ required: true, message: '请选择' }],
        soil_improve: [{ required: true, message: '请选择' }],
        is_block: [{ required: true, message: '请选择' }],
        is_support: [{ required: true, message: '请选择' }],
        has_ditch: [{ required: true, message: '请选择' }],
      }
    }
  },
  methods: {
    NextPage () {
      this.$router.push({ path: `/survey/damage/${this.tree_code}` })
    },
    PreviousPage () {
      this.$router.push({ path: `/survey/GrowthVigor/${this.tree_code}` })
    },
    Tree () {
      console.log(11, this.tree_code)
      console.log(typeof (this.tree_code))
    },
    Save: function () {
      // this.changeLoading()
      this.$refs.protect_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Protect.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          console.error(this.Protect)
          this.$Message.success('保存成功')
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    // 特征照片
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    handleView (imageUrl) {
      this.showImageUrl = '/api' + imageUrl
      this.visible = true
    },
    handleRemoveList (index) {
      // 删除
      this.PicUrlList.splice(index, 1)
    },
    handleSuccessList: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList.push(res.path)
        this.i++
      }
    }
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
</style>
