<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">名木古树每木调查表</h2>
      <Form :label-width="120" label-position="right" ref="Tree_form" :model="TreeInformation" :rules="ruleValidate" inline>
        <h4>基本信息：</h4>
        <Row>
          <Col span="9" offset="1">
            <FormItem label="古树编号" prop="tree_code">
              <Input v-model="TreeInformation.tree_code" placeholder="请输入古树编号" style="width: 200px"></Input>
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
              <DatePicker v-model="TreeInformation.Dong.investigate_time"  type="date" placeholder="请选择日期"></DatePicker>
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
            <FormItem label="特征代码" prop="Base.character_code">
              <Input v-model="TreeInformation.Base.character_code" placeholder="请输入特征代码" style="width: 200px"></Input>
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
            <FormItem label="树高" prop="Dong.height">
              <Input v-model="TreeInformation.Dong.height" placeholder="请输入树高" style="width: 160px">
                <span slot="append">m</span>
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
          <Col span="9">
            <FormItem label="胸围" prop="Dong.bust">
              <Input v-model="TreeInformation.Dong.bust" placeholder="请输入古树的胸围" style="width: 160px">
                <span slot="append">cm</span>
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Divider />
         <h4>树种信息：</h4>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="科" prop="Base.family">
              <Select v-model="TreeInformation.Base.family" placeholder="请选择科" style="width: 200px" clearable>
                <Option v-for="item in FamilyList" :value="item.fid" :key="item.fid">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="属" prop="Base.genus">
              <Select v-model="TreeInformation.Base.genus" placeholder="请选择属" style="width: 200px" clearable>
                <Option v-for="item in FamilyList" :value="item.fid" :key="item.fid">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="中文名" prop="Base.zw_name">
              <Select v-model="TreeInformation.Base.zw_name" placeholder="请选择中文名" style="width: 200px" clearable>
                <Option v-for="item in FamilyList" :value="item.fid" :key="item.fid">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="拉丁名" prop="Base.ld_name">
              <Select v-model="TreeInformation.Base.ld_name" placeholder="请选择拉丁名" style="width: 200px" clearable>
                <Option v-for="item in FamilyList" :value="item.fid" :key="item.fid">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9" offset="1">
            <FormItem label="俗名" prop="Base.bm_name">
              <Select v-model="TreeInformation.Base.bm_name" placeholder="请选择别名" style="width: 200px" clearable>
                <Option v-for="item in FamilyList" :value="item.fid" :key="item.fid">{{ item.label }}</Option>
              </Select>
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
            <FormItem label="省市区街道" class="regionStyle">
              <v-region @values="regionChange" :town="true"></v-region>
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

<!--        <Row>-->
<!--          <Col style="margin-left: 120px;margin-bottom: 15px" offset="2">-->
<!--            <div id="mapContainer" style="width: 500px;height: 200px">-->
<!--                <Input style="width: 300px;float: left" v-model="address" placeholder="请输入位置进行经纬度查询" search enter-button @on-search="getCode">-->
<!--                </Input>-->
<!--            </div>-->
<!--          </Col>-->
<!--        </Row>-->
<!--        <Row>-->

<!--        </Row>-->
<!--        <Row style="margin-bottom: 20px" offset="2">-->
<!--          <Col span="8">-->
<!--              <Input style="width: 160px;margin-left: 120px" v-model="lng" disabled>-->
<!--                <span slot="prepend">经  度</span>-->
<!--              </Input>-->
<!--          </Col>-->
<!--          <Col span="6">-->
<!--              <Input style="width: 160px" v-model="lat" disabled>-->
<!--                <span slot="prepend">纬  度</span>-->
<!--              </Input>-->
<!--          </Col>-->
<!--        </Row>-->

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
              <InputNumber v-model="TreeInformation.Dong.c_average"
                           :step="0.01"
                           :formatter="value => `${value}  m`"
                           :parser="value => value.replace('  m', '')"></InputNumber>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="东西" prop="Dong.c_dx">
              <InputNumber v-model="TreeInformation.Dong.c_dx"
                           :step="0.01"
                           :formatter="value => `${value}  m`"
                           :parser="value => value.replace('  m', '')"></InputNumber>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="南北" prop="Dong.c_nb">
              <InputNumber v-model="TreeInformation.Dong.c_nb"
                           :step="0.01"
                           :formatter="value => `${value}  m`"
                           :parser="value => value.replace('  m', '')"></InputNumber>
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
          <div class="demo-upload-list" v-for="(item,index) in brandPicUrlList" :key="index">
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
        <Button @click="NextPage" type="primary" style="margin-right: 30px">下一页</Button>
        <Button  @click="Submit" type="primary" style="margin-right: 30px">提交</Button>
      </div>
      <Button @click="Tree">古树编号</Button>
    </Card>
  </div>
</template>

<script>
import AMap from 'AMap';
import { is_signedList, levelList, familyList, palceList, placing_characterList,
  ownerList, reasonList, has_brandList, brand_rightList, is_rightList, g_vigorList,
  g_environmentList, conserve_statusList, yhfz_statusList } from "@/view/survey/right_base_options";
import { dateToString } from "@/libs/tools";
import axios from "@/libs/api.request";
import { getTest, AddBasicProperty, AddDynamicProperty, AddGeoProperty, AddTreeBrand, AddPicRecord } from "@/api/table";

export default {
  name: "right",
  data () {
    return {
      date: new Date(),
      suggestRemnant: 300,
      IsSignedList: is_signedList,
      LevelList: levelList,
      FamilyList: familyList,
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

      TreeInformation: {
        tree_code: '1',
        Base: {
          zw_name: '', // 中文名（即树种）
          ld_name: '', // 拉丁名
          bm_name: '', // 别名
          family: '', // 科
          genus: '', // 属

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
          adcode: 0, // 行政区划编码
          longitude: 0, // 经度
          latitude: 0, // 纬度
          elevation: 0, // 海拔
          aspect: '', // 坡向
          slope: 0, // 坡度
          slope_position: '', // 坡位
          tree_code: 1,
        },
        Dong: {
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
          history_pic: '', // 古树历史信息图片
          conserve_status: [], // 保护现状
          yhfz_status: [], // 养护复壮现状
          username: '', // 调查人
          investigate_time: '', // 调查日期
          tree_code: '1',
        },
        Pic: {
          path: '', // 图片路径
          explain: '', // 图片说明
          update_time: '', // 更新时间
          tree_code: '1',
        },
        Brand: {
          has_brand: 0, // 有无树牌
          is_right: 0, // 其他后台信息是否准确
          content: '', // 不准确需改正的内容
          brand_right: '', // 现有树牌信息是否准确
          brand_pic: '', // 树牌照片
          update_time: '', // 更新时间
          tree_code: '1',
        },

      },

      brandPicUrlList: [],
      showImageUrl: '',
      visible: false,
      i: 0,

      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,

      map: null,
      lng: null,
      lat: null,

      address: '',

      ruleValidate: {
        tree_code: [{ required: true, message: '请输入古树编号' }],
        'Dong.investigate_id': [{ required: true, trigger: 'blur', message: '请输入调查顺序号' }],
        'Base.zw_name': [{ required: true, message: '请选择中文名' }],
        'Base.ld_name': [{ required: true, message: '请选择拉丁名' }],
        'Base.family': [{ required: true, message: '请选择科' }],
        'Base.genus': [{ required: true, message: '请选择属' }],
        'Dong.investigate_time': [{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }]
      },

    }
  },
  mounted () {
    this.loadMap()
  },
  methods: {
    Tree () {
      console.log(11, this.TreeInformation.tree_code)
      console.log(typeof (this.TreeInformation.tree_code))
    },
    Save: function () {
      // this.changeLoading()
      this.$refs.Tree_form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.TreeInformation.Dong.investigate_time = dateToString(this.TreeInformation.Dong.investigate_time, 'yyyy-MM-dd hh:mm:ss')
          this.TreeInformation.Pic.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          this.TreeInformation.Brand.update_time = dateToString(this.date, 'yyyy-MM-dd hh:mm:ss')
          console.error(this.TreeInformation)
          this.$Message.success('保存成功')
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    Submit: function () {
      this.TreeInformation.Base.tree_code = this.TreeInformation.tree_code
      // 基本信息
      AddBasicProperty(this.TreeInformation.Base).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // 动态属性
      AddDynamicProperty(this.TreeInformation.Dong).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // 地理信息
      AddGeoProperty(this.TreeInformation.Position).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // 树牌信息
      AddTreeBrand(this.TreeInformation.Brand).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // 古树图片记录
      AddPicRecord(this.TreeInformation.Pic).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // loadMap () {
    //   let that = this
    //   that.map = new AMap.Map("mapContainer", {
    //     resizeEnable: true
    //   })
    //   console.log(that.map)
    // },
    //  跳转到下一页，生长环境分析
    NextPage () {
      this.$router.push({ path: `/survey/environment/${this.TreeInformation.tree_code}` })
    },

    handleRemove (file) {
      console.log(file);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload (file) {
      console.log(file);
    },

    loadMap () {
      this.map = new AMap.Map("mapContainer", {
        resizeEnable: true
      })
      console.log(this.map)
    },
    suggestInput () {
      const txtVal = this.TreeInformation.Dong.history.length
      this.suggestRemnant = 300 - txtVal
    },
    regionChange (data) {
      console.log(data)
      this.TreeInformation.Base.province = data.province.value
      this.TreeInformation.Base.city = data.city.value
      this.TreeInformation.Base.area = data.area.value
      this.TreeInformation.Base.town = data.town.value
      console.error(this.TreeInformation)
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
    handleRemoveList (index) {
      // 删除
      this.brandPicUrlList.splice(index, 1)
    },
    handleSuccessList: function (res, file) {
      if (res.code === 500) {
        this.brandPicUrlList.push(res.path)
        this.i++
      }
    },

    // var address  = document.getElementById('address').value;
    getCode (address) {
      // let map = new AMap.Map("mapContainer", {
      //   resizeEnable: true
      // })
      let that = this
      console.log(address)
      let geocoder = new AMap.Geocoder({
        city: "010", // 城市设为北京，默认：“全国”
      });

      geocoder.getLocation(address, function (status, result) {
        console.log(11, result)
        if (status === 'complete' && result.geocodes.length) {
          that.lng = result.geocodes[0].location.lng
          that.lat = result.geocodes[0].location.lat
          console.error(that.lng, that.lat)
          let marker = new AMap.Marker({
            position: new AMap.LngLat(that.lng, that.lat)
          });
          that.map.add(marker)
          that.map.setFitView(marker); // 地图根据描点自适应显示（自动定位放大到标点处）
        } else {
          console.error('根据地址查询位置失败');
        }
      });
    }

  }
}

</script>

<style scoped>

.ivu-radio-wrapper {
  margin-right: 25px;
}
.tips {
  position: absolute;
  bottom: 0;
  right: 0;
  float:right;
  color:#999;
}
.regionStyle >>> .ivu-form-item-content {
  line-height: 16px;
}
.regionStyle >>> div.rg-select div.rg-select__el div.rg-select__content  {
  font-size: 12px;
}
</style>
