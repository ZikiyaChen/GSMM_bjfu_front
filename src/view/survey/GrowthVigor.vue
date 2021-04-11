<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">生长势分析</h2>
      <Form :label-width="198" label-position="right"  ref="GrowthVigor_form" :model="GrowthVigor" :rules="ruleValidate" inline>
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
              <Input v-model="value">{{ (this.GrowthVigor.Fm - this.GrowthVigor.Fo) / this.GrowthVigor.Fm}}</Input>
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
      </Form>
      <div style="text-align: center">
        <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>
        <Button @click="PreviousPage" type="primary">上一页</Button>
      </div>
      <Button @click="Tree">古树编号</Button>
    </Card>
  </div>
</template>

<script>
import { shoot_typeList, shootList1, shootList2, normal_blade_rateList, blade_persistentList,
  growth_vigorList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";

export default {
  name: "GrowthVigor",
  data () {
    return {
      tree_code: Number(this.$route.params.tree_code),
      value: 0,
      PicUrlList: [],
      showImageUrl: '',
      visible: false,
      i: 0,

      ShootTypeList: shoot_typeList,
      ShootList1: shootList1,
      ShootList2: shootList2,
      NormalBladeRateList: normal_blade_rateList,
      BladePersistentList: blade_persistentList,
      GrowthVigorList: growth_vigorList,

      GrowthVigor: {
        shoot_type: '', // 新梢生长量类型
        shoot: '', // 新梢生长量，选择类型后再选择
        normal_blade_rate: '', // 正常叶片率
        blade_persistent: '', // 叶片宿存（常绿树）
        growth_vigor: '', // 生长势总体评价
        chlorophyll: '', // 叶片叶绿素含量
        Fo: 0,
        Fm: 0,
        update_time: ''
      },

      ruleValidate: {
        normal_blade_rate: [{ required: true, trigger: 'change', message: '请选择' }],
        blade_persistent: [{ required: true, trigger: 'change', message: '请选择' }],
        growth_vigor: [{ required: true, trigger: 'change', message: '请选择' }],
      }
    }
  },
  methods: {
    NextPage () {
      this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
    },
    PreviousPage () {
      this.$router.push({ path: `/survey/environment/${this.tree_code}` })
    },
    Tree () {
      console.log(11, this.tree_code)
      console.log(typeof (this.tree_code))
    },
    Save: function () {
      // this.changeLoading()
      this.$refs.GrowthVigor_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.GrowthVigor.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          console.error(this.GrowthVigor)
          this.$Message.success('保存成功')
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    JiSuan () {
      this.value = (this.GrowthVigor.Fm - this.GrowthVigor.Fo) / this.GrowthVigor.Fm
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
    },
  }
}
</script>

<style scoped>
.ivu-radio-wrapper {
  margin-right: 20px;
}
</style>
