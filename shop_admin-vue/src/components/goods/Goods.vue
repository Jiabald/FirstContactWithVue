<template>
  <div>
    <el-button type="success" plain @click="gotoAddGoods">添加商品</el-button>
    <el-table :data="goodsData" style="width: 100%">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价值"
        width="180"
      ></el-table-column>
      <el-table-column prop="goods_number" label="商品数量"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
  </div>
</template>

<script>
/* eslint-disable */
import moment from "moment";
export default {
  data() {
    return {
      goodsData: [
        {
          gooda_name: "",
          goods_price: "",
          goods_number: "",
          add_time: ""
        }
      ],
      pagenum: null,
      pagesize: null
    };
  },
  created() {
    this.loadGoodsDate();
  },
  methods: {
    async loadGoodsDate(pagenum = 1) {
      let res = await this.$axios.get("goods", {
        params: {
          pagenum: 1,
          pagesize: 5
        }
      });
      //   console.log(res);
      this.goodsData = res.data.data.goods;
    },
    gotoAddGoods() {
      this.$router.push("goods-add");
    }
  },
  filters: {
    dateFilter(res) {
      return moment(res).format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped></style>
