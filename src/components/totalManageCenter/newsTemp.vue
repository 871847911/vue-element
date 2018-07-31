<template>
    <div id="newsTemp">
        <p class="title">消息模板</p>
        <div class="container">
            <p>预约订单消息</p>
            <el-table :data="tableData1" min-height="550">
                <el-table-column prop="tempName" label="触发场景"></el-table-column>
                <el-table-column prop="tempId" label="模板ID"></el-table-column>
                <el-table-column prop="zip" label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="compile" type="text" size="small">操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <p>优惠券消息</p>
            <el-table :data="tableData2" min-height="550">
                <el-table-column prop="tempName" label="触发场景"></el-table-column>
                <el-table-column prop="tempId" label="模板ID"></el-table-column>
                <el-table-column prop="zip" label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="compile" type="text" size="small">操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                tableData1: [
                    {
                        tempName: '预约到期通知',
                        tempId: '请填写模板ID'
                    },
                    {
                        tempName: '预约取消通知',
                        tempId: '请填写模板ID'
                    }
                ],
                tableData2: [
                    {
                        tempName: '卡券到期通知',
                        tempId: '请填写模板ID'
                    }
                ]
            }
        },
        methods: {
            compile() {
                console.log('bianji')
            }
        }
    }
</script>

<style lang="scss">

    #newsTemp{
        width: 100%;
        height: 100%;
        .title{
            height: 92px;
            line-height: 92px;
            font-size: 20px;
            color: rgba(0,0,0,.85);
            text-indent: 32px;
            font-weight: 900;
        }
        .container{
            height: calc(100% - 140px);
            height: -webkit-calc(100% - 140px);
            height: -moz-calc(100% - 140px);
            border: 24px solid #edf2f5;
            p{
                line-height: 22px;
                font-size: 16px;
                font-weight: 900;
                margin-top: 24px;
                color: rgba(0,0,0,.85);
                text-indent: 32px;
                &:nth-of-type(2){
                    margin-top: 32px;
                }
            }
            .el-table{
                margin: 16px 32px 0;
                height: auto;
            }
        }
    }
</style>
