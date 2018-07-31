<template>
<el-container>
    <el-header style="height:54px">
           <el-row class="resetElRow">
            <el-col :span="20">添加服务 </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
            </el-col>
        </el-row>
        <br/>
    </el-header>
    <el-main height="">
        <el-row>
            <el-form :model="form" ref="form" :rules="rules">
                <el-row>
                    <el-col :span="2" :offset="7">
                        <span>服务名称：</span>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="2" :offset="7">
                        <span>服务海报：</span>
                    </el-col>
                    <el-col :span="7">
                        <el-row>
                            <span>小图尺寸200*200像素，大图尺寸710*340像素，大小不超过2MB</span>
                            <el-col :span="10">
                                <el-form-item prop="thumbnailUrl">
                                    <el-upload class="avatar-uploader" action="http://meiye-dev.vdongchina.com/upload" :http-request='httpRequestSettings' :show-file-list="false" list-type="picture" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                        <img v-if="form.thumbnailUrl" :src="form.thumbnailUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon">
                                          <span >添加图片</span>
                                        </i>

                                    </el-upload>
                                    <img :src='imgUrl' @click="isImgUrlVisible=true" />
                                    <el-dialog  :visible.sync="isImgUrlVisible" width="30%" @close="isImgUrlVisible=false">
                                        <img :src='imgUrl' width="400" height="400"/>
                                    </el-dialog>
                                </el-form-item>
                                <span>小图用于预览</span>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item prop="thumbnailUrl">
                                    <el-upload class="avatar-uploader" action="http://meiye-dev.vdongchina.com/upload" :http-request='httpRequestSettings' :show-file-list="false" list-type="picture" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                        <img v-if="form.thumbnailUrl" :src="form.thumbnailUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon bigIcon">
                                          <span >添加图片</span>
                                        </i>
                                    </el-upload>
                                    <img :src='imgUrl' @click="isImgUrlVisible=true" />
                                    <el-dialog  :visible.sync="isImgUrlVisible" width="30%" @close="isImgUrlVisible=false">
                                        <img :src='imgUrl' width="400" height="400"/>
                                    </el-dialog>
                                </el-form-item>
                                <span>大图用于大图预览以及详情页展示</span>
                            </el-col>
                            <!-- <el-col :span="14">
                                <el-form-item>
                                    <img :src='imgUrl' @click="isImgUrlVisible=true" />
                                    <el-dialog title="个人头像" :visible.sync="isImgUrlVisible" width="30%" @close="isImgUrlVisible=false">
                                        <img :src='imgUrl' />
                                    </el-dialog>
                                </el-form-item>
                                <span>大图用于大图预览以及详情页展示</span>
                            </el-col> -->
                        </el-row>

                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="7">
                        <span>所属服务类型：</span>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item prop="serverTypeId">
                            <el-select v-model="form.serverTypeId " placeholder="请选择服务类型" class="techSelect">
                                <el-option v-for="item in typeOfSerList" :key="item.value" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="7">
                        <span>预计服务时长：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item prop="time">
                            <el-input v-model="form.time" placeholder="请填写服务时长（分钟）">分钟</el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="6" class="techSerSpan">
                        <span>请设置10-120分钟整数</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="7">
                        <span>指导价：</span>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item prop="price">
                            <el-input v-model="form.price" placeholder="请填写指导价（元）">元</el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="techSerSpan">
                        <span>请设置0-5000元整数</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="7">
                        <span>
                            服务介绍：
                          </span>
                    </el-col>
                    <el-col :span="10">
                        <span>全文限制上传10张图片，1000字符，每张图片限制大小2MB，为避免图片严重失真，建议宽度为750像素</span>
                        <div>
                            <div id="editor" type="text/plain"></div>
                        </div>

                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="7" :offset="9">
                        <el-button type="primary" @click="onSubmit('form')">确定并添加下一个</el-button>
                        <el-button type="primary" @click="onSubmit('form',true)">确认添加</el-button>
                        <el-button @click="goBack">返回</el-button>
                    </el-col>
                </el-row>

            </el-form>

        </el-row>
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
      if (new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/).test(value)) {
        return callback();
      } else {
        callback("请输入中文、英文字符，最多不超过10个");
      }
    };
    var checkTime = (rule, value, callback) => {
      if (
        Number(value) >= 10 &&
        Number(value) <= 120 &&
        Math.floor(Number(value)) == Number(value)
      ) {
        return callback();
      } else {
        callback("请设置10-120分钟整数");
      }
    };
    var checkPrice = (rule, value, callback) => {
      if (
        Number(value) >= 0 &&
        Number(value) <= 5000 &&
        Math.floor(Number(value)) == Number(value)
      ) {
        return callback();
      } else {
        callback("请设置0-5000元整数");
      }
    };

    var checkDetail = (rule, value, callback) => {
      if (new RegExp(/^[\u4e00-\u9fa5a-zA-Z0-9]{1,1000}$/).test(value)) {
        return callback();
      } else {
        callback("请输入中文、英文字符");
      }
    };
    return {
      editor: null,
      nameOfSer: "", // 服务名称
      // imgUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2107961350,3702928033&fm=27&gp=0.jpg",
      imgUrl: "",
      isImgUrlVisible: false,
      typeOfSerList: [
        {
          label: "sexy",
          value: "sexy"
        }
      ],
      form: {
        name: "",
        thumbnailUrl: "",
        serverTypeId: "",
        time: "",
        price: "",
        detail: ""
      },
      rules: {
        name: [
          {
            validator: checkName,
            required: true,
            trigger: "blur"
          }
        ],

        thumbnailUrl: [
          {
            required: true,
            message: "请上传头像",
            trigger: "blur"
          }
        ],
        serverTypeId: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ],
        time: [
          {
            validator: checkTime,
            required: true,
            trigger: "blur"
          }
        ],
        price: [
          {
            validator: checkPrice,
            required: true,
            trigger: "blur"
          }
        ],
        detail: [
          {
            validator: checkDetail,
            required: true,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      storeInfo: "getStoreInfo"
    })
  },
  methods: {
    goToPage(url) {
      this.$router.push({
        name: `${url}`
      });
    },
    // 得到服务类型
    getSerTypeList() {
      let params = {
        storeId: this.storeInfo.id,
        name: this.typeOfSer
      };
      api.queryServerTypePage(params).then(res => {
        this.typeOfSerList = res.rows;
      });
    },
    // 图片上传的设置
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
            // that.imgUrl = `${that.siteUrl}${JSON.parse(xhr.responseText).path}`;
            // that.form.thumbnailUrl = `${that.siteUrl}${
            //   JSON.parse(xhr.responseText).path
            // }`;
            that.imgUrl = JSON.parse(xhr.responseText).url;
            that.form.thumbnailUrl = JSON.parse(xhr.responseText).url;
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
    handleAvatarSuccess(res, file) {
      //   this.imageUrl = URL.createObjectURL(file.raw);
      //   this.form.authorImgUrl = URL.createObjectURL(file.raw);
      console.log("result is:", res);
      this.form.authorImgUrl = res.path;
    },
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
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M && isApproved;
    },
    // 添加服务
    onSubmit(formName, isBack = false) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            name: this.form.name,
            serverUrl: this.imgUrl,
            serverTypeId: this.form.serverTypeId,
            time: this.form.time,
            detail: this.form.detail,
            price: this.form.price
          };
          api.addServer(params).then(res => {
            // console.log("res is", res);
            res.retcode
              ? (this.$message.success(res.retmsg),
                this.$refs[formName].resetFields())
              : this.$message.error(res.retmsg);
            isBack ? this.goBack() : null;
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
    this.getSerTypeList();
    this.siteUrl = api.siteUrl();
  },
  mounted() {
    this.editor = UE.getEditor("editor");
  },
  destroyed() {
    this.editor.destroy();
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
}

.avatar-uploader-icon span {
  position: absolute;
  top: 64px;
  left: 26px;
  @include fontRegular;
}
.bigIcon {
  width: 180px;
  span {
    left: 64px;
  }
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-col.el-col-2.el-col-offset-7 {
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

.el-col.el-col-7.el-col-offset-9 {
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
  .el-input {
    width: 90%;
  }
  span {
    color: #18ccc0;
  }
}

.techSerSpan {
  margin-left: 24px;
}

#editor {
  width: 510px; // height: 359px;
}
</style>
