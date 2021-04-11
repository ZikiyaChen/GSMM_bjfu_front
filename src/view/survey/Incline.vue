<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">树体倾斜、空腐情况检测</h2>
    <Form :label-width="198" label-position="right"  ref="Incline_form" :model="Incline" :rules="ruleValidate" inline>
      <Row>
        <Col offset="2">
          <FormItem prop="base_loose">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">用力推树干，若树干根基部出现晃动现象，则判断为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>树基松动</span>
            <RadioGroup v-model="Incline.base_loose">
              <Radio v-for="item in BaseLooseList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic1">
            <span slot="label" style="font-size: 13px">树基松动特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList1" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_1(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_1"
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

      <Row>
        <Col offset="2">
          <FormItem prop="root_rot">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">用钢棒斜向下45&#176;戳探树干根基部一周至少4个点，若可深入其表层或心材，测量钢棒插入的长度，&le;5cm判定为”轻度“，5-20cm为”中度“，>20cm为”重度“，否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>根部腐朽</span>
            <RadioGroup v-model="Incline.root_rot">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="pic2">
            <span slot="label" style="font-size: 13px">根部腐朽特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList2" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_2(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_2"
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

      <Row>
        <Col offset="2">
          <FormItem prop="root_bare">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">根部裸露或隆起时，则测量裸露根系占树埯面积的比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；若超出树埯，则判定为”重度“；否则记为”无“；无树埯时，记录裸露总长度。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>根部裸露</span>
            <RadioGroup v-model="Incline.root_bare">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Incline.root_bare === '无'">
        <Col offset="2">
          <FormItem prop="bare_length">
            <span slot="label" style="font-size: 13px">根部裸露总长度</span>
            <InputNumber v-model="Incline.bare_length"
                         :step="0.01"
                         :formatter="value => `${value}  cm`"
                         :parser="value => value.replace('  cm', '')"></InputNumber>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic3">
            <span slot="label" style="font-size: 13px">根部裸露特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList3" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_3(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_3"
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

      <Row>
        <Col offset="2">
          <FormItem prop="has_absound">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">用木槌敲击，若有异常音，记为”有“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>主干音异常</span>
            <RadioGroup v-model="Incline.has_absound">
              <Radio v-for="item in HasAbsoundList" :label="item.value" :key="item.value">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="trunk_inclined">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">测量倾斜程度，&le;5为”轻度“，5&deg;-15&deg;为”中度“，>15&deg;为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>主干倾斜</span>
            <RadioGroup v-model="Incline.trunk_inclined">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="pic4">
            <span slot="label" style="font-size: 13px">主干倾斜特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList4" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_4(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_4"
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

      <Row>
        <Col offset="2">
          <FormItem prop="has_abbranch">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">观察树干分枝点部位处，仅存在龟裂或卷皮现象为”轻度“，出现腐烂现象但未形成明显空洞为”中度“，可见明显空洞为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>分枝点部位异常</span>
            <RadioGroup v-model="Incline.has_abbranch">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="pic5">
            <span slot="label" style="font-size: 13px">分枝点部位异常特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList5" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_5(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_5"
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

      <Row>
        <Col offset="2">
          <FormItem prop="lopsided">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">偏冠度&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>偏冠</span>
            <RadioGroup v-model="Incline.lopsided">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic6">
            <span slot="label" style="font-size: 13px">偏冠特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList6" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_6(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_6"
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

      <Row>
        <Col offset="2">
          <FormItem prop="deadwood">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">枯枝率&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>枯枝</span>
            <RadioGroup v-model="Incline.deadwood">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic7">
            <span slot="label" style="font-size: 13px">枯枝特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList7" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_7(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_7"
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

      <Row>
        <Col offset="2">
          <FormItem prop="twig">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">1个判定为”轻度“，2或3个为”中度“，>3个为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>枝条整理留茬</span>
            <RadioGroup v-model="Incline.twig">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic8">
            <span slot="label" style="font-size: 13px">枝条整理留茬特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList8" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_8(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_8"
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
      <Row>
        <Col offset="2">
          <FormItem prop="empty_rot_rate">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">用应力波木材检测仪进行测定。百分数表示</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>主干空腐率</span>
            <InputNumber v-model="Incline.empty_rot_rate"
                         :step="0.01"
                         :formatter="value => `${value}  %`"
                         :parser="value => value.replace('  %', '')"></InputNumber>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2" span="18">
          <FormItem prop="qxkf_eval">
            <span slot="label" style="font-size: 13px">倾斜、空腐情况总体评价</span>
            <Input v-model="Incline.qxkf_eval" type="textarea" :autosize="true" style="width: 350px"
                   placeholder="（对安全风险和空腐程度进行整体评价，并给出管护建议）" class="TextStyle"></Input>
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
import { base_looseList, damageList, has_absoundList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";

export default {
  name: "Incline",
  data () {
    return {
      tree_code: Number(this.$route.params.tree_code),
      BaseLooseList: base_looseList,
      OptionList: damageList,
      HasAbsoundList: has_absoundList,

      showImageUrl: '',
      visible: false,

      i1: 0,
      PicUrlList1: [],
      i2: 0,
      PicUrlList2: [],
      i3: 0,
      PicUrlList3: [],
      i4: 0,
      PicUrlList4: [],
      i5: 0,
      PicUrlList5: [],
      i6: 0,
      PicUrlList6: [],
      i7: 0,
      PicUrlList7: [],
      i8: 0,
      PicUrlList8: [],

      Incline: {
        base_loose: '', // *树基松动结果
        pic_1: '', // *树基松动照片
        root_rot: '', // *根部腐朽结果
        pic_2: '', // *根部腐朽照片
        root_bare: '', // *根部裸露结果
        bare_length: 0, // *根部裸露总长度
        pic_3: '', // *根部裸露照片
        has_absound: 0, // *主干异常音
        trunk_inclined: '', // 主干倾斜结果
        pic_4: '', // 主干倾斜照片
        has_abbranch: '', // 分枝点部位异常结果
        pic_5: '', // 分枝点部位异常照片
        lopsided: '', // 偏冠结果
        pic_6: '', // 偏冠照片
        deadwood: '', // 枯枝结果
        pic_7: '', // 枯枝照片
        twig: '', // 枝条整理留茬结果
        pic_8: '', // 枝条整理留茬照片
        empty_rot_rate: 0, // 主干空腐率
        qxkf_eval: '', // 倾斜空腐情况评价
        update_time: ''
      },
      ruleValidate: {
        base_loose: [{ required: true, trigger: 'change', message: '请选择' }],
        root_rot: [{ required: true, trigger: 'change', message: '请选择' }],
        root_bare: [{ required: true, trigger: 'change', message: '请选择' }],
        has_absound: [{ required: true, message: '请选择' }],
        trunk_inclined: [{ required: true, trigger: 'change', message: '请选择' }],
        has_abbranch: [{ required: true, trigger: 'change', message: '请选择' }],
        lopsided: [{ required: true, trigger: 'change', message: '请选择' }],
        deadwood: [{ required: true, trigger: 'change', message: '请选择' }],
        twig: [{ required: true, trigger: 'change', message: '请选择' }],
      }
    }
  },
  methods: {
    NextPage () {
      this.$router.push({ path: `/survey/Diseases/${this.tree_code}` })
    },
    PreviousPage () {
      this.$router.push({ path: `/survey/damage/${this.tree_code}` })
    },
    Tree () {
      console.log(11, this.tree_code)
      console.log(typeof (this.tree_code))
    },
    Save: function () {
      // this.changeLoading()
      this.$refs.Incline_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Incline.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          console.error(this.Incline)
          this.$Message.success('保存成功')
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

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

    // 树基松动特征照片
    handleRemoveList_1 (index) {
      // 删除
      this.PicUrlList1.splice(index, 1)
    },
    handleSuccessList_1: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList1.push(res.path)
        this.i1++
      }
    },

    // 根部腐朽特征照片
    handleRemoveList_2 (index) {
      // 删除
      this.PicUrlList2.splice(index, 1)
    },
    handleSuccessList_2: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList2.push(res.path)
        this.i2++
      }
    },

    // 根部裸露特征照片
    handleRemoveList_3 (index) {
      // 删除
      this.PicUrlList3.splice(index, 1)
    },
    handleSuccessList_3: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList3.push(res.path)
        this.i3++
      }
    },

    // 主干倾斜特征照片
    handleRemoveList_4 (index) {
      // 删除
      this.PicUrlList4.splice(index, 1)
    },
    handleSuccessList_4: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList4.push(res.path)
        this.i4++
      }
    },

    // 分枝点部位异常特征照片
    handleRemoveList_5 (index) {
      // 删除
      this.PicUrlList5.splice(index, 1)
    },
    handleSuccessList_5: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList5.push(res.path)
        this.i5++
      }
    },

    // 偏冠特征照片
    handleRemoveList_6 (index) {
      // 删除
      this.PicUrlList6.splice(index, 1)
    },
    handleSuccessList_6: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList6.push(res.path)
        this.i6++
      }
    },

    // 枯枝特征照片
    handleRemoveList_7 (index) {
      // 删除
      this.PicUrlList7.splice(index, 1)
    },
    handleSuccessList_7: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList7.push(res.path)
        this.i7++
      }
    },

    // 枝条整理留茬特征照片
    handleRemoveList_8 (index) {
      // 删除
      this.PicUrlList8.splice(index, 1)
    },
    handleSuccessList_8: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList8.push(res.path)
        this.i8++
      }
    },
  }
}
</script>

<style scoped>
.TextStyle >>> textarea.ivu-input {
  font-size: 12px;
}
.ivu-radio-wrapper {
  margin-right: 20px;
}
</style>
