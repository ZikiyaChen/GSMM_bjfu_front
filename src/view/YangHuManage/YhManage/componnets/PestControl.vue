<template>
  <basic-form
    :show="showPestControl"
    @basicCancel="handleBasicCancel">
    <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
       slot="header">
      病虫害防治</p>

    <FormItem label="防治类型" slot="qualityOrType">
      <Row>
        <Col span="24">
          <Select v-model="controlType.model" multiple>
            <Option v-for="item in controlType.types" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>

    <FormItem label="防治方法" slot="other">
      <Row>
        <Col span="24">
          <Select v-model="controlMethod.model" multiple>
            <Option v-for="item in controlMethod.methods" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>

    <FormItem label="药剂浓度" slot="other">
      <Input v-model="potionConcentration"></Input>
    </FormItem>

    <FormItem label="投放生物数量" slot="other">
      <Input v-model="releasedCreaturesQuantity"></Input>
    </FormItem>

    <FormItem label="诱捕器名称" slot="other">
      <Row>
        <Col span="24">
          <Select v-model="trapper.model" multiple>
            <Option v-for="item in trapper.names" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="病虫害名称" slot="other">
      <Row>
        <Col span="24">
          <Select v-model="pestName.model" multiple>
            <Option v-for="item in pestName.names" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>

    <FormItem label="防治效果" slot="other">
      <Row>
        <Col span="24">
          <Select v-model="controlEffect.model">
            <Option v-for="item in controlEffect.effects" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </FormItem>
  </basic-form>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/layout/BasicForm";
import { getPestName, queryYhOptions } from "@/api/yh_manage";

export default {
  name: 'PestControl',
  components: {
    BasicForm
  },
  props: {
    showPestControl: Boolean
  },
  data () {
    return {
      controlType: {
        modal: '',
        types: ['生物防治', '物理防治', '化学防治']
      },
      controlMethod: {
        modal: '',
        methods: []
      },
      potionConcentration: '',
      releasedCreaturesQuantity: '',
      trapper: {
        modal: '',
        names: ['诱木（侧柏）', '蛀干害虫植物源引诱剂', '松梢螟诱捕器', '小蠹属诱捕器']
      },
      pestName: {
        modal: '',
        names: []
      },
      controlEffect: {
        modal: '',
        effects: ['良好', '一般', '不好']
      }
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('pestControlCancel')
    }
  },
  beforeMount () {
    const initializeControlTypes = () => {
      this.controlType.types = this.controlType.types.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeControlTypes()

    const initializeControlMethod = () => {
      queryYhOptions().then(message => {
        let classify = message.data.yh_classify
        for (let item of classify) {
          if (item.yh_type === '病虫害防治') {
            this.controlMethod.methods.push({
              label: item.method,
              value: item.method
            })
          }
        }
      })
    }
    initializeControlMethod()

    const initializeTrapper = () => {
      this.trapper.names = this.trapper.names.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeTrapper()

    const initializePestName = () => {
      getPestName().then(message => {
        let names = message.data.names
        for (let item of names) {
          this.pestName.names.push({
            label: item.name,
            value: item.name
          })
        }
      })
    }
    initializePestName()

    const initializeEffect = () => {
      this.controlEffect.effects = this.controlEffect.effects.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
    initializeEffect()
  }

}

</script>

<style scoped>

</style>
