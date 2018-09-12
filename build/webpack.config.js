const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const compressionPlugin = require('compression-webpack-plugin');

const helper = require('./helper');
const target = helper.target
const isProd = helper.isProd

let webpackConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'cheap-module-source-map',
  entry: helper.getEntry(target),
  output: helper.getOutput(target),
  resolve: {
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    modules: [
      helper.assetsPath('src'),
      helper.assetsPath('node_modules')
    ],
    alias: Object.assign({}, {
      '@': helper.assetsPath('src'),
      'assets': helper.assetsPath('src/assets'),
      'components': helper.assetsPath('src/components'),
      'middlewares': helper.assetsPath('src/middlewares'),
      'models': helper.assetsPath('src/models'),
      'routes': helper.assetsPath('src/routes'),
      'themes': helper.assetsPath('src/themes'),
      'views': helper.assetsPath('src/views'),
      'utils': helper.assetsPath('src/utils'),
      'mocks': helper.assetsPath('src/mocks'),
      'services': helper.assetsPath('src/services'),
      'tableColumns': helper.assetsPath('src/utils/tableColumns')
    })
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      include: [helper.assetsPath('src')],
      exclude: [helper.assetsPath('src/assets/libs')],
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    },
    {
      test: /\.js$/,
      include: [helper.assetsPath('src/assets/libs')],
      use: 'imports-loader?this=>window&define=>false'
    },
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [helper.assetsPath('src')],
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
        helper.cssLoader(),
        helper.postcssLoader(target),
        'sass-loader',
      ]
    },
    {
      test: /\.less$/,
      include: /node_modules|antd\.less/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
        helper.cssLoader(),
        helper.postcssLoader(target),
        helper.lessLoader(target)
      ]
    },
    {
      test: /\.less$/,
      exclude: /node_modules|antd\.less/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
        helper.cssLoader(true),
        helper.postcssLoader(target),
        helper.lessLoader(target)
      ]
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]',
        publicPath: '../'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[hash:7].[ext]',
        outputPath: url => `${helper.isFontFile(url) ? 'fonts' : 'media'}/${url}`,
        publicPath: url => `${helper.isFontFile(url) ? '../' : './'}${url}`
      }
    }]
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    minimize: isProd,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks:{
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /node_modules\/(.*)\.js/,
          chunks: 'initial',
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: false
        }
      }
    }
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
      DEBUG: !isProd
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[name].[hash].css' : '[name].css'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      minify: isProd ? {
        html5: false,
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      } : {},
      filename: `index.html`,
      template: helper.assetsPath(`src/_${target}.html`)
    }),
  ].concat(isProd ? [
    new compressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    })
  ] : [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]),
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
}

helper.isReport && webpackConfig.plugins.push(new BundleAnalyzerPlugin())
module.exports = webpackConfig
