import glob from 'glob';
import path from 'path';
import webpack from 'webpack';

export default {
  mode: 'development',

  entry: {
    main: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    ]
  },

  output: {
    publicPath: '/public',
  },

  watchOptions: {
    ignored: '/node_modules',
  },

  infrastructureLogging: {
    level: 'log'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
}