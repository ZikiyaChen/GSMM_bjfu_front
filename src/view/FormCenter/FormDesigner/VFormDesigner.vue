<template>
    <div>
<!--      <k-form-design @save="handleSave" />-->
    </div>

</template>

<script>
export default {
  name: "VFormDesigner",
  data() {
    return {

    }
  },
  methods: {
      handleSave(values) {
        this.$message.success("触发保存方法");
        console.log(values);
      }

  }
}
</script>

<style scoped>

</style>
