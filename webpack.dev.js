const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public/js"),
  },
  watch: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // after compile global will defined `process.env` this Object
    new webpack.DefinePlugin({
      BUILD_AT : Date.now().toString(32),
      DEBUG: process.env.NODE_ENV !== 'production',
          'process.env': {
              'NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development"),
              'VARIABLE_NAME': JSON.stringify(process.env.VARIABLE_NAME)
     }
   })
  ],
});
