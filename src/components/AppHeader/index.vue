<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="company">梦学谷会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus" command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- status-icon
        校验通过后面有个对勾，失败后面有个叉
     -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width:300px" size="mini">
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password" v-model="ruleForm.newPass" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    // 自定义校验器
    const validateOldPass = (rule,value,callback) => {
        api.checkPass({id:this.user.id,oldPass:value}).then(re => {
          if(re.status === 0){
            callback()
          }else{
            callback(new Error(re.message))
          }
        })
    }

    const validatePass = (rule,value,callback) => {
        if(value !== this.ruleForm.newPass){
          callback(new Error('两次密码不一致'))
        }else{
          callback()
        }
    }
    return {
      user:this.$store.state.user.user,
      dialogFormVisible:false,
      ruleForm:{
        oldPass:'',
        newPass:'',
        checkPass:''
      },
      rules:{
        oldPass:[
          {required:true,message:'原密码不能为空',trigger:'blur'},
          { validator: validateOldPass, trigger: 'blur' }
        ],
        newPass:[
          {required:true,message:'新密码不能为空',trigger:'blur'}
        ],
        checkPass:[
          {required:true,message:'确认密码不能为空',trigger:'blur'},
          { validator: validatePass, trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    submitForm(fromName){
      this.$refs[fromName].validate(valid => {
          if(valid){
              //提交数据
              api.modifyPass({id:this.user.id,newPass:this.ruleForm.newPass}).then(res => {
                  if(res.status === 0){
                      this.dialogFormVisible = false
                      this.$message({
                        type:'warning',
                        message:res.message
                      })
                      this.handleLogout()
                  }else{
                      this.$message({
                          message:res.message,
                          type:'warning'
                      })
                  }
              })
          }else{
              return false
          }
      })
    },
    resetForm(fromName){
      this.$refs[fromName].resetFields()
    },
    handleCommand(command) {
      switch (command) {
        case "a":
          // 修改密码
          this.handlePass()
          break;
        case "b":
          //退出系统
          this.handleLogout()
          break;
        default:
          break;
      }
    },
    handlePass(){
      this.dialogFormVisible = true
      this.$nextTick(() => { 
            // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行 
            // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调 用resetFields方法，重置表单和清除样式 
            this.$refs['ruleForm'].resetFields()
        })
    },
    handleLogout(){
      // const token = localStorage.getItem("mxg-token");
          // api.logout({ token: token }).then(res => {
          //   localStorage.removeItem("mxg-token");
          //   localStorage.removeItem("mxg-user");
          //   this.$router.push("/login");
          // });
          this.$store.dispatch('Logout').then(res => {
              this.$router.push("/login");
          })
    }
  }
}
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