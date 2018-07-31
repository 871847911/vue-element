<template>
    <div id="coupon">
        <p class="title">优惠券管理</p>
        <div class="cont">
            <div class="setup">
                <el-button type="primary" @click="toSetUpCoupon">创建优惠券</el-button>
            </div>
            <el-table :data="tableData" min-height="550">
                <el-table-column prop="orderId" label="优惠券"  width="400">
                    <template slot-scope="scope">
                        <div class="coupon-status" :class="scope.row.isStop==false?'isUse':'unUse'">
                            <div class="coupon-s">
                                <div class="type">
                                    <span v-show="scope.row.type=='voucher'?true:false">￥</span><span>{{scope.row.quota}}</span><span v-show="scope.row.type=='discount'?true:false">折</span>
                                </div>
                                <div class="status" :class="scope.row.isStop==false?'isUse-d':'unUse-d'" v-if="!scope.row.isStop && !scope.row.isInvalid">投放中</div>
                                <div class="status" :class="scope.row.isStop==false?'isUse-d':'unUse-d'" v-if="scope.row.isStop && !scope.row.isOverdue && !scope.row.isInvalid">未投放</div>
                                <div class="status" :class="scope.row.isStop==false?'isUse-d':'unUse-d'" v-if="scope.row.isOverdue">已过期</div>
                                <div class="status" :class="scope.row.isStop==false?'isUse-d':'unUse-d'" v-if="scope.row.isInvalid">强制失效</div>
                            </div>

                            <p>满{{scope.row.priceRules}}元可用</p>
                            <p>有效期{{scope.row.effectiveDateStart}}-{{scope.row.effectiveDateStop}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="投放数量" width="120"></el-table-column>
                <el-table-column prop="receiveCount" label="领取数量" width="120"></el-table-column>
                <el-table-column prop="useCount" label="使用数量" width="120"></el-table-column>
                <el-table-column prop="numberLimit" label="领取限制" width="120"></el-table-column>
                <el-table-column prop="zip" label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="sss(scope.row), stopCoupon(scope.row)" v-if="scope.row.isStop && !scope.row.isInvalid && !scope.row.isOverdue" type="text" size="small">开启投放</el-button>
                        <el-button @click.native.prevent="sss(scope.row), stopCoupon(scope.row)" v-if="!scope.row.isStop && !scope.row.isOverdue" type="text" size="small">暂停投放</el-button>
                        <el-button @click.native.prevent="sss(scope.row), deleteCoupon(scope.row)" v-if="!scope.row.isInvalid && !scope.row.isOverdue" type="text" size="small">删除投放</el-button>
                        <el-button @click.native.prevent="sss(scope.row), pastCoupon(scope.row)" v-if="!scope.row.isInvalid && !scope.row.isOverdue" type="text" size="small">强制失效</el-button>
                        <el-button @click.native.prevent="sss(scope.row), deleteA(scope.row)" v-if="scope.row.isStop" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 30]" :page-size="5" layout="prev, pager, next, sizes, jumper" :total="this.total"></el-pagination>
        </div>
        <el-dialog title="" :visible.sync="deleteC" width="433px">
            <div class="renew-popout">
                <div class="dialog-title">
                    <img src="../../assets/images/Icon_Question1@2x.png" alt="">
                    <p>确定要删除投放么</p>
                </div>
                <p class="dialog-cont">删除投放后已领取的优惠券不受影响</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteC = false">取 消</el-button>
                <el-button type="primary" @click="sureDelete">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="pastC" width="433px">
            <div class="renew-popout">
                <div class="dialog-title">
                    <img src="../../assets/images/Icon_Question@2x.png" alt="">
                    <p>确定要强制失效么</p>
                </div>
                <p class="dialog-cont">失效后将不可撤回，已领取的红包也将不可使用</p>
            </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="pastC = false">取 消</el-button>
                <el-button type="primary" @click="surePast">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from "../../fetch/api.js"
    export default {
        data: function() {
            return {
                tableData: [],
                deleteC: false,
                pastC: false,
                couponId: '',
                type: '',
                row: {},
                total: 10,
                currentPage: 1,
                pageSize: 5,
            }
        },
        created() {
            this.getCouponListByMerchantId()
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
        	sss(row) {
        		this.couponId = row.id;
        		this.type = row.type;
                this.row = row;
        	},
            //获取优惠券列表
            getCouponListByMerchantId() {
                let params = { pageSize: this.pageSize, pageNo: this.currentPage, merchantId: this.loginInfo.sellerId };
                api.getCouponListByMerchantId(params).then(res => {
                    console.log(res.list)
                    this.total = res.total
                    this.tableData = res.list
                    for(var i = 0;i < this.tableData.length; i++){
                        if(this.tableData[i].effectiveDateStart){
                            this.tableData[i].effectiveDateStart = new Date(this.tableData[i].effectiveDateStart).toLocaleDateString().replace(/\//g, ".")
                            this.tableData[i].effectiveDateStop = new Date(this.tableData[i].effectiveDateStop).toLocaleDateString().replace(/\//g, ".")
                        }
                        if(this.tableData[i].isOverdue == true){
                            this.tableData[i].isStop = true
                        }
                    }
                })
            },
            //暂停投放优惠券
            setCouponStopByCouponId() {
                let params = {couponId: this.couponId, type: this.type }
                api.setCouponStopByCouponId(params).then(res => {
                    console.log(res)
                    this.row.isStop = !this.row.isStop
                })
            },
            // 强制失效优惠券
            setCouponInvalidByCouponId() {
                let params = {couponId: this.couponId, type: this.type}
                api.setCouponInvalidByCouponId(params).then(res => {
                    this.row.isStop = !this.row.isStop
                    this.row.isInvalid = !this.row.isInvalid
                })
            },
            //删除优惠券
            setCouponDeleteByCouponId() {
                let params = {couponId: this.couponId, type: this.type }
                api.setCouponDeleteByCouponId(params).then(res => {
                    console.log(res)
                    for(var i = 0;i < this.tableData.length; i++){
                        if (this.tableData[i].id == this.row.id) {
                            this.tableData.splice(i, 1)
                        }
                    }
                })
            },
            currentChange() {
                this.total = 1;
            },
            toSetUpCoupon() {
                this.$router.push({path: '/totalManageC/setUpCoupon'})
            },
            // 删除投放
            deleteCoupon() {
                this.deleteC = true
            },
            // 强制失效
            pastCoupon() {
                this.pastC = true;
            },
            // 暂停/开启投放
            stopCoupon(row) {
                console.log('暂停投放')
                this.setCouponStopByCouponId()
            },
            // 删除
            deleteA(row) {
                console.log('删除')
                this.setCouponDeleteByCouponId()
            },
            // 确认删除
            sureDelete() {
                this.deleteC = false
                this.setCouponDeleteByCouponId()
            },
            // 确认失效
            surePast() {
                this.pastC = false;
                this.setCouponInvalidByCouponId()
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getCouponListByMerchantId()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getCouponListByMerchantId()
            },
        }
    }
</script>

<style lang="scss">
    #coupon{
        width: 100%;
        height: 100%;
        .el-dialog__header{
            padding: 0;
            i{
                display: none;
            }
        }
        .el-dialog__body{
            padding: 32px;
            .dialog-title{
                display: flex;
                img{
                    width: 22px;
                    height: 22px;
                }
                p{
                    font-size: 16px;
                    color: rgba(0,0,0,0.85);
                    line-height: 22px;
                    text-indent: 16px;
                    font-weight: 900;
                }
            }
            .dialog-cont{
                text-indent: 38px;
                padding-top: 16px;
            }
        }
        .title {
            height: 92px;
            line-height: 92px;
            font-size: 20px;
            color: rgba(0,0,0,.85);
            text-indent: 32px;
            font-weight: 900;
        }
        .cont{
            height: calc(100% - 140px);
            height: -webkit-calc(100% - 140px);
            height: -moz-calc(100% - 140px);
            border: 24px solid #edf2f5;
            overflow: auto;
            position: relative;
            .setup {
                margin: 24px 32px 24px 0;
                overflow: hidden;
                .el-button{
                    float: right;
                }
            }
        }
        .el-pagination{
            padding: 0;
            float: right;
            margin: 0 32px 32px 0;
        }
        .coupon-status{
            width: 242px;
            height: 86px;
            overflow: hidden;
            .coupon-s{
                width: 100%;
                height: 32px;
                margin-top: 10px;
                display: flex;
                .type{
                    flex: 1;
                    margin-left: 10px;
                    span{
                        &:nth-of-type(1){
                            font-size: 13px;
                        }
                        &:nth-of-type(2){
                            font-size: 28px;
                        }
                        &:nth-of-type(3){
                            font-size: 13px;
                            margin-left: 2px;
                        }
                    }
                }
                .status{
                    width: 74px;
                    border-radius: 4px;
                    font-size: 13px;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 32px;
                }
            }
            p{
                line-height: 16px;
                font-size: 11px;
                margin-left: 10px;
                &:nth-of-type(1){
                    margin-top: 4px;
                }
            }
        }
        .isUse-d{
            background: #EC4B26;
            color: #fff;
        }
        .unUse-d{
            background: #FFFFFF;
            color: rgba(0,0,0,0.65);
        }
        .isUse{
            background: #FEF2E7;
            color: #EC4B26;
        }
        .unUse{
            background: #EBEBEB;
            color: rgba(0,0,0,0.65);
        }
    }
</style>
