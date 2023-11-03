// ImageViewer.vue
<template>
  <div v-if="visible" @click="hideImage">
    <div class="see-image" :style="{ backgroundColor:background }">
      <img v-drag="greet"
           id="drag"
           class="image"
           :src="currentImg"
           @wheel.prevent="wheel"
           ref="user_image"/>
    </div>
    <div class="close" v-show="closeButtonVisible">
      <Icon @click="close" type="md-close-circle" :size="40" class="close-icon" />
    </div>
    <div class="control" v-show="controlButtonVisible">
      <Icon @click.stop="scaleImage('add')" type="ios-add-circle-outline" :size="24" class="control-icon" />
      <Icon @click.stop="scaleImage('remove')" type="ios-remove-circle-outline" :size="24" class="control-icon" />
      <Icon @click.stop="rotateImage('left')" type="md-undo" :size="24" class="control-icon" />
      <Icon @click.stop="rotateImage('right')" type="md-redo" :size="24" class="control-icon" />
    </div>
  </div>
</template>

<script>
import config from './config'
const {modalOpacity, canClickModalHide, controlButtonVisible, closeButtonVisible} = config;
export default {
  data() {
    return {
      currentImg: '',
      visible: false,
      background: modalOpacity > 1 || modalOpacity <= 0 || typeof modalOpacity !== "number" ? null : 'rgba(0,0,0,' + modalOpacity + ')',
      controlButtonVisible,
      closeButtonVisible,
      rotateDeg: 0,
    }
  },
  methods: {
    close() {
      this.clearImg();
    },
    //接受传来的位置数据，并将数据绑定给data下的val
    greet(val) {
      this.val = val;
    },
    //点击图片之外区域隐藏图片
    hideImage(e) {
      if (!this.visible || (!canClickModalHide && closeButtonVisible)) return;
      document.addEventListener('click', (e) => {
        if (e.target.nodeName !== 'IMG' && e.target.nodeName !== 'BUTTON') {
          this.clearImg();
        }
      });
    },
    //旋转图片
    rotateImage(direction) {
      if(direction === 'left'){
        this.rotateDeg -= 90;
      }else{
        this.rotateDeg += 90;
      }
      this.$refs.user_image.style.transform = `rotate(${this.rotateDeg}deg)`;
      this.$refs.user_image.style.transition = '.3s';
    },
    // 按钮缩放图片
    scaleImage(scale){
      if(scale === 'add'){
        this.$refs.user_image.style.transform = this.$refs.user_image.style.transform + ' scale(1.1)';
      }else{
        this.$refs.user_image.style.transform = this.$refs.user_image.style.transform + ' scale(0.9)';
      }
    },
    // 滚轮缩放图片
    wheel(e) {
      if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) { //当滑轮向上滚动时
          this.$refs.user_image.style.transform = this.$refs.user_image.style.transform + ' scale(1.1)';
        }
        if (e.wheelDelta < 0) { //当滑轮向下滚动时
          this.$refs.user_image.style.transform = this.$refs.user_image.style.transform + ' scale(0.9)';
        }
      } else if (e.deltaY) {  //Firefox滑轮事件
        if (e.deltaY < 0) { //当滑轮向上滚动时
          this.$refs.user_image.style.transform = this.$refs.user_image.style.transform + ' scale(1.1)';
        }
        if (e.deltaY > 0) { //当滑轮向下滚动时
          this.$refs.user_image.style.transform = this.$refs.user_image.style.transform + ' scale(0.9)';
        }
      }
    },
    //当图片隐藏时候的回调
    clearImg() {
      this.visible = false;
      this.rotateDeg = 0;
      document.removeEventListener('click', null);
      setTimeout(() => {
        if (this.$refs.user_image) {
          this.$refs.user_image.style.transform = 'rotate(0deg)';
          this.$refs.user_image.style.left = '';
          this.$refs.user_image.style.top = '';
        }
      }, 100)
    },
  }
}
</script>

<style scoped>
.see-image {
  width: 100%;
  z-index: 9999;
  background: rgba(0, 0, 0, .3);
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: .25s showAimation ease;
}
@keyframes showAimation {
  from {
    opacity: .3;
  }
  to {
    opacity: 1;
  }
}
.image {
  max-width: 400px;
  min-width: 150px;
  position: absolute;
}
.close {
  position: absolute;
  right: 40px;
  top: 40px;
  height: 40px;
  width: 40px;
  color: #515a6e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .3s;
  z-index: 10000;
}
.close:hover {
  transform: rotate(90deg);
  color: #17233d;
}
.close img {
  width: 40px;
  height: 40px;
}
.close-icon {
  cursor: pointer;
}
.control {
  width: 180px;
  height: 48px;
  line-height: 48px;
  margin-left: -90px;
  background: #606266;
  border-radius: 50%;
  position: absolute;
  bottom: 40px;
  left: 50%;
  color: #fff;
  border-color: #fff;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.control-icon {
  margin: 0 6px;
  cursor: pointer;
}
</style>
