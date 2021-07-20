<template>
  <basic-form
    :show="true"
    @basicConfirm="handleBasicConfirm"
    @basicCancel="handleBasicCancel">
    <p style="text-align: center;font-size: 16px;font-weight: bolder;margin-bottom: 15px"
       slot="header">
      病虫害防治</p>
    <template v-slot:qualityOrType>
      <FormItem label="防治类型">
        <Row>
          <Col span="24">
            <Select v-model="controlType.model"
                    @on-change="handleControlTypeChange"
                    multiple>
              <Option v-for="item in controlType.types" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </template>

    <template v-slot:other>
      <FormItem label="防治方法">
        <Row>
          <Col span="24">
            <Select v-model="controlMethod.model"
                    @on-change="handleControlMethodChange"
                    multiple>
              <Option v-for="item in controlMethod.methods" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="药剂浓度">
        <Input v-model="potionConcentration"></Input>
      </FormItem>

      <FormItem label="投放生物数量">
        <Input v-model="releasedCreaturesQuantity"></Input>
      </FormItem>

      <FormItem label="诱捕器名称">
        <Row>
          <Col span="24">
            <Select v-model="trapper.model"
                    @on-change="handleTrapperChange"
                    multiple>
              <Option v-for="item in trapper.names" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="病虫害名称">
        <Row>
          <Col span="24">
            <Select v-model="pestName.model"
                    @on-change="handlePestNameChange"
                    multiple>
              <Option v-for="item in pestName.names" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="防治效果">
        <Row>
          <Col span="24">
            <Select v-model="controlEffect.model"
                    @on-change="handleEffectChange">
              <Option v-for="item in controlEffect.effects" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </template>

  </basic-form>
</template>

<script>
import BasicForm from "@/view/YangHuManage/YhManage/componnets/maintenanceRecord/layout/BasicForm";
import { getPestName, queryYhOptions } from "@/api/yh_manage";

export default {
  name: 'PestControl',
  components: {
    BasicForm
  },
  data () {
    return {
      controlType: {
        modal: '',
        types: ['生物防治', '物理防治', '化学防治'],
        typesStr: ''
      },
      controlMethod: {
        modal: '',
        methods: [],
        methodsStr: ''
      },
      potionConcentration: '',
      releasedCreaturesQuantity: '',
      trapper: {
        modal: '',
        names: ['诱木（侧柏）', '蛀干害虫植物源引诱剂', '松梢螟诱捕器', '小蠹属诱捕器'],
        namesStr: ''
      },
      pestName: {
        modal: '',
        names: [],
        namesStr: ''
      },
      controlEffect: {
        modal: '',
        effects: ['良好', '一般', '不好'],
        effectsStr: ''
      }
    }
  },
  methods: {
    handleBasicCancel () {
      this.$emit('cancelOrConfirm', 'cancel', null)
    },
    handleControlTypeChange (option) {
      this.controlType.typesStr = option.join(',')
    },
    handleControlMethodChange (option) {
      this.controlMethod.methodsStr = option.join(',')
    },
    handleTrapperChange (option) {
      this.trapper.namesStr = option.join(',')
    },
    handlePestNameChange (option) {
      this.pestName.namesStr = option.join(',')
    },
    handleEffectChange (value) {
      this.controlType.effectsStr = value
    },
    handleBasicConfirm (data) {
      const temp = {
        project: this.controlType.typesStr,
        method: this.controlMethod.methodsStr,
        concentration: this.potionConcentration,
        bio_num: this.releasedCreaturesQuantity,
        trap_name: this.trapper.namesStr,
        pest_name: this.pestName.namesStr,
        efficiency: this.controlType.effectsStr
      }
      const result = Object.assign({}, temp, data)
      this.$emit('cancelOrConfirm', 'confirm', result)
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
