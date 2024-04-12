import { ref } from "vue";

export const useLoginBlock = () => {
  const login = ref("");
  const loginError = ref("");

  const updateLogin = function (event) {
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
  const passwordError = ref("");

  const hidePassword = ref(true);

  const updatePassword = function (event) {
    password.value = event;
    passwordError.value = null;
  };

  return {
    password,
    passwordError,
    updatePassword,

    hidePassword,
  };
};
