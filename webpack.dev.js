const webpackMerge = require("webpack-merge");
const base = require("./webpack.base");

module.exports = function() {
  const merged = webpackMerge.merge(base.config, {
    mode: "development",
    output: {
      filename: "[name]-dev.js",
      library: {
        name: "orda-logger",
        type: "umd"
      },
      globalObject: "this",
      publicPath: "/"
    },
    devtool: "source-map"
  });
  return merged;
};
