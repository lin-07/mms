<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-form">
      <h2 class="login-title">梦学谷会员管理系统</h2>
      <el-form-item label="帐号" prop="username">
        <el-input v-model="form.username" placeholder="请输入帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from "@/api";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('Login',this.form).then(res => {
            if(res.status === '0'){
                // 前往首页
                this.$router.push("/");
            }else{
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          })
          // api.userLogin(this.form).then(re => {
          //   if (re.status === "0") {
          //     //验证成功,通过token获取用户信息
          //     api.getUserInfo(re.data).then(res => {
          //       if (res.status === "0") {
          //         localStorage.setItem("mxg-user", JSON.stringify(res.data));
          //         localStorage.setItem("mxg-token", re.data.token);
          //         // 前往首页
          //         this.$router.push("/");
          //       } else {
          //         this.$message({
          //           message: res.message,
          //           type: "warning"
          //         });
          //       }
          //     });
          //   } else {
          //     this.$message({
          //       message: re.message,
          //       type: "warning"
          //     });
          //   }
          // });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/login.jpg");
  overflow: hidden;
}
.login-title {
  color: #303133;
  text-align: center;
}
</style>