<template>
<div class="header">
    <!-- <el-row>
            <el-button type="info" @click="getLogInStatus"></el-button>
            <el-button type="success" @click="changeLogInStatus"></el-button>
          </el-row> -->
<!--
    <el-row>
        <el-col :span="24">-->

            <el-menu :default-active="headMenuIndex" class="el-menu-demo" mode="horizontal" :router="true" @select="handleSelect" background-color="#282C33" text-color="#b3b5b7" active-text-color="#fff">
                <div id="logo">
                    <img src="../../assets/images/logo@2x.png" alt="">
                </div>

                <el-menu-item v-for="(item,index) in menuList" :key="index" :index="index.toString()" :route="menuList[index].url">
                    <!-- <router-link :to="menuList[index].url"> -->
                    {{item.name}}
                </el-menu-item>

                <div class="login_info">
                    <p class="login_name">{{loginInfo.nickname}}</p>
                    <p class="to_login" @click="toLogin">退出</p>
                </div>
            </el-menu>

        <!--</el-col>-->
        <!--<el-col :span="2" class="setRL">
            <el-row>
                <el-col :span="12">
                    <span class="showUser">{{loginInfo.nickname}}</span>
                </el-col>
                <el-col :span="12">
                    <el-button class="changeBtn" type="text" @click="logOut">退出</el-button>
                </el-col>
            </el-row>
        </el-col>-->
    <!--</el-row>-->

</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import store from "@/store/index";
import api from "../../fetch/api";
import vLogin from "components/login/login";
import vRegister from "components/login/register";
export default {
  name: "headerNav",
  components: {
    vLogin,
    vRegister
  },
  props: [],
  data() {
    return {
      userInfo: {
        name: "komolei"
      },
      // 顶部导航栏
      activeIndex: "0",
      menuList: [
        {
          name: "全局管理",
          url: "/totalManageC"
        },
        {
          name: "运营管理",
          url: "/operationManageC"
        },
        {
          name: "模板市场",
          url: "/templateMarketC"
        },
        {
          name: "发布设置",
          url: "/openSettingC"
        }
      ]
    };
  },
    created() {
        store.dispatch("changeLoginInfo", JSON.parse(sessionStorage.loginInfo));
        store.dispatch("changeHeadMenuIndex", sessionStorage.getItem("headMenuIndex") || 0);
        // this.setIndex();
    },
    updated() {
        // this.setIndex();
    },
  computed: {
    ...mapGetters({
      logInStatus: "getLogInStatus",
      loginInfo: "getLoginInfo",
      headMenuIndex: "getHeadMenuIndex"
    })
  },
  methods: {
    ...mapActions(["changeIsLogInStatus",'changeIsLogin']),
      setIndex(){
          if(window.location.href.indexOf('totalManageC') != -1 ){
              this.activeIndex = '0'
          }else if(window.location.href.indexOf('operationManageC') != -1) {
              this.activeIndex = '1'
          }else if(window.location.href.indexOf('templateMarketC') != -1) {
              this.activeIndex = '2'
          }else if(window.location.href.indexOf('openSettingC') != -1) {
              this.activeIndex = '3'
          }
      },
    getLogInStatus() {
      console.log("this.logIn status is1:", this.logInStatus);
      console.log("this.logIn status is2:", this.$store.getters.getLogInStatus);
    },
    changeLogInStatus() {
      store.dispatch("changeIsLogInStatus", true);
      console.log("this.logIn status is:", this.logInStatus);
    },
    handleSelect(index) {
        store.dispatch("changeHeadMenuIndex", index);
    },
    logOut() {
      this.$router.replace({ path: "/" });
      store.dispatch('changeIsLogin',false);
    },
      toLogin() {
          store.dispatch('changeLoginInfo', '');
          sessionStorage.removeItem('loginInfo');
          sessionStorage.removeItem('tips');
          sessionStorage.removeItem('headMenuIndex');
          window.location.href = 'http://cloud.vdongchina.com/'
      }
  }
};
</script>

<style lang="scss">
.el-menu--horizontal {
  .el-menu-item {
    position: relative;
    &:nth-of-type(1) {
      margin-left: 208px;
    }
  }
  #logo {
    position: absolute;
    width: 208px;
    height: 64px;
    &:hover {
      cursor: pointer;
    }
    img {
      width: 102px;
      height: 34px;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }
    .login_info{
        float: right;
        display: flex;
        margin: 21px 40px 0 0 ;
        height: 22px;
        line-height: 22px;
        &:focus{
            outline: -webkit-focus-ring-color auto 0;
        }
        .login_name{
            color: rgba(255,255,255,.85);
            margin-right: 56px;
        }
        .to_login{
            &:hover{
                cursor: pointer;
                color: rgba(2,230,215,1);
            }
            color: rgba(24,204,192,1);
        }
    }
}

.el-menu--horizontal > .el-menu-item {
  border: 0;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border: 0;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-header {
  padding: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.setRL {
  line-height: 60px;
  padding: 0 20px;
  background-color: rgb(40, 44, 51);
  border-radius: 0;
}

.showUser {
  color: #fff;
}
.changeBtn:hover{
  border-color:transparent;
}
</style>
