import api from "@/api";

export const mutation = {
  SET_CURRENT_USER: "SET_CURRENT_USER",
  SET_USERS: "SET_USERS",
};

const user = {
  state: {
    currentUser: null,
    users: [],
  },
  getters: {
    currentUserInfo: (s) => s.currentUser,
    usersInfo: (s) => s.users,
  },
  mutations: {
    [mutation.SET_CURRENT_USER]: (state, user) => (state.currentUser = user),
    [mutation.SET_USERS]: (state, users) => (state.users = users),
  },
  actions: {
    fetchCurrentUser({ commit }) {
      return api.user.getCurrentUser().then((response) => {
        commit(mutation.SET_CURRENT_USER, response.data);
      });
    },
    fetchAllUsers({ commit }) {
      return api.user.getUsers().then((response) => {
        commit(mutation.SET_USERS, response.data);
      });
    },
  },
};

export default user;
