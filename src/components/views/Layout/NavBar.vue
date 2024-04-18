<template>
  <div class="navigation" :class="{ '-hidden': isNavHidden }">
    <div class="navigation__close-btn" @click="changeNavState">
      <BaseIcon v-if="!isNavHidden" name="clear" size="20px" />
      <BaseIcon v-else name="nav-burger" width="25px" height="16px" />
    </div>

    <div class="navigation-logo">
      <img src="@/assets/Logo.png" alt="App logo" />
    </div>

    <nav class="navigation-list">
      <router-link to="/cameras">{{ $dictionary("cameras") }}</router-link>
      <router-link to="/images">{{ $dictionary("images") }}</router-link>
      <template v-if="user.userRole !== UserRoleEnum.User">
        <router-link to="/users">{{ $dictionary("users") }}</router-link>
        <router-link to="/activity-log">
          {{ $dictionary("activityLog") }}
        </router-link>
      </template>
    </nav>

    <div class="navigation-user">
      <BaseUserPhoto :user="user" />
      <div class="navigation-user__info">
        <p class="navigation-user__info-name">{{ user.fullName }}</p>
        <span class="navigation-user__info-exit" @click="logout">
          {{ $dictionary("exit") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, inject } from "vue";
import { useStore } from "vuex";

import { UserRoleEnum } from "@/utils/enums";
import { useRouter } from "vue-router";

export default {
  name: "NavBar",
  setup(props, { emit }) {
    const store = useStore();
    const $api = inject("$api");
    const router = useRouter();

    const user = reactive(store.getters.currentUserInfo);

    const logout = function () {
      $api.authentication.logout().then(() => {
        router.push({ name: "login" });
      });
    };

    const isNavHidden = ref(false);

    const changeNavState = function () {
      isNavHidden.value = !isNavHidden.value;

      emit("changeState", isNavHidden.value);
    };

    return {
      user,
      UserRoleEnum,

      logout,

      isNavHidden,
      changeNavState,
    };
  },
};
</script>

<style lang="scss">
.navigation {
  position: fixed;

  padding-top: 30px;

  display: flex;
  flex-direction: column;

  width: 250px;

  top: 0;
  bottom: 0;
  left: 0;

  background-color: #001166;

  transition: left 0.1s ease-in;

  &__close-btn {
    display: none;

    position: absolute;

    right: 10px;
    top: 10px;

    color: #ccd5ff;

    cursor: pointer;

    transition: top 0.1s ease-in;
  }

  &-logo {
    margin: 0 auto 30px;

    width: 100px;
    height: 100px;

    animation: $logo-shadow-animation;
  }

  &-list {
    padding: 0;
    margin-bottom: auto;

    display: flex;
    flex-direction: column;

    & > * {
      padding: 10px;

      font-size: 14px;
      font-weight: 400;
      color: $text-color;
      text-align: left;

      background-color: $nav-color;
      border: 1px solid $primary-hover-color;
      border-right: 0;
      border-left: 0;
      border-bottom: 0;

      transition: background-color 0.1s ease-in;

      &:last-child {
        border-bottom: 1px solid $primary-hover-color;
      }

      &:hover {
        background-color: $nav-hover-color;
      }

      &:active,
      &.router-link-active {
        color: $text-color;
        background-color: $nav-active-color;
      }
    }
  }

  &-user {
    display: flex;
    align-items: center;

    border-top: 1px solid $primary-hover-color;

    &__info {
      flex-grow: 1;

      text-align: left;

      white-space: nowrap;
      overflow: hidden;

      &-name {
        font-size: 18px;
        color: $text-color;

        text-overflow: ellipsis;
        overflow: hidden;
      }

      &-exit {
        font-size: 12px;
        font-weight: 500;
        color: $primary-hover-color;

        cursor: pointer;
      }
    }
  }

  &.-hidden {
    left: -200px;

    .navigation__close-btn {
      right: 12px;
      top: 30px;
    }
  }
}

@media (max-width: 1024px) {
  .navigation__close-btn {
    display: block;
  }
}
</style>
