const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: __dirname,
    },
    hot: true,
    port: 3000,
    open: true,
    proxy: [
      {
        context: ['**/*.php'],
        target: 'http://localhost:7654',
        changeOrigin: true,
      },
    ],
  },
});
