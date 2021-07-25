const path = require("path");
const ROOT = path.resolve(__dirname);
const root = path.join.bind(path, ROOT);

exports.root = root;
exports.config = {
  entry: {
    "orda-logger": [root("src/index.ts")]
  },
  output: {
    library: {
      name: "orda-logger",
      type: "umd"
    },
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [root("src"), "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/, root("test")],
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  }
};
