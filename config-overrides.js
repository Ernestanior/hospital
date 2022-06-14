const { override, fixBabelImports, addWebpackAlias } = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");
const path = require("path");
module.exports = override(
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src"),
  }),
  addLessLoader({
    cssLoaderOptions: {
      sourceMap: true,
      modules: {
        localIdentName: "[hash:base64:8]",
      },
    },
    lessLoaderOptions: {
      lessOptions: {
        strictMath: true,
      },
    },
  }),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css",
  })
);
