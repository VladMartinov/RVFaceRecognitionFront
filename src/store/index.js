import { createStore } from "vuex";

import app from "./modules/app";
import cameras from "./modules/cameras";
import image from "./modules/image";
import user from "./modules/user";
import log from "./modules/log";

export default createStore({
  modules: {
    app,
    cameras,
    image,
    user,
    log,
  },
});
