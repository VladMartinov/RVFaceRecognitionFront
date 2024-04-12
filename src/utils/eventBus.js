import mitt from "mitt";

export default {
  install(app) {
    app.config.globalProperties.$emit = mitt();
    app.provide("$emit", mitt());
  },
  mitt,
};
