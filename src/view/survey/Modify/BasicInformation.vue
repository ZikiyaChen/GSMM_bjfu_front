<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">名木古树每木调查表--修改</h2>
      <Form :label-width="120" label-position="right" ref="Tree_form" :model="TreeInformation" :rules="ruleValidate" inline>
        <h4>基本信息：</h4>
        <Row>
          <Col span="9" offset="1">
            <FormItem label="古树编号" prop="tree_code">
              <Input v-model="TreeInformation.tree_code" placeholder="请输入古树编号" style="width: 200px" disabled></Input>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="调查顺序号" prop="Dong.investigate_id">
              <Input v-model="TreeInformation.Dong.investigate_id" placeholder="请输入调查顺序号" style="width: 200px"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="9" offset="1">
            <FormItem label="管护单位" prop="Base.gh_unit">
              <Input v-model="TreeInformation.Base.gh_unit" placeholder="请输入管护单位名称" style="width: 200px"></Input>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="调查时间" prop="Dong.investigate_time">
              <DatePicker v-model="TreeInformation.Dong.investigate_time"  type="datetime" placeholder="请选择日期"></DatePicker>
            </FormItem>
          </Col>

        </Row>

        <Row>
          <Col span="9"  offset="1">
            <FormItem label="管护人" prop="Base.username">
              <Input v-model="TreeInformation.Base.username" placeholder="请输入管护人姓名" style="width: 200px"></Input>
            </FormItem>
          </Col>
          <Col span="9">
              <FormItem label="调查人" prop="Dong.username">
                <Input v-model="TreeInformation.Dong.username" placeholder="请输入调查人姓名" style="width: 200px"></Input>
              </FormItem>
          </Col>

        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="特征代码" prop="Base.character_code">
              <Input v-model="TreeInformation.Base.character_code" placeholder="请输入特征代码" style="width: 200px"></Input>
            </FormItem>

          </Col>
          <Col span="9">
            <FormItem label="树高" prop="Dong.height">
              <Input v-model="TreeInformation.Dong.height" placeholder="请输入树高" style="width: 160px">
                <span slot="append">m</span>
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="9" offset="1">
            <FormItem label="古树等级" prop="Base.level">
              <RadioGroup v-model="TreeInformation.Base.level">
                <Radio v-for="item in LevelList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>

          </Col>
          <Col span="9">
            <FormItem label="胸围" prop="Dong.bust">
              <Input v-model="TreeInformation.Dong.bust" placeholder="请输入古树的胸围" style="width: 160px">
                <span slot="append">cm</span>
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="9" offset="1">
            <FormItem label="是否签订管护责任书" prop="Base.is_signed">
              <RadioGroup v-model="TreeInformation.Base.is_signed">
                <Radio v-for="item in IsSignedList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <h4>树种信息：</h4>

<!--        <Row>-->
<!--          <Col span="9" offset="1">-->
<!--            <FormItem label="科属种" prop="Base.treetype">-->
<!--              <Cascader v-model="TreeInformation.Base.treetype" :data="options" clearable	trigger="hover"-->
<!--                        @on-change="(value, selectedData) => showLdname(value, selectedData)">-->
<!--              </Cascader>-->
<!--            </FormItem>-->
<!--          </Col>-->
<!--          <Col span="9">-->
<!--            <FormItem label="拉丁名" prop="Base.ld_name">-->
<!--              <Input v-model="TreeInformation.Base.ld_name" placeholder="请先选择科属种" ></Input>-->
<!--            </FormItem>-->
<!--          </Col>-->
<!--        </Row>-->

        <Row>
          <Col offset="1" >
            <FormItem label="科属种、拉丁名" prop="Base.treetype" style="width: 450px">
              <Cascader v-model="TreeInformation.Base.treetype" :data="options" clearable></Cascader>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="俗名" prop="Base.bm_name">
              <Input v-model="TreeInformation.Base.bm_name" placeholder="请输入别名" style="width: 200px" clearable>
              </Input>
            </FormItem>
          </Col>
        </Row>

        <Divider />
        <h4>树龄：</h4>
        <Row>
          <Col span="7" offset="1">
            <FormItem label="真实树龄" prop="Dong.real_age">
              <InputNumber v-model="TreeInformation.Dong.real_age"
                           :formatter="value => `${value}   年`"
                           :parser="value => value.replace('   年', '')"></InputNumber>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="预估树龄" prop="Dong.estimate_age">
              <InputNumber v-model="TreeInformation.Dong.estimate_age"
                           :formatter="value => `${value}   年`"
                           :parser="value => value.replace('   年', '')"></InputNumber>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="树龄估测依据" prop="Dong.basis">
              <Input v-model="TreeInformation.Dong.basis" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..." style="width: 500px" />
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <h4>位置信息：</h4>
        <Row>
          <Col offset="1">
            <FormItem label="省市区街道" class="regionStyle" prop="Base.dizhi">
              <v-region @values="regionChange" :town="true" v-model="TreeInformation.Base.dizhi"></v-region>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="村/居委会" prop="Base.village">
              <Input v-model="TreeInformation.Base.village" placeholder="请输入" style="width: 300px"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="小地名" prop="Base.place_name">
              <Input v-model="TreeInformation.Base.place_name" placeholder="请输入古树位置小地名信息" style="width: 300px"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1" span="6">
            <FormItem label="经度" prop="Position.longitude">
              <Input v-model="TreeInformation.Position.longitude" placeholder="请输入经度"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" offset="1">
            <FormItem label="纬度" prop="Position.latitude">
              <Input v-model="TreeInformation.Position.latitude" placeholder="请输入纬度"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="生长场所" prop="Base.palce">
              <RadioGroup v-model="TreeInformation.Base.palce">
                <Radio v-for="item in PalceList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="分布特点" prop="Base.placing_character">
              <RadioGroup v-model="TreeInformation.Base.placing_character">
                <Radio v-for="item in PlacingCharacterList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="权属" prop="Base.owner">
              <RadioGroup v-model="TreeInformation.Base.owner">
                <Radio v-for="item in OwnerList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Divider />
        <h4>冠幅：</h4>
        <Row>
          <Col offset="1" span="7">
            <FormItem label="平均" prop="Dong.c_average">
              <!--              <InputNumber v-model="TreeInformation.Dong.c_average"-->
              <!--                           :step="0.01"-->
              <!--                           :formatter="value => `${value}  m`"-->
              <!--                           :parser="value => value.replace('  m', '')"></InputNumber>-->
              <Input v-model="TreeInformation.Dong.c_average" placeholder="请输入冠幅平均" style="width: 160px">
                <span slot="append"> m </span>
              </Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="东西" prop="Dong.c_dx">
              <!--              <InputNumber v-model="TreeInformation.Dong.c_dx"-->
              <!--                           :step="0.01"-->
              <!--                           :formatter="value => `${value}  m`"-->
              <!--                           :parser="value => value.replace('  m', '')"></InputNumber>-->
              <Input v-model="TreeInformation.Dong.c_dx" placeholder="请输入冠幅东西" style="width: 160px">
                <span slot="append"> m </span>
              </Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="南北" prop="Dong.c_nb">
              <!--              <InputNumber v-model="TreeInformation.Dong.c_nb"-->
              <!--                           :step="0.01"-->
              <!--                           :formatter="value => `${value}  m`"-->
              <!--                           :parser="value => value.replace('  m', '')"></InputNumber>-->
              <Input v-model="TreeInformation.Dong.c_nb" placeholder="请输入冠幅南北" style="width: 160px">
                <span slot="append"> m </span>
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <h4>立地条件：</h4>
        <Row>
          <Col offset="1" span="7">
            <FormItem label="海拔" prop="Position.elevation">
              <Input v-model="TreeInformation.Position.elevation" placeholder="请输入海拔" style="width: 150px">
                <span slot="append">m</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="坡向" prop="Position.aspect">
              <Input v-model="TreeInformation.Position.aspect" placeholder="请输入坡向" style="width: 150px">
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1" span="7">
            <FormItem label="坡度" prop="Position.slope">
              <Input v-model="TreeInformation.Position.slope" placeholder="请输入坡度" style="width: 150px">
                <span slot="append">度</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="坡位" prop="Position.slope_position">
              <Input v-model="TreeInformation.Position.slope_position" placeholder="请输入坡位" style="width: 150px">
              </Input>
            </FormItem>
          </Col>
        </Row>

        <Divider />
        <h4>其他信息：</h4>
        <Row>
          <Col offset="1">
            <FormItem label="生长势" prop="Dong.g_vigor">
              <RadioGroup v-model="TreeInformation.Dong.g_vigor">
                <Radio v-for="item in GVigorList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="生长环境" prop="Dong.g_environment">
              <RadioGroup v-model="TreeInformation.Dong.g_environment">
                <Radio v-for="item in GEnvironmentList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="新增古树原因" prop="Dong.reason">
              <RadioGroup v-model="TreeInformation.Dong.reason">
                <Radio v-for="item in ReasonList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="影响生长环境因素" prop="Dong.affect_factor">
              <Input v-model="TreeInformation.Dong.affect_factor" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..." style="width: 500px" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="文化历史照片" prop="Dong.history_pic">
              <div class="demo-upload-list" v-for="(item,index) in historyPicUrlList" :key="index">
                <img :src="'data:image/jpg;base64,'+item"  />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView_history(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemoveList_history(index)"></Icon>
                </div>
              </div>
              <Upload
                :show-upload-list="false"
                name="filename"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleSuccessList_history"
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
              <Modal title="图片预览" v-model="visible_h">
                <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_h" style="width: 100%" />
              </Modal>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="古树历史描述" prop="Dong.history">
              <Input v-model="TreeInformation.Dong.history" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..."
                     :maxlength="300" @input="suggestInput" style="width: 500px" />
              <span class="tips">{{suggestRemnant}}/300</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="树种奇特性状描述" prop="Dong.describe">
              <Input v-model="TreeInformation.Dong.describe" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..." style="width: 500px" />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="树种鉴定记载" prop="Base.jd_record">
              <Input v-model="TreeInformation.Base.jd_record" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..." style="width: 500px" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem prop="Dong.conserve_status" label="保护现状">
              <CheckboxGroup v-model="TreeInformation.Dong.conserve_status">
                <Checkbox v-for="item in ConserveStatusList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem prop="Dong.yhfz_status" label="养护复壮现状">
              <CheckboxGroup v-model="TreeInformation.Dong.yhfz_status">
                <Checkbox v-for="item in YhfzStatusList" :label="item.value" :key="item.value"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>

        <Divider />
        <h4>古树图片：</h4>
        <Row>
          <Col offset="1">
            <FormItem label="古树照片" prop="Pic.path">
              <div class="demo-upload-list" v-for="(item,index) in PicUrlList" :key="index">
                <img :src="'data:image/jpg;base64,'+item"  />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView_pic(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemoveList_pic(index)"></Icon>
                </div>
              </div>
              <Upload
                :show-upload-list="false"
                name="filename"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleSuccessList_pic"
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
              <Modal title="图片预览" v-model="visible_p">
                <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_p" style="width: 100%" />
              </Modal>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="9" offset="1">
            <FormItem label="古树照片的说明" prop="Pic.explain">
              <Input v-model="TreeInformation.Pic.explain" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..." style="width: 500px"
                     class="TextStyle"/>
            </FormItem>
          </Col>
        </Row>

        <Divider />
        <h4>树牌信息：</h4>
        <Row>
          <Col offset="1">
            <FormItem label="有无树牌" prop="Brand.has_brand">
              <RadioGroup v-model="TreeInformation.Brand.has_brand">
                <Radio v-for="item in HasBrandList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col offset="1">
            <FormItem label="现有树牌" prop="Brand.brand_right">
              <RadioGroup v-model="TreeInformation.Brand.brand_right">
                <Radio v-for="item in BrandRightList" :label="item.value" :key="item.value"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="其它后台信息" prop="Brand.is_right">
              <RadioGroup v-model="TreeInformation.Brand.is_right">
                <Radio v-for="item in IsRightList" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset="1">
            <FormItem label="树牌照片" prop="Brand.brand_pic">
              <div class="demo-upload-list" v-for="(item,index) in brandPicUrlList" :key="index">
                <img :src="'data:image/jpg;base64,'+item"  />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView_brand(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemoveList_brand(index)"></Icon>
                </div>
              </div>
              <Upload
                :show-upload-list="false"
                name="filename"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleSuccessList_brand"
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
              <Modal title="图片预览" v-model="visible_b">
                <img :src="'data:image/jpg;base64,'+ showImageUrl" v-if="visible_b" style="width: 100%" />
              </Modal>
            </FormItem>
          </Col>

        </Row>

      </Form>
      <float_bar>
      <div style="text-align: center">
        <Button  @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
        <Button  @click="Save" type="primary" style="margin-right: 30px">保存修改</Button>
        <Button  @click="Submit" type="primary" style="margin-right: 30px">提交修改</Button>
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
  AddBasicProperty,
  AddDynamicProperty, AddGeoProperty, AddPicRecord, AddTreeBrand, getBasic,
  getOneTreeBaseInfo, postTjxmRecord,
  queryClassTypes,
  queryFamilyTypes,
  queryGenusTypes,
  updateBasic, updateDynamic, updateBrand, updateGeo, updatePic, updateTjxmRecord,
  getOneTjxmRecord, queryTreeBasicProperty, queryTjxmRecord
} from "@/api/table";
import {ShowPic} from "@/api/upload";
import {dateToString, forEach} from "@/libs/tools";
import name from "@/view/tools-methods/name.json"
import {
  brand_rightList, conserve_statusList, g_environmentList, g_vigorList,
  has_brandList, is_rightList,
  is_signedList,
  levelList,
  ownerList,
  palceList,
  placing_characterList,
  reasonList, yhfz_statusList
} from "@/view/survey/right_base_options";
import Float_bar from "_c/FloatBar/float_bar";
import {checkLat, checkLon} from "@/view/tools-methods/someValidateRule";

export default {
  name: "BasicInformation",
  components: {Float_bar},
  data :function () {
    return {
      showModal: false,
      options:[],
      tree_code: this.$route.params.tree_code,
      TreeInformation: {
        tree_code: undefined,
        Base: {
          id: 0,
          dizhi: undefined,
          zw_name: '', // 中文名（即树种）
          ld_name: '', // 拉丁名
          bm_name: '', // 别名
          family: '', // 科
          genus: '', // 属
          treetype: [],

          province: '', // 省
          city: '', // 市
          area: '', // 区
          town: '', // 乡镇/街道
          village: '', // 村/居委会
          place_name: '', // 小地名

          palce: '', // 生长场所
          placing_character: '', // 分布特点
          owner: '', // 权属
          level: '', // 古树等级

          character_code: 0, // 特征代码
          jd_record: '', // 树种鉴定记载
          gh_unit: '', // 管护单位
          username: '', // 管护人
          is_signed: 0, // 是否签订管护责任书
          tree_code: '1',
        },
        Position: {
          id: 0,
          province_code: '', // 省
          city_code: '', // 市
          area_code: '', // 区
          town_code: '', // 乡镇/街道

          longitude: 0, // 经度
          latitude: 0, // 纬度
          elevation: 0, // 海拔
          aspect: '', // 坡向
          slope: 0, // 坡度
          slope_position: '', // 坡位
          tree_code: '',
        },
        Dong: {
          id: 0,
          investigate_id: '1', // 调查顺序号
          describe: '', // 树木奇特性状描述
          reason: '', // 新增古树名木原因
          affect_factor: '', // 影响生长环境因素
          height: 0, // 树高
          bust: 0, // 胸围
          c_average: 0, // 冠幅平均
          c_dx: 0, // 冠幅东西
          c_nb: 0, // 冠幅南北
          g_vigor: '', // 生长势
          g_environment: '', //  生长环境
          real_age: 0, // 真实树龄
          estimate_age: 0, // 预估树龄
          basis: '', // 树龄估测依据
          history: '', // 古树历史信息描述
          history_pic: [], // 古树历史信息图片
          conserve_status: [], // 保护现状
          yhfz_status: [], // 养护复壮现状
          username: '', // 调查人
          investigate_time: '', // 调查日期
          tree_code: '1',
        },
        Pic: {
          id: 0,
          path: [], // 图片路径
          explain: '', // 图片说明
          update_time: '', // 更新时间
          tree_code: '1',
        },
        Brand: {
          id: 0,
          has_brand: 0, // 有无树牌
          is_right: 0, // 其他后台信息是否准确
          content: '', // 不准确需改正的内容
          brand_right: '', // 现有树牌信息是否准确
          brand_pic: [], // 树牌照片
          update_time: '', // 更新时间
          tree_code: '1',
        },

      },

      tjxm_record:{
        id: 0,
        t_id: 0,
        type: '基本信息',
        username: '',
        status: '',
        type_yw: 'BasicInformation',
        time: '',
        tree_code: '',
      },

      date: new Date(),
      suggestRemnant: 300,
      IsSignedList: is_signedList,
      LevelList: levelList,

      PalceList: palceList,
      PlacingCharacterList: placing_characterList,
      OwnerList: ownerList,
      ReasonList: reasonList,
      HasBrandList: has_brandList,
      BrandRightList: brand_rightList,
      IsRightList: is_rightList,
      GVigorList: g_vigorList,
      GEnvironmentList: g_environmentList,
      ConserveStatusList: conserve_statusList,
      YhfzStatusList: yhfz_statusList,

      showImageUrl: '',

      brandPicUrlList: [],
      visible_b: false,
      i_b: 0,

      visible_h:false,
      i_h: 0,
      historyPicUrlList: [],

      visible_p:false,
      i_p: 0,
      PicUrlList: [],


      ruleValidate: {
        tree_code: [{ required: true, message: '请输入古树编号' }],
        'Dong.investigate_id': [{ required: true,  message: '请输入调查顺序号' }],
        'Base.zw_name': [{ required: true, message: '请选择中文名' }],
        'Base.ld_name': [{ required: true, message: '请选择拉丁名' }],
        'Base.treetype': [{ required: true, message: '请选择科属种' }],
        'Base.genus': [{ required: true, message: '请选择属' }],
        'Dong.investigate_time': [{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }],
        'Dong.conserve_status':[{required:true, message: '请选择保护现状'}],
        'Dong.yhfz_status':[{required:true, message: '请选择养护复状现状'}],
        'Base.dizhi': [{required:true, message: '请选择'}],
        'Base.level': [{required:true, message: '请选择'}],
        'Dong.username':[{required:true, message: '请填写',trigger:'blur'}],
        'Position.longitude':[{required:true, validator: checkLon, message: '请填写经度(-180~180,小数限7位)',trigger:'blur'}],
        'Position.latitude':[{required:true, validator: checkLat, message: '请填写纬度(-90~90,小数限7位)',trigger:'blur'}],
        'Base.owner':[{required:true, message: '请选择'}],
        'Base.gh_unit':[{required:true, message: '请填写',trigger:'blur'}],
        'Base.username':[{required:true, message: '请填写',trigger:'blur'}],
        'Dong.real_age':[{required:true, message: '请填写'}],
        'Dong.height':[{required:true, message: '请填写',trigger:'blur'}],
        'Dong.bust':[{required:true, message: '请填写',trigger:'blur'}],
        'Dong.g_vigor':[{required:true, message: '请选择'}],
      },

    }
  },
  created() {
    this.DataTurn(name.contents)
  },
  methods : {

    //将json数据转成级联选择器种的data形式
    DataTurn(data){
      var option=[]
      var keArr=[]
      var shuArr=[]
      var nameArr=[]
      var shuIndex={}
      for (let [index, elem] of data.entries()) {

        if(!keArr.includes(elem.ke)){//如果该科第一次被遍历到，那么直接将科属种全部加入
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
                children: [{ value:elem.lading, label: elem.lading}]
              }]
            }]
          })

          shuIndex[elem.shu]=option[option.length-1].children.length -1

        }else {//该科不是第一次被遍历到, 即已被加入
          let i=keArr.indexOf(elem.ke);// 找到该科第一次被加入时的索引位置


          if(!shuArr.includes(elem.shu)){//该科的属没有被加入,把该属及种加入
            shuArr.push(elem.shu)
            option[i].children.push({
              value: elem.shu,
              label: elem.shu,
              children:[{
                value: elem.name,
                label: elem.name,
                children: [{ value: elem.lading, label: elem.lading }]
              }]
            })

            shuIndex[elem.shu]=option[i].children.length -1

          }else {//如果该属被加入了。
            option[i].children[shuIndex[elem.shu]].children.push({
              value: elem.name,
              label: elem.name,
              children: [{ value: elem.lading, label: elem.lading}]
            })

          }

        }
      }
      this.options=option


    },
    ok(){
      this.showModal = false
      this.$router.push({ path: `/survey/environment/${this.tree_code}` })

    },
    cancel(){
      this.showModal = false
    },
    NextPage(){
      queryTjxmRecord({'tree_code':this.tree_code,'type_yw':'environment'}).then((res=>{
        console.log('%%%%',res)
        if(res.data.total !== 0){
          this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }else {
          this.showModal = true
          // this.$Message.error('该古树的生长环境评价分析尚未填写，请填写')
          // this.$router.push({ path: `/survey/environment/${this.tree_code}` })
        }
      }))
    },

    //获取初始的科属种级联选择器中的值进行格式化
    getTreeType(base){
      let typelist=[base.family,base.genus,base.zw_name,base.ld_name]
      this.TreeInformation.Base.treetype = typelist
    },

    // showLdname (cid) {
    //   console.log(44,cid)
    //   if(cid!==undefined) {
    //     queryClassTypes({'cid': cid}).then((res => {
    //       this.LDnameList = res.data.class_types
    //     }))
    //   }else {
    //     this.LDnameList=[]
    //   }
    // },
    // showLdname (value,selectedData) {
    //   console.log('11',value)
    //   console.log('xx',selectedData)
    //   // console.log('22',this.TreeInformation.Base.treetype)
    //   queryClassTypes({'zw_name':value[2]}).then((res=>{
    //     this.TreeInformation.Base.ld_name = res.data.class_types[0].ld_name
    //   }))
    // },


    // // 科属种的级联选择器的数据
    // fetchOptions(){
    //   queryFamilyTypes().then((family=>{
    //     var family = family.data.species_types
    //
    //     for(let i in family) {
    //       console.log('2',family[i])
    //       this.options.push({
    //           value: family[i].fname,
    //           label: family[i].fname,
    //           children: []
    //         }
    //       )
    //
    //       queryGenusTypes({'fid': family[i].fid}).then((genus_res=>{
    //         var Genus=genus_res.data.genus_types
    //         console.log('i:',i, genus_res)
    //         for(let j in Genus){
    //           this.options[i].children.push({
    //             value: Genus[j].genus,
    //             label: Genus[j].genus,
    //             children: []
    //           })
    //
    //           queryClassTypes({'gid':Genus[j].gid}).then((class_res=>{
    //             var Class=class_res.data.class_types
    //             for(let k in Class){
    //               this.options[i].children[j].children.push({
    //                 value: Class[k].zw_name,
    //                 label: Class[k].zw_name
    //               })
    //             }
    //           }))
    //         }
    //
    //       }))
    //     }
    //
    //
    //
    //
    //     console.log('options',this.options)
    //   }))
    // },

    //更新省市区街道信息
    regionChange (data) {
      console.log(data)
      if(data.province!==null){
        this.TreeInformation.Base.province = data.province.value
        this.TreeInformation.Position.province_code = data.province.key
      }
      if(data.city!==null){
        this.TreeInformation.Base.city = data.city.value
        this.TreeInformation.Position.city_code = data.city.key
      }
      if(data.area!==null){
        this.TreeInformation.Base.area = data.area.value
        this.TreeInformation.Position.area_code = data.area.key
      }
      if(data.town!==null){
        this.TreeInformation.Base.town = data.town.value
        this.TreeInformation.Position.town_code = data.town.key
      }
      console.log(this.TreeInformation)
    },

    NowTree_code() {
      console.error(this.tree_code)
    },


    //文本框字数输入控制
    suggestInput () {
      const txtVal = this.TreeInformation.Dong.history.length
      this.suggestRemnant = 300 - txtVal
    },

    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    Save(){
      this.$refs.Tree_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.TreeInformation.Base.family = this.TreeInformation.Base.treetype[0]
          this.TreeInformation.Base.genus = this.TreeInformation.Base.treetype[1]
          this.TreeInformation.Base.zw_name = this.TreeInformation.Base.treetype[2]
          this.TreeInformation.Base.ld_name = this.TreeInformation.Base.treetype[3]
          this.TreeInformation.Dong.investigate_time = dateToString(this.TreeInformation.Dong.investigate_time, 'yyyy-MM-dd hh:mm:ss')
          this.TreeInformation.Base.investigate_time = this.TreeInformation.Dong.investigate_time
          this.tjxm_record.username = this.TreeInformation.Dong.username
          this.TreeInformation.Brand.update_time=this.TreeInformation.Dong.investigate_time
          this.TreeInformation.Pic.update_time=this.TreeInformation.Dong.investigate_time
          this.tjxm_record.status = '待提交'


          updateBasic(this.tree_code, this.TreeInformation.Base).then((base=>{
            if(base.data.code === 200){
              console.log('base',base.data)
              updateDynamic(this.TreeInformation.Dong.id,this.TreeInformation.Dong).then((dynamic=>{
                if(dynamic.data.code === 200){
                  updateGeo(this.TreeInformation.Position.id,this.TreeInformation.Position).then((geo=>{
                    if(geo.data.code === 200){
                      console.log('xxxxpic',this.TreeInformation.Pic.path)
                      updatePic(this.TreeInformation.Pic.id,this.TreeInformation.Pic).then((pic=>{
                        if(pic.data.code === 200){
                          updateBrand(this.TreeInformation.Brand.id,this.TreeInformation.Brand).then((brand=>{
                            if(brand.data.code === 200){
                              updateTjxmRecord(this.TreeInformation.Base.id,this.tjxm_record).then((tjxm=>{
                                if(tjxm.data.code === 200){
                                  this.$Message.success('修改保存成功')
                                  // setTimeout(()=>{
                                  //   this.$router.push({ path: `/survey/base_survey` })
                                  // },200)
                                }
                              }))
                            }
                          }))
                        }
                      }))
                    }
                  }))
                }
              }))
            }
          }))

        }else {
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
            this.tjxm_record.username = this.TreeInformation.Dong.username
            this.TreeInformation.Brand.update_time=this.TreeInformation.Dong.investigate_time
            this.TreeInformation.Pic.update_time=this.TreeInformation.Dong.investigate_time
            this.tjxm_record.status = '已完成'


            updateBasic(this.tree_code, this.TreeInformation.Base).then((base=>{
              if(base.data.code === 200){
                console.log('base',base.data)
                updateDynamic(this.TreeInformation.Dong.id,this.TreeInformation.Dong).then((dynamic=>{
                  if(dynamic.data.code === 200){
                    updateGeo(this.TreeInformation.Position.id,this.TreeInformation.Position).then((geo=>{
                      if(geo.data.code === 200){
                        console.log('xxxxpic',this.TreeInformation.Pic.path)
                        updatePic(this.TreeInformation.Pic.id,this.TreeInformation.Pic).then((pic=>{
                          if(pic.data.code === 200){
                            updateBrand(this.TreeInformation.Brand.id,this.TreeInformation.Brand).then((brand=>{
                              if(brand.data.code === 200){
                                updateTjxmRecord(this.TreeInformation.Base.id,this.tjxm_record).then((tjxm=>{
                                  if(tjxm.data.code === 200){
                                    this.$Message.success('修改提交成功')
                                    // setTimeout(()=>{
                                    //   this.$router.push({ path: `/survey/base_survey` })
                                    // },200)
                                  }
                                }))
                              }
                            }))
                          }
                        }))
                      }
                    }))
                  }
                }))
              }
            }))

          }else {
            this.$Message.error('请填写完整信息')
          }
      })

    },

    fetchData(){
      getOneTreeBaseInfo(this.tree_code).then((res => {

        console.log('one_tree',res.data)
        this.TreeInformation.Base = res.data.tree_basic_info.basic
        this.TreeInformation.tree_code = this.tree_code
        this.TreeInformation.Position = res.data.tree_basic_info.geo
        this.TreeInformation.Pic = res.data.tree_basic_info.pic
        this.TreeInformation.Brand = res.data.tree_basic_info.brand
        this.TreeInformation.Dong = res.data.tree_basic_info.dynamic
        this.tjxm_record = res.data.tree_basic_info.record
        console.log('record',this.tjxm_record)
        this.picTurnUrl()
        this.getTreeType(this.TreeInformation.Base)
      }))

    },
    picTurnUrl(){
      if(this.TreeInformation.Dong.history_pic.length!==0) {
        this.TreeInformation.Dong.history_pic.forEach((pic_name) => {
            ShowPic(pic_name).then((resp => {
              this.historyPicUrlList.push(resp.data)
            }))
        })
      }

      if(this.TreeInformation.Brand.brand_pic.length!==0) {
        this.TreeInformation.Brand.brand_pic.forEach((pic_name) => {
            ShowPic(pic_name).then((resp => {
              this.brandPicUrlList.push(resp.data)
            }))
        })
      }

      if(this.TreeInformation.Pic.path.length!==0) {
        this.TreeInformation.Pic.path.forEach((pic_name) => {
            ShowPic(pic_name).then((resp => {
              this.PicUrlList.push(resp.data)
            }))
        })
      }
    },

    //文化历史照片
    handleView_history (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_h = true
    },
    handleRemoveList_history (index) {
      // 删除
      this.TreeInformation.Dong.history_pic.splice(index, 1)
      this.historyPicUrlList.splice(index, 1)
    },
    handleSuccessList_history: function (res, file) {
      if (res.code === 500) {
        this.TreeInformation.Dong.history_pic.push(res.path)
        this.i_h++
        ShowPic(res.path).then((resp=>{
          this.historyPicUrlList.push(resp.data)
        }))
      }
    },

    //树牌照片
    handleView_brand (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_b = true
    },
    handleRemoveList_brand (index) {
      // 删除
      this.TreeInformation.Brand.brand_pic.splice(index, 1)
      this.brandPicUrlList.splice(index, 1)
    },
    handleSuccessList_brand: function (res, file) {
      if (res.code === 500) {
        this.TreeInformation.Brand.brand_pic.push(res.path)
        this.i_b++
        ShowPic(res.path).then((resp=>{
          this.brandPicUrlList.push(resp.data)
        }))
      }
    },

    //古树照片
    handleView_pic (imageUrl) {
      this.showImageUrl =  imageUrl
      this.visible_p = true
    },
    handleRemoveList_pic (index) {
      // 删除
      this.TreeInformation.Pic.path.splice(index, 1)
      this.PicUrlList.splice(index, 1)
    },
    handleSuccessList_pic: function (res, file) {
      if (res.code === 500) {
        this.TreeInformation.Pic.path.push(res.path)
        this.i_p++
        ShowPic(res.path).then((resp=>{
          this.PicUrlList.push(resp.data)
          console.log('&&&&&&pic',this.TreeInformation.Pic.path)
        }))
      }
    },
  },
  // created() {
  //   this.fetchData()
  // },
  mounted:function (){
    this.fetchData()

    // this.fetchOptions()

    // setTimeout(()=>{
    //   this.getTreeType(this.TreeInformation.Base)
    //
    // },400)
    console.log('******',this.TreeInformation.Base.treetype)
    // getOneTreeBaseInfo(this.tree_code).then((res => {
    //   console.error(this.tree_code)
    //   console.log('one_tree',res.data)
    //   this.TreeInformation.Base = res.data.tree_basic_info.basic
    //   this.TreeInformation.tree_code = this.tree_code
    //   console.log('----',this.TreeInformation.Base)
    //
    //   this.TreeInformation.Position = res.data.tree_basic_info.geo
    //   this.TreeInformation.Pic = res.data.tree_basic_info.pic
    //   this.TreeInformation.Brand = res.data.tree_basic_info.brand
    //   this.TreeInformation.Dong = res.data.tree_basic_info.dynamic
    //   // this.TreeInformation.Dong.history_pic.forEach((pic_name)=>{
    //   //   console.log('pic_name',pic_name)
    //   //   if(pic_name!== ''){
    //   //     ShowPic(pic_name).then((resp=>{
    //   //       console.log('pic',resp)
    //   //       this.historyPicUrlList.push(resp.data)
    //   //     }))}
    //   // })
    //
    // }))
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

.regionStyle >>> .ivu-form-item-content {
  line-height: 16px;
}
.regionStyle >>> div.rg-select div.rg-select__el div.rg-select__content  {
  font-size: 12px;
}
</style>
