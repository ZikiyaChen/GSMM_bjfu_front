<template>
  <Modal
    :value="show">
    <p slot="header" style="color:#ff9900;text-align:center; font-size: 16px">
      <Icon type="ios-information-circle"></Icon>
      <span>删除确认</span>
    </p>
    <div style="text-align:center; font-size: 16px">
      <p>{{content}}</p>
      <P>确认删除请点击“删除”，否则点击“取消”按钮。</P>
      <p></p>
    </div>
    <div slot="footer" style="text-align: center">
      <Button type="error" size="large"  @click="ConfirmDelete">删除</Button>
      <Button size="large" @click="CancelDelete">取消</Button>
    </div>
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
    delete: String,
    content: String
  },
  data(){
    return{

    }
  },
  methods:{
    ConfirmDelete(){
      console.error('!!!!!',this.delete)
      this.$emit('onOK')
    },
    CancelDelete(){
      this.$emit('onCancel')
    }
  }

}
</script>

<style scoped>

</style>
