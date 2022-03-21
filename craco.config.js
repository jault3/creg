const { whenDev } = require("@craco/craco");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['yaml'],
      })
    ],
    configure: {
        ...whenDev(() => { return {output: {filename: '[name].bundle.js'}} }, {})
    }
  }
}
