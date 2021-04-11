<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">病虫害情况分析</h2>
    <Form :label-width="198" label-position="right"  ref="Diseases_form" :model="Diseases" :rules="ruleValidate" inline>
      <h4>树干基部：</h4>
      <Row>
        <Col offset="2">
          <FormItem prop="bmoth_status">
                <span slot="label" style="font-size: 13px">
                  <Tooltip placement="top" max-width="200" >
                <div slot="content">记录树体活组织中虫害类型、虫孔数量、虫孔直径，并计算最大受害部位宽度与树干周长比，&le;1/3判定为”轻度“，1/3-1/2 为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>蛀干害虫</span>
            <RadioGroup v-model="Diseases.bmoth_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.bmoth_status !== '无'">
        <Col offset="2">
          <FormItem prop="bmoth_name">
            <span slot="label" style="font-size: 13px">蛀干害虫名称</span>
            <Input v-model="Diseases.bmoth_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="bdisease_status">
            <span slot="label" style="font-size: 13px">
               <Tooltip placement="top" max-width="200" >
                <div slot="content">记录病害名称，并计算最大受害部位宽度与树干周长比，&le;1/3判定为”轻度“，1/3-1/2 为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>病害</span>
            <RadioGroup v-model="Diseases.bdisease_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.bdisease_status !== '无'">
        <Col offset="2">
          <FormItem prop="bdisease_name">
            <span slot="label" style="font-size: 13px">病害名称</span>
            <Input v-model="Diseases.bdisease_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="base_pic">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_base" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
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
      <Divider />
      <h4>树干：</h4>
      <Row>
        <Col offset="2">
          <FormItem prop="tmoth_status">
            <span slot="label" style="font-size: 13px">蛀干害虫</span>
            <RadioGroup v-model="Diseases.tmoth_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.tmoth_status !== '无'">
        <Col offset="2">
          <FormItem prop="tmoth_name">
            <span slot="label" style="font-size: 13px">蛀干害虫名称</span>
            <Input v-model="Diseases.tmoth_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="tdisease_status">
            <span slot="label" style="font-size: 13px">病害</span>
            <RadioGroup v-model="Diseases.tdisease_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.tdisease_status !== '无'">
        <Col offset="2">
          <FormItem prop="tdisease_name">
            <span slot="label" style="font-size: 13px">病害名称</span>
            <Input v-model="Diseases.tdisease_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="trunk_pic">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_trunk" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
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
      <Divider />
      <h4>构成骨架大枝：</h4>
      <Row>
        <Col offset="2">
          <FormItem prop="smoth_status">
            <span slot="label" style="font-size: 13px">蛀干害虫</span>
            <RadioGroup v-model="Diseases.smoth_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.smoth_status !== '无'">
        <Col offset="2">
          <FormItem prop="smoth_name">
            <span slot="label" style="font-size: 13px">蛀干害虫名称</span>
            <Input v-model="Diseases.smoth_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="sdisease_status">
            <span slot="label" style="font-size: 13px">病害</span>
            <RadioGroup v-model="Diseases.sdisease_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.sdisease_status !== '无'">
        <Col offset="2">
          <FormItem prop="sdisease_name">
            <span slot="label" style="font-size: 13px">病害名称</span>
            <Input v-model="Diseases.sdisease_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="ske_pic">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_ske" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
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

      <Divider />
      <h4>叶片：</h4>
      <Row>
        <Col offset="2">
          <FormItem prop="blade_status">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content"></div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>病害</span>
            <RadioGroup v-model="Diseases.blade_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.blade_status !== '无'">
        <Col offset="2">
          <FormItem prop="blade_name">
            <span slot="label" style="font-size: 13px">病害名称</span>
            <Input v-model="Diseases.blade_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col offset="2">
          <FormItem prop="blade_pic">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_blade" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
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

      <Divider />
      <h4>枝梢：</h4>
      <Row>
        <Col offset="2">
          <FormItem prop="branch_status">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content"></div>
              <Icon type="md-alert" size="15" color="#808695"/>
            </Tooltip>蛀干害虫</span>
            <RadioGroup v-model="Diseases.branch_status">
              <Radio v-for="item in OptionList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row v-if="Diseases.branch_status !== '无'">
        <Col offset="2">
          <FormItem prop="branch_name">
            <span slot="label" style="font-size: 13px">蛀干害虫名称</span>
            <Input v-model="Diseases.branch_name" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="branch_pic">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_branch" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
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
      <Divider />
      <h4>评价：</h4>
      <Row>
        <Col offset="2" span="18">
          <FormItem prop="total_eval">
            <span slot="label" style="font-size: 13px">总体评价</span>
            <Input v-model="Diseases.total_eval" type="textarea" :autosize="true" style="width: 350px"
                   placeholder="（评价树体遭受病虫害侵袭程度，给出管护建议，仅发生在腐朽组织或部位的虫害需要在本部分说明）" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>

    </Form>
    <div style="text-align: center">
      <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
      <Button @click="PreviousPage" type="primary">上一页</Button>
    </div>
    <Button @click="Tree">古树编号</Button>
  </Card>
</div>
</template>

<script>
import { damageList } from "@/view/survey/options";
import {dateToString} from "@/libs/tools";

export default {
  name: "Diseases",
  data () {
    return {
      tree_code: Number(this.$route.params.tree_code),
      OptionList: damageList,

      showImageUrl: '',
      visible: false,

      i_base: 0,
      PicUrlList_base: [],

      i_trunk: 0,
      PicUrlList_trunk: [],

      i_ske: 0,
      PicUrlList_ske: [],

      i_blade: 0,
      PicUrlList_blade: [],

      i_branch: 0,
      PicUrlList_branch: [],

      Diseases: {
        bmoth_status: '无', // 树干基部-蛀干害虫情况
        bmoth_name: '', // 树干基部-害虫名称
        bdisease_status: '无', // 树干基部-病害情况
        bdisease_name: '', // 树干基部-病害名称
        base_pic: '', // 树干基部-特征照片

        tmoth_status: '无', // 树干-蛀干害虫情况
        tmoth_name: '', // 树干-蛀干害虫名称
        tdisease_status: '无', // 树干-病害情况
        tdisease_name: '', // 树干-病害名称
        trunk_pic: '', // 树干-特征照片

        smoth_status: '无', // 构成骨架大枝-蛀干害虫情况
        smoth_name: '', // 构成骨架大枝-蛀干害虫名称
        sdisease_status: '无', // 构成骨架大枝-病害情况
        sdisease_name: '', // 构成骨架大枝-病害名称
        ske_pic: '', // 构成骨架大枝-特征照片

        blade_status: '无', // 叶片-病害情况
        blade_name: '', // 叶片-病害名称
        blade_pic: '', // 叶片-特征照片

        branch_status: '无', // 枝梢-蛀干害虫情况
        branch_name: '', // 枝梢-蛀干害虫名称
        branch_pic: '', // 枝梢-特征照片

        total_eval: '', // 总体评价
        update_time: ''
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
  methods: {

    PreviousPage () {
      this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
    },
    Tree () {
      console.log(11, this.tree_code)
      console.log(typeof (this.tree_code))
    },
    Save: function () {
      // this.changeLoading()
      this.$refs.Diseases_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Diseases.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          console.error(this.Diseases)
          this.$Message.success('保存成功')
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    // 特征照片base
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
    handleRemoveList_base (index) {
      // 删除
      this.PicUrlList_base.splice(index, 1)
    },
    handleSuccessList_base: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_base.push(res.path)
        this.i_base++
      }
    },
    // 特征照片trunk
    handleRemoveList_trunk (index) {
      // 删除
      this.PicUrlList_trunk.splice(index, 1)
    },
    handleSuccessList_trunk: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_trunk.push(res.path)
        this.i_trunk++
      }
    },

    // 特征照片ske
    handleRemoveList_ske (index) {
      // 删除
      this.PicUrlList_ske.splice(index, 1)
    },
    handleSuccessList_ske: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_ske.push(res.path)
        this.i_ske++
      }
    },

    // 特征照片blade
    handleRemoveList_blade (index) {
      // 删除
      this.PicUrlList_blade.splice(index, 1)
    },
    handleSuccessList_blade: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_blade.push(res.path)
        this.i_blade++
      }
    },

    // 特征照片branch
    handleRemoveList_branch (index) {
      // 删除
      this.PicUrlList_branch.splice(index, 1)
    },
    handleSuccessList_branch: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_branch.push(res.path)
        this.i_branch++
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
