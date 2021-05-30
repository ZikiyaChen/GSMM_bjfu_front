<template>
  <Modal
    :value="show"
    title="提醒"
    @on-ok="handleOK"
    @on-cancel="handleCancel">
    <p>请确定是否要删除该古树的所有信息！！！</p>

  </Modal>
</template>

<script>
export default {
  name: "RightDeleteTree",
  props: {
    show: {
      type:Boolean,
      default:false
    },
    onCancel: Function,
    onOK: Function,
    tree_code: Number
  },
  data(){
    return{

    }
  },
  methods:{
    handleOK(){
      console.error('!!!!!',this.tree_code)
      this.$emit('onOK', this.tree_code)
    },
    handleCancel(){
      this.$emit('onCancel')
    }
  }

}
</script>

<style scoped>

</style>
