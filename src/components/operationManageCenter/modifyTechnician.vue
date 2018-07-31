<template>
<el-container class="resetCT">
    <el-header style="height:54px">
        <el-row class="resetElRow">
            <el-col :span="20">配置技师 </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
            </el-col>
        </el-row>
        <br/>
    </el-header>
    <el-main height="" id="resetMain">
        <el-form :model="form" ref="form" :rules="rules">
            <el-row>
                <el-col :span="5" :offset="4">
                    <span> 姓名：</span>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="" prop="name">
                        <el-input v-model="form.name" placeholder="请输入门店联系人"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5" :offset="4">
                    <span>
                            手机号码：
                        </span>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="" prop="phone">
                        <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5" :offset="4">
                    <span> 昵称：</span>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="" prop="nickName">
                        <el-input v-model="form.nickName" placeholder="请设置昵称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
                        <el-col :span="4">座机号码</el-col>
                        <el-col :span="7">
                            <el-form-item label="" prop="telPhone">
                                <el-input v-model="form.telPhone" placeholder="请输入手机号码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
            <el-row>
                <el-row>
                    <el-col :span="5" :offset="4">
                        <span> 上传头像：</span>
                    </el-col>
                    <el-col :span="7">
                        <span>推荐图片尺寸200*200像素（由小程序实际设计为准），大小不超过1MB</span>
                        <el-form-item label="" prop="authorImgUrl" style="margin-top:8px">
                            <el-upload class="avatar-uploader" :action="siteUrl+'/upload'" :file-list='fileList' :limit=1 list-type="picture-card" :http-request="httpRequestSettings" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
                                <!-- <img v-if="form.authorImgUrl" :src="form.authorImgUrl" class="avatar"> -->
                                <i class="el-icon-plus avatar-uploader-icon" v-if="isShow">
                                        <span>添加图片</span>
                                    </i>
                            </el-upload>
                            <!-- <img :src='imgUrl' @click="isImgUrlVisible=true" />  -->
                            <el-dialog title="个人头像" :visible.sync="isImgUrlVisible" width="30%" @close="isImgUrlVisible=false">
                                <img :src='imgUrl' width="400px" height="400px" />
                            </el-dialog>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5" :offset="4">
                        <span>技师类型：</span>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="" prop="type">
                            <el-select v-model="form.type" placeholder="例如：美容师、理发师、按摩师" class="techSelect" >
                                <div class="techDiv">
                                    <el-input v-model="appendText"></el-input>
                                    <span @click="appendToList">添加</span>
                                </div>
                                <li class="el-select-dropdown__item" v-if="isShowError">
                                    <span style="color:#F5222D">限制输入10个字</span>
                                </li>
                                <el-option v-for="item in typeOfSerList" :key="item.id" :label="item.name" :value="item.id" @mouseover.native="showUp(item)">
                                    <span>{{ item.name }}</span>
                                    <i v-if="isShowIndex==item.id" style="float:right;line-height:34px;" class="el-icon-close" @click="deletedStaffType(item)"></i>

                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-row>
            <el-row>
                <el-col :span="5" :offset="4">
                    <span>技师简介：</span>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="" prop="detail">
                        <el-input v-model="form.detail" type="textarea" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                        <span class="techSpan">还剩{{remain}}字输入</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="9">
                    <!-- <el-button type="primary" @click="onSubmit('form')">确定修改</el-button> -->
                    <el-button type="primary" @click="onSubmit('form',true)">确认修改</el-button>
                    <el-button @click="goBack">取消</el-button>
                </el-col>
            </el-row>

        </el-form>
        <el-dialog :visible.sync="deleteTechVisible" width="30%" :show-close="false" custom-class="imgDialog">
            <div>
                <img src="../../assets/images/delete3.png" alt="icon">
            </div>
            <span>该技师类型已绑定技师，请先解除绑定，再删除技师类型</span>

            <span slot="footer">
          <el-button type="primary" @click="deleteTechVisible=false">确 定</el-button>
        </span>
        </el-dialog>
    </el-main>

</el-container>
</template>

<script>
import api from "../../fetch/api";
import { mapGetters } from "vuex";
export default {
  name: "addService",
  data: function() {
    var checkName = (rule, value, callback) => {
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
    var checkIntro = (rule, value, callback) => {
      // if (new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9]{1,400}$/).test(value)) {
      if (value.length <= 400) {
        return callback();
      } else {
        callback("请输入中文、英文字符");
      }
    };
    return {
      isShowIndex: false,
      isShowError: false,
      deleteTechVisible: false,
      staffTypeIndex: 0,
      staffTypeObj: {},
      isShow: false,
      fileList: [
        {
          name: "",
          url: ""
        }
      ],
      nameOfSer: "", // 服务名称
      imgUrl: "",
      appendText: "",
      typeOfSerList: [
        {
          label: "sexy",
          value: "sexy"
        }
      ],
      form: {
        name: "",
        phone: "",
        nickName: "",
        zPhone: "",
        headUrl: "",
        //   "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2107961350,3702928033&fm=27&gp=0.jpg",
        staffTypeName: "",
        detail: "",
        type: ""
      },
      rules: {
        name: [
          {
            validator: checkName,
            required: true,
            trigger: "blur"
          }
        ],
        phone: [
          {
            validator: checkPhone,
            required: true,
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            validator: checkName,
            trigger: "blur"
          }
        ],
        zPhone: [
          {
            validator: checkPhone,
            required: true,
            trigger: "blur"
          }
        ],
        headUrl: [
          {
            required: true,
            message: "请上传头像",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ],
        detail: [
          {
            validator: checkIntro,
            required: true,
            trigger: "blur"
          }
        ]
      },
      siteUrl: " ", //　站点url
      isImgUrlVisible: false
    };
  },
  computed: {
    ...mapGetters({
      storeInfo: "getStoreInfo",
      techInfo: "getTechInfo",
      loginInfo: "getLoginInfo"
    }),
    remain: function() {
      return 400 - this.form.detail.length;
    }
  },
  methods: {
    showUp(item) {
      console.log("sssssssss", item);
      this.isShowIndex = item.id;
    },
    // 得到技师类型

    getTechTypeList() {
      let params = {
        staffType: {
          storeId: this.storeInfo.id
        }
      };
      api.selectByStore(params).then(res => {
        this.typeOfSerList = res;
      });
    },

    // 添加技师类型
    appendToList() {
      if (
        new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/).test(this.appendText)
      ) {
        api
          .addStaffType({
            storeId: this.storeInfo.id,
            name: this.appendText
          })
          .then(res => {
            if (res.retcode) {
              this.getTechTypeList();
              this.appendText = "";
            } else {
              this.$message.error("添加失败");
            }
          });
        // this.appendText = "";
      } else {
        // this.$message.error("请输入中文、英文、数字字符，长度不超过10");
        this.isShowError = true;

        setTimeout(() => {
          this.isShowError = false;
        }, 1500);
      }
    },
    // 删除技师类型
    deletedStaffType(item) {
      // this.deleteTechVisible = true;
      // this.staffTypeIndex=index;
      console.log("sssssssssssssss", item);
      this.staffTypeObj = item;
      this.form.type = "";
      let params = {
        page: {},
        staff: {
          storeId: this.storeInfo.id,
          staffTypeId: item.id
        }
      };
      api.queryStaffServer(params).then(res => {
        if (res.length == 0) {
          this.handleDelete();
        } else {
          this.deleteTechVisible = true;
        }
      });
    },
    handleDelete() {
      let params = {
        id: this.staffTypeObj.id
      };
      api.removeStaffType(params).then(res => {
        res.retcode == 1
          ? (this.$message.success("删除成功"),
            (this.deleteTechVisible = false),
            this.getTechTypeList(),
            (this.form.type = ""))
          : this.$message.error(res.retmsg);
      });
    },
    goToPage(url) {
      this.$router.push({
        name: `${url}`
      });
    },
    httpRequestSettings(param) {
      //   const siteUrl = this.siteUrl;
      const that = this;
      const fileObj = param.file;
      const fileController = `${this.siteUrl}/upload`;
      let form = new FormData();
      form.append("multipartFile", fileObj);
      let xhr = new XMLHttpRequest();
      xhr.open("PUT", fileController, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            that.$message.success("上传图片成功");
            that.imgUrl = JSON.parse(xhr.responseText).url;
            that.form.headUrl = JSON.parse(xhr.responseText).url;
            that.isShow = false;
          } else {
            that.$message.error("服务器出错，请稍后重试");
          }
        }
      };
      xhr.onerror = function() {
        that.$message.error("服务器出错，请稍后重试");
      };
      xhr.send(form);
    },
    handlePreview(file) {
      console.log("111");
      this.form.authorImgUrl = file.url;
      this.isImgUrlVisible = true;
    },
    handleRemove() {
      this.isShow = true;
    },
    beforeAvatarUpload(file) {
      // return this.checkWidthHeight(file).then(res=>{

      // })
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
    onSubmit(formName, isBack = false) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let typeName, params, typeId;
          if (
            (typeof this.form.type == "string" &&
              this.form.type.constructor == String) ||
            this.form.type == "" ||
            this.form.type == null
          ) {
            params = {
              // staff: {
              storeId: this.storeInfo.id,
              name: this.form.name,
              nickName: this.form.nickName,
              phone: this.form.phone,
              // zPhone: this.form.telPhone,
              headUrl: this.form.headUrl,
              detail: this.form.detail,
              staffTypeId: this.techInfo.staffTypeId,
              staffTypeName: this.form.type,
              sellerId: this.loginInfo.sellerId,
              id: this.techInfo.id
            };
          } else {
            typeName = this.typeOfSerList.find(
              item => item.id == this.form.type
            ).name;
            params = {
              // staff: {
              storeId: this.storeInfo.id,
              name: this.form.name,
              nickName: this.form.nickName,
              phone: this.form.phone,
              // zPhone: this.form.telPhone,
              headUrl: this.form.headUrl,
              detail: this.form.detail,
              staffTypeId: this.form.type,
              staffTypeName: typeName,
              sellerId: this.loginInfo.sellerId,
              id: this.techInfo.id
            };
          }

          //   let
          //   let params = {
          //     // staff: {
          //     storeId: this.storeInfo.id,
          //     name: this.form.name,
          //     nickName: this.form.nickName,
          //     phone: this.form.phone,
          //     zPhone: this.form.zPhone,
          //     headUrl: this.form.headUrl,
          //     detail: this.form.detail,
          //     staffTypeId: this.form.type,
          //     id: this.techInfo.id
          //     // }
          //     // staffTypeName: typeName
          //   };
          //   console.log("params is", params);
          api.updateStaff(params).then(res => {
            // console.log("res is", res);
            if (res.retcode) {
              this.$message.success(res.retmsg);
              this.$refs[formName].resetFields();
              isBack ? this.goBack() : null;
            } else {
              this.$message.error(res.retmsg);
            }
          });
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.back();
    }
  },
  created() {
    this.siteUrl = api.siteUrl();
    this.fileList[0].url = this.techInfo.headUrl;
    this.form = Object.assign(this.form, this.techInfo);
    // 默认带字符串进来
    this.form.type = this.techInfo.staffTypeName;
    this.imgUrl = this.techInfo.headUrl;
    this.isShow = false;
    this.getTechTypeList();
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
#app .el-container .resetCT {
  height: calc(100% - 94px);
}

#resetMain.el-main {
  height: calc(100% - 52px);
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #18ccc0;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 104px;
  height: 104px;
  line-height: 104px;
  text-align: center;
  border: 1px solid RGBA(0, 0, 0, 0.15);
  border-radius: 4px;
  background-color: RGBA(0, 0, 0, 0.02);
}

.avatar-uploader-icon span {
  position: absolute;
  top: 64px;
  left: 26px;
  @include fontRegular;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-col.el-col-5.el-col-offset-4 {
  // span {
  text-align: right; // @include fontRegular;
  // span {
  // line-height: 32px;
  // } // }
}

.el-form > .el-row:nth-child(5) {
  margin-bottom: 12px;
}

span {
  line-height: 32px;
  @include fontRegular;
}

.techSelect {
  width: 100%;
}

.techSpan {
  color: RGBA(155, 155, 155, 1);
  font-weight: 500;
}

.el-col.el-col-10.el-col-offset-9 {
  > .el-button {
    padding: 8px 14px;
  }
}

.techDiv {
  background: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 94%;
  margin-left: 3%;
  margin-bottom: 5px;
  cursor: pointer;
  .el-input {
    width: 90%;
  }
  span {
    color: #18ccc0;
  }
}
</style>
