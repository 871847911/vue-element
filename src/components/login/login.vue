<template>
    <div id="login">
        <div class="login_logo">
            <img src="../../assets/images/login_logo@2x.png" alt="">
    </div>
        <div class="login_box">
            <p class="title">登录</p>
            <dl>
                <dt>账号</dt>
                <dd><input type="text" autofocus name="login_name" @keyup.enter="loginInit" v-model="login_name" placeholder="请输入登录账号" /></dd>
            </dl>
            <dl>
                <dt>密码</dt>
                <dd><input type="password" name="login_password" @keyup.enter="loginInit" v-model="login_password" placeholder="请输入登录密码" /></dd>
            </dl>
            <p class="errMsg">
                {{errMsg}}
            </p>
            <button class="toLogin" @keyup.enter="loginInit" @click="loginInit">登 录</button>
        </div>
    </div>
</template>

<script>
    import store from "@/store/index";
    import { mapState, mapActions, mapGetters } from "vuex";
    import api from '../../fetch/api.js'
    export default {
        name: "login",
        data() {
            return{
                errMsg: '',
                login_name: '',
                login_password: '',
            }
        },
        created()  {
            sessionStorage.setItem('headMenuIndex', '0')
            localStorage.setItem('menuIndex', '0')
            sessionStorage.removeItem('loginInfo');
            sessionStorage.removeItem('tips');
            store.dispatch("changeMenuIndex", localStorage.getItem("menuIndex"));
            store.dispatch("changeHeadMenuIndex", sessionStorage.getItem("changeHeadMenuIndex"));
        },
        methods: {
            loginInit() {
                if(this.login_name == '') {
                    this.errMsg = '请输入账号'
                }else if(this.login_password == '') {
                    this.errMsg = '请输入密码'
                }else{
                    this.errMsg = '';
                    this.queryAccount()
                }
            },
            queryAccount() {
                let params = { username: this.login_name, password: this.login_password };
                api.queryAccount(params).then(res => {
                    if(res.message){
                        this.errMsg = res.message
                    }else{
                        this.$router.push({path: '/totalManageC/store'})
                        console.log(res)
                        sessionStorage.setItem('loginInfo', JSON.stringify(res))
                        store.dispatch("changeLoginInfo", res);
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    #login{
        height: 100%;
        background: url("../../assets/images/login_bg.jpg");
        background-size: 100% 100%;
        position: relative;
    }
    .login_logo{
        position: absolute;
        left: 30px;
        top: 30px;
        width: 193px;
        height: 43px;
     }
    .login_logo img{
        width: 100%;
        height: 100%;
    }
    .login_box{
        width: 340px;
        height: 340px;
        border-radius: 8px;
        background: #fff;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.03);
    }
    .login_box .title{
        margin: 30px 0 40px 30px;
        height: 20px;
        line-height: 20px;
        font-weight: 900;
        font-size: 20px;
        color: rgba(24,204,192,1);
    }
    .login_box dl{
        margin: 0 30px;
        display: flex;
        line-height: 14px;
        height: 14px;
        font-size: 14px;
        border-bottom: 1px solid rgba(232,232,236,.6);
        padding-bottom: 10px;
        color: rgba(70,70,70,1);
    }
    .login_box dl:nth-of-type(2){
        margin: 30px 30px 24px;
    }
    .login_box dl dt{
        width: 70px;
    }
    .login_box dl dd{
        width: 100%;
    }
    .login_box dl dd input{
        border: 0;
        font-size: 14px;
        width: 100%;
        outline:none;
    }
    input::-webkit-input-placeholder{
        color: rgba(196,196,196,1);
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color: rgba(196,196,196,1);
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color: rgba(196,196,196,1);
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
        color: rgba(196,196,196,1);
    }
    .login_box .errMsg{
        margin-left: 30px;
        height: 12px;
        line-height: 12px;
        font-size: 12px;
        color: rgba(255,59,48,1);
    }
    .login_box button{
        cursor:pointer;
        margin: 60px 30px 0;
        height: 36px;
        width: 280px;
        color: rgba(24,204,192,1);
        font-weight: 900;
        color: #fff;
        font-size: 16px;
        background: rgba(24,204,192,1);
        border: 1px solid rgba(24,204,192,1);
        border-radius: 4px;
    }
</style>
