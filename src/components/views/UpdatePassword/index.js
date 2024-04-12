import { ref, computed } from "vue";

import { RecoveryStatusEnum } from "@/utils/enums";

export const useLoginBlock = () => {
  const login = ref("");
  const loginError = ref(null);

  const updateLogin = (event) => {
    login.value = event;
    loginError.value = null;
  };

  return {
    login,
    loginError,
    updateLogin,
  };
};

export const usePasswordBlock = () => {
  const password = ref("");
  const passwordError = ref(null);

  const updatePassword = (event) => {
    password.value = event;
    passwordError.value = null;
  };

  const confirmPassword = ref("");
  const confirmPasswordError = ref(null);

  const updateConfirmPassword = (event) => {
    confirmPassword.value = event;
    confirmPasswordError.value = null;
  };

  const hidePassword = ref(false);

  return {
    password,
    passwordError,
    updatePassword,

    confirmPassword,
    confirmPasswordError,
    updateConfirmPassword,

    hidePassword,
  };
};

export const useViewComponents = (
  router,
  notify,
  $dictionary,
  $api,
  loginInfo,
  passwordInfo,
  stage
) => {
  const getCurrentInfo = computed(() => {
    return stage.value === RecoveryStatusEnum.Login
      ? {
          title: $dictionary("loginRecoveryTitle"),
          desc: $dictionary("loginRecoveryDesc"),
        }
      : {
          title: $dictionary("passwordRecoveryTitle"),
          desc: $dictionary("passwordRecoveryDesc"),
        };
  });

  const getCurrentFields = computed(() => {
    return stage.value === RecoveryStatusEnum.Login
      ? [
          {
            title: $dictionary("login"),
            type: "text",
            placeholder: "login12345",
            id: "login",
            modelValue: loginInfo.login.value,
            function: loginInfo.updateLogin,
            error: loginInfo.loginError.value,
          },
        ]
      : [
          {
            title: $dictionary("password"),
            type: "password",
            placeholder: "password12345",
            id: "password",
            modelValue: passwordInfo.password.value,
            function: passwordInfo.updatePassword,
            error: passwordInfo.passwordError.value,
          },
          {
            title: $dictionary("confirmPassword"),
            type: "password",
            placeholder: "password12345",
            id: "confirm-password",
            modelValue: passwordInfo.confirmPassword.value,
            function: passwordInfo.updateConfirmPassword,
            error: passwordInfo.confirmPasswordError.value,
          },
        ];
  });

  const getCurrentButton = computed(() => {
    return stage.value === RecoveryStatusEnum.Login
      ? {
          function: () => {
            if (!loginInfo.login.value) {
              loginInfo.loginError.value = $dictionary("loginRecoveryError");
              return;
            }

            $api.authentication
              .checkUser(loginInfo.login.value)
              .then(() => {
                stage.value = RecoveryStatusEnum.Password;
              })
              .catch((response) => {
                if (response.status === 404)
                  loginInfo.loginError.value =
                    $dictionary("loginRecoveryError");

                return;
              });
          },
          text: $dictionary("next"),
        }
      : {
          function: () => {
            var regularExpression =
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,155}$/;

            if (!regularExpression.test(passwordInfo.password.value)) {
              passwordInfo.passwordError.value = $dictionary(
                "passwordRecoveryError"
              );
              return;
            }

            if (
              passwordInfo.password.value !== passwordInfo.confirmPassword.value
            ) {
              passwordInfo.confirmPasswordError.value = $dictionary(
                "confirmPasswordRecoveryError"
              );
              return;
            }

            $api.authentication
              .updatePassword(
                loginInfo.login.value,
                passwordInfo.password.value
              )
              .finally(() => {
                loginInfo.login.value = "";
                passwordInfo.password.value = "";
                passwordInfo.confirmPassword.value = "";

                stage.value = RecoveryStatusEnum.Login;
              })
              .then(() => {
                router.push({ name: "login" });

                notify({
                  title: "Смена пароля",
                  text: "Пароль был успешно обновлён!",
                  type: "success",
                });

                return;
              })
              .catch(() => {
                router.push({ name: "login" });

                notify({
                  title: "Смена пароля",
                  text: "Не удалось сменить пароль! Попробуйде еще раз.",
                  type: "error",
                });

                return;
              });
          },
          text: $dictionary("update"),
        };
  });

  return {
    getCurrentInfo,
    getCurrentFields,
    getCurrentButton,
  };
};
