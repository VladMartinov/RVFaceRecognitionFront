import axios from "axios";
import store from "@/store";
import _ from "lodash";
import guid from "@/utils/guid";
import router from "@/router";

const requireService = require.context("./service", false, /.service.js$/),
  instance = axios.create({
    baseURL: "https://localhost:7019/api",
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    withCredentials: true,
  }),
  queue = [];

export const intercept = (fn) => fn(instance.interceptors);

const debouncedPreloader = _.debounce(function () {
  store.dispatch("setLoading", false);
}, 700);

intercept(({ request, response }) => {
  request.use((config) => {
    store.dispatch("setLoading", true);

    config.guid = guid.guidFunction().create();

    queue.push = config;

    return config;
  });

  response.use(
    (config) => {
      const { guid } = config;

      if (guid) {
        const index = queue.findIndex((x) => _.isEqual(x.guid, guid));

        ~index && queue.splice(index, 1);
      }

      if (_.isEmpty(queue)) {
        debouncedPreloader();
      }

      return config;
    },
    async (error) => {
      const { guid } = error.response.config.guid;

      let index = queue.findIndex((x) => _.isEqual(x.guid, guid));
      ~index && queue.splice(index, 1);

      if (
        error.response.status === 401 &&
        error.response.config.url !== "/authentication/login"
      ) {
        try {
          const refreshResponse = await instance.post(
            "/authentication/refresh-token"
          );

          if (refreshResponse.status === 200) {
            // Повторяем оригинальный запрос с новым токеном
            return instance(error.config);
          } else {
            // Изменить на соответствующий обработчик ошибки получения нового токена
            debouncedPreloader();
            return Promise.reject("Failed to refresh token");
          }
        } catch (refreshError) {
          // Редирект на страницу логина
          router.push("/login");
          debouncedPreloader();
          return Promise.reject(refreshError);
        }
      } else {
        debouncedPreloader();
        return Promise.reject(error.response);
      }
    }
  );
});

class Api {
  constructor() {
    this.instance = instance;

    // Register local services
    requireService
      .keys()
      .forEach((filename) => requireService(filename).default(this));
  }

  install(app) {
    app.config.globalProperties.$api = this;
    app.provide("$api", this);
  }
}

export default new Api();
