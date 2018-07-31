<template>
<el-container class="resetCT">
    <el-header style="height:54px">
        <el-row class="resetElRow">
            <el-col :span="20">配置服务 </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
            </el-col>
        </el-row>
        <br/>
    </el-header>
    <el-main height="" id="resetMain">
        <el-row>
            <el-form :model="form" ref="form" :rules="rules">
                <el-row>
                    <el-col :span="5" :offset="4">
                        <span>服务名称：</span>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="5" :offset="4">
                        <span>服务海报：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <p>小图尺寸400*300像素，大图尺寸750*420像素，大小不超过2MB</p>
                            <el-col :span="10" :lg="12" :md="20" :sm="20" :xs="20">
                                <el-form-item prop="thumbnailUrl">
                                    <el-upload class="avatar-uploader" :action="siteUrl+'/upload'"
                                    :file-list="fileList"
                                     :http-request='httpRequestSettings' :limit="1" 
                                     list-type="picture-card"
                                      :on-preview="handlePreview" 
                                     :on-remove="handleRemove"

                                      :before-upload="beforeAvatarUpload">
                                        <!-- <img v-if="form.thumbnailUrl" :src="form.thumbnailUrl" class="avatar"> -->
                                        <i class="el-icon-plus avatar-uploader-icon" v-if="isShow">
                                          <span >添加图片</span>
                                        </i>

                                    </el-upload>
                                    <el-dialog  :visible.sync="isImgUrlVisible" width="30%" @close="isImgUrlVisible=false">
                                        <img :src='imgUrl' width="400" height="400"/>
                                    </el-dialog>
                                </el-form-item>
                                <span >小图用于预览</span>
                            </el-col>
                            <el-col :span="11" :lg="12" :md="20" :sm="20" :xs="20">
                                <el-form-item prop="serverUrl">
                                    <el-upload class="avatar-uploader" :action="siteUrl+'/upload'"
                                    :file-list="fileList1"
                                    
                                     :http-request='httpRequestSettings1' 
                                     :limit="1" 
                                     list-type="picture-card" 
                                     :on-preview="handlePreview1" 
                                     :on-remove="handleRemove1"
                                     :before-upload="beforeAvatarUpload">
                                        <i class="el-icon-plus avatar-uploader-icon bigIcon" v-if="isShow1">
                                          <span >添加图片</span>
                                        </i>
                                    </el-upload>
                                 
                                </el-form-item>
                                <span >大图用于大图预览以及详情页展示</span>
                                   <el-dialog  :visible.sync="isImgUrlVisible1" width="30%" @close="isImgUrlVisible1=false">
                                     <img :src='imgUrl1' width="400" height="400"/>
                                    </el-dialog>
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
                    <el-col :span="5" :offset="4">
                        <span>所属服务类型：</span>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="serverTypeId">
                            <el-select v-model="form.serverTypeId " placeholder="请选择服务类型" class="techSelect">
                                <el-option v-for="item in typeOfSerList" :key="item.value" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5" :offset="4">
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
                    <el-col :span="5" :offset="4">
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
                    <el-col :span="5" :offset="4">
                        <span>
                            服务介绍：
                          </span>
                    </el-col>
                    <el-col :span="11">
                        <span>全文限制上传10张图片，1000字符，每张图片限制大小2MB，为避免图片严重失真，建议宽度为750像素</span>
                        <div class="richText">
                            <!-- <div id="editor" type="text/plain"></div> -->
                            <!-- bidirectional data binding（双向数据绑定） -->
                            <!-- <quill-editor v-model="content" ref="myQuillEditor" 
                            :options="editorOption" @blur="onEditorBlur($event)" 
                            @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
                            </quill-editor> -->
                            <!-- -->
                            <quill-editor :content="content" ref="myQuillEditor" :options="editorOption"  @change="onEditorChange($event)">
                            </quill-editor>
                            <!-- <div class="limit">当前已输入 <span>{{nowLength}}</span> 个字符，您还可以输入 <span>{{SurplusLength}}</span> 个字符。</div> -->
                        </div>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="13" :offset="9">
                        <el-button type="primary" @click="onSubmit('form',true)">确认修改</el-button>
                        <el-button @click="goBack">取消</el-button>
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
// you can also register quill modules in the component
// import Quill from "quill";
// import { someModule } from "../yourModulePath/someQuillModule.js";
// Quill.register("modules/someModule", someModule);
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";

Quill.register("modules/ImageExtend", ImageExtend);
export default {
  name: "modifyService",
  components: { quillEditor },
  data: function() {
    var checkName = (rule, value, callback) => {
      if (new RegExp(/^[\u4e00-\u9fa5a-zA-Z]{1,10}$/).test(value)) {
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
      content: "",
      fullscreenLoading: false,
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: "multipartFile",
            size: 2,
            // action: "http://meiye-hz.vdongchina.com/upload",
            action: `${this.siteUrl}/upload`,
            response: res => {
              console.log("res is", res);
              return res.url;
            },
            headers: xhr => {
              // xhr.open("PUT", "http://meiye-hz.vdongchina.com/upload");
              xhr.open("PUT", `${this.siteUrl}/upload`);
            }, // 可选参数 设置请求头部
            sizeError: () => {
              this.$message.error("上传的图片大小请勿2MB");
            }, // 图片超过大小的回调
            start: () => {}, // 可选参数 自定义开始上传触发事件
            end: () => {
              // this.$message.error("上传数据结束");
              this.content.match(new RegExp(/\<img.*\>$/g)).length < 10
                ? ""
                : this.$message.error("最多上传十张图片");
            }, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
            error: () => {
              this.$message.error("上传数据失败");
            }, // 可选参数 上传失败触发的事件
            success: () => {
              // console.log('res',res);
            }, // 可选参数  上传成功触发的事件
            change: (xhr, formData) => {
              // xhr.setRequestHeader('myHeader','myValue')
              // formData.append('multipartFile', 'myToken')
            } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },
          toolbar: {
            container: [
              [{ size: ["small", false, "large"] }],
              ["bold", "italic"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"]
            ],
            handlers: {
              image: function() {
                QuillWatch.emit(this.quill.id);
              }
            }
          }
        }
      },
      fileList: [
        {
          name: "",
          url: ""
        }
      ],
      fileList1: [
        {
          name: "",
          url: ""
        }
      ],
      isShow: true,
      isShow1: true,
      // editor: null,
      nameOfSer: "", // 服务名称
      // imgUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2107961350,3702928033&fm=27&gp=0.jpg",
      imgUrl: "",
      imgUrl1: "",
      isImgUrlVisible: false,
      isImgUrlVisible1: false,
      typeOfSerList: [],
      form: {
        name: "",
        thumbnailUrl: "",
        serverUrl: "", // 服务大图
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
      storeInfo: "getStoreInfo",
      serverInfo: "getServerInfo"
    }),
    nowLength: function() {
      return this.content.length;
    },
    SurplusLength: function() {
      let num = 10000 - Number(this.content.length);
      if (num > 0) {
        return num;
      } else {
        return 0;
      }
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, text);
      let textLen = text.length;
      if (textLen > 1000) {
        this.$message.error("最多输入1000字符");
      }
      // this.content = html;
      console.log("ddd", html);

      this.content = html;
    },
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
      xhr.open("POST", fileController, true);
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
    httpRequestSettings1(param) {
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
            that.$message.success("上传图片成功");
            that.imgUrl1 = JSON.parse(xhr.responseText).url;
            that.form.serverUrl = JSON.parse(xhr.responseText).url;
            that.isShow1 = false;
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
    handlePreview1(file) {
      console.log("1112");
      this.form.serverUrl = file.url;
      this.isImgUrlVisible1 = true;
    },
    handleRemove() {
      this.isShow = true;
    },
    handleRemove1() {
      this.isShow1 = true;
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
          let serverName = this.typeOfSerList.find(
            item => item.id == this.form.serverTypeId
          ).name;
          let params = {
            storeId: this.storeInfo.id,
            id: this.serverInfo.id,
            name: this.form.name,
            thumbnailUrl: this.form.thumbnailUrl,
            serverUrl: this.form.serverUrl,
            serverTypeId: this.form.serverTypeId,
            serverTypeName: serverName,
            time: this.form.time,
            detail: this.content,
            price: this.form.price
          };
          api.updateServer(params).then(res => {
            // console.log("res is", res);

            if (res.retcode) {
              this.$message.success(res.retmsg);
              this.$refs[formName].resetFields();
              this.content = "";
              this.form.authorImgUrl = "";
              this.form.serverUrl = "";
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
    this.getSerTypeList();
    this.siteUrl = api.siteUrl();
    this.form = Object.assign(this.form, this.serverInfo);
    this.fileList[0].url = this.serverInfo.thumbnailUrl;
    this.fileList1[0].url = this.serverInfo.serverUrl;
    this.isShow = false;
    this.isShow1 = false;
    this.content = this.form.detail;
  },
  mounted() {
    // this.editor = UE.getEditor("editor");
  },
  destroyed() {
    // this.editor.destroy();
  }
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
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 104px;
  height: 76px;
  line-height: 50px;
  text-align: center;
  border: 1px solid RGBA(0, 0, 0, 0.15);
  border-radius: 4px;
}

.avatar-uploader-icon span {
  position: absolute;
  top: 44px;
  left: 26px;
  @include fontRegular;
}

.bigIcon {
  min-width: 158px;
  span {
    width: 100px;
    left: 30px;
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

span,
p {
  line-height: 32px;
  @include fontRegularBlack;
}

.techSelect {
  width: 100%;
}

.techSpan {
  color: RGBA(155, 155, 155, 1);
  font-weight: 500;
}

.el-col.el-col-13.el-col-offset-9 {
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

.richText {
  max-width: 602px;
}
</style>
