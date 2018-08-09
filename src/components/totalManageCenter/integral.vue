<template>
    <div id="integral">
        <p class="title">积分管理</p>
        <div class="choose">
            <div class="name-search">
                <p>微信昵称：</p>
                <el-input v-model="userName" placeholder="请输入微信昵称"></el-input>
                <p>时间范围：</p>
                <el-date-picker
                    v-model="timeValue"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="起始时间"
                    end-placeholder="结束时间">
                </el-date-picker>
                <el-button type="primary" @click="searchIntegral">搜索</el-button>
            </div>
            <div class="open-integral">
                <p>积分功能开关：</p>
                <el-switch
                    v-model="integral"
                    active-color="rgba(24,204,192,1)"
                    inactive-color="rgba(0,0,0,.25)">
                </el-switch>
                <el-button class="setIntegral" type="primary" @click="toSetIntegral">积分规则设置</el-button>
            </div>
        </div>
        <div class="cont">
            <el-table :data="tableData" min-height="550">
                <el-table-column prop="nickName" label="微信昵称"></el-table-column>
                <el-table-column prop="creatTime" :formatter="formatTime" label="最新变更时间"></el-table-column>
                <el-table-column prop="explain" label="事件"></el-table-column>
                <el-table-column prop="numberValue" :formatter="formatValue" label="变更数量"></el-table-column>
                <el-table-column prop="surplusNumber" label="当前剩余积分"></el-table-column>
                <el-table-column prop="zip" label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="toIntegralDetail(scope.row)" type="text" size="small">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="prev, pager, next, sizes, jumper" :total="this.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import api from "../../fetch/api.js"
    import { mapGetters } from "vuex";
    export default {
        data: function() {
            return {
                userName: '',
                integral: true,
                timeValue: [new Date() - 3600 * 1000 * 24 * 30,  new Date()],
                tableData: [],
                total: 10,
                pageSize: 10,
                currentPage: 1,
                startTime: '',
                endTime: '',
            }
        },
        created() {
            this.startTime = this.timeValue[0]
            this.endTime = new Date(this.timeValue[1]).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.timeValue[1]).toTimeString().substr(0, 8)
            // this.endTime = this.timeValue[1]
            this.integralList();
            this.getSellerInfo();
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            formatTime(val) {
                return new Date(val.creatTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(val.creatTime).toTimeString().substr(0, 8)
            },
            formatValue(val) {
                return val.event + val.numberValue
            },
            searchIntegral() {
                if( this.timeValue != null){
                    this.startTime = this.timeValue[0]
                    this.endTime = new Date(this.timeValue[1]).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.timeValue[1]).toTimeString().substr(0, 8)
                    // this.endTime = this.timeValue[1]
                }else{
                    this.startTime = null
                    this.endTime = null
                }
                this.integralList()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.integralList()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.integralList()
            },
            integralList() {
                let params = { merchantId: this.loginInfo.sellerId, pageNo: this.currentPage, pageSize: this.pageSize, nickName: this.userName, startData: this.startTime, stopData: this.endTime };
                api.integralList(params).then(res => {
                    console.log(res.list)
                    this.tableData = res.list
                    this.total = res.total;
                })
            },
            toIntegralDetail(scope) {
                console.log(scope.id)
                this.$router.push({path: '/totalManageC/integralDetail', query: { id: scope.userId}})
            },
            toSetIntegral() {
                console.log('toSetIntegral')
                this.$router.push({path: '/totalManageC/setIntegral'})
            },
            updateSeller() {
                let params = { id: this.loginInfo.sellerId, isenableIntegral: this.integral == true ? 1 : 0 };
                api.updateSeller(params).then(res => {
                    console.log(res)
                })
            },
            getSellerInfo() {
                let params = { sellerId: this.loginInfo.sellerId };
                api.querySellerById(params).then(res => {
                    this.integral = res.isenableIntegral == 1 ? true : false
                });
            },
        },
        watch:{
            'integral': 'updateSeller'
        }
    }
</script>

<style lang="scss">

    #integral{
        width: calc(100% - 48px);
        width: -webkit-calc(100% - 48px);
        width: -moz-calc(100% - 48px);
        height: calc(100% - 48px);
        height: -webkit-calc(100% - 48px);
        height: -moz-calc(100% - 48px);
        border: 24px solid #edf2f5;
        overflow: auto;
        .title{
            height: 66px;
            line-height: 66px;
            font-size: 18px;
            color: rgba(0,0,0,.85);
            text-indent: 32px;
            font-weight: 900;
            flex: 1;
        }
        .choose {
            display: flex;
            padding: 0 32px 24px;
            .el-input{
                width: 136px;
            }
            .el-date-editor{
                width: 372px;                }
            .el-button{
                margin-left: 10px;
            }
            .name-search {
                flex: 1;
                display: flex;
                align-items: center;
                p {
                    width: 70px;
                    &:nth-of-type(2){
                        margin-left: 20px;
                    }
                }
            }
            .open-integral {
                margin-left: 20px;
                display: flex;
                align-items: center;
                p {
                    width: 98px;
                }
            }
            .setIntegral{
                right: 30px;
            }
        }
        .cont{
            /* height: calc(100% - 170px);
             height: -webkit-calc(100% - 170px);
             height: -moz-calc(100% - 170px);
             border: 24px solid #edf2f5;
             border-top: 0;
             overflow: auto;*/
            .el-table{
                margin: 16px 32px 16px;
                /*width: calc(100% - 64px);
                width: -webkit-calc(100% - 64px);
                width: -moz-calc(100% - 64px);*/
                .has-gutter{
                    color: rgba(0,0,0,.85);
                }
                th{
                    background: rgba(250,250,250,1);
                }
                td{

                }
            }
        }
        .el-pagination{
            padding: 0;
            float: right;
            margin: 0 32px 32px 0;
        }
    }
</style>
