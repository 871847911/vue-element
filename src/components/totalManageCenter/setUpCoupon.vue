<template>
    <div id="set-coupon">
        <div class="coupou_title">
            <p class="title">创建优惠券</p>
            <el-button @click="toCoupon">返 回</el-button>
        </div>
        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="优惠券类型：" prop="">
                    <el-radio-group v-model="radio"  @change="changeRadio">
                        <el-radio-button label="代金券" ></el-radio-button>
                        <el-radio-button label="折扣券"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="radioType" prop="amount">
                    <el-select v-model="ruleForm.amount" placeholder="全部">
                        <el-option v-for="(item, index) in options" :key="item.index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="满减规定：" prop="quantity">
                    满<el-input v-model="ruleForm.quantity" placeholder="￥"></el-input>元使用
                </el-form-item>
                <el-form-item label="投放数量：" prop="putIn">
                    <el-input v-model="ruleForm.putIn" placeholder=""></el-input>张 (最大可投放100张)
                </el-form-item>
                <el-form-item label="使用有效期：" prop="date">
                    <el-date-picker
                        v-model="ruleForm.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="单用户领取限制：" prop="">
                    <el-radio v-model="radiosRule" label="1">限制</el-radio>
                    <el-radio v-model="radiosRule" :label="0">不限</el-radio>
                    <p v-if="radiosRule == 1">每个用户每次领取一张，使用后无法继续领取</p>
                    <p v-if="radiosRule == 0">每个用户每次领取一张，使用后可以继续领取</p>
                </el-form-item>
                <el-form-item label="预览效果：" prop="">
                    <img v-if="radio=='代金券'" src="../../assets/images/dai@2x.png" alt="">
                    <img v-if="radio=='折扣券'" src="../../assets/images/zhe@2x.png" alt="">
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                    <el-button @click="toCoupon">取 消</el-button>
                    <el-button @click="resetForm('ruleForm')">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from "../../fetch/api.js"
    export default {
        name: 'newTemp',
        data: function() {
            var checkPrice = (rule, value, callback) => {
                if (
                    value != '' &&
                    Number(value) >= 0 &&
                    Number(value) <= 500 &&
                    Math.floor(Number(value)) == Number(value)
                ) {
                    return callback();
                } else {
                    callback("请输入0-500之间的整数");
                }
            };
            var checkPutIn = (rule, value, callback) => {
                if (
                    Number(value) >= 1 &&
                    Number(value) <= 100 &&
                    Math.floor(Number(value)) == Number(value)
                ) {
                    return callback();
                } else {
                    callback("请输入1-100之间的整数");
                }
            };
            return {
                radio: '代金券',
                radioType: '代金券金额：',
                date: '',
                resource: [],
                radiosRule: '1',
                options: '',
                options1: [
                    {
                        value: '1元',
                        label: '1元'
                    },
                    {
                        value: '5元',
                        label: '5元'
                    },
                    {
                        value: '10元',
                        label: '10元'
                    },
                    {
                        value: '20元',
                        label: '20元'
                    },
                    {
                        value: '50元',
                        label: '50元'
                    },
                    {
                        value: '100元',
                        label: '100元'
                    }
                ],
                options2: [
                    {
                        value: '9.5折',
                        label: '9.5折'
                    },
                    {
                        value: '9折',
                        label: '9折'
                    },
                    {
                        value: '8.5折',
                        label: '8.5折'
                    },
                    {
                        value: '8折',
                        label: '8折'
                    },
                    {
                        value: '7.5折',
                        label: '7.5折'
                    },
                    {
                        value: '7折',
                        label: '7折'
                    },
                    {
                        value: '6.5折',
                        label: '6.5折'
                    },
                    {
                        value: '6折',
                        label: '6折'
                    },
                    {
                        value: '5.5折',
                        label: '5.5折'
                    },
                    {
                        value: '5折',
                        label: '5折'
                    }
                ],
                ruleForm: {
                    amount: '',
                    quantity: '',
                    putIn: '',
                    resource: '1',
                    date: '',
                    resource: ''
                },
                rules: {
                    amount: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    quantity: [
                        { validator: checkPrice, required: true, trigger: "blur" }
                    ],
                    putIn: [
                        { validator: checkPutIn, required: true, trigger: "blur" }
                    ],
                    resource: [
                        { required: true, message: '请选择领取规则', trigger: 'change' }
                    ],
                    date: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ]
                }
            }
        },
        mounted() {
            this.options = this.options1;
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            //创建折扣券
            addDiscount() {
                let quotaNum = this.ruleForm.amount.substring(0, this.ruleForm.amount.length-1)
                let params = { merchantId: this.loginInfo.sellerId, effectiveDateStart: this.ruleForm.date[0], effectiveDateStop: this.ruleForm.date[1], quota: Number(quotaNum), priceRules : this.ruleForm.quantity, number: this.ruleForm.putIn, numberLimit: this.radiosRule };
                api.addDiscount(params).then(res => {
                    console.log(res)
                    this.open()
                })
            },

            //创建代金券
            addVoucher() {
                let quotaNum = this.ruleForm.amount.substring(0, this.ruleForm.amount.length-1)
                let params = { merchantId: this.loginInfo.sellerId, effectiveDateStart: this.ruleForm.date[0], effectiveDateStop: this.ruleForm.date[1], quota: Number(quotaNum), priceRules : this.ruleForm.quantity, number: this.ruleForm.putIn, numberLimit: this.radiosRule };
                api.addVoucher(params).then(res => {
                    console.log(res)
                    this.open()
                })
            },
            //创建成功提示
            open() {
                this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success'
                });
            },
            changeRadio() {
                if(this.radio == '折扣券'){
                    this.options = this.options2;
                    this.radioType = '折扣券折扣：'
                }else{
                    this.options = this.options1;
                    this.radioType = '代金券金额：'
                }
                this.ruleForm.amount = ''
            },
            toCoupon() {
                this.$router.push({path: '/totalManageC/coupon'})
            },
            // 提交表单
            submitForm(formName) {
                console.log(this.ruleForm.date)

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.radio == '代金券'){
                            this.addVoucher()
                        }else{
                            this.addDiscount()
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            toCoupon() {
                this.$router.push({path: '/totalManageC/coupon'})
            }
        },
        watch: {
        }
    }
</script>

<style lang="scss">

    #set-coupon{
        width: 100%;
        height: 100%;
        .coupou_title{
            display: flex;
            align-items: center;
            .title {
                flex: 1;
                height: 92px;
                line-height: 92px;
                font-size: 20px;
                color: rgba(0,0,0,.85);
                text-indent: 32px;
                font-weight: 900;
            }
            .el-button{
                margin-right: 24px;
                height: 32px;
            }
        }
        .container{
            height: calc(100% - 140px);
            height: -webkit-calc(100% - 140px);
            height: -moz-calc(100% - 140px);
            border: 24px solid #edf2f5;
            .el-form{
                width: 70%;
                margin: 32px auto 0;
                .el-form-item{
                    .el-form-item__label:before{
                        content: "";
                    }
                    margin-bottom: 32px;
                    &:nth-of-type(3){
                        .el-input{
                            margin: 0 4px;
                        }
                    }
                    &:nth-of-type(4){
                        .el-input{
                            margin-right: 4px;
                        }
                    }
                    &:nth-of-type(6){
                        p{
                            color: rgba(0,0,0,0.45);
                            line-height: 22px;
                        }
                    }
                    &:nth-of-type(7){
                        margin-bottom: 17px;
                    }
                    .el-form-item__label{
                        color: rgba(0,0,0,0.85);
                    }
                }
                .el-input {
                    width: 66px;
                }
                .el-select{
                    width: 468px;
                    .el-input{
                        width: 100%;
                    }
                }
                img{
                    width: 343px;
                    height: 86px;
                }
                .el-date-editor{
                    width: 468px;
                }
            }
        }
        .el-radio{
            .el-radio__inner{
                &:hover{
                    border-color: #18CCC0;
                }
            }
        }
        .is-checked{
            .el-radio__inner{
                background: #18CCC0;
                border-color: #18CCC0;
            }
            .el-radio__label{
                color: #18CCC0;
            }
        }
    }
</style>
