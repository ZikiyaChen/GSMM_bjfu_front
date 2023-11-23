import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import store from "@/store";
import iView from "view-design";
import { setToken, getToken, canTurnTo, setTitle,removeToken } from "@/libs/util";
import config from "@/config";
const { homeName } = config;

Vue.use(Router);
const router = new Router({
  routes,
  mode: "history"
});
// 解决重复点击同一路由时，控制台报错16-19行
const VueRoutePush = Router.prototype.push;
Router.prototype.push = function push(to) {
  return VueRoutePush.call(this, to).catch(err => err);
};

const LOGIN_PAGE_NAME = "login";
const TREE_INFO_NAME = 'treeInfoSimple';

const turnTo = (to, access, next) => {
  console.log(access,"----access")
  if (canTurnTo(to.name, access, routes)) next(); // 有权限，可访问
  else next({ replace: true, name: "error_401" }); // 无权限，重定向到401页面
};

router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    if(to.name === TREE_INFO_NAME){
      next();
    }else {
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      });
    }

  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next(); // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    // next({
    //   name: homeName // 跳转到homeName页
    // });
    // localStorage.clear(); // 清空所有 localStorage 数据
    // sessionStorage.clear(); // 清空所有 sessionStorage 数据
    // removeToken();
    next(); // 跳转
    
  } else {

    console.log('@@@@@@@@',JSON.parse(sessionStorage.getItem('store')))
    console.log("---", store.state.user.hasGetInfo);
    if (store.state.user.hasGetInfo) {
      console.log("1111");
      turnTo(to, store.state.user.access, next);
    } else {
      try {

        let result = await store.dispatch("getUserInfo");

        console.log('result',result);
        console.log('state***',store.state)

        let auth = [...result.current_user.role_names];


        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, auth, next);
      } catch (err) {
        setToken("");
        next({
          name: "login"
        });
      }
    }
  }
});

router.afterEach(to => {
  setTitle(to, router.app);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
