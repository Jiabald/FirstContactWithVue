<template>
  <!-- el-form 表单组件
    :model="ruleform" 和表单绑定的数据对象(ruleForm 对象)

    el-form-item 表单元素组件
  -->
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="8">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <!--
        primary主要
        success成功
        warning警告
          -->
          <el-button type="success" @click="startLogin()">登录</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
// 引入axios
/* eslint-disable */
import axios from "axios";

/* eslint-disable */
export default {
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //开始登录
    startLogin() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return alert("格式不正确");
        }
        let res = await axios.post("login", this.ruleForm);
        //token
        // console.log(res);
        if (res.data.meta.status === 200) {
          //0、把token保存到本地
          localStorage.setItem("token", res.data.data.token);
          //登录提示框
          this.$message({
            message: "恭喜你，登陆成功",
            type: "success",
            duration: 900
          });
          //跳转到home页
          this.$router.push("/home");
        } else {
          // 登陆失败提示框
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 900
          });
        }
      });
      //   this.$refs.ruleForm.validate(valid => {
      //     // console.log(valid);
      //     if (!valid) {
      //       //   alert("submit!");
      //       return;
      //     }
      //     axios
      //       .post("http://localhost:8888/api/private/v1/login", this.ruleForm)
      //       .then(res => {

      // // console.log(res);
      // if (res.data.meta.status === 200) {
      // //0、把token保存到本地

      //   localStorage.setItem("token", res.data.data.token);
      //   //登录
      //   this.$message({
      //     message: "恭喜你，登陆成功",
      //     type: "success",
      //     duration: 900
      //   });
      //   //跳转到home页
      //   this.$router.push("/home");
      // } else {
      //   this.$message({
      //     message: res.data.meta.msg,
      //     type: "error",
      //     duration: 900
      //   });
      // }
      //       });
      //   });
    },
    resetForm() {
      //重置表单
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style scoped>
.el-row {
  background-color: bisque;
  height: 100%;
}
.el-col {
  padding: 20px 30px;
  background-color: #fff;
}
</style>
