<template>
    <div id="booking-order">
        <p class="title">预约订单</p>
        <div class="choose-booking">
            <div class="booking">
                <p>门店选择：</p>
                <el-select v-model="storeChoose" placeholder="全部">
                    <el-option
                        v-for="(item, index) in storeList"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search-tel">
                <p>手机号码：</p>
                <el-input v-model="searchTel" placeholder="请输入手机号码"></el-input>
            </div>
            <div class="search-time">
                <p>时间范围</p>
                <el-date-picker
                    v-model="timeValue"
                    type="datetimerange"
                    @change="getTime"
                    range-separator="至"
                    start-placeholder="起始时间"
                    end-placeholder="结束时间">
                </el-date-picker>
                <el-button type="primary" @click="searchOrder">搜索</el-button>
            </div>
        </div>
        <el-radio-group v-model="radio" @change="chooseStatus">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="待服务"></el-radio-button>
            <el-radio-button label="已完成"></el-radio-button>
            <el-radio-button label="店家取消"></el-radio-button>
            <el-radio-button label="客户取消"></el-radio-button>
        </el-radio-group>
        <div class="cont">
            <el-table :data="tableData" min-height="550">
                <el-table-column prop="serialNum" label="订单号" width="120"></el-table-column>
                <el-table-column prop="userName" label="客户姓名" width="80"></el-table-column>
                <el-table-column prop="phone" label="预留手机号" width="110"></el-table-column>
                <el-table-column prop="customerNumber" label="预约人数" width="80"></el-table-column>
                <el-table-column prop="staffName" label="预约技师" width="100"></el-table-column>
                <el-table-column prop="serverName" label="预约服务" width="100"></el-table-column>
                <el-table-column prop="startTime" label="预约时间"></el-table-column>
                <el-table-column prop="modifyStartTime" label="修改时间" ></el-table-column>
                <el-table-column prop="status" label="订单状态"  width="80"></el-table-column>
                <el-table-column prop="isAcceptStaffs" label="是否接受非指定技师服务"  width="110"></el-table-column>
                <el-table-column prop="zip" label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="changeOrder(scope.row)" type="text" v-if="scope.row.status=='待服务'?true:false" size="small">修改预约</el-button>
                        <el-button @click.native.prevent="changeState(scope.row)" type="text" v-if="scope.row.status=='待服务'?true:false" size="small">变更状态</el-button>
                        <el-button @click.native.prevent="checkReason(scope.row)" type="text" v-if="scope.row.status=='店家取消'?true:false" size="small">查看原因</el-button>
                        <el-button @click.native.prevent="checkReason(scope.row)" type="text" v-if="scope.row.status=='客户取消'?true:false" size="small">查看原因</el-button>
                        <el-button type="text" v-if="scope.row.status=='已完成'?true:false" size="small">/</el-button>
                    </template>

                </el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="prev, pager, next, sizes, jumper" :total="this.total"></el-pagination>
        </div>
        <el-dialog title="修改预约" :visible.sync="dialogOrder" width="480px" :before-close="handleClose">
            <div class="renew-popout">
                <dl>
                    <dt>订单状态：</dt>
                    <dd>{{itemOrder.status}}</dd>
                </dl>
                <dl>
                    <dt>订单编号：</dt>
                    <dd>{{itemOrder.serialNum}}</dd>
                </dl>
                <dl>
                    <dt>客户姓名：</dt>
                    <dd>{{itemOrder.userName}}</dd>
                </dl>
                <dl>
                    <dt>手机号码：</dt>
                    <dd>{{itemOrder.phone}}</dd>
                </dl>
                <dl>
                    <dt>预约技师：</dt>
                    <dd>
                        <el-select v-model="staffChoose" placeholder="请选择">
                            <el-option v-for="(item, index) in staffList" :key="item.index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </dd>
                </dl>
                <dl>
                    <dt>预约服务：</dt>
                    <dd>
                        <el-select v-model="serverChoose" placeholder="请选择">
                            <el-option v-for="(item, index) in serverList" :key="item.index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </dd>
                </dl>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogOrder = false">取 消</el-button>
                <el-button type="primary" @click="orderSure">保 存</el-button>
            </span>
        </el-dialog>
        <el-dialog title="变更状态" :visible.sync="dialogState" width="480px" :before-close="handleClose">
            <div class="renew-popout">
                <dl>
                    <dt>订单状态：</dt>
                    <dd>{{itemOrder.status}}</dd>
                </dl>
                <dl>
                    <dt>订单编号：</dt>
                    <dd>{{itemOrder.serialNum}}</dd>
                </dl>
                <dl>
                    <dt>客户姓名：</dt>
                    <dd>{{itemOrder.userName}}</dd>
                </dl>
                <dl>
                    <dt>手机号码：</dt>
                    <dd>{{itemOrder.phone}}</dd>
                </dl>
                <dl style="height: 22px;">
                    <dt>预约技师：</dt>
                    <dd style="text-indent: 20px">{{itemOrder.staffName}}</dd>
                </dl>
                <dl style="height: 22px;">
                    <dt>预约服务：</dt>
                    <dd style="text-indent: 20px">{{itemOrder.serverName}}</dd>
                </dl>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button style="float: left" @click="cancelBooking">取消订单</el-button>
                <el-button @click="dialogState = false">取 消</el-button>
                <el-button type="primary" @click="stateSure">完成服务</el-button>
            </span>
        </el-dialog>
        <el-dialog title="取消原因" :visible.sync="dialogCancelReason" width="480px" :before-close="handleClose">
            <div class="renew-popout">
                <el-input autofocus onfocus="if (value =='请填写取消原因'){value ='';this.style.color='rgba(0,0,0,.65)'}" onblur="if (value ==''){this.value ='请填写取消原因';this.style.color='#f66';}" type="textarea" rows = '7' placeholder="请填写取消原因" v-model="textarea"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCancelReason = false, cancelReason = false, textarea = ''">取 消</el-button>
                <el-button type="primary" @click="sureReason">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="查看原因" :visible.sync="dialogcheckReason" width="480px" :before-close="handleClose">
            <div class="cancel-popout">
                <div class="cancel-p">
                    <p>取消人:</p>
                    <p>{{itemOrder.status == '店家取消' ? '商家' : '客户'}}</p>
                </div>
                <p class="reason_detail">{{itemOrder.cancelReason}}</p>
            </div>
            <!--<span slot="footer" class="dialog-footer">
                <el-button @click="dialogcheckReason = false">关 闭</el-button>
            </span>-->
        </el-dialog>
    </div>
</template>

<script>
    import api from "../../fetch/api";
    import { mapGetters } from "vuex";
    export default {
        name: 'reservation',
        data() {
            return {
                searchTel: '',
                storeChoose: '',
                dialogOrder: false,
                dialogState: false,
                dialogCancelReason: false,
                dialogcheckReason: false,
                textarea: '',
                timeValue: [new Date() - 3600 * 1000 * 24 * 30,  new Date()],
                radio: '全部',
                tableData: [],
                startTime: '',
                endTime: '',
                total: 10,
                pageSize: 10,
                currentPage: 1,
                status: '',
                itemOrder: {},
                serverChoose: '',
                staffChoose: '',
                serverChooseName: '',
                staffChooseName: '',
                staffList: [],
                serverList: []
            }
        },
        created() {
            this.startTime = this.timeValue[0]
            this.endTime = this.timeValue[1]
            this.chooseStatus();
        },
        computed: {
            ...mapGetters({
                storeList: "getStoreList",
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            changeStatus() {
                console.log(this.radio)
            },
            chooseStatus() {
                if(this.radio == '待服务'){
                    this.status = 0
                }else if(this.radio == '已完成'){
                    this.status = 1
                }else if(this.radio == '客户取消'){
                    this.status = 2
                }else if(this.radio == '店家取消'){
                    this.status = 3
                }else{
                    this.status = ''
                }
                this.queryAppointmentPage()
            },
            searchOrder(){
                if( this.timeValue != null){
                    this.startTime = this.timeValue[0]
                    this.endTime = this.timeValue[1]
                }else{
                    this.startTime = ''
                    this.endTime = ''
                }
                if(this.searchTel != ''){
                    this.isPhoneNum(this.searchTel)
                }else if(this.searchTel == ''){
                    this.queryAppointmentPage()
                }
            },
            queryAppointmentPage() {
                let params = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    orderAppointment: {
                        sellerId: this.loginInfo.sellerId,
                        storeId: this.storeChoose,
                        status: this.status,
                        phone: this.searchTel,
                    },
                    page: {
                        pageNo: this.currentPage,
                        pageSize: this.pageSize,
                    }
                };
                api.queryAppointmentPage(params).then(res => {
                    console.log(res.rows);
                    this.tableData = res.rows;
                    this.total = res.total;
                    for(var i = 0;i < this.tableData.length;i++ ){
                        if(this.tableData[i].startTime) {
                            this.tableData[i].startTime = new Date(this.tableData[i].startTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.tableData[i].startTime).toTimeString().substr(0, 5) + '-' + new Date(this.tableData[i].startTime + 3600000 ).toTimeString().substr(0, 5)
                        }
                        if(this.tableData[i].modifyStartTime) {
                            this.tableData[i].modifyStartTime = new Date(this.tableData[i].modifyStartTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(this.tableData[i].modifyStartTime).toTimeString().substr(0, 8)
                        }
                        if(this.tableData[i].status == 0){
                            this.tableData[i].status = '待服务'
                        }else if(this.tableData[i].status == 1){
                            this.tableData[i].status = '已完成'
                        }else if(this.tableData[i].status == 2){
                            this.tableData[i].status = '客户取消'
                        }else if(this.tableData[i].status == 3){
                            this.tableData[i].status = '店家取消'
                        }

                        if(this.tableData[i].isAcceptStaffs == 0){
                            this.tableData[i].isAcceptStaffs = '不接受'
                        }else{
                            this.tableData[i].isAcceptStaffs = '接受'
                        }
                    }
                });
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.queryAppointmentPage()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.queryAppointmentPage()
            },
            getTime() {
                console.log(this.timeValue)
            },
            changeOrder(row) {
                this.itemOrder = row;
                this.dialogOrder = true;
                this.queryStaffPage();
                this.queryServerPage();
            },
            changeState(row) {
                this.itemOrder = row;
                this.dialogState = true
            },
            checkReason(row) {
                this.itemOrder = row;
                this.dialogcheckReason = true
            },
            handleClose(done) {
                this.dialogOrder = false;
                this.dialogState = false;
                this.dialogCancelReason = false;
                this.dialogcheckReason = false;
            },
            // 预约修改
            orderSure() {
                this.dialogOrder = false
                this.updateOrderAppointment()
            },
            // 变更状态
            stateSure() {
                this.dialogState = false;
                this.finishServer()
            },
            // 取消订单
            cancelBooking() {
                this.dialogCancelReason = true
                this.dialogState = false
            },
            // 确认取消订单原因
            sureReason() {
                if(this.textarea == '' || this.textarea == '请填写取消原因'){
                }else{
                    this.finishCancelReason();
                    this.textarea = '';
                    this.cancelReason = false;
                    this.dialogCancelReason = false;
                }
            },
            // 完成服务提示
            finishToast() {
                const h = this.$createElement;
                this.$notify({
                    title: '订单状态变更',
                    message: h('p', { style: 'color: teal'}, '该订单状态变更为已完成')
                });
            },
            // 店家取消提示
            cancelToast() {
                const h = this.$createElement;
                this.$notify({
                    title: '订单状态变更',
                    message: h('p', { style: 'color: teal'}, '该订单状态变更为店家取消')
                });
            },
            currentChange() {

            },
            //根据店面查技师
            queryStaffPage() {
                let params = { page: {}, staff: { sellerId: this.itemOrder.sellerId, storeId: this.itemOrder.storeId } };
                api.queryStaffPage(params).then(res => {
                    this.staffList = [];
                    this.staffChoose = '';
                    // console.log(res.rows)
                    var newStaff = {}
                    for(var i = 0;i < res.rows.length; i++){
                        newStaff = {value: res.rows[i].id, label: res.rows[i].nickName}
                        this.staffList.push(newStaff)
                    }
                    console.log(this.staffList)
                });
            },
            //根据店面查服务
            queryServerPage() {
                let params = { page: {}, server: { sellerId: this.itemOrder.sellerId, storeId: this.itemOrder.storeId } };
                api.queryServerPage(params).then(res => {
                    this.serverList = [];
                    this.serverChoose = '';
                    // console.log(res.rows)
                    var newServer = {}
                    for(var i = 0;i < res.rows.length; i++){
                        newServer = {value: res.rows[i].id, label: res.rows[i].name}
                        this.serverList.push(newServer)
                    }
                    console.log(this.serverList)
                });
            },
            //更新预约
            updateOrderAppointment() {
                let params = { id: this.itemOrder.id, staffId: this.staffChoose, serverId: this.serverChoose, serverName: this.serverChooseName, staffName: this.staffChooseName, modifyStartTime: new Date() };
                api.updateOrderAppointment(params).then(res => {
                    console.log(res)
                    this.itemOrder.staffName = this.staffChooseName;
                    this.itemOrder.serverName = this.serverChooseName;
                    this.itemOrder.modifyStartTime = new Date(new Date()).toLocaleDateString().replace(/\//g, "-") + " " + new Date(new Date()).toTimeString().substr(0, 8)
                    this.staffChoose = '';
                    this.serverChoose = ''
                    this.open()
                });
            },
            //完成服务
            finishServer() {
                let params = { id: this.itemOrder.id, status: 1,modifyStartTime: new Date() };
                api.updateOrderAppointment(params).then(res => {
                    console.log(res)
                    this.itemOrder.status = '已完成';
                    this.itemOrder.modifyStartTime = new Date(new Date()).toLocaleDateString().replace(/\//g, "-") + " " + new Date(new Date()).toTimeString().substr(0, 8)
                    this.finishToast()
                });
            },
            //填写取消原因
            finishCancelReason() {
                let params = { id: this.itemOrder.id, cancelReason: this.textarea, status: 3, modifyStartTime: new Date()  };
                api.updateOrderAppointment(params).then(res => {
                    console.log(res)
                    this.itemOrder.status = '店家取消';
                    this.itemOrder.modifyStartTime = new Date(new Date()).toLocaleDateString().replace(/\//g, "-") + " " + new Date(new Date()).toTimeString().substr(0, 8)
                    this.queryAppointmentPage();
                    this.cancelToast();
                });
            },
            getStaffName() {
                for(var i = 0;i < this.staffList.length;i ++){
                    if(this.staffList[i].value == this.staffChoose){
                        this.staffChooseName = this.staffList[i].label
                    }
                }
                if(this.serverChoose == ''){
                    this.getServerByStaff()
                }
            },
            getServerName() {
                for(var i = 0;i < this.serverList.length;i ++){
                    if(this.serverList[i].value == this.serverChoose){
                        this.serverChooseName = this.serverList[i].label
                    }
                }
                if(this.staffChoose == ''){
                    this.getStaffByServer()
                }
            },
            //根据技师查服务
            getServerByStaff() {
                let params = { staffid: this.staffChoose }
                api.getServerByStaff(params).then(res => {
                    console.log(res)
                    this.serverList = [];
                    this.serverChoose = '';
                    // console.log(res.rows)
                    var newServer = {}
                    for(var i = 0;i < res.rows.length; i++){
                        newServer = {value: res.rows[i].id, label: res.rows[i].name}
                        this.serverList.push(newServer)
                    }
                });
            },
            //根据服务查技师
            getStaffByServer() {
                let params = { serverId: this.serverChoose }
                api.getStaffByServer(params).then(res => {
                    console.log(res)
                    this.staffList = [];
                    this.staffChoose = '';
                    var newStaff = {}
                    for(var i = 0;i < res.rows.length; i++){
                        newStaff = {value: res.rows[i].id, label: res.rows[i].nickName}
                        this.staffList.push(newStaff)
                    }
                });
            },
            //手机号正则
            isPhoneNum(str) {
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(str)) {
                    this.openErr()
                } else {
                    this.queryAppointmentPage()
                }
            },
            open() {
                this.$notify({
                    title: '成功',
                    message: '预约信息修改成功',
                    type: 'success'
                });
            },
            openErr() {
                this.$message.error('请输入正确的手机号');
            }
        },
        watch: {
            "staffChoose": "getStaffName",
            "serverChoose": "getServerName"
        }
    }
</script>

<style lang="scss">
    #booking-order {
        width: calc(100% - 48px);
        width: -webkit-calc(100% - 48px);
        width: -moz-calc(100% - 48px);
        height: calc(100% - 48px);
        height: -webkit-calc(100% - 48px);
        height: -moz-calc(100% - 48px);
        border: 24px solid #edf2f5;
        overflow: auto;
        .search_input::-webkit-input-placeholder{
            color:#f66;
        }
        .search_input:-moz-placeholder{
            color:#f66;
        }
        .search_input::-moz-placeholder{
            color:#f66;
        }
        .search_input:-ms-input-placeholder{
            color:#f66;
        }
        .is-active{
            .el-radio-button__inner{
                color: rgba(24,204,192,1);
                background: #fff;
                border-color: rgba(24,204,192,1);
                box-shadow: -1px 0 0 0 rgba(24,204,192,1);
                -webkit-box-shadow: -1px 0 0 0 rgba(24,204,192,1);
            }
        }
        .el-radio-button__inner:hover {
            color: rgba(24, 204, 192, 1);
            -webkit-box-shadow: -1px 0 0 0 rgba(24,204,192,1);
            box-shadow: -1px 0 0 0 rgba(24,204,192,1);
        }
        .title{
            height: 66px;
            line-height: 66px;
            font-size: 18px;
            color: rgba(0,0,0,.85);
            text-indent: 32px;
            font-weight: 900;
            flex: 1;
        }
        .choose-booking {
            display: flex;
            padding: 0 32px 24px;
            /*border-left: 24px solid #edf2f5;
            border-right: 24px solid #edf2f5;*/
            .booking {
                display: flex;
                align-items: center;
                p {
                    width: 70px;
                }
                .el-select{
                    width: 136px;
                }
            }
            .search-tel {
                margin-left: 20px;
                display: flex;
                align-items: center;
                p {
                    width: 70px;
                }
                .el-input{
                    width: 136px;
                }
            }
            .search-time{
                margin-left: 20px;
                display: flex;
                align-items: center;
                p{
                    width: 70px;
                }
                .el-date-editor{
                    width: 372px;
                }
                .el-button{
                    margin-left: 16px;
                }
            }
        }
        .el-radio-group{
            width: calc(100% - 112px);
            padding: 0 32px 0;
            /* border-left: 24px solid #edf2f5;
             border-right: 24px solid #edf2f5;*/
        }
        .cont{
            /*height: calc(100% - 202px);
            height: -webkit-calc(100% - 202px);
            height: -moz-calc(100% - 202px);
            border: 24px solid #edf2f5;
            border-top: 0;
            overflow: hidden;*/
        }
        .booking-state {
            display: flex;
            margin-top: 20px;
            align-items: center;
            p {
                width: 120px;
            }
        }
        .el-table {
            /*height: calc(100% - 188px);
            height: -webkit-calc(100% - 188px);
            height: -moz-calc(100% - 188px);*/
            .el-table_1_column_11{
                .cell{

                }
            }
            .el-button.el-button--text{
                margin: 0 10px 0 0;
            }
        }
        .el-pagination{
            float: right;
            margin: 0 32px 32px 0;
        }
        .el-dialog{
            .el-dialog__header{
                background: #fff;
                padding: 16px 24px 15px;
                border-bottom: 1px solid rgba(0,0,0,0.09);
                .el-dialog__title{
                    line-height: 24px;
                    color: rgba(0,0,0,0.85);
                    font-weight: 900;
                }
            }
            .el-dialog__body{
                padding: 0 24px;
                dl{
                    display: flex;
                    align-items: center;
                    height: 22px;
                    line-height: 22px;
                    margin-bottom: 24px;
                    &:nth-of-type(1){
                        margin-top: 24px;
                    }
                    &:nth-of-type(6), &:nth-of-type(5){
                        height: 32px;
                    }
                    &:nth-of-type(1), &:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(4){
                        dd{
                            text-indent: 20px;
                        }
                    }
                    &:nth-of-type(6){
                        margin-bottom: 32px;
                    }
                    dt{
                        width: 70px;
                    }
                    dd{
                        flex: 1;
                        .el-select{
                            width: 100%;
                        }
                    }
                }
                .cancel-popout{
                    color: rgba(0,0,0,0.65);
                    margin-top: 24px;
                    padding-bottom: 24px;
                    .cancel-p{
                        display: flex;
                        p{
                            font-size: 14px;
                            line-height: 22px;
                            &:nth-of-type(1){
                                color: rgba(0,0,0,0.85);
                                margin-right: 20px;
                            }
                        }
                    }
                    .reason_detail{
                        height: 194px;
                        margin-top: 24px;
                        line-height: 24px;
                    }
                }
                .el-textarea{
                    margin: 24px 0;
                }
            }
            .el-dialog__footer{
                padding: 20px 24px 17px;
                border-top: 1px solid rgba(0,0,0,0.09);
            }
        }
    }
</style>
