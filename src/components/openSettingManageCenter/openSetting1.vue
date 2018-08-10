<template>
  <el-container class="openS">
    <!-- <el-header height="">
                <el-row>
                    <el-col :span="4">
                        发布设置
                    </el-col>

                </el-row>
            </el-header> -->
    <el-main height="">

      <!-- Main content -->
      <!-- <el-row>
            <el-col :span="12"></el-col>
            <el-col :span="12"></el-col>
        </el-row> -->

      <el-form :model="form" ref="form" label-width="40%" :rules="rules">
        <el-form-item label="已上传的代码请移至微信公众平台:">
          <a href='https://mp.weixin.qq.com/' target="_blank" class="mp-wx">https://mp.weixin.qq.com/</a>
        </el-form-item>
        <el-form-item label="小程序版本号:" prop="userVersion">
          <el-input v-model="form.userVersion" placeholder="请输入小程序版本号"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="userDesc">
          <el-input v-model="form.userDesc" placeholder="请输入备注说明，不得超过20字符"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="onSubmit('form')" :disabled="isDisabled">点击上传</el-button>-->
            <el-button type="primary" @click="onSubmit('form')" :disabled="false">点击上传</el-button>
          <el-button type="primary" @click="getAuthorized">获取审核状态</el-button>
        </el-form-item>

        <el-form-item>
          <v-playvideo srcUrl="http://assets.vdongchina.com/%E4%BB%80%E4%B9%88%E6%97%B6%E5%80%99%E5%8F%91%E5%B8%83%E5%B0%8F%E7%A8%8B%E5%BA%8F.mp4" playText="什么时候发布小程序"></v-playvideo>
        </el-form-item>
      </el-form>
      <el-dialog title="" :visible.sync="isNotMatchRequireVisible" width="25%" :show-close="false">
        <p>{{message}}</p>
        <span slot="footer">
          <el-button type="primary" @click="surePulishFail">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="" :visible.sync="isOkMatchRequireVisible" width="25%" :show-close="false">
        <p>如果操作了小程序发布设置，则当前账号开始正式计费，确定要发布小程序吗？</p>
        <span slot="footer">
          <el-button class="changeBtn" type="text" @click="isOkMatchRequireVisible=false">取 消</el-button>
          <el-button type="primary" @click="surePulish">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="审核状态" :visible.sync="isApprovedStatusVisible" width="30%" @close="isApprovedStatusVisible=false" custom-class="reTechDialog">
        <div class="showTable">
            <dl>
                <dt>小程序模板名称：</dt>
                <dd>{{showList.templateName}}</dd>
            </dl>
            <dl>
                <dt>小程序版本号：</dt>
                <dd>{{showList.vesion}}</dd>
            </dl>
            <dl>
                <dt>审核状态：</dt>
                <dd v-if="showList.status==0">审核成功</dd>
                <dd v-if="showList.status==1">审核失败</dd>
                <dd v-if="showList.status==2">审核中</dd>
            </dl>
            <dl>
                <dt>上传时间：</dt>
                <dd>{{showList.showTime}}</dd>
            </dl>
            <dl>
                <dt>审核说明：</dt>
                <dd>{{showList.errmsg}}</dd>
            </dl>
            <dl>
                <dt>发布状态：</dt>
                <dd>{{showList.releaseStatus == 2 ? '已发布' : '未发布'}}</dd>
            </dl>
          <!--<ul>
            <li v-for="(item,index) in listName" :key="index">{{item}}：</li>
          </ul>
          <ul>
            <li>{{showList.templateName}}</li>
            <li>{{showList.vesion}}</li>
            <li v-if="showList.status==0">审核成功</li>
            <li v-if="showList.status==1">审核失败</li>
            <li v-if="showList.status==2">审核中</li>
            <li>{{showList.showTime}}</li>
            <li>{{showList.errmsg}}</li>
            <li>{{showList.status == 2 ? '已发布' : '未发布'}}</li>
          </ul>-->
        </div>
        <span slot="footer">
          <el-button @click=" isApprovedStatusVisible= false">取消</el-button>
          <el-button type="primary" @click="pushOnline"  v-if="showList.status==0">发布至线上</el-button>
          <el-button type="primary" v-else :disabled="true">发布至线上</el-button>
            <!--<el-button type="primary" @click="pushOnline">发布至线上</el-button>-->
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import vPlayvideo from "components/public/playVideo";
import api from "../../fetch/api";
import { mapGetters } from "vuex";
export default {
  name: "openSetting",
  components: {
    vPlayvideo
  },
  computed: {
    ...mapGetters({
      loginInfo: "getLoginInfo"
    })
  },
  data: function() {
    var checkDesc = (rule, value, callback) => {
      if (value.length <= 20 && value.length > 0) {
        return callback();
      } else {
        callback("请勿输入超过20个字符");
      }
    };
    return {
      isDisabled: false,
      form: {
        userVersion: "",
        userDesc: "",
        accountId: "" // 这个从全局中拿
      },
      rules: {
        userVersion: [
          {
            // required: true,
            validator: checkDesc,
            message: "请输入版本号",
            trigger: "blur"
          }
        ],
        userDesc: [
          {
            // required: true,
            validator: checkDesc,
            trigger: "blur"
          }
        ]
      },

      isNotMatchRequireVisible: false, // 判定当前激活的模板不符合要求
      isOkMatchRequireVisible: false, // 判定当前激活的模板不符合要求
      isApprovedStatusVisible: false,
      verifyData: {
        小程序模板名称: "xx",
        小程序版本号: "1",
        审核状态: 1,
        上传时间: "2018-8-10",
        审核说明: "xxxxx",
        发布状态: "xxx"
      },
      listName: [],
      listValue: [],
      showList: {},
      message: "" // 提示信息
    };
  },
  methods: {
    timeFormat(time) {
        console.log(time)
      if (time == "") return "无";
      let newTime = new Date(time);
      console.log(newTime)
      return `${newTime.getFullYear()}-${newTime.getMonth() +
        1}-${newTime.getDate()}`;
    },
    getSellerInfo() {
      let params = {
        sellerId: this.loginInfo.sellerId
      };
      api.querySellerById(params).then(res => {
          console.log(res)
        this.form = Object.assign(this.form, res);
      });
    },
    onSubmit(formName) {
      // return (this.isNotMatchRequireVisible = true);
      let params = {
        accountId: this.loginInfo.id
      };
      api.queryActivateTemplate(params).then(res => {
        console.log("res iiiiiiiiiiiiii", res);
        if (res.state == 1) {
          this.isOkMatchRequireVisible = true;
        } else if (res.state == 2) {
          this.isNotMatchRequireVisible = true;
          this.message = res.message;
        } else if(res.state == 3) {
            this.isNotMatchRequireVisible = true;
            this.message = res.message;
        } else {
          // return null;
          api.getLatestAuditstatus(params).then(res => {
            if (res.status == 2) {
              this.$message({
                message: "存在审核中的小程序模板，不可重复上传",
                type: "error",
                duration: 1000
              });
              this.isDisabled = true;
            }
          });
        }
      });
      // return (this.isOkMatchRequireVisible = true);
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     let params = {
      //       user_version: this.form.userVersion,
      //       user_desc: this.form.userDesc,
      //       accountId: this.loginInfo.id
      //       // accountId: 1
      //     };
      //     api.testUpload(params).then(res => {
      //       res.retcode == 1
      //         ? this.$messsage.success(res.retmsg)
      //         : this.$message.error(res.retmsg);
      //     });
      //   }
      // });
    },
    getAuthorized() {
      let params = {
        accountId: this.loginInfo.id
        // accountId: 2
      };
      this.isApprovedStatusVisible = true;
      api.getLatestAuditstatus(params).then(res => {
        console.log("res ffffffffis", res);
        this.showList = res;
        this.showList.showTime = this.timeFormat(res.submitTime.time);
        // console.log("this.showTime", this.showList);
          console.log(res.submitTime.time)
        // if(res.errcode==0){

        // }
      });
    },

    surePulishFail() {
      this.isNotMatchRequireVisible = false;
      this.$message.error("发布失败");
    },
    // 确认发布
    surePulish() {
      // let params = {
      //   id: this.loginInfo.sellerId,
      //   userVersion: this.form.userVersion,
      //   userDesc: this.form.userDesc,
      //   accountId: this.loginInfo.id
      // };
      // api.updateSeller(params).then(res => {
      //   console.log("push", res);
      //   res.retcode
      //     ? (this.$message({
      //         message: "上传成功",
      //         type: "success",
      //         duration: 1000
      //       }),
      //       (this.isOkMatchRequireVisible = false))
      //     : that.$message.error(res.retmsg);
      // });

      //   之前调用
      // this.pushOnline();

      //  现在调用
        this.testupload();



      // this.$message.success("上传成功");
    },
    // 发布到线上
    pushOnline() {
      let params = {
        // user_version: this.form.userVersion,
        // user_desc: this.form.userDesc,
        // accountId: this.loginInfo.id
          sellerId: this.loginInfo.sellerId
      };
      const that=this;
      api.pushOnline(params).then(res => {
        // console.log("res is", res);
        if (res.errmsg == "ok") {
          this.$message({
            message: "发布成功",
            type: "success",
            duration: 1000
          });
        }else if(res.errcode==85009){
          this.$message.error('版本正在审核，请勿着急')
        }
        else {
          this.$message.error("发布失败");
        }
        this.isOkMatchRequireVisible = false;
        this.isApprovedStatusVisible = false;
      });
    },

    //  新增 testupload方法 只是请求了testUpload 判断没变
    testupload(){
        let params = {
            user_version: this.form.userVersion,
            user_desc: this.form.userDesc,
            accountId: this.loginInfo.id
        };
        api.testUpload(params).then(res => {
            // console.log("res is", res);
            console.log(res)
            if (res.errmsg == "ok") {
                this.$message({
                    message: "发布成功",
                    type: "success",
                    duration: 1000
                });
            }else if(res.errcode==85009){
                this.$message.error('版本正在审核，请勿着急')
            }
            else {
                this.$message.error("发布失败");
            }
            this.isOkMatchRequireVisible = false;
            this.isApprovedStatusVisible = false;
        });

    },
  },
  created() {
    this.listName = Object.keys(this.verifyData);
    this.getSellerInfo();
  }
};
</script>

<style lang="scss" scoped>
// .openS{
//     .el-form-item__content{
//      // 去ele.css 看
//     }
// }
.mp-wx {
  color: #18CCC0;
  text-decoration: none;
  line-height: 32px;
}

@include buttonPrimary;
.showTable {
  display: flex;
    flex-direction: column;
    dl{
        display: flex;
        line-height: 22px;
        margin-bottom: 24px;
        dt{
            color: RGBA(0, 0, 0, 0.85);
            width: 120px;
            text-align: right;
        }
        dd{
            color: RGBA(0, 0, 0, 0.65);
            text-indent: 20px;
        }
    }
  /*ul {
    &:first-child {
      li {
      }
    }
    &:last-child {
      li {
        text-align: left;
        color: RGBA(0, 0, 0, 0.65);
        padding-left: 20px;
      }
    }
    li {
      @include fontRegular;
      color: RGBA(0, 0, 0, 0.85);
      list-style: none;
      margin-bottom: 24px;
      text-align: right;
      line-height: 22px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }*/
  button {
    &:first-child {
      min-width: 65px;
    }
  }
}
</style>
