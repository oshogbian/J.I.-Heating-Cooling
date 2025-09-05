const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: '../.env' });

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './public',
    historyApiFallback: true,
    port: 3000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.', globOptions: { ignore: ['**/index.html'] } }
      ],
    }),
    new webpack.DefinePlugin({
      'process': JSON.stringify({
        env: {
          REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5050',
          NODE_ENV: process.env.NODE_ENV || 'development',
          REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'https://ljsthabxoycpgizmpavx.supabase.co',
          REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
          REACT_APP_SUPABASE_SERVICE_ROLE_KEY: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || '',
        }
      }),
    }),
  ],
}; 