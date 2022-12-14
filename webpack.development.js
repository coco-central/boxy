const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

const development = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
    port: 8000,
    compress: true,
    open: true,
    hot: true,
    devMiddleware: {
      index: true,
      serverSideRender: true,
      writeToDisk: true,
    },
  },
};

module.exports = merge.merge(common, development);
