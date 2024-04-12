<template>
  <div class="login">
    <div class="login-logo">
      <img src="@/assets/Logo.png" alt="App logo" />
    </div>

    <div class="login-field -important">
      <label class="login-field__label" for="login">
        {{ $dictionary("login") }}
      </label>
      <div class="login-field__input">
        <BaseInput
          class="-small"
          type="text"
          placeholder="login12345"
          id="login"
          :modelValue="login"
          @update:modelValue="updateLogin"
        />
      </div>
      <span class="login-field__error" v-if="loginError">{{ loginError }}</span>
    </div>

    <div class="login-field -important -last">
      <label class="login-field__label" for="password">
        {{ $dictionary("password") }}
      </label>
      <div class="login-field__input">
        <BaseInput
          class="-small"
          :type="hidePassword ? 'password' : 'text'"
          placeholder="password12345"
          id="password"
          :modelValue="password"
          @update:modelValue="updatePassword"
        />

        <BaseIcon
          :name="hidePassword ? 'eye-open' : 'eye-close'"
          size="24px"
          @onClick="hidePassword = !hidePassword"
        />
      </div>
      <span class="login-field__error" v-if="passwordError">
        {{ passwordError }}
      </span>
    </div>

    <div class="login__redirect">
      <router-link to="/refresh-pass">
        {{ $dictionary("forgotPassword") }}
      </router-link>
    </div>

    <div class="login-submit">
      <BaseButton class="-primary -full-width" @onClick="callLoginFunction">
        {{ $dictionary("logIn") }}
      </BaseButton>
    </div>
  </div>
</template>
<script>
import { inject } from "vue";
import { useLoginBlock, usePasswordBlock } from "./index.js";
import { useRouter } from "vue-router";

export default {
  name: "LoginView",
  setup() {
    const $api = inject("$api");
    const router = useRouter();

    const loginInfo = useLoginBlock();
    const passwordInfo = usePasswordBlock();

    const callLoginFunction = function () {
      $api.authentication
        .login(loginInfo.login.value, passwordInfo.password.value)
        .then(() => {
          router.push("/");
        })
        .catch(() => {});
    };

    return {
      login: loginInfo.login,
      loginError: loginInfo.loginError,
      updateLogin: loginInfo.updateLogin,

      password: passwordInfo.password,
      passwordError: passwordInfo.passwordError,
      updatePassword: passwordInfo.updatePassword,

      hidePassword: passwordInfo.hidePassword,

      callLoginFunction,
    };
  },
};
</script>
<style lang="scss">
.login {
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: fit-content;
  height: 100%;

  &-logo {
    margin-bottom: 30px;

    width: 150px;
    height: 150px;

    //filter: drop-shadow(0 0 75px rgba(100, 0, 0, 0.5));
    animation: $logo-shadow-animation;
  }

  &-field {
    margin-bottom: 20px;

    width: 356px;

    text-align: left;

    &__label {
      margin-left: 12px;

      font-size: 14px;

      &::after {
        display: none;
        content: "*";
        margin-left: 5px;
        color: $error-color;
      }
    }

    &__input {
      position: relative;

      & .icon {
        position: absolute;

        top: 4px;
        right: -44px;

        cursor: pointer;
      }
    }

    &.-important {
      .login-field__label::after {
        display: inline-block;
      }
    }

    &.-last {
      margin-bottom: 10px;
    }
  }

  &__redirect {
    margin-bottom: 30px;

    align-self: flex-end;

    font-size: 12px;
  }

  &-submit {
    width: 178px;
  }
}
</style>
