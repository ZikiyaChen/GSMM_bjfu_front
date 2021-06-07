<template>
<div>
  <Card>
    <h2 slot="title" style="text-align: center">树体损伤情况评估</h2>
    <Form :label-width="143" label-position="right" :model="TreeInformation" inline >
      <h4>古树基本信息</h4>
      <Row>
        <Col  span="5" offset="2">
          <FormItem label="古树编号">
            <Input disabled  v-model="tree_code" class="TextColor"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="5" offset="2">
          <FormItem label="科" prop="Base.family">
            <Input v-model="TreeInformation.Base.family" disabled class="TextColor"></Input>
          </FormItem>
        </Col>
        <Col span="5" >
          <FormItem label="属" prop="Base.genus">
            <Input v-model="TreeInformation.Base.genus" disabled class="TextColor"></Input>
          </FormItem>
        </Col>
        <Col span="5" >
          <FormItem label="中文名" prop="Base.zw_name">
            <Input v-model="TreeInformation.Base.zw_name" disabled class="TextColor"></Input>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="5" offset="2">
          <FormItem label="拉丁名" prop="Base.ld_name">
            <Input v-model="TreeInformation.Base.ld_name" disabled class="TextColor" ></Input>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="俗名" prop="Base.bm_name">
            <Input v-model="TreeInformation.Base.bm_name" disabled class="TextColor">
            </Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Divider></Divider>
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_base1(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_base1">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_base1" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_base2(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_base2">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_base2" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_base3(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_base3">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_base3" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_trunk1(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_t1">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_t1" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_trunk2(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_t2">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_t2" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_trunk3(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_t3">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_t3" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_ske1(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_s1">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_s1" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_ske2(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_s2">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_s2" style="width: 100%" />
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
              <img :src="'data:image/jpg;base64,'+item"  />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView_ske3(item)"></Icon>
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
              action="/api/uploadpic"
              style="display: inline-block;width:70px;">
              <div style="width: 70px;height:70px;line-height: 70px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="图片预览" v-model="visible_s3">
              <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_s3" style="width: 100%" />
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
      <Row>
        <Col span="9" offset="2">
          <FormItem label="调查人" prop="investigate_username">
            <Input v-model="Damage.investigate_username" placeholder="请输入调查人姓名"></Input>
          </FormItem>
        </Col>
        <Col span="9">
          <FormItem label="调查时间" prop="update_time">
            <DatePicker v-model="Damage.update_time"  type="datetime" placeholder="请选择日期"></DatePicker>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <float_bar>
      <div style="text-align: center" v-show="isShow">
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>
        <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>
        <Button  @click="Save" type="primary" style="margin-right: 30px">保存</Button>
        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>

      <div style="text-align: center" v-show="isSubmit">
        <Button @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button @click="NextPage" type="primary"  style="margin-right: 30px">下一页</Button>

        <Button  @click="SubmitUpdate" type="primary" style="margin-right: 30px">提交修改</Button>

        <router-link :to="{path: `/survey/base_survey`}">
          <Button type="primary" style="margin-right: 30px">返回</Button>
        </router-link>
      </div>
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
import { damageList } from "@/view/survey/options";
import { dateToString } from "@/libs/tools";
import {
  AddFzbhAnalysis, AddGpAnalysis,
  AddStssAnalysis,
  getDamage,
  getGrowthVigorById, getNewGrowthVigor,
  getOneTreeBaseInfo, postTjxmRecord,
  queryTjxmRecord, updateDamage, updateGrowthVigor, updateTjxmRecord
} from "@/api/table";
import {ShowPic} from "@/api/upload";
import Float_bar from "_c/FloatBar/float_bar";

export default {
  name: "damage",
  components: {Float_bar},
  data () {
    return {
      showNextPageModal: false,
      showPreviousPageModal: false,
      isShow: false,
      isSubmit: false,
      tree_code: this.$route.params.tree_code,
      DamageList: damageList,

      showImageUrl: '',


      TreeInformation:{
        Base:{
          family:'',
          genus:'',
          zw_name:'',
          ld_name:''
        }
      },

      tjxm_record:{
        t_id: 0,
        type: '树体损伤情况评估',
        username: '',
        status: '',
        type_yw: 'damage',
        time: ''
      },

      PicUrlList_base1: [],
      PicUrlList_base2: [],
      PicUrlList_base3: [],

      i_base1: 0,
      i_base2: 0,
      i_base3: 0,
      visible_base1: false,
      visible_base2: false,
      visible_base3: false,

      PicUrlList_trunk1: [],
      PicUrlList_trunk2: [],
      PicUrlList_trunk3: [],

      i_trunk1: 0,
      i_trunk2: 0,
      i_trunk3: 0,
      visible_t1: false,
      visible_t2: false,
      visible_t3: false,

      PicUrlList_ske1: [],
      PicUrlList_ske2: [],
      PicUrlList_ske3: [],

      i_ske1: 0,
      i_ske2: 0,
      i_ske3: 0,
      visible_s1: false,
      visible_s2: false,
      visible_s3: false,

      Damage: {
        id: 0,
        investigate_username: '',
        base1: '', // 树干基部-树皮损伤比例
        pic_base1: [], // (照片)树干基部-树皮损伤比例
        base2: '', // 树干基部-木质部损伤（未达心材）比例
        pic_base2: [], // (照片)树干基部-木质部损伤（未达心材）比例
        base3: '', // 树干基部-木质部损伤（达到心材）比例
        pic_base3: [], // (照片)树干基部-木质部损伤（达到心材）比例

        trunk1: '', // 树干-树皮损伤比例
        pic_trunk1: [], // (照片)树干-树皮损伤比例
        trunk2: '', // 树干-木质部（未达心材）比例
        pic_trunk2: [], // (照片)树干-木质部（未达心材）比例
        trunk3: '', // 树干-木质部（达到心材）损伤比例
        pic_trunk3: [], // (照片)树干-木质部（达到心材）损伤比例

        skeleton1: '', // 构成骨架大枝-树皮损伤比例
        pic_ske1: [], // (照片)构成骨架大枝-树皮损伤比例
        skeleton2: '', // 构成骨架大枝-木质部（未达心材）比例
        pic_ske2: [], // (照片)构成骨架大枝-木质部（未达心材）比例
        skeleton3: '', // 构成骨架大枝-木质部（达到心材）比例
        pic_ske3: [], // (照片)构成骨架大枝-木质部（达到心材）比例

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

        investigate_username: [{ required: true, trigger: 'blur', message: '请填写调查人姓名' }],
        update_time: [{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }],
      }
    }
  },
  created() {
    this.fetchTreeBasicData()
    this.fetchData()
  },
  methods: {
    fetchTreeBasicData(){
      getOneTreeBaseInfo(this.tree_code).then((res => {
        this.TreeInformation.Base = res.data.tree_basic_info.basic
      }))
    },
    fetchData(){
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'damage'}).then((record=>{
        if(record.data.total!==0){
          this.isShow = false
          this.isSubmit = true
          this.tjxm_record = record.data.tjxm_records[0]
          getDamage({'id':this.tjxm_record.t_id}).then((res=>{
            this.Damage = res.data.tree_damage
            this.fetchPic()
          }))
        }else {
          this.isShow =true
          this.isSubmit = false
        }
      }))
    },
    fetchPic(){
      this.PicUrlList_base1=[]
      this.PicUrlList_base2=[]
      this.PicUrlList_base3=[]
      this.PicUrlList_trunk1=[]
      this.PicUrlList_trunk2=[]
      this.PicUrlList_trunk3=[]
      this.PicUrlList_ske1=[]
      this.PicUrlList_ske2=[]
      this.PicUrlList_ske3=[]
      if(this.Damage.pic_base1.length!==0) {
        this.Damage.pic_base1.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_base1.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_base2.length!==0) {
        this.Damage.pic_base2.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_base2.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_base3.length!==0) {
        this.Damage.pic_base3.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_base3.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_trunk1.length!==0) {
        this.Damage.pic_trunk1.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_trunk1.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_trunk2.length!==0) {
        this.Damage.pic_trunk2.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_trunk2.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_trunk3.length!==0) {
        this.Damage.pic_trunk3.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_trunk3.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_ske1.length!==0) {
        this.Damage.pic_ske1.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_ske1.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_ske2.length!==0) {
        this.Damage.pic_ske2.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_ske2.push(resp.data)
          }))
        })
      }
      if(this.Damage.pic_ske3.length!==0) {
        this.Damage.pic_ske3.forEach((pic_name) => {
          ShowPic(pic_name).then((resp => {
            this.PicUrlList_ske3.push(resp.data)
          }))
        })
      }
    },//*****

    Update(){
      this.$refs.damage_form.validate((valid) => {
        console.log(valid)
        this.Damage.tree_code = this.tree_code
        if (valid) {
          this.Damage.update_time = dateToString(this.Damage.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Damage.investigate_username
          updateDamage(this.Damage.id,this.Damage).then((res=>{
            if(res.data.code === 200 ){
              updateTjxmRecord(this.Damage.id,this.tjxm_record).then((record=>{
                if(res.data.code === 200 ){
                  if(this.tjxm_record.status === '已完成') {
                    this.$Message.success('修改提交成功')
                    this.fetchData()
                  }else {
                    this.$Message.success('修改保存成功')
                    this.fetchData()
                  }
                }else {
                  if(this.tjxm_record.status === '已完成') {
                    this.$Message.error('修改提交失败')
                  }else {
                    this.$Message.error('修改保存失败')
                  }
                }
              }))
            }
          }))
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    SubmitUpdate(){
      this.tjxm_record.status = '已完成'
      this.Update()
    },

    okNext(){
      this.showNextPageModal = false
      this.$router.push({ path: `/survey/Incline/${this.tree_code}` })

    },
    cancelNext(){
      this.showNextPageModal = false
    },
    NextPage(){
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'Incline'}).then((res=>{
        console.log('%%%%',res)
        if(res.data.total !== 0){
          // this.$router.push({ path: `/survey/update/Protect/${this.tree_code}` })
          this.$router.push({ path: `/survey/damage/${this.tree_code}` })
        }else {
          this.showNextPageModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      }))
    },
    okPrevious(){
      this.showPreviousPageModal = false
      this.$router.push({ path: `/survey/Protect/${this.tree_code}` })

    },
    cancelPrevious(){
      this.showPreviousPageModal = false
    },
    PreviousPage () {
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'Protect'}).then((res=>{
        console.log('%%%%',res)
        if(res.data.total !== 0){
          // this.$router.push({ path: `/survey/update/environment/${this.tree_code}` })
          this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
        }else {
          this.showPreviousPageModal = true
        }
      }))
    },
    // NextPage () {
    //   this.$router.push({ path: `/survey/Incline/${this.tree_code}` })
    // },
    // PreviousPage () {
    //   this.$router.push({ path: `/survey/Protect/${this.tree_code}` })
    // },


    TiJiao(){
      this.Damage.tree_code = this.tree_code
      this.$refs.damage_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.Damage.update_time = dateToString(this.Damage.update_time, 'yyyy-MM-dd hh:mm:ss')
          this.tjxm_record.username = this.Damage.investigate_username
          AddStssAnalysis(this.Damage).then(res => {
            getDamage({'tree_code':this.tree_code}).then((resp=>{
              this.tjxm_record.t_id =resp.data.tree_damage.id
              postTjxmRecord(this.tjxm_record).then((record=>{
                if(record.data.code ===200){
                  if(this.tjxm_record.status === '已完成'){
                    this.$Message.success('提交成功')
                    this.fetchData()
                  }else {
                    this.$Message.success('保存成功')
                    this.fetchData()
                  }
                }else {
                  if(this.tjxm_record.status === '已完成'){
                    this.$Message.success('提交失败')
                  }else {
                    this.$Message.success('保存失败')
                  }
                }
              }))
            }))
            console.log('####',res)
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

    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    // 特征照片base1
    handleView_base1 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_base1 = true
    },
    handleRemoveList_base1 (index) {
      // 删除
      this.Damage.pic_base1.splice(index, 1)
      this.PicUrlList_base1.splice(index, 1)
    },
    handleSuccessList_base1: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_base1.push(res.path)
        this.i_base1++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_base1.push(resp.data)
        }))
      }
    },

    // 特征照片base2
    handleView_base2 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_base2 = true
    },
    handleRemoveList_base2 (index) {
      // 删除
      this.Damage.pic_base2.splice(index, 1)
      this.PicUrlList_base2.splice(index, 1)
    },
    handleSuccessList_base2: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_base2.push(res.path)
        this.i_base2++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_base2.push(resp.data)
        }))
      }
    },

    // 特征照片base3
    handleView_base3 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_base3 = true
    },
    handleRemoveList_base3 (index) {
      // 删除
      this.Damage.pic_base3.splice(index, 1)
      this.PicUrlList_base3.splice(index, 1)
    },
    handleSuccessList_base3: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_base3.push(res.path)
        this.i_base3++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_base3.push(resp.data)
        }))
      }
    },

    // 特征照片trunk1
    handleView_trunk1 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_t1 = true
    },
    handleRemoveList_trunk1 (index) {
      // 删除
      this.Damage.pic_trunk1.splice(index, 1)
      this.PicUrlList_trunk1.splice(index, 1)
    },
    handleSuccessList_trunk1: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_trunk1.push(res.path)
        this.i_trunk1++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_trunk1.push(resp.data)
        }))
      }
    },

    // 特征照片trunk2
    handleView_trunk2 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_t2 = true
    },
    handleRemoveList_trunk2 (index) {
      // 删除
      this.Damage.pic_trunk2.splice(index, 1)
      this.PicUrlList_trunk2.splice(index, 1)
    },
    handleSuccessList_trunk2: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_trunk2.push(res.path)
        this.i_trunk2++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_trunk2.push(resp.data)
        }))
      }
    },

    // 特征照片trunk3
    handleView_trunk3 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_t3 = true
    },
    handleRemoveList_trunk3 (index) {
      // 删除
      this.Damage.pic_trunk3.splice(index, 1)
      this.PicUrlList_trunk3.splice(index, 1)
    },
    handleSuccessList_trunk3: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_trunk3.push(res.path)
        this.i_trunk3++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_trunk3.push(resp.data)
        }))
      }
    },

    // 特征照片ske1
    handleView_ske1 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_s1 = true
    },
    handleRemoveList_ske1 (index) {
      // 删除
      this.Damage.pic_ske1.splice(index, 1)
      this.PicUrlList_ske1.splice(index, 1)
    },
    handleSuccessList_ske1: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_ske1.push(res.path)
        this.i_ske1++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_ske1.push(resp.data)
        }))
      }
    },
    // 特征照片ske2
    handleView_ske2 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_s2 = true
    },
    handleRemoveList_ske2 (index) {
      // 删除
      this.Damage.pic_ske2.splice(index, 1)
      this.PicUrlList_ske2.splice(index, 1)
    },
    handleSuccessList_ske2: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_ske2.push(res.path)
        this.i_ske2++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_ske2.push(resp.data)
        }))
      }
    },
    // 特征照片ske3
    handleView_ske3 (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_s3 = true
    },
    handleRemoveList_ske3 (index) {
      // 删除
      this.Damage.pic_ske3.splice(index, 1)
      this.PicUrlList_ske3.splice(index, 1)
    },
    handleSuccessList_ske3: function (res, file) {
      if (res.code === 500) {
        this.Damage.pic_ske3.push(res.path)
        this.i_ske3++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList_ske3.push(resp.data)
        }))
      }
    },
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

.demo-upload-list {
  display: inline-block;width: 70px;height: 70px;text-align: center;line-height: 70px;
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
</style>
