import api from "@/api";

export const mutation = {
  SET_LOGS: "SET_LOGS",
};

const log = {
  state: {
    logs: [],
  },
  getters: {
    logsInfo: (s) => s.logs,
  },
  mutations: {
    [mutation.SET_LOGS]: (state, logs) => (state.logs = logs),
  },
  actions: {
    fetchAllLogs({ commit }) {
      return api.log.getLogs().then((response) => {
        commit(mutation.SET_LOGS, response.data);
      });
    },
  },
};

export default log;
