<template>
  <Layout style="height: 100%" class="main"
          v-if="userInfo.userInfo.is_admin === true || userInfo.userInfo.is_unitAdmin===true">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
<!--          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />-->
<!--          <img v-show="collapsed" :src="minLogo" key="min-logo" />-->
          <div  v-show="!collapsed" ><span style="font-size: 20px;padding-left: 5px;color: #eeeeee;"><img :src="maxLogo" key="max-logo" style="float: left" />古树名木管理系统</span></div>
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avatar="userAvatar"/>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
<!--          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>-->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>

          <span style="margin-right: 30px;font-size: medium" >
              {{this.userInfo.userInfo.name}}, 您好!
            </span>

<!--          <span style="margin-right: 30px;font-size: medium" >-->
<!--              {{this.name}},  您好!-->
<!--            </span>-->

        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>


  <Layout style="height: 100%" v-else>
    <Header class="header-con" style="color: white; background-color: #001529;height: 60px;line-height: 60px">

      <div class="menu-style">
        <Menu mode="horizontal" theme="dark" :active-name="menuName">
          <MenuItem name="home" :to="{name:'home'}">
            <Icon type="ios-paper" />
            地图首页
          </MenuItem>
          <MenuItem name="base_survey_page" :to="{name:'base_survey_page'}"
                    v-if="userInfo.userInfo.is_dc ===true">
            <Icon type="ios-paper" />
            基本信息
          </MenuItem>
          <MenuItem name="yh_own_work" :to="{name:'yh_own_work'}"
                    v-if="userInfo.userInfo.is_yh === true">
            <Icon type="ios-paper" />
            个人养护
          </MenuItem>
          <MenuItem name="UserInfo" :to="{name:'UserInfo',params:{username:userInfo.userInfo.username}}">
            <Icon type="ios-paper" />
            个人信息
          </MenuItem>
        </Menu>
      </div>

      <div class="logo-style">
        <div><span style="font-size: 20px;padding-left: 5px;color: #eeeeee;">
          <img :src="maxLogo" key="max-logo" style="float: left; height: 40px;width: 40px;margin-top: 10px" />
          古树名木管理系统</span></div>
      </div>
      <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange" style="width: 100%">

        <user :message-unread-count="unreadCount" :user-avatar="userAvatar"/>
        <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px" :lang="local"/>
<!--        <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>-->
        <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>

        <span style="margin-right: 30px;font-size: medium; color: white" >
              Hi {{this.userInfo.userInfo.unit}}  的  {{this.userInfo.userInfo.name}}, 您好!
            </span>
      </header-bar>

    </Header>

    <Content style="height: 100%">
      <Layout class="main-layout-con" style="height: 100%">
<!--            <div class="tag-nav-wrapper">-->
<!--              <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>-->
<!--            </div>-->
      <Header style="background-color: white;height: 40px; line-height: 40px">
          <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
      </Header>
        <Content class="content-wrapper">
          <keep-alive :include="cacheList">
            <router-view/>
          </keep-alive>
          <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
        </Content>
      </Layout>
    </Content>


  </Layout>
</template>

<script>

import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
import {getUserInfo} from "@/api/user";
import UserMixin from '@/mixin/UserMixin'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  mixins: [UserMixin],
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      name: undefined,
      menuName: 'home',
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    getName(){
     console.log('xx',this.userInfo.userInfo)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  created() {
    this.getName()
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    //刷新调查人员和养护人员的menu的activeName
    console.log('route',this.$route)
    if(this.$route.name === 'home'||this.$route.name === 'yh_own_work'){
      this.menuName = this.$route.name
    }else if(this.$route.matched[0].name === 'survey'){
      this.menuName = 'base_survey_page'
    }else if(this.$route.matched[0].name === 'usersCenter'){
      this.menuName = 'UserInfo'
    }


    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    this.getUnreadMessageCount()
  }
}
</script>
<style>
.menu-style {
  position: relative;
  float: left;
}
.logo-style {
  position: relative;
  float: left;
  margin-left: 20%;
}
</style>
