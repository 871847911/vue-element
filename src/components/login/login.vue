<template>
    <div id="login">
        <div class="login_logo">
            <img src="../../assets/images/login_logo@2x.png" alt="">
        </div>
        <div class="login_box" v-if="forget">
            <p class="title">登录</p>
            <dl>
                <dt>账号</dt>
                <dd><input type="text" autofocus name="login_name" @keyup.enter="loginInit" v-model="login_name" maxlength="20" placeholder="请输入登录账号或手机号码" /></dd>
            </dl>
            <dl>
                <dt>密码</dt>
                <dd><input type="password" name="login_password" @keyup.enter="loginInit" v-model="login_password" maxlength="12" placeholder="请输入登录密码" /></dd>
            </dl>
            <dl class="b_dl">
                <dt>验证码</dt>
                <dd><input type="text" name="login_password" maxlength="4" @keyup.enter="loginInit" v-model="login_code" placeholder="请输入验证码" /></dd>
                <img v-bind:src="imgurl" @click="changeImg">
                <p class="errMsg">
                    {{errMsg}}
                </p>
                <p class="toforget" @click="toforget">
                    忘记密码
                </p>
            </dl>
            <button class="toLogin" @keyup.enter="loginInit" @click="loginInit">登 录</button>
        </div>
        <div class="forgetPasssword" v-else>
            <el-input type="password" style="position: absolute;top:-50px;"></el-input>
            <div class="title_box">
                <span class="">修改密码</span>
                <a @click="tologin">返回登录</a>
            </div>
            <div class="tip">确保您的手机在身边，进行手机号码验证更改密码。</div>
            <div class="input_box">
                <label>手机号码</label>
                <el-input name="phone" @focus="clearperrorMsg" @keyup.enter="changePassword" v-model="phone" maxlength="11" placeholder="请输入您的手机号"></el-input>
                <p class="errorMsg">{{perrorMsg}}</p>
            </div>
            <div class="input_box">
                <label>验证码</label>
                <el-input class="code" @focus="clearcerrorMsg" name="code" @keyup.enter="changePassword" v-model="code" maxlength="6" placeholder="请输入您的验证码"></el-input>
                <el-button type="primary" class="nodis" v-if="flag" @click="sendcode">获取验证码</el-button>
                <el-button type="primary" disabled v-if="!flag">剩余{{second}}s</el-button>
                <p class="errorMsg">{{cerrorMsg}}</p>
            </div>
            <div class="input_box">
                <label>新密码</label>
                <el-input type="password" name="newPassword" @focus="clearnerrorMsg" @keyup.enter="changePassword" v-model="newPassword" placeholder="6-12位英文、数字，区分大小写" minlength="6" maxlength="12"></el-input>
                <p class="errorMsg">{{nerrorMsg}}</p>
            </div>
            <el-button type="primary" @click="changePassword">确定</el-button>

        </div>

    </div>
</template>

<script>
import store from "@/store/index";
import { mapState, mapActions, mapGetters } from "vuex";
import api from "../../fetch/api.js";
export default {
    name: "login",
    data() {
        return {
            errMsg: "",
            login_name: "",
            login_password: "",
            login_code: "",
            phone: "",
            code: "",
            newPassword: "",
            second: 60,
            flag: true,
            timer: null,
            perrorMsg: "",
            cerrorMsg: "",
            nerrorMsg: "",
            id: "",
            status: "",
            forget: true,

            uuid: "",
            imgurl: ""
        };
    },
    mounted() {
        this.judgeCode();
        this.getUUID();
    },
    created() {
        sessionStorage.setItem("headMenuIndex", "0");
        sessionStorage.setItem("StoreMenuIndex", "0");
        localStorage.setItem("menuIndex", "0");
        sessionStorage.removeItem("loginInfo");
        sessionStorage.removeItem("tips");
        store.dispatch("changeMenuIndex", localStorage.getItem("menuIndex"));
        store.dispatch("changeHeadMenuIndex", sessionStorage.getItem("headMenuIndex"));
        store.dispatch("changeStoreMenuIndex", sessionStorage.getItem("StoreMenuIndex"));
    },
    methods: {
        //获取uuid
        getUUID() {
            let params = {};
            api.getUUID(params).then(res => {
                this.uuid = res;
                this.getVerify(res);
            });
        },
        getVerify(e) {
            this.imgurl = api.siteUrl() + "/verify/getVerify?uuid=" + e;
        },
        changeImg() {
            console.log("改变");
            this.getUUID();
            console.log(this.uuid);
        },
        //获取验证码
        sendcode() {
            var reg = 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/;

            //var url="/nptOfficialWebsite/apply/sendSms?mobile="+this.ruleForm.phone;
            if (this.phone == "") {
                this.perrorMsg = "请输入手机号码";
            } else if (!reg.test(this.phone)) {
                this.perrorMsg = "手机格式不正确";
            } else {
                let params = {
                    phone: this.phone
                };
                api.queryAccountByPhone(params).then(res => {
                    console.log("根据手机号查是否绑定过", res);
                    if (res == "") {
                        this.perrorMsg = "手机号码未绑定过账号，请核对";
                    } else {
                        this.id = res.id;
                        this.sendAccountMessage();
                        let that = this;
                        if (that.flag) {
                            that.flag = false;
                            let interval = window.setInterval(function() {
                                that.setStorage(that.second, that.phone);
                                if (that.second-- <= 0) {
                                    that.second = 60;
                                    that.flag = true;
                                    window.clearInterval(interval);
                                }
                            }, 1000);
                        }
                    }
                });
            }
        },

        //存缓存
        setStorage(parm, phone) {
            localStorage.setItem("dalay", parm);
            localStorage.setItem("phone", phone);
            localStorage.setItem("_time", new Date().getTime());
        },
        //获取缓存
        judgeCode() {
            let that = this;
            let localDelay = that.getStorage();
            let secTime = parseInt(
                (new Date().getTime() - localDelay.sec) / 1000
            );
            if (localDelay.phone == "undefined") {
            } else {
                that.phone = localDelay.phone;
            }

            console.log(localDelay);
            if (secTime > localDelay.delay) {
                that.flag = true;
                that.phone = "";
                console.log("已过期");
            } else {
                that.flag = false;
                let _delay = localDelay.delay - secTime;
                that.second = _delay;
                that.timer = setInterval(function() {
                    if (_delay > 1) {
                        _delay--;
                        that.setStorage(_delay);
                        that.second = _delay;
                        that.flag = false;
                    } else {
                        // 此处赋值时为了让浏览器打开的时候,直接就显示剩余的时间
                        that.second = 60;
                        that.flag = true;
                        window.clearInterval(that.timer);
                    }
                }, 1000);
            }
        },
        getStorage() {
            let localDelay = {};
            localDelay.delay = localStorage.getItem("dalay");
            localDelay.sec = localStorage.getItem("_time");
            localDelay.phone = localStorage.getItem("phone");
            return localDelay;
        },
        //忘记密码
        toforget() {
            this.forget = false;
            this.errMsg = "";
            this.login_name = "";
            this.login_password = "";
            this.login_code = "";
        },
        tologin() {
            this.forget = true;
            this.code = "";
            this.newPassword = "";
            this.nerrorMsg = "";
            this.cerrorMsg = "";
            this.nerrorMsg = "";
        },
        //登录
        loginInit() {
            var login = /^[A-Za-z0-9]+$/;
            if (this.login_name == "") {
                this.errMsg = "请输入账号";
            } else if (!login.test(this.login_name)) {
                this.errMsg = "请输入正确的账号";
            } else if (this.login_password == "") {
                this.errMsg = "请输入密码";
            } else if (this.login_code == "") {
                this.errMsg = "请输入验证码";
            } else if (!login.test(this.login_code)) {
                this.errMsg = "请输入正确的验证码";
            } else {
                console.log(this.uuid);
                console.log(this.login_code);
                let params = {
                    uuid: this.uuid,
                    code: this.login_code
                };
                api.checkVerify(params).then(res => {
                    console.log("aaa",res);
                    if (res.message == true) {
                        this.errMsg = "";
                        this.queryAccount();
                    } else if(res.message == false) {
                        this.errMsg = "验证码错误";
                    }else{
                        this.errMsg = res.message;
                    }
                });
            }
        },
        queryAccount() {
            let params = {
                mobile: this.login_name,
                password: this.login_password,
                username: this.login_name
            };
            api.queryAccount(params).then(res => {
                if (res.message) {
                    this.errMsg = res.message;
                } else {
                    this.$router.push({ path: "/totalManageC/store" });
                    sessionStorage.setItem("loginInfo", JSON.stringify(res));
                    store.dispatch("changeLoginInfo", res);
                }
            });
        },

        //发送验证码
        sendAccountMessage() {
            let params = {
                content: "微动",
                merchantId: 0,
                phones: [this.phone]
            };
            api.sendAccountMessage(params).then(res => {
                if (res.retmsg == "操作完成") {
                    this.$message({
                        message: "验证码发送成功",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.retmsg);
                }
                console.log("发送短信", res);
            });
        },
        //清理错误提示
        clearperrorMsg() {
            this.perrorMsg = "";
        },
        clearcerrorMsg() {
            this.cerrorMsg = "";
        },
        clearnerrorMsg() {
            this.nerrorMsg = "";
        },
        changePassword() {
            let params = {
                phone: this.phone
            };
            api.queryAccountByPhone(params).then(res => {
                console.log("根据手机号查是否绑定过", res);
                if (res == "") {
                    this.status = false;
                } else {
                    this.status = true;
                    this.id = res.id;
                }
                var reg = 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/;
                var code = /^[0-9]*$/;
                if (this.phone == "") {
                    this.perrorMsg = "请输入手机号";
                } else if (!reg.test(this.phone)) {
                    this.perrorMsg = "手机格式不正确";
                } else if (this.status == false) {
                    this.perrorMsg = "手机号码未绑定过账号，请核对";
                } else if (this.code == "") {
                    this.cerrorMsg = "请输入验证码";
                } else if (this.code.length < 6 || !code.test(this.code)) {
                    this.cerrorMsg = "验证码格式不正确";
                } else if (this.newPassword == "") {
                    this.nerrorMsg = "请设置您的新密码";
                } else if (this.newPassword.length < 6) {
                    this.nerrorMsg = "请设置6-12位长度密码";
                } else {
                    let params = {
                        code: this.code,
                        phone: this.phone
                    };
                    api.checkAccountMessage(params).then(res => {
                        console.log("校验验证码", res);
                        if (res.message == true) {
                            let params = {
                                id: this.id,
                                password: this.newPassword
                            };
                            api.updateAccount(params).then(res => {
                                console.log("修改用户登录密码", res);
                                if (res.retmsg == "操作成功") {
                                    this.$message({
                                        message: "密码修改成功",
                                        type: "success"
                                    });
                                    this.forget = true;
                                } else {
                                    this.$message.error(res.retmsg);
                                }
                            });
                        } else if(res.message == false) {
                            this.cerrorMsg = "验证码与手机号码不匹配";
                        }else{
                            this.cerrorMsg = res.message
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss">
.forgetPasssword {
    width: 446px;
    height: 412px;
    position: absolute;
    overflow: hidden;
    top: 50%;
    left: 50%;
    margin-left: -223px;
    margin-top: -206px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.04);
    border-radius: 8px;

    .title_box {
        padding: 30px 30px 16px 30px;
        span {
            font-size: 20px;
            font-weight: 900;
            color: rgba(24, 204, 192, 1);
        }
        a {
            font-size: 14px;
            font-weight: 900;
            color: rgba(24, 204, 192, 1);
            float: right;
            text-decoration: none;
            padding: 5px 0 0 0;
            cursor: pointer;
            &:hover {
                color: rgba(24, 204, 192, 0.6);
            }
        }
    }
    .tip {
        padding: 0 30px 40px 30px;
        font-size: 12px;
        color: rgba(119, 119, 119, 1);
    }
    .input_box {
        position: relative;
        padding: 0 30px 32px 30px;
        clear: both;
        overflow: hidden;
        label {
            width: 72px;
            font-size: 14px;
            color: rgba(70, 70, 70, 1);
            float: left;
            height: 40px;
            line-height: 40px;
        }
        .el-input {
            width: 312.4px;
            border-radius: 4px;
            font-size: 12px;
            float: left;
            .el-input__inner {
                height: 40px;
            }
        }
        .code {
            width: 216px;
            .el-input__inner {
                border-top-right-radius: 0%;
                border-bottom-right-radius: 0%;
                border-right: 0;
                height: 40px;
            }
        }
        .errorMsg {
            position: absolute;
            bottom: 12px;
            left: 103px;
            font-size: 12px;
            color: rgba(255, 59, 48, 1);
        }
        .el-button {
            width: 95px;
            text-align: center;
            height: 40px;
            line-height: 40px;
            padding: 0;
            margin: 0;
            border-top-left-radius: 0%;
            border-bottom-left-radius: 0%;
            float: left;
            font-size: 12px;
            color: rgba(255, 255, 255, 1);
            &:hover {
                background: #74e0d9;
                border-color: #74e0d9;
            }
        }
    }
    .el-button {
        width: 386px;
        display: block;
        height: 36px;
        border-radius: 4px;
        padding: 0;
        margin: 0 auto;
        font-size: 16px;
        &:hover {
            background: #74e0d9;
            border-color: #74e0d9;
        }
    }
    .el-button:disabled:hover {
        background-color: #ccc;
        border-color: #ccc;
    }
}

#login {
    height: 100%;
    background: url("../../assets/images/login_bg.jpg");
    background-size: 100% 100%;
    position: relative;
}
.login_logo {
    position: absolute;
    left: 30px;
    top: 30px;
    width: 193px;
    height: 43px;
}
.login_logo img {
    width: 100%;
    height: 100%;
}
.login_box {
    width: 340px;
    height: 376px;
    border-radius: 8px;
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.03);
}
.login_box .title {
    margin: 30px 0 40px 30px;
    height: 20px;
    line-height: 20px;
    font-weight: 900;
    font-size: 20px;
    color: rgba(24, 204, 192, 1);
}
.login_box dl {
    margin: 0 30px;
    display: flex;
    line-height: 14px;
    height: 14px;
    font-size: 14px;
    border-bottom: 1px solid rgba(232, 232, 236, 0.6);
    padding-bottom: 10px;
    color: rgba(70, 70, 70, 1);
}
.login_box dl:nth-of-type(2) {
    margin: 30px 30px 24px;
}
.login_box dl {
    position: relative;
    img {
        position: absolute;
        right: 0;
        bottom: 4px;
        width: 100px;
        height: 32px;
        cursor: pointer;
        border: 1px solid rgba(232, 232, 236, 0.6);
    }
    .errMsg {
        position: absolute;
        bottom: -60px;
        left: 0;
        margin: 0;
    }
    .toforget {
        position: absolute;
        right: 0;
        bottom: -34px;
        font-size: 12px;
        color: rgba(24, 204, 192, 1);
        cursor: pointer;
        &:hover {
            color: rgba(24, 204, 192, 0.6);
        }
    }
}
.login_box dl dt {
    width: 70px;
}

.login_box dl dd {
    width: 100%;
}
.login_box dl dd input {
    border: 0;
    font-size: 14px;
    width: 100%;
    outline: none;
}
input::-webkit-input-placeholder {
    color: rgba(196, 196, 196, 1);
}
input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: rgba(196, 196, 196, 1);
}
input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: rgba(196, 196, 196, 1);
}
input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: rgba(196, 196, 196, 1);
}
.login_box .errMsg {
    margin-left: 30px;
    height: 12px;
    line-height: 12px;
    font-size: 12px;
    color: rgba(255, 59, 48, 1);
}
.login_box button {
    cursor: pointer;
    margin: 85px 30px 0;
    height: 36px;
    width: 280px;
    color: rgba(24, 204, 192, 1);
    font-weight: 900;
    color: #fff;
    font-size: 16px;
    background: rgba(24, 204, 192, 1);
    border: 1px solid rgba(24, 204, 192, 1);
    border-radius: 4px;
    &:focus {
        outline: -webkit-focus-ring-color auto 0px;
        outline-color: -webkit-focus-ring-color;
        outline-style: auto;
        outline-width: 0px;
    }
    &:hover {
        background: #74e0d9;
        border-color: #74e0d9;
    }
}
</style>
