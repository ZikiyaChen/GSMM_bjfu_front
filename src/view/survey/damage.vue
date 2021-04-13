<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">树体损伤情况评估</h2>
    <Form :label-width="130" label-position="right"  ref="damage_form" :model="Damage" :rules="ruleValidate" inline>
      <h4>树干基部：</h4>
      <Row>
        <Col offset="2">
          <FormItem prop="base1">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">仅树皮有缺陷、腐朽等受害，计算最大受害部位与树干周长比，&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>树皮损伤比例</span>
            <RadioGroup v-model="Damage.base1">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_base1">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_base1" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_base1(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_base1"
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
          <FormItem prop="base2">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &#60; 开裂部位处树干半径，则判断为木质部开裂未达心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（未达心材）比例</span>
            <RadioGroup v-model="Damage.base2">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_base2">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_base2" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_base2(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_base2"
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
          <FormItem prop="base3">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &ge; 开裂部位处树干半径，则判断为木质部开裂达到心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（达到心材）比例</span>
            <RadioGroup v-model="Damage.base3">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_base3">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_base3" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_base3(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_base3"
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
          <FormItem prop="trunk1">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">仅树皮有缺陷、腐朽等受害，计算最大受害部位与树干周长比，&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>树皮损伤比例</span>
            <RadioGroup v-model="Damage.trunk1">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_trunk1">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_trunk1" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_trunk1(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_trunk1"
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
          <FormItem prop="trunk2">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &#60; 开裂部位处树干半径，则判断为木质部开裂未达心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（未达心材）比例</span>
            <RadioGroup v-model="Damage.trunk2">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_trunk2">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_trunk2" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_trunk2(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_trunk2"
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
          <FormItem prop="trunk3">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &ge; 开裂部位处树干半径，则判断为木质部开裂达到心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（达到心材）比例</span>
            <RadioGroup v-model="Damage.trunk3">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_trunk3">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_trunk3" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_trunk3(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_trunk3"
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
          <FormItem prop="skeleton1">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">仅树皮有缺陷、腐朽等受害，计算最大受害部位与树干周长比，&le;1/3为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>树皮损伤比例</span>
            <RadioGroup v-model="Damage.skeleton1">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_ske1">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_ske1" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_ske1(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_ske1"
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
          <FormItem prop="skeleton2">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &#60; 开裂部位处树干半径，则判断为木质部开裂未达心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（未达心材）比例</span>
            <RadioGroup v-model="Damage.skeleton2">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_ske2">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_ske2" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_ske2(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_ske2"
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
          <FormItem prop="skeleton3">
            <span slot="label" style="font-size: 13px">
              <Tooltip placement="top" max-width="200" >
                <div slot="content">若木质部产生开裂、缺损或其他受害，钢棒插入的长度 &ge; 开裂部位处树干半径，则判断为木质部开裂达到心材，测量计算最大受害部位与树干周长比，&le;1/3判定为”轻度“，1/3-1/2为”中度“，>1/2为”重度“；否则记为”无“。</div>
              <Icon type="md-alert" size="14" color="#808695"/>
            </Tooltip>木质部损伤（达到心材）比例</span>
            <RadioGroup v-model="Damage.skeleton3">
              <Radio v-for="item in DamageList" :label="item.value" :key="item.value"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col offset="2">
          <FormItem prop="pic_ske3">
            <span slot="label" style="font-size: 13px">特征照片</span>
            <div class="demo-upload-list" v-for="(item,index) in PicUrlList_ske3" :key="index">
              <img :src="'/api'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemoveList_ske3(index)"></Icon>
              </div>
            </div>
            <Upload
              :show-upload-list="false"
              name="filename"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccessList_ske3"
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
          <FormItem prop="protect_eval">
            <span slot="label" style="font-size: 13px">损伤情况评价</span>
            <Input v-model="Damage.damage_status" type="textarea" :autosize="true" style="width: 350px"
                   placeholder="（对整体损伤程度进行评价，并给出管护建议）" class="TextStyle"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div style="text-align: center">
      <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
      <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
      <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
      <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>
    </div>
    <Button @click="Tree">古树编号</Button>
  </Card>
</div>
</template>

<script>
import { damageList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import { AddFzbhAnalysis, AddStssAnalysis } from "@/api/table";

export default {
  name: "damage",
  data () {
    return {
      tree_code: Number(this.$route.params.tree_code),
      DamageList: damageList,

      showImageUrl: '',
      visible: false,

      PicUrlList_base1: [],
      PicUrlList_base2: [],
      PicUrlList_base3: [],

      i_base1: 0,
      i_base2: 0,
      i_base3: 0,

      PicUrlList_trunk1: [],
      PicUrlList_trunk2: [],
      PicUrlList_trunk3: [],

      i_trunk1: 0,
      i_trunk2: 0,
      i_trunk3: 0,

      PicUrlList_ske1: [],
      PicUrlList_ske2: [],
      PicUrlList_ske3: [],

      i_ske1: 0,
      i_ske2: 0,
      i_ske3: 0,

      Damage: {
        base1: '', // 树干基部-树皮损伤比例
        pic_base1: '', // (照片)树干基部-树皮损伤比例
        base2: '', // 树干基部-木质部损伤（未达心材）比例
        pic_base2: '', // (照片)树干基部-木质部损伤（未达心材）比例
        base3: '', // 树干基部-木质部损伤（达到心材）比例
        pic_base3: '', // (照片)树干基部-木质部损伤（达到心材）比例

        trunk1: '', // 树干-树皮损伤比例
        pic_trunk1: '', // (照片)树干-树皮损伤比例
        trunk2: '', // 树干-木质部（未达心材）比例
        pic_trunk2: '', // (照片)树干-木质部（未达心材）比例
        trunk3: '', // 树干-木质部（达到心材）损伤比例
        pic_trunk3: '', // (照片)树干-木质部（达到心材）损伤比例

        skeleton1: '', // 构成骨架大枝-树皮损伤比例
        pic_ske1: '', // (照片)构成骨架大枝-树皮损伤比例
        skeleton2: '', // 构成骨架大枝-木质部（未达心材）比例
        pic_ske2: '', // (照片)构成骨架大枝-木质部（未达心材）比例
        skeleton3: '', // 构成骨架大枝-木质部（达到心材）比例
        pic_ske3: '', // (照片)构成骨架大枝-木质部（达到心材）比例

        damage_status: '', // 损伤情况评价
        update_time: '',
        tree_code: ''
      },
      ruleValidate: {
        base1: [{ required: true, trigger: 'change', message: '请选择' }],
        base2: [{ required: true, trigger: 'change', message: '请选择' }],
        base3: [{ required: true, trigger: 'change', message: '请选择' }],

        trunk1: [{ required: true, trigger: 'change', message: '请选择' }],
        trunk2: [{ required: true, trigger: 'change', message: '请选择' }],
        trunk3: [{ required: true, trigger: 'change', message: '请选择' }],

        skeleton1: [{ required: true, trigger: 'change', message: '请选择' }],
        skeleton2: [{ required: true, trigger: 'change', message: '请选择' }],
        skeleton3: [{ required: true, trigger: 'change', message: '请选择' }],
      }
    }
  },
  methods: {
    NextPage () {
      this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
    },
    PreviousPage () {
      this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
    },
    Tree () {
      console.log(11, this.tree_code)
      console.log(typeof (this.tree_code))
    },
    Submit: function () {
      this.Damage.tree_code = this.tree_code
      AddStssAnalysis(this.Damage).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    Save: function () {
      // this.changeLoading()
      this.$refs.damage_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Damage.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          console.error(this.Damage)
          this.$Message.success('保存成功')
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    // 特征照片base1
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
    handleRemoveList_base1 (index) {
      // 删除
      this.PicUrlList_base1.splice(index, 1)
    },
    handleSuccessList_base1: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_base1.push(res.path)
        this.i_base1++
      }
    },
    // 特征照片base2
    handleRemoveList_base2 (index) {
      // 删除
      this.PicUrlList_base2.splice(index, 1)
    },
    handleSuccessList_base2: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_base2.push(res.path)
        this.i_base2++
      }
    },
    // 特征照片base3
    handleRemoveList_base3 (index) {
      // 删除
      this.PicUrlList_base3.splice(index, 1)
    },
    handleSuccessList_base3: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_base3.push(res.path)
        this.i_base3++
      }
    },

    // 特征照片trunk1
    handleRemoveList_trunk1 (index) {
      // 删除
      this.PicUrlList_trunk1.splice(index, 1)
    },
    handleSuccessList_trunk1: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_trunk1.push(res.path)
        this.i_trunk1++
      }
    },
    // 特征照片trunk2
    handleRemoveList_trunk2 (index) {
      // 删除
      this.PicUrlList_trunk2.splice(index, 1)
    },
    handleSuccessList_trunk2: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_trunk2.push(res.path)
        this.i_trunk2++
      }
    },
    // 特征照片trunk3
    handleRemoveList_trunk3 (index) {
      // 删除
      this.PicUrlList_trunk3.splice(index, 1)
    },
    handleSuccessList_trunk3: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_trunk3.push(res.path)
        this.i_trunk3++
      }
    },

    // 特征照片ske1
    handleRemoveList_ske1 (index) {
      // 删除
      this.PicUrlList_ske1.splice(index, 1)
    },
    handleSuccessList_ske1: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_ske1.push(res.path)
        this.i_ske1++
      }
    },
    // 特征照片ske2
    handleRemoveList_ske2 (index) {
      // 删除
      this.PicUrlList_ske2.splice(index, 1)
    },
    handleSuccessList_ske2: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_ske2.push(res.path)
        this.i_ske2++
      }
    },
    // 特征照片ske3
    handleRemoveList_ske3 (index) {
      // 删除
      this.PicUrlList_ske3.splice(index, 1)
    },
    handleSuccessList_ske3: function (res, file) {
      if (res.code === 500) {
        this.PicUrlList_ske3.push(res.path)
        this.i_ske3++
      }
    }
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
