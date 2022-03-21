const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['yaml'],
      })
    ],
    configure: {
        output: {
            filename: 'static/js/[name].bundle.js',
        }
    }
  }
}
