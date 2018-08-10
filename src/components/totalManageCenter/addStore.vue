<template>
    <div id="store-config">
        <div class="store-message">
            <p class="title">门店信息</p>
            <el-button @click="toStore">返 回</el-button>
        </div>
        <div class="configInfo">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="门店名称：" prop="storeName">
                    <el-input v-model="ruleForm.storeName" placeholder="请输入门店名称"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" prop="storeOwner">
                    <el-input v-model="ruleForm.storeOwner" placeholder="请输入门店联系人"></el-input>
                </el-form-item>
                <el-form-item label="手机电话：" prop="tel">
                    <el-input v-model="ruleForm.tel" placeholder="请设置联系方式"></el-input>
                </el-form-item>
                <el-form-item label="座机电话：" prop="" placeholder="请设置联系方式">
                    <el-input v-model="ruleForm.phone1" placeholder="区号"></el-input>
                    <el-input v-model="ruleForm.phone2" placeholder="请设置联系方式"></el-input>
                </el-form-item>
                <el-form-item label="门店地区：" prop="storeArea">
                    <el-cascader
                        :options="areaOptions"
                        v-model="ruleForm.storeArea"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="门店详细地址：" prop="storeAdd">
                    <el-input type="textarea" v-model="ruleForm.storeAdd" placeholder="请设置门店详细地址"></el-input>
                </el-form-item>
                <el-form-item label="位置标注：" prop="marked">
                    <el-input v-model="ruleForm.marked" disabled="disabled"></el-input>
                    <el-button type="primary" @click="setAddress">设置地址</el-button>
                </el-form-item>
                <el-form-item label="门店图片：" prop="storeImg">
                    <el-upload
                        class="avatar-uploader"
                        action="http://meiye-hz.vdongchina.com/upload/"
                        :http-request="httpRequestSettings"
                        :show-file-list="false"
                        list-type="picture"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="ruleForm.storeImg" :src="ruleForm.storeImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动时间：" required>
                    <el-col :span="11">
                        <el-form-item prop="startTime">
                            <el-time-select
                                placeholder="起始时间"
                                v-model="ruleForm.startTime"
                                :picker-options="{
                            start: '06:00',
                            step: '00:15',
                            end: '24:00',
                            maxTime: ruleForm.endTime
                        }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="endTime">
                            <el-time-select
                                placeholder="结束时间"
                                v-model="ruleForm.endTime"
                                :picker-options="{
                            start: '06:00',
                            step: '00:15',
                            end: '24:00',
                            minTime: ruleForm.startTime
                        }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('ruleForm')">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
            <div style="height: 500px;">
                <iframe id="mapPage" width="100%" height="100%" frameborder=0
                        src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
                </iframe>
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
    import api from "../../fetch/api.js";
    export default {
        data() {
            var checkName = (rule, value, callback) => {
                if (new RegExp(/^[\u4e00-\u9fa5a-zA-Z]{1,30}$/).test(value)) {
                    return callback();
                } else {
                    callback("请输入中文、英文字，最多不超过30个");
                }
            };
            var checkPeople = (rule, value, callback) => {
                if (new RegExp(/^[\u4e00-\u9fa5a-zA-Z]{1,10}$/).test(value)) {
                    return callback();
                } else {
                    callback("请输入中文、英文字符，最多不超过10个");
                }
            };
            var checkPhone = (rule, value, callback) => {
                if (new RegExp(/^1[3|4|5|6|7|8|9][0-9]{9}$/).test(value)) {
                    return callback();
                } else {
                    callback("请输入正确的手机号码");
                }
            };
            return {
                Account: 13,
                storeState: true,
                dialogVisible: false,
                storeConfigInfo: '',
                areaId: '',
                loc: '',
                lat: '',
                lng: '',
                siteUrl: '',
                areaOptions: [],
                selectedOptions: [],
                maxStoreNum: '',
                ruleForm: {
                    storeName: '',
                    storeOwner: '',
                    tel: '',
                    phone1: '',
                    phone2: '',
                    storeArea: [],
                    storeAdd: '',
                    marked: '',
                    storeImg: '',
                    endTime: '',
                    startTime: '',
                    status:0,
                },
                rules: {
                    storeName: [
                        { validator: checkName, required: true, trigger: "blur" }
                    ],
                    storeOwner: [
                        { validator: checkPeople, required: true, trigger: "blur" }
                    ],
                    tel: [
                        { validator: checkPhone, required: true, trigger: "blur" }
                    ],
                    phone1: [
                        { required: false, message: '请输入座机号', trigger: 'blur' },
                    ],
                    phone2: [
                        { required: false, message: '请输入座机号', trigger: 'blur' },
                    ],
                    storeArea: [
                        { type: 'array', required: true, message: '请选择门店地区', trigger: 'blur' },
                    ],
                    storeAdd: [
                        { required: true, message: '请输入门店地址', trigger: 'blur' },
                        { min: 0, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur'}
                    ],
                    marked: [
                        { required: true, message: '请设置位置标注', trigger: 'blur' }
                    ],
                    storeImg: [
                        { required: true, message: '请上传门店图片', trigger: 'blur' }
                    ],
                    startTime: [
                        { type: '', required: true, message: '请选择开始时间', trigger: 'change' }
                    ],
                    endTime: [
                        { type: '', required: true, message: '请选择结束时间', trigger: 'change' }
                    ],
                }
            }
        },
        created() {
            this.siteUrl = api.siteUrl();
            this.selectAllRegion()
            // 监听地图选点
            window.addEventListener('message', function(event) {
                // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                this.loc = event.data;
                if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                    console.log('location', this.loc);
                }
            }, false);
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            })
        },
        methods: {
            // 添加門店
            addStore() {
                let params = {
                    createDate: new Date(),
                    sellerId: this.loginInfo.sellerId,
                    name: this.ruleForm.storeName,
                    linkman: this.ruleForm.storeOwner,
                    phone: this.ruleForm.tel,
                    zoneNum: this.ruleForm.phone1,
                    zphone: this.ruleForm.phone2,
                    regionId: this.areaId,
                    regionName: this.ruleForm.storeArea.join("-"),
                    coordinateAdress: this.ruleForm.marked,
                    address: this.ruleForm.storeAdd,
                    picUrl: this.ruleForm.storeImg,
                    addressY: this.lat,
                    addressX:  this.lng,
                    openingTime: this.ruleForm.startTime,
                    closingTime: this.ruleForm.endTime,
                    // 表示进入新增门店的变量次数
                    status:this.ruleForm.status,
                };
                api.addStore(params).then(res => {
                    this.open();
                    // console.log(this.lat, this.lng)
                });
            },
            getStoreConfigInfo() {
                let params = { accountId: this.loginInfo.id };
                api.queryStoreByAccountId(params).then(res => {
                    // console.log(res.length)
                    this.maxStoreNum = res.length;
                    if(this.maxStoreNum >= 1){
                        this.$message.error('当前版本只支持添加一家门店，无法重复添加');
                    }else{
                        this.addStore()
                    }
                });
            },
            // 省市区联动
            selectAllRegion() {
                let params = {  };
                api.selectAllRegion(params).then(res => {
                    console.log(res);
                    this.areaOptions = res.rows
                });
            },
            handleChange(label) {
                this.areaId = label[2];
            },
            // 打开地图弹窗
            setAddress() {
                this.dialogVisible = true;
            },
            // 关闭地图弹窗
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            // 地图选点
            sureRenow() {
                console.log('确定');
                console.log('location', loc);
                this.ruleForm.marked = loc.poiaddress
                this.dialogVisible = false
                this.lat = loc.latlng.lat;
                this.lng = loc.latlng.lng;
                console.log(this.lat, this.lng)
            },
            // 提交表单
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.getStoreConfigInfo()
                        // alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            httpRequestSettings(param) {
                const that = this;
                const fileObj = param.file;
                const fileController = `${this.siteUrl}/upload`;
                let form = new FormData();
                form.append("multipartFile", fileObj);
                let xhr = new XMLHttpRequest();
                xhr.open("PUT", fileController, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            that.$message.success("上传图片成功");
                            that.ruleForm.storeImg = JSON.parse(xhr.responseText).url;
                            console.log(that.ruleForm.storeImg)
                        } else {
                            that.$message.error("服务器出错，请稍后重试");
                        }
                    }
                };
                xhr.onerror = function () {
                    that.$message.error("服务器出错，请稍后重试");
                };
                xhr.send(form);
            },
            // 上传图片
            handleAvatarSuccess(res, file) {
                console.log('sss')
                this.ruleForm.storeImg = URL.createObjectURL(res.path);
            },
            // 上传图片正则
            beforeAvatarUpload(file) {
                const fileType = file.type;
                let isApproved = true;
                if (
                    fileType == "image/jpeg" ||
                    fileType == "image/png" ||
                    fileType == "image/jpg"
                ) {
                    isApproved = true;
                } else {
                    isApproved = false;
                    this.$message.error("上传的图片格式只能是：png,jpeg,jpg格式");
                }
                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 1MB!");
                }
                return isLt2M && isApproved;
            },
            toStore() {
                this.$router.push({path: '/totalManageC/store'})
            },
            open() {
                this.$notify({
                    title: '成功',
                    message: '门店信息配置成功',
                    type: 'success'
                });
            },
        },
        components: {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    #store-config{
        width: calc(100% - 48px);
        width: -webkit-calc(100% - 48px);
        width: -moz-calc(100% - 48px);
        height: calc(100% - 48px);
        height: -webkit-calc(100% - 48px);
        height: -moz-calc(100% - 48px);
        border: 24px solid #edf2f5;
        overflow: auto;
        .store-message{
            display: flex;
            align-items: center;
            .title{
                height: 66px;
                line-height: 66px;
                font-size: 18px;
                color: rgba(0,0,0,.85);
                text-indent: 32px;
                font-weight: 900;
                flex: 1;
            }
            .el-button{
                height: 32px;
                margin-right: 24px;
            }
        }
        .configInfo{
            /*height: calc(100% - 114px);
            height: -webkit-calc(100% - 114px);
            height: -moz-calc(100% - 114px);
            border: 24px solid #edf2f5;
            border-top: 0;
            overflow: auto;*/
            .el-form{
                width: 60%;
                margin: 0 auto 0;
                .el-form-item__content{
                    width: 468px;
                }
                .el-cascader{
                    width: 100%;
                }
                .el-form-item{
                    width: 100%;
                    .el-form-item__label{
                        width: 30%;
                    }
                    .el-form-item__label:before{
                        content: "";
                    }
                    &:nth-of-type(4){
                        .el-form-item__content{
                            display: flex;
                            .el-input:nth-of-type(1){
                                width: 30%;
                            }
                            .el-input:nth-of-type(2){
                                padding-left: 20px;
                                flex: 1;
                            }
                        }
                        .el-form-item__label:after{
                            content: "（选填）";
                            color: rgba(0,0,0,0.45);
                        }
                    }
                    &:nth-of-type(7){

                        .el-form-item__content{
                            .el-input{
                                width: 364px;
                            }
                        }

                        .el-button{
                            padding: 0 15px;
                            margin-left: 10px;
                        }
                    }
                    &:nth-of-type(9){
                        .el-form-item__content{
                            width: 540px;
                        }
                    }
                }
                .el-textarea__inner{
                    height: 88px;
                }
            }
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>
