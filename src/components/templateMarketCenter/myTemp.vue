<template>
    <div id="myTemp">
        <p class="title">我的模板</p>
        <div class="tempImg">
            <div class="addTemp" @click="toTempM">
                <img src="../../assets/images/add@2x.png" alt="">
                <p>添加新模板</p>
            </div>
            <div class="templist" v-for="(item, index) in tempList" :key="index">
                <img :src="item.coverUrl" alt="">
                <div class="bths">
                    <el-button disabled="" v-if="item.status==3">已经发布</el-button>
                    <el-button v-if="item.status==0" @click="activateTemp(item)" type="primary">激 活</el-button>
                    <el-button v-if="item.status==1" @click="disabledMyTemplate(item)" type="danger">取消激活</el-button>
                    <el-button v-if="" @click="toTempDetail(item)" id="checkDetail" type="primary">查看详情</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="" :visible.sync="dialogDisabled" width="433px" :before-close="handleClose">
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
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from '../../fetch/api.js'
export default {
    name: 'myTemp',
    data: function() {
        return {
            tempList: [],
            dialogDisabled: false,
            suerDisabled: false,
            item: '',
            accountV: ''
        }
    },
    created() {
        this.getAccountV()
        this.queryMyTemplatePage()
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
                if(res.free == 0){
                    this.accountV = '标准版'
                }else if(res.free == 1){
                    this.accountV = '高级版'
                }else if(res.free == 2){
                    this.accountV = '豪华版'
                }
            });
        },
        queryMyTemplatePage() {
            let params = {accountId: this.loginInfo.id, page: {} };
            api.queryMyTemplatePage(params).then(res => {
                console.log(res.rows);
                this.tempList = res.rows
            });
        },
        //激活模板函数
        activateTemp(item) {
            this.item = item;
            if(this.accountV == '标准版' && item.demand == '标准版'){
                this.suerDisabled = true
            }else if(this.accountV == '高级版' && item.demand == '标准版'){
                this.suerDisabled = true
            }else if(this.accountV == '高级版' && item.demand == '高级版') {
                this.suerDisabled = true
            }else if(this.accountV == '豪华版') {
                this.suerDisabled = true
            }else{
                this.dialogDisabled = true
            }
        },
        //取消激活模板接口
        disabledMyTemplate(item) {
            let params = { accountId: this.loginInfo.id, templateId: item.id };
            api.disabledMyTemplate(params).then(res => {
                console.log(res);
                item.status = 0;
                this.open();
            });
        },
        //激活模板
        activateMyTemplate() {
            this.dialogDisabled = false;
            this.suerDisabled = false;
            let params = { accountId: this.loginInfo.id, templateId: this.item.id };
            api.activateMyTemplate(params).then(res => {
                console.log(res);
                this.item.status = 1;
                this.open();
            }).catch(err => {
                console.log(err)
            });
        },
        toTempDetail(item) {
            this.$router.push({path: '/templateMarketC/tempDetail', query: { id: item.id, urlAdd: location.href} })
        },
        toTempM() {
            this.$router.push({path: '/templateMarketC/tempM'})
        },
        open() {
            this.$message({
                message: '操作成功',
                type: 'success',
            });
        },
        handleClose(done) {

        }
    }
}
</script>

<style lang="scss">
    #myTemp{
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
        .title{
            height: 92px;
            line-height: 92px;
            font-size: 20px;
            color: rgba(0,0,0,.85);
            text-indent: 32px;
            font-weight: 900;
        }
        .tempImg{
            height: calc(100% - 118px);
            height: -webkit-calc(100% - 118px);
            height: -moz-calc(100% - 118px);
            background: rgba(237,242,245,1);
            border-top: 24px solid rgba(237,242,245,1);
            border-left: 24px solid rgba(237,242,245,1);
            display: flex;
            flex-wrap: wrap;
            overflow: auto;
            .addTemp{
                width:273px;
                height:484.58px;
                background:rgba(250,250,250,1);
                box-shadow:0px 1px 4px 0px rgba(0,0,0,0.09);
                border-radius:2px;
                border:1px solid rgba(0,0,0,0.15);
                overflow: hidden;
                margin: 0 24px 24px 0;
                cursor: pointer;
                &:hover{
                    box-shadow: 0px 2px 9px 4px rgba(0,0,0,0.09);
                }
                img{
                    width: 24px;
                    height: 24px;
                    transition: all 0.6s;
                    margin: 207px 127px 14px;
                }
                p{
                    transition: all 0.6s;
                    color:rgba(0,0,0,0.65);
                    text-align: center;
                }
            }
            .templist{
                width:273px;
                height:484.58px;
                background:rgba(250,250,250,1);
                box-shadow:0px 1px 4px 0px rgba(0,0,0,0.09);
                border-radius:2px;
                margin: 0 24px 24px 0;
                overflow: hidden;
                &:hover{
                    box-shadow: 0px 2px 9px 4px rgba(0,0,0,0.09);
                    .bths{
                        transform: translate(0, -80px);
                    }
                }
                img{
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
                .bths{
                    width: 278px;
                    height: 80px;
                    background: rgba(0,0,0,0.72);
                    border-radius: 0px 0px 2px 2px;
                    transition: transform .75s;
                    #checkDetail{
                        margin: 0 47px 0 0;
                        span{

                        }
                    }
                    .el-button{
                        margin-top: 24px;
                        height: 32px;
                        width: 88px;
                        margin-left: 47px;
                        padding: 0;
                        &:hover, &:focus{
                            background: #fff;
                            border-color: #ebeef5;
                            color: #c0c4cc;
                        }
                        span{
                            line-height: 30px;
                            margin: 0;
                        }
                    }
                    .el-button--primary:hover, .el-button--primary:focus{
                        background: rgba(24,204,192,1);
                        border-color: #18ccc0;
                        color: #fff;
                    }
                    .el-button--danger{
                        background: rgba(245,34,45,1);
                        &:hover, &:focus{
                            background: rgba(245,34,45,1);
                            color: #fff;
                            border: 1px solid rgba(245,34,45,1);
                        }
                    }
                }
            }
        }
    }

</style>
