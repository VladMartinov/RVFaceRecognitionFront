import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store";

import { UserRoleEnum } from "@/utils/enums";

const _import = (file) => () => import("@/components/views/" + file + ".vue");

const routes = [
  {
    path: "/login",
    name: "login",
    component: _import("Login/LoginView"),
  },
  {
    path: "/refresh-pass",
    name: "refresh-pass",
    component: _import("UpdatePassword/UpdatePasswordView"),
  },
  {
    beforeEnter: (to, from, next) => {
      Promise.all([store.dispatch("fetchCurrentUser")])
        .then(() => {
          next();
        })
        .catch(() => {});
    },
    path: "/",
    name: "Layout",
    component: _import("Layout/LayoutView"),
    redirect: "/cameras",
    children: [
      {
        path: "/cameras",
        name: "cameras",
        component: _import("Layout/pages/CamerasView/CamerasView"),
      },
      {
        path: "/images",
        name: "images",
        component: _import("Layout/pages/ImagesView/ImagesView"),
      },
      {
        path: "/images/:isCreate",
        name: "imagesToSave",
        component: _import("Layout/pages/ImagesView/ImagesView"),
        props: true,
      },
      {
        path: "/users",
        name: "users",
        component: _import("Layout/pages/UsersView/UsersView"),
        meta: {
          accessRole: [UserRoleEnum.Observer, UserRoleEnum.Admin],
        },
      },
      {
        path: "/activity-log",
        name: "activityLog",
        component: _import("Layout/pages/ActivityLogView/ActivityLogView"),
        meta: {
          accessRole: [UserRoleEnum.Observer, UserRoleEnum.Admin],
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    store.getters.currentUserInfo &&
    to.meta.accessRole &&
    !to.meta.accessRole.includes(store.getters.currentUserInfo.userRole)
  )
    return;

  next();
});

export default router;
