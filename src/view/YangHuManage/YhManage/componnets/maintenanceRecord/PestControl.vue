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
            <Select
              multiple
              :default-label="controlType.model"
              v-model="controlType.model"
              @on-change="handleControlTypeChange">
              <Option v-for="item in controlType.types" :value="item.project" :key="item.project">{{ item.project }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
    </template>

    <template v-slot:other>
      <FormItem label="防治方法">
        <Row>
          <Col span="24">
            <Select
              multiple
              :default-label="controlMethod.model"
              v-model="controlMethod.model"
              @on-change="handleControlMethodChange">
              <OptionGroup v-for="project in controlMethod.projects" :label="project" :key="project">
              <Option v-for="item in controlMethod.methods[project]" :value="item.id" :key="item.id">{{ item.method }}</Option>
              </OptionGroup>
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
            <Select
              multiple
              :default-label="trapper.model"
              v-model="trapper.model"
              @on-change="handleTrapperChange">
              <Option v-for="item in trapper.names" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="病虫害名称">
        <Row>
          <Col span="24">
            <Select
              multiple
              :default-label="pestName.model"
              v-model="pestName.model"
              @on-change="handlePestNameChange">
              <Option v-for="item in pestName.names" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="防治效果">
        <Row>
          <Col span="24">
            <Select
              :default-label="controlEffect.model"
              v-model="controlEffect.model"
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
import {getPestName, getUnitMaintenanceProjects, queryUnitYhMethods} from "@/api/yh_manage";
import { mapState } from "vuex";
import UserMixin from "@/mixin/UserMixin";

export default {
  name: 'PestControl',
  mixins: [UserMixin],
  components: {
    BasicForm
  },
  computed: {
    ...mapState('maintenanceForm', {
      showFlag: state => state.showFlag,
      otherFormData: state => state.otherFormData
    })
  },
  data () {
    return {
      controlType: {
        model: [],
        types: [],
        typesStr: ''
      },
      controlMethod: {
        model: [],
        methods: {},
        methodsStr: '',
        projects:[]
      },
      potionConcentration: '',
      releasedCreaturesQuantity: '',
      trapper: {
        model: [],
        names: ['诱木（侧柏）', '蛀干害虫植物源引诱剂', '松梢螟诱捕器', '小蠹属诱捕器'],
        namesStr: ''
      },
      pestName: {
        model: [],
        names: [],
        namesStr: ''
      },
      controlEffect: {
        model: [],
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
      queryUnitYhMethods({yh_type:'病虫害防治',projects:option,unit:this.unit}).then(res=>{
        this.controlMethod.methods = res.data.methods
        this.controlMethod.projects = res.data.projects
      })
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
  created () {
    const initializeControlTypes = () => {
      getUnitMaintenanceProjects({yh_type:'病虫害防治',unit: this.unit}).then(message => {
        this.controlType.types = message.data.projects
      })
    }
    initializeControlTypes()

    const initializeControlMethod = () => {
      queryUnitYhMethods({yh_type:'病虫害防治',projects:this.otherFormData.contentType,unit:this.unit}).then(res=>{
        this.controlMethod.methods = res.data.methods
        this.controlMethod.projects = res.data.projects
      })
      // queryYhOptions().then(message => {
      //   let classify = message.data.yh_classify
      //   for (let item of classify) {
      //     if (item.yh_type === '病虫害防治') {
      //       this.controlMethod.methods.push({
      //         label: item.method,
      //         value: item.method
      //       })
      //     }
      //   }
      // })
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

    const initializeTypicalData = () => {
      if (this.showFlag) {
        this.controlType.model = this.otherFormData.contentType
        this.controlMethod.model = this.otherFormData.methods
        this.potionConcentration = this.otherFormData.potionConcentration
        this.releasedCreaturesQuantity = this.otherFormData.releasedCreaturesQuantity
        this.trapper.model = this.otherFormData.trapper
        this.pestName.model = this.otherFormData.pestName
        this.controlEffect.model = this.otherFormData.effects
      }
    }
    initializeTypicalData()
  }

}

</script>

<style scoped>

</style>
