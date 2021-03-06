const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const helper = require('./helper');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
// const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// const path = require('path');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'app': './src/main.ts',
    'styles': "./src/styles.scss"
  },
  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [{
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: ['@ngtools/webpack']
      },
      {
          test:  /.pug$/,
          loaders: [
            'html-loader', {
              loader: 'pug-html-loader',
              options: {
                doctype: 'html'
              }
            }
          ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.(css|scss)$/,
        exclude: [helper.root('src', 'app')],
        use: [ MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          query: {
            modules: false,
            sourceMaps: false,
            minimize: true,
            grid: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
          plugins: () => [
              autoprefixer
          ],
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            data: ``,
            includePaths: [],
            sourceMap: true
          }
        }]
      },
      {
        test: /\.scss$/,
        include: [helper.root('src', 'app')],
        use: [
          {
            loader: 'css-to-string-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              data: ``,
              includePaths: [],
              sourceMap: true
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: helper.root('./'),
      verbose: true,
      dry: false
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ProgressPlugin(),
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /\@angular(\\|\/)core(\\|\/)esm5/,
      helper.root('./app'), // location of your src
      {} // a map of your routes
    ),

    new CopyWebpackPlugin([{
      from: helper.root( 'src/assets/images', '**/*'),
      to: helper.root('dist'),
      flatten: true
    }]),
    new HtmlWebpackPlugin({
      template: 'src/index.pug'
    })
    /** Uncomment code below if you want to you use a server template view and build an index.pug file */
    // new HtmlWebpackPlugin({
    //   filename: 'index.pug',
    //   template: `${path.join(__dirname, '../server/views/index.pug')}`
    // }),
    // new ScriptExtHtmlWebpackPlugin(),
    // new HtmlWebpackPugPlugin()
  ]
};
