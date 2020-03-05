/* eslint-disable */
//引入
import Vue from "vue";
import VueRouter from "vue-router";

//引入子组件
import Login from "../components/login/login.vue";

//路由懒加载
// import Home from "../components/home/home.vue";
const Home = () => import("../components/home/home.vue");
// import Users from "../components/users/Users.vue";
const Users = () => import("../components/users/Users.vue");
// import Roles from "../components/roles/Roles.vue";
const Roles = () => import("../components/roles/Roles.vue");
// import Rights from "../components/rights/Rights.vue";
const Rights = () => import("../components/rights/Rights.vue");
// import Categories from "../components/Categories/Categories.vue";
const Categories = () => import("../components/Categories/Categories.vue");
// import Goods from "../components/goods/Goods.vue";
const Goods = () => import("../components/goods/Goods.vue");
// import GoodsAdd from "../components/goods/GoodsAdd.vue";
const GoodsAdd = () => import("../components/goods/GoodsAdd.vue");

//在模块化工程中 Vue.use()
Vue.use(VueRouter);

//实例化router
const router = new VueRouter({
  routes: [
    //重定向
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: Login },
    {
      path: "/home",
      name: "home",
      component: Home,
      children: [
        { path: "/users/:page?", name: "users", component: Users },
        { path: "/roles", name: "roles", component: Roles },
        { path: "/rights", name: "rights", component: Rights },
        {
          path: "/categories/:page?",
          name: "categories",
          component: Categories
        },
        { path: "/goods", name: "goods", component: Goods },
        { path: "/goods-add", name: "goods-add", component: GoodsAdd }
      ]
    }
  ]
});

//全局前置导航守卫 是router里面的一个方法
/*
    to 目标路由对象
    next 下一步
        next() 运行下一步/允许访问
        next(false) 不允许
        next('/login') 跳转login
*/

router.beforeEach((to, from, next) => {
  //1、判断是否是登录页
  if (to.path === "/login") {
    next();
  } else {
    //非登录页
    //2、判断是否登陆过
    const token = localStorage.getItem("token");
    token ? next() : next("/login");
  }
});

//导出
export default router;
