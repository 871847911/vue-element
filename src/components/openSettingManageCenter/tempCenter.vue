<template>
    <div id="temp-market">
        <div class="kind-choose">
            <div class="search-temp">
                <el-input v-model="tempName" placeholder="请输入" maxlength="20" />
                <el-button type="primary" @click="checktTemp">搜索</el-button>
            </div>
            <div class="kind">
                <p>版本：</p>
                <div class="style_kind" @change="queryTemplatePage">
                    <el-radio v-model="kindRadio" label="" border size="small">全部</el-radio>
                    <el-radio v-model="kindRadio" label="标准版" border size="small">标准版</el-radio>
                    <el-radio v-model="kindRadio" label="高级版" border size="small">高级版</el-radio>
                    <el-radio v-model="kindRadio" label="豪华版" border size="small">豪华版</el-radio>
                </div>
            </div>
            <div class="temp_style">
                <p>风格：</p>
                <div class="style_kind" @change="queryTemplatePage">
                    <el-radio v-model="styleRadio" label="" border size="small">全部</el-radio>
                    <el-radio v-model="styleRadio" label="简约" border size="small">简约</el-radio>
                    <el-radio v-model="styleRadio" label="黑白" border size="small">黑白</el-radio>
                    <el-radio v-model="styleRadio" label="可爱" border size="small">可爱</el-radio>
                    <el-radio v-model="styleRadio" label="古风" border size="small">古风</el-radio>
                </div>
            </div>
            <div class="vocation">
                <p>行业：</p>
                <el-select v-model="tempV" placeholder="全部" @change="queryTemplatePage">
                    <el-option
                        v-for="(item, index) in options"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="cont">
            <div class="temp_list" v-for="(item, index) in tempList" :key="index">
                <div class="temp">
                    <p class="temp_name">{{item.name}}</p>
                    <div class="temp_img">
                        <img :src="item.coverUrl" alt="">
                        <div class="bths">
                            <el-button @click="toTempDetail(item)" type="">查看详情</el-button>
                            <el-button @click="useTemp(item)" type="primary">使用</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="hasBindProject" width="433px" :before-close="handleClose">
            <span>绑定小程序后才可以使用模板。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hasBindProject = false">取 消</el-button>
                <el-button type="primary" @click="ToBindProject">前去绑定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="hasAuditProject" width="433px" :before-close="handleClose">
            <span>当前有正在审核中的模板，请审核完成后在使用其他小程序模板。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toTempDetail(item)">查看详情</el-button>
                <el-button type="primary" @click="hasAuditProject = false">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="auditAccountV" width="433px" :before-close="handleClose">
            <span>您选择的【{{item.name}}】模板属于{{item.demand}}账号，请升级账号后再使用。</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="auditAccountV = false">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="submitAudit" width="433px" :before-close="handleClose">
            <span>您确定要使用【{{item.name}}】模板吗？该操作会将模板提交到微信平台进行审核。</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="" @click="submitAudit = false">取 消</el-button>
                <el-button type="primary" @click="activateMyTemplate">提交审核</el-button>
            </span>
        </el-dialog>
        <!--<el-dialog title="" :visible.sync="dialogDisabled" width="433px" :before-close="handleClose">
            <span>该模板属于{{item.demand}}，您可以正常激活，但若要使用请升级账号，如升级账号请联系相关业务人员。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDisabled = false">取 消</el-button>
                <el-button type="primary" @click="suerDisabled = true">激 活</el-button>
            </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="suerDisabled" width="433px" :before-close="handleClose">
            <span>模板启用前，请确认好模板可用的功能，确定要继续启用么</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="suerDisabled = false, dialogDisabled = false">取 消</el-button>
                <el-button type="primary" @click="activateMyTemplate">确 定</el-button>
            </span>
        </el-dialog>-->
    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex";
    import api from '../../fetch/api.js'
    import store from "@/store/index";
export default {
    name: 'templateMarket',
    data: function() {
        return {
            SearchInput: '',
            kindRadio: '',
            styleRadio: '',
            value: '',
            tempName: '',
            tempV: '',
            tempList: [],
            dialogDisabled: false,
            suerDisabled: false,
            item: '',
            hasBindProject: false,
            appId: '',
            hasAuditProject: false,
            auditStatus: '',
            auditAccountV: false,
            submitAudit: false,
            accountV: '',
            options: [{
                value: '美甲',
                label: '美甲'
            }, {
                value: '美发',
                label: '美发'
            }, {
                value: '纹身',
                label: '纹身'
            }, {
                value: '定妆',
                label: '定妆'
            }, {
                value: '按摩',
                label: '按摩'
            },{
                value: '汗蒸',
                label: '汗蒸'
            },{
                value: '足浴',
                label: '足浴'
            }],
        }
    },
    created() {
        this.queryTemplatePage()
        this.getAccountV()
        this.hasBindPro()
        this.hasAuditPro()
    },
    computed: {
        ...mapGetters({
            loginInfo: "getLoginInfo"
        })
    },
    methods: {
        ...mapActions(["changeMenuIndex", "changeTitle"]),
        getAccountV() {
            let params = { id: this.loginInfo.id };
            api.queryAccountById(params).then(res => {
                console.log(res)
                if(res.free == 0){
                    this.accountV = '标准版'
                }else if(res.free == 1){
                    this.accountV = '高级版'
                }else if(res.free == 2){
                    this.accountV = '豪华版'
                }
            });
        },
        useTemp(item) {
            this.item = item;
            if(this.appId == null) {
                this.hasBindProject = true
            }else if(this.auditStatus == 2) {
                this.hasAuditProject = true
            }else if(this.accountV == '标准版' && item.demand == '高级版'){
                this.auditAccountV = true
            }else if(this.accountV == '标准版' && item.demand == '豪华版'){
                this.auditAccountV = true
            }else if(this.accountV == '高级版' && item.demand == '豪华版'){
                this.auditAccountV = true
            }else{
                this.submitAudit = true
            }
        },
        //提交审核
        commitAudit() {
        	let params = {user_version: 1, user_desc: 1, accountId: this.loginInfo.id};
            api.testUpload(params).then(res => {
                console.log(res)
            });
        },
        ToBindProject() {
            this.$router.push({path: '/openSettingC/miniProgramBind' })
            store.dispatch("changeMenuIndex", "0");
        },
        checktTemp() {
            this.queryTemplatePage()
        },
        //激活模板函数
        activateTemp(item) {
            this.item = item;
            if(this.accountV == '标准版' && item.demand == '标准版'){

            }else if(this.accountV == '高级版' && item.demand == '标准版'){

            }else if(this.accountV == '高级版' && item.demand == '高级版') {

            }else if(this.accountV == '豪华版') {

            }
        },
        //取消激活模板接口
        /*disabledMyTemplate(item) {
            let params = { accountId: this.loginInfo.id, templateId: item.id };
            api.disabledMyTemplate(params).then(res => {
                // console.log(res);
                item.status = 0;
                this.open();
            });
        },*/
        //激活模板
        activateMyTemplate() {
            let params = { accountId: this.loginInfo.id, templateId: this.item.id };
            api.activateMyTemplate(params).then(res => {
                this.commitAudit()
            })
        },
        //查模板
        queryTemplatePage() {
            let params = { accountId: this.loginInfo.id,page: {}, template: { name: this.tempName, industry: this.tempV, style: this.styleRadio, demand: this.kindRadio} };
            api.queryTemplatePage(params).then(res => {
                console.log(res.rows);
                this.tempList = res.rows
            });
        },
        //是否已绑定小程序
        hasBindPro() {
            let params = { sellerId: this.loginInfo.sellerId };
            api.querySellerById(params).then(res => {
                // console.log(res)
                this.appId = res.appId
            });
        },
        //是否有正在审核小程序
        hasAuditPro() {
            let params = { accountId: this.loginInfo.id };
            api.getLatestAuditstatus(params).then(res => {
                this.auditStatus = res.status
            });
        },
        toTempDetail(item) {
            this.$router.push({path: '/openSettingC/tempDetail', query: { id: item.id} })
            // this.$router.push({name: 'tempDetail', query: { id: item.id, urlAdd: location.href} })
            store.dispatch("changeTitle", "模板详情");
        },
        open() {
            this.$message({
                message: '改模板已提交审核',
                type: 'success',
            });
        },
        handleClose(done) {

        }
    }
}
</script>

<style lang="scss">

    #temp-market{
        width: 100%;
        height: 100%;
        background: transparent;
        .el-dialog__header{
            padding: 24px 0 0 24px;
            .el-dialog__title{
                height: 18px;
                font-size: 18px;
                line-height: 18px;
                font-weight: 900;
            }
            i{
                display: none;
            }
        }
        .el-dialog__body{
            padding: 40px 32px 40px;
            line-height: 22px;
        }
        .el-dialog__footer{
            .el-button{
                padding: 8px 20px;
                &:hover{
                    color: #18CCC0;
                    border: 1px solid #18CCC0;
                    background: #fff;
                }
            }
            .el-button--primary{
                &:hover{
                    border-color: #18CCC0;
                    background: #18CCC0;
                    color: #fff;
                }
            }
        }
        .kind-choose{
            padding: 0 32px;
            background: #fff;
            .title{
                font-size: 20px;
                color: rgba(0,0,0,0.85);
                line-height: 28px;
                font-weight: 900;
                margin:0 0 16px 0;
                padding-top: 32px;
            }
            .search-temp{
                display: flex;
                justify-content: center;
                .el-input{
                    width: 482px;
                    .el-input__inner{
                        border-radius: 4px 0 0 4px;
                    }
                }
                .el-button{
                    border-radius: 0 4px 4px 0;
                    padding: 8px 20px;
                }
            }
            .kind{
                display: flex;
                margin: 24px 0 16px;
                .style_kind{
                    .el-radio{
                        border: 0;
                        height: 22px;
                        margin-left: 24px;
                        padding: 0 8px;
                        &:nth-of-type(1){
                            margin-left: 16px;
                        }
                        .el-radio__input{
                            .el-radio__inner{
                                display: none;
                            }
                        }
                        .el-radio__label{
                            padding: 0;
                            font-size: 14px;
                            line-height: 22px;
                            width: 100%;
                            display: inline-block;
                            text-align: center;
                            color: rgba(0,0,0,0.65)
                        }
                    }
                    .is-checked{
                        background: #18CCC0;
                        .el-radio__label{
                            color: #fff;
                        }
                    }
                }

            }
            .temp_style{
                display: flex;
                align-items: center;
                p{
                    width: 42px;
                }
                .style_kind{
                    .el-radio{
                        border: 0;
                        padding: 0;
                        height: 22px;
                        margin-left: 24px;
                        width: 44px;
                        &:nth-of-type(1){
                            margin-left: 16px;
                        }
                        .el-radio__input{
                            .el-radio__inner{
                                display: none;
                            }
                        }
                        .el-radio__label{
                            padding: 0;
                            font-size: 14px;
                            line-height: 22px;
                            width: 100%;
                            display: inline-block;
                            text-align: center;
                            color: rgba(0,0,0,0.65)
                        }
                    }
                    .is-checked{
                        background: #18CCC0;
                        .el-radio__label{
                            color: #fff;
                        }
                    }
                }
            }
            .vocation{
                height: 32px;
                display: flex;
                align-items: center;
                padding: 16px 0 24px;
                p{
                    width: 42px;
                }
                .el-select{
                    margin-left: 16px;
                }
            }
        }
        .cont{
            .temp_list{
                height: 100%;
                /*overflow: auto;*/
                display: flex;
                flex-wrap: wrap;
                /*width: 1184px;*/
                background: #edf2f5;
                overflow: auto;
                .temp{
                    width:273px;
                    height:514.58px;
                    background: transparent;
                    border-radius: 2px;
                    margin: 24px 24px 0 0;
                    &:hover{
                        .bths{
                            transform: translate(0, -80px);
                        }
                    }
                    .temp_name{
                        height: 22px;
                        line-height: 22px;
                        margin-bottom: 8px;
                        text-align: center;
                        font-size: 16px;
                    }
                    .temp_img{
                        width: 273px;
                        height: 484.58px;
                        overflow: hidden;
                        box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.09);
                        &:hover{
                            box-shadow: 0px 2px 9px 4px rgba(0,0,0,0.09);
                        }
                        img{
                            width: 100%;
                            height:484.58px;
                            cursor: pointer;
                        }
                    }
                    .bths{
                        width: 278px;
                        height: 80px;
                        background: rgba(0,0,0,0.72);
                        border-radius: 0px 0px 2px 2px;
                        transition: transform .75s;
                        .el-button{
                            margin-top: 24px;
                            height: 32px;
                            width: 88px;
                            margin-left: 47px;
                            padding: 0;
                            color: rgba(24,204,192,1);
                            border-color: rgba(24,204,192,1);
                            background: transparent;
                            &:nth-of-type(2) {
                                margin-left: 0;
                            }
                            &:hover, &:focus{
                                color: rgba(108,216,209,1);
                                border-color: rgba(108,216,209,1);
                                background: transparent;
                            }
                            span{
                                line-height: 30px;
                                margin: 0;
                            }
                        }
                        .el-button--primary{
                            background: rgba(24,204,192,1);
                            border-color: #18ccc0;
                            color: #fff;
                        }
                        .el-button--primary:hover, .el-button--primary:focus{
                            background: #74E0D9;
                            border-color: #74E0D9;
                            color: #fff;
                            /*background: rgba(24,204,192,1);
                            border-color: #18ccc0;
                            color: #fff;*/
                        }
                    }
                }
            }
        }
    }
</style>
