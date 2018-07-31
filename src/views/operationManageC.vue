<template>
<el-container class="resetBG">
    <el-aside width="208px" style="box-shadow:1px 0px 4px 0px rgba(0,16,41,0.12);">
        <!-- <img src="./assets/images/logo.png"> -->
        <el-menu default-active="0" class="el-menu-vertical-demo" @select='handleSelect'  text-color="#000000" active-text-color="#18CCC0" :router="true">
            <el-menu-item v-for="(item,index) in asideNavList" :key="index" :index="index.toString()" :route="asideNavList[index].url">
                <!-- <i class="el-icon-menu"></i> -->
                <!-- <router-link :to="asideNavList[index].url" > -->
                    <span class="operA">{{item.alias}}</span>
                <!-- </router-link> -->
            </el-menu-item>
        </el-menu>
    </el-aside>
    <el-dialog title="选择门店" :visible.sync="storeSelectedVisible" id="storeSelected" :before-close="handleClose">
        <el-table :data="storeList" >
            <el-table-column property='name' label="店铺名称" ></el-table-column>
            <el-table-column label="操作" align='center'>
                <template slot-scope="scope">
                    <el-button type="text" @click='operate(scope.$index,scope.row)'>选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="storeList.length > 0" background layout="prev, pager, next" :page-count="pageCount" :page-size="pageSize" :total="total" @current-change='currentChange'>
        </el-pagination>
    </el-dialog>
    <div class="commonHead">
        <h3>
            {{title}}
          <span v-if="$route.name=='addTechnician'" class='backBtn' @click="goback">返回</span>
          <span v-if="$route.name=='modifyTechnician'" class='backBtn' @click="goback">返回</span>
          <span v-if="$route.name=='bindServiceOfTechnician'" class='backBtn' @click="goback">返回</span>
          <span v-if="$route.name=='imgCarousel'" class='backBtn' @click="goback">返回</span>
          <span v-if="$route.name=='imgStoreDisplay'" class='backBtn' @click="goback">返回</span>
          <span v-if="$route.name=='addService'" class='backBtn' @click="goback">返回</span>
          <span v-if="$route.name=='modifyService'" class='backBtn' @click="goback">返回</span>
        </h3>
        <div class="commonCon">
            <router-view>
            </router-view>
        </div>

    </div>

</el-container>
</template>

<script>
import api from "../fetch/api.js";
import { mapState, mapActions, mapGetters } from "vuex";
import store from "@/store/index";
export default {
  name: "storeManageC",
  computed: {
    ...mapState({
      storeSelectedVisible: state => state.common.isSelectStoreVisible
    }),
      ...mapGetters({
          headMenuIndex: "getHeadMenuIndex"
      }),
    ...mapGetters({ title: "getTitle",loginInfo:'getLoginInfo' })
  },
  data: function() {
    return {
      info: "storeManage center",
      // title: "技师管理",
      asideNavList: [
        {
          name: "technician",
          url: "/operationManageC/technician",
          alias: "技师管理"
        },
        {
          name: "serviceM",
          url: "/operationManageC/serviceM",
          alias: "服务管理"
        },
        {
          name: "imgManage",
          url: "/operationManageC/imgManage",
          alias: "图片管理"
        },
        // {
        //   name: "recommandTech",
        //   url: "/operationManageC/recommandTech",
        //   alias: "推荐技师"
        // },
        {
          name: "recommandService",
          url: "/operationManageC/recommandService",
          alias: "推荐设置"
        }
      ],
      // storeSelectedVisible: false,
      storeList: [
        // {
        //   name: "店铺名称",
        //   selected: "选择"
        // },
        // {
        //   name: "店铺名称",
        //   selected: "选择"
        // }
      ],
      pageSize: 6,
      total: 0,
      pageCount: 0,
      page: 0
    };
  },
  methods: {
    ...mapActions([
      "changeSelectStoreVisible",
      "changeStoreInfo",
      "changeTitle"
    ]),
    handleSelect(index) {
      // this.title = this.asideNavList[index].alias;
      store.dispatch("changeTitle", this.asideNavList[index].alias);
    },
      handleClose() {
          this.$router.push({path: '/totalManageC/store'})
          store.dispatch("changeHeadMenuIndex", 0);
    },
    currentChange(page) {
      this.page = page;
      this.getStoreList();
    },
    getStoreList() {
      let params = {
        page: {
          pageNo: this.page ? this.page : 1,
          pageSize: this.pageSize
        },
        store: {
          sellerId: this.loginInfo.sellerId,
        }
      };
      console.log("params", params);
      api.queryStorePage(params).then(res => {
        this.storeList = res.rows;
        this.total = res.total;
        this.pageSize=res.pageSize;
        // this.pageCount=res.pages;
      });
    },
    operate(index, item) {
      store.dispatch("changeStoreInfo", item);
      // store.commit('CHANGESELECTSTOREDIALOG',item)

      store.dispatch("changeSelectStoreVisible", false);
      this.$router.push({
        name: "technician"
      });
    },
    goback() {
      // this.$router.back();

      if (this.$route.name == "addTechnician" || "bindServiceOfTechnician") {
        store.dispatch("changeTitle", "技师管理");
      } else if (this.$rotue.name == "imgCarousel" || "imgStoreDisplay") {
        store.dispatch("changeTitle", "图片管理");
      }
      this.$router.go(-1);
    }
  },

  created() {
    this.getStoreList();
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
$fontColor: RGBA(0, 0, 0, 0.85);

// .operA {
//   margin-left: 30px;
//   font-size: 14px;
// }
.el-button.el-button--primary
    {
    border-color: #18CCC0;
    background: #18CCC0;
}

.resetBG{
  background: RGBA(237, 242, 245, 1);
  .el-aside{
    ul{
      height: 100%;
      background:#fff;

    }
  }
}

.commonHead {
  width: 100%;
  overflow: hidden;
  // background: RGBA(237, 242, 245, 1);
  height: calc(100% - 24px);

  // overflow: hidden;
  overflow-x: hidden;
  h3 {
    height: 92px;
    line-height: 92px;
    font-size: 20px;
    color: $fontColor;
    box-sizing: border-box;
    padding-left: 31px;
    background: #fff;
    margin-left: 1px;
    .backBtn {
      float: right;
      margin-top: 30px;
      line-height: 28px;
      @include fontRegular;
      margin-right: 24px;
      padding: 3px 16px;
      border: 1px solid RGBA(217, 217, 217, 1);
      border-radius: 4px;
      &:hover {
        border-color: #18CCC0;
      }
    }
  }
  .commonCon {
    // margin: 24px;
    margin:24px 24px 0 24px;
     overflow: hidden;
    height: calc(100% - 24px);
    section.el-container {
      // min-height: 729px;
      background: #fff;
      .el-header {
        // >.el-row {
        //   &:first-child {
        // >.resetElRow{
        //   min-height: 54px;
        //   margin-bottom: 25px;
        //   @include font;
        //   line-height: 54px;
        //   border-bottom: 1px solid #e8e8e8;
        //   padding-left: 32px;
        //   button {
        //     float: right;
        //     margin-right: 32px;
        //     margin-top: 12px;
        //   }
        // }
        // }
        button {
          min-width: 114px;
          min-height: 32px;
          padding: 0;
          span {
            line-height: 32px;
          }
        }
      }
      > .el-main {
        padding: 32px 32px 40px 32px;
        background: red;
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
    > .el-pagination {
      margin-top: 16px;
      float: right;
    }
  }
}

// .storeSelected {
//   // font-family: PingFangSC;
//   // > .el-dialog {
//     width: 800px;
//     max-height: 574px;
//     .el-dialog__header {
//       // height: 55px;
//       padding: 17px 24px 16px 23px !important;
//       // border-bottom: 1px solid RGBA(0, 0, 0, 0.09);
//       span {
//         font-size: 16px;
//         font-weight: 700;
//         color: $fontColor;
//       }
//       .el-dialog__headerbtn {
//         font-size: 9px;
//         .el-dialog__close {
//           color: rgba(0, 0, 0, 0.25);
//         }
//       }
//     }
//     .el-dialog__body {
//       padding: 24px 32px 40px 32px;
//       .el-button.el-button--text {
//         border-color: transparent;
//       }
//       &::before {
//         display: none;
//       }
//       .el-table {
//         font-size: 14px;
//         color: $fontColor;
//         border: none;
//         &::after,
//         &::before {
//           display: none;
//           width: 0;
//         }
//         .el-table--border::after,
//         .el-table--group::after {
//           display: none;
//           width: 0;
//         }
//         th {
//           padding: 15px 0;
//           border-right: none;
//           &:first-child {
//             .cell {
//               text-align: left;
//               padding-left: 20px;
//             }
//           }
//         }
//         .el-table__header-wrapper {
//           tr,
//           th {
//             background: RGBA(250, 250, 250, 1);
//             color: $fontColor;
//           }
//         }
//         .el-table__body-wrapper {
//           td {
//             padding: 16px 0;
//             .cell {
//               .el-button {
//                 padding: 0;
//               }
//             }
//           }
//         }
//       }
//     }
//   // }
//   .el-pagination {
//     display: flex;
//     justify-content: center;
//     margin-top: 16px;
//   }
// }
.el-button--primary {
    background: #18CCC0;
    border-color: #18CCC0;
}
</style>

<style lang="scss" >
// /不加scope,在标签前加了className/
@import "../assets/css/lazy.scss";
</style>
