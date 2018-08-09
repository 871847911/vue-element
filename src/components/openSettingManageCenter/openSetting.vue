<template>
    <div id="open_setting">
        <div class="no_project">
            <p>您还未绑定小程序，请绑定后再使用发布设置</p>
            <el-button type="primary">前去绑定小程序</el-button>
        </div>
        <div class="has_project">
            已绑定
            <el-steps :active="2" align-center>
                <el-step title="提交审核" :description="time"></el-step>
                <el-step title="" description=""></el-step>
                <el-step title="审核反馈" :description="time"></el-step>
                <el-step title="" description=""></el-step>
                <el-step title="发布小程序" :description="time"></el-step>
            </el-steps>
        </div>
    </div>
</template>

<script>
import vPlayvideo from "components/public/playVideo";
import api from "../../fetch/api";
import { mapGetters } from "vuex";
export default {
    name: "openSetting",
    data: function() {
        return {
            hasBindProject: '',
            activeIndex: 1,
            time: '2012-11-12'
        };
    },

    created() {
        this.hasBindPro()
    },
    methods: {
        //是否已绑定小程序
        hasBindPro() {
            let params = { sellerId: this.loginInfo.sellerId };
            api.querySellerById(params).then(res => {
                // console.log(res)
                this.appId = res.appId
            });
        },
    },
    computed: {
        ...mapGetters({
            loginInfo: "getLoginInfo"
        })
    }
};
</script>

<style lang="scss">
    #open_setting{
        background: #fff;
        width: 100%;
        height: 100%;
        font-weight: 100;
        @include buttonPrimary;
        .no_project{
            height: 100%;
            .el-steps{
                width: 70%;
                margin: auto;
                .el-step{
                    .is-finish{
                        color: rgba(24,204,192,1);
                        border-color: rgba(24,204,192,1);
                        .el-step__icon{
                            background: rgba(24,204,192,1);
                        }
                        .el-step__line{
                            .el-step__line-inner{
                                height: 4px;
                            }
                        }
                    }
                    .is-process, .is-wait{
                        color: rgba(0,0,0,0.85);
                        border-color:rgba(217,217,217,1);
                        .el-step__icon{
                            background: rgba(217,217,217,1);
                        }
                    }
                    .el-step__description{
                        color: rgba(0,0,0,0.45);
                        height: 14px;
                        line-height: 14px;
                        margin-top: 10px;
                    }
                    .el-step__title{
                        font-weight: 900;
                        color: rgba(0,0,0,0.85);
                        height: 16px;
                        margin-top: 23px;
                        line-height: 16px;
                    }
                    .el-step__head{
                        .el-step__line{
                            top: 7px;
                            height: 4px;
                            .el-step__line-inner{
                                background: rgba(24,204,192,1);
                            }
                        }
                        .el-step__icon{
                            width: 16px;
                            height: 16px;
                            .el-step__icon-inner{
                                display: none;
                            }
                        }
                    }
                    &:nth-of-type(2), &:nth-of-type(4){
                        .el-step__head{
                            .is-text{
                                display: none;
                            }
                        }
                    }
                }
            }
        }
        .has_project{
            height: 100%;
            position: relative;
            .el-steps{
                position: absolute;
                width: 70%;
                bottom: 120px;
                left: 15%;
                .el-step{
                    .is-finish{
                        color: rgba(24,204,192,1);
                        border-color: rgba(24,204,192,1);
                        .el-step__icon{
                            background: rgba(24,204,192,1);
                        }
                        .el-step__line{
                            .el-step__line-inner{
                                height: 4px;
                            }
                        }
                    }
                    .is-process, .is-wait{
                        color: rgba(0,0,0,0.85);
                        border-color:rgba(217,217,217,1);
                        .el-step__icon{
                            background: rgba(217,217,217,1);
                        }
                    }
                    .el-step__description{
                        color: rgba(0,0,0,0.45);
                        height: 14px;
                        line-height: 14px;
                        margin-top: 10px;
                    }
                    .el-step__title{
                        font-weight: 900;
                        color: rgba(0,0,0,0.85);
                        height: 16px;
                        margin-top: 23px;
                        line-height: 16px;
                    }
                    .el-step__head{
                        .el-step__line{
                            top: 7px;
                            height: 4px;
                            .el-step__line-inner{
                                background: rgba(24,204,192,1);
                            }
                        }
                        .el-step__icon{
                            width: 16px;
                            height: 16px;
                            .el-step__icon-inner{
                                display: none;
                            }
                        }
                    }
                    &:nth-of-type(2), &:nth-of-type(4){
                        .el-step__head{
                            .is-text{
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
