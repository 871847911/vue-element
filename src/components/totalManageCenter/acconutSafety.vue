<template>
    <div id="account_safe" v-loading="loading" element-loading-text="拼命加载中">
        <p class="title" @click="bindPhone">账号安全</p>
        <div class="cont">
            <div class="bind_message">
                <p>绑定手机</p>
                <p>{{tipMessage}}</p>
                <el-button type="primary" v-if="userTel=='' && showBindPhone == true" @click="showBindPhone = false">绑定手机号</el-button>
                <el-button type="primary" v-if="userTel != '' && showChangePhone == false && showBindPhone == true" @click="changePhone">修改手机号</el-button>
                <el-form v-if="!showBindPhone" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item label="手机号码：" prop="phone">
                        <el-input v-model="ruleForm.phone" maxlength="11" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码：" prop="validate">
                        <el-input v-model="ruleForm.validate" maxlength="6" placeholder="请输入短信验证码"></el-input>
                        <el-button type="primary" v-if="flag" @click="bindPhone('ruleForm')">获取验证码</el-button>
                        <el-button type="info" disabled="" v-if="!flag">剩余{{second}}秒</el-button>
                    </el-form-item>
                    <p>{{errMsg}}</p>
                    <el-form-item label="" prop="">
                        <el-button @click="showBindPhone = true">取消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    </el-form-item>
                </el-form>
                <el-form v-if="showChangePhone" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item label="手机号码：" prop="">
                        <el-input disabled="" v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码：" prop="">
                        <el-input v-model="ruleForm.validate" maxlength="6" placeholder="请输入短信验证码"></el-input>
                        <el-button type="primary" v-if="flag"@click="bindPhone('ruleForm')">获取验证码</el-button>
                        <el-button type="info" disabled="" v-if="!flag">剩余{{second}}秒</el-button>
                    </el-form-item>
                    <p>{{errMsg}}</p>
                    <el-form-item label="" prop="">
                        <el-button @click="showChangePhone = false">取消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="change_password">
                <p>密码管理</p>
                <el-form :model="rulesForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item label="原密码：" prop="">
                        <el-input v-model="rulesForm.oldPassw" type="password" placeholder="请输入您的登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码：" prop="">
                        <el-input v-model="rulesForm.newPassw" type="password" placeholder="请输入您新的登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="重复新密码：" prop="">
                        <el-input v-model="rulesForm.reNewPassw" type="password" placeholder="请重复您新的登录密码"></el-input>
                    </el-form-item>
                    <p>{{psErr}}</p>
                    <el-form-item label="" prop="">
                        <el-button @click="cancelResetPassw">取消</el-button>
                        <el-button type="primary" @click="checkPassword">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from "../../fetch/api.js";
    export default {
        name: "acconutSafety",
        data() {
            var checkPhone = (rule, value, callback) => {
                if (new RegExp(/^1[3|4|5|6|7|8|9][0-9]{9}$/).test(value)) {
                    return callback();
                } else {
                    callback("请输入正确的手机号码");
                }
            };
            var checkValidator = (rule, value, callback) => {
                if(this.validator != ''){
                    if(this.ruleForm.validate != this.validator){
                        callback("验证码错误，请输入正确的验证码");
                    }else{
                        return callback();
                    }
                }else{
                    callback("请获取验证码");
                }
            };
            return {
                errMsg: '',
                psErr: '',
                tipMessage: '为了确保您的账号安全，请绑定手机号',
                userTel: '',
                userPassw: '',
                flag: true,
                loading: true,
                second: '',
                showBindPhone: true,
                showChangePhone: false,
                validator: '',
                ruleForm: {
                    phone: '',
                    validate: '',
                },
                rulesForm: {
                    oldPassw: '',
                    newPassw: '',
                    reNewPassw: ''
                },
                rules:{},
            }
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        created() {
            this.getUserPhone();
        },
        mounted() {
            this.judgeCode();
        },
        methods: {
            // 获取验证码
            bindPhone(formName) {
                var reg = 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/;
                if(!reg.test(this.ruleForm.phone)) {
                    this.errMsg = '请输入正确的手机号'
                }else{
                    this.getCode()
                    let params = { content: "微动", merchantId: 0, phones: [this.ruleForm.phone] };
                    api.sendAccountMessage(params).then(res => {
                        console.log(res)
                    });
                }
            },
            // 点击修改手机号事件
            changePhone() {
                this.showChangePhone = true;
                this.ruleForm.phone = this.userTel;
            },
            // 绑定手机号验证
            submitForm(formName) {
                this.errMsg = ''
                var reg = 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/;
                if(!reg.test(this.ruleForm.phone)) {
                    this.errMsg = '请输入正确的手机号'
                }else if(this.ruleForm.validate.length != 6){
                    this.errMsg = '请输入正确的验证码'
                }else{
                    this.bind()
                }
            },
            // 校验验证码
            bind() {
                let params = { code: this.ruleForm.validate, phone: this.ruleForm.phone };
                api.checkAccountMessage(params).then(res => {
                    if(res.message == false) {
                        this.errMsg = '请输入正确的验证码'
                    }else if(res.message == true) {
                        this.errMsg = '';
                        this.bindPhoneInUser();
                    }else{
                        this.errMsg = '验证码已过期'
                    }
                });
            },
            //绑定手机号
            bindPhoneInUser() {
                let params = { id: this.loginInfo.id, mobile: this.ruleForm.phone };
                api.updateAccount(params).then(res => {
                    console.log(res, '绑定成功')
                    this.userTel = this.ruleForm.phone
                    if(this.showChangePhone == true) {
                        this.showChangePhone = false;
                        this.showBindPhone = false;
                        this.ruleForm.phone = '';
                        this.ruleForm.validate = '';
                        this.flag = true;
                        sessionStorage.removeItem('second')
                        this.open('手机号校验成功');
                    }else{
                        this.showBindPhone = true;
                        this.tipMessage = '已绑定手机号为：' + this.ruleForm.phone
                        this.ruleForm.phone = '';
                        this.ruleForm.validate = '';
                        this.open('手机号绑定成功');
                    }
                });
            },
            // 获取用户已绑定手机号
            getUserPhone() {
                let params = { id: this.loginInfo.id };
                api.queryAccountById(params).then(res => {
                    this.loading = false
                    // console.log(res)
                    this.userTel = res.mobile;
                    if(res.mobile != ''){
                        this.tipMessage = '已绑定手机号为：' + res.mobile
                    }
                });
            },
            //校验密码
            checkPassword() {
                if(this.rulesForm.oldPassw.length < 6) {
                    this.psErr = '请输入6-12位原密码'
                }else if(this.rulesForm.newPassw.length < 6 || this.rulesForm.newPassw.length > 12 || this.rulesForm.reNewPassw.length < 6 || this.rulesForm.reNewPassw.length > 12) {
                    this.psErr = '新密码长度应为6-12位'
                }else if(this.rulesForm.newPassw != this.rulesForm.reNewPassw) {
                    this.psErr = '请输入相同的新密码'
                }else{
                    let params = { password: this.rulesForm.oldPassw, id: this.loginInfo.id };
                    api.checkPassword(params).then(res => {
                        if(res.message == true){
                            this.changePassword()
                        }else{
                            this.psErr = '原密码错误'
                        }
                    });
                }

            },
            //修改密码
            changePassword() {
                let params = { id: this.loginInfo.id, password: this.rulesForm.newPassw };
                api.updateAccount(params).then(res => {
                    this.open('密码修改成功');
                    this.rulesForm.oldPassw = '';
                    this.rulesForm.newPassw = '';
                    this.rulesForm.reNewPassw = '';
                    this.psErr = ''
                });
            },
            /*resetPassw() {
                if(this.rulesForm.oldPassw != this.userPassw){
                    this.psErr = '原密码错误'
                }else if(this.rulesForm.newPassw.length < 6 || this.rulesForm.newPassw.length > 12 || this.rulesForm.reNewPassw.length < 6 || this.rulesForm.reNewPassw.length > 12) {
                    this.psErr = '新密码长度应为6-12位'
                }else{
                    this.psErr = ''
                    let params = { id: this.loginInfo.id, password: this.rulesForm.newPassw };
                    api.updateAccount(params).then(res => {
                        this.getUserPhone();
                        this.open('密码修改成功');
                        this.rulesForm.oldPassw = '';
                        this.rulesForm.newPassw = '';
                        this.rulesForm.reNewPassw = '';
                    });
                }
            },*/
            cancelResetPassw() {
                this.psErr = ''
                this.rulesForm.oldPassw = '';
                this.rulesForm.newPassw = '';
                this.rulesForm.reNewPassw = '';
            },
            // 获取验证码倒计时
            getCode() {
                let that = this;
                if (that.flag) {
                    that.flag = !this.flag;
                    that.second = 60;
                    sessionStorage.setItem("second", that.second);
                    if(that.second > 1){
                        let interval = window.setInterval(function() {
                            that.second--;
                            sessionStorage.setItem("second", that.second);
                            if(that.second < 1){
                                window.clearInterval(interval);
                                sessionStorage.removeItem('second')
                                that.flag = true
                            }
                        }, 1000);
                    }
                }
            },
            judgeCode() {
                this.second = (Number(sessionStorage.getItem('second'))) - 1
                let that = this;
                if (sessionStorage.getItem("second")){
                    this.flag = false;
                    let interval = window.setInterval(function() {
                        that.second--;
                        sessionStorage.setItem("second", that.second);
                        if(that.second < 1){
                            window.clearInterval(interval);
                            sessionStorage.removeItem('second')
                            that.flag = true
                        }
                    }, 1000);
                }
            },
            open(cont) {
                const h = this.$createElement;
                this.$notify({
                    title: '成功',
                    message: h('i', { style: 'color: teal'}, cont)
                });
            },
        }
    }
</script>

<style lang="scss">
    #account_safe{
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
        }
        .el-loading-mask{
            .el-loading-spinner{
                .circular{
                    .path{
                        stroke: rgb(24, 204, 192);
                    }
                }
                .el-loading-text{
                    color: rgb(24, 204, 192);
                }
            }
        }
        .cont{
            /*height: calc(100% - 72px);
            height: -webkit-calc(100% - 72px);
            height: -moz-calc(100% - 72px);
            overflow: auto;*/
            .bind_message{
                margin-left: 160px;
                height: 250px;
                p{
                    &:nth-of-type(1){
                        height: 18px;
                        font-size: 18px;
                        line-height: 18px;
                        margin-top: 15px;
                        font-weight: 900;
                    }
                    &:nth-of-type(2){
                        height: 14px;
                        line-height: 14px;
                        font-size: 14px;
                        color: rgba(0,0,0,0.45);
                        margin-top: 16px;
                    }
                }
                .el-button{
                    margin-top: 40px;
                }
                .el-form{
                    margin-top: 32px;
                    width: 470px;
                    p{
                        height:12px;
                        font-size:12px;
                        line-height: 12px;
                        color: rgba(255,59,48,1);
                        text-indent: 100px;
                        margin-bottom: 10px;
                        font-weight: 100;
                    }
                    .el-form-item{
                        margin-left: -50px;
                        .el-form-item__label:before{
                            content: "";
                        }
                        &:nth-of-type(2) {
                            margin-bottom: 0;
                            .el-form-item__content{
                                display: flex;
                                .el-input{
                                    flex: 1;
                                    margin-right: 8px;
                                }
                                .el-button{
                                    margin-top: 0;
                                    padding: 0;
                                    width: 100px;
                                }
                            }
                        }
                        &:nth-of-type(3) {
                            .el-button{
                                margin-top: 0;
                            }
                        }
                    }
                    .el-button--info{
                        background: rgba(0,0,0,0.25);
                        border-color: rgba(0,0,0,0.25);
                        &:hover{
                            background: rgba(0,0,0,0.25);
                            border-color: rgba(0,0,0,0.25);
                            color: #fff;
                        }
                    }
                }
            }
            .change_password{
                margin-left: 160px;
                p{
                    height: 18px;
                    font-size: 18px;
                    line-height: 18px;
                    margin-top: 15px;
                    font-weight: 900;
                }
                .el-form{
                    margin-top: 32px;
                    width: 470px;
                    p{
                        height:12px;
                        font-size:12px;
                        line-height: 12px;
                        color: rgba(255,59,48,1);
                        text-indent: 100px;
                        margin-bottom: 10px;
                        font-weight: 100;
                    }
                    .el-form-item{
                        margin-left: -50px;
                        &:nth-of-type(3) {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }
    }
</style>
