<template>
    <el-container>
        <el-aside width="208px" style="box-shadow:1px 0px 4px 0px rgba(0,16,41,0.12);">
            <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" mode="vertical" @select='handleSelect()'  text-color="#595959" active-text-color="#18CCC0" :router="true">
                <el-menu-item v-for="(item,index) in asideNavList" :key="index" :index="index.toString()" :route="asideNavList[index].url">
                    <!-- <i class="el-icon-menu"></i> -->
                    <!-- <router-link :to="asideNavList[index].url" > -->
                    <span class="operA">{{item.alias}}</span>
                    <!-- </router-link> -->
                </el-menu-item>
            </el-menu>
        </el-aside>
       <div class="tatal">
           <router-view>

           </router-view>
       </div>
    </el-container>
</template>

<script>
    import api from "../fetch/api.js";
    import store from "@/store/index";
    import { mapState, mapActions, mapGetters } from "vuex";

    export default {
        name: "totalManageC",
        data: function() {
            return {
                info: "total manage center",
                activeIndex: "",
                asideNavList: [
                    {
                        name: "store",
                        url: "/totalManageC/store",
                        alias: "门店管理"
                    },
                    {
                        name: "brand",
                        url: "/totalManageC/brand",
                        alias: "品牌管理"
                    },
                    {
                        name: "reservation",
                        url: "/totalManageC/reservation",
                        alias: "预约订单"
                    },
                    {
                        name: "apply",
                        url: "/totalManageC/apply",
                        alias: "支付管理"
                    },
                    {
                        name: "userInfo",
                        url: "/totalManageC/userInfo",
                        alias: "用户信息"
                    },
                    {
                        name: "integral",
                        url: "/totalManageC/integral",
                        alias: "积分管理"
                    },
                    {
                        name: "coupon",
                        url: "/totalManageC/coupon",
                        alias: "优惠券管理"
                    },
                    /*{
                        name: "newsTemp",
                        url: "/totalManageC/newsTemp",
                        alias: "消息模板"
                    },*/
                    {
                        name: "message",
                        url: "/totalManageC/message",
                        alias: "短息服务管理"
                    },
                ],
            };
        },
        created() {

        },
        mounted() {
            this.getStoreList();
            this.setIndex()
        },
        methods: {
            setIndex(){
                if(window.location.href.indexOf('store') != -1 || window.location.href.indexOf('storeConfig') != -1 || window.location.href.indexOf('addStore') != -1) {
                    this.activeIndex = '0'
                }else if(window.location.href.indexOf('brand') != -1) {
                    this.activeIndex = '1'
                }else if(window.location.href.indexOf('reservation') != -1) {
                    this.activeIndex = '2'
                }else if(window.location.href.indexOf('apply') != -1) {
                    this.activeIndex = '3'
                }else if(window.location.href.indexOf('userInfo') != -1) {
                    this.activeIndex = '4'
                }else if(window.location.href.indexOf('integral') != -1 || window.location.href.indexOf('integralDetail') != -1 || window.location.href.indexOf('setIntegral') != -1) {
                    this.activeIndex = '5'
                }else if(window.location.href.indexOf('coupon') != -1 || window.location.href.indexOf('setUpCoupon') != -1) {
                    this.activeIndex = '6'
                }else if(window.location.href.indexOf('message') != -1) {
                    this.activeIndex = '7'
                }
            },
            /*...mapActions([
                "changeStoreList"
            ]),*/
            handleOpen() {},
            handleClose() {},
            handleSelect(index) {
                // console.log(index)
            },
            getStoreList() {
                let params = { sellerId : this.loginInfo.sellerId };
                api.queryStoreBySeller(params).then(res => {
                   res = JSON.stringify(res).replace(/id/g, 'value').replace(/name/g, 'label')
                    store.dispatch("changeStoreList", JSON.parse(res));
                });
            },
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
    };
</script>

<style lang="scss">
    .el-container{
        font-size: 14px;
        color: rgba(0,0,0,.85);
        .el-menu{
            height: 100%;
        }
    }
    .tatal{
        width: 100%;
        height: 100%;
        .el-button{
            padding-top: 0;
            padding-bottom: 0;
            span{
                line-height: 30px;
                margin: 0;
            }
            &:hover {
                color: #18CCC0;
                border: 1px solid #18CCC0;
                background: #fff;
            }
        }
        .el-button--primary{
            background: #18CCC0;
            border: 1px solid #18CCC0;
            &:hover, &:focus {
                color: #fff;
                background: #18CCC0;
                border: 1px solid #18CCC0;
            }
        }
        .el-button--text{
            &:hover{
                color: #18CCC0;
            }
            &:focus{
                color: #18CCC0;
            }
        }
        .el-form-item{
            margin-bottom: 32px;
        }
        .el-form-item__label{
            height: 32px;
            line-height: 32px;
        }
        .el-date-editor{
            .el-range-separator{
                line-height: 22px;
            }
            .el-input__icon{
                line-height: 22px;
            }
        }
        .el-table:before{
            height: 0;
        }
        .el-table{
            margin: 16px 32px 16px;
            width: calc(100% - 64px);
            width: -webkit-calc(100% - 64px);
            width: -moz-calc(100% - 64px);
            height: calc(100% - 160px);
            height: -webkit-calc(100% - 160px);
            height: -moz-calc(100% - 160px);
            overflow: auto;
            .el-button--text:hover, .el-button--text:focus, .el-button--text:active{
                background: transparent;
                border-color: transparent;
            }
            .has-gutter{
                color: rgba(0,0,0,.85);
            }
            th{
                background: rgba(250,250,250,1);
            }
            td{

            }
        }
        .el-menu-item{
            height: 40px;
            margin-top: 24px;
            line-height: 40px;
            text-align: center;
            span{
                margin: 0;
            }
        }
    }


</style>
