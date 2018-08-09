<template>
  <el-container class="resetBG">
    <el-aside width="208px" style="box-shadow:1px 0px 4px 0px rgba(0,16,41,0.12);">
      <el-menu :default-active="menuIndex" class="el-menu-vertical-demo" @select='handleSelect' text-color="#BCBCBC" active-text-color="#18CCC0" :router="true">
        <el-menu-item v-for="(item,index) in asideNavList" :key="index" :index="index.toString()" :route="asideNavList[index].url">
          <!-- <i class="el-icon-menu"></i> -->
          <!-- <router-link :to="asideNavList[index].url" > -->
          <span class="operA">{{item.alias}}</span>
          <!-- </router-link> -->
        </el-menu-item>
      </el-menu>
    </el-aside>
    <div class="commonHead">
      <h3 v-if="secondTitle=='模板详情'" style="margin-bottom: 24px;">
        模板详情
            <el-button @click="goBack">返 回</el-button>
      </h3>
      <h3 v-else>
        {{title}}
      </h3>
      <div class="commonCon">
        <router-view>
        </router-view>
      </div>

    </div>
  </el-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import store from "@/store/index";

export default {
  name: "openSettingC",
  data: function() {
    return {
      info: "openSettingCenter",
      title: "发布设置",
      asideNavList: [
        {
          name: "miniProgramBind",
          url: "/openSettingC/miniProgramBind",
          alias: "小程序绑定配置"
        },
        {
          name: "tempCenter",
          url: "/openSettingC/tempCenter",
          alias: "模板中心"
        },
        {
          name: "openSetting",
          url: "/openSettingC/openSetting",
          alias: "发布设置"
        },
        {
          name: "storeInfoBind",
          url: "/openSettingC/storeInfoBind",
          alias: "商户信息配置"
        }
        /*{
          name: "accountSafe",
          url: "/openSettingC/accountSafe",
          alias: "账号安全"
        }*/
      ],
        titleName: false,
    };
  },
  computed: {
    ...mapGetters({ menuIndex: "getMenuIndex", secondTitle: "getTitle" })
  },
    updated() {
        if(this.$route.name == 'tempDetail'){
            this.title = '模板详情'
            store.dispatch("changeTitle", '模板详情');
        }else{
            this.title = this.asideNavList[this.menuIndex].alias;
            store.dispatch("changeTitle", this.title);
        }
    },
  methods: {
    ...mapActions(["changeMenuIndex", "changeTitle"]),
    handleSelect(index) {
      this.title = this.asideNavList[index].alias;
      store.dispatch("changeMenuIndex", index);
      store.dispatch("changeTitle", this.title);
    },
      goBack() {
          this.$router.go(-1);
      },
  },
  created() {
    if (localStorage.getItem("menuIndex")) {
      store.dispatch("changeMenuIndex", localStorage.getItem("menuIndex"));
      console.log("this.menuIndex", this.menuIndex);
    }
    this.title = this.asideNavList[this.menuIndex].alias;
    store.dispatch("changeTitle", this.title);
    if(this.$route.name == 'tempDetail'){
        this.title = '模板详情'
        store.dispatch("changeTitle", '模板详情');
    }
  }
};
</script>

<style lang="scss" scoped>
.el-button--primary {
  background: #18ccc0;
  border-color: #18ccc0;
}
$fontColor: RGBA(0, 0, 0, 0.85);

// .operA{
//   margin-left: 30px;
//   font-size: 14px;
// }
.resetBG {
  background: RGBA(237, 242, 245, 1);
  .el-aside {
    ul {
      height: 100%;
      background: rgba(71, 74, 80, 1);
    }
  }
}
.commonHead {
  width: 100%;
  // background: RGBA(237, 242, 245, 1);
  height: calc(100% - 24px);
  overflow: hidden;
  // overflow-y: scroll;
  h3 {
    height: 66px;
    line-height: 66px;
    font-size: 18px;
    color: $fontColor;
    box-sizing: border-box;
    padding-left: 31px;
    background: #fff;
      margin: 24px;
      margin-bottom: 0;
      .el-button{
          padding: 8px 20px;
          float: right;
          margin: 17px 32px 0 0;
      }
  }
  .commonCon {
    overflow: hidden;
    height: calc(100% - 24px);
    margin: 0 24px 0 24px;
    section.el-container {
      // min-height: 729px;
      background: #fff;
      .el-header {
        > .el-row {
          &:first-child {
            min-height: 54px;
            margin-bottom: 25px;
            @include font;
            line-height: 54px;
            border-bottom: 1px solid #e8e8e8;
            padding-left: 32px;
            button {
              float: right;
              margin-right: 32px;
              margin-top: 12px;
            }
          }
        }
        button {
          min-width: 114px;
          min-height: 32px;
          padding: 0;
          span {
            line-height: 32px;
          }
        }
      }
      .el-main {
        padding: 37px 32px 40px 32px;
        .el-table {
          .el-table__header-wrapper {
            tr,
            th {
              background: RGBA(250, 250, 250, 1);
              color: $fontColor;
            }
          }
        }
        .el-pagination {
          margin-top: 16px;
          float: right;
        }
      }
    }
  }
}

#storeSelected {
  font-family: PingFangSC;
  > .el-dialog {
    width: 800px;
    max-height: 574px;
    .el-dialog__header {
      // height: 55px;
      padding: 17px 24px 16px 23px;
      // border-bottom: 1px solid RGBA(0, 0, 0, 0.09);
      span {
        font-size: 16px;
        font-weight: 700;
        color: $fontColor;
      }
      .el-dialog__headerbtn {
        font-size: 9px;
        .el-dialog__close {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
    .el-dialog__body {
      padding: 24px 32px 40px 32px;
      &::before {
        display: none;
      }
      .el-table {
        font-size: 14px;
        color: $fontColor;
        border: none;
        &::after,
        &::before {
          display: none;
          width: 0;
        }
        .el-table--border::after,
        .el-table--group::after {
          display: none;
          width: 0;
        }
        th {
          padding: 15px 0;
          border-right: none;
          &:first-child {
            .cell {
              text-align: left;
              padding-left: 20px;
            }
          }
        }
        .el-table__header-wrapper {
          tr,
          th {
            background: RGBA(250, 250, 250, 1);
            color: $fontColor;
          }
        }
        .el-table__body-wrapper {
          td {
            padding: 16px 0;
            .cell {
              .el-button {
                padding: 0;
              }
            }
          }
        }
      }
    }
  }
  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
