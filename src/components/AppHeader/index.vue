<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="company">梦学谷会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus" command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import api from "@/api";
export default {
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          // 修改密码
          console.log("修改密码");
          break;
        case "b":
          //退出系统
          //1.获取本地token
          const token = localStorage.getItem("mxg-token");
          api.logout({ token: token }).then(res => {
            localStorage.removeItem("mxg-token");
            localStorage.removeItem("mxg-user");
            this.$router.push("/login");
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0px 40px;
}
.company {
  position: absolute;
  color: white;
}
/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
</style>