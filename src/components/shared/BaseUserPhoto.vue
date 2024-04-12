<template>
  <div class="user-image" v-if="userObj.photo && userObj.photo !== null">
    <img :src="'data:image/jpeg;base64,' + userObj.photo" alt="User Image" />
  </div>
  <div class="user-image" v-else>
    <span>{{ userImageText }}</span>
  </div>
</template>
<script>
import { computed, toRef } from "vue";

export default {
  name: "BaseUserPhoto",
  props: {
    user: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  setup(props) {
    const userObj = toRef(props, "user");

    const userImageText = computed(() => {
      const initials = userObj.value.fullName
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase())
        .join("")
        .slice(0, 3);

      return initials;
    });

    return {
      userObj,
      userImageText,
    };
  },
};
</script>
<style lang="scss" scoped>
.user-image {
  margin: 9px 15px 9px 9px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 41px;
  height: 41px;

  border-radius: 50%;
  background-color: #dcdcde;

  color: $text-disabled-color;

  img {
    width: 100%;
    height: 100%;

    border-radius: 50%;
    object-fit: cover;
  }

  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
  }
}
</style>
