<template>
    <iframe :src="pdfSrc"  style="width: 100%; height: 100%"></iframe>
</template>

<script>
export default {
  name: "PdfModal",
  data(){
    return{
      pdfSrc: this.$route.query.src
    }
  },
  methods: {

  },
  mounted() {
    console.log('###',this.$route.query.src)
  }

}
</script>

<style scoped>

</style>
