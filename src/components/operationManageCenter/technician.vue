<template>
  <el-container class="resetCT">
    <el-header style="height:176px">
      <el-row class="resetElRow">
        <el-col :span="18">{{storeInfo.name}}</el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
        </el-col>
      </el-row>

      <el-row class="secondElRow">
        <el-col :span="7">
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="goToPage('addTechnician')">添加技师</el-button>
            </el-col>
            <el-col :span="24">
              <span>注：最多可添加100个技师，还可添加{{techCount}}个</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="24">
              <el-row>
                <span>搜索技师：</span>
                <el-col :span="8">
                  <el-input v-model="searchText" placeholder="请输入技师姓名或昵称"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="searchTech">搜索</el-button>
                </el-col>

              </el-row>
            </el-col>
            <el-col :span="24">
              <span>技师状态：</span>
              <el-radio-group v-model="statusOfTech" @change="changeStatusOfTech" class="thecRadioGS">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="启用"></el-radio-button>
                <el-radio-button label="停用"></el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="9">
          <el-row>
            <el-col :span="20" :offset="4">
              <span>技师类型：</span>
              <el-select v-model="typeOfTech" placeholder="全部" @change="selectTypeOfTech">
                <el-option v-for="(item,index) in typeOfTechList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="20" :offset="4">
              <el-radio-group v-model="statusOfBatchOperate" class="thecRadioGB" @change="batchHandle">
                <el-radio-button label="批量启用"></el-radio-button>
                <el-radio-button label="批量停用"></el-radio-button>
                <el-radio-button label="批量删除"></el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main id="resetMain">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <div v-if="scope.row.headUrl">
              <img :src="scope.row.headUrl" width="32" height="32" @click="getImgUrl(scope.row.headUrl)">
              <el-dialog :visible.sync="authorImgVisible" width="30%" @close="authorImgVisible=false">
                <img :src="imgUrl" width="400" height="400">
              </el-dialog>
            </div>
            <div v-else class="defaultDiv"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="sequence" label="序号" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.sequence" placeholder="" @change="changeSequenceNum(scope.$index,scope.row)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" show-overflow-tooltip class-name="showNickName">
        </el-table-column>
        <el-table-column prop="staffTypeName" label="技师类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="serverSize" label="绑定服务数量" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isEnable" label="启用状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <el-popover placement="top" trigger="hover" > -->
            <!-- <el-popover placement="top" trigger="hover" :content="scope.row.isEnable?'自动启用':'自动禁用'"> -->
            <el-switch slot="reference" v-model="scope.row.isEnable" :active-value=1 :inactive-value=0 @change="handleSwitchItem(scope.row)">
            </el-switch>
            <!-- </el-popover> -->
          </template>
        </el-table-column>

        <el-table-column label="操作" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)"> 配置</el-button>
            <el-button type="text" size="mini" @click="handleBindSer(scope.$index,scope.row)">绑定服务</el-button>
            <el-button size="mini" type="text" @click="delTech(scope.$index,scope.row) ">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totals" class="setElPagination" :page-size="pageSize" background layout=" prev, pager, next,sizes, jumper" :total="totals" @current-change="currentChange" @size-change="sizeChange"></el-pagination>

      <el-dialog :visible.sync="deleteTechVisible" width="25%" :show-close="false" custom-class="imgDialog">
        <div>
          <img src="../../assets/images/delete3.png" alt="icon">
          <span>确定删除{{techNickName}}技师吗?</span>
        </div>
        <span slot="footer">
          <el-button @click="deleteTechVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>

    <!-- 批量操作 删除-->
    <el-dialog :visible.sync="deleteTechBatchVisible" width="25%" :show-close="false" custom-class="imgDialog">
      <div>
        <img src="../../assets/images/delete3.png" alt="icon">
        <span>确定要批量删除这些技师吗？</span>
      </div>
      <span slot="footer">
        <el-button @click="deleteTechBatchVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchHandleDelete">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量操作启用-->
    <el-dialog :visible.sync="openOrClosedTechBatchVisible" width="25%" :show-close="false" custom-class="imgDialog">
      <div>
        <img src="../../assets/images/question3.png" alt="icon">
        <span>确定要批量{{isStatusOfBatch==1?'启用':'停用'}}这些技师吗？</span>
      </div>
      <span slot="footer">
        <el-button @click="openOrClosedTechBatchVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchHandleOpenOrClose">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <router-view></router-view> -->
  </el-container>
</template>

<script>
import store from "@/store/index";
import { mapStates, mapGetters, mapActions } from "vuex";
import api from "../../fetch/api.js";
export default {
  name: "technician",
  data: function() {
    return {
      imgUrl: "", // Dialog中展示的图片链接
      techCount: 0,
      searchText: "",
      typeOfTech: "",
      typeOfTechList: [],
      statusOfTech: "全部",
      statusOfBatchOperate: "",
      isStatusOfBatch: "",
      deleteTechVisible: false,
      deleteTechBatchVisible: false,
      openOrClosedTechBatchVisible: false,
      tableData: [
        // {
        //   headUrl: "",
        //   name: "komolei",
        //   nickName: "komoleii",
        //   staffTypeId: "0",
        //   bindServiceNum: 0,
        //   isEnable: 1,
        //   recommendSequence: 0
        // }
      ],
      multipleSelection: [],
      authorImgVisible: false,
      totals: 100,
      pageSize: 10,
      page: 0,
      currentPage: 0,
      isEnable: "", // 技师状态
      techObj: {}, // 技师对象
      techNickName: "",
      techIndex: ""
    };
  },
  computed: {
    // ...mapStates({storeId:'storeInfo.id'}),
    storeId() {
      return this.$sotre.state.common.storeInfo.id;
    },
    ...mapGetters({
      storeInfo: "getStoreInfo",
      loginInfo: "getLoginInfo"
    })
  },
  methods: {
    ...mapActions(["changeTechInfo"]),
    getImgUrl(url) {
      this.authorImgVisible = true;
      this.imgUrl = url;
    },
    // 得到技师数量
    getTechCount() {
      api
        .queryStaffCount({
          storeId: this.storeInfo.id,
          sellerId: this.loginInfo.sellerId
        })
        .then(res => {
          this.techCount = 100 - res.count;
          if (res.count == 100) {
            this.$message.error("添加技师数量达到上限");
          }
        });
    },
    // 选择技师类型
    selectTypeOfTech() {
      this.getTechList();
    },
    // 技师列表
    getTechList() {
      let params = {
        page: {
          pageNo: this.page ? this.page : 1,
          pageSize: this.pageSize
        },
        staff: {
          staffTypeId: this.typeOfTech,
          storeId: this.storeInfo.id,
          name: this.searchText ? this.searchText : null,
          sellerId: this.loginInfo.sellerId,
          isEnable: this.isEnable
        }
      };

      api.queryStaffPage(params).then(res => {
        this.totals = res.total;
        this.pageSize = res.pageSize;
        // this.currentPage=res.navigatePages;
        this.getBindSerCount(res.rows);
      });
    },

    // 得到绑定服务数量
    getBindSerCount(tableData) {
      let params = {
        page: {
          pageNo: this.page ? this.page : 1,
          pageSize: this.pageSize
        },
        staff: {
          storeId: this.storeInfo.id,
          sellerId: this.loginInfo.sellerId
        }
      };
      api.queryStaffServer(params).then(res => {
        for (let item of res) {
          //   item.serverSize = item.servers.length;
          for (let node of tableData) {
            if ((item.staff.id == node.id)) {
              node.serverSize = item.list.length;
            }
          }
        }
        this.tableData = tableData;

        // this.tableData = Object.values(Object.assign({}, this.tableData, res));
      });
    },
    // 路由跳转
    goToPage(url) {
      // this.$router.push({path:`/totalManageC/${url}`})
      this.$router.push({
        name: `${url}`
      });
      if (url.length > 5) return store.dispatch("changeTitle", "添加技师"); // 在父组件中引用了changeTitle,所以不需要在引用
    },
    // 得到技师类型
    getTechTypeList() {
      let params = {
        staffType: {
          storeId: this.storeInfo.id
        }
      };
      api.selectByStore(params).then(res => {
        this.typeOfTechList = res;
        this.typeOfTechList.unshift({
          name: "全部",
          id: ""
        });
      });
    },
    // 技师状态
    changeStatusOfTech() {
      switch (this.statusOfTech) {
        case "全部":
          this.isEnable = "";
          this.getTechList();
          break;
        case "启用":
          this.isEnable = 1;
          this.getTechList();

          break;
        default:
          this.isEnable = 0;
          this.getTechList();

          break;
      }
    },
    // 搜索技师
    searchTech() {
      this.getTechList();
    },
    // 批量操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection = val.map(item => item.id);
    },
    // 批量删除、停用、启用
    batchHandle() {
      if (!this.multipleSelection.length)
        return this.$message.error("请先选择操作对象");
      switch (this.statusOfBatchOperate) {
        case "批量启用":
          this.isStatusOfBatch = 1;
          this.openOrClosedTechBatchVisible = true;
          break;
        case "批量停用":
          this.isStatusOfBatch = 0;
          this.openOrClosedTechBatchVisible = true;
          break;
        default:
          this.deleteTechBatchVisible = true;
          break;
      }
    },
    // 确定批量删除
    batchHandleDelete() {
      api.removeStaffs(this.multipleSelection).then(res => {
        res.retcode
          ? (this.$message.success("更新成功"),
            this.getTechList(),
            (this.deleteTechBatchVisible = false))
          : this.$message.error(res.retmsg);
        this.statusOfBatchOperate = "";
      });
    },
    // 确定批量停用或启用
    batchHandleOpenOrClose() {
      if (!this.isStatusOfBatch) {
        api.enableStaffs(this.multipleSelection).then(res => {
          res.retcode
            ? (this.$message.success("更新成功"),
              this.getTechList(),
              (this.openOrClosedTechBatchVisible = false))
            : this.$message.error(res.retmsg);
          this.statusOfBatchOperate = "";
        });
      } else {
        api.disableStaffs(this.multipleSelection).then(res => {
          res.retcode
            ? (this.$message.success("更新成功"),
              this.getTechList(),
              (this.openOrClosedTechBatchVisible = false))
            : this.$message.error(res.retmsg);
          this.statusOfBatchOperate = "";
        });
      }
    },

    // 启用||关闭状态
    handleSwitchItem(item) {
      api
        .updateStaff({
          storeId: this.storeInfo.id,
          id: item.id,
          isEnable: item.isEnable
        })
        .then(res => {
          res.retcode
            ? this.$message.success("更新成功")
            : this.$message.error(res.retmsg);
        });
    },
    // 改变序号
    changeSequenceNum(index, item) {
      if (!new RegExp(/^[1-9]\d*$/).test(item.sequence))
        return this.$message.error("只能输入正整数");
      api
        .updateStaff({
          storeId: this.storeInfo.id,
          sequence: item.sequence,
          id: item.id
        })
        .then(res => {
          res.retcode
            ? this.$message.success("更新成功")
            : this.$message.error(res.retmsg);
        });
    },
    // 技师删除
    delTech(index, item) {
      this.deleteTechVisible = true;
      this.techObj = item;
      this.techNickName = item.nickName;
      this.techIndex = index;
    },
    // 技师配置
    handleEdit(index, item) {
      store.dispatch("changeTechInfo", item);
      this.$router.push({
        name: "modifyTechnician"
      });
    },
    // 技师绑定服务
    handleBindSer(index, item) {
      store.dispatch("changeTechInfo", item);
      this.$router.push({
        name: "bindServiceOfTechnician"
      });
      store.dispatch("changeTitle", "绑定服务");
      //   localStorage.setItem("techInfo", JSON.stringify(item));
    },
    // 弹窗技师删除
    handleDelete() {
      api
        .removeStaff({
          id: this.techObj.id
        })
        .then(res => {
          res.retcode
            ? (this.$message.success("删除成功"),
              (this.deleteTechVisible = false),
              this.tableData.splice(this.techIndex, 1))
            : this.$message.error(res.retmsg);
        });
    },
    // 分页跳转
    currentChange(page) {
      this.page = page;
      // this.total = 1;
      this.getTechList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getTechList();
    }
  },
  mounted() {
    // console.log('this.$router is',this.$route,this.$store.state.common.storeInfo.id);
    this.getTechTypeList();
    this.getTechList();
    this.getTechCount();
    // this.getBindSerCount();
  }
};
</script>

<style lang="scss" scoped>
#app .el-container .resetCT {
  height: calc(100% - 44px);
}
#resetMain.el-main {
  height: calc(100% - 52px);
}
.secondElRow {
  margin-top: 32px;
  @include fontRegular;
  > .el-col.el-col-7 {
    padding-left: 32px;
    .el-col.el-col-24 {
      &:first-child {
        text-align: left;
        margin-bottom: 25px;
        .el-button.el-button--primary {
          min-width: 91px;
          height: 32px;
          line-height: 32px;
          padding: 0;
        }
      }
      &:last-child {
        span {
          line-height: 32px;
          font-weight: 500;
          color: #9b9b9b;
        }
      }
    }
  }
  > .el-col.el-col-8 {
    // padding-left: 32px;
    .el-col.el-col-24 {
      display: flex;
      justify-content: center;
      &:first-child {
        text-align: left;
        margin-bottom: 25px;
        span {
          // font-size: 14px;
          float: left;
          line-height: 32px;
        }
        .el-col.el-col-8 {
          width: 177px;
        }
        .el-button.el-button--primary {
          margin-left: 16px;
          min-width: 65px;
          height: 32px;
          line-height: 32px;
          padding: 0;
        }
      }
      &:last-child {
        display: flex;
        align-items: center;
        font-size: 0;
        > span {
          font-size: 14px;
        }
      }
    }
  }
  > .el-col.el-col-9 {
    // float:right;
    .el-col.el-col-20.el-col-offset-4 {
      text-align: right;
      padding-right: 32px;
      &:first-child {
        // text-align: left;
        margin-bottom: 25px;
        .el-select {
          width: 215px;
        }
      }
      .el-radio-button {
        padding-right: 8px;
        &:last-child {
          padding-right: 0;
        }
        .el-radio-button__inner {
          width: 90px;
          border: 1px solid;
        }
      }
    }
  }
}

.el-main {
  .el-button.el-button--text {
    border-color: transparent;
  }
}
</style>
