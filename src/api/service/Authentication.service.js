export default (api) => {
  api.authentication = {
    login(login, password) {
      return api.instance.post("/authentication/login", {
        login: login,
        password: password,
      });
    },
    logout() {
      return api.instance.post("/authentication/logout");
    },

    checkUser(login) {
      return api.instance.post("/authentication/check-user", {
        login: login,
      });
    },
    updatePassword(login, newPassword) {
      return api.instance.put("/authentication/changepassword", {
        login: login,
        password: newPassword,
      });
    },

    refreshToken() {
      return api.instance.post("/authentication/refresh-token");
    },
  };
};
