export const mutation = {
  SET_FACE_TO_SAVE: "SET_FACE_TO_SAVE",
};

const user = {
  state: {
    faceToSave: null,
  },
  getters: {
    getFaceToSave: (s) => s.faceToSave,
  },
  mutations: {
    [mutation.SET_FACE_TO_SAVE]: (state, face) => (state.faceToSave = face),
  },
  actions: {
    async setFace({ commit }, data) {
      await commit(mutation.SET_FACE_TO_SAVE, data);
    },
  },
};

export default user;
