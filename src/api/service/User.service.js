export default (api) => {
  api.user = {
    getCurrentUser() {
      return api.instance.get("/users/current-user");
    },
    getUsers() {
      return api.instance.get("/users/");
    },
    createUser(data) {
      return api.instance.post("/users/", data);
    },
    updateUser(id, data) {
      return api.instance.put(`/users/${id}`, data);
    },
    deleteUser(id) {
      return api.instance.delete(`/users/${id}`);
    },
    updateUserStatus(id, status) {
      return api.instance.put(`/users/${id}/status?status=${status}`);
    },
  };
};
