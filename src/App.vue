<template>
  <div class="container">
    <div class="container-view">
      <router-view />
    </div>
    <PreloaderItem />
    <notifications position="bottom right" classes="custom-notifications" />
  </div>
</template>

<script>
import { inject } from "vue";
import { useRouter } from "vue-router";

import PreloaderItemVue from "@/components/PreloaderItem.vue";

export default {
  name: "App",
  components: {
    PreloaderItem: PreloaderItemVue,
  },
  setup() {
    const $emit = inject("$emit");
    const router = useRouter();

    $emit.on("login-redirect", () => {
      router.push("/login");
    });

    return {};
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Georama", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text-color;

  width: 100%;
  height: 100%;
}

.container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  &-view {
    flex-grow: 1;
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.custom-notifications {
  margin: 0 5px 5px;
  padding: 10px;

  font-size: 14px;
  font-style: bold;
  color: $black;

  background-color: $primary-color;
  border-radius: 16px;

  &.success {
    background: $success-color;
  }

  &.warn {
    background: $warn-color;
  }

  &.error {
    background: $error-color;
  }
}
</style>
