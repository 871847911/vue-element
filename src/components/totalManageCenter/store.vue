<template>
    <div id="global-manage">
        <div :class="showTips==false?'store-manage1':'store-manage'">
            <div class="tips_wrap"  v-if="showTips">
                <div class="top-tip">
                    <img src="../../assets/images/Shape@2x.png" alt="">
                    <p>你的账号使用期限还有{{account}}天,请尽快升级账号</p>
                    <i @click="tipsHide" class="el-icon-close"></i>
                </div>
            </div>
            <div class="about-store-manage">
                <div class="about-store">
                    <p class="title">门店列表</p>
                    <div class="add-store">
                        <p v-if="!haveStore" @click="toAddStore">添加</p>
                        <p v-if="haveStore">当前版本只能添加一个门店</p>
                    </div>
                    <div class="config-store" v-for="item in storeConfigInfo">
                        <div class="store-img">
                            <img :src="item.url" alt="">
                        </div>
                        <div class="config-store-detail">
                            <div class="time-config">
                                <p class="store_name">{{item.name}}</p>
                                <p>拥有技师：{{item.staffsize}}人</p>
                                <p>当前状态：{{item.status == 0 ? '已启用' : '未启用'}}</p>
                            </div>
                            <div class="people-config">
                                <p>营业时间：{{item.open_time}} - {{item.close_time}}</p>
                                <p>拥有服务：{{item.serversize}}项</p>
                                <p>配置时间：{{item.edit_time.time}}</p>
                            </div>
                        </div>
                        <div class="config" name="config" @click="toStoreCOnfig(item)">配置<img src="../../assets/images/left.png" alt=""></div>
                    </div>
                </div>
                <div class="renew">
                    <div class="store-name">
                        <p>丽人美业</p>
                        <p>标准版</p>
                    </div>
                    <div class="store-time">
                        <p>剩余{{account}}天</p>
                        <!--<p>服务热线123456789123</p>-->
                        <!--<el-button name="renew"  type="primary" @click="dialogVisible = true">续费/升级</el-button>-->
                        <div class="tip">
                            <img src="../../assets/images/Shape@2x.png" alt="">
                            <p>温馨提示！</p>
                        </div>
                        <p>如果您需要对当前账号进行续费或升级，请联系相关业务人员。</p>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="续费/升级申请" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <div class="renew-popout">
                <dl>
                    <dt>账号：</dt>
                    <dd>账号名</dd>
                </dl>
                <dl>
                    <dt>账号级别：</dt>
                    <dd>测试版</dd>
                </dl>
                <dl>
                    <dt>申请类型：</dt>
                    <dd>续费</dd>
                </dl>
                <dl>
                    <dt>申请时常：</dt>
                    <dd>1天</dd>
                </dl>
                <dl>
                    <dt>联系人：</dt>
                    <dd><input type="text" /></dd>
                </dl>
                <dl>
                    <dt>联系电话：</dt>
                    <dd><input type="text" pattern="[0-9]" /></dd>
                </dl>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureRenow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from '../../fetch/api';
    export default {
        name: "storeManage",
        data: function() {
            return {
                haveStore: true,
                account: '',
                storeConfigInfo: {},
                storeState: true,
                dialogVisible: false,
                showTips: false
            };
        },
        created() {
            this.getStoreConfigInfo();
            this.account = Math.ceil((this.loginInfo.validityTime.time - new Date()) / 3600 / 1000 / 24)
            if(sessionStorage.tips == 0){
                this.showTips = false
            }
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            tipsHide() {
                this.showTips = false
                sessionStorage.setItem('tips', 0)
            },
            getStoreConfigInfo() {
                let params = { accountId: this.loginInfo.id };
                api.queryStoreByAccountId(params).then(res => {
                    console.log(res)
                    if(JSON.stringify(res) == '[]'){
                        this.haveStore = false
                    }else{
                        if(this.account <= 15) {
                            this.showTips = true
                        }
                    }
                    this.storeConfigInfo = res;
                    for(var i = 0;i < this.storeConfigInfo.length; i++){
                        if(this.storeConfigInfo[i].edit_time.time){
                            this.storeConfigInfo[i].edit_time.time = new Date(this.storeConfigInfo[0].edit_time.time).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.storeConfigInfo[0].edit_time.time).toTimeString().substr(0, 8)
                        }
                    }
                });
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            sureRenow() {
                console.log('确定');
                this.dialogVisible = false
            },
            toStoreCOnfig(item) {
                this.$router.push({path: '/totalManageC/storeConfig', query: { id: item.storeId} })
            },
            toAddStore() {
                this.$router.push({path: '/totalManageC/addStore'})
            }
        },
        beforeRouteEnter (to, from, next){
            // console.log(from.path)
            if(from.path.indexOf('login')  != -1 ){
                // console.log('from login page')
                // location.reload();
            }
            next()
        },
    };
</script>

<style lang="scss">

    #global-manage{
        width: calc(100% - 48px);
        width: -moz-calc(100% - 48px);
        width: -webkit-calc(100% - 48px);
        height: calc(100% - 24px);
        height: -moz-calc(100% - 24px);
        height: -webkit-calc(100% - 24px);
        border: 24px solid rgba(237,242,245,1);
        border-top: 0;
        .store-manage1{
            height: 100%;
        }
        .store-manage {
            height: calc(100% - 42px);
            /*height: 100%;*/
        }
        .tips_wrap{
            border-top: 24px solid rgba(237,242,245,1);
        }
        .top-tip{
            display: flex;
            height: 40px;
            border:1px solid rgba(137,240,233,1);
            border-radius: 4px;
            color: rgba(0,0,0,0.65);
            background: rgba(230,255,253,1);
            align-items: center;
            img{
                width: 14px;
                height: 14px;
                margin: 0 8px 0 16px;
            }
            p{
                flex: 1;
            }
            i{
                margin-right: 18px;
            }
        }
        .about-store-manage{
            height: calc(100% - 24px);
            border-top: 24px solid rgba(237,242,245,1);
            display: flex;

            .about-store{
                flex: 1;
                margin: 0 32px;
                .title{
                    color: rgba(0, 0, 0, .75);
                    font-weight: 900;
                    line-height: 24px;
                    margin: 24px 0 0 0;
                    font-size: 16px;
                }
                .add-store{
                    display: flex;
                    .add{
                        width: 100px;
                        height: 30px;
                        background: #fff;
                        border: 1px solid #f00;
                        color: #f00;
                        border-radius: 5px;
                        margin-top: 10px;
                    }
                    p{
                        cursor: pointer;
                        margin-top: 28px;
                        width: 100%;
                        line-height: 32px;
                        color: rgba(0,0,0,.65);
                        text-align: center;
                        border-radius: 4px;
                        border: 1px dashed rgba(217,217,217,1);
                    }
                }
                .config-store{
                    display: flex;
                    padding: 24px 16px 15px;
                    align-items:  center;
                    border-bottom: 1px solid rgba(233,233,233,1);
                    .store-img{
                        width: 48px;
                        height: 48px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .config-store-detail{
                        flex: 1;
                        display: flex;
                        margin-left: 24px;
                        flex-direction: column;
                        p{
                            line-height: 22px;
                            color: rgba(0, 0, 0, .45);
                        }
                        .time-config{
                            display: flex;
                            p{
                                flex: 1;
                            }
                            .store_name{
                                color: rgba(0, 0, 0, .65);
                                font-weight: 900;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                        .people-config{
                            margin-top: 5px;
                            display: flex;
                            p{
                                display: block;
                                flex: 1;
                            }
                        }
                    }
                    .config{
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 14px;
                        color: #18CCC0;
                        background: #fff;
                        border: 0;
                        img{
                            width: 12px;
                            height: 12px;
                            margin: 1px 0 0 8px;
                        }
                        &:hover{
                            cursor: pointer
                        }
                    }
                }
            }
            .renew{
                border-left: 24px solid rgba(237,242,245,1);
                width: 267px;
                p{
                    text-align: left;
                }
                .store-name{
                    display: flex;
                    padding: 16px 24px 15px;
                    font-size: 16px;
                    height: 24px;
                    line-height: 24px;
                    font-weight: 900;
                    p{
                        &:nth-of-type(1){
                            flex: 1;
                        }
                    }
                    border-bottom: 1px solid #E9E9E9;
                }
                .store-time{
                    padding: 24px;
                    p{
                        line-height: 22px;
                        font-size: 14px;
                        color: rgba(0, 0, 0, .85);
                        &:nth-of-type(1){
                            margin-bottom: 16px;
                        }
                        &:nth-of-type(2){
                            margin-top: 8px;
                            color: rgba(0, 0, 0, .65);
                        }
                    }
                    .tip{
                        display: flex;
                        height: 22px;
                        align-items: center;
                        img{
                            width: 14px;
                            height: 14px;
                        }
                        p{
                            margin: 0;
                            margin-left: 8px;
                        }
                    }
                }
            }
        }
        .el-dialog{
            .el-dialog__header{
                background: #000;
                .el-dialog__title{
                    color: #fff;
                }
            }
            .el-dialog__body{
                padding: 10px 20px;
                .renew-popout{
                    display: flex;
                    flex-direction: column;
                    dl{
                        display: flex;
                        height: 45px;
                        line-height: 45px;
                        dt{
                            width: 35%;
                            text-align: right;
                        }
                        dd{
                            flex: 1;
                            text-align: left;
                            input{
                                height: 22px;
                                border-radius: 5px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
