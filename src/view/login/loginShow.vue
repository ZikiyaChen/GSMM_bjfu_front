<template >
  <Row :gutter="15"  style="background:#eee;padding: 20px; " >
    <Col span="6" v-for="(tree, index) in treeList" :key="index">
      <div class="login-show">
        <div class="image-container">
            <Card  style="margin: 6px 6px;"  body-style="padding: 0px "  :bordered="false">
              <viewer>
                <img :src="require(`@/assets/images/loginShowList/${tree.imageName}.jpg`)"/>
              </viewer>
              <div>
                <h3>{{ tree.varieties}} </h3>
                <p>{{ tree.describe }}</p>
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
      treeList:[
        {
        imageName:'image-demo-9',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
        {
        imageName:'image-demo-10',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
        {
        imageName:'image-demo-11',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
        {
        imageName:'image-demo-12',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
        {
        imageName:'image-demo-5',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
        {
        imageName:'image-demo-6',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
        {
        imageName:'image-demo-1',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
        {
        imageName:'image-demo-2',
        varieties:'Lorem',
        describe:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam maiores id debitis dolores doloribus, ad cum a deleniti. Fuga temporibus saepe maxime, maiores deleniti cum fugit quae voluptatum nemo veritatis ducimus asperiores hic eum sint quam distinctio adipisci? Minima beatae quasi laborum eius itaque aperiam in atque, at distinctio explicabo.'
        },
      ]
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
  width: 300px;
  height: 220px;
}
</style>










