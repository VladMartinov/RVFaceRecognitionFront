import api from "@/api";

export const mutation = {
  SET_IMAGES: "SET_IMAGES",
};

const image = {
  state: {
    images: [],
  },
  getters: {
    imagesInfo: (s) => s.images,
  },
  mutations: {
    [mutation.SET_IMAGES]: (state, images) => (state.images = images),
  },
  actions: {
    fetchAllImages({ commit }) {
      return api.image.getImages().then((response) => {
        commit(mutation.SET_IMAGES, response.data);
      });
    },
  },
};

export default image;
