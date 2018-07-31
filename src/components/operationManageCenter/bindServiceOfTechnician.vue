<template>
  <el-container>
    <el-header style="height:126px">
      <el-row class="resetElRow">
        <el-col :span="20">{{storeInfo.name}}</el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
        </el-col>
      </el-row>

      <el-row class="secondElRow">
        <el-col :span="3" width="100">
          <img :src="techInfo.headUrl" alt="" width="48" height="48">
        </el-col>
        <el-col :span="3">
          <el-row>
            <el-col :span="24">
              <b>{{techInfo.name}}</b>
            </el-col>
            <el-col :span="24">
              <span>技师昵称：</span>
              <span>{{techInfo.nickName}}</span>
            </el-col>

          </el-row>
        </el-col>
        <el-col :span="3">
          <el-row>
            <el-col :span="24"></el-col>
            <el-col :span="24">
              <span>创建时间：</span>
              <span>{{new Date(techInfo.createDate).toLocaleDateString().replace(/\//g, "-")}}</span>
            </el-col>
            <el-col :span="24">
              <span>技师类型：</span>
              <span>{{techInfo.staffTypeName}}</span>
            </el-col>

          </el-row>

        </el-col>
        <el-col :span="3">
          <el-row>
            <!-- <el-col :span="24">
                        <b>{{techInfo.id}}</b>
                    </el-col> -->
            <el-col :span="24">
              <span>当前状态:</span>
              <span v-if="techInfo.isEnable">已启用</span>
              <span v-else>未启用</span>
            </el-col>
            <el-col :span="24">
              <span>已绑定服务:
                <b>{{bindServiceNum}}</b>
              </span>
            </el-col>
          </el-row>

        </el-col>
        <el-col :span="4" :push="8" class="lastElCol">
          <!-- <el-button type="primary" @click="pageBack">返回</el-button> -->
        </el-col>

      </el-row>
    </el-header>

    <el-main>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" cell-class-name="resetCell">
        <el-table-column label="服务缩略图">
          <template slot-scope="scope">
            <div v-if="scope.row.thumbnailUrl">
              <img :src="scope.row.thumbnailUrl" width="32" height="32" @click="authorImgVisible=true">
              <el-dialog :visible.sync="authorImgVisible" width="30%" @close="authorImgVisible=false">
                <img :src="scope.row.thumbnailUrl">
              </el-dialog>
            </div>
            <div class="defaultDiv" v-else></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="服务名称"> </el-table-column>
        <el-table-column prop="serverTypeName" label="服务类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isEnable" label="服务状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <el-popover placement="top" width="40" trigger="hover" :content="scope.row.isEnable?'自动启用':'自动禁用'"> -->
              <el-switch slot="reference" v-model="scope.row.isEnable" :active-value=1 :inactive-value=0 @change="handleSwitchItem(scope.row)">
              </el-switch>
            <!-- </el-popover> -->
          </template>

        </el-table-column>
        <el-table-column label="操作" prop="bindStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button v-if="scope.row.bindStatus||null " size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)"> 确定绑定</el-button>
            <el-button id="noBC" v-else size="mini" @click="handleEdit1(scope.$index, scope.row)"> 取消绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next,sizes, jumper" :total="total" :current-page="1" :page-size="pageSize" @current-change="currentChange"></el-pagination>

    </el-main>
    <el-footer>
    </el-footer>
    <!-- <router-view></router-view> -->
  </el-container>
</template>



<script>
import store from "@/store/index";
import api from "../../fetch/api";
import { mapGetters } from "vuex";
export default {
  name: "bindServiceOfTechnician",
  data: function() {
    return {
      bindServiceNum: 0,
      perHaveSerList: [], // 个人拥有的服务
      totalData: [], // 所有服务
      tableData: [
        // {
        //   authorImg:
        //     "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2107961350,3702928033&fm=27&gp=0.jpg",
        //   date: "2016-05-03",
        //   name: "komolei",
        //   sequenceNum: "",
        //   nickName: "王小虎",
        //   typeOfTech: "sexy",
        //   bindServiceNum: 0,
        //   address: "上海市普陀区金沙江路 1518 弄",
        //   status: false,
        //   bindStatus: false //服务绑定状态
        // }
      ],
      multipleSelection: [],
      authorImgVisible: false,
      total: 10,
      pageSize: 10,
      page: 0
    };
  },
  watch: {
    tableData: function() {
      return this.tableData;
    }
  },
  computed: {
    ...mapGetters({
      storeInfo: "getStoreInfo",
      techInfo: "getTechInfo",
      loginInfo: "getLoginInfo"
    })
  },
  methods: {
    goToPage(url) {
      this.$router.push({
        name: `${url}`
      });
    },
    pageBack() {
      this.$router.go(-1);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 启用||关闭状态
    handleSwitchItem(item) {
      console.log("item is", item);
      api
        .updateServer({
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
      console.log("change sequence", index, item);
    },
    handleEdit(index, item) {
      console.log("index:", index, "item", item);
      api
        .addServerStaff({ serverId: item.id, staffId: this.techInfo.id })
        .then(res => {
          res.retcode
            ? (this.$message.success("绑定成功"), this.getIsBindSerList())
            : this.$message.error("绑定失败");
        });
    },
    handleEdit1(index, item) {
      console.log("index:", index, "item", item);
      api
        .removeServerStaff({ serverId: item.id, staffId: this.techInfo.id })
        .then(res => {
          res.retcode
            ? (this.$message.success("解绑成功"), this.getIsBindSerList())
            : this.$message.error("解绑失败");
        });
    },
    handleBindSer(index, item) {
      this.$router.push({
        name: "bindServiceOfTechnician"
      });
    },
    handleDelete(index, item) {
      this.tableData.splice(index, 1);
    },
    currentChange(page) {
      this.page = page;
      // this.total = 1;
      // this.getSerList();
      this.getIsBindSerList();
    },
    getSerList() {
      let params = {
        page: {
          pageNo: this.page ? this.page : 1,
          pageSize: this.pageSize
        },
        server: {
          storeId: this.storeInfo.id,
          sellerId: this.loginInfo.sellerId
        }
      };
      api.queryServerPage(params).then(res => {
        console.log("res is1", res);
        this.total = res.total;
        this.tableData = res.rows;
      });
    },
    getSerList1() {
      return new Promise((resolve, reject) => {
        let params = {
          page: {
            pageNo: this.page ? this.page : 1,
            pageSize: this.pageSize
          },
          server: {
            storeId: this.storeInfo.id,
            sellerId: this.loginInfo.sellerId
          }
        };
        api.queryServerPage(params).then(res => {
          console.log("res is1---------", res);
          this.total = res.total;
          // this.totalData = res.rows;
          resolve(res.rows);

          // this.tableData = res.rows;
          // resolve(res.rows);
        });
      });
    },

    getPerHaveSerList() {
      return new Promise((resolve, reject) => {
        api.queryByStaff({ staffid: this.techInfo.id }).then(res => {
          console.log("this.tech is2", res);
          this.bindServiceNum = res.size;
          // this.perHaveSerList = res.rows;
          resolve(res.rows);
        });
      });

      // .then(res => {

      //   this.perHaveSerList

      //   this.getSerList1().then(tableData => {
      //     console.log("tableData", tableData);
      //     if (res.length == 0) {
      //       tableData.map(item => (item.bindStatus = true));
      //     } else {
      //       tableData.map(item => {
      //         res.map(childItem => {
      //           if (item.id == childItem.id) {
      //             item.bindStatus = false;
      //           } else {
      //             item.bindStatus = true;
      //           }
      //         });
      //       });
      //     }

      //     this.tableData = tableData;
      //     console.log("this.tableData is3", tableData);
      //   });
      // });
    },
    // 对比总服务和个人所拥有的服务，得出是否需要绑定服务
    async getIsBindSerList() {
      await this.handle().then(res => {
        console.log("reswwwwwww 1111111is", res);
        let perHaveSerList = res.first,
          totalData = res.second;
        for (let item of totalData) {
          item.bindStatus = true;
        }
        for (let item of perHaveSerList) {
          for (let node of totalData) {
            if (item.id == node.id) {
              node.bindStatus = false;
            }
          }
        }
        this.tableData = totalData;
        console.log("table is", this.tableData);
      });
    },

    async handle() {
      console.log(1111111111111);
      let perHaveSerList = await this.getPerHaveSerList();
      let totalData = await this.getSerList1();
      console.log(33333333333333331111111111111);

      return { first: perHaveSerList, second: totalData };
    }
  },
  created() {
    // this.getSerList();
    // this.getPerHaveSerList();
    // this.getIsBindSerList();
    this.getIsBindSerList();
  }
};
</script>



<style lang="scss" scoped>
.secondElRow {
  .el-col.el-col-24:first-child {
    margin-bottom: 5px;
  }
  .el-col.el-col-3 {
    &:first-child {
      padding-left: 32px;
    }
  }
  span {
    @include fontLightC;
  }
  .el-col.el-col-8 {
    .el-col {
      height: 60px;
      margin: 5px 0;
    }
  }
  .lastElCol button {
    float: right;
    margin-right: 32px;
  }
}
</style>
