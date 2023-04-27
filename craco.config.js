const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['yaml'],
      })
    ],
    resolve: {
      fallback: {
          buffer: require.resolve('buffer/'),
      },
    },
  }
}
