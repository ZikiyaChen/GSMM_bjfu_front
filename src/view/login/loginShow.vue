<template >
  <Row :gutter="16"  style="background:#eee;padding:20px" >
    <Col span="6">

      <div class="login-show">
<!--          <div class="image-container" v-for="(imageUrl, index) in urlList" :key="index">-->
        <div class="image-container">
            <Card  style="margin: 6px 6px;"  body-style="padding: 0px"  :bordered="false">
              <viewer>
<!--                <img :src="imageUrl">-->
                <img src="../../assets/images/loginShowList/image-demo-1.jpg"/>
              </viewer>
              <div>
                <p>树种：</p>
                <p>描述：</p>
              </div>
          </Card>

        </div>

      </div>

    </Col>
  </Row>


</template>

<script>
export default {
  name: "loginShow",
  data() {
    return {
      urlList: [
        '../../assets/images/loginShowList/image-demo-1.jpg',
        '../../assets/images/loginShowList/image-demo-2.jpg',
        '/src/assets/images/loginShowList/image-demo-3.jpg',
        '/src/assets/images/loginShowList/image-demo-4.jpg',
        '/src/assets/images/loginShowList/image-demo-3.jpg',

      ],
    }
  },

  methods: {
  },


}
</script>

<style scoped>
.login-show {
  display: flex;
  flex-wrap: wrap;
}

.image-container {
  margin: 10px;
  cursor: pointer;
}

.image-container img {
  width: 240px;
  height: 160px;
}
</style>










