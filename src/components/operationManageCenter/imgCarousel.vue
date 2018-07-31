<template>
<el-container class="resetCT">
    <el-header style="height:54px">
        <el-row class="resetElRow">
            <el-col :span="20">太美丽江南大道店</el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goToPage('store')">修改店铺信息</el-button>
            </el-col>
        </el-row>
        <br/>
    </el-header>
    <el-main class="imgCarouselC" id="resetMain">
        <!-- Main content -->
        <el-row>
            <el-col :span="22">
                <span>轮播图数量限制1-8,轮播图片建议750*340</span>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="appendCarousel" :disabled="tooLong">
                    添加轮播
                </el-button>
            </el-col>
        </el-row>
        <el-form :model="form" ref="form" label-width="80px" :inline="true" label-position="top">
            <el-row>
                <el-col :span="8">
                    <p>编号</p>
                </el-col>
                <el-col :span="8">
                    <p>图片</p>
                </el-col>
                <el-col :span="8">
                    <p>操作</p>
                </el-col>

            </el-row>

            <el-row v-for="(item,index) in form.imgList" :key='index'>
                <el-col :span="8">
                    <el-form-item label="">
                        {{index+1}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="" style="width:100%">

                        <input :id="'imgUpload'+index" class="inputfile" type="file" @change="beforeUpload($event,index,item)" />
                        <label :for="'imgUpload'+index">
                          <!-- v-if="saveImgList[index].url.length<2" -->
                             <i class="el-icon-plus avatar-uploader-icon"  v-if="saveImgList[index].url.length<2" >
                                <span >添加图片</span>
                            </i>
                            <img class="preveView" v-if="saveImgList[index].url" :src="saveImgList[index].url"  />
                        </label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">

                    <el-form-item label="">
                        <span v-if="item.status">无法删除</span>
                        <el-button v-else type="text" @click="deleteImg(index,item)">删除</el-button>
                    </el-form-item>
                </el-col>

            </el-row>
            <!-- </el-row> -->
        </el-form>

        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button type="primary" @click="goBack" class="cancel">取消</el-button>
        <el-dialog :show-close="false" :visible.sync="deleteCarouselImgVisble" width="25%" @close="deleteCarouselImgVisble=false" custom-class="imgDialog">
            <div>
                <img src="../../assets/images/delete3.png" alt="icon">
                <span>确认删除此图片嘛？</span>
            </div>
            <span slot="footer">
                <el-button @click="deleteCarouselImgVisble = false">取 消</el-button>
                <el-button type="primary" @click="sureDelete">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>

</el-container>
</template>

<script>
import api from "../../fetch/api";
import store from "@/store/index";
import { mapGetters } from "vuex";
import imgManageVue from "./imgManage.vue";
export default {
  name: "imageCarousel",
  components: {},
  data: function() {
    return {
      tooLong: false, // 控制添加的数量
      deleteCarouselImgVisble: false, // 控制dialog的状态
      form: {
        imgList: [
          // {
          //   file: {}, // 要上传的文件
          //   status: 0
          // }
        ]
      },
      saveImgList: [
        // {
        //   url: ""
        // }
      ], // 存放上传之后的图片地址
      siteUrl: "", // 从api中得到的站点url
      imgIndex: 0, // 序号
      imgObj: {}, // 单个文件对象，充当中间变量
      trueImgList: [], // 最后形成的img数据，
      uploadImgUrl: "", // 要更新的图片地址
      imgId: "" // 图片Id
    };
  },
  computed: {
    ...mapGetters({
      storeInfo: "getStoreInfo",
      loginInfo: "getLoginInfo"
    })
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    goToPage(url) {
      this.$router.push({
        name: `${url}`
      });
    },

    // 得到图片列表
    getImgCarouselList() {
      api
        .querySlideshowByStore({
          id: this.storeInfo.id,
          sellerId: this.loginInfo.sellerId
        })
        .then(res => {
          console.log("res333 is", res);
          this.form.imgList = Array.from(res.rows);
          this.imgIndex = res.size;
          this.saveImgList = Array.from(res.rows);
          if (res.size >= 8) return (this.tooLong = true);
        });
    },
    // 文件上传的接口中进行图片上传
    imgUploading(fileObj) {
      const siteUrl = this.siteUrl;
      console.log("param ", fileObj);
      const that = this;
      const fileController = `${this.siteUrl}/upload`;
      let form = new FormData();
      form.append("multipartFile", fileObj);
      let xhr = new XMLHttpRequest();
      xhr.open("PUT", fileController, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            that.trueImgList.push({
              url: JSON.parse(xhr.responseText).url
            });
            // that.$message.success("上传图片成功");
            // 得到img URL
            // that.imageUrl = `${that.siteUrl}${
            //   JSON.parse(xhr.responseText).path
            // }`;
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
    imgUpdateBefore(fileObj) {
      const siteUrl = this.siteUrl;
      console.log("param ", fileObj);
      const that = this;
      const fileController = `${this.siteUrl}/upload`;
      let form = new FormData();
      form.append("multipartFile", fileObj);
      let xhr = new XMLHttpRequest();
      xhr.open("PUT", fileController, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            that.uploadImgUrl = JSON.parse(xhr.responseText).url;
            // that.$message.success("上传图片成功");
            // 得到img URL
            // that.imageUrl = `${that.siteUrl}${
            //   JSON.parse(xhr.responseText).path
            // }`;
            that.imgUpdate();
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
    // 更新已有的图片链接
    imgUpdate() {
      let params = {
        id: this.imgId,
        storeId: this.storeInfo.id,
        type: 0,
        url: this.uploadImgUrl
      };
      api.updateTMaterial(params).then(res => {
        res.retcode
          ? this.$message.success(res.retmsg)
          : this.$message.error(res.retmsg);
      });
    },
    // 在图片上传之前的检查
    beforeUpload(event, index, item) {
      console.log("event is", index, item);

      const files = event.target.files;
      console.log("files are ", files);
      const fileType = files[0].type;
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
      const isLt2M = files[0].size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      if (isLt2M && isApproved) {
        this.saveImgList[index].url = window.URL.createObjectURL(files[0]);
        if (index < this.imgIndex) {
          // 更新图片
          this.imgUpdateBefore(files[0]);
          this.imgId = item.id;
        } else {
          //   this.saveImgList[index].url = window.URL.createObjectURL(files[0]);
          this.imgUploading(files[0]);
        }

        // this.saveImgList.push(files[0]);
        console.log("this.saveImgList is", this.saveImgList);
      }
    },

    // 增加上传图片的列表
    appendCarousel() {
      this.form.imgList.push({
        file: {},
        status: 0
      });
      if (Array.from(this.form.imgList).length > 7) {
        this.tooLong = true;
      }
      this.saveImgList.push({
        url: ""
      });
      console.log("this.saveImgList is", this.saveImgList);
    },
    deleteImg(index, item) {
      console.log("index,item", index, item);
      console.log("this.formLisssssssssssss", this.form);
      if (!item.id) {
        this.$message.error("无可删除的图片");
      } else {
        this.imgIndex = index;
        this.imgObj = item;
        this.deleteCarouselImgVisble = true;
        this.tooLong = false;
      }
    },
    sureDelete() {
      if (this.form.imgList.length < 2)
        return (
          this.$message.error("至少要添加一张"),
          (this.deleteCarouselImgVisble = false)
        );
      if (this.form.imgList.length == 2 && !this.form.imgList[1].id)
        return (
          this.$message.error("至少要添加一张"),
          (this.deleteCarouselImgVisble = false)
        );
      this.form.imgList.splice(this.imgIndex, 1);
      this.saveImgList.splice(this.imgIndex, 1);
      this.deleteCarouselImgVisble = false;
      let params = {
        id: this.imgObj.id,
        storeId: this.storeInfo.id,
        url: this.imgObj.url,
        type: this.imgObj.type
      };

      api.removeTMaterial(params).then(res => {
        res.retcode
          ? this.$message.success(res.retmsg)
          : this.$message.error(res.retmsg);
      });
    },
    // 实现图片上传
    upLoadImg(item) {
      let params = {
        storeId: this.storeInfo.id,
        type: 0,
        url: item.url
      };
      console.log("item is", item);
      return api.addTMaterial(params).then(res => {
        res.retcode
          ? this.$message.success(res.retmsg)
          : this.$message.error(res.retmsg);
      });
    },
    async onSubmit() {
      // for (let item of this.trueImgList) {
      //   await this.upLoadImg(item);
      // }
      await Promise.all(this.trueImgList.map(this.upLoadImg));
    },
    // 返回上一级页面
    goBack() {
      this.$router.back();
    }
  },
  created() {
    this.siteUrl = api.siteUrl();
    this.getImgCarouselList();
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
  border-color: #18CCC0;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 104px;
  height: 104px;
  line-height: 64px;
  background-color: RGBA(0, 0, 0, 0.02);
  text-align: center;
  border: 1px solid RGBA(0, 0, 0, 0.15);
  border-radius: 4px;
  &:hover {
    border-color: #18CCC0;
  }
}

.avatar-uploader-icon span {
  position: absolute;
  top: 44px;
  left: 26px;
  @include fontRegular;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.commonHead .commonCon section.el-container .el-main {
  // padding-top: 24px;
  padding: 24px 32px 0 32px; // padding-right: 32px;
}

.imgCarouselC {
  > .el-row {
    .el-col.el-col-22 {
      span {
        @include fontRegular;
      }
    }
    .el-col.el-col-2 {
      text-align: right;
      .el-button {
        padding: 8px 16px;
      }
    }
  }
  .el-form {
    margin-bottom: 32px;
    .el-row {
      border-bottom: 1px solid RGBA(232, 232, 232, 1);
      display: flex;
      align-items: center;
      &:hover {
        // background-color: RGBA(220, 245, 243, 1);
      }
    }
    > .el-col.el-col-8 {
      .el-form-item {
        // margin-left: 16px; 去ele.css
      }
    }
  }
  > .el-button.el-button--primary {
    padding: 8px 16px;
    // .cancel {
    //   background-color: #fff;
    // }
  }

  .el-button.el-button--text {
    border-color: transparent;
  }
  #imgUploadCt {
    width: 104px;
    height: 104px;
    border: 1px solid #ccc;
    &:hover {
      border: 1px solid #18CCC0;
    }
  }
  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .inputfile + label {
    font-size: 1.25em;
    font-weight: 700;
    color: white; // background-color: black;
    display: inline-block;
  }
  .inputfile:focus + label,
  .inputfile + label:hover {
    // background-color: red;
    cursor: pointer;
  }
  .preveView {
    width: 104px;
    height: 104px;
  }
  p {
    height: 54px;
    font-weight: 700;
    background: rgba(250, 250, 250, 1);
    border-radius: 4px 4px 0px 0px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 54px;
    border-bottom: 1px solid RGBA(232, 232, 232, 1);
    &:first-child {
      padding-left: 16px;
    }
  }
}
</style>
