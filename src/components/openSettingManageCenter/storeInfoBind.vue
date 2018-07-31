<template>
  <el-container class="openS">
    <el-main height="">
      <!-- Main content -->
      <el-form :model="form" ref="form" label-width="40%" :rules="rules">
        <el-form-item label="微信支付商户号:" prop="payMerchantNumber">
          <el-input v-model="form.payMerchantNumber " placeholder="请输入微信支付商户号"></el-input>
        </el-form-item>
        <el-form-item label="支付API密钥:" prop="paySecret">
          <el-input v-model="form.paySecret " placeholder="请输入支付API密钥"></el-input>
        </el-form-item>
        <el-form-item label="支付证书:" prop="payCertificateUrl">
          <el-upload class="fileload" accept='.pem' action="33" :http-request='httpRequestSettings' name='apiclientCertFile' :disabled='miniADisabled' :before-upload="beforeUpload" :before-remove="handleRemove" :on-remove="handleRemove">
            <el-button>上传文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.pem文件，且不超过500kb</div>
          </el-upload>
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
    ...mapGetters({
      loginInfo: "getLoginInfo"
    })
  },
  data: function() {
    var checkPayMer = (rule, value, callback) => {
      if (value.length <= 20 && value.length > 0) {
        return callback();
      } else {
        callback("请输入微信支付商户号");
      }
    };
    var checkPaySecret = (rule, value, callback) => {
      if (value.length > 0) {
        return callback();
      } else {
        callback("请输入支付API密钥");
      }
    };
    var checkpayCertificateUrl = (rules, value, cb) => {
      if (this.miniADisabled) {
        return cb();
      } else {
        cb("请上传证书");
      }
    };
    return {
      siteUrl: "",
      miniADisabled: false,
      form: {
        payMerchantNumber: "",
        paySecret: "",
        payCertificateUrl: ""
      },
      rules: {
        payMerchantNumber: [
          {
            validator: checkPayMer,
            trigger: "blur"
          }
        ],
        paySecret: [
          {
            validator: checkPaySecret,
            trigger: "blur"
          }
        ],
        payCertificateUrl: [
          {
            validator: checkpayCertificateUrl,
            trigger: "blur"
          }
        ]
      },
      miniApp: {
        paySecret: ""
      }
    };
  },
  methods: {
    getSellerInfo() {
      let params={
        sellerId:this.loginInfo.sellerId,
      }
      console.log('param',params);
      api.querySellerById(params).then(res => {
        console.log("res is", res);
        this.form = Object.assign(this.form, res);
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
      xhr.open("POST", fileController, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            that.$message.success("上传证书成功");
            // that.imgUrl = `${that.siteUrl}${JSON.parse(xhr.responseText).path}`;
            // that.form.payCertificateUrl = `${that.siteUrl}${
            //   JSON.parse(xhr.responseText).path
            // }`;
            that.form.payCertificateUrl=JSON.parse(xhr.responseText).url;
            that.miniADisabled = true;
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
    beforeUpload(file) {
      console.log("file", file);
      const fileType = file.type;
      let isApproved = true;
      // if (fileType == "application/x-x509-ca-cert") {
      //   isApproved = true;
      // } else {
      //   this.$message.error("只能上传.pem的文件");
      // }
      const isLtKb = file.size / 1024 / 1024 / 1024 < 500;
      if (!isLtKb) {
        this.$message.error("文件大小不能超过500kb");
      }
      return isLtKb && isApproved;
    },
    handleRemove(file, fileList) {
      console.log("1111111111");
      this.miniADisabled = false;
    },
    onSubmit(formName) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            id: this.loginInfo.sellerId,
            accountId: this.loginInfo.id,
            payMerchantNumber: this.form.payMerchantNumber,
            paySecret: this.form.paySecret,
            payCertificateUrl: this.form.payCertificateUrl
          };
          api.updateSeller(params).then(res => {
            if (res.retcode) {
              that.$message.success("发布成功");
            } else {
              that.$message.error("发布失败");
            }
          });
        }
      });
    }
  },
  created() {
    this.siteUrl = api.siteUrl();
    this.getSellerInfo();
  }
};
</script>

<style lang="scss" scoped>
@include buttonPrimary;
.el-upload__tip {
  @include fontLight;
}

.openS .el-form-item:last-child {
  margin-top: 0;
}

.openS button.el-button--primary {
  min-width: 65px;
}
</style>
