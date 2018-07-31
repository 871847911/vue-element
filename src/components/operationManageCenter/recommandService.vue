<template>
  <el-container class="reTechElContainer">
    <el-header style="height:54px;background:#fff">
      <el-row class="resetElRow">
        <el-col :span="20">{{storeInfo.name}}</el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
        </el-col>
      </el-row>
      <!-- <el-row class="reTechElRow">
            <el-col :span="24">
                <div class="reTechBtns">
                    <el-button v-if="showBtn" type="primary" @click="recommandTechSettingVisible=true">推荐技师设置</el-button>
                    <el-button v-else type="primary" @click="recommandSerSettingVisible=true">推荐服务设置</el-button>
                </div>
            </el-col>
        </el-row> -->
    </el-header>
    <el-main height="" class="reTechElMain">
      <!-- Main content -->
      <!-- <el-row>
            <el-col :span="24">
                <h3>推荐设置</h3>
            </el-col>
        </el-row> -->
      <el-row>
        <el-col :span="24">
          <div class="reTechBtns">
            <el-button v-if="showBtn" type="primary" @click="recommandTechSetting">推荐技师设置</el-button>
            <el-button v-else type="primary" @click="recommandSerSetting">推荐服务设置</el-button>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="技师推荐" name="技师推荐">
              <el-table ref="multipleTable" :data="reTechList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="头像">
                  <template slot-scope="scope">
                    <div v-if="scope.row.headUrl">
                      <img :src="scope.row.headUrl" width="32" height="32" @click="authorImgVisible=true">
                      <!-- <el-dialog :visible.sync="authorImgVisible" width="30%" @close="authorImgVisible=false">
                                        <img :src="scope.row.headUrl">
                                    </el-dialog> -->
                    </div>
                    <div v-else class="defaultDiv"></div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名"> </el-table-column>
                <el-table-column prop="recommendSequence" label="推荐序号" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.recommendSequence" placeholder="" @change="changeSequenceNum(scope.$index,scope.row)">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="nickName" label="昵称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="staffTypeName" label="技师类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="serverSize" label="绑定服务数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="isEnable" label="启用状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <!-- <el-popover placement="top" trigger="hover" :content="scope.row.status?'自动启用':'自动禁用'"> -->
                    <el-switch slot="reference" v-model="scope.row.isEnable" :active-value=1 :inactive-value=0 @change="handleSwitchItem(scope.row)">
                    </el-switch>
                    <!-- </el-popover> -->
                  </template>
                </el-table-column>

                <el-table-column label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="deleteTechVisible=true">删除</el-button>
                    <el-dialog custom-class="imgDialog" :show-close="false" :visible.sync="deleteTechVisible" width="25%" @close="deleteTechVisible=false">
                      <img src="../../assets/images/delete3.png" alt="icon">
                      <span>确定要将该技师从推荐中移除吗？</span>
                      <span slot="footer">
                        <el-button @click="deleteTechVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleDeleteTech(scope.$index, scope.row)">确 定</el-button>
                      </span>
                    </el-dialog>

                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="服务推荐" name="服务推荐">
              <el-table ref="multipleTable" :data="reSerList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="预览图">
                  <template slot-scope="scope">
                    <div v-if="scope.row.thumbnailUrl">
                      <img :src="scope.row.thumbnailUrl" width="32" height="32" @click="authorImgVisible=true">
                      <!-- <el-dialog :visible.sync="authorImgVisible" width="30%" @close="authorImgVisible=false">
                                        <img :src="scope.row.headUrl">
                                    </el-dialog> -->
                    </div>
                    <div v-else class="defaultDiv"></div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="服务名称"> </el-table-column>
                <el-table-column prop="recommendSequence" label="推荐序号" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.recommendSequence" placeholder="" @change="changeSequenceNum1(scope.$index,scope.row)">
                    </el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="serverTypeName" label="服务类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="time" label="预计服务时间（分钟）" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="指导价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="isEnable" label="启用状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <!-- <el-popover placement="top" trigger="hover" :content="scope.row.isEnable?'自动启用':'自动禁用'"> -->
                    <el-switch slot="reference" v-model="scope.row.isEnable" :active-value=1 :inactive-value=0 @change="handleSwitchItem1(scope.row)">
                    </el-switch>
                    <!-- </el-popover> -->
                  </template>
                </el-table-column>

                <el-table-column label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="deleteTechVisible1=true">删除</el-button>
                    <el-dialog custom-class="imgDialog" :show-close="false" :visible.sync="deleteTechVisible1" width="25%" @close="deleteTechVisible1=false">
                      <img src="../../assets/images/delete3.png" alt="icon">

                      <span>确定要将该服务从推荐中移除吗？</span>
                      <span slot="footer">
                        <el-button @click="deleteTechVisible1 = false">取 消</el-button>
                        <el-button type="primary" @click="handleDeleteSer(scope.$index, scope.row)">确 定</el-button>
                      </span>
                    </el-dialog>

                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- <el-col :span="4">
                <el-button v-if="showBtn" type="primary" @click="recommandTechSettingVisible=true">推荐技师设置</el-button>
                <el-button v-else type="primary" @click="recommandSerSettingVisible=true">推荐服务设置</el-button>
            </el-col> -->
      </el-row>
    </el-main>
    <el-dialog title="选择技师" :visible.sync="recommandTechSettingVisible" width="30%" @close="recommandTechSettingVisible=false" custom-class="reTechDialog ">
      <el-table ref="multipleTable" :data="reTechListInDialog" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeOfTechInDia">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.headUrl" alt="头像" width="32" height="32" @click="authorImgVisible=true">
            <!-- <el-dialog :visible.sync="authorImgVisible" width="30%" @close="authorImgVisible=false">
                        <img :src="scope.row.headUrl">
                    </el-dialog> -->
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalNum" @current-change="currentChange" :page-size="pageSize" layout="prev, pager, next" :total="totalNum" background>
      </el-pagination>

      <span slot="footer">
        <el-button @click="recommandTechSettingVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureRecommandTechSetting">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择服务" :visible.sync="recommandSerSettingVisible" width="30%" @close="recommandSerSettingVisible=false" custom-class="reTechDialog">
      <el-table ref="multipleTable" :data="reSerListInDialog" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeOfSerInDia">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.thumbnailUrl" alt="头像" width="32" height="32" @click="authorImgVisible=true">
            <!-- <el-dialog :visible.sync="authorImgVisible" width="30%" @close="authorImgVisible=false">
                        <img :src="scope.row.headUrl">
                    </el-dialog> -->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="昵称" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalNum" @current-change="currentChange1" :page-size="pageSize" layout="prev, pager, next" :total="totalNum" background>
      </el-pagination>
      <span slot="footer">
        <el-button @click="recommandSerSettingVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureRecommandSerSetting">确 定</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import api from "../../fetch/api";
import { mapGetters } from "vuex";
export default {
  name: "recommandService",
  data: function() {
    return {
      activeName: "技师推荐",
      deleteTechVisible: false,
      deleteTechVisible1: false,
      reSerList: [
        {
          // name: "komolei",
          // recommandSequence: 1,
          // nick: "xxx",
          // status: 1
        }
      ], // 推荐技师列表
      reTechList: [
        {
          // name: "komolei",
          // recommandSequence: 1,
          // nick: "xxx",
          // status: 1
        }
      ], // 推荐服务列表
      reTechListInDialog: [], // 弹窗中推荐技师
      reSerListInDialog: [], // 弹窗中推荐服务
      multipleSelection: [],
      multipleSelectionOfTechInDia: [],
      multipleSelectionOfSerInDia: [],
      authorImgVisible: false,
      showBtn: true,
      recommandTechSettingVisible: false,
      recommandSerSettingVisible: false,
      pageSize: 4,
      totalNum: 10,
      page: 1
    };
  },
  computed: {
    ...mapGetters({
      storeInfo: "getStoreInfo",
      loginInfo: "getLoginInfo"
    })
  },
  methods: {
    goToPage(url) {
      this.$router.push({
        name: `${url}`
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.showBtn = !this.showBtn;
    },
    // 启用||关闭状态
    handleSwitchItem(item) {
      console.log("item is", item);
      api
        .updateStaff({
          storeId: this.storeInfo.id,
          id: item.id,
          isEnable: item.isEnable,
          sellerId: this.loginInfo.sellerId
        })
        .then(res => {
          res.retcode
            ? this.$message.success("更新成功")
            : this.$message.error(res.retmsg);
        });
    },
    handleSwitchItem1(item) {
      console.log("item is", item);
      api
        .updateServer({
          storeId: this.storeInfo.id,
          id: item.id,
          isEnable: item.isEnable,
          sellerId: this.loginInfo.sellerId
        })
        .then(res => {
          res.retcode
            ? this.$message.success("更新成功")
            : this.$message.error(res.retmsg);
        });
    },
    recommandTechSetting() {
      this.recommandTechSettingVisible = true;
      this.getRecommandTech({ isRecommend: 0, isInDialog: true });
    },
    recommandSerSetting() {
      this.recommandSerSettingVisible = true;
      this.getRecommandSer({ isRecommend: 0, isInDialog: true });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;

      console.log("re commend list is", this.multipleSelection);
    },
    handleSelectionChangeOfTechInDia(val) {
      let listLength = val.length + this.reTechList.length;
      if (listLength > 4) return this.$message.error("请勿选择超过4个");
      this.multipleSelectionOfTechInDia = val;

      console.log("tuijian tech list", this.multipleSelectionOfTechInDia);
    },
    handleSelectionChangeOfSerInDia(val) {
      let listLength = val.length + this.reSerList.length;
      if (listLength > 4) return this.$message.error("请勿选择超过4个");
      this.multipleSelectionOfSerInDia = val;
    },

    // 改变序号
    changeSequenceNum(index, item) {
      console.log("item is", item);
      if (!new RegExp(/^\d{0,1}$/).test(Number(item.recommendSequence)))
        return this.$message.error("只能输入1-9的数字");
      api
        .updateStaff({
          storeId: this.storeInfo.id,
          recommendSequence: item.recommendSequence,
          id: item.id
        })
        .then(res => {
          res.retcode
            ? this.$message.success("更新成功")
            : this.$message.error(res.retmsg);
        });
    },
    // 改变序号
    changeSequenceNum1(index, item) {
      if (!new RegExp(/^\d{0,1}$/).test(Number(item.recommendSequence)))
        return this.$message.error("只能输入1-9的数字");
      api
        .updateServer({
          storeId: this.storeInfo.id,
          recommendSequence: item.recommendSequence,
          id: item.id
        })
        .then(res => {
          res.retcode
            ? this.$message.success("更新成功")
            : this.$message.error(res.retmsg);
        });
    },
    handleBindSer(index, item) {
      this.$router.push({
        name: "bindServiceOfTechnician"
      });
    },
    handleDeleteTech(index, item) {
      //   this.reTechList.splice(index, 1);
      //   this.deleteTechVisible = false;

      let params = {
        sellerId: this.loginInfo.sellerId,
        store: this.storeInfo.id,
        id: item.id,
        isRecommend: 0
      };
      api.updateStaff(params).then(res => {
        res.retcode
          ? (this.$message.success("删除成功"),
            (this.deleteTechVisible = false),
            this.reTechList.splice(index, 1))
          : this.$message.error(res.retmsg);
      });
    },
    handleDeleteSer(index, item) {
      //   this.reSerList.splice(index, 1);
      // api
      //   .removeServer({
      //     id: item.id
      //   })
      let params={
        id:item.id,
        isRecommend:0,
        storeId:this.storeInfo.id,
      }
        api.updateServer(params).then(res => {
          res.retcode
            ? (this.$message.success("删除成功"),
              (this.deleteTechVisible1 = false),
              this.reSerList.splice(index, 1))
            : this.$message.error(res.retmsg);
        });
    },
    // 将技师变成推荐
    handleAddStaff(item) {
      console.log("item ----------------", item);
      let params = {
        id: item.id,
        isRecommend: 1,
        storeId: this.storeInfo.id,
        sellerId: this.loginInfo.sellerId
        // name: item.name,
        // nickName: item.nickName,
        // staffTypeId: item.staffTypeId,
        // staffTypeName: item.staffTypeName,
        // recommendSequence: item.recommandSequence,
        // headUrl: item.headUrl,
        // isEnable: item.isEnable
      };

      //   let params=Object.assign(item,{isRecommend:1})
      api.updateStaff(params).then(res => {
        if (res.retcode) {
          this.$message.success(res.retmsg);
          this.recommandTechSettingVisible = true;
          this.getRecommandTech();
        } else {
          this.$message.error(res.retmsg);
        }
      });
    },
    // 弹窗添加技师
    sureRecommandTechSetting() {
      console.log("技师正在被添加");

      if (this.reTechList.length >= 4) {
        this.$message.error("最多添加四个");
      } else {
        // return Promise.all(
        //   this.multipleSelectionOfTechInDia.map(this.handleAddStaff)
        // );
        let params = this.multipleSelectionOfTechInDia.map(item => item.id);
        api.recommendAllStaff(params).then(res => {
          res.retcode
            ? (this.$message.success("添加推荐技师成功"),
              this.getRecommandTech(),
              (this.recommandTechSettingVisible = false))
            : this.$message.error(res.retmsg);
        });
      }

      // .then(() => {})
      // .catch(e => this.$message.error("添加推荐失败"));
    },
    // 弹窗添加服务

    sureRecommandSerSetting() {
      if (this.reSerList.length >= 4) {
        this.$message.error("最多添加四个");
      } else {
        // return Promise.all(
        //   this.multipleSelectionOfSerInDia.map(this.handleUpdateServer)
        // );
        let params = this.multipleSelectionOfSerInDia.map(item => item.id);

        api.recommendAllServers(params).then(res => {
          res.retcode
            ? (this.$message.success("添加推荐服务成功"),
              this.getRecommandSer(),
              (this.recommandSerSettingVisible = false))
            : this.$message.error(res.retmsg);
        });
      }
    },

    // 将技师变成推荐
    handleUpdateServer(item) {
      console.log("item ----------------", item);
      let params = {
        id: item.id,
        isRecommend: 1,
        storeId: this.storeInfo.id,
        sellerId: this.loginInfo.sellerId
        // name: item.name,
        // nickName: item.nickName,
        // staffTypeId: item.staffTypeId,
        // staffTypeName: item.staffTypeName,
        // recommendSequence: item.recommandSequence,
        // headUrl: item.headUrl,
        // isEnable: item.isEnable
      };

      //   let params=Object.assign(item,{isRecommend:1})
      api.updateServer(params).then(res => {
        if (res.retcode) {
          this.$message.success(res.retmsg);
          this.recommandSerSettingVisible = true;
          this.getRecommandSer();
        } else {
          this.$message.error(res.retmsg);
        }
      });
    },

    currentChange(page) {
      this.page = page;
      this.getRecommandTech({ isRecommend: 0, isInDialog: true });
    },
    currentChange1(page) {
      this.page = page;
      this.getRecommandSer({ isRecommend: 0, isInDialog: true });
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
          sellerId: this.loginInfo.sellerId,
          isRecommend: 1
        }
      };
      api.queryStaffServer(params).then(res => {
        for (let item of res) {
          //   item.serverSize = item.servers.length;
          for (let node of tableData) {
            if (item.staff.id == node.id) {
              node.serverSize = item.list.length;
            }
          }
        }
        // this.tableData = tableData;
        this.reTechList = tableData;

        // this.tableData = Object.values(Object.assign({}, this.tableData, res));
      });
    },
    // 得到推荐技师列表
    getRecommandTech({ isRecommend = 1, isInDialog = false } = {}) {
      let params = {
        page: {
          pageNo: this.page,
          pageSize: this.pageSize
        },
        staff: {
          sellerId: this.loginInfo.sellerId,
          storeId: this.storeInfo.id,
          isRecommend: isRecommend
        }
      };

      api.queryStaffPage(params).then(res => {
        if (isInDialog) {
          this.reTechListInDialog = res.rows;
        } else {
          // this.reTechList = res.rows;
          this.getBindSerCount(res.rows);
        }
        this.totalNum = res.total;
      });
    },
    getRecommandSer({ isRecommend = 1, isInDialog = false } = {}) {
      let params = {
        page: {
          pageNo: this.page,
          pageSize: this.pageSize
        },
        server: {
          storeId: this.storeInfo.id,
          isRecommend: isRecommend
        }
      };
      api.queryServerPage(params).then(res => {
        if (isInDialog) {
          this.reSerListInDialog = res.rows;
        } else {
          this.reSerList = res.rows;
        }
        this.totalNum = res.total;
      });
    }
  },
  created() {
    this.getRecommandTech();
    this.getRecommandSer();
  }
};
</script>

<style lang="scss" scoped>
.commonHead .commonCon section.el-container {
  background: transparent;
}
.commonHead .commonCon section.el-container .el-main {
  padding: 0;
}
.reTechElContainer {
  background: transparent;
}
.reTechElRow {
  border-bottom: 1px solid #e8e8e8;
}
.reTechElMain {
  // 这个写到ele.css中去了
}
#app .el-main {
  padding: 0;
}
.reTechBtns {
  float: right;
  margin-right: 32px;
  line-height: 66px;
  button {
    min-width: 114px;
    min-height: 32px;
    padding: 0;
    position: relative;
    z-index: 2;
  }
}
.el-tabs__content {
  position: absolute;
}
.reTechDialog .el-pagination {
  float: none;
}
</style>
