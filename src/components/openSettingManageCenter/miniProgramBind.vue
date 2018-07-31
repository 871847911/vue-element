<template>
  <el-container class="openS">
    <!-- <el-header height="">
                <el-row>
                    <el-col :span="4">
                        小程序绑定信息
                    </el-col>
                    
                </el-row>
            </el-header> -->
    <el-main height="">
      <!-- Main content -->
      <el-form :model="form" ref="form" label-width="40%" :rules="rules">
        <el-form-item label="小程序名称:" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入小程序名称"></el-input>
        </el-form-item>
        <el-form-item label="APPID:" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入APPID"></el-input>
        </el-form-item>
        <el-form-item label="APPSecret:" prop="appSecret">
          <el-input v-model="form.appSecret" placeholder="请输入APPSECRET"></el-input>
        </el-form-item>
        <el-form-item label="授权绑定:">
          <div v-if="isAuthorized">
            <span>已绑定的小程序：{{appName}}</span>
            <el-button type="text" @click="bindMini" class="noBorderC">重新授权</el-button>

          </div>
          <div v-else>
            <span class="miniSpan">未授权绑定小程序</span>
            <el-button type="text" @click="bindMini" class="noBorderC">点击绑定</el-button>

          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        </el-form-item>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
import api from "../../fetch/api";
import { mapGetters } from "vuex";
export default {
  name: "miniProgram",
  computed: {
    ...mapGetters({ loginInfo: "getLoginInfo" })
  },
  data: function() {
    var checkDesc = (rule, value, callback) => {
      if (value.length > 0) {
        return callback();
      } else {
        callback("请输入");
      }
    };
    return {
      // wxf674dc860f960ec0
      form: {
        appName: "",
        appId: "",
        appSecret: ""
      },
      rules: {
        appName: [
          {
            validator: checkDesc,
            message: "请输入小程序名称",
            trigger: "blur"
          }
        ],
        appId: [
          {
            validator: checkDesc,
            message: "请输入APPID",
            trigger: "blur"
          }
        ],
        appSecret: [
          {
            validator: checkDesc,
            message: "请输入APPSECRET",
            trigger: "blur"
          }
        ]
      },

      isAuthorized: false, // 是否认证过
      appName: "" // 小程序名称
    };
  },
  methods: {
    getSellerInfo() {
      let params = {
        sellerId: this.loginInfo.sellerId
      };
      console.log("param", params);
      api.querySellerById(params).then(res => {
        console.log("res is4444444444444", res);
        this.isAuthorized=res.isAuthorize==1?true:false;
        this.appName=res.appName;
        this.form = Object.assign(this.form, res);
        console.log('this.form is',this.form);
      });
    },
    bindMini() {
      console.log(this.form.appId);
      api
        .getAutUrl({
          appid: this.form.appId
        })
        .then(res => {
          console.log("res is", res);
          window.location.href = res;
          // window.location.href =
          //   "https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=wx7df61337ea18c4c9&pre_auth_code=preauthcode@@@xwe5zgW8cJkVmgqh1d4wcFaWrtimHOr0hZwuVMiD4HsWlXwhenQev4l8JEVRE9qk&redirect_uri=https://meiye-hz.vdongchina.com/api/wechat/queryTestAuth?appid=wx75636d6678ab478b&biz_appid=wx75636d6678ab478b";
      
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            id: this.loginInfo.sellerId,
            accountId: this.loginInfo.id,
            appName: this.form.appName,
            appSecret: this.form.appSecret,
            appId: this.form.appId
          };
          api.updateSeller(params).then(res => {
            res.retcode
              ? (this.$message.success(res.retmsg),this.getSellerInfo())
              : this.$message.error(res.retmsg);
          });
        }
      });
    },
    // 查看审核状态
    getAuthorizeStatus() {
      let params = {
        accountId: this.loginInfo.id
      };
      api.getLatestAuditstatus(params).then(res => {
        // this.isAuthorized = res.isAuthorized
        // this.appName = res.appName
        this.isAuthorized = res.status == 0 ? true : false;
        this.appName = "审核成功";
      });
    }
  },
  created() {
    // this.getAuthorizeStatus();
    this.getSellerInfo();
  }
};
</script>

<style lang="scss" scoped>
@include buttonPrimary;
.miniSpan {
  @include fontLightC;
}

.openS .el-form-item:last-child {
  margin-top: 0;
}

.openS button {
  min-width: 65px;
  .el-button.el-button--text {
    &:hover {
      border: none;
    }
  }
}
</style>
