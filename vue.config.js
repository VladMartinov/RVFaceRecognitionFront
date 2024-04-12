const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    svgSprite: {
      dir: "./src/assets/icons",
      test: /\.svg$/,
      loaderOptions: {
        extract: false
      }
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_animations.scss";
        `
      }
    }
  },

  chainWebpack: config => {
    config.module
      .rule("svg-sprite")
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader");
  },
});
