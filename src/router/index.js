import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import firebase from "@/plugins/firebaseConfig.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      requiresAuth1: true
    }
  },
  {
    path: "/cReg",
    name: "cusRegister",
    component: () => import("../views/cusRegister.vue")
  },
  {
    path: "/cLog",
    name: "cusLogin",
    component: () => import("../views/cusLogin.vue")
  },
  {
    path: "/adminLog",
    name: "adminLog",
    component: () => import("../views/adminLogin.vue")
  },
  {
    path: "/adminPage",
    name: "adminPage",
    component: () => import("../views/adminPage.vue"),
    meta: {
      requiresAuth2: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth1);
  if (requiresAuth && !(await firebase.getCurrentUser())) {
    next("cLog");
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth2);
  if (requiresAuth && !(await firebase.getCurrentUser())) {
    next("adminLog");
  } else {
    next();
  }
});

export default router;
