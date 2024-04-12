export default (api) => {
  api.image = {
    getImages() {
      return api.instance.get("/images/");
    },
    createImage(data) {
      return api.instance.post("/images/", data);
    },
    updateImage(id, data) {
      return api.instance.put(`/images/${id}`, data);
    },
    deleteImage(id) {
      return api.instance.delete(`/images/${id}`);
    },
  };
};
