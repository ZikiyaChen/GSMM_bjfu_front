<template>
  <Modal
    :value="show"
    title="新增树种"
    @on-ok="handleOK"
    @on-cancel="handleCancel"
    @on-visible-change="fetchData">

    <Form ref="species_form" :model="species" :rules="ruleValidate" :label-width="70">
      <!--      注意加prop,不然验证不生效-->
      <FormItem label="科" prop="family">
        <AutoComplete v-model="species.family" :data="KeArr" placeholder="请输入或选择科"
                      clearable icon="ios-arrow-dropdown-circle"  @on-change="KeChange">
        </AutoComplete>
      </FormItem>
      <FormItem label="属" prop="genus">
        <AutoComplete v-model="species.genus" placeholder="请输入或选择属" clearable :data="ShuArr"
                      icon="ios-arrow-dropdown-circle"  ></AutoComplete>
      </FormItem>
      <FormItem label="种" prop="zw_name">
        <Input v-model="species.zw_name" placeholder="请输入树种中文名" />
      </FormItem>
      <FormItem label="拉丁名" prop="ld_name">
        <Input v-model="species.ld_name" placeholder="请输入树种拉丁名" />
      </FormItem>
    </Form>

  </Modal>
</template>

<script>
import {AddSpecies, GetKe, GetShu, GetSpeciesById, UpdateSpecies} from "@/api/tree_species";
import {updateWithinField} from "@/libs/tools";

export default {
  name: "UpdateSpeciesModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    onCancel: Function,
    onOK: Function,
    id: Number
  },
  data(){
    return{
      species:{
        family: '',
        genus: '',
        zw_name: '',
        ld_name: ''
      },
      KeArr: [],
      ShuArr: [],
      ruleValidate:{
        family: [{ required: true, trigger: 'change', message: '请填写或选择' }],
        genus: [{ required: true, trigger: 'change', message: '请填写或选择' }],
        zw_name: [{ required: true, trigger: 'blur', message: '请填写' }],
        ld_name: [{ required: true, trigger: 'blur', message: '请填写' }],
      },
    }
  },
  mounted() {
    this.fetchKe()
  },
  methods:{
    fetchData(show){
      if(show){
        GetSpeciesById(this.id).then(res=>{
          if(res.data.code === 200){
            updateWithinField(this.species, res.data.species)
          }
        })
      }

    },
    KeChange(value){
      this.ShuArr = []
      GetShu({'family':value}).then(shu=>{
        var ShuList = shu.data.genuses
        for(let [index, elem] of ShuList.entries()){
          this.ShuArr.push(elem.value)
        }
      })

    },

    fetchKe(){
      GetKe().then(ke=>{
        var KeList = ke.data.families
        for(let [index, elem] of KeList.entries()){
          this.KeArr.push(elem.value)
        }
      })
    },

    handleOK () {
      this.$refs.species_form.validate((valid) => {
        if (valid) {
          this.UpdateInfo = {
            family: this.species.family,
            genus: this.species.genus,
            zw_name: this.species.zw_name,
            ld_name: this.species.ld_name
          }
          UpdateSpecies(this.id, this.UpdateInfo).then(res=>{
            if(res.data.code === 200){
              this.$Message.success('修改成功')
              this.$emit('onOK')
            }else {
              this.$Message.error('修改失败')
            }
          })
        } else {
          this.$Message.error('请填写完整信息')
        }
      })
    },
    handleCancel () {
      this.$emit('onCancel')
    },

  }
}
</script>

<style scoped>

</style>
