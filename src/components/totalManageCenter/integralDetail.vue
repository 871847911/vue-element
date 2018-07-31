<template>
    <div id="integral-detail">
        <div class="integral">
            <p class="title">积分详情</p>
            <el-button @click="toIntegral">返 回</el-button>
        </div>
        <div class="userIntegral">
            <div class="userInfo">
                <p class="userName">微信昵称：<span>{{tableData[0].nickName}}</span></p>
                <p class="currentI">当前积分：<span>{{tableData[0].surplusNumber}}</span></p>
            </div>
            <el-table :data="tableData" min-height="550">
                <el-table-column prop="creatTime" label="时间"></el-table-column>
                <el-table-column prop="explain" label="事件"></el-table-column>
                <el-table-column prop="numberValue" label="变更"></el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="prev, pager, next, sizes, jumper" :total="this.total"></el-pagination>
        </div>
    </div>
</template>

<script>
    import api from "../../fetch/api.js"
    import { mapGetters } from "vuex";
    export default {
        data: function() {
            return {
                tableData: [],
                total: 10,
                pageSize: 10,
                currentPage: 1
            }
        },
        created() {
            console.log(this.$route.query.id);
            this.userIntegralList()
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            userIntegralList() {
                let params = { merchantId: this.loginInfo.sellerId, pageSize: this.pageSize, pageNo: this.currentPage, userId: this.$route.query.id };
                api.integralList(params).then(res => {
                    console.log(res.list)
                    this.tableData = res.list
                    for(var i = 0;i < this.tableData.length;i ++){
                        this.tableData[i].creatTime = new Date(this.tableData[i].creatTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.tableData[i].creatTime).toTimeString().substr(0, 8)
                        this.tableData[i].numberValue = this.tableData[i].event + this.tableData[i].numberValue
                    }
                    this.total = res.total
                })
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.userIntegralList()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.userIntegralList()
            },
            toIntegral() {
                this.$router.push({path: '/totalManageC/integral'})
            }
        }
    }
</script>

<style lang="scss">

    #integral-detail{
        width: 100%;
        height: 100%;
        .integral{
            display: flex;
            align-items: center;
            .title{
                height: 92px;
                line-height: 92px;
                font-size: 20px;
                color: rgba(0,0,0,.85);
                text-indent: 32px;
                font-weight: 900;
                flex: 1;
            }
            .el-button{
                margin-right: 24px;
            }
        }
        .userIntegral{
            height: calc(100% - 140px);
            height: -webkit-calc(100% - 140px);
            height: -moz-calc(100% - 140px);
            border: 24px solid #edf2f5;
            overflow: auto;
            .userInfo{
                display: flex;
                margin: 29px 32px;
                align-items: center;
                .userName{
                    width: 30%;
                    p{
                        line-height: 22px;
                        height: 22px;
                    }
                    span{
                        color: #18CCC0;
                        font-weight: 900;
                    }
                }
                .currentI{
                    width: 30%;
                    p{
                        line-height: 22px;
                        height: 22px;
                    }
                    span{
                        color: #18CCC0;
                        font-weight: 900;
                    }
                }
            }
            .el-pagination{
                padding: 0;
                float: right;
                margin: 0 32px 32px 0;
            }
        }
    }
</style>
