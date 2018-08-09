<template>
    <div id="userInfo">
        <p class="title">用户信息</p>
        <div class="choose">
            <div class="name-search">
                <p>微信昵称：</p>
                <el-input v-model="userName" placeholder="请输入微信昵称"></el-input>
            </div>
            <div class="tel">
                <p>手机号码：</p>
                <el-input v-model="userTel" placeholder="请输入手机号码"></el-input>
            </div>
            <div class="search-time">
                <p>时间范围：</p>
                <el-date-picker
                    v-model="timeValue"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="起始时间"
                    end-placeholder="结束时间">
                </el-date-picker>
                <el-button type="primary" @click="searchUser">搜索</el-button>
            </div>
        </div>
        <div class="cont">
            <el-table :data="userInfo" min-height="550">
                <el-table-column prop="nickName" label="微信昵称"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
                <el-table-column prop="visitTime" :formatter="formatTime" label="最近访问时间"></el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="prev, pager, next, sizes, jumper" :total="this.total"></el-pagination>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import api from "../../fetch/api.js"
    export default {
        name: 'apply',
        data: function() {
            return {
                userName: '',
                userTel: '',
                timeValue: [new Date() - 3600 * 1000 * 24 * 30,  new Date()],
                userInfo: [],
                startTime: '',
                endTime: '',
                total: 10,
                currentPage: 1,
                pageSize: 10,
            }
        },
        created() {
            this.startTime = new Date(this.timeValue[0]).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.timeValue[0]).toTimeString().substr(0, 8)
            this.endTime = new Date(this.timeValue[1]).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.timeValue[1]).toTimeString().substr(0, 8)
            this.queryUserPage()
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            formatTime(val) {
                return new Date(val.visitTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(val.visitTime).toTimeString().substr(0, 8)
            },
            searchUser(){
                if( this.timeValue != null){
                    this.startTime = new Date(this.timeValue[0]).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.timeValue[0]).toTimeString().substr(0, 8)
                    this.endTime = new Date(this.timeValue[1]).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.timeValue[1]).toTimeString().substr(0, 8)
                }else{
                    this.startTime = null
                    this.endTime = null
                }
                if(this.userTel != ''){
                    this.isPhoneNum(this.userTel)
                }else if(this.userTel == ''){
                    this.queryUserPage()
                }
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.queryUserPage()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.queryUserPage()
            },
            queryUserPage() {
                let params = { sellerId: this.loginInfo.sellerId, nickName: this.userName, phone: this.userTel.toString(), startTime: this.startTime, endTime: this.endTime, pageno: this.currentPage, pagesize: this.pageSize};
                api.queryUserPage(params).then(res => {
                    console.log(res.rows);
                    this.userInfo = res.rows;
                    this.total = res.total;
                });
            },
            //手机号正则
            isPhoneNum(str) {
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(str)) {
                    this.openErr()
                } else {
                    this.queryUserPage()
                }
            },
            openErr() {
                this.$message.error('请输入正确的手机号');
            }
        }
    }
</script>

<style lang="scss">

    #userInfo{
        width: calc(100% - 48px);
        width: -webkit-calc(100% - 48px);
        width: -moz-calc(100% - 48px);
        height: calc(100% - 48px);
        height: -webkit-calc(100% - 48px);
        height: -moz-calc(100% - 48px);
        border: 24px solid #edf2f5;
        overflow: auto;
        .title{
            height: 66px;
            line-height: 66px;
            font-size: 18px;
            color: rgba(0,0,0,.85);
            text-indent: 32px;
            font-weight: 900;
            flex: 1;
        }
        .cont{
            /*height: calc(100% - 170px);
            height: -webkit-calc(100% - 170px);
            height: -moz-calc(100% - 170px);
            border: 24px solid #edf2f5;
            border-top: 0;
            overflow: auto;*/
        }
        .choose {
            display: flex;
            padding: 0 32px 24px;
            .name-search {
                display: flex;
                align-items: center;
                p {
                    width: 70px;
                }
                .el-input{
                    width: 136px;
                    .el-input__inner{
                        width: 136px;
                    }
                }
            }
            .tel {
                margin-left: 20px;
                display: flex;
                align-items: center;
                p {
                    display: block;
                    width: 70px;
                }
                .el-input{
                    width: 136px;
                    .el-input__inner{
                        width: 136px;
                    }
                }
            }
            .search-time{
                margin-left: 20px;
                display: flex;
                align-items: center;
                p{
                    width: 70px;
                }
                .el-button{
                    margin-left: 16px;
                }
                .el-range-editor{
                    width: 372px;
                }
            }
        }
        .el-pagination{
            padding: 0;
            float: right;
            margin: 0 32px 32px 0;
        }
    }
</style>
