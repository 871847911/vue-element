<template>
<el-container>
    <el-header style="height:176px">
        <el-row class="resetElRow">
            <el-col :span="20">{{storeInfo.name}}</el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
            </el-col>
        </el-row>
        <el-row class="secondElRow">
            <el-col :span="7">
                <el-row>
                    <el-col :span="24">
                        <el-button type="primary" @click="addTypeOfTech">添加类型</el-button>
                        <el-button type="primary" @click="goToPage('addService')">添加服务</el-button>
                    </el-col>
                    <el-col :span="24">
                        <span>注：最多可添加100个服务，还可添加{{serverCount}}个</span>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <el-row>
                            <span>服务搜索：</span>
                            <el-col :span="8">
                                <el-input v-model="searchText" placeholder="请输入服务名称"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" @click="searchSer">搜索</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <br/>
                    <el-col :span="24">
                        <span>服务状态：</span>
                        <el-radio-group v-model="statusOfSer" @change="changeStatusOfSer" class="thecRadioGS">
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
                        <span>
                服务类型：
              </span>
                        <el-select v-model="typeOfSer" placeholder="全部" @change="selectTypeOfSer">
                            <el-option v-for="(item,index) in typeOfSerList" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-col>
                    <br/>
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
    <el-main class="serviceMCT">

        <el-table ref="multipleTable" :data="totalTableData" style="width: 100%" @expand-change="expandChange"  empty-text="暂无数据~">
            <el-table-column type="expand" width="55" label-class-name="el-icon-caret-bottom" ref="expandCt">
                <template slot-scope="props">
                    <el-table :data="expandedTableData" tooltip-effect="dark" @selection-change="handleSelectionChange" id="setColumnBg">
                        <el-table-column type="selection" width="55">

                        </el-table-column>
                        <el-table-column label="预览图" type="index" width="200">

                            <template slot-scope="scope">
                                <div v-if="scope.row.thumbnailUrl">
                                    <img :src="scope.row.thumbnailUrl" width="32" height="32" @click="getImgUrl(scope.row.thumbnailUrl)">
                                    <el-dialog :visible.sync="authorImgVisible" width="30%" @close="authorImgVisible=false">
                                        <img :src="imgUrl" width="400" height="400">
                                    </el-dialog>
                                </div>
                                <div v-else class="defaultDiv"></div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="服务名称"> </el-table-column>
                        <el-table-column prop="sequence" label="序号" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.sequence" placeholder="" @change="changeSequenceNum(scope.$index,scope.row)">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="serverTypeName" label="技师类型" show-overflow-tooltip class-name="showNickName">
                        </el-table-column>
                        <el-table-column prop="time" label="预计服务时间（分钟）" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="price" label="指导价格" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="isEnable" label="启用状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-popover placement="top" trigger="hover" :content="scope.row.isEnable?'自动启用':'自动禁用'">
                                    <el-switch slot="reference" v-model="scope.row.isEnable" :active-value=1 :inactive-value=0 @change="handleSwitchItem(scope.row)">
                                    </el-switch>
                                </el-popover>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" show-overflow-tooltip width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)"> 配置</el-button>
                                <el-button size="mini" type="text" @click="delSer(scope.$index,scope.row)">删除</el-button>

                            </template>
                        </el-table-column>
                    </el-table>

                </template>
            </el-table-column>

            <el-table-column class-name="serviceM">
                <template slot-scope="props">
                    <span>{{props.row.name}}</span>
                    <span>{{props.row.recommendSequence }}</span>
                    <el-button type="text" @click="deleteType(props.$index,props.row)" class="btn setM">删除</el-button>
                    <el-button type="text" @click="modifyType(props.$index,props.row)" class="btn">修改类型</el-button>
                    <el-dialog :show-close="false" custom-class="imgDialog" :visible.sync="deleteTypeVisible" width="25%" @close="deleteTypeVisible=false">
                        <div>
                            <img src="../../assets/images/delete3.png" alt="icon">
                            <span>
                  删除类型同时会删除所属的全部服务，确定继续删除吗
                </span>
                        </div>
                        <span slot="footer">
                <el-button @click="deleteTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureDeleteType">确 定</el-button>
              </span>
                    </el-dialog>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="setElPagination" background layout=" prev, pager, next,sizes, jumper" :total="total" :page-size="pageSize" @current-change="currentChange"></el-pagination>
    </el-main>
    <!-- 删除服务 -->
    <el-dialog :show-close="false" :visible.sync="deleteTechVisible" width="25%" @close="deleteTechVisible=false" custom-class="imgDialog">
        <div>
            <img src="../../assets/images/delete3.png" alt="icon">
            <span>确定删除{{serverName}}服务吗</span>
        </div>
        <span slot="footer">
        <el-button @click="deleteTechVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <router-view></router-view> -->
    <el-dialog custom-class="reTechDialog" title="新增服务类型" width="30%" :visible.sync='addTypeOfTechVisible' @close='addTypeOfTechVisible=false'>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
            <el-form-item label="类型名称：" prop="type">
                <el-input v-model="ruleForm.type"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
                <el-input v-model="ruleForm.sort"></el-input>
            </el-form-item>
            <el-form-item>
                <span>排序用于控制小程序端服务列表顺序</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
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

</el-container>
</template>

<script>
import api from "../../fetch/api";
import store from "@/store/index";
import { mapGetters } from "vuex";
export default {
  name: "serviceManage",
  data: function() {
    var checkType = (rule, value, callback) => {
      if (new RegExp(/^[\u4e00-\u9fa50-9]{1,12}$/).test(value)) {
        return callback();
      } else {
        callback(new Error("请输入汉字或数字，最大不超过12个字符"));
      }
    };
    var checkSort = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入序号"));
      } else {
        if (
          Number(value) > 0 &&
          Number(value) < 20 &&
          Math.floor(Number(value)) == Number(value)
        ) {
          callback();
        } else {
          callback(new Error("请输入1-20的整数"));
        }
      }
    };

    return {
      serverCount: 100,
      imgUrl: "", // dialog中展示的图片链接
      arrows: [], // dom节点
      storeId: "", // 店铺id
      serverTypeName: "", // 服务类型名字
      addTypeOfTechVisible: false, // 控制弹窗的
      serObj: {}, // 中间变量，充当载体。
      isUpdate: false, // 判断是否是修改服务类型还是更新，
      searchText: "",
      typeOfSer: "",
      typeOfSerList: [],
      statusOfSer: "全部",
      // statusOfBatchOperate: "批量启用",
      statusOfBatchOperate: "",
      isStatusOfBatch: "",
      deleteTechVisible: false,
      deleteTechBatchVisible: false,
      openOrClosedTechBatchVisible: false,
      totalTableData: [],
      expandedTableData: [],
      deleteTypeVisible: false,
      tableData: [],
      multipleSelection: [],
      authorImgVisible: false,
      total: 10,
      pageSize: 15,
      page: 0,
      isEnable: "", // 服务状态
      serverObj: {}, // 服务对象
      serverName: "", // 服务名称
      serverIndex: "", // 服务在列表中的index
      ruleForm: {
        type: "",
        sort: ""
      },
      rules: {
        type: [
          {
            validator: checkType,
            trigger: "blur"
          }
        ],
        sort: [
          {
            validator: checkSort,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      storeInfo: "getStoreInfo"
    })
  },
  methods: {
    getServerCount() {
      let params = {
        storeId: this.storeInfo.id
      };
      api.queryServerCount(params).then(res => {
        this.serverCount = 100 - res.count;
        if (res.count == 100) {
          this.$message.error("添加服务数量达到上限");
        }
      });
    },
    getImgUrl(url) {
      this.authorImgVisible = true;
      this.imgUrl = url;
    },
    goToPage(url) {
      // this.$router.push({path:`/totalManageC/${url}`})
      this.$router.push({
        name: `${url}`
      });
    },
    // 添加服务类型
    addTypeOfTech() {
      this.addTypeOfTechVisible = true;
      // this.$refs.ruleForm.resetFields();
    },
    // 得到服务类型
    getSerTypeList() {
      let params = {
        storeId: this.storeInfo.id,
        name: this.typeOfSer == "全部" ? "" : this.typeOfSer
      };
      api.queryServerTypePage(params).then(res => {
        this.totalTableData = res.rows;
        // this.typeOfSerList = res.rows;
        this.total = res.total;
      });
    },
    // 下拉框服务类型
    selectTypeOfSer() {
      this.getSerTypeList();
    },
    getSerTypeList1() {
      let params = {
        storeId: this.storeInfo.id
      };
      api.queryServerTypePage(params).then(res => {
        this.typeOfSerList = res.rows;
        this.typeOfSerList.unshift({
          name: "全部",
          id: ""
        });
        this.total = res.total;
      });
    },
    // 技师状态
    changeStatusOfSer() {
      switch (this.statusOfSer) {
        case "全部":
          this.isEnable = "";
          this.expandChange();
          break;
        case "启用":
          this.isEnable = 1;
          this.expandChange();

          break;
        default:
          this.isEnable = 0;
          this.expandChange();

          break;
      }
    },
    // 服务搜索
    searchSer() {
      let params = {
        page: {},
        server: {
          storeId: this.storeInfo.id,
          name: this.searchText,
          serverTypeName: this.typeOfSer
        }
      };
      console.log("params", params);
      api.queryServerPage(params).then(res => {
        console.log("res is", res);
        this.expandedTableData = res.rows;
        // this.totalTableData = res.rows;
        // this.typeOfSerList = res.rows;
        // this.typeOfSerList.unshift({
        //   name: "全部",
        //   storeId: ""
        // });
      });
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
      api.removeServers(this.multipleSelection).then(res => {
        res.retcode
          ? (this.$message.success("更新成功"),
            this.expandChange(),
            (this.deleteTechBatchVisible = false))
          : this.$message.error(res.retmsg);
        this.statusOfBatchOperate = "";
      });
    },
    // 确定批量停用或启用
    batchHandleOpenOrClose() {
      if (!this.isStatusOfBatch) {
        api.enableServers(this.multipleSelection).then(res => {
          res.retcode
            ? (this.$message.success("更新成功"),
              this.expandChange(),
              (this.openOrClosedTechBatchVisible = false))
            : this.$message.error(res.retmsg);
        });
        this.statusOfBatchOperate = "";
      } else {
        api.disableServers(this.multipleSelection).then(res => {
          res.retcode
            ? (this.$message.success("更新成功"),
              this.expandChange(),
              (this.openOrClosedTechBatchVisible = false))
            : this.$message.error(res.retmsg);
          this.statusOfBatchOperate = "";
        });
      }
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
      if (!new RegExp(/^[1-9]\d*$/).test(item.sequence))
        return this.$message.error("只能输入正整数");
      api
        .updateServer({
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
    handleEdit(index, item) {
      store.dispatch("changeServerInfo", item);
      this.$router.push({
        name: "modifyService"
      });
    },
    delSer(index, item) {
      this.deleteTechVisible = true;
      this.serverObj = item;
      this.serverName = item.name;
      this.serverIndex = index;
    },

    handleDelete() {
      let params = {
        id: this.serverObj.id
      };
      api.removeServer(params).then(res => {
        res.retcode
          ? (this.$message.success("删除成功"),
            (this.deleteTechVisible = false),
            this.tableData.splice(this.serverIndex, 1))
          : this.$message.error(res.retmsg);
      });
    },
    currentChange(page) {
      this.page = page;
      this.getSerTypeList();
    },
    // expandChange(row,expandedRows){
    //   console.log('row,expandRow is',row,expandedRows);
    //   if(expandedRows.length>1){
    //         expandedRows.shift()
    //       }

    // },
    expandChange(
      row = {
        id: "",
        storeId: "",
        name: "全部"
      },
      expandedRows = []
    ) {
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
      this.storeId = row.storeId ? row.storeId : this.storeId;
      this.serverTypeName = row.name == "全部" ? this.serverTypeName : row.name;
      let params = {
        page: {},
        server: {
          storeId: this.storeId,
          serverTypeName: this.serverTypeName,
          serverTypeId: row.id,
          isEnable: this.isEnable,
          name: this.searchText
        }
      };
      api.queryServerPage(params).then(res => {
        this.expandedTableData = res.rows;
      });
    },

    modifyType(index, item) {
      this.ruleForm.type = item.name;
      this.ruleForm.sort = item.sequence;
      this.ruleForm.id = item.id;
      this.addTypeOfTechVisible = true;
      this.isUpdate = true;
    },
    deleteType(index, item) {
      this.deleteTypeVisible = true;
      this.serObj = item;
    },
    sureDeleteType() {
      api.removeServerType(this.serObj).then(res => {
        res.retcode
          ? (this.$message.success(res.retmsg),
            (this.deleteTypeVisible = false),
            this.getSerTypeList())
          : this.$message.error(res.retmsg);
      });
    },
    // 添加服务类型
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            name: this.ruleForm.type,
            sequence: this.ruleForm.sort,
            storeId: this.storeInfo.id
          };
          if (this.isUpdate) {
            params.id = this.ruleForm.id;
            api.updateServerType(params).then(res => {
              res.retcode
                ? (this.$message.success(res.retmsg),
                  (this.addTypeOfTechVisible = false),
                  this.getSerTypeList())
                : this.$message.error(res.retmsg);
            });
            this.isUpdate = false;
          } else {
            api.addServerType(params).then(res => {
              res.retcode
                ? (this.$message.success(res.retmsg),
                  (this.addTypeOfTechVisible = false),
                  this.getSerTypeList())
                : this.$message.error(res.retmsg);
            });
          }
          this.$refs.ruleForm.resetFields();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addTypeOfTechVisible = false;
    }
  },
  created() {
    // this.getTotalStoreList();
    this.getSerTypeList();
    this.getSerTypeList1();
    this.getServerCount();
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
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
          font-weight: 400;
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

.btn {
  float: right;
}

.setM {
  margin: 0 27px 0 40px;
}

.serviceMCT {
  //   .el-table__header-wrapper {
  // display: none;
  //   }
  .el-button {
    &:focus,
    &:active,
    &:hover {
      border-color: transparent;
    }
  }
}

.el-button.el-button--default:hover {
  border-color: #18CCC0;
}

.serviceM span {
  line-height: 40px;
}

.reTechDialog {
  > .el-dialog__body {
    padding-bottom: 0;
  } // .el-form-item__label{
  /*ele.css*/
  // }
  .el-form-item {
    &:nth-child(2) {
      margin-bottom: 0px;
    }
    &:last-child {
      margin-bottom: 0;
      span {
        @include fontLight;
      }
    }
  }
}
</style>
