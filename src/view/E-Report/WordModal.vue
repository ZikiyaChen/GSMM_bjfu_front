<template>
  <div class="word-wrap">
  <div id="wordView" v-html="vHtml"></div>
  </div>
</template>

<script>



import mammoth from 'mammoth';
export default {
  name: "WordModal",

  created() {

    this.readExcelFromRemoteFile(this.$route.query.src);

  },

  data(){
    return{
      vHtml: '',
      wordSrc: this.$route.query.src

    }
  },
  mounted() {

  },
  methods:{
    readExcelFromRemoteFile: function (url) {
      var vm = this;
      var xhr = new XMLHttpRequest();
      xhr.open("get", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (xhr.status === 200) {
          mammoth
            .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
            .then(function (resultObject) {
              vm.$nextTick(() => {
                // document.querySelector("#wordView").innerHTML =
                // resultObject.value;
                vm.vHtml = resultObject.value;
              });
            });
        }
      };
      xhr.send();
    },

  }

}
</script>

<!--<style scoped>-->
<!--div{-->
<!--  background-color: #F9F9F9;-->
<!--}-->
<!--</style>-->
<style lang="less">
.word-wrap{
  padding: 50px;
  background-color: white;
  align-items: center;
  img{
    width: auto;
    height: 100px;
  }
}
</style>
