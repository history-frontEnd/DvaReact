const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

const join = require('path').join
const target = process.env.TARGET ? process.env.TARGET : 'admin'
const isProd = process.env.BABEL_ENV === 'production'
const isReport = process.env.REPORT === 'true'

const assetsPath = (...relativePath) => join(__dirname, '..', ...relativePath)
const isFontFile = url => /\.(woff2?|eot|ttf|otf)(\?.*)?$/.test(url)
const isCssSourceMap = false

const getEntry = (target) => {
  let entry = {
    'polyfill': [assetsPath(`src/_polyfill`)],
    [target]: [assetsPath(`src/${target}-entry`)]
  }
  return Object.keys(entry).reduce((entry, key) => ({
    ...entry,
    [key]: isProd ? entry[`${key}`] : entry[`${key}`].concat(['webpack-hot-middleware/client'])
  }), entry)
}

const getOutput = (target) => {
  return Object.assign({}, {
    path: assetsPath(`dist/${target}`),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  }, isProd ? {
    filename: 'js/[name].[chunkhash:7].js',
    chunkFilename: 'js/[name].chunk.[chunkhash:7].js'
  } : {})
}

const postcssLoader = (target) => {
  const plugins = (loader) => {
    let ps = [
      autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      })
    ]
    if (target === 'web') {
      ps.push(pxtorem({ rootValue: 75, propWhiteList: [] }))
    }
  }
  const options = { plugins }
  return {
    loader: 'postcss-loader',
    options
  }
}

const lessLoader = (target) => {
  let loader = {
    loader: 'less-loader',
    options: {
      modifyVars: {
        "@menu-collapsed-width": "44px",
        "@menu-dark-bg": "rgba(52,63,81,1);"
      },
      sourceMap: !isProd && isCssSourceMap
    }
  }
  return loader
}

const cssLoader = (module = false) => {
  let loader = {
    loader: 'css-loader',
    options: {}
  }
  if (!isProd && isCssSourceMap) loader.options = Object.assign(loader.options, { sourceMap: true, importLoaders: 1 })
  if (module) loader.options = Object.assign(loader.options, { modules: true, localIdentName: '[name]__[local]-[hash:base64:5]' })

  return loader
}

module.exports = {
  target,
  isProd,
  isReport,
  isFontFile,
  assetsPath,
  getEntry,
  getOutput,

  postcssLoader,
  lessLoader,
  cssLoader
}

