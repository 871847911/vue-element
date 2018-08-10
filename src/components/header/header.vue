<template>
    <div class="header">
        <!-- <el-row>
            <el-button type="info" @click="getLogInStatus"></el-button>
            <el-button type="success" @click="changeLogInStatus"></el-button>
          </el-row> -->
        <!--
    <el-row>
        <el-col :span="24">-->

        <el-menu :default-active="headMenuIndex || '0'" class="el-menu-demo" mode="horizontal" :router="true" @select="handleSelect" background-color="#282C33" text-color="#b3b5b7" active-text-color="#fff">
            <div id="logo">
                <img src="../../assets/images/logo@2x.png" alt="">
            </div>
            <el-menu-item ref="head_menu" v-for="(item,index) in menuList" :key="index" :index="index.toString()" :route="menuList[index].url">
                <!-- <router-link :to="menuList[index].url"> -->
                {{item.name}}
            </el-menu-item>
            <div class="login_info">
                <img src="../../assets/images/user_svg.png" alt="">
                <p class="login_name">{{loginInfo.nickname}}</p>
                <p class="to_login" @click="toLogin">退出</p>
            </div>
            <div class="message_center" @click="toMessageCenter">
                <img src="../../assets/images/message_svg.png" alt="">
                <el-badge v-if="this.redItem" is-dot class="item">消息</el-badge>
                <p v-else>消息</p>
            </div>
        </el-menu>

        <!--</el-col>-->
        <!--<el-col :span="2" class="setRL">
            <el-row>
                <el-col :span="12">
                    <span class="showUser">{{loginInfo.nickname}}</span>
                </el-col>
                <el-col :span="12">
                    <el-button class="changeBtn" type="text" @click="logOut">退出</el-button>
                </el-col>
            </el-row>
        </el-col>-->
        <!--</el-row>-->

    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import store from "@/store/index";
import api from "../../fetch/api";
import vLogin from "components/login/login";
import vRegister from "components/login/register";
export default {
    name: "headerNav",
    components: {
        vLogin,
        vRegister
    },
    props: [],
    data() {
        return {
            userInfo: {
                name: "komolei"
            },
            // 顶部导航栏
            activeIndex: "0",
            menuList: [
                {
                    name: "全局管理",
                    url: "/totalManageC"
                },
                {
                    name: "运营管理",
                    url: "/operationManageC"
                },
                /*{
          name: "模板市场",
          url: "/templateMarketC"
        },*/
                {
                    name: "小程序设置",
                    url: "/openSettingC"
                }
            ],
            ismessage: false
        };
    },
    created() {
        store.dispatch("changeLoginInfo", JSON.parse(sessionStorage.loginInfo));
        store.dispatch(
            "changeHeadMenuIndex",
            sessionStorage.getItem("headMenuIndex") || 0
        );
        this.queryMessageReceivePage();
    },
    updated() {
        let a = document.getElementsByClassName("is-active")[0];
        a.style.borderBottomColor = "rgba(24,204,192,1)";
    },
    mounted() {
        let a = document.getElementsByClassName("is-active")[0];
        a.style.borderBottomColor = "rgba(24,204,192,1)";
        /*console.log(this.$refs.head_menu)
        for(var i = 0; i < this.$refs.head_menu.length; i++) {
            if(this.$refs.head_menu[i].active == true) {
                this.$refs.head_menu[i].itemStyle.borderBottomColor = '#f66'
            }
        }*/
    },
    computed: {
        ...mapGetters({
            logInStatus: "getLogInStatus",
            loginInfo: "getLoginInfo",
            headMenuIndex: "getHeadMenuIndex",
            storeMenuIndex: "getStoreMenuIndex",
            redItem: "getredItem"
        })
    },
    methods: {
        ...mapActions([
            "changeIsLogInStatus",
            "changeIsLogin",
            "changeStoreMenuIndex"
        ]),
        queryMessageReceivePage() {
            let params = {
                accountId: this.loginInfo.id,
                isDelete: "0",
                pageNo:1,
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

        getLogInStatus() {
            console.log("this.logIn status is1:", this.logInStatus);
            console.log(
                "this.logIn status is2:",
                this.$store.getters.getLogInStatus
            );
        },
        changeLogInStatus() {
            store.dispatch("changeIsLogInStatus", true);
            console.log("this.logIn status is:", this.logInStatus);
        },
        handleSelect(index) {
            store.dispatch("changeHeadMenuIndex", index);
            store.dispatch("changeMenuIndex", "0");
            store.dispatch("changeStoreMenuIndex", "0");
            console.log(this.storeMenuIndex);
        },
        logOut() {
            this.$router.replace({ path: "/" });
            store.dispatch("changeIsLogin", false);
        },
        toLogin() {
            store.dispatch("changeLoginInfo", "");
            sessionStorage.removeItem("loginInfo");
            sessionStorage.removeItem("tips");
            sessionStorage.removeItem("headMenuIndex");
            window.location.href = "http://cloud.vdongchina.com/";
        },
        toMessageCenter() {
            this.$router.push({ path: "/totalManageC/messageCenter" });
            store.dispatch("changeHeadMenuIndex", "0");
            store.dispatch("changeStoreMenuIndex", "7");
        }
    }
};
</script>

<style lang="scss">
.el-menu--horizontal {
    .el-menu-item {
        position: relative;
        &:nth-of-type(1) {
            margin-left: 208px;
        }
    }
    #logo {
        position: absolute;
        width: 208px;
        height: 64px;
        &:hover {
            cursor: pointer;
        }
        img {
            width: 102px;
            height: 34px;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto;
        }
    }
    .message_center {
        display: flex;
        align-items: center;
        height: 61px;
        color: #fff;
        float: right;
        cursor: pointer;
        margin-right: 60px;
        &:focus {
            outline: -webkit-focus-ring-color auto 0;
        }
        img {
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }

        .el-badge__content.is-dot {
            border: none;
            right: -1px;
            top: 3px;
            background-color: rgba(221, 4, 31, 1);
        }
    }
    .login_info {
        float: right;
        display: flex;
        align-items: center;
        height: 61px;
        margin-right: 40px;
        line-height: 22px;
        img {
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }
        &:focus {
            outline: -webkit-focus-ring-color auto 0;
        }
        .login_name {
            color: rgba(255, 255, 255, 0.85);
            margin-right: 56px;
        }
        .to_login {
            &:hover {
                cursor: pointer;
                color: rgba(2, 230, 215, 1);
            }
            color: rgba(24, 204, 192, 1);
        }
    }
}

.el-menu--horizontal > .el-menu-item.is-active {
    border-left: 0;
    border-bottom: 4px solid #f66;
}
.el-menu--horizontal > .el-menu-item {
    border-left: 0;
    text-indent: 0;
    padding: 0 24px;
}
.el-menu-item .el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.el-header {
    padding: 0;
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.setRL {
    line-height: 60px;
    padding: 0 20px;
    background-color: rgb(40, 44, 51);
    border-radius: 0;
}

.showUser {
    color: #fff;
}
.changeBtn:hover {
    border-color: transparent;
}
</style>
