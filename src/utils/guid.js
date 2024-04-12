const guidFunction = function () {
  function GUID() {
    let guid;

    do {
      guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    } while (!GUID.register(guid));

    return guid;
  }

  GUID.create = () => GUID();

  GUID.list = [];

  GUID.exists = (guid) => !!~GUID.list.indexOf(guid);

  GUID.register = (guid) => {
    if (GUID.exists(guid)) {
      return false;
    } else {
      GUID.list.push(guid);
      return true;
    }
  };

  return GUID;
};

export default {
  install(app) {
    // Для Options API
    app.config.globalProperties.$GUID = guidFunction();

    // Для Composition API
    app.provide("$GUID", guidFunction());
  },
  guidFunction,
};
