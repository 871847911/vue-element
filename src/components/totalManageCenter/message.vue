<template>
    <div id="message">
        <div class="message_title">
            <p class="title">短信服务管理</p>
            <div class="bind_message">
                <el-button @click="dialogMessage = true" v-if="!messageNum.merchantBindingIdentity" type="primary">绑定账户信息</el-button>
                <div class="getUserInfo" v-if="messageNum.merchantBindingIdentity">
                    <p>{{messageNum.merchantBindingIdentity.enterpriseId}}</p>
                    <div class="change_msg" @click="dialogMessage = true">
                        <img src="../../assets/images/change_msg@2x.png" alt="">
                        <span>修改</span>
                    </div>
                </div>
                <div class="get_time">
                    <p>获取数据时间 {{messageNum.getDate == undefined ? new Date(new Date).toTimeString().substr(0, 8) : new Date(messageNum.getDate).toTimeString().substr(0, 8)}}</p>
                    <div class="reset" @click="reGetMessage"><p>刷新</p><img src="../../assets/images/Group_reset@2x.png" /> </div>
                </div>
            </div>
        </div>
        <div class="message_info">
            <div class="days_num">
                <p>今日发功成功量</p>
                <p><span>{{messageNum.sendCountByTodayBySuccess || 0}}</span>条</p>
                <p>今日发送总量<span>{{messageNum.sendCountByToday || 0}}条</span></p>
            </div>
            <div class="month_num">
                <p>本月发功成功量</p>
                <p><span>{{messageNum.sendCountByMonthBySuccess || 0}}</span>条</p>
                <p>本月发送总量<span>{{messageNum.sendCountByMonth || 0}}条</span></p>
            </div>
            <div class="residue_num">
                <p>短信剩余条数</p>
                <p><span>{{messageNum.remaining || 0}}</span>条</p>
                <p>提示：如需充值续费请登陆高速通短信服务平台进行充值。如充值失败，请致电0075-21057470高速通客服中心进行咨询。</p>
                <p>(短信服务平台链接：<a target="view_window" href="http://www.gaosutong.net/">http://www.gaosutong.net/</a>）</p>
            </div>
        </div>
        <div class="message_cont">
            <p>短信发送记录<span>(应短信服务商要求，发送记录仅保存三个月)</span></p>
            <el-table :data="messageList" min-height="550">
                <el-table-column type="index" :index="setIndex" width="80" label="序号"></el-table-column>
                <el-table-column prop="content" label="发送内容"></el-table-column>
                <el-table-column prop="phone" label="接收短信号码" width="130"></el-table-column>
                <el-table-column prop="maxTime" label="提交时间" width="150"></el-table-column>
                <el-table-column prop="state" label="回执状态" width="100"></el-table-column>
                <el-table-column prop="counts" label="条数" width="100"></el-table-column>
            </el-table>
            <el-pagination background style="margin-top: 0;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="prev, pager, next, sizes, jumper" :total="this.total"></el-pagination>
        </div>
        <el-dialog
            title="短信平台用户绑定" :visible.sync="dialogMessage" width="480px" :before-close="handleClose">
            <dl>
                <dt>企业ID：</dt>
                <dd><el-input v-model="enterpriseId" placeholder="请输入企业ID"></el-input></dd>
            </dl>
            <dl>
                <dt>账号：</dt>
                <dd><el-input v-model="userName" placeholder="请输入账号"></el-input></dd>
            </dl>
            <dl>
                <dt>密码：</dt>
                <dd><el-input type="password" v-model="password" placeholder="请输入密码"></el-input></dd>
            </dl>
            <p class="errMsg">
                {{errMsg}}
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="bindingIdentity">确认绑定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from '../../fetch/api.js'
    export default {
        name: "message",
        data: function() {
            return {
                dialogMessage: false,
                total: 10,
                currentPage: 1,
                pageSize: 10,
                messageNum: {},
                messageList: [],
                errMsg: '',
                userName: '',
                password: '',
                enterpriseId: '',
            }
        },
        created() {
            this.getMessageStatistics();
            this.getMessageList()
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getMessageList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getMessageList();
            },
            handleClose() {
                this.dialogMessage = false;
                this.errMsg = '';
            },
            // 绑定短信平台
            bindingIdentity() {
                let params = { userName: this.userName, password: this.password, enterpriseId: this.enterpriseId, merchantId: this.loginInfo.sellerId };
                api.bindingIdentity(params).then(res => {
                    console.log(res);
                    this.getMessageStatistics()
                    if(res.retcode == '-700'){
                        this.errMsg = '绑定信息验证失败，请重新输入！'
                    }else{
                        this.dialogMessage = false
                    }
                });
            },
            //发送短信数量统计
            getMessageStatistics() {
                let params = { merchantId: this.loginInfo.sellerId };
                api.getMessageStatistics(params).then(res => {
                    // console.log(res);
                    this.messageNum = res;
                    this.userName = res.merchantBindingIdentity.userName;
                    this.enterpriseId = res.merchantBindingIdentity.enterpriseId;
                });
            },
            //短信日志
            getMessageList() {
                let params = { pageSize: this.pageSize, pageNo: this.currentPage, merchantId: this.loginInfo.sellerId };
                api.getMessageList(params).then(res => {
                    console.log(res.list);
                    this.total = res.total;
                    this.messageList = res.list
                    for(var i = 0;i < this.messageList.length; i++) {
                        if(this.messageList[i].state == 200){
                            this.messageList[i].state = '发送成功'
                        }else{
                            this.messageList[i].state = '发送失败'
                        }
                        if(this.messageList[i].maxTime) {
                            this.messageList[i].maxTime = new Date(this.messageList[i].maxTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.messageList[i].maxTime).toTimeString().substr(0, 8)
                        }
                    }
                });
            },
            reGetMessage() {
                this.getMessageStatistics()
            },
            setIndex(index) {
                return (index + 1) + this.pageSize * (this.currentPage - 1);
            }
        }
    }
</script>

<style lang="scss">
    #message{
        width: 100%;
        height: 100%;
        .message_title{
            padding: 0 32px;
            border: 24px solid rgba(237,242,245,1);
            border-bottom: 0;
            .title{
                font-size: 18px;
                line-height: 18px;
                font-weight: 900;
                padding: 24px 0 16px;
            }
        }
        .bind_message{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0 24px;
            height: 32px;
            .getUserInfo{
                display: flex;
                align-items: center;
                p{
                    font-size: 16px;
                    line-height: 22px;
                }
                .change_msg{
                    cursor: pointer;
                    margin-left: 24px;
                    img{
                        width: 13px;
                        height: 13px;
                    }
                    span{
                        font-size: 16px;
                        line-height: 22px;
                        color: rgba(24,204,192,1);
                    }
                }
            }
            .get_time{
                display: flex;
                align-items: center;
                p{
                    color: rgba(0,0,0,0.65);
                    line-height: 22px;
                }
                .reset{
                    display: flex;
                    margin-left: 16px;
                    cursor: pointer;
                    align-items: center;
                    p{
                        color: rgba(24,204,192,1);
                    }
                    img{
                        width: 14px;
                        height: 14px;
                        margin-left: 8px;
                    }
                }
            }
        }
        .message_info{
            display: flex;
            border: 24px solid rgba(237,242,245,1);
            .days_num{
                width: calc(31% - 72px);
                border-right: 24px solid rgba(237,242,245,1);
                padding: 0 24px;
                p{
                    color: rgba(0,0,0,0.45);
                    &:nth-of-type(1){
                        margin-top: 20px;
                    }
                    &:nth-of-type(2){
                        line-height: 38px;
                        height: 38px;
                        padding: 4px 0 20px;
                        border-bottom: 1px solid rgba(232,232,232,1);
                        span{
                            font-size: 30px;
                            font-weight: 900;margin-right: 4px;
                            color: rgba(0,0,0,0.85);
                            font-family: HelveticaNeue;
                        }
                    }
                    &:nth-of-type(3){
                        margin-top: 9px;
                        span{
                            color: rgba(0,0,0,0.85);
                            margin-left: 8px;
                        }
                    }
                }
            }
            .month_num{
                width: calc(31% - 72px);
                border-right: 24px solid rgba(237,242,245,1);
                padding: 0 24px;
                p{
                    color: rgba(0,0,0,0.45);
                    &:nth-of-type(1){
                        margin-top: 20px;
                    }
                    &:nth-of-type(2){
                        line-height: 38px;
                        height: 38px;
                        padding: 4px 0 20px;
                        border-bottom: 1px solid rgba(232,232,232,1);
                        span{
                            font-size: 30px;
                            font-weight: 900;
                            margin-right: 4px;
                            color: rgba(0,0,0,0.85);
                            font-family: HelveticaNeue;
                        }
                    }
                    &:nth-of-type(3){
                        margin-top: 9px;
                        span{
                            color: rgba(0,0,0,0.85);
                            margin-left: 8px;
                        }
                    }
                }
            }
            .residue_num{
                flex: 1;
                margin: 0 24px;
                p{
                    color: rgba(0,0,0,0.45);
                    &:nth-of-type(1){
                        margin-top: 20px;
                    }
                    &:nth-of-type(2){
                        line-height: 38px;
                        height: 38px;
                        padding: 4px 0 20px;
                        border-bottom: 1px solid rgba(232,232,232,1);
                        span{
                            font-size: 30px;
                            font-weight: 900;
                            margin-right: 4px;
                            color: rgba(0,0,0,0.85);
                            font-family: HelveticaNeue;
                        }
                    }
                    &:nth-of-type(3){
                        margin: 12px 0 0;
                        line-height: 16px;
                        font-size: 12px;
                    }
                    &:nth-of-type(4){
                        height: 16px;
                        margin: 0 0 12px;
                        a{
                            line-height: 16px;
                            height: 16px;
                            font-size: 12px;
                            color: rgba(24,204,192,1);
                            text-decoration: none;
                        }
                    }
                }
            }
        }
        .message_cont{
            height: calc(100% - 384px);
            height: -webkit-calc(100% - 384px);
            height: -moz-calc(100% - 384px);
            border: 24px solid rgba(237,242,245,1);
            border-top: 0;
            overflow: auto;
            p{
                line-height: 24px;
                height: 24px;
                padding: 24px 32px 0;
                font-size: 16px;
                font-weight: 900;
                span{
                    color: rgba(0,0,0,0.65);
                    font-size: 14px;
                    display: inline-block;
                    height: 24px;
                }
            }
        }
        .el-table{
           /* height: calc(100% - 144px);
            height: -webkit-calc(100% - 144px);
            height: -moz-calc(100% - 144px);*/
            .el-table__row{
                .table_1_column_2{
                    .cell{
                        white-space: nowrap;
                    }
                }
            }
        }
        .el-dialog__header{
            padding: 16px 24px;
            .el-dialog__title{
                line-height: 24px;
                font-size: 16px;
                font-weight: 900;
            }
        }
        .el-dialog__body{
            padding: 32px 24px 0;
            border-top: 1px solid rgba(0,0,0,0.09);
            border-bottom: 1px solid rgba(0,0,0,0.09);
            dl{
                display: flex;
                align-items: center;
                margin-bottom: 24px;
                &:nth-of-type(3){
                    margin-bottom: 0;
                }
                dt{
                    text-align: right;
                    width: 60px;
                }
                dd{
                    flex: 1;
                }
            }
            .errMsg{
                color: rgba(245,34,45,1);
                line-height: 22px;
                height: 22px;
                text-align: center;
                margin-top: 10px;
            }
        }
        .el-dialog__footer{
            padding: 20px 24px;
        }
    }
    .el-pagination{
        padding: 0;
        float: right;
        margin: 0 32px 32px 0;
    }
</style>
