/* eslint-disable */
export default {
  data() {
    return {
      activeIndex: 1,
      tabsName: "one",
      addGoodsForm: {
        goods_name: "",
        goods_cat: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introducs: "",
        radio: true,
        pics: []
      },
      //   级联选择器数据
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
      },
      dialogImageUrl: "",
      dialogVisible: false,
      // 添加图片 请求头
      headers: {
        Authorization: localStorage.getItem("token")
      },
      //富文本编辑器
      editorOption: {
        placeholder: "请输入商品描述"
      }
    };
  },
  created() {
    // 获取级联选择器数据
    this.loadCatData();
  },
  methods: {
    clickTabs(tabs) {
      //   console.log(+tabs.index);
      this.activeIndex = +tabs.index + 1;
    },
    clickNext(type) {
      // 数据双向绑定
      this.activeIndex++;
      //   console.log(this.activeIndex);

      this.tabsName = type;
    },
    // 获取级联选择器数据
    async loadCatData() {
      let res = await this.$axios.get("categories", {
        params: {
          type: 3
        }
      });
      //   console.log(res);
      this.options = res.data.data;
    },
    // 上传图片方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadImgSuccess(res) {
      console.log(res.data.tmp_path);
      this.addGoodsForm.pics.push({ pics: res.data.tmp_path });
    },
    async addGoods() {
      const {
        goods_name,
        goods_cat,
        goods_price,
        goods_number,
        goods_weight,
        goods_introducs,
        pics
      } = this.addGoodsForm;

      let res = await this.$axios.post("goods", {
        goods_name,
        goods_cat: goods_cat.join(","),
        goods_price,
        goods_number,
        goods_weight,
        goods_introducs,
        pics
      });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success", //消息提示类型 info普通 success成功 warning(黄色) error(红色)
          message: "添加商品成功", //提示消息
          duration: 1000 //消息持续时间
        });

        this.$router.push("/goods");
      }
    }
  }
};
