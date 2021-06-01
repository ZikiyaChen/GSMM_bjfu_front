<template>
  <Affix :offset-bottom="10">
    <div style="background-color: rgba(249,249,249,0.8);box-shadow:5px 5px 5px  #ffffff;">
      <slot></slot>
    </div>
  </Affix>
</template>

<script>
export default {
  name: "float_bar"
}
</script>

<style scoped>

</style>
