<template>
  <div>
    <el-button type="success" plain @click="clickAddClass">添加分类</el-button>
    <template>
      <el-table :data="catData" style="width: 100%">
        <el-table-tree-column
          tree-key="cat_id"
          parent-key="cat_pid"
          class="el-icon-folder-opened"
          level-key="cat_level"
          :indent-key="20"
          prop="cat_name"
          label="分类名称"
          width="220"
        ></el-table-tree-column>
        <el-table-column label="是否有效" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.cat_dalete ? "否" : "是" }}</span>
          </template>
        </el-table-column>cat_level
        <el-table-column label="层级">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_level == 0">一级</span>
            <span v-else-if="scope.row.cat_level == 2">二级</span>
            <span v-else>三级</span>
            <span></span>
            <span></span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      background
      :current-page="pagenum"
      layout="prev, pager, next"
      :total="total"
      :page-size="4"
      @current-change="clickPage"
    ></el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogAddClassFormVisible">
      <el-form :model="addClassForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addClassForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            :options="options"
            clearable
            v-model="addClassForm.cat_pid_arr"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddClassFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
// var ElTreeGrid = require('element-tree-grid');
import Vue from "vue";
import ElTreeGrid from "element-tree-grid";
Vue.component(ElTreeGrid.name, ElTreeGrid);
export default {
  data() {
    return {
      catData: [
        {
          cat_name: "名称",
          cat_deleted: "是否有效",
          cat_level: "层级"
        }
      ],
      pagenum: null,
      total: null,
      // 添加分类数据
      addClassForm: {
        cat_name: "",
        cat_pid_arr: []
      },
      // 对话框数据
      dialogAddClassFormVisible: false,
      // 级联选择器数据
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则"
            }
          ]
        }
      ],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  created() {
    // 获取路由参数
    const page = this.$route.params.page;
    // console.log(page);

    this.loadCatData(page);
    this.loadCatData2();
  },
  methods: {
    // 分页
    async loadCatData(pagenum = 1) {
      let res = await this.$axios.get("categories", {
        params: {
          query: "",
          pagenum,
          pagesize: 4
        }
      });
      console.log(res);
      this.total = res.data.data.total;
      this.catData = res.data.data.result;
      this.pagenum = res.data.data.pagenum + 1;
    },
    // 级联选择器数据
    async loadCatData2() {
      let res = await this.$axios.get("categories", {
        params: {
          type: 2
        }
      });
      // console.log(res);
      this.options = res.data.data;

      // this.pagenum = res.data.data.pagenum;
    },
    //分页
    clickPage(pagenum) {
      //   console.log(e);
      // 保存页码
      this.pagenum = pagenum;
      // 将页码保存到路由参数
      this.$router.push("/categories/" + pagenum);
      this.loadCatData(pagenum);
    },
    // 弹窗
    clickAddClass() {
      this.dialogAddClassFormVisible = true;
    },
    // 添加
    async addClass() {
      const { cat_name, cat_pid_arr } = this.addClassForm;
      let res = await this.$axios.post("categories", {
        cat_name,
        cat_pid: cat_pid_arr[cat_pid_arr.length - 1],
        cat_level: cat_pid_arr.length
      });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.dialogAddClassFormVisible = false;
        this.$message({
          type: "success", //消息提示类型 info普通 success成功 warning(黄色) error(红色)
          message: res.data.meta.msg, //提示消息
          duration: 800 //消息持续时间
        });
        // this.loadCatData(this.pagenum);
      }
    }
  }
};
</script>

<style scoped></style>
