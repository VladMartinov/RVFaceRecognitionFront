export default (api) => {
  api.log = {
    getLogs() {
      return api.instance.get("/logs");
    },
  };
};
