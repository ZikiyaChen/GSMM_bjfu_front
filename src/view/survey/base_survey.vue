<template>
<div>
  <Card>
    <h2 slot="title">名木古树信息</h2>
    <Form inline>
      <FormItem label="古树编号:" :label-width="80">
        <Select v-model="model1" style="width:200px">
          <Option v-for="item in codeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="古树等级:" :label-width="80">
        <Select style="width:200px">
          <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
<!--    <Steps :current="2" size="small">-->
<!--      <Step title ="已完成"></Step>-->
<!--      <Step title ="进行中"></Step>-->
<!--      <Step title ="待进行"></Step>-->
<!--      <Step title ="待进行"></Step>-->
<!--    </Steps>-->
<!--    <router-link to=right><button>点我到第二个页面</button></router-link> // 通过按钮进行页面跳转-->
    <Table :columns="columns" :data="tableData" border>
    </Table>
  </Card>
</div>
</template>

<script>
export default {
  name: "base_survey",
  data () {
    return {
      treecode: '',
      columns: [
        {
          title: '古树编号',
          key: 'treecode'
        },
        {
          title: '中文名',
          key: 'zw_name'
        },
        {
          title: '拉丁名',
          key: 'ld_name'
        },
        {
          title: '古树等级',
          key: 'level'
        },
        {
          title: '真实树高',
          key: 'height'
        },
        {
          title: '树龄',
          key: 'age'
        },
        {
          title: '管护人',
          key: 'gh_username'
        }
      ],

      tableData: [
        {
          treecode: '12',
          zw_name: '油松',
          ld_name: 'sdfsdfsd',
          level: '一级',
          height: 10.5,
          age: 300,
          gh_username: 'Lily'
        },
        {
          treecode: '12',
          zw_name: '油松',
          ld_name: 'sdfsdfsd',
          level: '一级',
          height: 10.5,
          age: 300,
          gh_username: 'Lily'
        },
        {
          treecode: '12',
          zw_name: '油松',
          ld_name: 'sdfsdfsd',
          level: '一级',
          height: 10.5,
          age: 300,
          gh_username: 'Lily'
        },
        {
          treecode: '12',
          zw_name: '油松',
          ld_name: 'sdfsdfsd',
          level: '一级',
          height: 10.5,
          age: 300,
          gh_username: 'Lily'
        }
      ],

      codeList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        }
      ],
      model1: '',
      levelList: [
        {
          value: '1',
          label: '一级'
        },
        {
          value: '2',
          label: '二级'
        },
        {
          value: '3',
          label: '三级'
        },
        {
          value: '4',
          label: '名木'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
