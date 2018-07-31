<template>
    <div id="setIntegral">
        <div class="header">
            <p class="title">积分规则设置</p>
            <el-button @click="toIntegral">返 回</el-button>
        </div>
        <div class="cont">
            <p>积分获取</p>
            <el-row>
                <el-col :span="6"><span>日常登陆：</span><el-switch v-model="dailyLiogin" active-color="rgba(24,204,192,1)" inactive-color="rgba(0,0,0,.25)"></el-switch></el-col>
                <el-col :span="6">每日增加：<el-input v-model="dailyAdd" placeholder=""></el-input>积分</el-col>
            </el-row>
            <el-row>
                <el-col :span="6"><span>支付返还：</span><el-switch v-model="payReturn" active-color="rgba(24,204,192,1)" inactive-color="rgba(0,0,0,.25)"></el-switch></el-col>
                <el-col :span="6">单笔支付每满：<el-input v-model="payGet" placeholder=""></el-input>元获得1积分</el-col>
            </el-row>
            <p>积分消耗</p>
            <el-row>
                <el-col :span="6"><span>积分抵用：</span><el-switch v-model="integralPay" active-color="rgba(24,204,192,1)" inactive-color="rgba(0,0,0,.25)"></el-switch></el-col>
                <el-col :span="6">每1积分可抵用<el-input v-model="getIntegral" placeholder=""></el-input>元</el-col>
                <el-col :span="6">每单支付最高抵用百分比<el-input v-model="percent" placeholder=""></el-input>%</el-col>
            </el-row>
            <el-row v-if="false">
                <el-col :span="6"><span>年底自动清零</span><el-switch v-model="reset" active-color="rgba(24,204,192,1)" inactive-color="rgba(0,0,0,.25)"></el-switch></el-col>
            </el-row>
            <div class="suerIntegral">
                <el-button type="primary" @click="setIntegralRule">保 存</el-button>
                <el-button type="" @click="toIntegral">取 消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../../fetch/api.js";
    import { mapGetters } from "vuex";
    export default {
        data: function() {
            return {
                dailyLiogin: false,
                dailyAdd: '',
                payReturn: false,
                payGet: '',
                integralPay: false,
                getIntegral: '',
                percent: '',
                reset: false,
                errMsg: ''
            }
        },
        created() {
            this.getIntegralSetting()
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            toIntegral() {
                this.$router.push({path: '/totalManageC/integral'})
            },
            //设置积分规则
            setIntegralRule() {
                if(this.dailyLiogin == false && Number(this.dailyAdd) >= 1 && Number(this.dailyAdd) <= 100 && Math.floor(Number(this.dailyAdd)) == Number(this.dailyAdd)){

                }else if(this.dailyLiogin == true && Number(this.dailyAdd) >= 1 && Number(this.dailyAdd) <= 100 && Math.floor(Number(this.dailyAdd)) == Number(this.dailyAdd)){

                }else if(this.dailyLiogin == false && this.dailyAdd == ''){

                }else{
                    this.errMsg = '每日增加积分数应为1-100之间整数';
                    this.openErr();
                    return false;
                }
                if(this.payReturn == false && Number(this.payGet) >= 10 && Number(this.payGet) <= 1000 && Math.floor(Number(this.payGet)) == Number(this.payGet)){

                }else if(this.payReturn == true && Number(this.payGet) >= 10 && Number(this.payGet) <= 1000 && Math.floor(Number(this.payGet)) == Number(this.payGet)){

                }else if(this.payReturn == false && this.payGet == '') {

                }else{
                    this.errMsg = '单笔支付满足金额应为10-1000之间整数';
                    this.openErr();
                    return false;
                }
                if(this.integralPay == false && Number(this.getIntegral) >= 0.01 && Number(this.getIntegral) <= 1){

                }else if(this.integralPay == true && Number(this.getIntegral) >= 0.01 && Number(this.getIntegral) <= 1){

                }else if(this.integralPay == false && this.getIntegral == '') {

                }else{
                    this.errMsg = '积分抵用应为0.01-1.00之间的数字';
                    this.openErr();
                    return false;
                }
                if(this.integralPay == false && Number(this.percent) >= 1 && Number(this.percent) <= 100 && Math.floor(Number(this.percent)) == Number(this.percent)) {

                }else if(this.integralPay == true && Number(this.percent) >= 1 && Number(this.percent) <= 100 && Math.floor(Number(this.percent)) == Number(this.percent)){

                }else if(this.integralPay == false && this.percent == ''){

                }else{
                    this.errMsg = '抵用百分比应为为1-100之间整数';
                    this.openErr();
                    return false;
                }
                let params = {
                    integralLand : { merchantId : this.loginInfo.sellerId, numberValue: this.dailyAdd, enable: this.dailyLiogin },
                    integralPaymentReturn: { merchantId: this.loginInfo.sellerId, enable: this.payReturn, numberValue: 1, quota: this.payGet},
                    integralCounterPrice: { merchantId : this.loginInfo.sellerId, enable: this.integralPay, quota: this.getIntegral, percentage : this.percent},
                    integralClearZero:{ enable: this.reset, merchantId: this.loginInfo.sellerId }
                };
                api.integralSetting(params).then(res => {
                    console.log(res)
                    this.open()
                });
            },
            //获取积分规则
            getIntegralSetting() {
                let params = { merchantId: this.loginInfo.sellerId };
                api.getIntegralSetting(params).then(res => {
                    console.log(res)
                    this.dailyLiogin = res.integralLand.enable;
                    this.dailyAdd = res.integralLand.numberValue;
                    this.payReturn = res.integralPaymentReturn.enable;
                    this.payGet = res.integralPaymentReturn.quota;
                    this.integralPay = res.integralCounterPrice.enable;
                    this.getIntegral = res.integralCounterPrice.quota;
                    this.percent = res.integralCounterPrice.percentage;
                    this.reset = res.integralClearZero.enable;
                })
            },
            open() {
                this.$notify({
                    title: '成功',
                    message: '积分规则设置',
                    type: 'success'
                });
            },
            openErr() {
                this.$message.error(this.errMsg);
            }
        }
    }
</script>

<style lang="scss">

    #setIntegral{
        width: 100%;
        height: 100%;
        .header{
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
        .cont{
            height: calc(100% - 140px);
            height: -webkit-calc(100% - 140px);
            height: -moz-calc(100% - 140px);
            border: 24px solid #edf2f5;
            overflow: auto;
            p{
                font-size: 16px;
                font-weight: 900;
                margin: 24px 32px 32px;
            }
            .el-row{
                margin: 0 32px 32px;
                &:nth-of-type(2), &:nth-of-type(3){
                    padding-bottom: 32px;
                    border-bottom: 1px solid rgba(232,232,232,1);;
                }
            }
        }
        .el-input{
            width: 100px;
        }
        .el-row{
            margin-top: 20px;
            line-height: 32px;
            span{
                display: inline-block;
                width: 70px;
            }
        }
        .suerIntegral{
            .el-button{
                margin-left: 32px;
                &:nth-of-type(2){
                    margin-left: 8px;
                }
            }
        }
    }
</style>
