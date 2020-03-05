<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="8">
          <img src="../../assets/images/logo.jpg" alt />
        </el-col>
        <el-col :span="8">
          <h1>电商后台管理</h1>
        </el-col>
        <el-col :span="8" class="col_r">
          <el-button type="warning" class="col_r-btn" @click="loginOut"
            >退出</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧栏 -->
      <!--
        el-menu ：菜单组件
        default-active="2" 默认选中 默认高亮
        -@open="handleOpen"
        -@close="handleClose"
        el-submenu 菜单子组件 （可展开）
        el-men-item 菜单元素 （最小单位）
      -->
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
        >
          <!-- 用户管理 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menus"
            :key="item.id"
          >
            <!-- 标题 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- :index="'/'+item1.path" 路由对象 -->
            <el-menu-item
              :index="'/' + item1.path"
              v-for="item1 in item.children"
              :key="item1.id"
              >{{ item1.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      menus: []
    };
  },
  created() {
    this.loadMenusData();
  },
  methods: {
    // 退出登录
    async loginOut() {
      try {
        await this.$confirm("此操作将退出登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        //清除token
        localStorage.removeItem("token");
        //提示
        this.$message({
          type: "success",
          message: "成功退出",
          duration: 800
        });
        //3、跳转到login
        this.$router.push("/login");
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消操作",
          duration: 800
        });
        // this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {
        // //清除token
        // localStorage.removeItem("token");
        // //提示
        // this.$message({
        //   type: "success",
        //   message: "成功退出",
        //   duration: 800
        // });
        // //3、跳转到login
        // this.$router.push("/login");
        //   })
        // .catch(() => {
        // this.$message({
        //   type: "info",
        //   message: "已取消操作",
        //   duration: 800
        //   });
        //   });
      }
    },
    async loadMenusData() {
      let res = await this.$axios.get("menus");
      // console.log(res);
      this.menus = res.data.data;
    }
  }
};
</script>

<style scoped lang="less">
/* 外部盒子 */
.el-container {
  height: 100%;
  min-width: 900px;
}
/* 头部 */
.el-header {
  background-color: #b3c1cd;
  padding: 0;
  .el-col img {
    font-size: 0;
    height: 60px;
    width: 200px;
  }
  h1 {
    font-size: 26px;
    text-align: center;
    line-height: 60px;
  }
  .col_r {
    text-align: right;
    line-height: 60px;
    .col_r-btn {
      margin-right: 10px;
    }
  }
}
/* 主体 */
.el-main {
  background-color: whitesmoke;
}

/* 侧栏 */
.el-aside {
  background-color: #545c64;
}
</style>
