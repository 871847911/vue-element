<template>
    <el-container class="resetCT">
        <el-main id="resetMain">
            <el-row class="setMB" v-if="false">
                <el-form :model="form" ref="form" :rules="rules" class="noMB">

                    <el-col :span="12">
                        <el-row>
                            <el-col :span="24">
                                <p class='h5'>绑定手机号</p>
                            </el-col>
                        </el-row>
                        <el-row class="noMB">
                            <el-col :span="4">
                                手机号码：
                            </el-col>

                            <el-col :span="12">
                                <el-form-item label="" prop="phone">
                                    <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row class="noMB">
                            <el-col :span="4">
                                验证码：
                            </el-col>
                            <el-col :span="12">
                                <el-row class="noMB">
                                    <el-col :span="16">
                                        <el-form-item label="" prop="code">
                                            <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="3" :offset="1">
                                        <el-button type="default" @click="getCode">获取验证码</el-button>
                                    </el-col>
                                    <el-col :span="3" :offset="17">
                                        <div class="showTime">
                                            60S
                                        </div>
                                    </el-col>

                                </el-row>

                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8" :offset="4">
                                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                                <el-button type="default" @click="resetForm('form')" class="calBtn">取消</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="24">
                                <p class='h5'>绑定微信号</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="wxCode">
                                    <img :src="codeUrl" alt="code">

                                </div>
                                <!-- <img src='https://img.alicdn.com/imgextra/i3/2809373152/TB28yp1dm3PL1JjSZFxXXcBBVXa_!!2809373152.jpg' alt="code">     -->
                            </el-col>
                            <el-col :span="24">
                                <span class="reBtn" @click="refresh">刷新</span>

                            </el-col>

                        </el-row>
                    </el-col>
                </el-form>

            </el-row>
            <el-row class="noMB">
                <el-form :model="form1" ref="form1" :rules="rules1">

                    <el-col :span="12">
                        <el-row>
                            <el-col :span="24">
                                <p class='h5'>密码管理</p>
                            </el-col>
                        </el-row>
                        <el-row class="noMB">
                            <el-col :span="4">
                                <span>原密码：</span>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="" prop="oldPassword">
                                    <el-input v-model="form1.oldPassword" placeholder="请输入您的登录密码" type="password"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="noMB">
                            <el-col :span="4">
                                <span>新密码：</span>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="" prop="newPassword">
                                    <el-input v-model="form1.newPassword" placeholder="请输入您新的登录密码" type="password"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">
                                <span>重复新密码：</span>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="" prop="sureNewPassword">
                                    <el-input v-model="form1.sureNewPassword" placeholder="请重复您新的登录密码" type="password"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="noMB">
                            <el-col :span="12" :offset="4">
                                <el-button type="primary" @click="onSubmit1('form1')">保存</el-button>
                                <el-button type="default" @click="resetForm('form1')" class="calBtn">取消</el-button>

                            </el-col>
                        </el-row>

                    </el-col>
                    <!-- <el-col :span="12">
                <el-row>
                    <el-col :span="24">
                        <p class='h5'>账号管理</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4"><span>重复新账号</span></el-col>
                    <el-col :span="12">
                        <el-input v-model="newAccount" placeholder="请输入新的登录账号"></el-input>
                    </el-col>
                    <el-col :span="24"><el-button type="primary" @click="saveAccount">保存</el-button>
                    </el-col>
                </el-row>

            </el-col> -->
                </el-form>

            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import api from "../../fetch/api";
import store from "@/store/index";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "accountSafe",
  computed: {
    ...mapGetters({ loginInfo: "getLoginInfo" })
  },
  data: function() {
    var checkPhone = (rule, value, cb) => {
      if (new RegExp(/^1[3|4|5|6|7|8|9][0-9]{9}$/).test(value)) {
        return cb();
      } else {
        cb("请输入正确的手机号码");
      }
    };
    var checkPassword = (rule, value, cb) => {
      if (value == this.form1.newPassword) {
        return cb();
      } else {
        cb("请输入相同的密码");
      }
    };
    var checkEarlyPass = (rule, val, cb) => {
      if (val == this.loginInfo.password) {
        return cb();
      } else {
        cb("请正确输入旧密码");
      }
    };
    return {
      rules: {
        phone: [
          {
            validator: checkPhone,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      },
      form: {
        phone: "",
        code: ""
      },
      rules1: {
        oldPassword: [
          {
            required: true,
            validator: checkEarlyPass,
            // message: "请输入您的登陆密码",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新的密码",
            trigger: "blur"
          }
        ],
        sureNewPassword: [
          {
            required: true,
            validator: checkPassword,
            message: "请重复输入新的密码",
            trigger: "blur"
          }
        ]
      },
      form1: {
        oldPassword: "",
        newPassword: "",
        sureNewPassword: ""
      },

      phone: "",
      code: "", // 验证码
      codeUrl: "",
      newAccount: "",
      oldPassword: ""
    };
  },
  methods: {
    ...mapActions(["changeLogInfo"]),
    getCode() {
      let params = {
        content: "微动天下",
        merchantId: this.loginInfo.id,
        phone: [this.form.phone]
      };
      api.sendMesssage(params).then(res => {
        console.log("res", res);
      });
    },
    savePhone() {},
    cancelPhone() {},
    refresh() {},
    save() {},
    saveAccount() {},
    // 绑定手机号
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
        }
      });
    },
    // 发送请求
    sendRequest() {
      let params = {
        id: this.loginInfo.id,
        nickname: this.loginInfo.nickname,
        password: this.form1.sureNewPassword
      };
      const that = this;
      api.updateAccount(params).then(res => {
        if (res.retcode) {
          this.$message.success("修改成功");
          store.dispatch("changeLoginInfo",Object.assign({},this.loginInfo,{password:this.form1.sureNewPassword}))

          this.resetForm('form1')

        } else {
          this.$message.error("修改失败");
        }

        // store.dispatch("changeLoginInfo",this.form1.sureNewPassword)
      });
    },
    // 修改密码

    onSubmit1(formName) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.sendRequest();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-button.el-button--primary
    {
    border-color: #18CCC0;
    background: #18CCC0;
}
@include buttonPrimaryS;
#app .el-container .resetCT {
  height: calc(100% - 44px);
}
#resetMain.el-main {
  height: calc(100% - 52px);
}
.h5 {
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.commonHead .commonCon section.el-container .el-main {
  padding-top: 24px;
}

.el-row {
  margin-bottom: 32px;
}

.el-col.el-col-4 {
  text-align: right;
  line-height: 32px;
  font-size: 14px;
  color: RGBA(0, 0, 0, 0.85);
}

.wxCode {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  img {
    width: 120px;
    height: 120px;
  }
}

.noMB {
  margin-bottom: 0;
}

.setMB {
  margin-bottom: 28px;
  // margin-bottom: 0;
}

.showTime {
  font-size: 14px;
  color: RGBA(0, 0, 0, 0.25);
  text-align: center;
  min-width: 114px;
  height: 32px;
  line-height: 32px;
  background: rgba(245, 245, 245, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
  cursor: pointer;
  margin-top: 8px;
}

.calBtn {
  min-width: 65px;
}

.reBtn {
  color: #18CCC0;
  cursor: pointer;
}
</style>
