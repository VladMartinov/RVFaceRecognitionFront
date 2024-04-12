<template>
  <div class="recovery">
    <div class="recovery-logo">
      <img src="@/assets/Logo.png" alt="App logo" />
    </div>

    <div class="recovery-info">
      <h1 class="recovery-info__title">{{ getCurrentInfo.title }}</h1>
      <span class="recovery-info__desc">{{ getCurrentInfo.desc }}</span>
    </div>

    <div class="recovery-field__wrapper" v-if="getCurrentFields">
      <div
        class="recovery-field -important"
        v-for="(field, index) in getCurrentFields"
        :key="index"
      >
        <label class="recovery-field__label" :for="field.id">
          {{ field.title }}
        </label>
        <div class="recovery-field__input">
          <BaseInput
            class="-small"
            :class="{ '-error': field.error }"
            :type="field.type"
            :placeholder="field.placeholder"
            :id="field.id"
            :modelValue="field.modelValue"
            @update:modelValue="field.function"
          />
        </div>
        <span
          class="recovery-field__error"
          :title="field.error"
          v-if="field.error"
        >
          {{ field.error }}
        </span>
      </div>
    </div>

    <div class="recovery__redirect">
      <span class="recovery__redirect-link" @click="callRedirect">
        <BaseIcon name="go-back" size="12px" />
        {{ $dictionary("goBack") }}
      </span>
    </div>

    <div class="recovery-submit">
      <BaseButton
        class="-primary -full-width"
        @onClick="getCurrentButton.function"
      >
        {{ getCurrentButton.text }}
      </BaseButton>
    </div>
  </div>
</template>
<script>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "@kyvg/vue3-notification";

import { RecoveryStatusEnum } from "@/utils/enums";

import { useLoginBlock, usePasswordBlock, useViewComponents } from "./index.js";

export default {
  name: "UpdatePasswordView",
  setup() {
    const router = useRouter();
    const { notify } = useNotification();

    const $dictionary = inject("$dictionary");
    const $api = inject("$api");

    const stage = ref(0);

    const loginInfo = useLoginBlock();
    const passwordInfo = usePasswordBlock();
    const viewComponents = useViewComponents(
      router,
      notify,
      $dictionary,
      $api,
      loginInfo,
      passwordInfo,
      stage
    );

    const callRedirect = () => {
      if (stage.value === RecoveryStatusEnum.Login)
        router.push({ name: "login" });
      else stage.value = RecoveryStatusEnum.Login;
    };

    return {
      login: loginInfo.login,
      loginError: loginInfo.loginError,
      updateLogin: loginInfo.updateLogin,

      password: passwordInfo.password,
      confirmPassword: passwordInfo.confirmPassword,

      confirmPasswordError: passwordInfo.confirmPasswordError,
      passwordError: passwordInfo.passwordError,

      updatePassword: passwordInfo.updatePassword,
      updateConfirmPassword: passwordInfo.updateConfirmPassword,

      hidePassword: passwordInfo.hidePassword,

      stage,
      getCurrentInfo: viewComponents.getCurrentInfo,
      getCurrentFields: viewComponents.getCurrentFields,
      getCurrentButton: viewComponents.getCurrentButton,

      callRedirect,
    };
  },
};
</script>
<style lang="scss">
.recovery {
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: fit-content;
  height: 100%;

  &-logo {
    margin-bottom: 20px;

    width: 150px;
    height: 150px;

    //filter: drop-shadow(0 0 75px rgba(100, 0, 0, 0.5));
    animation: $logo-shadow-animation;
  }

  &-info {
    margin-bottom: 28px;

    text-align: center;
    color: $text-color;

    &__title {
      font-size: 24px;
      font-weight: 600;

      margin-bottom: 3px;
    }

    &__desc {
      font-size: 13px;
      font-weight: 300;
    }
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

      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }

    &__error {
      display: block;
      padding-left: 12px;

      font-size: 12px;
      font-weight: 300;
      color: $error-color;

      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &.-important {
      .recovery-field__label::after {
        display: inline-block;
      }
    }

    &.-last {
      margin-bottom: 10px;
    }
  }

  &__redirect {
    margin-bottom: 30px;

    align-self: flex-start;

    color: $text-placeholder-color;

    &-link {
      display: flex;
      align-items: center;

      column-gap: 3px;

      font-size: 12px;
      cursor: pointer;
    }
  }

  &-submit {
    width: 178px;
  }
}
</style>
