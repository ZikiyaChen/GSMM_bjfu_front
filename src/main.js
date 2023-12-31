// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import vRegion from 'v-region'
import VueAMap from "vue-amap";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import UploadImage from "@/view/RadarDetection/UploadImage";
import global from '../src/libs/Global'
import Viewer from "v-viewer";
import 'viewerjs/dist/viewer.css';
import 'iview/dist/styles/iview.css';
import imageViewer from '@/view/components/image/imageViewer';// 图片查看
import 'element-ui/lib/theme-chalk/index.css';




Vue.use(Viewer)
Viewer.setDefaults({
  navbar: true, //底部缩略图
  toolbar: true, //底部工具栏
  button: false, //右上角按钮
  title: true, //当前图片标题
  movable: true, //是否可以移动
  zoomable: true, //是否可以缩放
  transition: false //使用 CSS3 过度
})

// import VForm from 'vform-builds'  //引入VForm库
// import VForm from 'vform-iview-builds'  //引入iView版本VForm库文件
// import 'vform-builds/dist/VFormDesigner.css'  //引入VForm样式
// import { KFormDesign, KFormBuild } from "k-form-design";
// import "k-form-design/lib/k-form-design.css";
//
// Vue.use(KFormDesign);
// Vue.use(KFormBuild);
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')
Vue.use(vRegion)
Vue.use(VueAMap)
Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(UploadImage)
Vue.use(imageViewer)

Vue.use(ElementUI);
// Vue.use(VForm)  //全局注册VForm(同时注册了v-form-designer和v-form-render组件)


/**
 * * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.GLOBAL = global
/**
 * 注册指令
 */

importDirective(Vue)
Vue.directive('clickOutside', clickOutside)
VueAMap.initAMapApiLoader({
  key: '2a1c00ed232292fafd9e37bde169cdf5',
  plugin: [
    "AMap.Autocomplete", //输入提示插件
    "AMap.PlaceSearch", //POI搜索插件
    "AMap.Scale", //右下角缩略图插件 比例尺
    "AMap.OverView", //地图鹰眼插件
    "AMap.ToolBar", //地图工具条
    "AMap.MapType", //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    "AMap.PolyEditor", //编辑 折线多，边形
    "AMap.CircleEditor", //圆形编辑器插件
    "AMap.Geolocation", //定位控件，用来获取和展示用户主机所在的经纬度位置
    'AMap.DistrictSearch',
    'AMap.DistrictExplorer'
  ],
  v: '1.4.4'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App),
})
