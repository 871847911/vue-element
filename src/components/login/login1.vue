<template>
<div id="login">
    <el-dialog title="登录" :visible='!isLogin' width="30%" :show-close="false" >

        <el-form :model="form" ref="form" label-width="80px" :rules="rules">
            <el-form-item label="账号：" prop="name">
                <el-input v-model="form.name" class="login_name" placeholder="请输入登陆账号"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="form.password" type="password" class="login_password" placeholder="请输入登陆密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="toLogin" type="primary" @click="onSubmit('form')">登陆</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

</div>
</template>

<script>
import store from "../../store/index";
import { mapState, mapGetters, mapActions } from "vuex";
import api from "@/fetch/api";
export default {
  name: "logIn",
  computed: {
    // ...mapState(["isLogin"])
    ...mapGetters({
      isLogin: "getIsLogin"
    })
  },
  data() {
    var checkName = (rule, value, cb) => {
      if (value.length < 20 && value.length > 0) {
        return cb();
      } else {
        return cb("请输入账户");
      }
    };
    var checkPassword = (rule, value, cb) => {
      if (value.length < 20 && value.length > 0) {
        return cb();
      } else {
        return cb("请输入密码");
      }
    };
    return {
      form: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          { validator: checkName, message: "请输入账户", trigger: "blur" }
        ],
        password: [
          { validator: checkPassword, message: "请输入密码", trigger: "blur" }
        ]
      },
      isLoginState: false
    };
  },
  methods: {
    ...mapActions(["changeIsLogin"]),
    onSubmit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          let params = {
            username: this.form.name,
            password: this.form.password
          };
          // this.$router.replace({ name: "totalManageC" });
          // store.dispatch("changeIsLogin", true);

          api
            .queryAccount(params)
            .then(res => {
              if (res.message) {
                this.$message.error(res.message);
              } else {
                this.$router.replace({ name: "totalManageC" });
                store.dispatch("changeIsLogin", true);
              }
            })
            .catch(err => this.$message.error(err));
        }
      });
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
#login {
  //   background: url("/assets/images/login_bg.jpg");
  background: red;
  background-size: 100% 100%;
}
</style>
