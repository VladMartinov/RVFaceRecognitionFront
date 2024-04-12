export default (api) => {
  api.cameras = {
    getFace() {
      return api.instance.get("/cameras/face");
    },
  };
};
