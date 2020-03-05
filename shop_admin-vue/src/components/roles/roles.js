/* eslint-disable */
export default {
  data() {
    return {
      rolesData: [
        {
          roleName: "主管",
          roleDesc: "技术负责人"
        }
      ],
      //   分配权限对话框
      dialogAssignRightsFormVisible: false,
      //   树形控件数据
      Treedata: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        //   负责结构
        children: "children",
        // 负责标题
        label: "authName"
      },
      roleId: 0
    };
  },
  created() {
    this.loadRoles();
    this.loadAllRolesData();
  },
  methods: {
    async loadRoles() {
      let res = await this.$axios.get("roles");
      // console.log(res);
      this.rolesData = res.data.data;
    },
    indexMethod(index) {
      return index;
    },
    // 获取全部权限
    async loadAllRolesData() {
      let res = await this.$axios.get("rights/tree");
      //   console.log(res);
      this.Treedata = res.data.data;
    },
    isShowAssignDialog(row) {
      // 拿到角色id
      this.roleId = row.id;
      //   console.log(this.roleId);

      // 显示对话框
      this.dialogAssignRightsFormVisible = true;

      let ChildNodesId = [];

      // 获取第三层的id
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            // console.log(item3.id);
            ChildNodesId.push(item3.id);
          });
        });
      });

      //   打印 原因异步dom更新  this.$refs获取不到值 使用$nextTick
      //   console.log(this.$refs);
      //this.$refs.tree.setCheckedKeys([101]);
      this.$nextTick(() => {
        // console.log(ChildNodesId);
        this.$refs.tree.setCheckedKeys(ChildNodesId);
      });
    },
    async assignRights() {
      let roleId = this.roleId;
      // 半选中节点id
      let choose = this.$refs.tree.getCheckedKeys();
      let halfChoose = this.$refs.tree.getHalfCheckedNodes();
      // 合并
      let checkAll = choose.concat(halfChoose);
      //   console.log(checkAllId);
      let res = await this.$axios.post(`roles/${roleId}/rights`, {
        rids: checkAll.join(",")
      });
      console.log(res);

      if (res.data.meta.status === 200) {
        //1、刷新页面
        this.loadRoles();
        // 2、隐藏对话框
        this.dialogAssignRightsFormVisible = false;
        //3、提示消息
        this.$message({
          type: "success", //消息提示类型 info普通 success成功 warning(黄色) error(红色)
          message: res.data.meta.msg, //提示消息
          duration: 800 //消息持续时间
        });
      }
    }
  }
};
