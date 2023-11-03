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
      <h2 slot="title" style="text-align: center">古树名木基本信息调查表</h2>
      <Form :label-width="140" label-position="right" ref="Tree_form" :model="TreeInformation" :rules="ruleValidate" inline>

        <Row>
          <Col span="10" offset="1">
            <FormItem label="古树编号：" prop="tree_code" class="error-tip">
              <Input v-model="TreeInformation.tree_code" placeholder="请输入古树编号" disabled class="TextColor"></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="管护单位：" prop="Base.gh_unit" class="error-tip">
<!--              <Input v-model="TreeInformation.Base.gh_unit" placeholder="选择管护单位名称"></Input>-->
<!--              <Select v-model="TreeInformation.Base.gh_unit" placeholder="选择管护单位名称" filterable @on-clear="GetGhUnit"-->
<!--                      @on-query-change="onGhUnitSelectQueryChange" clearable  >-->
<!--                <Option v-for="item in ghUnits" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>-->
<!--              </Select>-->
              <AutoComplete
                v-model="TreeInformation.Base.gh_unit"
                @on-change="filterGhUnits"
                @on-clear="ClearGhUnitValue"
                placeholder="请选择或输入管护单位名称"
                clearable>
                <Option v-for="item in ghUnits" :value="item.unit" :key="item.unit">{{ item.unit }}</Option>
              </AutoComplete>
            </FormItem>
          </Col>

        </Row>
        <Row>
          <Col span="10" offset="1">
            <FormItem label="是否签订管护责任书：" prop="Base.is_signed" style="width: 100%;" class="error-tip">
              <RadioGroup v-model="TreeInformation.Base.is_signed">
                <Radio v-for="item in IsSignedList" :label="item" :key="item">{{item}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="10" >
            <FormItem label="管护人：" prop="Base.ghr_name" class="error-tip">
<!--              <Input v-model="TreeInformation.Base.gh_username" placeholder="名字"></Input>-->
<!--              <Select v-model="TreeInformation.Base.gh_username" placeholder="名字" filterable-->
<!--                      @on-query-change="onGhUserSelectQueryChange" clearable >-->
<!--                <Option v-for="item in ghUsers" :value="item.username" :key="item.name">{{ item.name }}</Option>-->
<!--              </Select>-->
              <AutoComplete
                v-model="TreeInformation.Base.ghr_name"
                @on-change="filterGhUser"
                @on-select="SelectUsername"
                @on-clear="ClearGhUserValue"
                placeholder="请选择或输入管护人名称"
                clearable>
                <Option v-for="item in ghUsers" :value="item.name" :key="item.name">{{ item.name }}</Option>
              </AutoComplete>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="1">
            <FormItem label="调查顺序号：" prop="Dong.investigate_id" class="error-tip">
              <Input v-model="TreeInformation.Dong.investigate_id" placeholder="请输入调查顺序号" ></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="管护单位电话：" >
              <Input  v-model="TreeInformation.Base.gh_tele" placeholder="请输入电话" ></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="10" offset="1">
            <FormItem label="特征代码：" prop="Base.character_code" class="error-tip">
              <Input v-model="TreeInformation.Base.character_code" placeholder="请输入特征代码" ></Input>
            </FormItem>
          </Col>

        </Row>

        <div style="color: mediumseagreen;  margin-left: 130px; margin-bottom: 5px; font-weight: bold" >
          <span>树种:</span>
        </div>

        <Row>
          <Col offset="1" span="10">
            <FormItem label="中文名：" prop="Base.zw_name" class="error-tip">
              <Select v-model="TreeInformation.Base.zw_name" placeholder="中文名" filterable
                      :remote-method="ZwNameRemoteMethod"
                      @on-select="CompleteKeShuLd"
                      @on-clear="ClearKeShuLd" clearable >
                <Option v-for="item in ZhongList" :value="item.zw_name" :key="item.zw_name">{{item.zw_name}}</Option>
              </Select>
            </FormItem>
<!--            <FormItem label="科属种、拉丁名：" prop="Base.treetype" style="width: 100%;">-->
<!--              <Cascader v-model="TreeInformation.Base.treetype" :data="options" clearable></Cascader>-->
<!--            </FormItem>-->
          </Col>
          <Col span="10">
            <FormItem label="科：" prop="Base.family" class="error-tip">
              <Input v-model="TreeInformation.Base.family" readonly></Input>
            </FormItem>
          </Col>
        </Row>
          <Row>
            <Col span="10" offset="1">
              <FormItem label="属：" prop="Base.genus" class="error-tip">
                <Input v-model="TreeInformation.Base.genus" readonly></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="拉丁名：" prop="Base.ld_name" class="error-tip">
                <Input v-model="TreeInformation.Base.ld_name" clearable></Input>
              </FormItem>
            </Col>
          </Row>
        <Row>
          <Col span="10"  offset="1">
            <FormItem label="俗名：" prop="Base.bm_name">
              <Input v-model="TreeInformation.Base.bm_name" placeholder="请输入俗名" clearable>
              </Input>
            </FormItem>
          </Col>
        </Row>


        <div style="color: mediumseagreen;  margin-left: 130px; margin-bottom: 5px; font-weight: bold" >
          <span>位置:</span>
        </div>

        <Row>
          <Col offset="1">
            <FormItem label="省市区、街道(乡镇)：" class="regionStyle" prop="Base.dizhi">
              <v-region @values="regionChange" :town="true" v-model="TreeInformation.Base.dizhi"></v-region>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="1">
            <FormItem label="村/居委会：" prop="Base.village">
              <Input v-model="TreeInformation.Base.village" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="小地名：" prop="Base.place_name">
              <Input v-model="TreeInformation.Base.place_name" placeholder="请输入古树位置小地名信息" ></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1" span="10">
            <FormItem label="东经：" prop="Base.longitude">
              <Input v-model="TreeInformation.Base.longitude" placeholder="请输入经度"></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="北纬：" prop="Base.latitude">
              <Input v-model="TreeInformation.Base.latitude" placeholder="请输入纬度"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="生长场所（多选）：" prop="Base.palce" style="width: 100%">
              <CheckboxGroup v-model="TreeInformation.Base.palce">
                <Checkbox v-for="item in PalceList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1" span="10">
            <FormItem label="分布特点：" prop="Base.placing_character">
              <RadioGroup v-model="TreeInformation.Base.placing_character">
                <Radio v-for="item in PlacingCharacterList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="权属：" prop="Base.owner" style="width: 100%;">
              <RadioGroup v-model="TreeInformation.Base.owner">
                <Radio v-for="item in OwnerList" :label="item.value" :key="item.value" style="width: 60px; margin-right: 10px"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <div style="color: mediumseagreen;  margin-left: 130px; margin-bottom: 5px; font-weight: bold" >
          <span>树龄:</span>
        </div>
        <Row>
          <Col span="10" offset="1">
            <FormItem label="真实树龄：" prop="Base.real_age" class="error-tip">
              <Input v-model="TreeInformation.Base.real_age"><span slot="append">年</span></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="预估树龄：" prop="Base.estimate_age">
              <Input v-model="TreeInformation.Base.estimate_age"><span slot="append">年</span></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="15" offset="1">
            <FormItem label="树龄估测依据：" prop="Dong.basis">
              <Input v-model="TreeInformation.Dong.basis" type="textarea" :autosize="{minRows: 1,maxRows: 10}" placeholder="Enter something..." style="width: 500px" />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="古树等级：" prop="Base.level">
              <RadioGroup v-model="TreeInformation.Base.level">
                <Radio v-for="item in LevelList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>

          </Col>
        </Row>
        <Row>
          <Col span="10" offset="1">
            <FormItem label="树高：" prop="Base.height">
              <Input v-model="TreeInformation.Base.height" placeholder="请输入树高" >
                <span slot="append">米</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="胸围：" prop="Base.bust">
              <Input v-model="TreeInformation.Base.bust" placeholder="请输入古树的胸围" >
                <span slot="append">m</span>
              </Input>
            </FormItem>
          </Col>
        </Row>

        <div style="color: mediumseagreen;  margin-left: 130px; margin-bottom: 5px; font-weight: bold" >
          <span>冠幅:</span>
        </div>
        <Row>
          <Col offset="1" span="10">
            <FormItem label="平均：" prop="Dong.c_average">
              <Input v-model="TreeInformation.Dong.c_average" placeholder="请输入冠幅平均" >
                <span slot="append"> m </span>
              </Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="东西：" prop="Dong.c_dx">

              <Input v-model="TreeInformation.Dong.c_dx" placeholder="请输入冠幅东西">
                <span slot="append"> m </span>
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="1">
            <FormItem label="南北：" prop="Dong.c_nb">
              <Input v-model="TreeInformation.Dong.c_nb" placeholder="请输入冠幅南北" >
                <span slot="append"> m </span>
              </Input>
            </FormItem>
          </Col>
        </Row>

        <div style="color: mediumseagreen;  margin-left: 100px; margin-bottom: 5px; font-weight: bold" >
          <span>立地条件:</span>
        </div>
        <Row>
          <Col offset="1" span="10">
            <FormItem label="海拔：" prop="Position.elevation">
              <Input v-model="TreeInformation.Position.elevation" placeholder="请输入海拔">
                <span slot="append">m</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="坡向：" prop="Position.aspect">
              <Input v-model="TreeInformation.Position.aspect" placeholder="请输入坡向" >
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1" span="10">
            <FormItem label="坡度：" prop="Position.slope">
              <Input v-model="TreeInformation.Position.slope" placeholder="请输入坡度">
                <span slot="append">度</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="坡位：" prop="Position.slope_position">
              <Input v-model="TreeInformation.Position.slope_position" placeholder="请输入坡位" >
              </Input>
            </FormItem>
          </Col>
        </Row>

        <div style="color: mediumseagreen;  margin-left: 100px; margin-bottom: 5px; font-weight: bold" >
          <span>其他信息:</span>
        </div>
        <Row>
          <Col offset="1" span="10">
            <FormItem label="生长势：" prop="Base.growth_vigor" style="width: 95%">
              <RadioGroup v-model="TreeInformation.Base.growth_vigor">
                <Radio v-for="item in GVigorList" :label="item.value" :key="item.value"
                       style="width: 50px;margin-right: 15px"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="生长环境：" prop="Dong.g_environment" style="width: 95%;">
              <RadioGroup v-model="TreeInformation.Dong.g_environment">
                <Radio v-for="item in GEnvironmentList" :label="item.value" :key="item.value"
                       style="width: 50px;margin-right: 15px"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="18" offset="1">
            <FormItem label="影响生长环境因素：" prop="Dong.affect_factor">
              <Input v-model="TreeInformation.Dong.affect_factor" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..."  />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="新增古树名木原因：" prop="Dong.reason">
              <RadioGroup v-model="TreeInformation.Dong.reason">
                <Radio v-for="item in ReasonList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18" offset="1">
            <FormItem label="古树历史描述：" prop="Dong.history">
              <Input v-model="TreeInformation.Dong.history" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..."
                     maxlength="300" show-word-limit />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="文化历史照片：" prop="Dong.history_pic">
              <UploadPicCom :img-name-list="TreeInformation.Dong.history_pic" @delete="deletePicHistory" @onUpload="uploadPicHistory">
              </UploadPicCom>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="18" offset="1">
            <FormItem label="树种奇特性状描述：" prop="Dong.describe">
              <Input v-model="TreeInformation.Dong.describe" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..."  />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18" offset="1">
            <FormItem label="树种鉴定记载：" prop="Base.jd_record">
              <Input v-model="TreeInformation.Base.jd_record" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..."  />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem prop="Dong.conserve_status" label="保护现状：" style="width: 100%;">
              <CheckboxGroup v-model="TreeInformation.Dong.conserve_status">
                <Checkbox v-for="item in ConserveStatusList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem prop="Dong.yhfz_status" label="养护复壮现状：" style="width: 100%;">
              <CheckboxGroup v-model="TreeInformation.Dong.yhfz_status">
                <Checkbox v-for="item in YhfzStatusList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>

        <div style="color: mediumseagreen;  margin-left: 100px; margin-bottom: 5px; font-weight: bold" >
          <span>古树树体图片:</span>
        </div>
        <Row>
          <Col span="18" offset="1">
            <FormItem label="古树照片的说明：" prop="Base.explain">
              <Input v-model="TreeInformation.Base.explain" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..." style="width: 500px"
                     class="TextStyle"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="古树树体典型照片：" prop="Base.pic_path">
              <UploadPicCom :img-name-list="TreeInformation.Base.pic_path" @delete="deletePic" @onUpload="uploadPic">
              </UploadPicCom>
            </FormItem>
          </Col>
        </Row>


        <div style="color: mediumseagreen;  margin-left: 110px; margin-bottom: 5px; font-weight: bold" >
          <span>树牌信息:</span>
        </div>
        <Row>
          <Col offset="1">
            <FormItem label="有无树牌：" prop="Brand.has_brand">
              <RadioGroup v-model="TreeInformation.Brand.has_brand">
                <Radio v-for="item in HasBrandList" :label="item" :key="item">{{item}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="现有树牌：" prop="Brand.brand_right" style="width: 100%;">
              <RadioGroup v-model="TreeInformation.Brand.brand_right">
                <Radio v-for="item in BrandRightList" :label="item.value" :key="item.value"
                       style=" width: auto; margin-right: 35px"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="其它后台信息：" prop="Brand.is_right">
              <RadioGroup v-model="TreeInformation.Brand.is_right">
                <Radio v-for="item in IsRightList" :label="item" :key="item">{{item}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="TreeInformation.Brand.is_right === '不准确'">
          <Col offset="1">
            <FormItem label="需要修改的内容：" prop="Brand.content" style="width: 50%;">
              <Input v-model="TreeInformation.Brand.content">
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="树牌照片：" prop="Brand.brand_pic">
              <UploadPicCom :img-name-list="TreeInformation.Brand.brand_pic" @delete="deletePicBrand" @onUpload="uploadPicBrand">
              </UploadPicCom>
            </FormItem>
          </Col>

        </Row>

<!--        <Row>-->
<!--          <Col offset="1">-->
<!--            <FormItem label="二维码：">-->
<!--                <img :src="'data:image/jpg;base64,'+ QrcodeImg"  style="width: 100px"/>-->
<!--            </FormItem>-->
<!--          </Col>-->
<!--        </Row>-->

      </Form>
      <float_bar  v-role="['超级管理员','单位管理员','调查人员']">
      <div style="text-align: center">
        <Button  @click="PreviousPage" type="primary" style="margin-right: 30px">上一页</Button>
        <Button  @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>

        <Button  @click="SubmitTreeInfo" type="primary" style="margin-right: 30px">提交</Button>
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
        <p>下一页为生长环境评价分析，该古树的生长环境评价分析尚未填写，</p>
        <p>如果需要填写，请点击“确定”</p>
      </Modal>
    </Card>
  </div>
</template>

<script>
import {
  getOneTreeBaseInfo,
  updateBasic,
  updateDynamic,
  updateBrand,
  updateGeo,
  updatePic,
  updateTjxmRecord,
  queryTjxmRecord,
  getBasic,
  AddDynamic,
  AddGeo,  AddBrand, postTjxmRecord
} from "@/api/table";

import { dateToString } from "@/libs/tools";
import name from "@/view/tools-methods/name.json"
import {
  brand_rightList, conserve_statusList, g_environmentList, g_vigorList,
  levelList,
  ownerList,
  palceList,
  placing_characterList,
  reasonList, yhfz_statusList
} from "@/view/survey/right_base_options";
import Float_bar from "_c/FloatBar/float_bar";
import { checkLat, checkLon } from "@/view/tools-methods/someValidateRule";
import { PathToList } from "@/view/survey/options";
import { queryUnits, queryUsers} from "@/api/user";
import {QuerySpecies} from "@/api/tree_species";
import UserMixin from "@/mixin/UserMixin";
import AMap from "AMap";
import UploadPicCom from "_c/Upload/UploadPicCom";


export default {
  name: "BasicInformation",
  mixins: [UserMixin],
  components: {UploadPicCom, Float_bar },
  data: function () {
    return {

      isShow: false,
      timeIndex: 0,
      timeLineList: PathToList,

      QrcodeImg: '',
      initRes: undefined,

      s1: undefined,
      s2: undefined,
      s3: undefined,
      s4: undefined,
      s5: undefined,
      s6: undefined,

      u1: undefined,
      u2: undefined,
      u3: undefined,
      u4: undefined,
      u5: undefined,


      showModal: false,
      options: [],
      ghUsers: [],
      dcUsers: [],
      ghUnits: [],
      dcUnits: [],
      tree_code: this.$route.params.tree_code,
      TreeInformation: {
        tree_code: '',
        Base: {
          id: 0,
          dizhi: undefined,
          zw_name: '', // 中文名（即树种）
          ld_name: '', // 拉丁名
          bm_name: '', // 别名
          family: '', // 科
          genus: '', // 属
          treetype: [],

          real_age: '', // 真实树龄
          height: null, // 树高
          bust: null, // 胸围
          gh_tele: '',

          province: '', // 省
          city: '', // 市
          area: '', // 区
          town: '', // 乡镇/街道
          village: '', // 村/居委会
          place_name: '', // 小地名

          palce: [], // 生长场所
          placing_character: '', // 分布特点
          owner: '', // 权属
          level: '', // 古树等级

          character_code: '', // 特征代码
          jd_record: '', // 树种鉴定记载
          gh_unit: '', // 管护单位
          gh_username: '', // 管护人
          ghr_name: '', //管护人姓名

          dc_username: '',
          is_signed: '', // 是否签订管护责任书
          tree_code: '',

          pic_path: [], // 树体照片
          explain: '', // 图片说明
          longitude: '', //经度
          latitude: '', //纬度
          estimate_age: '', //预估树龄
          growth_vigor: '',  //生长势

        },
        Position: {
          id: 0,
          province_code: '', // 省
          city_code: '', // 市
          area_code: '', // 区
          town_code: '', // 乡镇/街道


          elevation: '', // 海拔
          aspect: '', // 坡向
          slope: '', // 坡度
          slope_position: '', // 坡位
          tree_code: '',
        },
        Dong: {
          id: 0,
          investigate_id: '', // 调查顺序号
          describe: '', // 树木奇特性状描述
          reason: '', // 新增古树名木原因
          affect_factor: '', // 影响生长环境因素

          c_average: null, // 冠幅平均
          c_dx: null, // 冠幅东西
          c_nb: null, // 冠幅南北

          g_environment: '', //  生长环境


          basis: '', // 树龄估测依据
          history: '', // 古树历史信息描述
          history_pic: [], // 古树历史信息图片
          conserve_status: [], // 保护现状
          yhfz_status: [], // 养护复壮现状
          tree_code: '',
        },

        Brand: {
          id: 0,
          has_brand: '', // 有无树牌
          is_right: '', // 其他后台信息是否准确
          content: '', // 不准确需改正的内容
          brand_right: '', // 现有树牌信息是否准确
          brand_pic: [], // 树牌照片
          tree_code: '',
        },

      },

      tjxm_record: {
        id: 0,
        t_id: 0,
        type: '基本信息',
        dc_username: '',
        status: '已完成',
        type_yw: 'BasicInformation',
        time: '',
        tree_code: '',
      },

      date: new Date(),
      IsSignedList: ['是','否'],
      LevelList: levelList,

      PalceList: palceList,
      PlacingCharacterList: placing_characterList,
      OwnerList: ownerList,
      ReasonList: reasonList,
      HasBrandList: ['有','无'],
      BrandRightList: brand_rightList,
      IsRightList: ['准确','不准确'],
      GVigorList: g_vigorList,
      GEnvironmentList: g_environmentList,
      ConserveStatusList: conserve_statusList,
      YhfzStatusList: yhfz_statusList,

      ZhongList:[],





      ruleValidate: {
        'Base.zw_name': [{ required: true, trigger:'change', message: '请选择中文名' }],
        'Base.ld_name': [{ required: true, message: '拉丁名' }],
        'Base.family' : [{ required: true, message: '科' }],
        'Base.genus': [{ required: true, message: '属' }],
        'Base.dizhi': [{ required: true, message: '请选择' }],
        'Base.level': [{ required: true, message: '请选择' }],
        'Base.longitude': [{ required: true, validator: checkLon, message: '请填写经度(-180~180,小数限7位)', trigger: 'blur' }],
        'Base.latitude': [{ required: true, validator: checkLat, message: '请填写纬度(-90~90,小数限7位)', trigger: 'blur' }],
        'Base.owner': [{ required: true, message: '请选择' }],
        'Base.gh_unit': [{ required: true, message: '请填写', trigger: 'change' }],
        'Base.dc_username': [{ required: true, message: '请选择', trigger: 'change' }],
        'Dong.real_age': [{ required: true, message: '请填写' }],
        'Dong.height': [{ required: true, message: '请填写', trigger: 'blur' }],
        'Dong.bust': [{ required: true, message: '请填写', trigger: 'blur' }],
        'Base.growth_vigor': [{ required: true, message: '请选择' }],
      },

    }
  },
  created () {
    // this.DataTurn(name.contents)
  },
  methods: {
    filterGhUnits(value){
      queryUnits({unit_like: value}).then(res=>{
        this.ghUnits = res.data.units
      })
      queryUsers({unit_like: value, is_yh: true}).then(res=>{
        this.ghUsers = res.data.users
      })
    },

    GetGhUnit () {
      queryUnits().then(res => {
        this.ghUnits = res.data.units
      })
    },

    filterGhUser(value){
      queryUsers({name_like: value, unit_like:this.TreeInformation.Base.gh_unit, is_yh:true}).then(res=>{
        this.ghUsers = res.data.users
      })
    },

    SelectUsername(value){
      queryUsers({name:value, unit: this.TreeInformation.Base.gh_unit, is_yh:true}).then(res=>{
        this.TreeInformation.Base.gh_username = res.data.users[0].username
      })
    },
    ClearGhUnitValue(){
      this.TreeInformation.Base.gh_unit = ''
    },
    ClearGhUserValue(){
      this.TreeInformation.Base.gh_username = ''
      this.TreeInformation.Base.ghr_name = ''
    },
    // 初始化ZhongList
    initZwNameList(){
      QuerySpecies().then(res=>{
        this.ZhongList = res.data.specieses
      })
    },
    // 当树种搜索词变化时，ZhongList变化
    ZwNameRemoteMethod(query){
      console.log('1',query)
      if(query!==''){
        QuerySpecies({zw_name_likemohu: query}).then(res=>{
          this.ZhongList = res.data.specieses
        })
      }else {
        this.initZwNameList()
      }

    },
    // 当选择树种中文名时，自动补全科属、拉丁名
    CompleteKeShuLd(value){
      QuerySpecies({zw_name: value.value}).then(res=>{
        this.TreeInformation.Base.family = res.data.specieses[0].family
        this.TreeInformation.Base.genus = res.data.specieses[0].genus
        this.TreeInformation.Base.ld_name = res.data.specieses[0].ld_name
      })
    },
    // 清空科属拉丁名
    ClearKeShuLd(){
      this.initZwNameList()
      this.TreeInformation.Base.family = ''
      this.TreeInformation.Base.genus = ''
      this.TreeInformation.Base.ld_name = ''
    },



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
      this.$router.push({ path: item.path_to + `${this.tree_code}` })
    },
    changeActive (index) {
      this.timeIndex = index;
    },

    // 将json数据转成级联选择器种的data形式
    DataTurn (data) {
      var option = []
      var keArr = []
      var shuArr = []
      var nameArr = []
      var shuIndex = {}
      for (let [index, elem] of data.entries()) {
        if (!keArr.includes(elem.ke)) { // 如果该科第一次被遍历到，那么直接将科属种全部加入
          keArr.push(elem.ke)
          shuArr.push(elem.shu)

          option.push({
            value: elem.ke,
            label: elem.ke,
            children: [{
              value: elem.shu,
              label: elem.shu,
              children: [{
                value: elem.name,
                label: elem.name,
                children: [{ value: elem.lading, label: elem.lading }]
              }]
            }]
          })

          shuIndex[elem.shu] = option[option.length - 1].children.length - 1
        } else { // 该科不是第一次被遍历到, 即已被加入
          let i = keArr.indexOf(elem.ke);// 找到该科第一次被加入时的索引位置

          if (!shuArr.includes(elem.shu)) { // 该科的属没有被加入,把该属及种加入
            shuArr.push(elem.shu)
            option[i].children.push({
              value: elem.shu,
              label: elem.shu,
              children: [{
                value: elem.name,
                label: elem.name,
                children: [{ value: elem.lading, label: elem.lading }]
              }]
            })

            shuIndex[elem.shu] = option[i].children.length - 1
          } else { // 如果该属被加入了。
            option[i].children[shuIndex[elem.shu]].children.push({
              value: elem.name,
              label: elem.name,
              children: [{ value: elem.lading, label: elem.lading }]
            })
          }
        }
      }
      this.options = option
    },



    ok () {
      this.showModal = false
      this.$router.push({ path: `/survey/environment/${this.tree_code}` })
    },
    cancel () {
      this.showModal = false
    },
    NextPage () {
      queryTjxmRecord({ 'tree_code': this.tree_code, 'type_yw': 'environment' }).then(res => {
        console.log('%%%%', res)
        if (res.data.total !== 0) {
          this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        } else {
          this.showModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      })
    },
    PreviousPage(){
      this.$router.push({ path: `/survey/coverPage/${this.tree_code}` })
    },
    // 获取初始的科属种级联选择器中的值进行格式化
    getTreeType (base) {
      let typelist = [base.family, base.genus, base.zw_name, base.ld_name]
      this.TreeInformation.Base.treetype = typelist
      console.log(typelist)
    },

    // 更新省市区街道信息
    regionChange (data) {
      console.log(data)
      if (data.province !== null) {
        this.TreeInformation.Base.province = data.province.value
        this.TreeInformation.Position.province_code = data.province.key
      }
      if (data.city !== null) {
        this.TreeInformation.Base.city = data.city.value
        this.TreeInformation.Position.city_code = data.city.key
      }
      if (data.area !== null) {
        this.TreeInformation.Base.area = data.area.value
        this.TreeInformation.Position.area_code = data.area.key
      }
      if (data.town !== null) {
        this.TreeInformation.Base.town = data.town.value
        this.TreeInformation.Position.town_code = data.town.key
      }
      console.log(this.TreeInformation)
    },

    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 4M.'
      })
    },
    Save () {
      this.$refs.Tree_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.TreeInformation.Base.family = this.TreeInformation.Base.treetype[0]
          this.TreeInformation.Base.genus = this.TreeInformation.Base.treetype[1]
          this.TreeInformation.Base.zw_name = this.TreeInformation.Base.treetype[2]
          this.TreeInformation.Base.ld_name = this.TreeInformation.Base.treetype[3]
          this.TreeInformation.Dong.investigate_time = dateToString(this.TreeInformation.Dong.investigate_time, 'yyyy-MM-dd hh:mm:ss')
          this.TreeInformation.Base.investigate_time = this.TreeInformation.Dong.investigate_time
          this.tjxm_record.username = this.TreeInformation.Base.dc_username
          this.TreeInformation.Brand.update_time = this.TreeInformation.Dong.investigate_time
          this.TreeInformation.Pic.update_time = this.TreeInformation.Dong.investigate_time
          this.tjxm_record.status = '待提交'

          updateBasic(this.tree_code, this.TreeInformation.Base).then(base => {
            if (base.data.code === 200) {
              console.log('base', base.data)
              updateDynamic(this.TreeInformation.Dong.id, this.TreeInformation.Dong).then(dynamic => {
                if (dynamic.data.code === 200) {
                  updateGeo(this.TreeInformation.Position.id, this.TreeInformation.Position).then(geo => {
                    if (geo.data.code === 200) {
                      console.log('xxxxpic', this.TreeInformation.Pic.path)
                      updatePic(this.TreeInformation.Pic.id, this.TreeInformation.Pic).then(pic => {
                        if (pic.data.code === 200) {
                          updateBrand(this.TreeInformation.Brand.id, this.TreeInformation.Brand).then(brand => {
                            if (brand.data.code === 200) {
                              updateTjxmRecord(this.TreeInformation.Base.id, this.tjxm_record).then(tjxm => {
                                if (tjxm.data.code === 200) {
                                  this.$Message.success('修改保存成功')
                                  // setTimeout(()=>{
                                  //   this.$router.push({ path: `/survey/base_survey` })
                                  // },200)
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    Submit: function () {
      this.$refs.Tree_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.TreeInformation.Base.family = this.TreeInformation.Base.treetype[0]
          this.TreeInformation.Base.genus = this.TreeInformation.Base.treetype[1]
          this.TreeInformation.Base.zw_name = this.TreeInformation.Base.treetype[2]
          this.TreeInformation.Base.ld_name = this.TreeInformation.Base.treetype[3]
          this.TreeInformation.Dong.investigate_time = dateToString(this.TreeInformation.Dong.investigate_time, 'yyyy-MM-dd hh:mm:ss')
          this.TreeInformation.Base.investigate_time = this.TreeInformation.Dong.investigate_time
          this.tjxm_record.username = this.TreeInformation.Base.dc_username
          this.TreeInformation.Brand.update_time = this.TreeInformation.Dong.investigate_time
          this.TreeInformation.Pic.update_time = this.TreeInformation.Dong.investigate_time
          this.tjxm_record.status = '已完成'

          updateBasic(this.tree_code, this.TreeInformation.Base).then(base => {
            if (base.data.code === 200) {
              console.log('base', base.data)
              updateDynamic(this.TreeInformation.Dong.id, this.TreeInformation.Dong).then(dynamic => {
                if (dynamic.data.code === 200) {
                  updateGeo(this.TreeInformation.Position.id, this.TreeInformation.Position).then(geo => {
                    if (geo.data.code === 200) {
                      console.log('xxxxpic', this.TreeInformation.Pic.path)
                      updatePic(this.TreeInformation.Pic.id, this.TreeInformation.Pic).then(pic => {
                        if (pic.data.code === 200) {
                          updateBrand(this.TreeInformation.Brand.id, this.TreeInformation.Brand).then(brand => {
                            if (brand.data.code === 200) {
                              updateTjxmRecord(this.TreeInformation.Base.id, this.tjxm_record).then(tjxm => {
                                if (tjxm.data.code === 200) {
                                  this.$Message.success('修改提交成功')
                                  // setTimeout(()=>{
                                  //   this.$router.push({ path: `/survey/base_survey` })
                                  // },200)
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },

    async SubmitTree(){
      await updateBasic(this.tree_code,this.TreeInformation.Base).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
      await AddDynamic(this.TreeInformation.Dong).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })

      await AddGeo(this.TreeInformation.Position).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })

      // await AddTreePic(this.TreeInformation.Pic).then(res=>{
      //   if(res.data.code !== 200){
      //     this.$Message.error('失败')
      //   }
      // }).catch(error=>{
      //   this.$Message.error('失败')
      // })
      await AddBrand(this.TreeInformation.Brand).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })


      await postTjxmRecord(this.tjxm_record).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }else {
          this.$Message.success('成功')
          this.fetchData()
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
    },

    initLevel(){
      var level = ''
      var keyword = ''
      if(this.userInfo.userInfo.district_type === '1'){
        keyword = this.userInfo.userInfo.province
        level = 'province'
      }else if(this.userInfo.userInfo.district_type === '2'){
        level = 'city'
        keyword = this.userInfo.userInfo.city
      }else if(this.userInfo.userInfo.district_type === '3'){
        level = 'district'
        keyword = this.userInfo.userInfo.area
      }
      return level,keyword
    },
    async isPointRing(){
      var ring = []
      // var level, keyword = this.initLevel()
      var level = ''
      var keyword = ''
      var point = [this.TreeInformation.Position.longitude,this.TreeInformation.Position.latitude]
      if(this.userInfo.userInfo.district_type === '1'){
        keyword = this.userInfo.userInfo.province
        level = 'province'
      }else if(this.userInfo.userInfo.district_type === '2'){
        level = 'city'
        keyword = this.userInfo.userInfo.city
      }else if(this.userInfo.userInfo.district_type === '3'){
        level = 'district'
        keyword = this.userInfo.userInfo.area
      }
      if(this.userInfo.userInfo.work_place_type === '2'){
        ring = this.userInfo.userInfo.work_place.polygon_paths
        var inRing = window.AMap.GeometryUtil.isPointInRing(point, ring);
        console.log('1',inRing)
        return inRing
      }else {
        console.log('level,keyword',level,keyword)
        await AMap.plugin('AMap.DistrictSearch', function () {
          // 创建行政区查询对象
          var district = new AMap.DistrictSearch({
            // 返回行政区边界坐标等具体信息
            extensions: 'all',
            // 设置查询行政区级别为 区
            level: level
          })

          district.search(keyword, function(status, result) {
            // 获取边界信息
            ring = result.districtList[0].boundaries
            console.log('2', ring)
            var inRing = window.AMap.GeometryUtil.isPointInRing(point, ring);
            console.log('2',inRing)
            return inRing
          })
        })
      }

      // var inRing = window.AMap.GeometryUtil.isPointInRing(
      //   [this.TreeInformation.Position.longitude,this.TreeInformation.Position.latitude], ring);
      // return inRing
    },
    //提交----如果没有基本信息isShow=true，先update basic,再post dynamic\pic\brand\geo等，最后post tjxm_record
    //   ----如果有基本信息isShow = false, 先update basic, 再update dynamic......,最后update tjxm_record
    async SubmitTreeInfo(){
      this.TreeInformation.Dong.tree_code = this.tree_code
      this.TreeInformation.Brand.tree_code = this.tree_code
      // this.TreeInformation.Pic.tree_code = this.tree_code
      this.TreeInformation.Position.tree_code = this.tree_code
      this.tjxm_record.tree_code = this.tree_code
      // 信息修改之后变为  未审核
      this.TreeInformation.Base.dw_CheckState ='未审核'
      this.TreeInformation.Base.admin_CheckState = '未审核'
      this.TreeInformation.Base.dc_status = '已完成'
      //判断该树是否在工作区域内
      // var xx =await this.isPointRing().then( res=>{
      //   console.log(res)
      // })

      this.$refs.Tree_form.validate((valid) => {
        console.log('valid',valid)
        if (valid) {
          console.log('isShow',this.isShow)
          if(this.isShow){
            this.tjxm_record.t_id = this.TreeInformation.Base.id
            this.SubmitTree()
          }else {
            this.UpdateTree()
          }
        }else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    async UpdateTree(){
      console.log('update')
      await updateBasic(this.tree_code,this.TreeInformation.Base).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
      await updateDynamic(this.TreeInformation.Dong.id,this.TreeInformation.Dong).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
      await updateGeo(this.TreeInformation.Position.id, this.TreeInformation.Position).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
      // await updatePic(this.TreeInformation.Pic.id, this.TreeInformation.Pic).then(res=>{
      //   if(res.data.code !== 200){
      //     this.$Message.error('失败')
      //   }
      // }).catch(error=>{
      //   this.$Message.error('失败')
      // })
      await updateBrand(this.TreeInformation.Brand.id,this.TreeInformation.Brand).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
      await updateTjxmRecord(this.tjxm_record.id,this.tjxm_record).then(res=>{
        if(res.data.code !== 200){
          this.$Message.error('失败')
        }else {
          this.$Message.success('成功')
        }
      }).catch(error=>{
        this.$Message.error('失败')
      })
    },

    async fetchData () {
      this.dcUnits = []
      this.dcUsers = []
      this.ghUnits = []
      this.ghUsers = []
      await queryTjxmRecord({tree_code: this.tree_code, type_yw:'BasicInformation'}).then(res=>{
        this.initRes= res
      }).catch(error=>{
        console.log(error)
      })

      if(this.initRes.data.total === 0){
        this.isShow = true // 还未填写基本信息
        await getBasic({tree_code: this.tree_code}).then(resp=>{
          if(resp.data.code === 200){
            this.TreeInformation.Base = resp.data.basic
            this.TreeInformation.tree_code = this.tree_code
          }
        })
      }else {
        this.isShow = false // 已填写基本信息
        await getOneTreeBaseInfo(this.tree_code).then(res => {
          console.log('one_tree', res.data)
          this.TreeInformation.Base = res.data.tree_basic_info.basic
          this.TreeInformation.tree_code = this.tree_code
          this.TreeInformation.Position = res.data.tree_basic_info.geo

          this.TreeInformation.Brand = res.data.tree_basic_info.brand
          this.TreeInformation.Dong = res.data.tree_basic_info.dynamic
          this.tjxm_record = res.data.tree_basic_info.record

        })


      }


    },

    // 文化历史照片
    deletePicHistory(value){
      this.TreeInformation.Dong.history_pic = value
    },
    uploadPicHistory(value){
      this.TreeInformation.Dong.history_pic = value
    },

    // 树牌照片
    deletePicBrand(value){
      this.TreeInformation.Brand.brand_pic = value
    },
    uploadPicBrand(value){
      this.TreeInformation.Brand.brand_pic = value
    },

    // 古树照片
    deletePic(value){
      this.TreeInformation.Base.pic_path = value
    },
    uploadPic(value){
      this.TreeInformation.Base.pic_path = value
    },

    // getQrcode(){
    //   ShowQRcode(this.tree_code).then(res=>{
    //     this.QrcodeImg = res.data
    //   })
    // }
  },

  mounted: function () {
    this.fetchData()
    this.InitIndex()
    // this.getQrcode()
    this.GetGhUnit()
    this.initZwNameList()

    this.TreeInformation.Base.dizhi = this.userInfo.userInfo.districts


    console.log('******', this.TreeInformation.Base.treetype)
  },

  // watch: {
  //   '$route' (to, from) {
  //     this.$router.go(0)
  //
  //   }
  //
  // },
}
</script>

<style scoped>
.TextColor >>> .ivu-input[disabled], fieldset[disabled] .ivu-input {
  color: grey !important;
}
/*margin-bottom控制formItem上下间隔距离
  width控制formItem输入框的长度*/
.ivu-form-item {
  margin-bottom: 14px;
  width: 85%;
}

.error-tip >>> div.ivu-form-item-error-tip {
  padding-top: 0.5mm!important;
}

/*控制单选选项之间距离*/
.ivu-radio-wrapper {
  width: 85px;
  margin-right: 15px;
}
/*复选框选项间隔*/
.ivu-checkbox-wrapper {
  width: 100px;
  margin-right: 25px;
}
.ivu-date-picker {
  width: 100%;
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

.regionStyle >>> .ivu-form-item-content {
  line-height: 16px;
}
.regionStyle >>> div.rg-select div.rg-select__el div.rg-select__content  {
  font-size: 12px;
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
