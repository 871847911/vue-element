<template>
    <div id="apply">
        <p class="title">支付管理</p>
        <div class="choose-store">
            <div class="booking">
                <p>门店选择：</p>
                <el-select v-model="storeChoose" placeholder="全部">
                    <el-option
                        v-for="(item, index) in storeList"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-time">
                <p>时间范围：</p>
                <el-date-picker
                    v-model="timeValue"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="起始时间"
                    end-placeholder="结束时间">
                </el-date-picker>
                <el-button type="primary" @click="searchOrder">搜索</el-button>
            </div>
        </div>
        <div class="cont">
            <el-table :data="payInfo" min-height="550">
                <el-table-column prop="serialNum" label="支付单号" width="120"></el-table-column>
                <el-table-column prop="storeName" label="收款门店" width="130"></el-table-column>
                <el-table-column prop="payTime" :formatter="formatTime" label="支付时间" width="200"></el-table-column>
                <el-table-column prop="openid" label="支付用户" width="300"></el-table-column>
                <el-table-column prop="costPrice" label="实际付款金额"></el-table-column>
                <el-table-column prop="totalPrice" label="原金额"></el-table-column>
                <el-table-column prop="redPacketDecrease" label="优惠券减免"></el-table-column>
                <el-table-column prop="scoreDecrease" label="积分减免"></el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="prev, pager, next, sizes, jumper" :total="this.total"></el-pagination>
        </div>
    </div>
</template>

<script>
    import api from "../../fetch/api.js"
    import { mapGetters } from "vuex";
    export default {
        name: 'apply',
        data: function() {
            return {
                storeChoose: '',
                timeValue: [new Date() - 3600 * 1000 * 24 * 30,  new Date()],
                payInfo: [],
                total: 10,
                pageSize: 10,
                startTime: '',
                endTime: '',
                currentPage: 1
            }
        },
        created() {
            this.startTime = this.timeValue[0];
            this.endTime = this.timeValue[1];
            this.queryOrderPaymentPage()
        },
        computed: {
            ...mapGetters({
                storeList: "getStoreList",
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            formatTime(val) {
                return new Date(val.payTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(val.payTime).toTimeString().substr(0, 8)
            },
            searchOrder() {
                if( this.timeValue != null){
                    this.startTime = this.timeValue[0]
                    this.endTime = this.timeValue[1]
                }else{
                    this.startTime = ''
                    this.endTime = ''
                }
                this.queryOrderPaymentPage()
            },
            queryOrderPaymentPage() {
                let params = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    orderPayment: {
                        storeId: this.storeChoose,
                        sellerId: this.loginInfo.sellerId
                    },
                    page: {
                        pageNo: this.currentPage,
                        pageSize: this.pageSize,
                    }
                };
                api.queryOrderPaymentPage(params).then(res => {
                    console.log(res.rows);
                    this.payInfo = res.rows;
                    this.total = res.total;
                    /*for(var i = 0;i < this.payInfo.length;i ++){
                        if(this.payInfo[i].payTime) {
                            this.payInfo[i].payTime = new Date(this.payInfo[i].payTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.payInfo[i].payTime).toTimeString().substr(0, 8)
                        }
                    }*/
                });
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.queryOrderPaymentPage()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.queryOrderPaymentPage()
            }
        }
    }
</script>

<style lang="scss">
    #apply{
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
        .choose-store {
            display: flex;
            padding: 0 32px 24px;
            .booking {
                display: flex;
                align-items: center;
                p {
                    width: 70px;
                }
                .el-select{
                    width: 272px;
                }
            }
            .search-time {
                margin-left: 20px;
                display: flex;
                align-items: center;
                p {
                    width: 70px;
                }
                .el-date-editor{
                    width: 372px;
                }
                .el-button{
                    margin-left: 10px;
                }
            }
        }
        .cont{
           /* height: calc(100% - 170px);
            height: -webkit-calc(100% - 170px);
            height: -moz-calc(100% - 170px);
            border: 24px solid #edf2f5;
            border-top: 0;
            overflow: auto;*/
            .el-pagination{
                padding: 0;
                float: right;
                margin: 0 32px 32px 0;
            }
        }
    }
</style>
