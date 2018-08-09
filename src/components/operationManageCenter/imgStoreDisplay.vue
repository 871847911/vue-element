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
    <el-main class="imgStoreDisplayC" id="resetMain">
      <!-- Main content -->
      <el-row>
        <el-col :span="22">
          <span>最多上传5张图片，轮播图片建议750*420</span>
        </el-col>
        <el-col :span="24">
          <el-upload action="http://meiye-dev.vdongchina.com/upload" list-type="picture-card" :http-request="httpRequestSetting" :before-upload="beforeImgUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="5" :file-list="uploadFileList" :show-file-list="true" :on-exceed="onExceed">
            <i class="el-icon-plus">
              <span>
                上传图片
              </span>
            </i>
          </el-upload>
        </el-col>
      </el-row>

      <el-button type="primary" @click="saveImgList">保存</el-button>

      <el-button type="primary" class="cancel" @click="goBack">取消</el-button>

    </el-main>
      <el-dialog title="" :visible.sync="dialogVisible" width="790px" :before-close="handleClose">
          <img :src="dialogImageUrl" alt="">
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
      </el-dialog>

  </el-container>
</template>

<script>
import api from "@/fetch/api";
import store from "@/store/index";
import { mapGetters } from "vuex";

export default {
  name: "imageCarousel",
  data: function() {
    return {
      siteUrl: "",
      // limitSize:5,
        dialogVisible: false,
        dialogImageUrl: '',
      tooLong: false,
      deleteCarouselImgVisble: false,
      imageUrl: "",
      imgList: [
        // {
        //   url: ""
        // }
      ],

      // uploadFileList: [] // 上传的文件列表
      uploadFileList: [
        // {
        //   name: "food.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        // },
        // {
        //   name: "food2.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        // }
      ]
    };
  },
  beforeRouteEnter (to, from, next) {
		if(from.name != null){
	    next();
		}else{
	    next({name : 'operationManageC'})
    }
	},
  computed: {
    ...mapGetters({ storeInfo: "getStoreInfo", loginInfo: "getLoginInfo" })
  },
  methods: {
    goToPage(url) {
      this.$router.push({
        name: `${url}`
      });
    },

    httpRequestSetting(param) {
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
            that.imgList.push({
              url: `${JSON.parse(xhr.responseText).url}`
            });
            console.log("this.imgList is", that.imgList);
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

    beforeImgUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      let params = {
        id: file.id,
        storeId: this.storeInfo.id,
        url: file.url,
        type: file.type
      };
      api.removeTMaterial(params).then(res => {
        res.retcode
          ? this.$message.success(res.retmsg)
          : this.$message.error(res.retmsg);
      });
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 实现图片上传
    upLoadImg(item) {
      let params = {
        storeId: this.storeInfo.id,
        type: 1,
        url: item.url
      };
      return api.addTMaterial(params).then(res => {
        res.retcode
          ? this.$message.success(res.retmsg)
          : this.$message.error(res.retmsg);
      });
    },
    onExceed(files, fileList) {
      // console.log('222222222',files,fileList);
      if (fileList.length == 5) {
        this.$message.error("最多上传五张图片");
      }

    },
    // onChange(file,fileList){
    //   console.log('fileList 2222222is',fileList);
    //   if(fileList.length==6){
    //
    //    fileList.splice(5,1)
    //   }
    // },
    // 保存图片list
    async saveImgList() {
      console.log("this.imgList is", this.imgList);
      await Promise.all(this.imgList.map(this.upLoadImg));
    },
    // 返回上一级页面
    goBack() {
      this.$router.back();
    },
    getShoppicByStore() {
      let params = {
        id: this.storeInfo.id,
        sellerId: this.loginInfo.sellerId
      };
      api.queryShoppicByStore(params).then(res => {
        // 得到结果，再发请求
        console.log("this shop res is", res);
        this.uploadFileList = res.rows;
      });
    }
  },
  created() {
    this.siteUrl = api.siteUrl();
    this.getShoppicByStore();
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
.el-dialog__body{
    img{
        width: 750px;
        height: 420px;
        margin: 0 auto;
    }
}
.el-upload--picture-card .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-upload--picture-card {
  font-size: 28px;
  color: #8c939d;
  width: 104px;
  height: 104px;
  line-height: 104px;
  text-align: center;
}

.el-icon-plus span {
  position: absolute;
  top: 54px;
  left: 20px;
  @include fontRegular;
}

.avatar {
  width: 104px;
  height: 104px;
  display: block;
}

.commonHead .commonCon section.el-container .el-main {
  padding-top: 30px;
}

.imgStoreDisplayC {
  > .el-row {
    margin-bottom: 250px;
    .el-col.el-col-22 {
      span {
        @include fontRegular;
      }
      margin-bottom: 36px;
    }
  }
  .el-button.el-button--primary {
    padding: 8px 16px;
  }
  .el-button.el-button--text {
    border-color: transparent;
  }
}
</style>
