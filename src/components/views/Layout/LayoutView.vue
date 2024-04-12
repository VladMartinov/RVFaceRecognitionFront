<template>
  <div class="content-wrapper">
    <NavBar @changeState="changeNavState" />
    <div class="content" :class="{ '-open': navState }">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from "./NavBar";
import { ref } from "vue";

export default {
  name: "LayoutView",
  components: { NavBar },
  setup() {
    const navState = ref(false);

    const changeNavState = function (value) {
      navState.value = value;
    };

    return {
      navState,
      changeNavState,
    };
  },
};
</script>

<style lang="scss">
.content-wrapper,
.content {
  height: 100vh;
}

.content {
  margin-left: 250px;

  transition: margin-left 0.1s ease-in;

  &.-open {
    margin-left: 50px;
  }
  //margin-left: auto;
  //width: calc(100% - 250px);
}
</style>
