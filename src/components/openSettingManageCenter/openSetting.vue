<template>
    <div id="open_setting">
        <div class="no_project" v-if="hasBindProject">
            <p>您还未绑定小程序，请绑定后再使用发布设置</p>
            <el-button type="primary" @click="toBindProject">前去绑定小程序</el-button>
        </div>
        <div class="has_project" v-else>
            <div class="no_temp" v-if="noActiveTemp">
                <img src="../../assets/images/no_temp.png" alt="">
                <p>当前没有使用中的小程序模版</p>
            </div>
            <div class="audit_step">
                <p>进度处理</p>
                <p>您可以在<span @click="toTempCenter">模板中心</span>重新提交审核，或<span>关闭审核</span></p>
                <el-steps :active="2" align-center v-if="!showStep">
                    <el-step title="提交审核" :description="time"></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="审核反馈" :description="time"></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="发布小程序" :description="time"></el-step>
                </el-steps>
            </div>
            <div class="step_tip" v-if="noActiveTemp">
                <img src="../../assets/images/audit_tip.png" alt="">
                <div class="tip_message">
                    <p>您可以在<span @click="toTempCenter">模板中心</span>挑选合适的美业模板</p>
                    <p>选中心仪的模板后，点击使用便可提交审核</p>
                    <p>选中心仪的模板后，点击使用便可提交审核</p>
                </div>
            </div>
            <div class="audit_status">
                <div class="temp_img">
                    <img :src="tempImgUrl" alt="">
                    <div class="tempInfo" v-if="auditResult.status == 0">
                        <dl>
                            <dt>模板名称：</dt>
                            <dd>{{pushedInfo.templateName}}</dd>
                        </dl>
                        <dl>
                            <dt>模板版本：</dt>
                            <dd>{{pushedInfo.userVersion}}</dd>
                        </dl>
                        <dl>
                            <dt>发布时间：</dt>
                            <dd>{{pushedInfo.releaseTime}}</dd>
                        </dl>
                    </div>
                </div>
                <p class="audit" v-if="auditResult.status == 2">审核中</p>
                <p class="audit" v-if="auditResult.status == 1">审核失败</p>
                <p class="audit" v-if="auditResult.status == 0">审核成功</p>
                <p class="audit" v-if="auditResult.status == 0">已发布</p>
                <p v-html="auditResult.reason" v-if="auditResult.status == 1"></p>
                <p v-if="auditResult.status == 1">审核中的小程序不会影响您<span @click="dialogVisible = true">已发布的小程序</span></p>
                <p v-if="auditResult.status == 2 || auditResult.status == 0">您的小程序已提交到微信审核，需要等待1-3天。审核中的小程序不会影响您<span @click="dialogVisible = true">已发布的小程序</span></p>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="440px" center>
            <p>审核通过后将覆盖已发布的小程序</p>
            <dl>
                <dt>模板名称：</dt>
                <dd>{{auditResult.templateName || '无已发布版本'}}</dd>
            </dl>
            <dl>
                <dt>模板版本：</dt>
                <dd>{{auditResult.userVersion || '无已发布版本'}}</dd>
            </dl>
            <dl>
                <dt>发布时间：</dt>
                <dd>{{auditResult.releaseTime != null ? new Date(auditResult.releaseTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(auditResult.releaseTime).toTimeString().substr(0, 8) : '无已发布版本'}}</dd>
            </dl>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from '../../fetch/api.js'
import store from "@/store/index";
export default {
    name: "openSetting",
    data: function() {
        return {
            hasBindProject: 'true',
            activeIndex: 1,
            time: '2012-11-12',
            showStep: false,
            noActiveTemp: false,//默认有已激活模板（需手动激活）
            tempImgUrl: '',
            LoseReason: '失败原因',
            auditResult: {},
            pushedInfo: {},
            dialogVisible: false
        };
    },

    created() {
        this.hasBindPro();
        this.queryActivateTemplate();
        // this.getAuthorized();
        this.queryMyTemplatePage()
    },
    methods: {
        //是否已绑定小程序
        hasBindPro() {
            let params = { sellerId: this.loginInfo.sellerId };
            api.querySellerById(params).then(res => {
                console.log('123456', res)
                this.auditResult = res;
                if(res.appId != null){
                    this.hasBindProject = false
                }
            });
        },
        //是否已激活模板
        queryActivateTemplate() {
            let params = { accountId: this.loginInfo.id };
            api.queryActivateTemplate(params).then(res => {
                console.log('ActivateTemplate', res)
                if(res.state == 3){
                    this.noActiveTemp = true
                }
            })
        },
        //我的已激活模板
        queryMyTemplatePage() {
            let params = {accountId: this.loginInfo.id, page: {} };
            api.queryMyTemplatePage(params).then(res => {
                this.tempImgUrl = res.rows[0].coverUrl
                // console.log('queryMyTemplatePage', res.rows)
            });
        },
        //获取审核状态
        /*getAuthorized() {
            let params = { accountId: this.loginInfo.id };
            api.getLatestAuditstatus(params).then(res => {
                this.auditResult = res
                console.log('LatestAuditstatus', res)
            });
        },*/
        toBindProject() {
            this.$router.push({path: '/openSettingC/miniProgramBind' })
            store.dispatch("changeMenuIndex", "0");
        },
        toTempCenter() {
            this.$router.push({path: '/openSettingC/tempCenter' })
            store.dispatch("changeMenuIndex", "1");
        },
        handleClose() {

        }
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
        position: relative;
        font-weight: 100;
        @include buttonPrimary;
        .no_project{
            height: 100%;
            p{
                height:18px;
                text-align: center;
                padding-top: 100px;
                font-size:18px;
                color:rgba(0,0,0,0.85);
                line-height:18px;
            }
            .el-button{
                position: absolute;
                left: 50%;
                margin-left: -57px;
                top: 158px;
            }
        }
        .has_project{
            height: 100%;
            position: relative;
            .no_temp{
                position: relative;
                img{
                    width: 80px;
                    position: absolute;
                    left: 50%;
                    top: 50px;
                    margin-left: -40px;
                }
                p{
                    text-align: center;
                    width: 100%;
                    color: rgba(0,0,0,0.45);
                    position: absolute;
                    top: 157px;
                }
            }
            .audit_status{
                padding-top: 24px;
                .temp_img{
                    width: 10.5%;
                    margin: 0 auto;
                    position: relative;
                    img{
                        width: 100%;
                        border: 1px solid #E8E8EC;
                    }
                    .tempInfo{
                        position: absolute;
                        @media screen and (max-width:1700px) and (min-width: 1200px){
                            left: 200px;
                            top: 50px;
                        }
                        @media screen and (min-width:1701px){
                            left: 350px;
                            top: 100px;
                        }
                        dl{
                            white-space: nowrap;
                            display: flex;
                            margin-top: 24px;
                            dt{
                                color: rgba(0,0,0,0.85);
                                font-weight: 900;
                            }
                            dd{
                                color: rgba(0,0,0,0.85);
                            }
                        }
                    }
                }
                .audit{
                    width: 100%;
                    color: rgba(0,0,0,0.85);
                    height: 18px;
                    line-height: 18px;
                    margin: 32px 0 16px;
                    font-weight: 900;
                    font-size: 18px;
                    text-align: center;
                }
                p{
                    width: 33%;
                    font-size: 14px;
                    line-height: 22px;
                    text-align: center;
                    margin-left: 33%;
                    span{
                        cursor: pointer;
                        color: rgba(24,204,192,1);
                        font-weight: 900;
                    }
                }
            }
            //审核提示
            .step_tip{
                width: 70%;
                position: absolute;
                left: 15%;
                bottom: 150px;
                img{
                    width: 100%;
                }
                .tip_message{
                    display: flex;
                    justify-content: space-between;
                    p{
                        width: 180px;
                        line-height: 20px;
                        color: rgba(0,0,0,0.45);
                        position: absolute;
                        span{
                            color: rgba(24,204,192,1);
                            cursor: pointer;
                        }
                        &:nth-of-type(1) {
                            left: 5.9%;
                        }
                        &:nth-of-type(2) {
                            left: 43.45%;
                        }
                        &:nth-of-type(3) {
                            left: 81%;
                        }
                    }
                }
            }
            //进度条
            .audit_step{
                position: absolute;
                width: 70%;
                bottom: 100px;
                left: 15%;
                p:nth-of-type(1){
                    font-size: 16px;
                    line-height: 16px;
                    color: rgba(30,30,30,1);
                    font-weight: 900;
                }
                p:nth-of-type(2){
                    text-align: center;
                    padding-bottom: 12px;
                    span{
                        cursor: pointer;
                        color: #18CCC0;
                        font-weight: 900;
                    }
                }
                .el-steps{
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
        .el-dialog__header{
            color: rgba(0,0,0,0.85);
            font-size: 18px;
            line-height: 18px;
            font-weight: 900;
            padding-bottom: 16px;
            text-align: center;
            .el-dialog__headerbtn{
                display: none;
            }
        }
        .el-dialog__body{
            padding-top: 0;
            p{
                color: rgba(0,0,0,0.45);
                line-height: 14px;
                font-size: 14px;
            }
            dl{
                margin-top: 24px;
                display: flex;
                line-height: 20px;
                font-size: 14px;
                dt{
                    margin-left: 100px;
                    color: rgba(0,0,0,0.85);
                    font-weight: 900;
                }
                dd{
                    color: rgba(0,0,0,0.85);
                }
            }
        }
    }
</style>
