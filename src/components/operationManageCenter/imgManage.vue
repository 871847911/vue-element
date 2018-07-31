<template>
<el-container>
    <el-header style="height:54px">
          <el-row class="resetElRow">
            <el-col :span="20">{{storeInfo.name}}</el-col>
            <el-col :span="4">
                <el-button type="primary"  @click="goToPage('store')" >修改店铺信息</el-button>
            </el-col>
        </el-row>
        <br/>
    </el-header>
    <el-main height="" class="imgManageC">
        <!-- Main content -->
        <!-- <h2>图片管理</h2> -->
        <el-table ref="multipleTable" :data="imgsOfStore" tooltip-effect="dark" style="width: 100%"  class="resetTable">
            <el-table-column label="图片位置" >
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="size" label="图片数量" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="date" label="配置时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)"> 配置</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-main>

</el-container>
</template>




<script>
import api from "../../fetch/api";
import store from "@/store/index";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "apply",
  data: function() {
    return {
      imgsOfStore: [
        {
          date: "2016-05-03",
          name: "首页轮播图",
          size: 1
        },
        {
          date: "2016-05-03",
          name: "店铺展示图片",
          size: 0
        }
      ]
    };
  },
  computed: {
    ...mapGetters({ storeInfo: "getStoreInfo" ,loginInfo:'getLoginInfo'})
  },
  methods: {
    ...mapActions(["changeTitle"]),
    goToPage(url) {
      this.$router.push({
        name: `${url}`
      });
    },
    handleEdit(index, item) {
      if (index == 0) {
        this.$router.push({ name: "imgCarousel" });
        store.dispatch("changeTitle", "轮播图管理");
      } else {
        this.$router.push({ name: "imgStoreDisplay" });
        store.dispatch("changeTitle", "店铺展示图片");
      }
    },
    timeFormat(time) {
      if (time == "") return "无";
      let newTime = new Date(time);
      return `${newTime.getFullYear()}-${newTime.getMonth() +
        1}-${newTime.getDate()}`;
    },
    getImgSetting() {
      let params = {
        id: this.storeInfo.id,
        sellerId: this.loginInfo.sellerId,
      };

      api.querySlideshowByStore(params).then(res => {
        // 得到结果，再发请求
        this.imgsOfStore[0].size = res.size;
        this.imgsOfStore[0].date = res.size
          ? this.timeFormat(
              res.rows[0].createDate ? res.rows[0].createDate.time : ""
            )
          : "无";
      });
      api.queryShoppicByStore(params).then(res => {
        this.imgsOfStore[1].size = res.size;
        this.imgsOfStore[1].date = res.size
          ? this.timeFormat(
              res.rows[0].createDate ? res.rows[0].createDate.time : ""
            )
          : "无";

        console.log("this.result", res);
      });
    }
  },
  created() {
    this.getImgSetting();
  }
};
</script>




<style lang='scss' scoped>
.el-button.el-button--text {
  border-color: transparent;
  &:hover {
    background-color: transparent;
  }
}
.el-button:focus,
.el-button:hover {
  background: #18CCC0;
}
</style>
