/* eslint-disable */
// import axios from "axios";
export default {
  data() {
    return {
      //用户列表数据
      usersData: [
        {
          username: "大炮",
          email: "qq@163.com",
          mobile: "1555555"
        }
      ],
      // 总个数
      total: null,
      // 当前页
      pagenum: 1,
      // 查询内容
      queryText: null,
      // 用户状态
      // state: true,
      // 是否 显示添加用户 对话框
      dialogAddUsersFormVisible: false,
      // 表单对象
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          // 判断是否有输入内容
          { required: true, message: "请输入用户名", trigger: "blur" },
          // 判断格式是否正确
          { min: 3, max: 5, message: "输入的字符应为3-5之间", trigger: "blur" }
        ],
        password: [
          // 判断是否有输入内容
          { required: true, message: "请输入密码", trigger: "blur" },
          // 判断格式是否正确
          {
            min: 6,
            max: 10,
            message: "输入的字符应为6-10之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            pattern: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
            message: "格式错误",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            // 填写正则
            pattern: /^1[3456789]\d{9}$/,
            message: "格式错误",
            trigger: "blur"
          }
        ]
      },
      // 第二个编辑用户对话框
      dialogEditUserFormVisible: false,
      // 编辑用户数据
      EditUserForm: {
        id: "",
        username: "dapao",
        email: "",
        mobile: ""
      },
      // 分配角色对话框
      dialogAssianRolesFormVisible: false,
      assionRolesForm: {
        username: "dapao",
        rid: "",
        id: ""
      },
      rolesData: []
    };
  },
  created() {
    //获取路由参数 参数=>页码
    const page = this.$route.params.page;
    // console.log(page);

    //钩子函数中获取数据
    this.loadUsersData(page);
    // 获取角色列表
    this.loadRolesData();
  },
  methods: {
    /*
    http 无状态 要携带token 请求头携带token
    */
    async loadUsersData(pagenum = 1, query = "") {
      //请求地址
      const url = "users";
      // 请求参数
      const config = {
        params: {
          // 查询参数
          query,
          pagenum,
          pagesize: 2
        }
      };
      // console.log(res);
      //使用 asyns await 改造axios
      let res = await this.$axios.get(url, config);
      // console.log(res);
      //   保存数据
      this.usersData = res.data.data.users;
      //   保存页数
      this.total = res.data.data.total;
      //   当前页
      this.pagenum = res.data.data.pagenum;
    },
    // loadUsersData(pagenum = 1, query = "") {
    //   axios
    //     .get("http://localhost:8888/api/private/v1/users", {
    //       params: {
    //         query,
    //         pagenum,
    //         pagesize: 2
    //       },
    //       headers: {
    //         Authorization: localStorage.getItem("token")
    //       }
    //     })
    //     .then(res => {
    //       console.log(res);
    //       //   console.log(res.data.data.users);
    //       // 保存数据;
    //       this.usersData = res.data.data.users;
    //       //   保存页数
    //       this.total = res.data.data.total;
    //       //   当前页
    //       this.pagenum = res.data.data.pagenum;
    //     });
    // 分页
    // :current-page="clickCurrentPage"  默认传递参数为页码
    clickCurrentPage(curPage) {
      //   console.log(curPage);
      // 保存分页
      // 点击页码保存到路由参数
      this.$router.push("/users/" + curPage);
      this.loadUsersData(curPage, this.queryText);
    },
    //查询
    startQuery() {
      // console.log(this.queryText);
      this.loadUsersData(1, this.queryText);
    },
    // 添加用户模态框
    isShowAddUsersDialog() {
      this.dialogAddUsersFormVisible = true;
    },
    // 添加用户
    addUser() {
      // 校验正确之后 vaildata
      this.$refs.addUserForm.validate(async (err, data) => {
        if (err === true) {
          const url = "users";
          let res = await this.$axios.post(url, this.addUserForm);
          // console.log(res);
          if (res.data.meta.status === 201) {
            //1、关闭对话框
            this.dialogAddUsersFormVisible = false;
            //2、重新刷新页面
            this.loadUsersData();
            //3、添加用户成功消息
            this.$message({
              message: "添加用户成功",
              type: "success",
              duration: 808
            });
            // 重置表单
            this.$refs.addUserForm.resetFields();
          }
        }
      });
    },
    /*
    closed 关闭对话框之后的回调
    */
    //  重置表单
    resetFieldsAddUsersFrom() {
      this.$refs.addUserForm.resetFields();
    },
    // 删除用户
    async delUser(id) {
      // console.log(id);
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // console.log("点击确定");
        const url = `http://localhost:8888/api/private/v1/users/${id}`;
        let res = await this.$axios.delete(url);
        // console.log(res);
        this.loadUsersData(this.pagenum);
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 800
        });
      } catch (error) {
        // console.log("点击取消");
        this.$message({
          message: "取消操作",
          type: "info",
          duration: 800
        });
      }
    },
    async startChanged(row) {
      // console.log(row);
      //解构赋值 从row对象中回去id state
      const { id, mg_state: mgState } = row;
      //put 格式 axios.put(url,data,config)
      let res = await this.$axios.put(`users/${id}/state/${mgState}`);
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 800
        });
        //刷新当前页
        this.loadUsersData(this.pagenum);
      } else {
        this.$message({
          message: "修改错误",
          duration: 800
        });
        this.loadUsersData(this.pagenum);
      }
    },
    // 添加用户对话框w
    isShowEditUserForm(row) {
      this.dialogEditUserFormVisible = true;
      //使用插槽获取数据
      // console.log(row);
      const { username, email, mobile, id } = row;
      this.EditUserForm.username = username;
      this.EditUserForm.email = email;
      this.EditUserForm.mobile = mobile;
      // 这里并不需要 当编辑用户时需要
      this.EditUserForm.id = id;
    },
    //编辑用户
    async editUser() {
      const { id, email, mobile } = this.EditUserForm;
      let res = await this.$axios.put(`users/${id}`, {
        email,
        mobile
      });
      // console.log(res);
      // 1、刷新页面回到当前页 2、隐藏对话框 3、编辑成功消息
      this.loadUsersData(this.pagenum);
      this.dialogEditUserFormVisible = false;
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 800
      });
    },

    async loadRolesData() {
      let res = await this.$axios.get("roles");
      // console.log(res);
      this.rolesData = res.data.data;
      // console.log(this.rolesData);
    },
    async showAssionDiolg(row) {
      this.dialogAssianRolesFormVisible = true;

      const { id, username } = row;
      // console.log(id, username);

      //更具用户id获取rid
      let res = await this.$axios.get(`users/${id}`);
      // console.log(res);

      //把数据赋值给assionRolesForm
      this.assionRolesForm.id = id;
      this.assionRolesForm.username = username;

      if (res.data.data.rid == 0) {
        this.assionRolesForm.rid = "超级主管(不要改)";
      } else if (res.data.data.rid == -1) {
        this.assionRolesForm.rid = "";
      } else {
        this.assionRolesForm.rid = res.data.data.rid;
      }
    },
    async assionRoles() {
      const { id, rid } = this.assionRolesForm;
      let res = await this.$axios.put(`users/${id}/role`, {
        rid
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        // 1、关闭对话框
        this.dialogAssianRolesFormVisible = false;
        // 2、刷新页面
        this.loadUsersData(this.pagenum);
        this.$message({
          type: "success", //消息提示类型 info普通 success成功 warning(黄色) error(红色)
          message: res.data.meta.msg, //提示消息
          duration: 800 //消息持续时间
        });
      }
    }
  }
};
