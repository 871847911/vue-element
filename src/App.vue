<template>
<div id="app" >
    <el-container>
        <el-container>
            <el-header v-show="showHeader" style="padding: 0;">
                <v-header></v-header>
            </el-header>
            <el-main style="padding:0">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>


</div>
</template>

<script>
import vHeader from "components/header/header";
import vLogin from "components/login/login";

import { mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    vHeader,
    vLogin
  },
  computed: {
    ...mapGetters({
      isLogin: "getIsLogin"
    })
  },
  data() {
    return {
      asideNavList: [
        {
          name: "store",
          url: "/totalManageC/store"
        }
      ],
      showHeader: '',
    };
  },
    created() {
      if(window.location.href.indexOf('login') != -1){
          this.showHeader = false
      }else{
          this.showHeader = true
      };
    },
  methods: {
    handleOpen() {},
    handleClose() {}
  },
    watch: {
        $route(to,from){
            if(to.path.indexOf('login') != -1) {
                this.showHeader = false
            }else{
                this.showHeader = true;
                if(sessionStorage.loginInfo == undefined){
                    this.$router.push({path: '/login'})
                }
            }
        }
    }

};
</script>

<style lang="scss">
@import "assets/fonts/ant/iconfont.css";
// @font-face {
//   font-family: "Helvetica Neue";
//   src: url("assets/fonts/ant/iconfont.css");
// }
#app {
  font-family: "Helvetica Neue";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.addBg {
  background: url("./assets/images/login_bg.jpg");
  background-size: 100% 100%;
}
#app {

  height: 100%;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", SimSun, sans-serif;

  .el-main {
    height: 100%;
  }
  .el-container {
    height: 100%;
  }
}

@import "assets/css/public.css";
</style>
