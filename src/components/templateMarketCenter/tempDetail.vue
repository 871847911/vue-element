<!--
<template>
    <div id="tempDetail1">
        <div class="temp_title">
            <p class="title">
                模板详情
            </p>
            <el-button @click="goBack">返 回</el-button>
        </div>
        <div class="temp">
            <div class="tempIntroduce">
                <div class="banner">
                    <el-carousel :interval="5000" arrow="always" height="548px" ref="carousel" @change="getBannerIndex">
                        <el-carousel-item v-for="(item, index) in banner" :key="index">
                            <img :src="item.url" alt="">
                        </el-carousel-item>
                    </el-carousel>
                    <div class="bannerNum"><el-input type="text" v-model="bannerIndex"/>&nbsp; &nbsp;/&nbsp; &nbsp;{{banner.length}}</div>
                </div>
                <div class="introduce" ref="introduce">
                    <p>模板说明</p>
                    <p>{{tempInfo.introduce}}</p>
                </div>
            </div>
            <div class="nameInfo">
                <div class="name" ref="name">
                    <p>模板名称：{{tempInfo.name}}</p>
                    <p>模板版本：<span>{{tempInfo.version}}</span></p>
                    <p>模板风格：<span>{{tempInfo.style}}</span></p>
                    <p>使用要求：<span>{{tempInfo.demand}}</span></p>
                    <p :title="tempInfo.industry">所属行业：<span>{{tempInfo.industry}}</span></p>
                    <p>模板价格：<span>{{tempInfo.price}}</span></p>
                    <div class="btns">
                        <el-button type="primary" @click="activateTemp()" v-if="tempInfo.status==0">激 活</el-button>
                        <el-button type="danger" @click="disabledMyTemplate()" v-if="tempInfo.status==1">取消激活</el-button>
                        <el-button disabled="" v-if="tempInfo.status==3">已经发布</el-button>
                    </div>
                </div>
                <div class="func" ref="func">
                    <p>页面列表及功能</p>
                    <dl v-for="(item) in tempFunc">
                        <dt>{{item.name}}</dt>
                        <div>
                            <dd v-for="(items) in item.children">{{items.name}}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
        <el-dialog title="" :visible.sync="dialogDisabled" width="433px" :before-close="handleClose">
            <span>该模板属于{{tempInfo.demand}}，您可以正常激活，但若要使用请升级账号，如升级账号请联系相关业务人员。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDisabled = false">取 消</el-button>
                <el-button type="primary" @click="activateTemp">激 活</el-button>
            </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="suerDisabled" width="433px" :before-close="handleClose">
            <span>模板启用前，请确认好模板可用的功能，确定要继续启用么</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="suerDisabled = false, dialogDisabled = false">取 消</el-button>
                <el-button type="primary" @click="activateMyTemplate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from '../../fetch/api.js'
    export default {
        name: "",
        data: function() {
            return {
                tempInfo: '',
                tempFunc: '',
                accountV: '',
                banner: '',
                bannerIndex: '',
                dialogDisabled: false,
                suerDisabled: false,
                funcNum: 0
            }
        },
        created() {
          console.log(this.$route.query.urlAdd);
          this.getAccountV();
          this.queryTemplateById();
          this.queryTemplateFunctionsById();
          this.queryTemplateBroadcastById();
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            getAccountV() {
                let params = { id: this.loginInfo.id };
                api.queryAccountById(params).then(res => {
                    console.log(res.free);
                    if(res.free == 0){
                        this.accountV = '标准版'
                    }else if(res.free == 1){
                        this.accountV = '高级版'
                    }else if(res.free == 2){
                        this.accountV = '豪华版'
                    }
                });
            },
            //激活模板函数
            activateTemp(item) {
                this.item = item;
                if(this.accountV == '标准版' && this.tempInfo.demand == '标准版'){
                    this.suerDisabled = true
                }else if(this.accountV == '高级版' && this.tempInfo.demand == '标准版'){
                    this.suerDisabled = true
                }else if(this.accountV == '高级版' && this.tempInfo.demand == '高级版') {
                    this.suerDisabled = true
                }else if(this.accountV == '豪华版') {
                    this.suerDisabled = true
                }else{
                    this.dialogDisabled = true
                }
            },
            //取消激活模板接口
            disabledMyTemplate() {
                let params = { accountId: this.loginInfo.id, templateId: this.tempInfo.id };
                api.disabledMyTemplate(params).then(res => {
                    console.log(res);
                    this.tempInfo.status = 0;
                    this.open();
                });
            },
            //激活模板
            activateMyTemplate() {
                this.dialogDisabled = false;
                this.suerDisabled = false;
                let params = { accountId: this.loginInfo.id, templateId: this.tempInfo.id };
                api.activateMyTemplate(params).then(res => {
                    console.log(res);
                    // this.tempInfo.status = 1
                    this.open();
                    this.queryTemplateById()
                }).catch(err => {
                    console.log(err)
                });
            },
            getBannerIndex() {
                this.bannerIndex = this.$refs.carousel._data.activeIndex + 1
                // console.log(this.$refs.carousel._data.activeIndex)
            },
            queryTemplateById() {
                let params = { templateId: this.$route.query.id, accountId: this.loginInfo.id };
                api.queryTemplateById(params).then(res => {
                    console.log(res);
                    this.tempInfo = res
                });
            },
            queryTemplateFunctionsById() {
                let params = { templateId: this.$route.query.id };
                api.queryTemplateFunctionsById(params).then(res => {
                    // console.log(res);
                    this.tempFunc = res.rows
                    for(var i = 0;i < this.tempFunc.length;i++ ){
                        this.funcNum +=  Number(this.tempFunc[i].children.length)
                    }
                    console.log(this.$refs.func.clientHeight + this.$refs.name.clientHeight + this.funcNum * 38 + 1 + 24)
                    this.$refs.introduce.style.height = this.$refs.func.clientHeight + this.$refs.name.clientHeight + this.funcNum * 38 + 1 - 72 + 24 - 548 + 'px'
                });
            },
            queryTemplateBroadcastById() {
                let params = { templateId: this.$route.query.id };
                api.queryTemplateBroadcastById(params).then(res => {
                    // console.log(res);
                    this.banner = res
                });
            },
            goBack() {
                if(this.$route.query.urlAdd.indexOf("myTemp") != -1){
                    this.$router.push({path: '/templateMarketC/myTemp' })
                }else if(this.$route.query.urlAdd.indexOf("tempM")  != -1){
                    this.$router.push({path: '/templateMarketC/tempM' })
                }
            },
            open() {
                this.$message({
                    message: '操作成功',
                    type: 'success',
                });
            },
            handleClose(done) {

            }
        },
        watch: {

        }
    }
</script>

<style lang="scss">
    #tempDetail1{
        width: 100%;
        height: 100%;
        .el-dialog__header{
            padding: 0;
            i{
                display: none;
            }
        }
        .el-dialog__body{
            padding: 56px 32px 36px;
            line-height: 22px;
        }
        .temp_title{
            width: 100%;
            display: flex;
            align-items: center;
            .title{
                flex: 1;
                height: 92px;
                line-height: 92px;
                font-size: 20px;
                color: rgba(0,0,0,.85);
                text-indent: 32px;
                font-weight: 900;
            }
            .el-button{
                height: 32px;
                margin-right: 24px;
                width: 75px;
            }
        }
        .temp{
            height: calc(100% - 140px);
            height: -webkit-calc(100% - 140px);
            height: -moz-calc(100% - 140px);
            border: 24px solid #edf2f5;
            background: #edf2f5;;
            overflow: auto;
            display: flex;
            .tempIntroduce{
                width: 278px;
                .banner{
                    width: 278px;
                    height: 548px;
                    background: #fff;
                    margin-right: 24px;
                    position: relative;
                    .el-carousel{
                        .el-carousel__indicators{
                            display: none;
                        }
                        width: 278px;
                        img{
                            width: 100%;
                            height: 494px;
                        }
                    }
                    .el-carousel__arrow{
                        color: #000;
                        top: 95%;
                        width: 14px;
                        height: 14px;
                        border-radius: 0;
                        i{
                            background: #fff;
                            border: 1px dashed #d9d9d9;
                        }
                        &:nth-of-type(1){
                            left: 61px;
                        }
                        &:nth-of-type(2){
                            right: 61px;
                        }
                    }
                    .el-input{
                        width: 48px;
                        height: 22px;
                        .el-input__inner{
                            height: 22px;
                            text-align: center;
                        }
                    }
                    .bannerNum{
                        position: absolute;
                        bottom: 16px;
                        left: 91px;

                    }
                }
                .introduce{
                    border-top:24px solid #edf2f5;
                    padding: 24px 32px;
                    background: #fff;
                    overflow: auto;
                    min-height: 300px;
                    p{
                        color: rgba(0,0,0,0.65);
                        margin-top: 16px;
                        line-height: 22px;
                        &:nth-of-type(1){
                            line-height: 24px;
                            font-size: 16px;
                            color: rgba(0,0,0,0.85);
                            font-weight: 900;
                            margin-top: 0;
                        }
                    }
                }
            }
            .nameInfo{
                border-left: 24px solid #edf2f5;
                .name{
                    width: 818px;
                    height: 270px;
                    padding: 24px 32px;
                    background: #fff;
                    p{
                        color: rgba(0,0,0,0.85);
                        margin-top: 16px;
                        line-height: 22px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        span{
                            color: rgba(0,0,0,0.65);
                        }
                        &:nth-of-type(1){
                            line-height: 24px;
                            font-size: 16px;
                            font-weight: 900;
                            margin-top: 0;
                        }
                    }
                    .btns{
                        .el-button{
                            margin: 24px 0 0 0;
                            height: 32px;
                            width: 88px;
                            padding: 0;
                            &:hover, &:focus{
                                background: #fff;
                                border-color: #ebeef5;
                                color: #c0c4cc;
                            }
                            span{
                                line-height: 30px;
                            }
                        }
                        .el-button&#45;&#45;primary:hover, .el-button&#45;&#45;primary:focus{
                            background: rgba(24,204,192,1);
                            color: #fff;
                            border-color: #18ccc0;
                        }
                        .el-button&#45;&#45;danger{
                            background: rgba(245,34,45,1);
                            &:hover, &:focus{
                                background: rgba(245,34,45,1);
                                color: #fff;
                                border: 1px solid rgba(245,34,45,1);
                            }
                        }
                        span{
                            margin: 0 16px;
                        }
                    }
                }
            }
            .func{
                width: 818px;
                padding: 24px 32px 32px;
                margin-top: 24px;
                background: #fff;
                p{
                    line-height: 24px;
                    font-size: 16px;
                    color: rgba(0,0,0,0.85);
                    font-weight: 900;
                    margin: 0 0 16px;
                }
                dl{
                    display: flex;
                    align-items: center;
                    text-indent: 24px;
                    border-left: 1px solid rgba(217,217,217,1);
                    border-top: 1px solid rgba(217,217,217,1);
                    color: rgba(0,0,0,0.65);
                    &:nth-of-type(1){
                        border-top: 1px solid rgba(217,217,217,1);
                    }
                    &:last-child{
                        border-bottom: 1px solid rgba(217,217,217,1);
                    }
                    dt{
                        width: 214px;
                    }
                    div{
                        flex: 1;
                        border-right: 1px solid rgba(217,217,217,1);
                        dd{
                            height: 37px;
                            line-height: 37px;
                            border-bottom: 1px solid rgba(217,217,217,1);
                            border-left: 1px solid rgba(217,217,217,1);
                            &:last-child{
                                border-bottom: 0;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
-->
