<template>
    <div id="messageCenter">
        <p class="title">消息中心</p>
        <div class="choose-booking">
            <div class="booking">
                <p>消息通知类型：</p>
                <el-select v-model="storeChoose" placeholder="全部">
                    <el-option v-for="(item, index) in storeList" :key="item.index" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-tel">
                <p>标题搜索：</p>
                <el-input v-model="searchTitle" maxlength="30" placeholder="请输入标题"></el-input>
            </div>
            <div class="search-time">
                <p>发布时间范围：</p>
                <el-date-picker v-model="timeValue" type="datetimerange" @change="getTime" range-separator="至" start-placeholder="起始时间" end-placeholder="结束时间">
                </el-date-picker>
                <el-button type="primary" @click="searchOrder">搜索</el-button>
            </div>
        </div>
        <div class="radio_box">
            <div>
                <p>消息状态：</p>
                <el-radio-group v-model="radio" @change="chooseStatus">
                    <el-radio-button label="全部"></el-radio-button>
                    <el-radio-button label="已读"></el-radio-button>
                    <el-radio-button label="未读"></el-radio-button>
                </el-radio-group>
            </div>

            <div class="piliang">
                <el-button @click="batchread">批量标为已读</el-button>
                <el-button @click="batchHandle">批量删除</el-button>
            </div>
        </div>
        <div class="cont">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_read==0">
                            <img style="vertical-align: middle" src="../../assets/images/noread.png" width="24" height="24">
                        </div>
                        <div v-else>
                            <img style="vertical-align: middle" src="../../assets/images/isread.png" width="24" height="24">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="通知类型"> </el-table-column>
                <el-table-column prop="title" label="标题"> </el-table-column>
                <el-table-column prop="release_time" label="发布时间" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index)"> 删除</el-button>
                        <el-button type="text" size="mini" @click="handleBindSer(scope.row,scope.$index)">查看详情</el-button>
                        <el-button size="mini" v-if="scope.row.is_read==0" type="text" @click="delTech(scope.row,scope.$index) ">标为已读</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="prev, pager, next, sizes, jumper" :total="this.total"></el-pagination>
        </div>

        <el-dialog title="" :visible.sync="deleteTechVisible" width="433px">
            <img src="../../assets/images/delete3.png" alt="">
            <p>确定要删除消息吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteTechVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDelete">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="" :visible.sync="isreaddialog" width="433px">
            <img src="../../assets/images/Icon_Question@2x.png" alt="">
            <p>确定要标为已读吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isreaddialog = false">取 消</el-button>
                <el-button type="primary" @click="isreadshure">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="" :visible.sync="alldeleteTechVisible" width="433px">
            <img src="../../assets/images/delete3.png" alt="">
            <p>确定要批量删除消息吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="alldeleteTechVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDeleteAll">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="" :visible.sync="allisreaddialog" width="433px">
            <img src="../../assets/images/Icon_Question@2x.png" alt="">
            <p>确定要批量标为已读吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="allisreaddialog = false">取 消</el-button>
                <el-button type="primary" @click="allisreadshure">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import api from "../../fetch/api";
import store from "@/store/index";
import { mapGetters } from "vuex";
export default {
    name: "messageCenter",
    data() {
        return {
            searchTitle: "",
            storeChoose: "",
            dialogOrder: false,
            dialogState: false,
            dialogCancelReason: false,
            dialogcheckReason: false,
            textarea: "",
            timeValue: [new Date() - 3600 * 1000 * 24 * 30, new Date() - 0],
            radio: "全部",
            tableData: [],
            startTime: "",
            endTime: "",
            total: 0,
            pageSize: 10,
            currentPage: 1,
            status: "",
            isRead: "",
            itemOrder: {},
            deleteTechVisible: false,
            isreaddialog: false,
            allisreaddialog: false,
            alldeleteTechVisible: false,
            storeList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "系统公告",
                    label: "系统公告"
                },
                {
                    value: "产品动态",
                    label: "产品动态"
                }
            ],
            value: "",
            statusOfBatchOperate: [],
            multipleSelection: [],
            clickID: "",
            clickindex: ""
        };
    },
    created() {
        console.log(this.timeValue);
        this.startTime =
            new Date(this.timeValue[0])
                .toLocaleDateString()
                .replace(/\//g, "-") +
            " " +
            new Date(this.timeValue[0]).toTimeString().substr(0, 8);
        this.endTime =
            new Date(this.timeValue[1])
                .toLocaleDateString()
                .replace(/\//g, "-") +
            " " +
            new Date(this.timeValue[1]).toTimeString().substr(0, 8);
        this.queryMessageReceivePage();
        this.getItem();
    },
    computed: {
        ...mapGetters({
            loginInfo: "getLoginInfo"
        })
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (row.is_read === 0) {
                return "noread-row";
            } else if (row.is_read === 1) {
                return "isread-row";
            }
            return "";
        },
        getItem() {
            let params = {
                accountId: this.loginInfo.id,
                isDelete: "0",
                pageNo: 1,
                pageSize: 2,
                isRead: "0",
                title: "",
                type: ""
            };
            api.queryMessageReceivePage(params).then(res => {
                if (res.rows.length > 0) {
                    store.dispatch("changerdItem", true);
                } else {
                    store.dispatch("changerdItem", false);
                }
                console.log("有无消息", res.rows);
            });
        },
        queryMessageReceivePage() {
            if (this.searchTitle == "") {
                this.searchTitle = this.searchTitle;
            } else {
                this.searchTitle = this.searchTitle.replace(/\s+/g, "");
            }
            let params = {
                accountId: this.loginInfo.id,
                isDelete: "0",
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                isRead: this.isRead,
                startTime: this.startTime,
                endTime: this.endTime,
                title: this.searchTitle,
                type: this.storeChoose
            };
            api.queryMessageReceivePage(params).then(res => {
                this.tableData = res.rows;
                this.total = res.total;
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows[i].release_time != "") {
                        res.rows[i].release_time =
                            new Date(res.rows[i].release_time)
                                .toLocaleDateString()
                                .replace(/\//g, "-") +
                            " " +
                            new Date(res.rows[i].release_time)
                                .toTimeString()
                                .substr(0, 8);
                    }
                }
                console.log("信息", res.rows);
            });
        },
        chooseStatus() {
            if (this.radio == "已读") {
                this.isRead = "1";
            } else if (this.radio == "未读") {
                this.isRead = "0";
            } else {
                this.isRead = "";
            }
            this.queryMessageReceivePage();
        },
        //删除操作
        handleEdit(i, e) {
            console.log("id", i.id);
            console.log(e);
            this.clickID = i.id;
            this.clickindex = e;
            this.deleteTechVisible = true;
        },
        //弹窗确定删除
        handleDelete() {
            let params = {
                id: this.clickID,
                isDelete: "1"
            };
            api.updateOperateMessageReceive(params).then(res => {
                if (res.retmsg == "操作成功") {
                    this.queryMessageReceivePage();
                    this.deleteTechVisible = false;
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.retmsg);
                }
                console.log("删除", res);
            });
        },
        //查看详情
        handleBindSer(i, e) {
            let params = {
                id: i.id,
                isRead: "1"
            };
            api.updateOperateMessageReceive(params).then(res => {
                if (res.retmsg == "操作成功") {
                    this.$router.push({
                        name: "messageDetail",
                        query: { id: i.id }
                    });
                } else {
                    this.$message.error(res.retmsg);
                }
                console.log("标记为已读", res);
            });
        },
        //标为已读
        delTech(i, e) {
            console.log("id", i.id);
            console.log(e);
            this.clickID = i.id;
            this.clickindex = e;
            this.isreaddialog = true;
        },
        //标记已读弹窗
        isreadshure() {
            let params = {
                id: this.clickID,
                isRead: "1"
            };
            api.updateOperateMessageReceive(params).then(res => {
                if (res.retmsg == "操作成功") {
                    this.queryMessageReceivePage();
                    this.isreaddialog = false;
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.retmsg);
                }
                console.log("标记为已读", res);
            });
        },
        //选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.multipleSelection = val.map(item => item.id);
            this.multipleSelection = this.multipleSelection.join(",");
        },
        // 批量删除
        batchHandle() {
            if (!this.multipleSelection.length) {
                return this.$message.error("请勾选消息明细后再点击");
            } else {
                this.alldeleteTechVisible = true;
            }
        },
        // 批量删除弹窗
        handleDeleteAll() {
            if (!this.multipleSelection.length) {
                return this.$message.error("请勾选消息明细后再点击");
            } else {
                let params = {
                    id: this.multipleSelection
                };
                api.deleteMessages(params).then(res => {
                    if (res.retmsg == "操作成功") {
                        this.alldeleteTechVisible = false;
                        this.$message({
                            message: "操作成功",
                            type: "success"
                        });
                        this.queryMessageReceivePage();
                    } else {
                        this.$message.error(res.retmsg);
                    }
                    console.log("批量删除", res);
                });
            }
        },
        //批量已读
        batchread() {
            if (!this.multipleSelection.length) {
                return this.$message.error("请勾选消息明细后再点击");
            } else {
                this.allisreaddialog = true;
            }
        },
        //批量已读
        allisreadshure() {
            if (!this.multipleSelection.length) {
                return this.$message.error("请勾选消息明细后再点击");
            } else {
                let params = {
                    id: this.multipleSelection
                };
                api.readMessages(params).then(res => {
                    if (res.retmsg == "操作成功") {
                        this.allisreaddialog = false;
                        this.$message({
                            message: "操作成功",
                            type: "success"
                        });
                        this.queryMessageReceivePage();
                    } else {
                        this.$message.error(res.retmsg);
                    }
                    console.log("批量已读", res);
                });
            }
        },
        //修改消息类型
        searchOrder() {
            console.log(this.storeChoose);
            if (this.timeValue != null) {
                this.startTime =
                    new Date(this.timeValue[0])
                        .toLocaleDateString()
                        .replace(/\//g, "-") +
                    " " +
                    new Date(this.timeValue[0]).toTimeString().substr(0, 8);
                this.endTime =
                    new Date(this.timeValue[1])
                        .toLocaleDateString()
                        .replace(/\//g, "-") +
                    " " +
                    new Date(this.timeValue[1]).toTimeString().substr(0, 8);
            } else {
                this.startTime = "";
                this.endTime = "";
            }
            this.queryMessageReceivePage();
        },
        //每页几条
        handleSizeChange(size) {
            this.pageSize = size;
            this.queryMessageReceivePage();
        },
        //当前在第几页
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.queryMessageReceivePage();
        },
        getTime() {
            console.log("日期插件", this.timeValue);
        }
    }
};
</script>

<style lang="scss">
#messageCenter {
    width: calc(100% - 48px);
    width: -webkit-calc(100% - 48px);
    width: -moz-calc(100% - 48px);
    height: calc(100% - 48px);
    height: -webkit-calc(100% - 48px);
    height: -moz-calc(100% - 48px);
    border: 24px solid #edf2f5;
    overflow: auto;
    .search_input::-webkit-input-placeholder {
        color: #f66;
    }
    .search_input:-moz-placeholder {
        color: #f66;
    }
    .search_input::-moz-placeholder {
        color: #f66;
    }
    .search_input:-ms-input-placeholder {
        color: #f66;
    }
    .is-active {
        .el-radio-button__inner {
            color: rgba(24, 204, 192, 1);
            background: #fff;
            border-color: rgba(24, 204, 192, 1);
            box-shadow: -1px 0 0 0 rgba(24, 204, 192, 1);
            -webkit-box-shadow: -1px 0 0 0 rgba(24, 204, 192, 1);
        }
    }
    .el-radio-button__inner:hover {
        color: rgba(24, 204, 192, 1);
        -webkit-box-shadow: -1px 0 0 0 rgba(24, 204, 192, 1);
        box-shadow: -1px 0 0 0 rgba(24, 204, 192, 1);
    }
    .title {
        height: 66px;
        line-height: 66px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.85);
        text-indent: 32px;
        font-weight: 900;
        flex: 1;
    }
    .choose-booking {
        display: flex;
        padding: 0 32px 24px;
        // border-left: 24px solid #edf2f5;
        // border-right: 24px solid #edf2f5;
        .booking {
            display: flex;
            align-items: center;
            p {
                width: 100px;
            }
            .el-select {
                width: 170px;
            }
        }
        .search-tel {
            margin-left: 40px;
            display: flex;
            align-items: center;
            p {
                width: 73px;
            }
            .el-input {
                width: 170px;
            }
        }
        .search-time {
            margin-left: 40px;
            display: flex;
            align-items: center;
            p {
                width: 100px;
            }
            .el-date-editor {
                width: 372px;
            }
            .el-button {
                margin-left: 16px;
            }
        }
    }
    .radio_box {
        padding: 0 32px 0;
        display: flex;
        justify-content: space-between;
        p {
            display: inline;
        }
    }
    .cont {
        // height: calc(100% - 202px);
        // height: -webkit-calc(100% - 202px);
        // height: -moz-calc(100% - 202px);
        // border: 24px solid #edf2f5;
        // border-top: 0;
        // overflow: auto;
        .piliang {
            float: right;
            margin-right: 32px;
            .el-button {
                margin-left: 14px;
                span {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.65);
                }
            }
        }
        .el-radio-group {
            margin: 0 32px 0;
        }
    }
    .booking-state {
        display: flex;
        margin-top: 20px;
        align-items: center;
        p {
            width: 120px;
        }
    }
    .el-table {
        // height: calc(100% - 188px);
        // height: -webkit-calc(100% - 188px);
        // height: -moz-calc(100% - 188px);
        th {
            .cell {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.85);
            }
        }
        .el-table_1_column_11 {
            .cell {
            }
        }
        .el-button.el-button--text {
            margin: 0 10px 0 0;
        }
    }
    .el-table .noread-row {
        font-weight: 900;
    }

    .el-table .isread-row {
        font-weight: normal;
    }

    .el-pagination {
        float: right;
        margin: 0 32px 32px 0;
    }
    .el-dialog {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 36px 24px;
            display: flex;
            img {
                width: 22px;
                height: 22px;
            }
            p {
                font-size: 16px;
                color: rgba(0, 0, 0, 0.85);
                margin-left: 16px;
            }
        }
        .el-dialog__footer {
            padding: 20px 24px 17px;
        }
    }
}
</style>
