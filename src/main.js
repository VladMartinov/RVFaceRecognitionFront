import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";

import Api from "@/api";
import Dictionary from "@/common/Dictionary";
import guid from "@/utils/guid";
import Registration from "@/utils/register";

import Notifications from "@kyvg/vue3-notification";
import Emit from "@/utils/eventBus";

import "@/scss/main.scss";

const app = createApp(App);

/* Default use */
app.use(store);
app.use(router);

/* Custom use */
app.use(Api);
app.use(Dictionary);
app.use(guid);

app.use(Notifications);
app.use(Emit);

Registration.registerAll(app);

app.mount("#app");
