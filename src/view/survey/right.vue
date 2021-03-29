<template>
  <div>
    <Card>
      <h2 slot="title" style="text-align: center">名木古树每木调查表</h2>
      <Form :label-width="120" label-position="right" inline>
        <h4>基本信息：</h4>
        <Row>
          <Col span="9">
            <FormItem label="古树编号">
              <Input v-model="tree_code" placeholder="请输入古树编号" style="width: 220px"></Input>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="调查顺序号">
              <Input v-model="investigate_id" placeholder="请输入调查顺序号" style="width: 220px"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col flex="100px"></Col>
          <Col span="9">
            <FormItem label="管护单位">
              <Input v-model="ghdw" placeholder="请输入管护单位名称" style="width: 220px"></Input>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="是否签订管护责任书">
              <RadioGroup v-model="is_signed">
                <Radio label="是"></Radio>
                <Radio label="否"></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9">
            <FormItem label="管护人">
              <Input v-model="gh_username" placeholder="请输入管护人姓名" style="width: 220px"></Input>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="特征代码">
              <Input v-model="tz_code" placeholder="请输入特征代码" style="width: 220px"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col flex="100px"></Col>
          <Col span="9">
            <FormItem label="古树等级">
              <Select v-model="level" placeholder="请选择古树等级" style="width: 220px" clearable>
                <Option v-for="item in familyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider />
         <h4>树种信息：</h4>

        <Row>
          <Col flex="100px"></Col>
          <Col span="9">
            <FormItem label="科">
              <Select v-model="family" placeholder="请选择科" style="width: 220px" clearable>
                <Option v-for="item in familyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="属">
              <Select v-model="genus" placeholder="请选择属" style="width: 220px" clearable>
                <Option v-for="item in familyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col flex="100px"></Col>
          <Col span="9">
            <FormItem label="中文名">
              <Select v-model="zw_name" placeholder="请选择中文名" style="width: 220px" clearable>
                <Option v-for="item in familyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="拉丁名">
              <Select v-model="ld_name" placeholder="请选择拉丁名" style="width: 220px" clearable>
                <Option v-for="item in familyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="9">
            <FormItem label="俗名">
              <Select v-model="other_name" placeholder="请选择别名" style="width: 220px" clearable>
                <Option v-for="item in familyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Divider />
        <h4>位置信息：</h4>
        <Row>
          <Col span="9">
            <FormItem label="古树历史描述">
              <Input v-model="history" type="textarea" :rows="4" placeholder="Enter something..."
                     :maxlength="300" @input="suggestInput" style="width: 500px" />
              <span class="tips">{{suggestRemnant}}/300</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  name: "right",
  data () {
    return {
      suggestRemnant: 300,
      tree_code: '',
      investigate_id: '',
      family: '',
      genus: '',
      zw_name: '',
      ld_name: '',
      other_name: '',
      gh_username: '',
      tz_code: '',
      level: '',
      ghdw: '',
      history: '',
      is_signed: '',
      familyList: [
        {
          value: '1',
          label: '桑科'
        },
        {
          value: '2',
          label: '樟科'
        },
        {
          value: '3',
          label: '无患子科'
        }
      ]
    }
  },
  methods: {
    suggestInput () {
      const txtVal = this.history.length
      this.suggestRemnant = 300 - txtVal
    }
  }
}

</script>

<style scoped>
.ivu-radio-wrapper {
  margin-right: 30px;
}
.tips {
  position: absolute;
  bottom: 0;
  right: 0;
  float:right;
  color:#999;
}
</style>
