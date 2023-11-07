<template>
  <div class="login">
    <!-- 顶部导航条 -->
    <div class="layout">
      <Menu mode="horizontal" theme="primary" active-name='activeMenu' @on-select="handleMenuSelect">
        <div class="layout-logo">
          <img class="logo_tree" src="../../assets/images/bjfu_logo.jpg" alt="logo">
          <span class="system_name">北京林业大学古树名木管护系统</span>
        </div>
        <div class="layout-nav">
          <Menu-item name="1"  class="nav-item">
            <Icon type="ios-search" size="25"></Icon>
            古树查询
          </Menu-item>
          <Menu-item name="2" class="nav-item">
            <Icon type="ios-images" size="25"></Icon>
            风采展示
          </Menu-item>
          <Menu-item name="3" class="nav-item">
            <Icon type="ios-person" size="25"></Icon>
            用户登录
          </Menu-item>
        </div>
      </Menu>
    </div>

    <!-- 内容区 -->
    <div style="height: 100%;">
      <!-- 古树查询 -->
      <div v-if="activeMenu === '1'" class="Ancient_tree_query">
        <div class="login_base_survey" >
            <login_base_survey></login_base_survey>
        </div>
        <div class="login-map">
          <login-map ></login-map>
        </div>
      </div>
      <!-- 风采展示 -->
      <div v-if="activeMenu === '2'" style=" height: 100%; overflow-y: scroll; ">
        <div>
          <login-show ></login-show>
        </div>
      </div>
      <!-- 用户登录 -->
      <div  v-if="activeMenu === '3'"  class="layout-form">
        <div class="layout-login-card">
          <Card icon="log-in" title="欢迎登录" :bordered="true" >
            <div class="form-con">
              <login-form @on-success-valid="handleSubmit"></login-form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { setToken, getToken } from "@/libs/util";
import LoginMap from "@/view/login/loginMap";
import {ownerList} from "@/view/survey/right_base_options";
import {GetKe, GetShu, GetZhong} from "@/api/tree_species";
import {queryTreeBasicProperty} from "@/api/table";
import Login_base_survey from "@/view/survey/login_base_survey";
import LoginShow from "@/view/login/loginShow";
import imageViewer from "@/view/components/image/imageViewer";


export default {
  components: {
    LoginShow,
    Login_base_survey,
    LoginMap,// 导入loginMap组件
    LoginForm
  },
  data () {
    return {
      flag: false,
      activeMenu:'1',
      query: {
        level: undefined,
        tree_code_like: undefined,
        family: undefined,
        genus: undefined,
        investigator: undefined,
        zw_name: undefined,
        owner: undefined,
        CompanyB: undefined,
        gh_unit: undefined,
        // dc_status: '已完成',
        dw_CheckState: undefined,
      },
      levelList: [
        {
          value: '特级',
          label: '特级'
        },
        {
          value: '一级',
          label: '一级'
        },
        {
          value: '二级',
          label: '二级'
        },
        {
          value: '三级',
          label: '三级'
        },
        {
          value: '名木',
          label: '名木'
        }
      ],
      KeList: [],
      ShuList: [],
      NameList: [],
      OwnerList: ownerList,
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ username, password }) {
      this.handleLogin({ username, password }).then(res => {
        console.log('handleLogin',getToken())
        console.log('login',res)
        if(getToken()!==''){
          // this.flag = false
          this.getUserInfo().then(resp => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
        }
      }).catch((e)=>{
        // this.flag = true
        console.log(e.response) //打印错误信息返回值
        this.$Message.error({
          content: e.response.data.msg,
          duration: 10,
          closable: true
        });


      })
    },
    handleMenuSelect(name) {
      console.log('跳转')
      this.activeMenu = name;
    },
    onPageChange (page) {
      // 分页变化
      this.pages._page = page
      this.fetchData()
    },
    onSearch () {
      this.pages._page = 1
      this.fetchData()
    },
    fetchData: function () {
      // 数据表发生变化请求数据

      let args = { ...this.query, ...this.pages }
      console.log(typeof (this.query.tree_code_like))

      return queryTreeBasicProperty(args).then((resp) => {
        this.tableData = resp.data.trees_basic_property
        this.total = resp.data.total
        this.loadingTable = false
      })
    },
    fetchOptions(){
      GetKe().then(ke=>{
        this.KeList = ke.data.families
      })
      GetShu().then(shu=>{
        this.ShuList = shu.data.genuses
      })
      GetZhong().then(name=>{
        this.NameList = name.data.names
      })
    },

  }
}
</script>

<style lang="less">
  @import './login.less';
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    height: 61px;
  }
  .layout-logo{
    width: 400px;
    height: 60px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 10px;
    left: 20px;
  }
  .layout-nav{
    width: 480px;
    margin: 0 auto;
  }
  .layout-assistant{
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 700px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-form{
    height: 100%;
    min-height: 700px;
    // margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
    background: url('../../assets/images/login-tree.jpg') no-repeat center  ;
    background-size:cover;
    background-position:center center;
  }
  .layout-login-card{
    margin-top: 10%;
    margin-left: 40%;
    width: 350px;
  }
  // nav-item部分
  .nav-item:hover{
    background-color: rgba(245, 250, 255, 0.2);

  }
  // logo部分
  .logo_tree{
    width: 40px;
    height: 40px;
    user-select: none;
  }
  .system_name{
    font-size: 20px;
    color:white;
    position: relative;
    top: -12px;
    left: 20px;
    user-select: none;
  }
  // 古树查询
  .Ancient_tree_query{
    margin-top: 0vh;
    height:100%;
    display: flex;
  }
  .login_base_survey{
 
    flex: 0.5; 
    background: #2d8cf0;
    position: absolute;
    top: 85px; 
    left: 10px; 
    z-index: 2;
  }
  .login-map{
    flex: 2.5;
    height:100%; 
    position: relative; 
    z-index: 1;
  }
</style>
