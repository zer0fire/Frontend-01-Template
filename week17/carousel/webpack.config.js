module.exports = {
  entry: './src/index.js',
  output: {
      filename: 'bundle.js',
  },
  mode: 'development',
  optimization: {
      minimize: false
  },
  module: {
      rules: [{
          test: /\.js$/,
          use: {
              loader: 'babel-loader',
              options: {
                  presets: ['@babel/preset-env'],
                  plugins: [['@babel/plugin-transform-react-jsx', {pragma: 'createElement'}]]
              }
          }
      }, {
          test: /\.css$/,
          use: {
              // loader: 'css-loader'
              loader: require.resolve('./src/myCssLoader.js')
          }
      }]
  },
  devServer: {
      open: true,
      compress: false,
      contentBase: './src'
  }
};